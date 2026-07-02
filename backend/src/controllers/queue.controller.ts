import { Request, Response } from 'express';
import { queueService } from '../services/queue.service';
import { z } from 'zod';

// สร้าง Zod Schemas
const getQueueSchema = z.object({
  userId: z.string().min(1, 'userId is required and cannot be empty'),
});

const upsertQueueSchema = z.object({
  userId: z.string().min(1, 'userId is required and cannot be empty'),
  videoId: z.string().min(1, 'videoId is required'),
  state: z.enum(['UNSAVED', 'QUEUED', 'WATCHED']),
});

const removeQueueSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  videoId: z.string().min(1, 'videoId is required'),
});

export class QueueController {
  public getQueue = (req: Request, res: Response): void => {
    try {
      const { userId } = getQueueSchema.parse(req.query);
      const queue = queueService.getQueue(userId);
      res.status(200).json(queue);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: (error as z.ZodError<any>).issues[0]?.message || 'Validation error' });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public upsertQueueItem = (req: Request, res: Response): void => {
    try {
      const { userId, videoId, state } = upsertQueueSchema.parse(req.body);
      
      const updatedItem = queueService.upsertQueueItem(userId, videoId, state);
      res.status(200).json(updatedItem);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: (error as z.ZodError<any>).issues[0]?.message || 'Validation error' });
        return;
      }
      // ส่ง 400 ถ้า State เปลี่ยนแปลงไม่ถูกต้องหรืออ้างอิงวิดีโอที่ไม่มีอยู่จริง
      res.status(400).json({ message: error.message });
    }
  };

  public removeQueueItem = (req: Request, res: Response): void => {
    try {
      const { userId, videoId } = removeQueueSchema.parse(req.body);

      queueService.removeQueueItem(userId, videoId);
      // ส่ง 200 เสมอเนื่องจากเป็น Idempotent
      res.status(200).json({ message: 'Item removed successfully' });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: (error as z.ZodError<any>).issues[0]?.message || 'Validation error' });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}

export const queueController = new QueueController();
