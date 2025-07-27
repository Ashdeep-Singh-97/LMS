import { Request, Response } from 'express';
import { Studio } from '../models/Studio';
import { nanoid } from 'nanoid';
import { IUserDocument } from '../models/User';

interface AuthRequest extends Request {
    user?: IUserDocument;
}

export class StudioController {
    async createStudio(req: AuthRequest, res: Response) {
        try {
            const user = req.user;
            if (!user || user.role !== 'teacher') {
                res.status(403).json({ message: 'Only teachers can create studios' });
            }
            else {


                const { name } = req.body;
                const inviteCode = nanoid(10);

                const studio = await Studio.create({
                    name,
                    host: user._id,
                    inviteCode
                });

                res.status(201).json({
                    message: 'Studio created successfully',
                    studioLink: `http://localhost:5173/studio/${inviteCode}`,
                    studio,
                });
            }
        } catch (err) {
            console.error('Create studio error:', err);
            res.status(500).json({ message: 'Failed to create studio' });
        }
    }

    async getStudioByInviteCode(req: Request, res: Response) {
        try {
            const { inviteCode } = req.params;

            const studio = await Studio.findOne({ inviteCode }).populate('host', 'name email');

            if (!studio) {
                res.status(404).json({ message: 'Studio not found' });
            }
            else {
                res.status(200).json({ studio });
            }
        } catch (error) {
            console.error('Get studio error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
};
