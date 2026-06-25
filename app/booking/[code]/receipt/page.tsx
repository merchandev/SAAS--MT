import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function ReceiptPage({ params }: { params: Promise<{ code: string }> }) {
  const code = (await params).code;
  
  const booking = await prisma.booking.findUnique({
    where: { publicCode: code },
    include: {
      customer: true,
      vehicle: true,
    }
  });

  if (!booking) {
    return notFound();
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
            <div className="h-10 w-10 bg-gradient-to-br from-[#D4AF37] to-[#AA8B2C] rounded-sm flex items-center justify-center text-white font-serif font-bold text-xl shadow-md ml-auto mb-2">
              MT
            </div>
            <p className="font-bold text-gray-800">MeTransfers VIP</p>
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

        <div className="mt-12 text-center print:hidden">
          <button onClick={() => typeof window !== 'undefined' && window.print()} className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-black transition-colors font-medium shadow-md">
            Imprimir Recibo
          </button>
        </div>
      </div>
    </div>
  );
}
