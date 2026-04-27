# EduCore — School Management System Backend

A production-grade school management API demonstrating **strict MVC + Repository architecture**, TypeScript interfaces, and deliberate design patterns.

## 🏗️ Architecture

```
Route → Middleware → Controller → Service → Repository → Database
         (Auth)       (HTTP)      (Logic)    (Prisma)     (PostgreSQL)
```

**Rule**: Each layer has ONE job. Controllers never touch Prisma. Services never touch HTTP. Repositories never contain business logic.

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| TypeScript (strict) | Type safety |
| Express.js | HTTP framework |
| PostgreSQL | Relational database |
| Prisma ORM | Database access |
| Zod | Request validation |
| JWT + bcrypt | Authentication |
| Swagger/OpenAPI | API documentation |
| Winston | Structured logging |

## 📋 Features

- **Student Enrollment** — with class capacity validation
- **Teacher Management** — CRUD + class assignment
- **Timetable Conflict Detection** — prevents double-booking teachers and classes
- **Grade Management** — per-subject and overall average calculation
- **Bulk Attendance** — mark entire class at once
- **Role-Based Access** — Admin, Teacher, Student, Parent
- **Interactive API Docs** — Swagger UI at `/api-docs`

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your PostgreSQL connection string

# 3. Run database migration
npx prisma migrate dev --name init

# 4. Seed sample data
npm run seed

# 5. Start development server
npm run dev
```

Server runs at `http://localhost:3000`
Swagger docs at `http://localhost:3000/api-docs`

## 🔑 Seed Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@educore.com | password123 |
| Teacher | john.smith@educore.com | password123 |
| Teacher | sarah.jones@educore.com | password123 |
| Parent | parent.doe@gmail.com | password123 |
| Student | alice.doe@student.educore.com | password123 |

## 📁 Project Structure

```
src/
├── controllers/    # HTTP request handlers ONLY
├── services/       # Business logic ONLY
├── repositories/   # Database operations ONLY (Prisma)
├── types/          # TypeScript interfaces (no Prisma types)
├── middleware/     # Auth, validation, error handling
├── routes/         # Express route definitions + Swagger JSDoc
├── validators/     # Zod schemas
├── config/         # Database, environment, Swagger
└── utils/          # Response helpers, logger, error classes
```

## 🧪 Key Design Decisions

1. **Custom Error Classes** — Each error type carries its HTTP status code. The global error middleware handles serialisation.

2. **Timetable Conflict Detection** — Pure business logic in the service layer using half-open interval comparison (`A_start < B_end AND B_start < A_end`).

3. **DTO Pattern** — Explicit `CreateStudentDTO`, `UpdateStudentDTO` types prevent Prisma models from leaking across layers.

4. **Prisma Singleton** — Uses `globalThis` pattern to survive hot-reloads without exhausting connection pool.

## 📖 Documentation

- **Architecture**: See `docs/Architecture.md`
- **API Reference**: Run the server and visit `/api-docs`
