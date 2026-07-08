import fs from 'fs';
import path from 'path';

const dir = 'c:/Users/merch/OneDrive/Escritorio/mt220626/PROYECTO METRANSFERS/proyecto-migra/components/emails';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filepath = path.join(dir, file);
  let content = fs.readFileSync(filepath, 'utf8');

  // Ensure Img is imported
  if (!content.includes('Img,') && !content.includes(' Img }')) {
    if (content.includes('Link, Row, Column,')) {
      content = content.replace('Link, Row, Column,', 'Link, Img, Row, Column,');
    } else if (content.includes('Link,')) {
      content = content.replace('Link,', 'Link, Img,');
    }
  }

  // Replace header text with Img
  content = content.replace(
    /<Text style=\{brandName\}>TRANSFERS IN BARCELONA<\/Text>/g,
    `<Img\n            src="https://transfersinbarcelona.com/images/MeTransfers-exp.png"\n            width="176"\n            height="41"\n            alt="Transfers in Barcelona"\n            style={logo}\n          />`
  );

  // Replace brandName style with logo style
  content = content.replace(
    /const brandName = \{[^}]+\};/g,
    `const logo = { margin: "0 auto", display: "block" as const };`
  );

  fs.writeFileSync(filepath, content);
  console.log(`Updated ${file}`);
}
