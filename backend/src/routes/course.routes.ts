import express from 'express';
import { protect } from '../middlewares/auth';
import { allowRoles } from '../middlewares/allowRoles';
import { CourseController } from '../controllers/CourseController';
import LessonRoutes from './lesson.route';

const router = express.Router();
const controller = new CourseController();

// ✅ Public: anyone can view courses
router.get('/', controller.getAllCourses);

// ✅ Public: view a specific course by ID
router.get('/:id', controller.getCourseById);

// 🔒 Update course (teacher who created it or admin)
router.put(
    '/:id',
    protect,
    allowRoles('teacher', 'admin'),
    controller.updateCourse
);

// 🔒 Only teachers can create courses
router.post(
  '/',
  protect,
  allowRoles('teacher'),
  controller.createCourse
);

// 🔒 Delete course (teacher or admin)
router.delete(
    '/:id',
    protect,
    allowRoles('teacher', 'admin'),
    controller.deleteCourse
);

router.use('/:courseId/lessons', LessonRoutes);

export default router;
