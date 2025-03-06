// src/services/__tests__/family.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { familyService } from '../family';
import { supabase } from '@/services/supabase';
import type { PostgrestError } from '@supabase/supabase-js';

// Define types for our mock responses
interface FamilyData {
  id: string;
  name: string;
  description?: string;
  created_by: string;
}

interface FamilyMember {
  id: string;
  family_id: string;
  user_id: string;
  role: string;
  users?: {
    email: string;
    user_metadata: {
      first_name: string;
      last_name: string;
    };
  };
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
        single: vi.fn()
      })),
      auth: {
        admin: {
          getUserById: vi.fn()
        }
      },
      functions: {
        invoke: vi.fn()
      },
      rpc: vi.fn()
    }
  };
});

describe('Family Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockFamily: FamilyData = {
    id: 'family-123',
    name: 'Test Family',
    description: 'A test family',
    created_by: 'user-123'
  };

  const mockMember: FamilyMember = {
    id: 'member-123',
    family_id: 'family-123',
    user_id: 'user-123',
    role: 'admin'
  };

  describe('createFamily', () => {
    it('should successfully create a new family', async () => {
      const mockResponse = { data: mockFamily, error: null };
      const mockSingle = vi.fn().mockResolvedValue(mockResponse);
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
      
      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert
      } as any);

      const result = await familyService.createFamily({
        name: mockFamily.name,
        description: mockFamily.description
      });

      expect(result.data).toEqual(mockFamily);
      expect(result.error).toBeNull();
      expect(supabase.from).toHaveBeenCalledWith('families');
    });

    it('should handle errors when creating family', async () => {
      const mockError = { message: 'Database error', details: '', hint: '', code: '' } as PostgrestError;
      const mockResponse = { data: null, error: mockError };
      const mockSingle = vi.fn().mockResolvedValue(mockResponse);
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
      
      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert
      } as any);

      const result = await familyService.createFamily({
        name: mockFamily.name
      });

      expect(result.data).toBeNull();
      expect(result.error).toBe(mockError);
    });
  });

  describe('getFamily', () => {
    it('should return family by ID', async () => {
      const mockResponse = { data: mockFamily, error: null };
      const mockSingle = vi.fn().mockResolvedValue(mockResponse);
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      
      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect
      } as any);

      const result = await familyService.getFamily(mockFamily.id);
      expect(result.data).toEqual(mockFamily);
      expect(result.error).toBeNull();
    });
  });

  describe('getFamilyMembers', () => {
    const mockUserData = {
      email: 'test@example.com',
      user_metadata: {
        first_name: 'John',
        last_name: 'Doe'
      }
    };

    it('should return family members with user data', async () => {
      const mockMemberWithUser: FamilyMember = {
        ...mockMember,
        users: mockUserData
      };
      
      const mockResponse = { data: [mockMemberWithUser], error: null };
      const mockEq = vi.fn().mockResolvedValue(mockResponse);
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      
      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect
      } as any);

      const result = await familyService.getFamilyMembers(mockFamily.id);
      expect(result.data).toBeDefined();
      expect(result.data?.[0].users).toEqual(mockUserData);
      expect(result.error).toBeNull();
    });
  });

  describe('inviteFamilyMember', () => {
    const mockInvitation = {
      email: 'invite@example.com',
      role: 'member',
      family_id: 'family-123',
      invited_by: 'user-123'
    };

    it('should successfully send invitation', async () => {
      // Mock getFamily
      const mockFamilyResponse = { data: mockFamily, error: null };
      const mockFamilySingle = vi.fn().mockResolvedValue(mockFamilyResponse);
      const mockFamilyEq = vi.fn().mockReturnValue({ single: mockFamilySingle });
      const mockFamilySelect = vi.fn().mockReturnValue({ eq: mockFamilyEq });
      
      // Mock getUserRole
      const mockRoleResponse = { data: { role: 'admin' }, error: null };
      const mockRoleSingle = vi.fn().mockResolvedValue(mockRoleResponse);
      const mockRoleEq2 = vi.fn().mockReturnValue({ single: mockRoleSingle });
      const mockRoleEq1 = vi.fn().mockReturnValue({ eq: mockRoleEq2 });
      const mockRoleSelect = vi.fn().mockReturnValue({ eq: mockRoleEq1 });
      
      // Mock invitation creation
      const mockInviteResponse = { data: { id: 'invite-123' }, error: null };
      const mockInviteSingle = vi.fn().mockResolvedValue(mockInviteResponse);
      const mockInviteSelect = vi.fn().mockReturnValue({ single: mockInviteSingle });
      const mockInviteInsert = vi.fn().mockReturnValue({ select: mockInviteSelect });

      // Setup mock sequence
      vi.mocked(supabase.from)
        .mockReturnValueOnce({ select: mockFamilySelect } as any)
        .mockReturnValueOnce({ select: mockRoleSelect } as any)
        .mockReturnValueOnce({ insert: mockInviteInsert } as any);

      // Mock email sending
      vi.mocked(supabase.functions.invoke).mockResolvedValue({ 
        data: {}, 
        error: null 
      } as any);

      const result = await familyService.inviteFamilyMember(mockInvitation);
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should handle non-admin invitation attempts', async () => {
      // Mock getFamily
      const mockFamilyResponse = { data: mockFamily, error: null };
      const mockFamilySingle = vi.fn().mockResolvedValue(mockFamilyResponse);
      const mockFamilyEq = vi.fn().mockReturnValue({ single: mockFamilySingle });
      const mockFamilySelect = vi.fn().mockReturnValue({ eq: mockFamilyEq });
      
      // Mock getUserRole with non-admin role
      const mockRoleResponse = { data: { role: 'member' }, error: null };
      const mockRoleSingle = vi.fn().mockResolvedValue(mockRoleResponse);
      const mockRoleEq2 = vi.fn().mockReturnValue({ single: mockRoleSingle });
      const mockRoleEq1 = vi.fn().mockReturnValue({ eq: mockRoleEq2 });
      const mockRoleSelect = vi.fn().mockReturnValue({ eq: mockRoleEq1 });

      // Setup mock sequence
      vi.mocked(supabase.from)
        .mockReturnValueOnce({ select: mockFamilySelect } as any)
        .mockReturnValueOnce({ select: mockRoleSelect } as any);

      const result = await familyService.inviteFamilyMember(mockInvitation);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('acceptInvitation', () => {
    it('should successfully accept invitation', async () => {
      const mockRpcResult = { 
        data: { success: true }, 
        error: null 
      };
      
      vi.mocked(supabase.rpc).mockResolvedValue(mockRpcResult as any);

      const result = await familyService.acceptInvitation('token-123');
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should handle invitation acceptance errors', async () => {
      const mockError = { message: 'Invalid token', details: '', hint: '', code: '' } as PostgrestError;
      
      vi.mocked(supabase.rpc).mockRejectedValue(mockError);

      const result = await familyService.acceptInvitation('invalid-token');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});