import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redsysService } from "@/modules/payments/redsys.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const dsSignatureVersion = formData.get("Ds_SignatureVersion") as string | null;
    const dsMerchantParameters = formData.get("Ds_MerchantParameters") as string | null;
    const dsSignature = formData.get("Ds_Signature") as string | null;

    if (!dsMerchantParameters || !dsSignature || !dsSignatureVersion) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    if (dsSignatureVersion !== redsysService.signatureVersion) {
      return NextResponse.json({ error: "Unsupported signature version" }, { status: 400 });
    }

    const decodedParams = redsysService.decodeResponse(dsMerchantParameters);
    const orderId = decodedParams.Ds_Order;
    const responseCode = parseInt(decodedParams.Ds_Response, 10);

    if (!orderId || Number.isNaN(responseCode)) {
      return NextResponse.json({ error: "Invalid Redsys parameters" }, { status: 400 });
    }

    const expectedSignature = redsysService.createSignature(dsMerchantParameters, orderId);
    const isSignatureValid = redsysService.signaturesMatch(dsSignature, expectedSignature);

    await prisma.redsysLog.create({
      data: {
        orderId,
        transactionType: "NOTIFICATION",
        rawPayload: dsMerchantParameters,
        responseCode: decodedParams.Ds_Response,
        isSignatureValid,
      }
    });

    if (!isSignatureValid) {
      console.error("[Redsys] Invalid signature received");
      return new NextResponse("OK", { status: 200 });
    }

    const payment = await prisma.payment.findUnique({
      where: { providerOrderId: orderId },
      include: { booking: true }
    });

    if (!payment) {
      console.error(`[Redsys] Payment with orderId ${orderId} not found`);
      return new NextResponse("OK", { status: 200 });
    }

    if (payment.status !== "PENDING") {
      console.log(`[Redsys] Payment ${orderId} already processed with status ${payment.status}`);
      return new NextResponse("OK", { status: 200 });
    }

    const isSuccess = responseCode >= 0 && responseCode <= 99;

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: isSuccess ? "PAID" : "FAILED",
          responseCode: decodedParams.Ds_Response,
          signatureValid: true,
          paidAt: isSuccess ? new Date() : null,
        }
      });

      if (isSuccess) {
        await tx.booking.update({
          where: { id: payment.bookingId },
          data: {
            paymentStatus: "PAID",
            bookingStatus: "CONFIRMADA",
          }
        });
      }
    });

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("[Redsys Error]", error);
    return new NextResponse("OK", { status: 200 });
  }
}
