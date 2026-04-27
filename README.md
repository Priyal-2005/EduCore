# EduCore — School Management System

A production-grade, full-stack school management platform demonstrating strict architectural patterns, robust type safety, and clean engineering practices. 

## Architecture & Tech Stack

This repository is organized into a **monorepo-style** structure with distinct frontend and backend codebases.

### 🔙 Backend (`/backend`)
- **Node.js + Express**
- **TypeScript** (Strict mode)
- **PostgreSQL** + **Prisma ORM**
- **Strict MVC + Repository Pattern**: Total separation between controllers, pure business logic services, and database-only repositories.
- **Zod** request validation
- **JWT** Authentication
- Swagger API Documentation

### 💻 Frontend (`/educore-frontend`)
- **React 18** + **Vite**
- **TypeScript**
- **React state management** (`useState`, `useContext`) instead of external libraries to ensure a clean, zero-dependency data flow.
- **Tailwind CSS + shadcn/ui**
- **Axios** (with JWT interceptors for auto-auth)
- **React Router v6** (Protected routes and layouts)

## Features

- **RBAC**: Admin, Teacher, Student, Parent roles.
- **Timetable Conflict Detection**: A specialized half-open interval algorithm prevents double-booking of teachers or classes.
- **Grade Calculations**: Automated subject-level and overall averages.
- **Attendance Tracking**: Individual and bulk attendance features.
- **Dynamic Dashboard**: Full analytics and metrics view in React.

## Local Development

### 1. Backend Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed     # Populates DB with mock users and data
npm run dev      # Starts server on http://localhost:5001
```

### 2. Frontend Setup
```bash
cd educore-frontend
npm install
npm run dev      # Starts React app on http://localhost:5173
```

## System Requirements
- Node.js 18+
- PostgreSQL instance running locally (update `.env` accordingly)
