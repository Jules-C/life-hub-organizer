// src/services/health/__tests__/cycleTracking.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cycleTrackingService } from '../cycleTracking';
import { supabase } from '@/services/supabase';
import type { PostgrestError } from '@supabase/supabase-js';
import type { CycleTrackingEntry } from '@/types/calendar';

// Mock the supabase client
vi.mock('@/services/supabase', () => ({
  supabase: {
    from: vi.fn().mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn()
    }))
  }
}));

describe('cycleTrackingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockEntry: CycleTrackingEntry = {
    start_date: '2025-03-01',
    end_date: '2025-03-05',
    flow_intensity: 3,
    symptoms: {
      cramps: true,
      headache: false
    },
    notes: 'Test notes',
    is_private: true
  };

  describe('addEntry', () => {
    it('should successfully add a new entry', async () => {
      const mockResponse = { data: mockEntry, error: null };
      
      // Configure mock chain
      const mockSingle = vi.fn().mockResolvedValue(mockResponse);
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
      
      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert
      } as any);

      const result = await cycleTrackingService.addEntry(mockEntry);
      
      expect(result.data).toEqual(mockEntry);
      expect(result.error).toBeNull();
      expect(supabase.from).toHaveBeenCalledWith('cycle_tracking');
      expect(mockInsert).toHaveBeenCalledWith(mockEntry);
    });

    it('should handle errors when adding entry', async () => {
      const mockError = { message: 'Database error', details: '', hint: '', code: '' } as PostgrestError;
      const mockResponse = { data: null, error: mockError };
      
      const mockSingle = vi.fn().mockResolvedValue(mockResponse);
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
      
      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert
      } as any);

      const result = await cycleTrackingService.addEntry(mockEntry);
      
      expect(result.data).toBeNull();
      expect(result.error).toBe(mockError);
    });
  });

  describe('updateEntry', () => {
    it('should successfully update an existing entry', async () => {
      const updatedEntry = { ...mockEntry, notes: 'Updated notes' };
      const mockResponse = { data: updatedEntry, error: null };

      const mockSingle = vi.fn().mockResolvedValue(mockResponse);
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockEq = vi.fn().mockReturnValue({ select: mockSelect });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
      
      vi.mocked(supabase.from).mockReturnValue({
        update: mockUpdate
      } as any);

      const result = await cycleTrackingService.updateEntry('123', updatedEntry);
      
      expect(result.data).toEqual(updatedEntry);
      expect(result.error).toBeNull();
    });
  });

  describe('getEntriesForDateRange', () => {
    it('should return entries within date range', async () => {
      const mockEntries = [mockEntry];
      const mockResponse = { data: mockEntries, error: null };

      const mockOrder = vi.fn().mockResolvedValue(mockResponse);
      const mockLte = vi.fn().mockReturnValue({ order: mockOrder });
      const mockGte = vi.fn().mockReturnValue({ lte: mockLte });
      const mockSelect = vi.fn().mockReturnValue({ gte: mockGte });
      
      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect
      } as any);

      const result = await cycleTrackingService.getEntriesForDateRange(
        '2025-03-01',
        '2025-03-31'
      );
      
      expect(result.data).toEqual(mockEntries);
      expect(result.error).toBeNull();
    });
  });

  describe('predictNextCycle', () => {
    it('should calculate prediction based on historical data', async () => {
      const mockHistoricalData = [
        { start_date: '2025-03-01' },
        { start_date: '2025-02-01' },
        { start_date: '2025-01-01' }
      ];

      const mockResponse = { data: mockHistoricalData, error: null };
      
      const mockLimit = vi.fn().mockResolvedValue(mockResponse);
      const mockOrder = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
      
      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect
      } as any);

      const result = await cycleTrackingService.predictNextCycle();
      
      expect(result.predictedStartDate).toBeDefined();
      expect(result.averageCycleLength).toBeDefined();
      expect(result.error).toBeNull();
    });

    it('should handle insufficient data for prediction', async () => {
      const mockResponse = { data: [{ start_date: '2025-03-01' }], error: null };
      
      const mockLimit = vi.fn().mockResolvedValue(mockResponse);
      const mockOrder = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
      
      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect
      } as any);

      const result = await cycleTrackingService.predictNextCycle();
      
      expect(result.predictedStartDate).toBeNull();
      expect(result.averageCycleLength).toBeNull();
      expect(result.error).toBeDefined();
    });
  });

  describe('deleteEntry', () => {
    it('should successfully delete an entry', async () => {
      const mockResponse = { error: null };
      
      const mockDelete = vi.fn().mockResolvedValue(mockResponse);
      
      vi.mocked(supabase.from).mockReturnValue({
        delete: mockDelete
      } as any);

      const result = await cycleTrackingService.deleteEntry('123');
      
      expect(result.error).toBeNull();
      expect(supabase.from).toHaveBeenCalledWith('cycle_tracking');
    });

    it('should handle errors when deleting entry', async () => {
      const mockError = { message: 'Delete failed', details: '', hint: '', code: '' } as PostgrestError;
      const mockResponse = { error: mockError };
      
      const mockDelete = vi.fn().mockResolvedValue(mockResponse);
      
      vi.mocked(supabase.from).mockReturnValue({
        delete: mockDelete
      } as any);

      const result = await cycleTrackingService.deleteEntry('123');
      
      expect(result.error).toBe(mockError);
    });
  });
});