// controllers/TeacherDashboardController.ts
import { Request, Response } from 'express';
import { Course } from '../models/Course';
import { IUserDocument } from '../models/User';

interface AuthRequest extends Request {
    user?: IUserDocument;
}

export class TeacherDashboardController {
    async getTeacherCourses(req: AuthRequest, res: Response) {
        try {
            const user = req.user;

            if (!user || user.role !== 'teacher') {
                res.status(403).json({ message: 'Access denied. Not a teacher.' });
            }
            else {
                const courses = await Course.find({ teacher: user._id }).populate('enrolledStudents', 'name email');

                res.status(200).json({ courses });
            }
        } catch (err) {
            console.error('Teacher dashboard error:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }
}