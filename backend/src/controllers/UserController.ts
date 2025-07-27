import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { verifyGoogleToken } from '../utils/googleAuth';

export class UserController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body; // ✅ role destructured

      // ✅ 1. Check if email exists
      const existing = await User.findOne({ email });
      if (existing) {
        res.status(400).json({ message: 'Email already registered' });
      }
      else {
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed, role }); // ✅ role added
        const token = generateToken(user._id.toString(), user.role);

        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.cookie('isLoggedIn', 'true', {
          httpOnly: false,
          secure: true,
          sameSite: 'strict',
        });

        res.status(201).json({ token, user });
      }
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user || !user.password) {
        res.status(400).json({ message: 'Invalid email or password' });
      }
      else {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          res.status(400).json({ message: 'Invalid email or password' });
        }
        else {
          const token = generateToken(user._id.toString(), user.role);

          res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
          });
          res.cookie('isLoggedIn', 'true', {
            httpOnly: false,
            secure: true,
            sameSite: 'strict',
          });

          res.status(200).json({ token, user });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  }

  async googleLogin(req: Request, res: Response) {
    const { token, role } = req.body;
    try {
      const googleUser = await verifyGoogleToken(token);

      let user = await User.findOne({ oauthId: googleUser.googleId });

      if (!user) {
        user = await User.create({
          name: googleUser.displayName,
          email: googleUser.email,
          role: role, // default role for OAuth users
          oauthProvider: 'google',
          oauthId: googleUser.googleId,
        });
      }
      const tokenNew = generateToken(user._id.toString(), user.role);

      res.cookie('token', tokenNew, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      res.cookie('isLoggedIn', 'true', {
        httpOnly: false,
        secure: true,
        sameSite: 'strict',
      });

      res.status(201).json({ tokenNew, user });
    } catch (error) {
      res.status(401).json({ error: 'Authentication failed' });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      res.clearCookie('isLoggedIn', {
        httpOnly: false,
        secure: true,
        sameSite: 'strict',
      });

      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  }

  verify(req: Request, res: Response) {
    try {
      const user = req.user; // Assuming you attach user in middleware

      const requestedRole = req.body.role;

      if (!user) {
        res.status(401).json({ verified: false });
      }
      else  if (requestedRole && user.role !== requestedRole) {
      res.status(403).json({ verified: false });
    }
      else {
        res.status(200).json({ "verified": true });
      }
    } catch (error) {
      console.log("error : ", error);
      res.status(401).json({ error: 'Authentication failed' });
    }
  }
}
