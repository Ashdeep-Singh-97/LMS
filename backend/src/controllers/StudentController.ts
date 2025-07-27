// controllers/StudentController.ts
import { Request, Response } from 'express';
import { Course } from '../models/Course';
import { User, IUserDocument } from '../models/User';

interface AuthRequest extends Request {
    user?: IUserDocument;
}

export const StudentController = {
    async enrollInCourse(req: AuthRequest, res: Response) {
        try {
            const user = req.user;

            if (!user || user.role !== 'student') {
                res.status(403).json({ message: 'Only students can enroll' });
            }
            else {
                const { courseId } = req.params;
                const course = await Course.findById(courseId);

                if (!course) {
                    res.status(404).json({ message: 'Course not found' });
                }
                else if (course.enrolledStudents.includes(user._id)) {
                    res.status(400).json({ message: 'Already enrolled in this course' });
                }
                else {
                    course.enrolledStudents.push(user._id);
                    await course.save();
                    await User.findByIdAndUpdate(user._id, {
                        $addToSet: { enrolledCourses: course._id }
                    });
                    res.status(200).json({ message: 'Enrollment successful' });
                }
            }
        } catch (err) {
            console.error('Enrollment error:', err);
            res.status(500).json({ message: 'Enrollment failed' });
        }
    },

    async enrolledCourses(req: AuthRequest, res: Response) {
        try {
            const user = req.user;
            if (!user || user.role !== 'student') {
                res.status(403).json({ message: 'Unauthorized' });
            }
            else {

                const courses = await Course.find({
                    _id: { $in: user.enrolledCourses },
                }).populate('teacher', 'name');
                console.log("courses",courses);
                res.status(200).json({ courses });
            }
        } catch (error) {
            console.error('Error fetching enrolled courses:', error);
            res.status(500).json({ message: 'Failed to fetch enrolled courses' });
        }

    },

    async unenrollFromCourse(req: AuthRequest, res: Response) {
  try {
    const user = req.user;
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
    }
    else{
        course.enrolledStudents = course.enrolledStudents.filter(
            (id) => id.toString() !== user?._id.toString()
        );
        await course.save();
        
        await User.findByIdAndUpdate(user?._id, {
            $pull: { enrolledCourses: course._id }
        });
        
        res.status(200).json({ message: 'Unenrolled successfully' });
    }
  } catch (err) {
    console.error('Unenroll error:', err);
    res.status(500).json({ message: 'Failed to unenroll' });
  }
}

};
