import axios from 'axios';
import { API_URL } from '../config';

// Post interfaces
export interface PostWithIntegration {
  _id: string;
  userId: string;
  integrationId: string;
  platform: string;
  postId: string;
  content: string;
  mediaUrls: string[];
  type: 'text' | 'image' | 'video' | 'link' | 'carousel';
  status: 'published' | 'scheduled' | 'draft' | 'failed' | 'pending-approval';
  publishedAt?: string;
  scheduledAt?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  postHistory: PostHistoryItem[];
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    impressions: number;
    reach: number;
    engagement: number;
    lastUpdated: string;
  };
  platformSpecific: Record<string, any>;
  link?: string;
  tags: string[];
  location?: {
    name: string;
    latitude?: number;
    longitude?: number;
  };
  createdAt: string;
  updatedAt: string;
  integration: {
    _id: string;
    platform: string;
    username: string;
    displayName: string;
    profileImageUrl?: string;
  };
}

export interface PostHistoryItem {
  version: number;
  content: string;
  mediaUrls: string[];
  updatedAt: string;
  updatedBy: string;
}

export interface PostParams {
  page?: number;
  limit?: number;
  platform?: string;
  integrationId?: string;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

// API response interfaces
interface PostsResponse {
  posts: PostWithIntegration[];
  total: number;
  page: number;
  totalPages: number;
}

// Service class for post-related API calls
class PostService {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  // Get all posts with pagination and filtering
  async getPosts(params: PostParams = {}): Promise<PostsResponse> {
    try {
      const response = await axios.get(`${API_URL}/posts`, {
        params,
        ...this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  // Get delivered (published) posts
  async getDeliveredPosts(params: PostParams = {}): Promise<PostsResponse> {
    try {
      const response = await axios.get(`${API_URL}/posts/delivered`, {
        params,
        ...this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching delivered posts:', error);
      throw error;
    }
  }

  // Get queued (scheduled) posts
  async getQueuedPosts(params: PostParams = {}): Promise<PostsResponse> {
    try {
      const response = await axios.get(`${API_URL}/posts/queued`, {
        params,
        ...this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching queued posts:', error);
      throw error;
    }
  }

  // Get draft posts
  async getDraftPosts(params: PostParams = {}): Promise<PostsResponse> {
    try {
      const response = await axios.get(`${API_URL}/posts/drafts`, {
        params,
        ...this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching draft posts:', error);
      throw error;
    }
  }

  // Get pending approval posts
  async getPendingApprovalPosts(params: PostParams = {}): Promise<PostsResponse> {
    try {
      const response = await axios.get(`${API_URL}/posts/pending-approval`, {
        params,
        ...this.getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching pending approval posts:', error);
      throw error;
    }
  }

  // Get a single post by ID
  async getPostById(id: string): Promise<PostWithIntegration> {
    try {
      const response = await axios.get(`${API_URL}/posts/${id}`, this.getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error(`Error fetching post with ID ${id}:`, error);
      throw error;
    }
  }

  // Create a new post
  async createPost(postData: Partial<PostWithIntegration>): Promise<PostWithIntegration> {
    try {
      const response = await axios.post(`${API_URL}/posts`, postData, this.getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  // Update an existing post
  async updatePost(id: string, updates: Partial<PostWithIntegration>): Promise<PostWithIntegration> {
    try {
      const response = await axios.put(`${API_URL}/posts/${id}`, updates, this.getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error(`Error updating post with ID ${id}:`, error);
      throw error;
    }
  }

  // Delete a post
  async deletePost(id: string): Promise<{ message: string }> {
    try {
      const response = await axios.delete(`${API_URL}/posts/${id}`, this.getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error(`Error deleting post with ID ${id}:`, error);
      throw error;
    }
  }

  // Schedule a post
  async schedulePost(id: string, scheduledAt: string): Promise<PostWithIntegration> {
    try {
      const response = await axios.post(
        `${API_URL}/posts/${id}/schedule`,
        { scheduledAt },
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error(`Error scheduling post with ID ${id}:`, error);
      throw error;
    }
  }

  // Approve a post
  async approvePost(id: string): Promise<PostWithIntegration> {
    try {
      const response = await axios.post(
        `${API_URL}/posts/${id}/approve`,
        {},
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error(`Error approving post with ID ${id}:`, error);
      throw error;
    }
  }

  // Reject a post
  async rejectPost(id: string): Promise<PostWithIntegration> {
    try {
      const response = await axios.post(
        `${API_URL}/posts/${id}/reject`,
        {},
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error(`Error rejecting post with ID ${id}:`, error);
      throw error;
    }
  }

  // Duplicate a post (for resharing)
  async duplicatePost(id: string): Promise<PostWithIntegration> {
    try {
      const response = await axios.post(
        `${API_URL}/posts/${id}/duplicate`,
        {},
        this.getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error(`Error duplicating post with ID ${id}:`, error);
      throw error;
    }
  }
}

export const postService = new PostService();
