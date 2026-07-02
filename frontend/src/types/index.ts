export interface VideoItem {
  id: string;
  title: string;
  genre: string;
  thumbnailUrl: string;
  duration: string;
  year: number;
  rating: string;
}
export type QueueState = 'UNSAVED' | 'QUEUED' | 'WATCHED';
export interface QueueItem {
  videoId: string;
  state: QueueState;
  updatedAt: number;
}
