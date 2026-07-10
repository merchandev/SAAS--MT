require('dotenv').config();
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

async function main() {
  console.log("Checking credentials...");
  console.log("Property ID:", process.env.GA4_PROPERTY_ID);
  console.log("Client Email:", process.env.GA4_CLIENT_EMAIL);
  console.log("Private Key length:", process.env.GA4_PRIVATE_KEY?.length);

  try {
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GA4_CLIENT_EMAIL,
        private_key: process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
    });

    console.log("Requesting data...");
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      metrics: [{ name: 'activeUsers' }],
    });

    console.log("Success! Data:", JSON.stringify(response, null, 2));
  } catch (error) {
    console.error("ERROR from Google API:");
    console.error(error.message);
    if (error.details) {
      console.error(error.details);
    }
  }
}

main();
