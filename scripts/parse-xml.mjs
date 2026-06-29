import fs from 'fs';
import path from 'path';
import xml2js from 'xml2js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const XML_PATH = "C:\\Users\\merch\\OneDrive\\Escritorio\\mt220626\\PROYECTO METRANSFERS\\BLOGS\\metransfers-optimizado-largo-fechas.xml";
const OUTPUT_DIR = path.join(__dirname, '..', 'data');
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'posts.json');

async function parseXml() {
  console.log(`Leyendo XML desde: ${XML_PATH}`);
  const xmlContent = fs.readFileSync(XML_PATH, 'utf-8');
  
  console.log('Parseando XML a JSON...');
  const parser = new xml2js.Parser({ explicitArray: false });
  const result = await parser.parseStringPromise(xmlContent);

  const channel = result.rss.channel;
  let items = channel.item;
  
  if (!Array.isArray(items)) {
    items = [items];
  }
  
  console.log(`Se encontraron ${items.length} items en total. Filtrando posts...`);

  const posts = items
    .filter(item => {
      const postType = item['wp:post_type'];
      const status = item['wp:status'];
      return postType === 'post' && status === 'publish';
    })
    .map(item => {
      // Extraer datos relevantes
      return {
        title: item.title,
        slug: item['wp:post_name'],
        pubDate: item.pubDate,
        content: item['content:encoded'],
        excerpt: item['excerpt:encoded'] || '',
        category: getCategory(item.category),
      };
    });

  console.log(`Se exportarán ${posts.length} posts publicados.`);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(posts, null, 2), 'utf-8');
  console.log(`Posts exportados exitosamente a ${OUTPUT_PATH}`);
}

function getCategory(categoryData) {
  if (!categoryData) return "General";
  
  // categoryData puede ser un string o un array de strings/objetos
  if (Array.isArray(categoryData)) {
    // Buscar la que no es un array y tiene nicename
    const cat = categoryData.find(c => typeof c === 'object' && c['$'] && c['$']['domain'] === 'category');
    if (cat && cat['_']) return cat['_'];
    // Si no hay domain category, tomar la primera
    if (typeof categoryData[0] === 'string') return categoryData[0];
    if (categoryData[0]['_']) return categoryData[0]['_'];
  } else if (typeof categoryData === 'object') {
    if (categoryData['_']) return categoryData['_'];
  } else if (typeof categoryData === 'string') {
    return categoryData;
  }
  
  return "General";
}

parseXml().catch(console.error);
