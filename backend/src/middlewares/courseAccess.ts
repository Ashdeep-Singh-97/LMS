import { Request, Response, NextFunction } from 'express';
import { Course } from '../models/Course';
import { IUserDocument } from '../models/User';

interface AuthRequest extends Request {
    user?: IUserDocument;
}

export const canAccessCourse = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { courseId } = req.params;
        const user = req.user;

        const course = await Course.findById(courseId);

        if (!course) {
            res.status(404).json({ message: 'Course not found' });
        }
        else {
            const isTeacher = course.teacher.toString() === user?._id.toString();
            const isEnrolled = course.enrolledStudents.some(id => id.toString() === user?._id.toString());
            const isAdmin = user?.role === 'admin';

            if (isTeacher || isEnrolled || isAdmin) {
                next();
            } else {
                res.status(403).json({ message: 'You are not authorized to view this course\'s lessons' });
            }
        }
    } catch (error) {
        console.error('Access check failed:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
