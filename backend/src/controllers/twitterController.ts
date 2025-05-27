import { Request, Response } from 'express';
import { handleAsync } from '../utils/handleAsync';
import { Integration } from '../models/Integration';
import { Post } from '../models/Post';
import mongoose from 'mongoose';
import {
  getTwitterAuthUrl,
  completeTwitterAuth,
  refreshTwitterToken,
  postTweet,
  uploadMedia,
  getUserTimeline,
  getTweetMetrics
} from '../utils/twitterService';
import axios from 'axios';

// Extend Request type to include userId
interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}

const TWITTER_OAUTH_CLIENT_ID = "OFNPTFowLVNuNXF1dzcwUmVOVHo6MTpjaQ";
const TWITTER_OAUTH_CLIENT_SECRET = "Q81gJufRDi8ZGHLtG_EJ1usCr0lkVj018xFmCod9dLhe-TWG3f";
const TWITTER_OAUTH_TOKEN_URL = "https://api.twitter.com/2/oauth2/token";
const BasicAuthToken = Buffer.from(`${TWITTER_OAUTH_CLIENT_ID}:${TWITTER_OAUTH_CLIENT_SECRET}`, "utf8").toString(
  "base64"
);
export const twitterOauthTokenParams = {
  client_id: TWITTER_OAUTH_CLIENT_ID,
  code_verifier: "qY2N8cEjKhUapZVdG5m0sRzFJX-wt4iBLTcvMyUxe7g",
  redirect_uri: `http://localhost:5000/api/twitter/callback`,
  grant_type: "authorization_code",
};

export interface TwitterUser {
  id: string;
  name: string;
  username: string;
}

type TwitterTokenResponse = {
  token_type: "bearer";
  expires_in: 7200;
  access_token: string;
  scope: string;
};

