const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const appDir = path.join(__dirname, '../app');
const localeDir = path.join(appDir, '[locale]');

// Create [locale] directory
if (!fs.existsSync(localeDir)) {
  fs.mkdirSync(localeDir);
}

// Folders to move to [locale]
const publicFolders = [
  'aviso-legal', 'blog', 'booking', 'coche-con-chofer-barcelona', 'contacto', 
  'cookies', 'faqs', 'politica-de-privacidad', 'preguntas-frecuentes', 'rutas', 
  'terminos-y-condiciones', 'tours', 'tours-privados', 'tours-privados-barcelona', 
  'transfer-aeropuerto-barcelona', 'traslados-corporativos-barcelona', 
  'traslados-privados-barcelona', 'traslados-puerto-barcelona'
];

// Move folders
publicFolders.forEach(folder => {
  const src = path.join(appDir, folder);
  const dest = path.join(localeDir, folder);
  if (fs.existsSync(src)) {
    console.log(`Moving ${folder} to [locale]...`);
    fs.renameSync(src, dest);
  }
});

// Move page.tsx
const pageSrc = path.join(appDir, 'page.tsx');
const pageDest = path.join(localeDir, 'page.tsx');
if (fs.existsSync(pageSrc)) {
  fs.renameSync(pageSrc, pageDest);
}

console.log("Move completed.");
