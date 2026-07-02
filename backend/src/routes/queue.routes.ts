import { Router } from 'express';
import { queueController } from '../controllers/queue.controller';
const router = Router();
router.get('/', queueController.getQueue);
router.put('/', queueController.upsertQueueItem);
router.delete('/', queueController.removeQueueItem);
export default router;
