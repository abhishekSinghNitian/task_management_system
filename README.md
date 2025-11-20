# Task Management System

A full-stack Task Management System built with **Next.js**, **Node.js**, **Express**, **Prisma**, and **SQLite**.

## Features

- **Authentication**: Secure Login and Registration using JWT (Access + Refresh tokens).
- **Task Management**: Create, Read, Update, and Delete (CRUD) tasks.
- **Dashboard**: Responsive dashboard with task filtering, searching, and pagination.
- **Tech Stack**:
  - **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS.
  - **Backend**: Node.js, Express, TypeScript, Prisma, SQLite.

## Getting Started

### Prerequisites

- Node.js (v18+ or v20+)
- npm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd task_management_system
    ```

2.  **Setup Backend:**
    ```bash
    cd backend
    npm install
    # The .env file is pre-configured for development with SQLite
    npx prisma generate
    npx prisma db push
    npm run dev
    ```
    The backend will run on `http://localhost:5000`.

3.  **Setup Frontend:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    The frontend will run on `http://localhost:3000`.

## API Endpoints

-   `POST /auth/register`: Register a new user.
-   `POST /auth/login`: Login and receive tokens.
-   `GET /tasks`: Fetch tasks (supports pagination, search, filter).
-   `POST /tasks`: Create a new task.
-   `PATCH /tasks/:id`: Update a task.
-   `DELETE /tasks/:id`: Delete a task.

## License

This project is open source and available under the [MIT License](LICENSE).