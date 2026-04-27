import { Router } from 'express';
import { GradeController } from '../controllers/grade.controller';
import { authMiddleware, authorizeRoles } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validator.middleware';
import { createGradeSchema, updateGradeSchema } from '../validators/schemas';

const router = Router();
const controller = new GradeController();

/**
 * @swagger
 * /api/grades:
 *   post:
 *     tags: [Grades]
 *     summary: Add a grade for a student
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Grade added }
 */
router.post(
  '/',
  authMiddleware,
  authorizeRoles('ADMIN', 'TEACHER'),
  validateRequest(createGradeSchema),
  controller.add.bind(controller)
);

/**
 * @swagger
 * /api/grades/student/{studentId}:
 *   get:
 *     tags: [Grades]
 *     summary: Get all grades for a student
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Grades retrieved }
 */
router.get('/student/:studentId', authMiddleware, controller.getByStudent.bind(controller));

/**
 * @swagger
 * /api/grades/student/{studentId}/average:
 *   get:
 *     tags: [Grades]
 *     summary: Get grade average for a student (per-subject + overall)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Grade averages calculated }
 */
router.get('/student/:studentId/average', authMiddleware, controller.getAverage.bind(controller));

router.put(
  '/:id',
  authMiddleware,
  authorizeRoles('ADMIN', 'TEACHER'),
  validateRequest(updateGradeSchema),
  controller.update.bind(controller)
);

router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles('ADMIN'),
  controller.delete.bind(controller)
);

export default router;
