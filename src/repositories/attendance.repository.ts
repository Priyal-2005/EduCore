import prisma from '../config/database';
import {
  IAttendance,
  IAttendanceWithStudent,
  CreateAttendanceDTO,
  UpdateAttendanceDTO,
} from '../types/attendance.types';
import { AttendanceStatus } from '../types/common.types';

/**
 * Attendance Repository — All Prisma operations for Attendance.
 */
export class AttendanceRepository {
  async create(data: CreateAttendanceDTO): Promise<IAttendance> {
    return prisma.attendance.create({
      data: {
        studentId: data.studentId,
        date: data.date,
        status: data.status,
      },
    });
  }

  async createMany(records: CreateAttendanceDTO[]): Promise<number> {
    const result = await prisma.attendance.createMany({
      data: records.map((r) => ({
        studentId: r.studentId,
        date: r.date,
        status: r.status,
      })),
      skipDuplicates: true,
    });
    return result.count;
  }

  async findById(id: number): Promise<IAttendanceWithStudent | null> {
    const record = await prisma.attendance.findUnique({
      where: { id },
      include: {
        student: { select: { firstName: true, lastName: true } },
      },
    });

    if (!record) return null;

    return {
      ...record,
      status: record.status as AttendanceStatus,
      studentName: `${record.student.firstName} ${record.student.lastName}`,
    };
  }

  async findByStudentId(studentId: number): Promise<IAttendance[]> {
    return prisma.attendance.findMany({
      where: { studentId },
      orderBy: { date: 'desc' },
    }) as Promise<IAttendance[]>;
  }

  async findByClassAndDate(classId: number, date: Date): Promise<IAttendanceWithStudent[]> {
    const records = await prisma.attendance.findMany({
      where: {
        date,
        student: { classId },
      },
      include: {
        student: { select: { firstName: true, lastName: true } },
      },
      orderBy: { student: { lastName: 'asc' } },
    });

    return records.map((r) => ({
      ...r,
      status: r.status as AttendanceStatus,
      studentName: `${r.student.firstName} ${r.student.lastName}`,
    }));
  }

  async update(id: number, data: UpdateAttendanceDTO): Promise<IAttendance> {
    return prisma.attendance.update({
      where: { id },
      data: { status: data.status },
    }) as Promise<IAttendance>;
  }

  async delete(id: number): Promise<void> {
    await prisma.attendance.delete({ where: { id } });
  }

  /** Count attendance by status for a class on a date (for dashboard stats) */
  async countByStatusAndDate(
    classId: number,
    date: Date,
    status: AttendanceStatus
  ): Promise<number> {
    return prisma.attendance.count({
      where: {
        date,
        status,
        student: { classId },
      },
    });
  }
}
