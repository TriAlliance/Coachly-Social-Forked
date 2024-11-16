import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { GARMIN_CONFIG } from '../../config/garmin';

export class GarminService {
  private async getGarminCredentials(userId: string) {
    try {
      const docRef = doc(db, 'users', userId, 'integrations', 'garmin');
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    } catch (error) {
      console.error('Error getting Garmin credentials:', error);
      return null;
    }
  }

  async isConnected(userId: string): Promise<boolean> {
    try {
      const credentials = await this.getGarminCredentials(userId);
      return Boolean(credentials?.active);
    } catch (error) {
      console.error('Error checking Garmin connection:', error);
      return false;
    }
  }

  async connectGarmin(userId: string): Promise<string> {
    try {
      // Check if already connected
      const isAlreadyConnected = await this.isConnected(userId);
      if (isAlreadyConnected) {
        throw new Error('Garmin account is already connected');
      }

      // Get request token through proxy
      const response = await fetch(`${GARMIN_CONFIG.proxyBaseUrl}${GARMIN_CONFIG.endpoints.requestToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userId
        },
        body: JSON.stringify({
          oauth_callback: GARMIN_CONFIG.callbackUrl,
          consumer_key: GARMIN_CONFIG.consumerKey,
          consumer_secret: GARMIN_CONFIG.consumerSecret
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to get request token: ${error}`);
      }

      const data = await response.json();
      if (!data.oauth_token) {
        throw new Error('Invalid request token response');
      }

      // Store request token temporarily
      await setDoc(doc(db, 'users', userId, 'integrations', 'garmin_temp'), {
        requestToken: data.oauth_token,
        requestTokenSecret: data.oauth_token_secret,
        timestamp: new Date().toISOString()
      });

      // Return authorization URL
      return `${GARMIN_CONFIG.endpoints.authorize}?oauth_token=${data.oauth_token}`;
    } catch (error: any) {
      console.error('Error initiating Garmin connection:', error);
      throw new Error(error.message || 'Failed to connect to Garmin');
    }
  }

  async handleCallback(userId: string, oauthToken: string, oauthVerifier: string): Promise<void> {
    try {
      // Get stored request token
      const tempDoc = await getDoc(doc(db, 'users', userId, 'integrations', 'garmin_temp'));
      if (!tempDoc.exists()) {
        throw new Error('Invalid request token - please try connecting again');
      }

      const { requestTokenSecret } = tempDoc.data();

      // Exchange for access token through proxy
      const response = await fetch(`${GARMIN_CONFIG.proxyBaseUrl}${GARMIN_CONFIG.endpoints.accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userId
        },
        body: JSON.stringify({
          oauth_token: oauthToken,
          oauth_verifier: oauthVerifier,
          oauth_token_secret: requestTokenSecret,
          consumer_key: GARMIN_CONFIG.consumerKey,
          consumer_secret: GARMIN_CONFIG.consumerSecret
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to get access token: ${error}`);
      }

      const data = await response.json();
      if (!data.oauth_token) {
        throw new Error('Invalid access token response');
      }

      // Store access token
      await setDoc(doc(db, 'users', userId, 'integrations', 'garmin'), {
        accessToken: data.oauth_token,
        tokenSecret: data.oauth_token_secret,
        connectedAt: new Date().toISOString(),
        active: true
      });

      // Clean up temp token
      await deleteDoc(doc(db, 'users', userId, 'integrations', 'garmin_temp'));
    } catch (error: any) {
      console.error('Error handling Garmin callback:', error);
      throw new Error(error.message || 'Failed to complete Garmin connection');
    }
  }

  async getActivities(userId: string, startDate?: Date, limit: number = 10): Promise<any[]> {
    try {
      const credentials = await this.getGarminCredentials(userId);
      if (!credentials?.active) {
        throw new Error('Garmin account not connected');
      }

      const response = await fetch(
        `${GARMIN_CONFIG.proxyBaseUrl}${GARMIN_CONFIG.endpoints.activities}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-ID': userId
          },
          body: JSON.stringify({
            access_token: credentials.accessToken,
            token_secret: credentials.tokenSecret,
            consumer_key: GARMIN_CONFIG.consumerKey,
            consumer_secret: GARMIN_CONFIG.consumerSecret,
            startDate: startDate?.toISOString(),
            limit
          })
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to fetch activities: ${error}`);
      }

      const activities = await response.json();
      return Array.isArray(activities) ? activities : [];
    } catch (error: any) {
      console.error('Error fetching Garmin activities:', error);
      throw new Error(error.message || 'Failed to fetch activities from Garmin');
    }
  }

  async disconnectGarmin(userId: string): Promise<void> {
    try {
      const credentials = await this.getGarminCredentials(userId);
      if (!credentials) return;

      // Revoke access through proxy
      const response = await fetch(`${GARMIN_CONFIG.proxyBaseUrl}${GARMIN_CONFIG.endpoints.deauthorize}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userId
        },
        body: JSON.stringify({
          access_token: credentials.accessToken,
          token_secret: credentials.tokenSecret,
          consumer_key: GARMIN_CONFIG.consumerKey,
          consumer_secret: GARMIN_CONFIG.consumerSecret
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to deauthorize: ${error}`);
      }

      // Mark as inactive in Firestore
      await setDoc(doc(db, 'users', userId, 'integrations', 'garmin'), {
        active: false,
        disconnectedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error: any) {
      console.error('Error disconnecting from Garmin:', error);
      throw new Error(error.message || 'Failed to disconnect from Garmin');
    }
  }
}

export const garminService = new GarminService();