import { BetaAnalyticsDataClient } from '@google-analytics/data';

const propertyId = process.env.GA4_PROPERTY_ID;

// Construimos el cliente de autenticación
const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA4_CLIENT_EMAIL,
    private_key: process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

export async function getAnalyticsKPIs(startDate = '30daysAgo') {
  if (!propertyId) return null;

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate: 'today' }],
      metrics: [
        { name: 'totalUsers' },
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' }
      ],
    });

    const row = response.rows?.[0];
    if (!row) return null;

    const avgSeconds = parseFloat(row.metricValues?.[4]?.value || '0');
    const minutes = Math.floor(avgSeconds / 60);
    const seconds = Math.floor(avgSeconds % 60);
    const formattedDuration = `${minutes}m ${seconds}s`;

    return {
      totalUsers: row.metricValues?.[0].value || '0',
      activeUsers: row.metricValues?.[1].value || '0',
      sessions: row.metricValues?.[2].value || '0',
      pageViews: row.metricValues?.[3].value || '0',
      avgSessionDuration: formattedDuration,
    };
  } catch (error) {
    console.error('Error fetching GA4 KPIs:', error);
    return null;
  }
}

export async function getTrafficSources(startDate = '30daysAgo') {
  if (!propertyId) return [];

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate: 'today' }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
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

export async function getTopPages(startDate = '30daysAgo') {
  if (!propertyId) return [];

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
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

export async function getTrafficTrend(startDate = '30daysAgo') {
  if (!propertyId) return [];

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
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

export async function getTrafficCountries(startDate = '30daysAgo') {
  if (!propertyId) return [];

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate: 'today' }],
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 7,
    });

    return response.rows?.map(row => ({
      country: row.dimensionValues?.[0].value || 'Unknown',
      sessions: parseInt(row.metricValues?.[0].value || '0', 10),
    })) || [];
  } catch (error) {
    console.error('Error fetching GA4 Countries:', error);
    return [];
  }
}

export async function getTrafficDevices(startDate = '30daysAgo') {
  if (!propertyId) return [];

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate: 'today' }],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 4,
    });

    return response.rows?.map(row => ({
      device: row.dimensionValues?.[0].value || 'Unknown',
      sessions: parseInt(row.metricValues?.[0].value || '0', 10),
    })) || [];
  } catch (error) {
    console.error('Error fetching GA4 Devices:', error);
    return [];
  }
}

export async function getEmailCampaignTraffic(startDate = '30daysAgo') {
  if (!propertyId) return { sessions: '0', activeUsers: '0' };

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate: 'today' }],
      dimensionFilter: {
        filter: {
          fieldName: 'sessionDefaultChannelGroup',
          stringFilter: {
            matchType: 'EXACT',
            value: 'Email'
          }
        }
      },
      metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
    });

    const row = response.rows?.[0];
    if (!row) return { sessions: '0', activeUsers: '0' };

    return {
      sessions: row.metricValues?.[0].value || '0',
      activeUsers: row.metricValues?.[1].value || '0',
    };
  } catch (error) {
    console.error('Error fetching GA4 Email Traffic:', error);
    return { sessions: '0', activeUsers: '0' };
  }
}

export async function getUserTimes(startDate = '30daysAgo') {
  if (!propertyId) return [];

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate: 'today' }],
      dimensions: [{ name: 'country' }, { name: 'city' }],
      metrics: [{ name: 'sessions' }, { name: 'averageSessionDuration' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 10,
    });

    return response.rows?.map(row => {
      const avgSeconds = parseFloat(row.metricValues?.[1]?.value || '0');
      const minutes = Math.floor(avgSeconds / 60);
      const seconds = Math.floor(avgSeconds % 60);
      
      return {
        country: row.dimensionValues?.[0].value || 'Unknown',
        city: row.dimensionValues?.[1].value || 'Unknown',
        sessions: parseInt(row.metricValues?.[0].value || '0', 10),
        time: `${minutes}m ${seconds}s`,
      };
    }) || [];
  } catch (error) {
    console.error('Error fetching GA4 User Times:', error);
    return [];
  }
}
