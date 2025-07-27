import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUserDocument } from '../models/User';

interface DecodedToken {
    id: string;
    role: 'student' | 'teacher' | 'admin';
}

interface AuthRequest extends Request {
    user?: IUserDocument;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Not authorized' });
    }
    else {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
            const user = await User.findById(decoded.id);
            if (!user) {
                res.status(401).json({ message: 'User not found' });
            }
            else
            {
                req.user = user;
                next();
            }
        } catch (error) {
            res.status(401).json({ message: 'Invalid or expired token' });
        }
    }
};
