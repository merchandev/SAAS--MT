import { simpleParser } from "mailparser";
import { prisma } from "@/lib/prisma";

export async function parseMailEvent(rawEmlPath: string, rawEmlContent: Buffer) {
  try {
    const parsed = await simpleParser(rawEmlContent);
    const isDsn = parsed.attachments?.some(a => a.contentType === "message/delivery-status") || false;

    if (!isDsn) {
      console.warn(`[dsn-parser] Not a DSN email: ${rawEmlPath}`);
      return;
    }

    // Extraemos el Attachment de delivery-status
    const dsnAttachment = parsed.attachments.find(a => a.contentType === "message/delivery-status");
    if (!dsnAttachment) return;

    const dsnContent = dsnAttachment.content.toString("utf-8");
    const blocks = dsnContent.split(/\r?\n\r?\n/);
    
    // El primer bloque suele ser per-message (Original-Envelope-Id, etc)
    // Los siguientes son per-recipient
    for (let i = 1; i < blocks.length; i++) {
      const block = blocks[i];
      if (!block.trim()) continue;

      const actionMatch = block.match(/^Action:\s*(.+)$/im);
      const statusMatch = block.match(/^Status:\s*(.+)$/im);
      const diagnosticMatch = block.match(/^Diagnostic-Code:\s*([\s\S]+)$/im);
      
      const action = actionMatch ? actionMatch[1].trim() : null; // "failed", "delayed", "delivered"
      const status = statusMatch ? statusMatch[1].trim() : null; // Ej: "5.1.1"
      const diagnostic = diagnosticMatch ? diagnosticMatch[1].trim() : null;
      
      // Buscar el X-Email-ID original o el Message-ID.
      // A veces Postfix lo devuelve en el cuerpo del DSN, o en los headers del original.
      const originalHeadersAttachment = parsed.attachments.find(a => a.contentType === "message/rfc822-headers" || a.contentType === "message/rfc822" || a.contentType === "text/rfc822-headers");
      
      let emailId = null;
      if (originalHeadersAttachment) {
        const origContent = originalHeadersAttachment.content.toString("utf-8");
        const idMatch = origContent.match(/^X-Email-ID:\s*(.+)$/im);
        if (idMatch) {
          emailId = idMatch[1].trim();
        }
      }

      if (emailId && action) {
        let type: "BOUNCED" | "DEFERRED" | "DELIVERED" = "BOUNCED";
        if (action.toLowerCase() === "delayed") type = "DEFERRED";
        if (action.toLowerCase() === "delivered") type = "DELIVERED";

        await prisma.emailEvent.create({
          data: {
            outboundEmailId: emailId,
            type: type,
            action: action,
            enhancedCode: status,
            diagnostic: diagnostic,
          }
        });

        if (type === "BOUNCED") {
          await prisma.outboundEmail.update({
            where: { id: emailId },
            data: { status: "BOUNCED", bouncedAt: new Date(), lastEnhancedCode: status, lastError: diagnostic }
          });
        }
      }
    }

  } catch (error) {
    console.error("[dsn-parser] Error parsing mail event", error);
  }
}
