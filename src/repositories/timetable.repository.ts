import prisma from '../config/database';
import { ITimetable, ITimetableDetail, CreateTimetableDTO } from '../types/timetable.types';

/**
 * Timetable Repository — All Prisma operations for Timetable entries.
 *
 * Note: Conflict detection LOGIC lives in the service layer.
 * This repository only provides the queries the service needs.
 */
export class TimetableRepository {
  async create(data: CreateTimetableDTO): Promise<ITimetable> {
    return prisma.timetable.create({
      data: {
        classId: data.classId,
        teacherId: data.teacherId,
        subject: data.subject,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
      },
    });
  }

  async findById(id: number): Promise<ITimetableDetail | null> {
    const entry = await prisma.timetable.findUnique({
      where: { id },
      include: {
        class: { select: { name: true } },
        teacher: { select: { firstName: true, lastName: true } },
      },
    });

    if (!entry) return null;

    return {
      ...entry,
      className: entry.class.name,
      teacherName: `${entry.teacher.firstName} ${entry.teacher.lastName}`,
    };
  }

  /**
   * Find all timetable entries for a teacher on a specific day.
   * Used by the service layer for conflict detection.
   */
  async findByTeacherAndDay(teacherId: number, dayOfWeek: number): Promise<ITimetableDetail[]> {
    const entries = await prisma.timetable.findMany({
      where: { teacherId, dayOfWeek },
      include: {
        class: { select: { name: true } },
        teacher: { select: { firstName: true, lastName: true } },
      },
      orderBy: { startTime: 'asc' },
    });

    return entries.map((e) => ({
      ...e,
      className: e.class.name,
      teacherName: `${e.teacher.firstName} ${e.teacher.lastName}`,
    }));
  }

  /**
   * Find all timetable entries for a class on a specific day.
   * Used to check if the class already has a session at the proposed time.
   */
  async findByClassAndDay(classId: number, dayOfWeek: number): Promise<ITimetableDetail[]> {
    const entries = await prisma.timetable.findMany({
      where: { classId, dayOfWeek },
      include: {
        class: { select: { name: true } },
        teacher: { select: { firstName: true, lastName: true } },
      },
      orderBy: { startTime: 'asc' },
    });

    return entries.map((e) => ({
      ...e,
      className: e.class.name,
      teacherName: `${e.teacher.firstName} ${e.teacher.lastName}`,
    }));
  }

  async findByClassId(classId: number): Promise<ITimetableDetail[]> {
    const entries = await prisma.timetable.findMany({
      where: { classId },
      include: {
        class: { select: { name: true } },
        teacher: { select: { firstName: true, lastName: true } },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });

    return entries.map((e) => ({
      ...e,
      className: e.class.name,
      teacherName: `${e.teacher.firstName} ${e.teacher.lastName}`,
    }));
  }

  async findAll(): Promise<ITimetableDetail[]> {
    const entries = await prisma.timetable.findMany({
      include: {
        class: { select: { name: true } },
        teacher: { select: { firstName: true, lastName: true } },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });

    return entries.map((e) => ({
      ...e,
      className: e.class.name,
      teacherName: `${e.teacher.firstName} ${e.teacher.lastName}`,
    }));
  }

  async delete(id: number): Promise<void> {
    await prisma.timetable.delete({ where: { id } });
  }
}
