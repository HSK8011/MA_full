import { Request, Response } from 'express';
import { Integration } from '../models/Integration';
import { handleAsync } from '../utils/handleAsync';

// Extend Request type to include userId
interface AuthRequest extends Request {
  userId?: string;
}

export const integrationController = {
  // Get all social media integrations for a user
  getSocialMediaIntegrations: handleAsync(async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    
    if (!userId) {
      console.log('❌ [Integration] No user ID found in request');
      return res.status(401).json({ 
        message: 'Unauthorized - User ID not found',
        code: 'USER_ID_MISSING'
      });
    }

    console.log('🔍 [MongoDB Query] Fetching integrations for user:', userId);
    console.log('📝 [Query Params]:', {
      userId,
      serviceType: 'socialMedia'
    });

    const integrations = await Integration.find({
      userId,
      serviceType: 'socialMedia'
    }).select('-credentials -apiKey'); // Exclude sensitive data

    console.log('\n📊 [MongoDB Results]');
    console.log('Total integrations found:', integrations.length);
    
    // Add type annotations for the accumulator
    const platformCounts = integrations.reduce<Record<string, number>>((acc, curr) => {
      const platform = curr.platform as string;
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {});
    
    console.log('Platforms breakdown:', platformCounts);
    
    const statusCounts = integrations.reduce<Record<string, number>>((acc, curr) => {
      const status = curr.status as string;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    console.log('Status breakdown:', statusCounts);
    console.log('Integration details:', integrations.map(i => ({
      id: i._id,
      platform: i.platform,
      status: i.status,
      username: i.username,
      lastConnected: i.lastConnectedAt
    })));
    console.log('\n-------------------\n');

    res.json(integrations);
  }),

  // Initiate OAuth flow for a platform
  initiateOAuth: handleAsync(async (req: AuthRequest, res: Response) => {
    const { platform } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ 
        message: 'Unauthorized - User ID not found',
        code: 'USER_ID_MISSING'
      });
    }

    // For now, since we're using dummy data, we'll just return success
    // In real implementation, this would generate OAuth URLs for each platform
    res.json({
      authUrl: `https://dummy-oauth.${platform}.com/auth?user=${userId}`,
      message: `OAuth flow initiated for ${platform}`
    });
  }),

  // Disconnect a social media account
  disconnectAccount: handleAsync(async (req: AuthRequest, res: Response) => {
    const { integrationId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ 
        message: 'Unauthorized - User ID not found',
        code: 'USER_ID_MISSING'
      });
    }

    const integration = await Integration.findOne({
      _id: integrationId,
      userId,
      serviceType: 'socialMedia'
    });

    if (!integration) {
      return res.status(404).json({ message: 'Integration not found' });
    }

    integration.isConnected = false;
    integration.status = 'inactive';
    await integration.save();

    res.json({ message: 'Account disconnected successfully' });
  }),

  // Reconnect a social media account
  reconnectAccount: handleAsync(async (req: AuthRequest, res: Response) => {
    const { integrationId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ 
        message: 'Unauthorized - User ID not found',
        code: 'USER_ID_MISSING'
      });
    }

    const integration = await Integration.findOne({
      _id: integrationId,
      userId,
      serviceType: 'socialMedia'
    });

    if (!integration) {
      return res.status(404).json({ message: 'Integration not found' });
    }

    // For now, return a dummy OAuth URL
    // In real implementation, this would generate platform-specific OAuth URLs
    res.json({
      authUrl: `https://dummy-oauth.${integration.platform}.com/auth?user=${userId}`,
      message: 'Reconnection flow initiated'
    });
  }),

  // Update integration settings
  updateIntegrationSettings: handleAsync(async (req: Request, res: Response) => {
    const { integrationId } = req.params;
    const userId = req.user?._id;
    const updates = req.body;

    // Prevent updating sensitive fields
    delete updates.credentials;
    delete updates.apiKey;
    delete updates.userId;

    const integration = await Integration.findOneAndUpdate(
      {
        _id: integrationId,
        userId,
        serviceType: 'socialMedia'
      },
      { $set: updates },
      { new: true }
    ).select('-credentials -apiKey');

    if (!integration) {
      return res.status(404).json({ message: 'Integration not found' });
    }

    res.json(integration);
  })
}; 