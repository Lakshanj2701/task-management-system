# Task Management System

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing tasks with user authentication and role-based access control.

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | React 19, Vite, Tailwind CSS, Axios |
| Backend  | Node.js, Express 5                  |
| Database | MongoDB (Mongoose)                  |
| Auth     | JWT (jsonwebtoken), bcrypt          |

## Project Structure

```
task-management-system/
├── backend/
│   ├── controller/
│   │   ├── userConroller.js     # Register & Login logic
│   │   └── taskController.js    # Task CRUD logic
│   ├── models/
│   │   ├── user.js              # User schema
│   │   └── Task.js              # Task schema
│   ├── routes/
│   │   ├── userRouter.js        # Auth routes
│   │   └── taskRoutes.js        # Task routes
│   ├── index.js                 # Express entry point
│   └── .env                     # Environment variables (not committed)
└── frontend/
    └── src/
        ├── components/
        │   ├── Dashboard.jsx    # Main task dashboard
        │   ├── TaskForm.jsx     # Add / edit task form
        │   ├── TaskItem.jsx     # Single task card
        │   └── ProtectedRoute.jsx
        ├── context/
        │   └── AuthContext.jsx  # Auth state & API calls
        └── pages/
            ├── LandingPage.jsx
            ├── UnauthorizedPage.jsx
            ├── user/
            │   ├── LoginPage.jsx
            │   └── RegisterPage.jsx
            └── dashboard/
                ├── HomePage.jsx       # Citizen task view
                └── AdminDashboard.jsx # Admin panel
```

## Getting Started

### Prerequisites

- Node.js v18+
- A MongoDB Atlas cluster (or local MongoDB)

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=3000
MONGO_URL=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/taskdb?appName=Cluster0
JWT_SECRET=your_secret_key
```

Start the backend:

```bash
npm start
# Server runs on http://localhost:3000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

## API Endpoints

### Auth — `/api/users`

| Method | Endpoint           | Description           |
| ------ | ------------------ | --------------------- |
| POST   | `/api/users`       | Register a new user   |
| POST   | `/api/users/login` | Login and receive JWT |

**Register body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "secret123",
  "phoneNumber": "0771234567",
  "city": "Colombo",
  "district": "Western"
}
```

**Login body:**

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

### Tasks — `/api/tasks`

| Method | Endpoint         | Description                  |
| ------ | ---------------- | ---------------------------- |
| GET    | `/api/tasks`     | Get all tasks (newest first) |
| POST   | `/api/tasks`     | Create a new task            |
| PUT    | `/api/tasks/:id` | Update a task                |
| DELETE | `/api/tasks/:id` | Delete a task                |

**Create / Update body:**

```json
{
  "title": "Fix login bug",
  "description": "Optional details",
  "status": "Pending"
}
```

> `title` is required. `status` must be `"Pending"` or `"Completed"`.

## User Roles

| Role      | Default Route      | Access                    |
| --------- | ------------------ | ------------------------- |
| `citizen` | `/home`            | Task management dashboard |
| `admin`   | `/admin-dashboard` | Admin panel               |

## Features

- JWT authentication with token persisted in `localStorage`
- Role-based protected routes
- Full task CRUD with optimistic UI updates
- Filter tasks by All / Pending / Completed
- Visual indicators for completed tasks (green badge + strikethrough text)
- Mobile-responsive Tailwind CSS design
- Global error handler on backend
- `.env` excluded from git via `.gitignore`
