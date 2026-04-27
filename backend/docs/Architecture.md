# EduCore Architecture

This document describes the high-level architecture, design patterns, and UML diagrams for the EduCore School Management System.

## Architectural Patterns
EduCore uses a strict **Layered Architecture** leveraging the **MVC + Repository + Service** patterns.

- **Controllers**: Thin wrappers that only handle HTTP requests, responses, and routing. They receive validated DTOs and call the appropriate service.
- **Services**: The core of the application. All business logic lives here (e.g., Timetable Conflict Detection, Password Hashing, Capacity checks).
- **Repositories**: Data Access Layer. This is the **only** layer allowed to interact with the Prisma ORM.

## Diagrams

### 1. Entity Relationship Diagram (ERD)
The database is fully normalized in PostgreSQL.

```mermaid
erDiagram
    User ||--o| Student : "has"
    User ||--o| Teacher : "has"
    User ||--o| Parent : "has"
    
    Student ||--o{ Attendance : "logs"
    Student ||--o{ Grade : "receives"
    
    Class ||--o{ Student : "contains"
    Class ||--o{ TeacherOnClass : "taught by"
    Teacher ||--o{ TeacherOnClass : "teaches"
    
    Class ||--o{ Timetable : "has schedule"
    Teacher ||--o{ Timetable : "assigned to"
```

### 2. Enrollment Sequence Diagram
```mermaid
sequenceDiagram
    actor Client
    participant Controller
    participant ZodValidator
    participant Service
    participant Repository
    participant Prisma
    
    Client->>Controller: POST /api/students { ...data }
    Controller->>ZodValidator: Validate DTO
    ZodValidator-->>Controller: DTO OK
    Controller->>Service: enrollStudent(data, userId)
    Service->>Service: checkClassCapacity(data.classId)
    Service->>Repository: create(data, userId)
    Repository->>Prisma: prisma.student.create(...)
    Prisma-->>Repository: Student Record
    Repository-->>Service: IStudent Object
    Service-->>Controller: IStudent Object
    Controller-->>Client: 201 Created { success: true, data }
```

### 3. Use Case Diagram
```mermaid
flowchart LR
    Admin([Admin])
    Teacher([Teacher])
    Student([Student])
    Parent([Parent])

    subgraph EduCore System
        UC1(Manage Users & Classes)
        UC2(Assign Timetable)
        UC3(Mark Attendance)
        UC4(Grade Students)
        UC5(View Own Grades)
        UC6(View Child's Grades)
    end

    Admin --> UC1
    Admin --> UC2
    Teacher --> UC3
    Teacher --> UC4
    Student --> UC5
    Parent --> UC6
```
