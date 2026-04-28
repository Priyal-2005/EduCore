import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance.controller';
import { authMiddleware, authorizeRoles } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validator.middleware';
import {
  createAttendanceSchema,
  bulkAttendanceSchema,
  updateAttendanceSchema,
} from '../validators/schemas';

const router = Router();
const controller = new AttendanceController();

/**
 * @swagger
 * /api/attendance:
 *   post:
 *     tags: [Attendance]
 *     summary: Mark attendance for a single student
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Attendance marked }
 */
router.post(
  '/',
  authMiddleware,
  authorizeRoles('ADMIN', 'TEACHER'),
  validateRequest(createAttendanceSchema),
  controller.mark.bind(controller)
);

/**
 * @swagger
 * /api/attendance/bulk:
 *   post:
 *     tags: [Attendance]
 *     summary: Mark attendance for an entire class
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Bulk attendance marked }
 */
router.post(
  '/bulk',
  authMiddleware,
  authorizeRoles('ADMIN', 'TEACHER'),
  validateRequest(bulkAttendanceSchema),
  controller.markBulk.bind(controller)
);

router.get('/student/:studentId', authMiddleware, authorizeRoles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT'), controller.getByStudent.bind(controller));
router.get('/class/:classId', authMiddleware, authorizeRoles('ADMIN', 'TEACHER'), controller.getByClassAndDate.bind(controller));
router.put(
  '/:id',
  authMiddleware,
  authorizeRoles('ADMIN', 'TEACHER'),
  validateRequest(updateAttendanceSchema),
  controller.update.bind(controller)
);
router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles('ADMIN'),
  controller.delete.bind(controller)
);

export default router;
