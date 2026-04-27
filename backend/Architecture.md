# EduCore Backend — Architecture Documentation

## Overview

EduCore is a school management system backend built with **TypeScript**, **Express**, and **PostgreSQL** (via Prisma ORM). It demonstrates production-grade software engineering practices including strict layer separation, domain-driven types, and deliberate design pattern usage.

---

## Architecture Pattern: MVC + Repository

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (HTTP)                            │
└─────────────┬───────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────┐
│   Routes (Express)      │  Defines URL → handler mappings
│   + Middleware Pipeline  │  Auth → Validate → Handler
└─────────────┬───────────┘
              │
              ▼
┌─────────────────────────┐
│   Controllers            │  HTTP-ONLY layer
│   (Request Handlers)     │  Parses req, calls Service, sends res
│                          │  ❌ No business logic
│                          │  ❌ No database access
└─────────────┬───────────┘
              │
              ▼
┌─────────────────────────┐
│   Services               │  BUSINESS LOGIC layer
│   (Domain Logic)         │  Validation rules, computations
│                          │  ❌ No HTTP (req/res)
│                          │  ❌ No database access
└─────────────┬───────────┘
              │
              ▼
┌─────────────────────────┐
│   Repositories           │  DATA ACCESS layer
│   (Prisma Operations)    │  ONLY place Prisma is imported
│                          │  ❌ No business logic
└─────────────┬───────────┘
              │
              ▼
┌─────────────────────────┐
│   PostgreSQL Database    │
└─────────────────────────┘
```

## Why This Architecture?

| Benefit | How It's Achieved |
|---------|-------------------|
| **Testability** | Services can be tested with mocked repositories |
| **Maintainability** | Changes to DB schema only affect repositories |
| **Separation of Concerns** | Each layer has exactly one responsibility |
| **Scalability** | Repositories can be swapped (e.g., to a different ORM) |

---

## Design Patterns Used

### 1. Repository Pattern
- **Where**: `src/repositories/`
- **Why**: Abstracts database access behind a clean interface. If we migrate from Prisma to TypeORM, only repositories change.

### 2. Singleton Pattern
- **Where**: `src/config/database.ts`
- **Why**: Ensures a single Prisma client instance across the application, preventing connection pool exhaustion.

### 3. Middleware Chain (Chain of Responsibility)
- **Where**: `src/middleware/`
- **Why**: Each middleware handles one concern (auth, validation, error handling) and passes to the next.

### 4. DTO Pattern (Data Transfer Objects)
- **Where**: `src/types/*.types.ts`
- **Why**: Defines explicit shapes for data flowing between layers. Prevents Prisma types from leaking into controllers.

### 5. Factory Pattern (Middleware Factories)
- **Where**: `validateRequest()`, `authorizeRoles()`
- **Why**: Creates configured middleware instances. `authorizeRoles('ADMIN', 'TEACHER')` returns a middleware function.

---

## Key Business Logic: Timetable Conflict Detection

The timetable service (`src/services/timetable.service.ts`) implements a scheduling conflict detection algorithm:

```
PROPOSED: Teacher A, Monday, 10:00-11:00, Class X

CHECK 1 — Teacher Conflict:
  → Find all of Teacher A's Monday entries
  → For each, check if time slots overlap
  → Overlap formula: A_start < B_end AND B_start < A_end

CHECK 2 — Class Conflict:
  → Find all of Class X's Monday entries
  → For each, check if time slots overlap

If ANY conflict → throw ConflictError(409) with detailed message
If NO conflict  → create the entry
```

This is **pure business logic** — no HTTP codes, no database queries. The service delegates queries to the repository and focuses solely on the domain rules.

---

## Error Handling Strategy

```
AppError (base)
├── BadRequestError   (400)  — Invalid input
├── UnauthorizedError (401)  — Missing/invalid auth
├── ForbiddenError    (403)  — Insufficient permissions
├── NotFoundError     (404)  — Resource doesn't exist
├── ConflictError     (409)  — Business rule violation
└── ValidationError   (422)  — Zod validation failure
```

All errors flow to the **global error middleware** which serialises them to:
```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

---

## Database Schema (8 Tables)

| Table | Purpose |
|-------|---------|
| `users` | Authentication (email, password, role) |
| `students` | Student profiles linked to users |
| `teachers` | Teacher profiles linked to users |
| `parents` | Parent profiles linked to users |
| `classes` | Classrooms (Grade 10-A, etc.) |
| `teacher_on_class` | Many-to-many: teacher ↔ class assignments |
| `timetables` | Weekly schedule with conflict prevention |
| `attendances` | Daily attendance records |
| `grades` | Student exam scores |

---

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | Get current user |
| POST | `/api/students` | Enroll student |
| GET | `/api/students` | List all students |
| GET | `/api/students/:id` | Get student detail |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |
| POST | `/api/teachers` | Create teacher |
| GET | `/api/teachers` | List teachers |
| POST | `/api/classes` | Create class |
| POST | `/api/classes/assign-teacher` | Assign teacher to class |
| POST | `/api/timetables` | Create timetable entry (**conflict detection**) |
| GET | `/api/timetables` | List all entries |
| POST | `/api/attendance` | Mark single attendance |
| POST | `/api/attendance/bulk` | Mark class attendance |
| POST | `/api/grades` | Add grade |
| GET | `/api/grades/student/:id/average` | Calculate averages |

Full interactive docs: `http://localhost:3000/api-docs`
