import { prisma } from "@/lib/prisma";

export const invoicesService = {
  /**
   * Genera un número de factura secuencial (ej. F-2026-0001)
   */
  async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `F-${year}-`;
    
    // Obtener la última factura de este año
    const lastInvoice = await prisma.invoice.findFirst({
      where: {
        invoiceNumber: {
          startsWith: prefix
        }
      },
      orderBy: {
        invoiceNumber: "desc"
      }
    });

    let nextNumber = 10000;
    if (lastInvoice) {
      const parts = lastInvoice.invoiceNumber.split('-');
      if (parts.length === 3) {
        const parsed = parseInt(parts[2], 10);
        nextNumber = isNaN(parsed) ? 10000 : parsed + 1;
      }
    }

    return `${prefix}${nextNumber.toString().padStart(4, "0")}`;
  },

  /**
   * Obtiene o crea la factura para una reserva
   */
  async getOrCreateInvoiceForBooking(bookingId: string) {
    // 1. Verificar si ya existe
    const existingInvoice = await prisma.invoice.findUnique({
      where: { bookingId },
      include: {
        customer: true,
        booking: {
          include: {
            vehicle: true
          }
        }
      }
    });

    if (existingInvoice) {
      return existingInvoice;
    }

    // 2. Si no existe, crearla atómicamente
    return await prisma.$transaction(async (tx) => {
      // Re-verificar dentro de la transacción por concurrencia
      const concurrentCheck = await tx.invoice.findUnique({
        where: { bookingId },
        include: {
          customer: true,
          booking: {
            include: {
              vehicle: true
            }
          }
        }
      });
      
      if (concurrentCheck) return concurrentCheck;

      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: { customer: true, vehicle: true }
      });

      if (!booking) {
        throw new Error("Reserva no encontrada");
      }

      // En Prisma transactions no podemos llamar a métodos de instancia que no usan tx si dependen de Prisma global,
      // pero getOrCreateInvoiceForBooking es simple: findFirst. Para evitar issues lo resolvemos sin the `this.generateInvoiceNumber`
      // y hacemos la consulta dentro de tx.
      
      const year = new Date().getFullYear();
      const prefix = `F-${year}-`;
      const lastInvoice = await tx.invoice.findFirst({
        where: { invoiceNumber: { startsWith: prefix } },
        orderBy: { invoiceNumber: "desc" }
      });
      let nextNumber = 10000;
      if (lastInvoice) {
        const parts = lastInvoice.invoiceNumber.split('-');
        if (parts.length === 3) {
          const parsed = parseInt(parts[2], 10);
          nextNumber = isNaN(parsed) ? 10000 : parsed + 1;
        }
      }
      const invoiceNumber = `${prefix}${nextNumber.toString().padStart(4, "0")}`;
      
      // Asumiendo que el finalPrice ya incluye el 21% de IVA
      const totalAmount = Number(booking.finalPrice);
      const subtotal = totalAmount / 1.21;
      const taxAmount = totalAmount - subtotal;

      const newInvoice = await tx.invoice.create({
        data: {
          invoiceNumber,
          bookingId: booking.id,
          customerId: booking.customerId,
          subtotal: subtotal,
          taxAmount: taxAmount,
          totalAmount: totalAmount,
          currency: booking.currency,
          issuedAt: new Date(),
        },
        include: {
          customer: true,
          booking: {
            include: {
              vehicle: true
            }
          }
        }
      });

      return newInvoice;
    });
  }
};
