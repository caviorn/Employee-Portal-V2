import { Database } from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../employees.db');
const db = new Database(dbPath);

// Create tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    role TEXT NOT NULL,
    managerId INTEGER,
    FOREIGN KEY (managerId) REFERENCES users(id)
  )`);

  // Profit/Loss entries table
  db.run(`CREATE TABLE IF NOT EXISTS profit_loss_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employeeId INTEGER NOT NULL,
    date TEXT NOT NULL,
    hours REAL,
    rate REAL,
    amount REAL NOT NULL,
    otherAmount REAL,
    totalAmount REAL NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    notes TEXT,
    FOREIGN KEY (employeeId) REFERENCES users(id)
  )`);
});

export default db;
