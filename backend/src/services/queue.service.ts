import { userQueues, mockCatalog } from '../store/in-memory.db';
import { QueueItem, QueueState } from '../types';
export class QueueService {
  public getQueue(userId: string): QueueItem[] {
    const queueMap = userQueues[userId];
    if (!queueMap) return [];
    return Object.values(queueMap);
  }
  public upsertQueueItem(userId: string, videoId: string, state: QueueState): QueueItem {
    const videoExists = mockCatalog.some(v => v.id === videoId);
    if (!videoExists) {
      throw new Error(`Video ID ${videoId} not found in catalog.`);
    }
    if (!userQueues[userId]) {
      userQueues[userId] = {};
    }
    const currentItem = userQueues[userId][videoId];
    const currentState = currentItem ? currentItem.state : 'UNSAVED';
    this.validateStateTransition(currentState, state);
    if (state === 'UNSAVED') {
      delete userQueues[userId][videoId];
      return { videoId, state: 'UNSAVED', updatedAt: Date.now() };
    }
    const newItem: QueueItem = {
      videoId,
      state,
      updatedAt: Date.now(),
    };
    userQueues[userId][videoId] = newItem;
    return newItem;
  }
  public removeQueueItem(userId: string, videoId: string): void {
    if (userQueues[userId] && userQueues[userId][videoId]) {
      delete userQueues[userId][videoId];
    }
  }
  private validateStateTransition(current: QueueState, next: QueueState) {
    if (current === next) return; 
    const validTransitions: Record<QueueState, QueueState[]> = {
      UNSAVED: ['QUEUED'],
      QUEUED: ['WATCHED', 'UNSAVED'], 
      WATCHED: ['UNSAVED'],
    };
    if (!validTransitions[current].includes(next)) {
      throw new Error(`Invalid state transition from ${current} to ${next}`);
    }
  }
}
export const queueService = new QueueService();
