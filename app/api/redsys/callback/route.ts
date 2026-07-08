import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redsysService } from "@/modules/payments/redsys.service";
import { emailsService } from "@/modules/notifications/emails.service";

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

    const expectedSignature = redsysService.createSignature(dsMerchantParameters, orderId, true);
    const isSignatureValid = redsysService.signaturesMatch(dsSignature, expectedSignature);

    if (decodedParams.Ds_MerchantCode !== redsysService.merchantCode) {
      console.error(`[Redsys] Merchant Code mismatch: Expected ${redsysService.merchantCode}, Got ${decodedParams.Ds_MerchantCode}`);
      return new NextResponse("OK", { status: 200 });
    }

    if (decodedParams.Ds_Terminal !== redsysService.terminal) {
      console.error(`[Redsys] Terminal mismatch: Expected ${redsysService.terminal}, Got ${decodedParams.Ds_Terminal}`);
      return new NextResponse("OK", { status: 200 });
    }

    if (decodedParams.Ds_TransactionType !== "0") {
      console.error(`[Redsys] Unsupported transaction type: ${decodedParams.Ds_TransactionType}`);
      return new NextResponse("OK", { status: 200 });
    }

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
      include: { booking: { include: { customer: true } } }
    });

    if (!payment) {
      console.error(`[Redsys] Payment with orderId ${orderId} not found`);
      return new NextResponse("OK", { status: 200 });
    }

    if (payment.status !== "PENDING") {
      console.log(`[Redsys] Payment ${orderId} already processed with status ${payment.status}`);
      return new NextResponse("OK", { status: 200 });
    }

    // Invariant validation
    const expectedAmountInCents = Math.round(Number(payment.amount) * 100).toString();
    if (decodedParams.Ds_Amount !== expectedAmountInCents) {
      console.error(`[Redsys] Amount mismatch for ${orderId}: Expected ${expectedAmountInCents}, Got ${decodedParams.Ds_Amount}`);
      return new NextResponse("OK", { status: 200 });
    }

    // Usually 978 for EUR
    const expectedCurrency = "978";
    if (decodedParams.Ds_Currency !== expectedCurrency) {
      console.error(`[Redsys] Currency mismatch for ${orderId}: Got ${decodedParams.Ds_Currency}`);
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

      const newBookingStatus = isSuccess ? "CONFIRMADA" : "FALLIDA";

      await tx.booking.update({
        where: { id: payment.bookingId },
        data: {
          paymentStatus: isSuccess ? "PAID" : "FAILED",
          bookingStatus: newBookingStatus,
        }
      });

      // Audit and History tracking
      await tx.bookingStatusHistory.create({
        data: {
          bookingId: payment.bookingId,
          oldStatus: payment.booking.bookingStatus,
          newStatus: newBookingStatus,
          changedBy: "REDSYS_CALLBACK",
        }
      });

      await tx.auditLog.create({
        data: {
          entityType: "Payment",
          entityId: payment.id,
          action: "REDSYS_CALLBACK",
          newValue: JSON.stringify({
            responseCode: decodedParams.Ds_Response,
            isSuccess,
            dsAmount: decodedParams.Ds_Amount
          })
        }
      });
    });

    // Handle emails asynchronously without blocking the callback response
    if (isSuccess && payment.booking.customer) {
      // El pago se ha procesado → notificar al cliente que está PENDIENTE DE CONFIRMACIÓN
      // y alertar al admin para que confirme manualmente.
      Promise.allSettled([
        emailsService.sendBookingPendingConfirmation(
          payment.booking.customer.email,
          payment.booking.publicCode,
          payment.booking.customer.fullName,
          {
            ...payment.booking,
            customer: payment.booking.customer,
          }
        ),
      ]).catch(err => console.error("[Redsys] Email dispatch error:", err));
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("[Redsys Error]", error);
    return new NextResponse("OK", { status: 200 });
  }
}
