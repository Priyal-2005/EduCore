import prisma from '../config/database';
import { NotFoundError } from '../utils/errors';

export class AttendanceService {
  async markAttendance(data: any) {
    const student = await prisma.student.findUnique({ where: { id: data.studentId } });
    if (!student) throw new NotFoundError('Student not found');
    
    return prisma.attendance.create({
      data: {
        studentId: data.studentId,
        date: new Date(data.date),
        status: data.status,
      }
    });
  }

  async markBulkAttendance(data: any) {
    const date = new Date(data.date);
    
    // Check if class exists
    const classRecord = await prisma.class.findUnique({ where: { id: data.classId } });
    if (!classRecord) throw new NotFoundError('Class not found');
    
    const students = await prisma.student.findMany({ where: { classId: data.classId } });
    
    // We would map each student to the bulk data, but for simplicity:
    const attendances = data.records.map((a: any) => ({
      studentId: a.studentId,
      date,
      status: a.status
    }));
    
    return prisma.attendance.createMany({
      data: attendances,
      skipDuplicates: true
    });
  }

  async getAttendanceByStudent(studentId: number) {
    return prisma.attendance.findMany({
      where: { studentId },
      orderBy: { date: 'desc' }
    });
  }

  async getAttendanceByClassAndDate(classId: number, date: Date) {
    const students = await prisma.student.findMany({ where: { classId }, select: { id: true } });
    const studentIds = students.map(s => s.id);
    
    return prisma.attendance.findMany({
      where: { 
        studentId: { in: studentIds },
        date: new Date(date)
      }
    });
  }

  async updateAttendance(id: number, data: any) {
    return prisma.attendance.update({
      where: { id },
      data: { status: data.status }
    });
  }

  async deleteAttendance(id: number) {
    return prisma.attendance.delete({ where: { id } });
  }
}
