import { Request, Response } from 'express';
import { Course } from '../models/Course';
import { IUserDocument } from '../models/User';

export class CourseController {

    // ✅ Create a course (only teacher)
    async createCourse(req: Request, res: Response) {
        try {
            const user = req.user as IUserDocument;
            if (user.role !== 'teacher') {
                res.status(403).json({ message: 'Only teachers can create courses' });
            }
            else {
                const { title, description, category } = req.body;
                const course = await Course.create({
                    title,
                    description,
                    category,
                    teacher: user._id,
                    enrolledStudents: [],
                });
                await user.updateOne({ $push: { createdCourses: course._id } });
                res.status(201).json({ message: 'Course created successfully', course });
            }
        } catch (error) {
            console.error('Create course error:', error);
            res.status(500).json({ message: 'Something went wrong' });
        }
    }

    // ✅ Get all courses
    async getAllCourses(req: Request, res: Response) {
        try {
            const { page = 1, limit = 1, search = '' } = req.query;

            const query =
                search && typeof search === 'string'
                    ? {
                        $or: [
                            { title: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } },
                            { category: { $regex: search, $options: 'i' } },
                        ],
                    }
                    : {};
                    
            const total = await Course.countDocuments(query);
            const courses = await Course.find(query)
                .populate('teacher', 'name')
                .skip((+page - 1) * +limit)
                .limit(+limit);

            res.status(200).json({
                courses,
                total,
                page: +page,
                totalPages: Math.ceil(total / +limit),
            });
        } catch (error) {
            console.error('Get courses error:', error);
            res.status(500).json({ message: 'Failed to fetch courses' });
        }
    }

    // ✅ Get single course by ID
    async getCourseById(req: Request, res: Response) {
        try {
            const course = await Course.findById(req.params.id).populate('teacher', 'name');
            if (!course) {
                res.status(404).json({ message: 'Course not found' });
            }
            else {
                res.status(200).json(course);
            }
        } catch (error) {
            console.error('Get course error:', error);
            res.status(500).json({ message: 'Failed to fetch course' });
        }
    }

    // ✅ Delete a course (teacher or admin)
    async deleteCourse(req: Request, res: Response) {
        try {
            const user = req.user as IUserDocument;
            const course = await Course.findById(req.params.id);

            if (!course) {
                res.status(404).json({ message: 'Course not found' });
            }
            else if (user.role !== 'admin' && course.teacher.toString() !== user._id.toString()) {
                res.status(403).json({ message: 'Unauthorized' });
            }
            else {
                await course.deleteOne();
                res.status(200).json({ message: 'Course deleted' });
            }

        } catch (error) {
            console.error('Delete course error:', error);
            res.status(500).json({ message: 'Failed to delete course' });
        }
    }

    // ✅ Update course
    async updateCourse(req: Request, res: Response) {
        try {
            const user = req.user as IUserDocument;
            const course = await Course.findById(req.params.id);

            if (!course) {
                res.status(404).json({ message: 'Course not found' });
            }
            else if (user.role !== 'admin' && course.teacher.toString() !== user._id.toString()) {
                res.status(403).json({ message: 'Unauthorized' });
            }
            else {
                Object.assign(course, req.body);
                await course.save();
                res.status(200).json({ message: 'Course updated', course });
            }
        } catch (error) {
            console.error('Update course error:', error);
            res.status(500).json({ message: 'Failed to update course' });
        }
    }
}
