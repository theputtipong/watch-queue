import { QueueService } from '../services/queue.service';
import { userQueues } from '../store/in-memory.db';

describe('QueueService', () => {
  let queueService: QueueService;

  beforeEach(() => {
    queueService = new QueueService();
    // รีเซ็ตข้อมูล mock ก่อนแต่ละการทดสอบ
    for (const key in userQueues) {
      delete userQueues[key];
    }
  });

  it('should return empty array for unknown user', () => {
    const queue = queueService.getQueue('unknown_user');
    expect(queue).toEqual([]);
  });

  it('should allow valid state transition (UNSAVED -> QUEUED)', () => {
    const result = queueService.upsertQueueItem('test_user', 'v1', 'QUEUED');
    expect(result.state).toBe('QUEUED');
    expect(userQueues['test_user']['v1'].state).toBe('QUEUED');
  });

  it('should throw error for invalid state transition (UNSAVED -> WATCHED)', () => {
    expect(() => {
      queueService.upsertQueueItem('test_user', 'v1', 'WATCHED');
    }).toThrow('Invalid state transition from UNSAVED to WATCHED');
  });

  it('should remove item when transitioned to UNSAVED', () => {
    // 1. ตั้งค่าเป็น QUEUED ก่อน
    queueService.upsertQueueItem('test_user', 'v1', 'QUEUED');
    // 2. เปลี่ยนเป็น UNSAVED
    const result = queueService.upsertQueueItem('test_user', 'v1', 'UNSAVED');
    
    expect(result.state).toBe('UNSAVED');
    // ต้องถูกลบออกจาก memory
    expect(userQueues['test_user']['v1']).toBeUndefined();
  });
});
