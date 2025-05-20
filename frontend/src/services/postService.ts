import { apiService } from './api';

export interface Post {
  _id: string;
  title: string;
  content: string;
  status: 'draft' | 'queued' | 'delivered';
  scheduledTime?: string;
  platforms: string[];
  createdAt: string;
  updatedAt: string;
}

interface PostResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
}

export const postService = {
  async getDraftPosts(page: number = 1, limit: number = 10): Promise<PostResponse> {
    const response = await apiService.get<PostResponse>(`/posts/drafts?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getQueuedPosts(page: number = 1, limit: number = 10): Promise<PostResponse> {
    const response = await apiService.get<PostResponse>(`/posts/queued?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getDeliveredPosts(page: number = 1, limit: number = 10): Promise<PostResponse> {
    const response = await apiService.get<PostResponse>(`/posts/delivered?page=${page}&limit=${limit}`);
    return response.data;
  },

  async createPost(post: Partial<Post>): Promise<Post> {
    const response = await apiService.post<Post>('/posts', post);
    return response.data;
  },

  async updatePost(id: string, post: Partial<Post>): Promise<Post> {
    const response = await apiService.put<Post>(`/posts/${id}`, post);
    return response.data;
  },

  async deletePost(id: string): Promise<void> {
    await apiService.delete(`/posts/${id}`);
  },

  async schedulePost(id: string, scheduledTime: string, platforms: string[]): Promise<Post> {
    const response = await apiService.put<Post>(`/posts/${id}/schedule`, {
      scheduledTime,
      platforms
    });
    return response.data;
  },

  async getPostsByDateRange(
    startDate: string,
    endDate: string,
    viewMode: 'month' | 'week' | 'day'
  ): Promise<Post[]> {
    const response = await apiService.get<Post[]>(
      `/posts/queued?viewMode=${viewMode}&startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  }
}; 