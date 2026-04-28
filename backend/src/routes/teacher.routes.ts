import { Router } from 'express';
import { TeacherController } from '../controllers/teacher.controller';
import { authMiddleware, authorizeRoles } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validator.middleware';
import { createTeacherSchema, updateTeacherSchema } from '../validators/schemas';

const router = Router();
const controller = new TeacherController();

/**
 * @swagger
 * /api/teachers:
 *   post:
 *     tags: [Teachers]
 *     summary: Create a new teacher
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Teacher created }
 */
router.post(
  '/',
  authMiddleware,
  authorizeRoles('ADMIN'),
  validateRequest(createTeacherSchema),
  controller.create.bind(controller)
);

/**
 * @swagger
 * /api/teachers:
 *   get:
 *     tags: [Teachers]
 *     summary: Get all teachers
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of teachers }
 */
router.get('/', authMiddleware, authorizeRoles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT'), controller.getAll.bind(controller));

/**
 * @swagger
 * /api/teachers/{id}:
 *   get:
 *     tags: [Teachers]
 *     summary: Get teacher by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Teacher details }
 *       404: { description: Teacher not found }
 */
router.get('/:id', authMiddleware, authorizeRoles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT'), controller.getById.bind(controller));

router.put(
  '/:id',
  authMiddleware,
  authorizeRoles('ADMIN'),
  validateRequest(updateTeacherSchema),
  controller.update.bind(controller)
);

router.delete('/:id', authMiddleware, authorizeRoles('ADMIN'), controller.delete.bind(controller));

export default router;
