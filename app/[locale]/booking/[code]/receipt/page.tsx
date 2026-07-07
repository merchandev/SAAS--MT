import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { InvoiceDownloadButton } from "@/components/pdf/InvoiceDownloadButton";
import { authService } from "@/modules/auth/auth.service";
import { verifyReceiptAccessToken } from "@/modules/bookings/receipt-access";
import { PrintReceiptButton } from "./PrintReceiptButton";

export default async function ReceiptPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const code = (await params).code;
  const { token: tokenParam } = await searchParams;
  const receiptToken = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;
  
  const booking = await prisma.booking.findFirst({
    where: { publicCode: code, deletedAt: null },
    include: {
      customer: true,
      vehicle: true,
    }
  });

  if (!booking) {
    return notFound();
  }

  const [hasReceiptAccess, session] = await Promise.all([
    verifyReceiptAccessToken(receiptToken, booking),
    authService.getSession(),
  ]);
  const isAdminSession = Boolean(session && ["SUPER_ADMIN", "ADMIN", "OPERATOR"].includes(session.role));
  const canViewSensitiveData = hasReceiptAccess || isAdminSession;

  if (!canViewSensitiveData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-10">
          <div className="flex justify-between items-start border-b pb-6 mb-6">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">RECIBO PROTEGIDO</h1>
              <p className="text-gray-500 mt-1">Ref: {booking.publicCode}</p>
            </div>
            <div className="text-right">
              <img src="/logo.png" alt="Transfers in Barcelona" className="h-10 w-auto object-contain ml-auto mb-2" />
              <p className="font-bold text-gray-800">Transfers in Barcelona</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Estado de la reserva:</p>
              <p className="font-bold uppercase tracking-wider text-gray-900">{booking.bookingStatus}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estado del pago:</p>
              <p className={`font-bold uppercase tracking-wider ${
                booking.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {booking.paymentStatus}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Total</p>
              <p className="text-4xl font-bold text-[#D4AF37]">{booking.currency} {Number(booking.finalPrice).toFixed(2)}</p>
            </div>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Para ver datos personales, itinerario completo o factura necesitas el enlace seguro enviado al crear o confirmar la reserva.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-10 print:shadow-none print:p-0">
        <div className="flex justify-between items-start border-b pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">RECIBO DE TRASLADO</h1>
            <p className="text-gray-500 mt-1">Ref: {booking.publicCode}</p>
          </div>
          <div className="text-right">
            <img src="/logo.png" alt="Transfers in Barcelona" className="h-10 w-auto object-contain ml-auto mb-2" />
            <p className="font-bold text-gray-800">Transfers in Barcelona</p>
            <p className="text-sm text-gray-500">Barcelona, España</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Datos del Cliente</h3>
            <p className="font-bold text-gray-800">{booking.customer.fullName}</p>
            <p className="text-gray-600">{booking.customer.email}</p>
            <p className="text-gray-600">{booking.customer.phone}</p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Detalles del Servicio</h3>
            <p className="text-gray-600"><span className="font-bold text-gray-800">Fecha:</span> {new Date(booking.serviceDate).toLocaleDateString()}</p>
            <p className="text-gray-600"><span className="font-bold text-gray-800">Hora:</span> {booking.serviceTime}</p>
            <p className="text-gray-600"><span className="font-bold text-gray-800">Vehículo:</span> {booking.vehicle.name}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-100">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Itinerario</h3>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Origen</p>
              <p className="font-medium text-gray-800">{booking.originAddress}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Destino</p>
              <p className="font-medium text-gray-800">{booking.destinationAddress}</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-6 flex justify-between items-end">
          <div>
            <p className="text-sm text-gray-500">Estado del pago:</p>
            <p className={`font-bold uppercase tracking-wider ${
              booking.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {booking.paymentStatus}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Total Pagado</p>
            <p className="text-4xl font-bold text-[#D4AF37]">{booking.currency} {Number(booking.finalPrice).toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-12 text-center print:hidden flex justify-center gap-4">
          <PrintReceiptButton />
          
          {booking.paymentStatus === 'PAID' && (
            <InvoiceDownloadButton
              bookingId={booking.id}
              receiptToken={hasReceiptAccess ? receiptToken : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
}
