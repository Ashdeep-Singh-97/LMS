import express from 'express';
import authRoutes from './auth.routes';
import chatRoutes from './chat.routes';
import courseRoutes from './course.routes';
import teacherRoutes from './teacher.routes';
import studentRoutes from './student.route';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/chat', chatRoutes);
router.use('/courses', courseRoutes);
router.use('/teacher', teacherRoutes);
router.use('/student', studentRoutes);

export default router;
