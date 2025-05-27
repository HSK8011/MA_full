import { TwitterApi } from 'twitter-api-v2';
import { config } from '../config';

// Twitter API configuration
const twitterConfig = {
  clientId: process.env.TWITTER_CLIENT_ID || 'your-twitter-client-id',
  clientSecret: process.env.TWITTER_CLIENT_SECRET || 'your-twitter-client-secret',
  callbackUrl: `${config.frontendUrl}/auth/twitter/callback`,
};

/**
 * Generate Twitter OAuth 2.0 authorization URL
 * @returns {string} Authorization URL
 */
export const getTwitterAuthUrl = (): string => {
  const client = new TwitterApi({
    clientId: twitterConfig.clientId,
    clientSecret: twitterConfig.clientSecret,
  });

  // Generate auth link with required scopes
  const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
    twitterConfig.callbackUrl,
    {
      scope: [
        'tweet.read',
        'tweet.write',
        'users.read',
        'offline.access',
      ],
    }
  );

  // Store code verifier and state in session or database
  // This is important for the callback verification
  return JSON.stringify({
    url,
    codeVerifier,
    state,
  });
};

/**
 * Complete Twitter OAuth flow with the received code
 * @param {string} code - Authorization code from Twitter
 * @param {string} codeVerifier - Code verifier from initial request
 * @param {string} state - State from initial request
 * @returns {Promise<any>} Twitter user data and tokens
 */
export const completeTwitterAuth = async (
  code: string,
  codeVerifier: string,
  state: string
): Promise<any> => {
  try {
    const client = new TwitterApi({
      clientId: twitterConfig.clientId,
      clientSecret: twitterConfig.clientSecret,
    });

    // Get access token
    const { accessToken, refreshToken, expiresIn } = await client.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: twitterConfig.callbackUrl,
    });

    // Create client with access token
    const twitterClient = new TwitterApi(accessToken);
    const { data: user } = await twitterClient.v2.me({
      'user.fields': ['profile_image_url', 'description', 'username', 'name'],
    });

    return {
      tokens: {
        accessToken,
        refreshToken,
        expiresIn,
      },
      user,
    };
  } catch (error) {
    console.error('Error completing Twitter authentication:', error);
    throw error;
  }
};

/**
 * Refresh Twitter access token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<any>} New access token data
 */
export const refreshTwitterToken = async (refreshToken: string): Promise<any> => {
  try {
    const client = new TwitterApi({
      clientId: twitterConfig.clientId,
      clientSecret: twitterConfig.clientSecret,
    });

    const { accessToken, refreshToken: newRefreshToken, expiresIn } = 
      await client.refreshOAuth2Token(refreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn,
    };
  } catch (error) {
    console.error('Error refreshing Twitter token:', error);
    throw error;
  }
};

/**
 * Post a tweet
 * @param {string} accessToken - Twitter access token
 * @param {string} text - Tweet content
 * @param {string[]} mediaIds - Optional media IDs to attach
 * @returns {Promise<any>} Tweet data
 */
export const postTweet = async (
  accessToken: string,
  text: string,
  mediaIds?: string[]
): Promise<any> => {
  try {
    const client = new TwitterApi(accessToken);
    
    const tweetData: any = { text };
    
    if (mediaIds && mediaIds.length > 0) {
      tweetData.media = { media_ids: mediaIds };
    }
    
    const { data } = await client.v2.tweet(tweetData);
    return data;
  } catch (error) {
    console.error('Error posting tweet:', error);
    throw error;
  }
};

/**
 * Upload media to Twitter
 * @param {string} accessToken - Twitter access token
 * @param {Buffer} media - Media buffer
 * @param {string} mimeType - Media MIME type
 * @returns {Promise<string>} Media ID
 */
export const uploadMedia = async (
  accessToken: string,
  media: Buffer,
  mimeType: string
): Promise<string> => {
  try {
    // For media uploads, we need to use v1 API
    const client = new TwitterApi(accessToken);
    const mediaId = await client.v1.uploadMedia(media, { mimeType });
    return mediaId;
  } catch (error) {
    console.error('Error uploading media to Twitter:', error);
    throw error;
  }
};

/**
 * Get user's Twitter timeline
 * @param {string} accessToken - Twitter access token
 * @param {number} maxResults - Maximum number of tweets to return
 * @returns {Promise<any>} Timeline data
 */
export const getUserTimeline = async (
  accessToken: string,
  maxResults: number = 10
): Promise<any> => {
  try {
    const client = new TwitterApi(accessToken);
    const { data } = await client.v2.userTimeline(
      await client.v2.me().then(response => response.data.id),
      {
        max_results: maxResults,
        'tweet.fields': ['created_at', 'public_metrics', 'text'],
      }
    );
    return data;
  } catch (error) {
    console.error('Error getting user timeline:', error);
    throw error;
  }
};

/**
 * Get tweet metrics
 * @param {string} accessToken - Twitter access token
 * @param {string} tweetId - Tweet ID
 * @returns {Promise<any>} Tweet metrics
 */
export const getTweetMetrics = async (
  accessToken: string,
  tweetId: string
): Promise<any> => {
  try {
    const client = new TwitterApi(accessToken);
    const { data } = await client.v2.singleTweet(tweetId, {
      'tweet.fields': ['public_metrics', 'created_at'],
    });
    return data;
  } catch (error) {
    console.error('Error getting tweet metrics:', error);
    throw error;
  }
};
