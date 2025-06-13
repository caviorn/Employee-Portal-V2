import { Request, Response } from 'express';
import db from '../models/database';
import { AuthRequest } from '../middleware/auth';

export const getProfitLoss = (req: AuthRequest, res: Response) => {
  const { employeeId } = req.params;
  const currentUser = req.user;

  // Check permissions
  if (
    currentUser.role === 'EMPLOYEE' &&
    currentUser.id !== parseInt(employeeId)
  ) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  if (
    currentUser.role === 'MANAGER'
  ) {
    // Check if the employee reports to this manager
    db.get(
      'SELECT managerId FROM users WHERE id = ?',
      [employeeId],
      (err: Error | null, employee: any) => {
        if (err || !employee || employee.managerId !== currentUser.id) {
          return res.status(403).json({ message: 'Not authorized' });
        }
        fetchProfitLoss();
      }
    );
  } else {
    fetchProfitLoss();
  }

  function fetchProfitLoss() {
    db.all(
      'SELECT * FROM profit_loss_entries WHERE employeeId = ? ORDER BY date DESC',
      [employeeId],
      (err: Error | null, entries: any[]) => {
        if (err) {
          return res.status(500).json({ message: 'Database error' });
        }
        res.json(entries);
      }
    );
  }
};

export const addProfitLossEntry = (req: AuthRequest, res: Response) => {
  const {
    employeeId,
    date,
    hours,
    rate,
    amount,
    otherAmount,
    totalAmount,
    type,
    status,
    notes
  } = req.body;

  const currentUser = req.user;

  // Only admins and managers can add entries
  if (currentUser.role === 'EMPLOYEE') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  // For managers, check if they manage this employee
  if (currentUser.role === 'MANAGER') {
    db.get(
      'SELECT managerId FROM users WHERE id = ?',
      [employeeId],
      (err: Error | null, employee: any) => {
        if (err || !employee || employee.managerId !== currentUser.id) {
          return res.status(403).json({ message: 'Not authorized' });
        }
        insertEntry();
      }
    );
  } else {
    insertEntry();
  }

  function insertEntry() {
    db.run(
      `INSERT INTO profit_loss_entries 
      (employeeId, date, hours, rate, amount, otherAmount, totalAmount, type, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [employeeId, date, hours, rate, amount, otherAmount, totalAmount, type, status, notes],
      function(err: Error | null) {
        if (err) {
          return res.status(500).json({ message: 'Database error' });
        }
        res.status(201).json({
          id: this.lastID,
          employeeId,
          date,
          hours,
          rate,
          amount,
          otherAmount,
          totalAmount,
          type,
          status,
          notes
        });
      }
    );
  }
};

export const deleteProfitLossEntry = (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const currentUser = req.user;

  // First check if the entry exists and get its details
  db.get(
    'SELECT * FROM profit_loss_entries WHERE id = ?',
    [id],
    (err: Error | null, entry: any) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (!entry) {
        return res.status(404).json({ message: 'Entry not found' });
      }

      // Check permissions
      if (
        currentUser.role === 'EMPLOYEE' &&
        currentUser.id !== entry.employeeId
      ) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      if (currentUser.role === 'MANAGER') {
        // Check if the employee reports to this manager
        db.get(
          'SELECT managerId FROM users WHERE id = ?',
          [entry.employeeId],
          (err: Error | null, employee: any) => {
            if (err || !employee || employee.managerId !== currentUser.id) {
              return res.status(403).json({ message: 'Not authorized' });
            }
            deleteEntry();
          }
        );
      } else {
        deleteEntry();
      }
    }
  );

  function deleteEntry() {
    db.run(
      'DELETE FROM profit_loss_entries WHERE id = ?',
      [id],
      (err: Error | null) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to delete entry' });
        }
        res.status(200).json({ message: 'Entry deleted successfully' });
      }
    );
  }
};

export const updateProfitLossEntry = (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const currentUser = req.user;

  // First check if the entry exists and get its details
  db.get(
    'SELECT * FROM profit_loss_entries WHERE id = ?',
    [id],
    (err: Error | null, entry: any) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (!entry) {
        return res.status(404).json({ message: 'Entry not found' });
      }

      // Check permissions
      if (
        currentUser.role === 'EMPLOYEE' &&
        currentUser.id !== entry.employeeId
      ) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      if (currentUser.role === 'MANAGER') {
        // Check if the employee reports to this manager
        db.get(
          'SELECT managerId FROM users WHERE id = ?',
          [entry.employeeId],
          (err: Error | null, employee: any) => {
            if (err || !employee || employee.managerId !== currentUser.id) {
              return res.status(403).json({ message: 'Not authorized' });
            }
            updateEntry();
          }
        );
      } else {
        updateEntry();
      }
    }
  );

  function updateEntry() {
    db.run(
      'UPDATE profit_loss_entries SET status = ?, notes = ? WHERE id = ?',
      [status, notes, id],
      (err: Error | null) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to update entry' });
        }
        
        // Return the updated entry
        db.get(
          'SELECT * FROM profit_loss_entries WHERE id = ?',
          [id],
          (err: Error | null, entry: any) => {
            if (err) {
              return res.status(500).json({ message: 'Failed to fetch updated entry' });
            }
            res.json(entry);
          }
        );
      }
    );
  }
};
