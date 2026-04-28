import { Router } from 'express';
import { TimetableController } from '../controllers/timetable.controller';
import { authMiddleware, authorizeRoles } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validator.middleware';
import { createTimetableSchema } from '../validators/schemas';

const router = Router();
const controller = new TimetableController();

/**
 * @swagger
 * /api/timetables:
 *   post:
 *     tags: [Timetable]
 *     summary: Create timetable entry (with conflict detection)
 *     description: |
 *       Creates a new timetable entry after checking for scheduling conflicts.
 *       Returns 409 if the teacher is already booked or the class is occupied.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [classId, teacherId, subject, dayOfWeek, startTime, endTime]
 *             properties:
 *               classId: { type: integer }
 *               teacherId: { type: integer }
 *               subject: { type: string }
 *               dayOfWeek: { type: integer, minimum: 1, maximum: 7 }
 *               startTime: { type: string, pattern: "HH:MM" }
 *               endTime: { type: string, pattern: "HH:MM" }
 *     responses:
 *       201: { description: Timetable entry created }
 *       409: { description: Scheduling conflict detected }
 */
router.post(
  '/',
  authMiddleware,
  authorizeRoles('ADMIN'),
  validateRequest(createTimetableSchema),
  controller.create.bind(controller)
);

router.get('/', authMiddleware, authorizeRoles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT'), controller.getAll.bind(controller));
router.get('/:id', authMiddleware, authorizeRoles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT'), controller.getById.bind(controller));
router.get('/class/:classId', authMiddleware, authorizeRoles('ADMIN', 'TEACHER', 'STUDENT', 'PARENT'), controller.getByClass.bind(controller));
router.delete('/:id', authMiddleware, authorizeRoles('ADMIN'), controller.delete.bind(controller));

export default router;
