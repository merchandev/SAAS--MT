import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRoleApi } from "@/modules/auth/permissions";
import * as xlsx from "xlsx";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireRoleApi(["SUPER_ADMIN", "ADMIN"]);
    if (!auth.ok) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;

    const list = await prisma.marketingList.findUnique({
      where: { id }
    });

    if (!list) {
      return NextResponse.json({ error: "Lista no encontrada" }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const workbook = xlsx.read(buffer, { type: "buffer" });
    const emails = new Set<string>();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Recorrer todas las hojas
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json<Record<string, any>>(sheet);

      // Extraer correos de cualquier columna que contenga un correo válido
      for (const row of jsonData) {
        for (const key of Object.keys(row)) {
          const value = row[key];
          if (typeof value === "string") {
            const potentialEmails = value.split(/[\s,;]+/);
            for (const pe of potentialEmails) {
              const cleanEmail = pe.trim().toLowerCase();
              if (emailRegex.test(cleanEmail)) {
                emails.add(cleanEmail);
              }
            }
          }
        }
      }
    }

    if (emails.size === 0) {
      return NextResponse.json({ error: "No se encontraron correos válidos en el archivo" }, { status: 400 });
    }

    const uniqueEmails = Array.from(emails);

    let addedCount = 0;

    // Procesar en batches para no saturar
    const batchSize = 100;
    for (let i = 0; i < uniqueEmails.length; i += batchSize) {
      const batch = uniqueEmails.slice(i, i + batchSize);
      
      await prisma.$transaction(async (tx) => {
        for (const email of batch) {
          // Asegurar que existe en MarketingContact
          const contact = await tx.marketingContact.upsert({
            where: { email },
            update: {},
            create: {
              email,
              normalizedEmail: email,
              hasConsent: true,
              consentSource: "EXCEL_IMPORT",
              consentDate: new Date()
            }
          });

          // Conectar a la lista
          await tx.marketingContactList.upsert({
            where: {
              contactId_listId: {
                contactId: contact.id,
                listId: id
              }
            },
            update: {},
            create: {
              contactId: contact.id,
              listId: id
            }
          });
          addedCount++;
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Se importaron ${addedCount} correos exitosamente.`,
      count: addedCount
    });

  } catch (error: any) {
    console.error("[EXCEL_IMPORT_ERROR]", error);
    return NextResponse.json({ error: error.message || "Error al procesar el archivo" }, { status: 500 });
  }
}
