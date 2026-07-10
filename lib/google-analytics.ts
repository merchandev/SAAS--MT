import { BetaAnalyticsDataClient } from '@google-analytics/data';

const propertyId = process.env.GA4_PROPERTY_ID;

// Construimos el cliente de autenticación
const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA4_CLIENT_EMAIL,
    private_key: process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

export async function getAnalyticsKPIs() {
  if (!propertyId) return null;

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      metrics: [
        { name: 'totalUsers' },
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
      ],
    });

    const row = response.rows?.[0];
    if (!row) return null;

    return {
      totalUsers: row.metricValues?.[0].value || '0',
      activeUsers: row.metricValues?.[1].value || '0',
      sessions: row.metricValues?.[2].value || '0',
      pageViews: row.metricValues?.[3].value || '0',
    };
  } catch (error) {
    console.error('Error fetching GA4 KPIs:', error);
    return null;
  }
}

export async function getTrafficSources() {
  if (!propertyId) return [];

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [
        {
          metric: { metricName: 'sessions' },
          desc: true,
        },
      ],
      limit: 5,
    });

    return response.rows?.map(row => ({
      source: row.dimensionValues?.[0].value || 'Unknown',
      sessions: parseInt(row.metricValues?.[0].value || '0', 10),
    })) || [];
  } catch (error) {
    console.error('Error fetching GA4 Traffic Sources:', error);
    return [];
  }
}

export async function getTopPages() {
  if (!propertyId) return [];

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [
        {
          metric: { metricName: 'screenPageViews' },
          desc: true,
        },
      ],
      limit: 10,
    });

    return response.rows?.map(row => ({
      path: row.dimensionValues?.[0].value || '',
      title: row.dimensionValues?.[1].value || '',
      views: parseInt(row.metricValues?.[0].value || '0', 10),
    })) || [];
  } catch (error) {
    console.error('Error fetching GA4 Top Pages:', error);
    return [];
  }
}

export async function getTrafficTrend() {
  if (!propertyId) return [];

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [
        {
          dimension: { dimensionName: 'date' },
        },
      ],
    });

    return response.rows?.map(row => {
      const dateStr = row.dimensionValues?.[0].value || '';
      // Format YYYYMMDD to DD/MM
      const formattedDate = dateStr.length === 8 
        ? `${dateStr.substring(6, 8)}/${dateStr.substring(4, 6)}` 
        : dateStr;
        
      return {
        date: formattedDate,
        sessions: parseInt(row.metricValues?.[0].value || '0', 10),
      };
    }) || [];
  } catch (error) {
    console.error('Error fetching GA4 Trend:', error);
    return [];
  }
}
