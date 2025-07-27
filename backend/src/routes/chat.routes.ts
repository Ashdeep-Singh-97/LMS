import express from 'express';
import { protect } from '../middlewares/auth';
import { ChatController } from '../controllers/ChatController';
import { allowRoles } from '../middlewares/allowRoles';

const router = express.Router();
const controller = new ChatController();

// ✅ Apply middleware to the whole router
router.use(protect);

router.get('/messages', allowRoles('admin'), controller.getMessages);
// You can add more like:
// router.post('/send', controller.sendMessage);

export default router;
