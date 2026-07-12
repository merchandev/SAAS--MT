const { BetaAnalyticsDataClient } = require('@google-analytics/data');
require('dotenv').config();

const propertyId = process.env.GA4_PROPERTY_ID;

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA4_CLIENT_EMAIL,
    private_key: process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

async function testGA4() {
  console.log("Checking sessionDefaultChannelGroup...");
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '120daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }, { name: 'sessionSourceMedium' }],
      metrics: [{ name: 'sessions' }],
    });

    console.log("Rows:");
    response.rows.forEach(row => {
      console.log(`- Channel: ${row.dimensionValues[0].value}, Source/Medium: ${row.dimensionValues[1].value} -> Sessions: ${row.metricValues[0].value}`);
    });
  } catch (error) {
    console.error(error);
  }
}

testGA4();
