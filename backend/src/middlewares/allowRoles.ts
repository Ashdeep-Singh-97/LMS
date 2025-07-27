import { Request, Response, NextFunction } from 'express';

export const allowRoles = (...roles: ('student' | 'teacher' | 'admin')[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // console.log("req.user.role ", req?.user?.role);
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden: Access denied' });
      return; // ✅ ensure exit
    }
    next();
  };
};
