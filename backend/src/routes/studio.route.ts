// routes/studio.route.ts
import express from 'express';
import { protect } from '../middlewares/auth';
import { allowRoles } from '../middlewares/allowRoles';
import { StudioController } from '../controllers/StudioController';

const router = express.Router();

const controller = new StudioController();

router.use(protect);

router.post(
  '/',
  allowRoles('teacher'),
  controller.createStudio
);

router.get('/:inviteCode', allowRoles('student') ,controller.getStudioByInviteCode);

export default router;
