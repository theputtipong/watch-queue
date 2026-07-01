import { mockCatalog } from '../store/in-memory.db';
import { VideoItem } from '../types';

export class ContentService {
  /**
   * ดึงข้อมูลวิดีโอทั้งหมด รองรับการค้นหา (search) และกรองหมวดหมู่ (genre)
   */
  public getContents(search?: string, genre?: string): VideoItem[] {
    let result = mockCatalog;

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(item => item.title.toLowerCase().includes(lowerSearch));
    }

    if (genre && genre !== 'All') {
      result = result.filter(item => item.genre === genre);
    }

    return result;
  }
}

export const contentService = new ContentService();
