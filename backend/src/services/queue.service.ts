import { userQueues, mockCatalog } from '../store/in-memory.db';
import { QueueItem, QueueState } from '../types';

export class QueueService {
  /**
   * ดึงข้อมูล Queue ของ User
   * หากไม่พบ User ระบบจะคืนค่าเป็น Array เปล่าเสมอ (ไม่ใช้ 404 ตามข้อกำหนด)
   */
  public getQueue(userId: string): QueueItem[] {
    const queueMap = userQueues[userId];
    if (!queueMap) return [];
    return Object.values(queueMap);
  }

  /**
   * สร้างหรืออัปเดตสถานะของวิดีโอใน Queue
   * รับประกันว่าต้องข้าม State ตามลำดับเท่านั้น หรือตามกฎเกณฑ์ (UNSAVED -> QUEUED -> WATCHED -> UNSAVED)
   */
  public upsertQueueItem(userId: string, videoId: string, state: QueueState): QueueItem {
    // ตรวจสอบว่าวิดีโอมีอยู่จริงหรือไม่
    const videoExists = mockCatalog.some(v => v.id === videoId);
    if (!videoExists) {
      throw new Error(`Video ID ${videoId} not found in catalog.`);
    }

    if (!userQueues[userId]) {
      userQueues[userId] = {};
    }

    const currentItem = userQueues[userId][videoId];
    const currentState = currentItem ? currentItem.state : 'UNSAVED';

    // ตรวจสอบสถานะการเปลี่ยน (State Machine Validation)
    this.validateStateTransition(currentState, state);

    // หากเปลี่ยนเป็น UNSAVED สามารถเลือกลบออกจาก Store ได้เลยเพื่อประหยัดพื้นที่
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

  /**
   * ลบ Item ออกจาก Queue
   * Idempotent: ทำกี่ครั้งก็ได้ผลเหมือนเดิม (ไม่ Error ถ้าไม่มีข้อมูล)
   */
  public removeQueueItem(userId: string, videoId: string): void {
    if (userQueues[userId] && userQueues[userId][videoId]) {
      delete userQueues[userId][videoId];
    }
  }

  /**
   * ฟังก์ชันตรวจสอบว่า State ปัจจุบันสามารถเปลี่ยนไป State ใหม่ได้หรือไม่
   */
  private validateStateTransition(current: QueueState, next: QueueState) {
    if (current === next) return; // ยอมให้ส่ง State เดิมซ้ำมาได้

    const validTransitions: Record<QueueState, QueueState[]> = {
      UNSAVED: ['QUEUED'],
      QUEUED: ['WATCHED', 'UNSAVED'], // อนุญาตให้เปลี่ยนกลับเป็น UNSAVED ได้
      WATCHED: ['UNSAVED'],
    };

    if (!validTransitions[current].includes(next)) {
      throw new Error(`Invalid state transition from ${current} to ${next}`);
    }
  }
}

export const queueService = new QueueService();
