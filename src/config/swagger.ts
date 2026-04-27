import swaggerJsdoc from 'swagger-jsdoc';

/**
 * Swagger/OpenAPI Configuration
 *
 * Scans all route files for JSDoc annotations and generates the spec.
 * Accessible at /api-docs in the running application.
 */
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EduCore API',
      version: '1.0.0',
      description:
        'School Management System API — Demonstrates strict MVC + Repository architecture, ' +
        'TypeScript interfaces, and deliberate design patterns.',
      contact: {
        name: 'Priyal Sarda',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
            message: { type: 'string' },
          },
        },
        Student: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            dateOfBirth: { type: 'string', format: 'date' },
            enrollmentDate: { type: 'string', format: 'date-time' },
            classId: { type: 'integer', nullable: true },
            parentId: { type: 'integer', nullable: true },
          },
        },
        Teacher: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            subject: { type: 'string' },
            hireDate: { type: 'string', format: 'date-time' },
          },
        },
        TimetableConflict: {
          type: 'object',
          properties: {
            conflictType: { type: 'string', enum: ['TEACHER_BUSY', 'CLASS_OCCUPIED'] },
            message: { type: 'string' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication & registration' },
      { name: 'Students', description: 'Student enrollment & management' },
      { name: 'Teachers', description: 'Teacher management' },
      { name: 'Classes', description: 'Class management & teacher assignment' },
      { name: 'Timetable', description: 'Timetable management with conflict detection' },
      { name: 'Attendance', description: 'Attendance tracking' },
      { name: 'Grades', description: 'Grade management & averages' },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
