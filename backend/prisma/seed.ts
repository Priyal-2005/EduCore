import { PrismaClient, UserRole, AttendanceStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Database Seeder
 *
 * Creates realistic sample data:
 * - 1 admin
 * - 3 teachers (Math, Science, English)
 * - 5 students across 2 classes
 * - 2 classes (Grade 10-A, Grade 10-B)
 * - Teacher assignments
 * - Timetable entries
 * - Sample grades and attendance
 */
async function main(): Promise<void> {
  console.log('🌱 Seeding database...');

  // Clean existing data (order matters due to FK constraints)
  await prisma.grade.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.timetable.deleteMany();
  await prisma.teacherOnClass.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.class.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // ━━━ Users ━━━
  const adminUser = await prisma.user.create({
    data: { email: 'admin@educore.com', password: passwordHash, role: UserRole.ADMIN },
  });

  const teacherUser1 = await prisma.user.create({
    data: { email: 'john.smith@educore.com', password: passwordHash, role: UserRole.TEACHER },
  });
  const teacherUser2 = await prisma.user.create({
    data: { email: 'sarah.jones@educore.com', password: passwordHash, role: UserRole.TEACHER },
  });
  const teacherUser3 = await prisma.user.create({
    data: { email: 'michael.brown@educore.com', password: passwordHash, role: UserRole.TEACHER },
  });

  const parentUser1 = await prisma.user.create({
    data: { email: 'parent.doe@gmail.com', password: passwordHash, role: UserRole.PARENT },
  });
  const parentUser2 = await prisma.user.create({
    data: { email: 'parent.wilson@gmail.com', password: passwordHash, role: UserRole.PARENT },
  });
  const parentUser3 = await prisma.user.create({
    data: { email: 'parent.patel@gmail.com', password: passwordHash, role: UserRole.PARENT },
  });

  const studentUser1 = await prisma.user.create({
    data: { email: 'alice.doe@student.educore.com', password: passwordHash, role: UserRole.STUDENT },
  });
  const studentUser2 = await prisma.user.create({
    data: { email: 'bob.doe@student.educore.com', password: passwordHash, role: UserRole.STUDENT },
  });
  const studentUser3 = await prisma.user.create({
    data: { email: 'charlie.wilson@student.educore.com', password: passwordHash, role: UserRole.STUDENT },
  });
  const studentUser4 = await prisma.user.create({
    data: { email: 'diana.patel@student.educore.com', password: passwordHash, role: UserRole.STUDENT },
  });
  const studentUser5 = await prisma.user.create({
    data: { email: 'ethan.lee@student.educore.com', password: passwordHash, role: UserRole.STUDENT },
  });

  // ━━━ Parents ━━━
  const parent1 = await prisma.parent.create({
    data: { userId: parentUser1.id, firstName: 'Robert', lastName: 'Doe', phoneNumber: '+1-555-0101' },
  });
  const parent2 = await prisma.parent.create({
    data: { userId: parentUser2.id, firstName: 'Linda', lastName: 'Wilson', phoneNumber: '+1-555-0102' },
  });
  const parent3 = await prisma.parent.create({
    data: { userId: parentUser3.id, firstName: 'Sunita', lastName: 'Patel', phoneNumber: '+1-555-0103' },
  });

  // ━━━ Classes ━━━
  const class10A = await prisma.class.create({
    data: { name: 'Grade 10-A', section: 'A', grade: 10 },
  });
  const class10B = await prisma.class.create({
    data: { name: 'Grade 10-B', section: 'B', grade: 10 },
  });

  // ━━━ Teachers ━━━
  const teacher1 = await prisma.teacher.create({
    data: { userId: teacherUser1.id, firstName: 'John', lastName: 'Smith', subject: 'Mathematics' },
  });
  const teacher2 = await prisma.teacher.create({
    data: { userId: teacherUser2.id, firstName: 'Sarah', lastName: 'Jones', subject: 'Science' },
  });
  const teacher3 = await prisma.teacher.create({
    data: { userId: teacherUser3.id, firstName: 'Michael', lastName: 'Brown', subject: 'English' },
  });

  // ━━━ Students ━━━
  const student1 = await prisma.student.create({
    data: {
      userId: studentUser1.id, firstName: 'Alice', lastName: 'Doe',
      dateOfBirth: new Date('2010-03-15'), classId: class10A.id, parentId: parent1.id,
    },
  });
  const student2 = await prisma.student.create({
    data: {
      userId: studentUser2.id, firstName: 'Bob', lastName: 'Doe',
      dateOfBirth: new Date('2010-07-22'), classId: class10A.id, parentId: parent1.id,
    },
  });
  const student3 = await prisma.student.create({
    data: {
      userId: studentUser3.id, firstName: 'Charlie', lastName: 'Wilson',
      dateOfBirth: new Date('2010-01-10'), classId: class10B.id, parentId: parent2.id,
    },
  });
  const student4 = await prisma.student.create({
    data: {
      userId: studentUser4.id, firstName: 'Diana', lastName: 'Patel',
      dateOfBirth: new Date('2010-11-30'), classId: class10A.id, parentId: parent3.id,
    },
  });
  const student5 = await prisma.student.create({
    data: {
      userId: studentUser5.id, firstName: 'Ethan', lastName: 'Lee',
      dateOfBirth: new Date('2010-05-18'), classId: class10B.id,
    },
  });

  // ━━━ Teacher-Class assignments ━━━
  await prisma.teacherOnClass.createMany({
    data: [
      { teacherId: teacher1.id, classId: class10A.id, subject: 'Mathematics' },
      { teacherId: teacher1.id, classId: class10B.id, subject: 'Mathematics' },
      { teacherId: teacher2.id, classId: class10A.id, subject: 'Science' },
      { teacherId: teacher2.id, classId: class10B.id, subject: 'Science' },
      { teacherId: teacher3.id, classId: class10A.id, subject: 'English' },
      { teacherId: teacher3.id, classId: class10B.id, subject: 'English' },
    ],
  });

  // ━━━ Timetable ━━━
  await prisma.timetable.createMany({
    data: [
      // Monday
      { classId: class10A.id, teacherId: teacher1.id, subject: 'Mathematics', dayOfWeek: 1, startTime: '09:00', endTime: '10:00' },
      { classId: class10A.id, teacherId: teacher2.id, subject: 'Science', dayOfWeek: 1, startTime: '10:00', endTime: '11:00' },
      { classId: class10B.id, teacherId: teacher1.id, subject: 'Mathematics', dayOfWeek: 1, startTime: '10:00', endTime: '11:00' },
      { classId: class10B.id, teacherId: teacher3.id, subject: 'English', dayOfWeek: 1, startTime: '09:00', endTime: '10:00' },
      // Tuesday
      { classId: class10A.id, teacherId: teacher3.id, subject: 'English', dayOfWeek: 2, startTime: '09:00', endTime: '10:00' },
      { classId: class10B.id, teacherId: teacher2.id, subject: 'Science', dayOfWeek: 2, startTime: '09:00', endTime: '10:00' },
    ],
  });

  // ━━━ Grades ━━━
  const today = new Date();
  await prisma.grade.createMany({
    data: [
      { studentId: student1.id, subject: 'Mathematics', score: 92, maxScore: 100, examDate: today },
      { studentId: student1.id, subject: 'Science', score: 88, maxScore: 100, examDate: today },
      { studentId: student1.id, subject: 'English', score: 95, maxScore: 100, examDate: today },
      { studentId: student2.id, subject: 'Mathematics', score: 78, maxScore: 100, examDate: today },
      { studentId: student2.id, subject: 'Science', score: 85, maxScore: 100, examDate: today },
      { studentId: student3.id, subject: 'Mathematics', score: 90, maxScore: 100, examDate: today },
      { studentId: student4.id, subject: 'Mathematics', score: 72, maxScore: 100, examDate: today },
      { studentId: student5.id, subject: 'English', score: 88, maxScore: 100, examDate: today },
    ],
  });

  // ━━━ Attendance ━━━
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  await prisma.attendance.createMany({
    data: [
      { studentId: student1.id, date: yesterday, status: AttendanceStatus.PRESENT },
      { studentId: student2.id, date: yesterday, status: AttendanceStatus.PRESENT },
      { studentId: student3.id, date: yesterday, status: AttendanceStatus.ABSENT },
      { studentId: student4.id, date: yesterday, status: AttendanceStatus.LATE },
      { studentId: student5.id, date: yesterday, status: AttendanceStatus.PRESENT },
    ],
  });

  console.log('✅ Seeding complete!');
  console.log('');
  console.log('📋 Seed accounts (password: password123):');
  console.log('   Admin:   admin@educore.com');
  console.log('   Teacher: john.smith@educore.com');
  console.log('   Teacher: sarah.jones@educore.com');
  console.log('   Teacher: michael.brown@educore.com');
  console.log('   Parent:  parent.doe@gmail.com');
  console.log('   Student: alice.doe@student.educore.com');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
