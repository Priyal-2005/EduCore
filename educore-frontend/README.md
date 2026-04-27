# EduCore Frontend

A production-grade React Admin Dashboard demonstrating proper state management, API integration, and modern UI.

## Tech Stack
- **React 18** (Vite)
- **TypeScript** (Strict Mode)
- **Zustand** (Global State Management)
- **Tailwind CSS + shadcn/ui** (Styling)
- **React Router v6** (Protected Routes)
- **Axios** (API Client with Interceptors)

## Setup
Once your network is restored:

1. `npm install`
2. `npm run dev`

The app will run at `http://localhost:5173`.
It expects the backend to be running on `http://localhost:3000`.

## Architecture Features
1. **API Interceptor**: Automatically injects JWT token into `Authorization` headers and intercepts 401s globally.
2. **Zustand Store**: Clean separation of state logic. E.g., `timetableStore` handles API calls and sets `error` state when the backend throws a 409 Conflict.
3. **Protected Layout**: `MainLayout` requires authentication. Unauthenticated users are forced to `/login`.
