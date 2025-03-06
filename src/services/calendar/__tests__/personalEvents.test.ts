// src/services/calendar/__tests__/personalEvents.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { personalEventService } from '../personalEvents';
import { supabase } from '@/services/supabase';
// Import the types we need
import type { PostgrestError } from '@supabase/supabase-js';
import type { CalendarEvent } from '@/types/calendar';

// Define mock interfaces for typing
// Use 'any' type to avoid compatibility issues with PostgrestQueryBuilder
interface MockSupabaseFrom {
  select: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  or: ReturnType<typeof vi.fn>;
  lt: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
}

// Simple interface for auth mock response
type UserResponse = any;

interface AuthUserResponse {
  data: { 
    user: { 
      id: string;
      email: string;
    } | null;
  };
  error: { message: string } | null;
}

// Mock the supabase client
vi.mock('@/services/supabase', () => {
  return {
    supabase: {
      from: vi.fn().mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        lt: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        single: vi.fn()
      })),
      auth: {
        getUser: vi.fn()
      }
    }
  };
});

describe('personalEventService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockEvent: CalendarEvent = {
    title: 'Test Event',
    description: 'Test Description',
    start_time: '2025-03-05T09:00:00Z',
    end_time: '2025-03-05T10:00:00Z',
    location: 'Test Location',
    is_all_day: false,
    event_type: 'personal',
    visibility: 'private',
    color: '#3B82F6'
  };

  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com'
  };

  describe('createEvent', () => {
    it('should successfully create a new event', async () => {
      const mockResponse = { data: mockEvent, error: null };
      
      const mockSingle = vi.fn().mockResolvedValue(mockResponse);
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
      
      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert
      } as any);

      const result = await personalEventService.createEvent(mockEvent);
      
      expect(result.data).toEqual(mockEvent);
      expect(result.error).toBeNull();
      expect(supabase.from).toHaveBeenCalledWith('personal_events');
    });
    
    it('should handle errors when creating an event', async () => {
      const mockError: PostgrestError = { 
        message: 'Database error', 
        details: '', 
        hint: '', 
        code: '',
        name: 'PostgrestError'
      };
      
      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: mockError });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
      
      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert
      } as any);
      
      const result = await personalEventService.createEvent(mockEvent);
      
      expect(result.data).toBeNull();
      expect(result.error).toBe(mockError);
    });
  });

  describe('updateEvent', () => {
    it('should successfully update an existing event', async () => {
      const updatedEvent = { ...mockEvent, title: 'Updated Event Title' };
      const mockResponse = { data: updatedEvent, error: null };
      
      const mockSingle = vi.fn().mockResolvedValue(mockResponse);
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockEq = vi.fn().mockReturnValue({ select: mockSelect });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
      
      vi.mocked(supabase.from).mockReturnValue({
        update: mockUpdate
      } as any);

      const result = await personalEventService.updateEvent('1', { title: 'Updated Event Title' });
      
      expect(result.data).toEqual(updatedEvent);
      expect(result.error).toBeNull();
      expect(supabase.from).toHaveBeenCalledWith('personal_events');
    });
  });

  describe('getEventsForDateRange', () => {
    it('should return events within date range', async () => {
      const mockEvents = [mockEvent];
      
      // Mock the auth.getUser function
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockUser },
        error: null
      } as any);
      
      const mockOrder = vi.fn().mockResolvedValue({ data: mockEvents, error: null });
      const mockLt = vi.fn().mockReturnValue({ order: mockOrder });
      const mockOr = vi.fn().mockReturnValue({ lt: mockLt });
      const mockEq = vi.fn().mockReturnValue({ or: mockOr });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      
      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect
      } as any);

      const result = await personalEventService.getEventsForDateRange(
        '2025-03-01',
        '2025-03-31'
      );
      
      expect(result.data).toEqual(mockEvents);
      expect(result.error).toBeNull();
    });

    it('should handle authentication errors', async () => {
      // Mock auth failure
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' }
      } as any);

      const result = await personalEventService.getEventsForDateRange(
        '2025-03-01',
        '2025-03-31'
      );
      
      expect(result.data).toEqual([]);
      expect(result.error?.message).toBe('Not authenticated');
    });
  });

  describe('deleteEvent', () => {
    it('should successfully delete an event', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null })
        })
      } as any);

      const result = await personalEventService.deleteEvent('1');
      
      expect(result.error).toBeNull();
      expect(supabase.from).toHaveBeenCalledWith('personal_events');
    });
  });
});
