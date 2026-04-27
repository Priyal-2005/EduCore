import { Router } from 'express';
import authRoutes from './auth.routes';
import studentRoutes from './student.routes';
import teacherRoutes from './teacher.routes';
import classRoutes from './class.routes';
import timetableRoutes from './timetable.routes';
import attendanceRoutes from './attendance.routes';
import gradeRoutes from './grade.routes';

/**
 * Route Aggregator — Mounts all domain routes under their API prefix.
 *
 * Data flow: server.ts → /api → this file → domain routes → controllers
 */
const router = Router();

router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/teachers', teacherRoutes);
router.use('/classes', classRoutes);
router.use('/timetables', timetableRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/grades', gradeRoutes);

export default router;
