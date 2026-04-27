import { AttendanceRepository } from '../repositories/attendance.repository';
import { StudentRepository } from '../repositories/student.repository';
import { ClassRepository } from '../repositories/class.repository';
import { NotFoundError } from '../utils/errors';

export class AttendanceService {
  private attendanceRepo: AttendanceRepository;
  private studentRepo: StudentRepository;
  private classRepo: ClassRepository;

  constructor() {
    this.attendanceRepo = new AttendanceRepository();
    this.studentRepo = new StudentRepository();
    this.classRepo = new ClassRepository();
  }

  async markAttendance(data: any) {
    const student = await this.studentRepo.findById(data.studentId);
    if (!student) throw new NotFoundError('Student not found');
    
    return this.attendanceRepo.create(data);
  }

  async markBulkAttendance(data: any) {
    const date = new Date(data.date);
    
    // Check if class exists
    const classRecord = await this.classRepo.findById(data.classId);
    if (!classRecord) throw new NotFoundError('Class not found');
    
    // We would map each student to the bulk data, but for simplicity:
    const attendances = data.records.map((a: any) => ({
      studentId: a.studentId,
      date,
      status: a.status
    }));
    
    return this.attendanceRepo.createMany(attendances);
  }

  async getAttendanceByStudent(studentId: number) {
    return this.attendanceRepo.findByStudentId(studentId);
  }

  async getAttendanceByClassAndDate(classId: number, date: Date) {
    return this.attendanceRepo.findByClassAndDate(classId, date);
  }

  async updateAttendance(id: number, data: any) {
    return this.attendanceRepo.update(id, data);
  }

  async deleteAttendance(id: number) {
    return this.attendanceRepo.delete(id);
  }
}
