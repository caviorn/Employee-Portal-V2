import { Request, Response } from 'express';
import db from '../models/database';
const nodemailer = require('nodemailer');

export const exportUserLogins = async (req: Request, res: Response) => {
  const { email, userIds, body } = req.body;
  if (!email || !userIds || !Array.isArray(userIds)) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  db.all(
    `SELECT email, firstName, lastName FROM users WHERE id IN (${userIds.map(() => '?').join(',')})`,
    userIds,
    async (err, users: { email: string; firstName: string; lastName: string }[]) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      if (!users || users.length === 0) return res.status(404).json({ message: 'No users found' });

      const userList = users.map(u => `${u.firstName} ${u.lastName} (${u.email})`).join('\n');
      const mailText = `${body}\n\nSelected Users:\n${userList}`;

      // Configure your SMTP transporter (update with your real SMTP credentials)
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.example.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER || 'user@example.com',
          pass: process.env.SMTP_PASS || 'password',
        },
      });

      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || 'noreply@yourdomain.com',
          to: email,
          subject: 'Exported User Logins',
          text: mailText,
        });
        res.json({ message: 'Email sent' });
      } catch (e) {
        res.status(500).json({ message: 'Failed to send email', error: e });
      }
    }
  );
};
