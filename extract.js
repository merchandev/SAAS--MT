const fs = require('fs');
const path = require('path');

const tables = [
  'MarketingContact', 'MarketingList', 'MarketingContactList', 'MarketingTag', 
  'MarketingContactTag', 'MarketingSegment', 'EmailTemplate', 'CampaignMetricDaily', 
  'CampaignMetricHourly', 'DomainProviderMetric', 'AudienceMetricDaily', 'LinkMetric', 
  'DeliverabilityAlert', 'MtaNode', 'MtaProviderState'
];

const lines = fs.readFileSync('full_schema.sql', 'utf16le').split('\n');

const out = [];
let in_table = false;
let in_index = false;
let in_fk = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i] + '\n';
  
  if (line.startsWith('CREATE TABLE')) {
    const tableName = line.split('"')[1];
    if (tables.includes(tableName)) {
      in_table = true;
      out.push(line);
    } else {
      in_table = false;
    }
  } else if (line.startsWith('CREATE UNIQUE INDEX') || line.startsWith('CREATE INDEX')) {
    const tableName = line.split('"')[3];
    if (tables.includes(tableName)) {
      in_index = true;
      out.push(line);
    } else {
      in_index = false;
    }
  } else if (line.startsWith('ALTER TABLE')) {
    const tableName = line.split('"')[1];
    if (tables.includes(tableName)) {
      in_fk = true;
      out.push(line);
    } else {
      in_fk = false;
    }
  } else {
    if (in_table || in_index || in_fk) {
      out.push(line);
      const trimmed = line.trim();
      if (trimmed === ');' || trimmed === ';') {
        in_table = false;
        in_index = false;
        in_fk = false;
      }
    }
  }
}

const dir = path.join('prisma', 'migrations', '20260804180000_init_marketing');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}
fs.writeFileSync(path.join(dir, 'migration.sql'), out.join(''), 'utf8');
