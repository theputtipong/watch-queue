import { Router } from 'express';
import { queueController } from '../controllers/queue.controller';

const router = Router();

// GET /api/queue?userId={id}
router.get('/', queueController.getQueue);

// PUT /api/queue
router.put('/', queueController.upsertQueueItem);

// DELETE /api/queue
router.delete('/', queueController.removeQueueItem);

export default router;
