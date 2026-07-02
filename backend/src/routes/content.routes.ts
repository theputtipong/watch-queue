import { Router } from 'express';
import { contentController } from '../controllers/content.controller';
const router = Router();
router.get('/', contentController.getContents);
export default router;
