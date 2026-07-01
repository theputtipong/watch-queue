// src/api/queueApi.ts
import { QueueItem, QueueState } from '../types';
import { apiClient } from './apiClient';

export const queueApi = {
  getQueue: async (userId: string): Promise<QueueItem[]> => {
    return apiClient.get(`/queue?userId=${userId}`);
  },
  
  upsertQueueItem: async (userId: string, videoId: string, state: QueueState): Promise<QueueItem> => {
    return apiClient.put('/queue', { userId, videoId, state });
  },

  removeQueueItem: async (userId: string, videoId: string): Promise<void> => {
    return apiClient.delete('/queue', { userId, videoId });
  }
};
