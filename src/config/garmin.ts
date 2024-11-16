export const GARMIN_CONFIG = {
  consumerKey: 'f0b34693-d240-4924-8d98-a43b13945a91',
  consumerSecret: 'aAQXlTozRltGvTX7kTXRihm5zKHkjPHLx4y',
  proxyBaseUrl: 'https://coachingmate.api.pumbashouse.com',
  callbackUrl: `${window.location.origin}/garmin/callback`,
  endpoints: {
    requestToken: '/auth/requestToken',
    accessToken: '/auth/accessToken',
    authorize: 'https://connect.garmin.com/oauthConfirm',
    activities: '/api/garmin/activities',
    deauthorize: '/api/garmin/deauthorize'
  }
} as const;

// Validate configuration
if (!GARMIN_CONFIG.consumerKey || !GARMIN_CONFIG.consumerSecret) {
  throw new Error('Missing required Garmin configuration');
}