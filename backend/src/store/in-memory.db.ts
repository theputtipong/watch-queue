import { VideoItem, QueueItem } from '../types';

// จำลองข้อมูลแคตตาล็อกวิดีโอ (Content Catalog)
export const mockCatalog: VideoItem[] = [
  { id: 'v1', title: 'Inception', genre: 'Sci-Fi', thumbnailUrl: 'https://via.placeholder.com/300x170?text=Inception', duration: '2h 28m', year: 2010, rating: 'PG-13' },
  { id: 'v2', title: 'The Matrix', genre: 'Sci-Fi', thumbnailUrl: 'https://via.placeholder.com/300x170?text=The+Matrix', duration: '2h 16m', year: 1999, rating: 'R' },
  { id: 'v3', title: 'Interstellar', genre: 'Sci-Fi', thumbnailUrl: 'https://via.placeholder.com/300x170?text=Interstellar', duration: '2h 49m', year: 2014, rating: 'PG-13' },
  { id: 'v4', title: 'The Dark Knight', genre: 'Action', thumbnailUrl: 'https://via.placeholder.com/300x170?text=The+Dark+Knight', duration: '2h 32m', year: 2008, rating: 'PG-13' },
  { id: 'v5', title: 'Pulp Fiction', genre: 'Crime', thumbnailUrl: 'https://via.placeholder.com/300x170?text=Pulp+Fiction', duration: '2h 34m', year: 1994, rating: 'R' },
  { id: 'v6', title: 'Avengers: Endgame', genre: 'Action', thumbnailUrl: 'https://via.placeholder.com/300x170?text=Avengers', duration: '3h 1m', year: 2019, rating: 'PG-13' },
  { id: 'v7', title: 'Forrest Gump', genre: 'Drama', thumbnailUrl: 'https://via.placeholder.com/300x170?text=Forrest+Gump', duration: '2h 22m', year: 1994, rating: 'PG-13' },
  { id: 'v8', title: 'Fight Club', genre: 'Drama', thumbnailUrl: 'https://via.placeholder.com/300x170?text=Fight+Club', duration: '2h 19m', year: 1999, rating: 'R' },
];

// จำลองฐานข้อมูลสำหรับเก็บ Queue State ตาม userId
// รูปแบบ: { [userId]: { [videoId]: QueueItem } }
export const userQueues: Record<string, Record<string, QueueItem>> = {
  // ข้อมูลเริ่มต้นสำหรับผู้ใช้ "user1"
  'user1': {
    'v1': { videoId: 'v1', state: 'QUEUED', updatedAt: Date.now() },
    'v4': { videoId: 'v4', state: 'WATCHED', updatedAt: Date.now() },
  },
  'user2': {}
};
