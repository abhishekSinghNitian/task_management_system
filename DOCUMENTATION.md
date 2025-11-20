# Task Management System Documentation

## Overview
This is a full-stack Task Management System built with **Next.js (Frontend)** and **Node.js/Express (Backend)**. It features secure authentication (JWT), task CRUD operations, and a responsive UI.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Axios, React Hook Form.
- **Backend**: Node.js, Express, TypeScript, Prisma, SQLite.
- **Authentication**: JWT (Access + Refresh Tokens), bcryptjs.

## Setup & Installation

### Prerequisites
- Node.js (v18+ or v20+)
- npm

### Backend Setup
1. Navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup Environment Variables:
   - Create `.env` file (already created):
     ```env
     PORT=5000
     DATABASE_URL="file:./dev.db"
     JWT_SECRET="supersecretkey"
     JWT_REFRESH_SECRET="supersecretrefreshkey"
     ```
4. Initialize Database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Start Server:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`.

### Frontend Setup
1. Navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Development Server:
   ```bash
   npm run dev
   ```
   App runs on `http://localhost:3000`.

## Features & Usage

### Authentication
- **Register**: Create a new account at `/auth/register`.
- **Login**: Access your account at `/auth/login`.
- **Logout**: Securely log out from the dashboard.
- **Security**: Access tokens expire in 15m, refresh tokens in 7d.

### Task Management
- **Dashboard**: View all tasks with pagination.
- **Create**: Click "New Task" to add a task.
- **Edit**: Click "Edit" on any task card.
- **Delete**: Click "Delete" to remove a task.
- **Toggle Status**: Click "Complete/Undo" to change status.
- **Search & Filter**: Use the search bar and status dropdown to filter tasks.

## API Endpoints

### Auth
- `POST /auth/register`: Register user.
- `POST /auth/login`: Login user.
- `POST /auth/refresh`: Refresh access token.

### Tasks
- `GET /tasks`: List tasks (query: page, limit, status, search).
- `POST /tasks`: Create task.
- `PATCH /tasks/:id`: Update task.
- `DELETE /tasks/:id`: Delete task.
- `PATCH /tasks/:id/toggle`: Toggle task status.
