// routes/lessonRoutes.ts
import express from 'express';
import { LessonController } from '../controllers/LessonController';
import { canAccessCourse } from '../middlewares/courseAccess';
import { protect } from '../middlewares/auth';

const router = express.Router({ mergeParams: true });
const controller = new LessonController();

// Nested under /api/courses
router.post('/', protect, canAccessCourse, controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.put('/:id', protect, canAccessCourse, controller.update);
router.delete('/:id', protect, canAccessCourse, controller.delete);

export default router;