export async function getTwitterOAuthToken(code: string) {
  console.log("Getting Twitter OAuth Token with code:", code);
  try {
    // POST request to the token url to get the access token
    const res = await axios.post<TwitterTokenResponse>(
      TWITTER_OAUTH_TOKEN_URL,
      new URLSearchParams({ ...twitterOauthTokenParams, code }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${BasicAuthToken}`,
        },
      }
    );

    console.log("Token", res.data);

    return res.data;
  } catch (err) {
    return null;
  }
}

export async function getTwitterUser(accessToken: string): Promise<TwitterUser | null> {
  try {
    // request GET https://api.twitter.com/2/users/me
    const res = await axios.get<{ data: TwitterUser }>("https://api.twitter.com/2/users/me", {
      headers: {
        "Content-type": "application/json",
        // put the access token in the Authorization Bearer token
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data.data ?? null;
  } catch (err) {
    return null;
  }
}

export const twitterController = {
  /**
   * Initiate Twitter OAuth flow
   * @route POST /api/connect/twitter/auth
   */
  initiateTwitterAuth: handleAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        message: 'Unauthorized - User ID not found',
        code: 'USER_ID_MISSING'
      });
    }
    
    try {
      // Generate Twitter auth URL and store code verifier and state
      const authData = getTwitterAuthUrl();
      const { url, codeVerifier, state } = JSON.parse(authData);
      
      // Store code verifier and state in session or database
      // This is important for the callback verification
      // In a real implementation, you would store these in a secure session or database
      
      // For this example, we'll return them to be stored client-side
      // In production, use a more secure approach
      return res.json({
        authUrl: url,
        codeVerifier,
        state
      });
    } catch (error: any) {
      console.error('Error initiating Twitter auth:', error);
      return res.status(500).json({
        message: 'Failed to initiate Twitter authentication',
        error: error.message
      });
    }
  }),
  
  /**
   * Complete Twitter OAuth flow
   * @route POST /api/connect/twitter/callback
   */
  callback: handleAsync(async (req: AuthRequest, res: Response) => {
    const code = req.query.code as string;
    // console.log("User ID from request:", req.userId);

    const twitterOAuthToken = await getTwitterOAuthToken(code);
    console.log("Twitter OAuth Token:", twitterOAuthToken);

    if (!twitterOAuthToken) {
      return res.status(400).json({
        message: 'Invalid or missing Twitter OAuth token',
        code: 'OAUTH_TOKEN_ERROR'
      });
    }

    const twitterUser = await getTwitterUser(twitterOAuthToken.access_token);
    console.log("Twitter User:", twitterUser);

    if (!twitterUser) {
      return res.status(400).json({
        message: 'Failed to retrieve Twitter user information',
        code: 'USER_INFO_ERROR'
      });
    }

    return res.redirect('http://localhost:5173/connect/twitter/success?user=' + encodeURIComponent(JSON.stringify(twitterUser)));
  }),
  
  /**
   * Post a tweet
   * @route POST /api/connect/twitter/:integrationId/tweet
   */
  createTweet: handleAsync(async (req: AuthRequest, res: Response) => {
    const { integrationId } = req.params;
    const { content, mediaUrls, scheduledAt } = req.body;
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        message: 'Unauthorized - User ID not found',
        code: 'USER_ID_MISSING'
      });
    }
    
    if (!content) {
      return res.status(400).json({
        message: 'Tweet content is required',
        code: 'MISSING_CONTENT'
      });
    }
    
    try {
      // Find the Twitter integration
      const integration = await Integration.findOne({
        _id: integrationId,
        userId,
        platform: 'twitter',
        isConnected: true,
        status: 'active'
      });
      
      if (!integration) {
        return res.status(404).json({
          message: 'Twitter integration not found or not active',
          code: 'INTEGRATION_NOT_FOUND'
        });
      }
      
      // Check if we need to refresh the token
      const credentials = integration.credentials as any;
      let accessToken = credentials.accessToken;
      
      if (new Date(credentials.expiresAt) <= new Date()) {
        // Token expired, refresh it
        const refreshResult = await refreshTwitterToken(credentials.refreshToken);
        accessToken = refreshResult.accessToken;
        
        // Update integration with new tokens
        integration.credentials = {
          ...credentials,
          accessToken: refreshResult.accessToken,
          refreshToken: refreshResult.refreshToken || credentials.refreshToken,
          expiresAt: new Date(Date.now() + refreshResult.expiresIn * 1000)
        };
        
        await integration.save();
      }
      
      // If scheduled for later, create a post record but don't publish yet
      if (scheduledAt && new Date(scheduledAt) > new Date()) {
        const newPost = new Post({
          integrationId,
          userId,
          platform: 'twitter',
          postId: 'pending', // Will be updated after publishing
          content,
          mediaUrls: mediaUrls || [],
          type: mediaUrls && mediaUrls.length > 0 ? 'image' : 'text',
          status: 'scheduled',
          scheduledAt: new Date(scheduledAt),
          postHistory: [{
            version: 1,
            content,
            mediaUrls: mediaUrls || [],
            updatedAt: new Date(),
            updatedBy: new mongoose.Types.ObjectId(userId)
          }]
        });
        
        await newPost.save();
        
        return res.status(201).json({
          message: 'Tweet scheduled successfully',
          post: newPost
        });
      }
      
      // Otherwise, post immediately
      let mediaIds: string[] = [];
      
      // Upload media if provided
      if (mediaUrls && mediaUrls.length > 0) {
        // In a real implementation, you would download the media from mediaUrls
        // and then upload them to Twitter
        // This is a simplified example
        // mediaIds = await Promise.all(mediaUrls.map(url => uploadMedia(accessToken, mediaBuffer, mimeType)));
      }
      
      // Post the tweet
      const tweetResult = await postTweet(accessToken, content, mediaIds.length > 0 ? mediaIds : undefined);
      
      // Create a post record
      const newPost = new Post({
        integrationId,
        userId,
        platform: 'twitter',
        postId: tweetResult.id,
        content,
        mediaUrls: mediaUrls || [],
        type: mediaUrls && mediaUrls.length > 0 ? 'image' : 'text',
        status: 'published',
        publishedAt: new Date(),
        postHistory: [{
          version: 1,
          content,
          mediaUrls: mediaUrls || [],
          updatedAt: new Date(),
          updatedBy: new mongoose.Types.ObjectId(userId)
        }],
        metrics: {
          likes: 0,
          comments: 0,
          shares: 0,
          impressions: 0,
          reach: 0,
          engagement: 0,
          lastUpdated: new Date()
        }
      });
      
      await newPost.save();
      
      return res.status(201).json({
        message: 'Tweet posted successfully',
        tweet: tweetResult,
        post: newPost
      });
    } catch (error: any) {
      console.error('Error posting tweet:', error);
      return res.status(500).json({
        message: 'Failed to post tweet',
        error: error.message
      });
    }
  }),
  
  /**
   * Get Twitter timeline
   * @route GET /api/connect/twitter/:integrationId/timeline
   */
  getTimeline: handleAsync(async (req: AuthRequest, res: Response) => {
    const { integrationId } = req.params;
    const { maxResults = 10 } = req.query;
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        message: 'Unauthorized - User ID not found',
        code: 'USER_ID_MISSING'
      });
    }
    
    try {
      // Find the Twitter integration
      const integration = await Integration.findOne({
        _id: integrationId,
        userId,
        platform: 'twitter',
        isConnected: true,
        status: 'active'
      });
      
      if (!integration) {
        return res.status(404).json({
          message: 'Twitter integration not found or not active',
          code: 'INTEGRATION_NOT_FOUND'
        });
      }
      
      // Check if we need to refresh the token
      const credentials = integration.credentials as any;
      let accessToken = credentials.accessToken;
      
      if (new Date(credentials.expiresAt) <= new Date()) {
        // Token expired, refresh it
        const refreshResult = await refreshTwitterToken(credentials.refreshToken);
        accessToken = refreshResult.accessToken;
        
        // Update integration with new tokens
        integration.credentials = {
          ...credentials,
          accessToken: refreshResult.accessToken,
          refreshToken: refreshResult.refreshToken || credentials.refreshToken,
          expiresAt: new Date(Date.now() + refreshResult.expiresIn * 1000)
        };
        
        await integration.save();
      }
      
      // Get user timeline
      const timeline = await getUserTimeline(accessToken, Number(maxResults));
      
      return res.status(200).json(timeline);
    } catch (error: any) {
      console.error('Error getting Twitter timeline:', error);
      return res.status(500).json({
        message: 'Failed to get Twitter timeline',
        error: error.message
      });
    }
  }),
  
  /**
   * Update tweet metrics
   * @route POST /api/connect/twitter/:integrationId/metrics/:postId
   */
  updateTweetMetrics: handleAsync(async (req: AuthRequest, res: Response) => {
    const { integrationId, postId } = req.params;
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        message: 'Unauthorized - User ID not found',
        code: 'USER_ID_MISSING'
      });
    }
    
    try {
      // Find the post
      const post = await Post.findOne({
        _id: postId,
        integrationId,
        userId,
        platform: 'twitter',
        status: 'published'
      });
      
      if (!post) {
        return res.status(404).json({
          message: 'Post not found',
          code: 'POST_NOT_FOUND'
        });
      }
      
      // Find the Twitter integration
      const integration = await Integration.findOne({
        _id: integrationId,
        userId,
        platform: 'twitter',
        isConnected: true,
        status: 'active'
      });
      
      if (!integration) {
        return res.status(404).json({
          message: 'Twitter integration not found or not active',
          code: 'INTEGRATION_NOT_FOUND'
        });
      }
      
      // Check if we need to refresh the token
      const credentials = integration.credentials as any;
      let accessToken = credentials.accessToken;
      
      if (new Date(credentials.expiresAt) <= new Date()) {
        // Token expired, refresh it
        const refreshResult = await refreshTwitterToken(credentials.refreshToken);
        accessToken = refreshResult.accessToken;
        
        // Update integration with new tokens
        integration.credentials = {
          ...credentials,
          accessToken: refreshResult.accessToken,
          refreshToken: refreshResult.refreshToken || credentials.refreshToken,
          expiresAt: new Date(Date.now() + refreshResult.expiresIn * 1000)
        };
        
        await integration.save();
      }
      
      // Get tweet metrics
      const metrics = await getTweetMetrics(accessToken, post.postId);
      
      // Update post metrics
      post.metrics = {
        likes: metrics.public_metrics.like_count || 0,
        comments: metrics.public_metrics.reply_count || 0,
        shares: metrics.public_metrics.retweet_count || 0,
        impressions: metrics.public_metrics.impression_count || 0,
        reach: 0, // Not available in Twitter API
        engagement: 0, // Calculate based on available metrics
        lastUpdated: new Date()
      };
      
      // Calculate engagement rate if impressions are available
      if (metrics.public_metrics.impression_count > 0) {
        const interactions = 
          metrics.public_metrics.like_count + 
          metrics.public_metrics.reply_count + 
          metrics.public_metrics.retweet_count;
        
        post.metrics.engagement = (interactions / metrics.public_metrics.impression_count) * 100;
      }
      
      await post.save();
      
      return res.status(200).json({
        message: 'Tweet metrics updated successfully',
        metrics: post.metrics
      });
    } catch (error: any) {
      console.error('Error updating tweet metrics:', error);
      return res.status(500).json({
        message: 'Failed to update tweet metrics',
        error: error.message
      });
    }
  })
};
