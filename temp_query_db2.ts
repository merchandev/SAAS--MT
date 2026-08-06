import { PrismaClient } from './node_modules/@prisma/client/index.js';
import * as fs from 'fs';
import * as path from 'path';

const envContent = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
const match = envContent.match(/DATABASE_URL="([^"]+)"/);
let dbUrl = match ? match[1] : '';
if (!dbUrl) {
    const match2 = envContent.match(/DATABASE_URL=([^\n]+)/);
    dbUrl = match2 ? match2[1].trim() : '';
}

console.log("Found DB URL:", dbUrl.replace(/:[^:@]+@/, ':***@'));

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
});

async function main() {
  const emailId = 'c393edf9-e3ac-49ca-8535-df4befe738a2'; // The one from their logs
  
  const emailInfo = await prisma.outboundEmail.findUnique({
      where: { id: emailId },
      select: { campaignId: true, status: true, toEmail: true }
  });
  console.log("Email info:", emailInfo);

  if (emailInfo?.campaignId) {
      const stats = await prisma.campaignRecipient.groupBy({
          by: ['status'],
          where: { campaignId: emailInfo.campaignId },
          _count: { id: true }
      });
      console.log("Stats for campaign", emailInfo.campaignId, ":", stats);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
