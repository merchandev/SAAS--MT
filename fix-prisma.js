const fs = require('fs');
const path = require('path');

const files = [
  'app/api/redsys/callback/route.ts',
  'app/booking/[code]/payment/page.tsx',
  'modules/auth/auth.actions.ts',
  'modules/b2b/b2b.actions.ts',
  'modules/b2b/b2b.queries.ts',
  'modules/bookings/bookings.actions.ts',
  'modules/bookings/bookings.queries.ts',
  'modules/pricing/pricing.service.ts',
  'modules/vehicles/vehicles.queries.ts'
];

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(/import\s*\{\s*PrismaClient\s*\}\s*from\s*['"]@prisma\/client['"];\s*/g, 'import { prisma } from "@/lib/prisma";\n');
    content = content.replace(/const\s*prisma\s*=\s*new\s*PrismaClient\(\);\s*/g, '');
    fs.writeFileSync(fullPath, content);
    console.log('Fixed', file);
  } else {
    console.log('Not found', file);
  }
});
