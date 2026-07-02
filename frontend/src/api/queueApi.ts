import { QueueItem, QueueState } from '../types';
import { apiClient } from './apiClient';
export const queueApi = {
  getQueue: async (userId: string, options?: RequestInit): Promise<QueueItem[]> => {
    return apiClient.get(`/queue?userId=${userId}`, options);
  },
  upsertQueueItem: async (userId: string, videoId: string, state: QueueState, options?: RequestInit): Promise<QueueItem> => {
    return apiClient.put('/queue', { userId, videoId, state }, options);
  },
  removeQueueItem: async (userId: string, videoId: string, options?: RequestInit): Promise<void> => {
    return apiClient.delete('/queue', { userId, videoId }, options);
  }
};
