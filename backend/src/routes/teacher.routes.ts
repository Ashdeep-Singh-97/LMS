import express from 'express';
import { TeacherDashboardController } from '../controllers/TeacherDashboardController';
import { protect } from '../middlewares/auth';
import { allowRoles } from '../middlewares/allowRoles';

const router = express.Router();
const controller = new TeacherDashboardController();

router.use(protect);

router.get('/getCourses', allowRoles('teacher'), controller.getTeacherCourses);

export default router;
