import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models/database';

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  db.get(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err: Error | null, user: any) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      const { password: _, ...userWithoutPassword } = user;
      res.json({ token, user: userWithoutPassword });
    }
  );
};

export const register = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, role, managerId } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    db.run(
      'INSERT INTO users (email, password, firstName, lastName, role, managerId) VALUES (?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, firstName, lastName, role, managerId],
      function(err: Error | null) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ message: 'Email already exists' });
          }
          return res.status(500).json({ message: 'Database error' });
        }

        res.status(201).json({
          id: this.lastID,
          email,
          firstName,
          lastName,
          role,
          managerId
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
