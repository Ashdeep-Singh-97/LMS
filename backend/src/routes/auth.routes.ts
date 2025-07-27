import express from 'express';
import { UserController } from '../controllers/UserController';
import {protect} from '../middlewares/auth';

const router = express.Router();
const controller = new UserController();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/google', controller.googleLogin);
router.post('/logout', controller.logout);
router.post('/verify', protect, controller.verify);

export default router;
