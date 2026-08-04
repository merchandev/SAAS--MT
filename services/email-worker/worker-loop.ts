import { claimEmails, releaseEmail } from "../../lib/email/claim";
import { submitToMta } from "../../lib/email/transport";
import { emailConfig } from "../../lib/email/config";
import { prisma } from "../../lib/prisma";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Per-domain reputation and rate limiter
class DomainRateLimiter {
  private domainLastSend: Record<string, number> = {};
  
  // Basic rates in milliseconds per email. 
  // In a real warmup scenario, these would increase over time and be stored in DB (EmailDomainState).
  private getDomainDelayMs(domain: string): number {
    const d = domain.toLowerCase();
    
    // Strict limits for major providers during warmup
    if (d.includes("gmail.com") || d.includes("googlemail.com")) {
      return 1000; // max 1 per second
    }
    if (d.includes("hotmail.") || d.includes("outlook.") || d.includes("live.")) {
      return 2000; // max 1 per 2 seconds
    }
    if (d.includes("yahoo.") || d.includes("ymail.")) {
      return 1500;
    }
    
    // Default for others
    return 500;
  }

  async enforce(emailAddress: string) {
    const parts = emailAddress.split("@");
    if (parts.length !== 2) return;
    const domain = parts[1].toLowerCase();

    // Global Hostinger Enforcement
    if (emailConfig.mode === "hostinger_vps") {
      const msPerEmailGlobal = 60000 / emailConfig.limits.globalRatePerMinute;
      const now = Date.now();
      const lastGlobal = this.domainLastSend["__GLOBAL__"] || 0;
      const timeSinceLastGlobal = now - lastGlobal;
      
      if (timeSinceLastGlobal < msPerEmailGlobal) {
        await delay(msPerEmailGlobal - timeSinceLastGlobal);
      }
      this.domainLastSend["__GLOBAL__"] = Date.now();
      return;
    }

    // Unrestricted / Domain Specific Enforcement
    const msPerEmail = this.getDomainDelayMs(domain);
    const now = Date.now();
    const lastSend = this.domainLastSend[domain] || 0;
    const timeSinceLastSend = now - lastSend;
    
    if (timeSinceLastSend < msPerEmail) {
      await delay(msPerEmail - timeSinceLastSend);
    }
    
    this.domainLastSend[domain] = Date.now();
  }
}

const rateLimiter = new DomainRateLimiter();

export async function runWorker() {
  let isRunning = true;

  process.on("SIGINT", () => { isRunning = false; });
  process.on("SIGTERM", () => { isRunning = false; });

  while (isRunning) {
    try {
      const emails = await claimEmails(emailConfig.worker.batchSize);

      if (emails.length === 0) {
        await delay(emailConfig.worker.pollMs);
        continue;
      }

      for (const email of emails) {
        if (!isRunning) break;

        await rateLimiter.enforce(email.toEmail);

        console.log(`[WORKER] Procesando email ${email.id} (To: ${email.toEmail})`);
        const result = await submitToMta(email);

        if (result.accepted) {
           console.log(`[WORKER] Email aceptado por MTA: ${result.messageId}`);
           await releaseEmail(email.id, "ACCEPTED", undefined, result.response);
           
           if (email.campaignRecipientId) {
             await prisma.campaignRecipient.update({
               where: { id: email.campaignRecipientId },
               data: { status: "ACCEPTED", acceptedAt: new Date() }
             });
           }
        } else {
           console.error(`[WORKER] Error al enviar email ${email.id}:`, result.error);
           
           if (email.attempts >= email.maxAttempts) {
              await releaseEmail(email.id, "FAILED", result.error?.message);
              if (email.campaignRecipientId) {
                await prisma.campaignRecipient.update({
                  where: { id: email.campaignRecipientId },
                  data: { status: "FAILED", lastError: result.error?.message }
                });
              }
           } else {
              const retrySeconds = email.attempts * 5 * 60; 
              await releaseEmail(email.id, "DEFERRED", result.error?.message, undefined, retrySeconds);
           }
        }
      }
    } catch (error) {
      console.error("[WORKER] Error fatal en el bucle del worker:", error);
      await delay(5000);
    }
  }

  console.log("Email worker stopped cleanly.");
}
