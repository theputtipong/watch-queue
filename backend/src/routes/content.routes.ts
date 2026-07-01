import { Router } from 'express';
import { contentController } from '../controllers/content.controller';

const router = Router();

// GET /api/contents (รองรับ query ?search= และ ?genre=)
router.get('/', contentController.getContents);

export default router;
