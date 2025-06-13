import bcrypt from 'bcryptjs';
import db from '../models/database';

const initializeDatabase = async () => {
  const salt = await bcrypt.genSalt(10);
  const defaultUsers = [
    {
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', salt),
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      managerId: null,
    },
    {
      email: 'manager@example.com',
      password: await bcrypt.hash('manager123', salt),
      firstName: 'Manager',
      lastName: 'User',
      role: 'MANAGER',
      managerId: null,
    },
    {
      email: 'employee@example.com',
      password: await bcrypt.hash('employee123', salt),
      firstName: 'Employee',
      lastName: 'User',
      role: 'EMPLOYEE',
      managerId: 2, // Will be managed by the manager user
    },
  ];

  try {
    for (const user of defaultUsers) {
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO users (email, password, firstName, lastName, role, managerId) VALUES (?, ?, ?, ?, ?, ?)',
          [user.email, user.password, user.firstName, user.lastName, user.role, user.managerId],
          (err) => {
            if (err) reject(err);
            else resolve(null);
          }
        );
      });
    }
    console.log('Default users created successfully');
  } catch (error) {
    console.error('Error creating default users:', error);
  }
};

initializeDatabase();
