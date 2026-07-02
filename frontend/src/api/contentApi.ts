// src/api/contentApi.ts
import { VideoItem } from '../types';
import { apiClient } from './apiClient';

export const contentApi = {
  getContents: async (search: string = '', genre: string = '', options?: RequestInit): Promise<VideoItem[]> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (genre) params.append('genre', genre);
    
    return apiClient.get(`/contents?${params.toString()}`, options);
  }
};
