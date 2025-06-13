# Employee Portal

A full-stack employee portal application with role-based access control and profit/loss tracking.

## Features

- User authentication and authorization
- Role-based access control (Admin, Manager, Employee)
- Employee management
- Profit and loss tracking
- Beautiful UI with Material-UI
- Real-time calculations and data visualization

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Project Structure

- `/client` - React frontend application
- `/server` - Node.js backend application

## Setup Instructions

1. Install root dependencies:
   ```bash
   npm install
   ```

2. Install client and server dependencies:
   ```bash
   npm run install-all
   ```

3. Create a `.env` file in the server directory with the following content:
   ```
   PORT=3001
   JWT_SECRET=your-secret-key-change-this-in-production
   DATABASE_PATH=employees.db
   ```

## Running the Application

1. Development mode (runs both client and server):
   ```bash
   npm run dev
   ```

   - Client will run on http://localhost:3000
   - Server will run on http://localhost:3001

2. Run client only:
   ```bash
   npm run client
   ```

3. Run server only:
   ```bash
   npm run server
   ```

## Default Users

After setting up the database, you can use these default credentials:

1. Admin User:
   - Email: admin@example.com
   - Password: admin123

2. Manager User:
   - Email: manager@example.com
   - Password: manager123

3. Employee User:
   - Email: employee@example.com
   - Password: employee123

## Features by Role

### Admin
- Full access to all features
- Can manage all employees
- Can view and edit all profit/loss entries
- Access to system-wide settings

### Manager
- Can manage their team members
- Can add/edit profit/loss entries for their team
- View team performance metrics

### Employee
- View their profile
- View their profit/loss entries
- Access their performance metrics

## Security Notes

1. Change the JWT_SECRET in production
2. Implement proper password policies
3. Use HTTPS in production
4. Regularly backup the SQLite database
