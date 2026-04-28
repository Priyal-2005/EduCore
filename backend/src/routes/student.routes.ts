import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';
import { authMiddleware, authorizeRoles } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validator.middleware';
import { createStudentSchema, updateStudentSchema } from '../validators/schemas';

const router = Router();
const controller = new StudentController();

/**
 * @swagger
 * /api/students:
 *   post:
 *     tags: [Students]
 *     summary: Enroll a new student
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, dateOfBirth]
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               dateOfBirth: { type: string, format: date }
 *               classId: { type: integer }
 *               parentId: { type: integer }
 *     responses:
 *       201: { description: Student enrolled }
 *       400: { description: Class is full }
 *       422: { description: Validation error }
 */
router.post(
  '/',
  authMiddleware,
  authorizeRoles('ADMIN'),
  validateRequest(createStudentSchema),
  controller.enroll.bind(controller)
);

/**
 * @swagger
 * /api/students:
 *   get:
 *     tags: [Students]
 *     summary: Get all students
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of students }
 */
router.get('/', authMiddleware, authorizeRoles('ADMIN', 'TEACHER'), controller.getAll.bind(controller));

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     tags: [Students]
 *     summary: Get student by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Student details }
 *       404: { description: Student not found }
 */
router.get('/:id', authMiddleware, authorizeRoles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT'), controller.getById.bind(controller));

/**
 * @swagger
 * /api/students/class/{classId}:
 *   get:
 *     tags: [Students]
 *     summary: Get students by class
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Students in class }
 */
router.get('/class/:classId', authMiddleware, authorizeRoles('ADMIN', 'TEACHER'), controller.getByClass.bind(controller));

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     tags: [Students]
 *     summary: Update student
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Student updated }
 *       404: { description: Student not found }
 */
router.put(
  '/:id',
  authMiddleware,
  authorizeRoles('ADMIN'),
  validateRequest(updateStudentSchema),
  controller.update.bind(controller)
);

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     tags: [Students]
 *     summary: Delete student
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Student deleted }
 *       404: { description: Student not found }
 */
router.delete('/:id', authMiddleware, authorizeRoles('ADMIN'), controller.delete.bind(controller));

export default router;
