import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRoleApi } from "@/modules/auth/permissions";
import * as xlsx from "xlsx";

export async function POST(req: Request) {
  try {
    await requireRoleApi(["SUPER_ADMIN", "ADMIN"]);

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const listId = formData.get("listId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó un archivo." }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = xlsx.read(Buffer.from(buffer), { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Parse as an array of objects
    const rawData = xlsx.utils.sheet_to_json<any>(sheet, { defval: "" });

    let importedCount = 0;
    let errors = [];

    for (const row of rawData) {
      try {
        const email = (row.email || row.Email || row.EMAIL || row.correo || row.Correo)?.toString().trim().toLowerCase();
        
        if (!email) {
          continue; // Skip rows without email
        }

        const firstName = (row.nombre || row.Nombre || row.firstName || row.FirstName || "")?.toString().trim();
        const lastName = (row.apellidos || row.apellido || row.LastName || row.lastName || "")?.toString().trim();
        const phone = (row.telefono || row.Telefono || row.phone || row.Phone || "")?.toString().trim();
        const country = (row.pais || row.Pais || row.country || row.Country || "")?.toString().trim();

        // Upsert the contact
        const contact = await prisma.marketingContact.upsert({
          where: { normalizedEmail: email },
          update: {
            firstName: firstName || undefined,
            lastName: lastName || undefined,
            phone: phone || undefined,
            country: country || undefined,
            hasConsent: true,
          },
          create: {
            email: email,
            normalizedEmail: email,
            firstName,
            lastName,
            phone,
            country,
            hasConsent: true,
            consentDate: new Date(),
            consentSource: "Excel Import",
          }
        });

        // Add to list if listId is provided
        if (listId) {
          await prisma.marketingContactList.upsert({
            where: {
              contactId_listId: {
                contactId: contact.id,
                listId: listId
              }
            },
            update: {},
            create: {
              contactId: contact.id,
              listId: listId
            }
          });
        }

        importedCount++;
      } catch (err: any) {
        errors.push(err.message);
      }
    }

    return NextResponse.json({
      success: true,
      importedCount,
      errorsCount: errors.length,
      errors: errors.slice(0, 5) // Return up to 5 errors for debugging
    });

  } catch (error: any) {
    console.error("[CONTACT_IMPORT_ERROR]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
