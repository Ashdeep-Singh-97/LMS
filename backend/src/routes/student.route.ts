import express from 'express';
import { StudentController } from '../controllers/StudentController';
import { protect } from '../middlewares/auth';
import { allowRoles } from '../middlewares/allowRoles';

const router = express.Router();

// Only students can enroll
router.post(
  '/enroll/:courseId',
  protect,
  allowRoles('student'),
  StudentController.enrollInCourse
);

router.get(
  '/enrolledCourses',
  protect,
  allowRoles('student'),
  StudentController.enrolledCourses
)

router.post(
  '/unenroll/:courseId',
  protect,
  allowRoles('student'),
  StudentController.unenrollFromCourse
);

export default router;
