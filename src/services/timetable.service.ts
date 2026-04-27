import { TimetableRepository } from '../repositories/timetable.repository';
import { TeacherRepository } from '../repositories/teacher.repository';
import { ClassRepository } from '../repositories/class.repository';
import {
  ITimetable,
  ITimetableDetail,
  CreateTimetableDTO,
  TimetableConflict,
} from '../types/timetable.types';
import { ConflictError, NotFoundError } from '../utils/errors';
import logger from '../utils/logger.util';

/**
 * Timetable Service — The CRITICAL business logic feature.
 *
 * ═══════════════════════════════════════════════════════════
 *  CONFLICT DETECTION ALGORITHM
 * ═══════════════════════════════════════════════════════════
 *
 * When a new timetable entry is proposed, we check TWO things:
 *
 * 1. TEACHER CONFLICT: Is this teacher already teaching another
 *    class at an overlapping time on the same day?
 *
 * 2. CLASS CONFLICT: Does this class already have a session at
 *    an overlapping time on the same day?
 *
 * Time overlap logic:
 *   Two slots [A_start, A_end) and [B_start, B_end) overlap iff:
 *     A_start < B_end  AND  B_start < A_end
 *
 * This is PURE business logic — no HTTP, no Prisma here.
 * ═══════════════════════════════════════════════════════════
 */
export class TimetableService {
  private timetableRepo: TimetableRepository;
  private teacherRepo: TeacherRepository;
  private classRepo: ClassRepository;

  constructor() {
    this.timetableRepo = new TimetableRepository();
    this.teacherRepo = new TeacherRepository();
    this.classRepo = new ClassRepository();
  }

  async createEntry(data: CreateTimetableDTO): Promise<ITimetable> {
    // Validate referenced entities exist
    const teacher = await this.teacherRepo.findById(data.teacherId);
    if (!teacher) {
      throw new NotFoundError(`Teacher with ID ${data.teacherId} not found`);
    }

    const cls = await this.classRepo.findById(data.classId);
    if (!cls) {
      throw new NotFoundError(`Class with ID ${data.classId} not found`);
    }

    // ━━━ CONFLICT DETECTION ━━━
    const conflicts = await this.detectConflicts(data);
    if (conflicts.length > 0) {
      // Throw the first conflict with a detailed message
      throw new ConflictError(conflicts[0].message);
    }

    const entry = await this.timetableRepo.create(data);
    logger.info(
      `Timetable entry created: ${teacher.firstName} ${teacher.lastName} → ${cls.name} ` +
      `(${this.getDayName(data.dayOfWeek)} ${data.startTime}-${data.endTime})`
    );
    return entry;
  }

  async getEntryById(id: number): Promise<ITimetableDetail> {
    const entry = await this.timetableRepo.findById(id);
    if (!entry) {
      throw new NotFoundError(`Timetable entry with ID ${id} not found`);
    }
    return entry;
  }

  async getByClassId(classId: number): Promise<ITimetableDetail[]> {
    return this.timetableRepo.findByClassId(classId);
  }

  async getAll(): Promise<ITimetableDetail[]> {
    return this.timetableRepo.findAll();
  }

  async deleteEntry(id: number): Promise<void> {
    const existing = await this.timetableRepo.findById(id);
    if (!existing) {
      throw new NotFoundError(`Timetable entry with ID ${id} not found`);
    }

    await this.timetableRepo.delete(id);
    logger.info(`Timetable entry deleted: ID ${id}`);
  }

  // ═══════════════════════════════════════════════════════════
  //  CONFLICT DETECTION — Core business logic
  // ═══════════════════════════════════════════════════════════

  /**
   * Detects all scheduling conflicts for a proposed timetable entry.
   * Returns an array of TimetableConflict objects (empty = no conflicts).
   */
  async detectConflicts(proposed: CreateTimetableDTO): Promise<TimetableConflict[]> {
    const conflicts: TimetableConflict[] = [];

    // 1. Check TEACHER conflicts — is the teacher busy at this time?
    const teacherEntries = await this.timetableRepo.findByTeacherAndDay(
      proposed.teacherId,
      proposed.dayOfWeek
    );

    for (const existing of teacherEntries) {
      if (this.timeSlotsOverlap(proposed.startTime, proposed.endTime, existing.startTime, existing.endTime)) {
        conflicts.push({
          conflictType: 'TEACHER_BUSY',
          existingEntry: existing,
          message:
            `Teacher "${existing.teacherName}" is already teaching "${existing.subject}" ` +
            `in ${existing.className} on ${this.getDayName(proposed.dayOfWeek)} ` +
            `from ${existing.startTime} to ${existing.endTime}`,
        });
      }
    }

    // 2. Check CLASS conflicts — does the class already have a session at this time?
    const classEntries = await this.timetableRepo.findByClassAndDay(
      proposed.classId,
      proposed.dayOfWeek
    );

    for (const existing of classEntries) {
      if (this.timeSlotsOverlap(proposed.startTime, proposed.endTime, existing.startTime, existing.endTime)) {
        conflicts.push({
          conflictType: 'CLASS_OCCUPIED',
          existingEntry: existing,
          message:
            `Class "${existing.className}" already has "${existing.subject}" ` +
            `with ${existing.teacherName} on ${this.getDayName(proposed.dayOfWeek)} ` +
            `from ${existing.startTime} to ${existing.endTime}`,
        });
      }
    }

    return conflicts;
  }

  // ── Private helpers ──

  /**
   * Checks if two time slots overlap.
   * Uses half-open interval comparison: [start, end)
   *
   * Two intervals [A, B) and [C, D) overlap iff: A < D AND C < B
   */
  private timeSlotsOverlap(
    startA: string,
    endA: string,
    startB: string,
    endB: string
  ): boolean {
    const a0 = this.timeToMinutes(startA);
    const a1 = this.timeToMinutes(endA);
    const b0 = this.timeToMinutes(startB);
    const b1 = this.timeToMinutes(endB);

    return a0 < b1 && b0 < a1;
  }

  /** Converts "HH:MM" to total minutes for easy comparison */
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /** Maps day number to readable name */
  private getDayName(day: number): string {
    const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[day] || `Day ${day}`;
  }
}
