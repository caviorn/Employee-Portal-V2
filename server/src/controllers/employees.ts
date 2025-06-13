import { Request, Response } from 'express';
import db from '../models/database';
import { AuthRequest } from '../middleware/auth';

export const getEmployees = (req: AuthRequest, res: Response) => {
  const { role, id } = req.user;

  let query = 'SELECT id, email, firstName, lastName, role, managerId FROM users';
  const params: any[] = [];

  if (role === 'MANAGER') {
    query += ' WHERE managerId = ?';
    params.push(id);
  }

  db.all(query, params, (err: Error | null, employees: any[]) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(employees);
  });
};

export const updateEmployee = (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, role, managerId } = req.body;
  const currentUser = req.user;

  // Check permissions
  if (currentUser.role === 'MANAGER') {
    db.get(
      'SELECT managerId FROM users WHERE id = ?',
      [id],
      (err: Error | null, employee: any) => {
        if (err || !employee || employee.managerId !== currentUser.id) {
          return res.status(403).json({ message: 'Not authorized' });
        }
        updateEmployeeDetails();
      }
    );
  } else if (currentUser.role === 'ADMIN') {
    updateEmployeeDetails();
  } else {
    return res.status(403).json({ message: 'Not authorized' });
  }

  function updateEmployeeDetails() {
    db.run(
      'UPDATE users SET firstName = ?, lastName = ?, role = ?, managerId = ? WHERE id = ?',
      [firstName, lastName, role, managerId, id],
      (err: Error | null) => {
        if (err) {
          return res.status(500).json({ message: 'Database error' });
        }
        res.json({ id, firstName, lastName, role, managerId });
      }
    );
  }
};
