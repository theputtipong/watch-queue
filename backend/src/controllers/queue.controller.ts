import { Request, Response } from 'express';
import { queueService } from '../services/queue.service';
import { QueueState } from '../types';

export class QueueController {
  public getQueue = (req: Request, res: Response): void => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        res.status(400).json({ message: 'userId is required' });
        return;
      }
      const queue = queueService.getQueue(userId);
      res.status(200).json(queue);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public upsertQueueItem = (req: Request, res: Response): void => {
    try {
      const { userId, videoId, state } = req.body;
      
      if (!userId || !videoId || !state) {
        res.status(400).json({ message: 'userId, videoId, and state are required' });
        return;
      }

      const updatedItem = queueService.upsertQueueItem(userId, videoId, state as QueueState);
      res.status(200).json(updatedItem);
    } catch (error: any) {
      // ส่ง 400 ถ้า State เปลี่ยนแปลงไม่ถูกต้องหรืออ้างอิงวิดีโอที่ไม่มีอยู่จริง
      res.status(400).json({ message: error.message });
    }
  };

  public removeQueueItem = (req: Request, res: Response): void => {
    try {
      const { userId, videoId } = req.body;
      
      if (!userId || !videoId) {
        res.status(400).json({ message: 'userId and videoId are required' });
        return;
      }

      queueService.removeQueueItem(userId, videoId);
      // ส่ง 200 เสมอเนื่องจากเป็น Idempotent
      res.status(200).json({ message: 'Item removed successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}

export const queueController = new QueueController();
