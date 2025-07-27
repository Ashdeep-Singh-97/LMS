// controllers/LessonController.ts
import { Request, Response } from 'express';
import { Lesson } from '../models/Lessons';
import { Course } from '../models/Course';
import { IUserDocument } from '../models/User';
import { Types } from 'mongoose';

interface AuthRequest extends Request {
    user?: IUserDocument;
}

export class LessonController {
    // ✅ Create Lesson
    async create(req: AuthRequest, res: Response) {
        try {
            const { courseId } = req.params;
            const { title, content, videoUrl, duration } = req.body;
            const user = req.user;

            const course = await Course.findById(courseId);
            if (!course) res.status(404).json({ message: 'Course not found' });

            else if (user?.role !== 'teacher' || course.teacher.toString() !== user._id.toString()) {
                res.status(403).json({ message: 'Unauthorized' });
            }
            else {

                const lesson = await Lesson.create({
                    title,
                    content,
                    videoUrl,
                    duration,
                    course: course._id
                });
                course.lessons.push(lesson._id as Types.ObjectId);
                await course.save();
                res.status(201).json({ message: 'Lesson created', lesson });
            }
        } catch (err) {
            console.error('Create lesson error:', err);
            res.status(500).json({ message: 'Failed to create lesson' });
        }
    }

    // ✅ Get All Lessons of a Course
    async getAll(req: Request, res: Response) {
        try {
            const { courseId } = req.params;
            const lessons = await Lesson.find({ course: courseId });
            res.status(200).json({ lessons });
        } catch (err) {
            console.error('Get lessons error:', err);
            res.status(500).json({ message: 'Failed to fetch lessons' });
        }
    }

    // ✅ Get Single Lesson
    async getOne(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const lesson = await Lesson.findById(id);
            if (!lesson) res.status(404).json({ message: 'Lesson not found' });
            else {
                res.status(200).json({ lesson });
            }
        } catch (err) {
            console.error('Get single lesson error:', err);
            res.status(500).json({ message: 'Failed to fetch lesson' });
        }
    }

    // ✅ Update Lesson
    async update(req: AuthRequest, res: Response) {
        try {
            const { courseId, id } = req.params;
            const user = req.user;

            const lesson = await Lesson.findById(id);
            if (!lesson || lesson.course.toString() !== courseId) {
                res.status(404).json({ message: 'Lesson not found for this course' });
            }
            else {
                const course = await Course.findById(courseId);
                if (!course || course.teacher.toString() !== user?._id.toString()) {
                    res.status(403).json({ message: 'Unauthorized' });
                }
                else {
                    Object.assign(lesson, req.body);
                    await lesson.save();
                    res.status(200).json({ message: 'Lesson updated', lesson });
                }
            }
        } catch (err) {
            console.error('Update lesson error:', err);
            res.status(500).json({ message: 'Failed to update lesson' });
        }
    }

    // ✅ Delete Lesson
    async delete(req: AuthRequest, res: Response) {
        try {
            const { courseId, id } = req.params;
            const user = req.user;

            const lesson = await Lesson.findById(id);
            if (!lesson || lesson.course.toString() !== courseId) {
                res.status(404).json({ message: 'Lesson not found for this course' });
            }
            else {
                const course = await Course.findById(courseId);
                if (!course || course.teacher.toString() !== user?._id.toString()) {
                    res.status(403).json({ message: 'Unauthorized' });
                }

                await lesson.deleteOne();
                await Course.findByIdAndUpdate(courseId, {
                    $pull: { lessons: lesson._id }
                });

                res.status(200).json({ message: 'Lesson deleted' });
            }
        } catch (err) {
            console.error('Delete lesson error:', err);
            res.status(500).json({ message: 'Failed to delete lesson' });
        }
    }
};
