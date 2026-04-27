import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { TimetableService } from '../../src/services/timetable.service';
import { TimetableRepository } from '../../src/repositories/timetable.repository';
import { ConflictError } from '../../src/utils/errors';

// Mock the repository
jest.mock('../../src/repositories/timetable.repository');

describe('TimetableService', () => {
  let timetableService: TimetableService;
  let mockRepo: jest.Mocked<TimetableRepository>;

  beforeEach(() => {
    mockRepo = new TimetableRepository() as jest.Mocked<TimetableRepository>;
    timetableService = new TimetableService();
    // Inject the mocked repo into the service
    (timetableService as any).timetableRepo = mockRepo;
  });

  describe('createTimetable', () => {
    it('should create a timetable if no conflict exists', async () => {
      // Setup: Mock findById for teacher and class
      (timetableService as any).teacherRepo = { findById: jest.fn<any>().mockResolvedValue({ firstName: 'John', lastName: 'Doe' }) };
      (timetableService as any).classRepo = { findById: jest.fn<any>().mockResolvedValue({ name: 'Grade 10-A' }) };
      
      // No conflicts
      mockRepo.findByTeacherAndDay.mockResolvedValue([]);
      mockRepo.findByClassAndDay.mockResolvedValue([]);
      
      const mockResult = {
        id: 1, classId: 1, teacherId: 1, subject: 'Math', 
        dayOfWeek: 1, startTime: '09:00', endTime: '10:00'
      };
      
      mockRepo.create.mockResolvedValue(mockResult);

      const data = {
        classId: 1, teacherId: 1, subject: 'Math',
        dayOfWeek: 1, startTime: '09:00', endTime: '10:00'
      };

      const result = await timetableService.createEntry(data);

      expect(mockRepo.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(mockResult);
    });

    it('should throw ConflictError if teacher is already assigned', async () => {
      // Setup: Mock findById for teacher and class
      (timetableService as any).teacherRepo = { findById: jest.fn<any>().mockResolvedValue({ firstName: 'John', lastName: 'Doe' }) };
      (timetableService as any).classRepo = { findById: jest.fn<any>().mockResolvedValue({ name: 'Grade 10-A' }) };

      // A conflicting timetable exists
      mockRepo.findByTeacherAndDay.mockResolvedValue([
        { 
          id: 2, classId: 2, teacherId: 1, subject: 'Science', dayOfWeek: 1, 
          startTime: '09:30', endTime: '10:30', className: 'Grade 10-B', teacherName: 'John Doe' 
        } as any
      ]);
      mockRepo.findByClassAndDay.mockResolvedValue([]);

      const data = {
        classId: 1, teacherId: 1, subject: 'Math',
        dayOfWeek: 1, startTime: '09:00', endTime: '10:00'
      };

      await expect(timetableService.createEntry(data)).rejects.toThrow(ConflictError);
      expect(mockRepo.create).not.toHaveBeenCalled();
    });
  });
});
