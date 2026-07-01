export interface VideoItem {
  id: string;
  title: string;
  genre: string;
  thumbnailUrl: string; // รูปจำลอง (Placeholder)
  duration: string;
  year: number;
  rating: string;
}

// สถานะของ Queue (State Machine)
export type QueueState = 'UNSAVED' | 'QUEUED' | 'WATCHED';

export interface QueueItem {
  videoId: string;
  state: QueueState;
  updatedAt: number;
}
