tables = ['MarketingContact', 'MarketingList', 'MarketingContactList', 'MarketingTag', 'MarketingContactTag', 'MarketingSegment', 'EmailTemplate', 'CampaignMetricDaily', 'CampaignMetricHourly', 'DomainProviderMetric', 'AudienceMetricDaily', 'LinkMetric', 'DeliverabilityAlert', 'MtaNode', 'MtaProviderState']
with open('full_schema.sql', 'r', encoding='utf-8') as f:
    lines = f.readlines()

out = []
in_table = False
in_index = False
in_fk = False

for line in lines:
    if line.startswith('CREATE TABLE'):
        table_name = line.split('"')[1]
        if table_name in tables:
            in_table = True
            out.append(line)
        else:
            in_table = False
    elif line.startswith('CREATE UNIQUE INDEX') or line.startswith('CREATE INDEX'):
        table_name = line.split('"')[3]
        if table_name in tables:
            in_index = True
            out.append(line)
        else:
            in_index = False
    elif line.startswith('ALTER TABLE'):
        table_name = line.split('"')[1]
        if table_name in tables:
            in_fk = True
            out.append(line)
        else:
            in_fk = False
    else:
        if in_table or in_index or in_fk:
            out.append(line)
            if line.strip() == ');' or line.strip() == ';':
                if in_table:
                    in_table = False
                elif in_index:
                    in_index = False
                elif in_fk:
                    in_fk = False

import os
os.makedirs('prisma/migrations/20260804180000_init_marketing', exist_ok=True)
with open('prisma/migrations/20260804180000_init_marketing/migration.sql', 'w', encoding='utf-8') as f:
    f.writelines(out)
