import { Router } from 'express';
import { ClassController } from '../controllers/class.controller';
import { authMiddleware, authorizeRoles } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validator.middleware';
import { createClassSchema, updateClassSchema, assignTeacherSchema } from '../validators/schemas';

const router = Router();
const controller = new ClassController();

/**
 * @swagger
 * /api/classes:
 *   post:
 *     tags: [Classes]
 *     summary: Create a new class
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Class created }
 *       409: { description: Class name already exists }
 */
router.post(
  '/',
  authMiddleware,
  authorizeRoles('ADMIN'),
  validateRequest(createClassSchema),
  controller.create.bind(controller)
);

router.get('/', authMiddleware, authorizeRoles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT'), controller.getAll.bind(controller));
router.get('/:id', authMiddleware, authorizeRoles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT'), controller.getById.bind(controller));
router.put(
  '/:id',
  authMiddleware,
  authorizeRoles('ADMIN'),
  validateRequest(updateClassSchema),
  controller.update.bind(controller)
);
router.delete('/:id', authMiddleware, authorizeRoles('ADMIN'), controller.delete.bind(controller));

/**
 * @swagger
 * /api/classes/assign-teacher:
 *   post:
 *     tags: [Classes]
 *     summary: Assign a teacher to a class for a subject
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Teacher assigned }
 */
router.post(
  '/assign-teacher',
  authMiddleware,
  authorizeRoles('ADMIN'),
  validateRequest(assignTeacherSchema),
  controller.assignTeacher.bind(controller)
);

router.delete(
  '/remove-teacher/:teacherId/:classId/:subject',
  authMiddleware,
  authorizeRoles('ADMIN'),
  controller.removeTeacher.bind(controller)
);

export default router;
