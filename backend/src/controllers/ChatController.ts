import { Request, Response } from 'express';

export class ChatController {
  async getMessages(req: Request, res: Response) {
    res.status(200).json({
      message: '🔒 You are authenticated!',
    });
  }
}
