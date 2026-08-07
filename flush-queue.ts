import { prisma } from './lib/prisma';

async function flushQueue() {
  console.log("Reiniciando fechas de envío para correos encolados...");
  
  // Update all QUEUED emails to have availableAt = NOW()
  const result = await prisma.$executeRaw`
    UPDATE "OutboundEmail"
    SET "availableAt" = NOW()
    WHERE "status" = 'QUEUED' AND "availableAt" > NOW();
  `;
  
  console.log(`Se actualizaron ${result} correos que estaban atascados en el futuro.`);
}

flushQueue()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
