// src/stores/__tests__/family.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useFamilyStore } from '../family';
import { familyService } from '@/services/family';
import type { Family, FamilyMember, FamilyInvitation } from '@/types/family';
import type { PostgrestError } from '@supabase/supabase-js';
import type { FamilyMemberWithUser as ServiceFamilyMemberWithUser } from '@/services/family';

// Mock types for service responses
interface ServiceResponse<T> {
  data: T | null;
  error: PostgrestError | null;
}

interface InvitationResponse {
  success: boolean;
  error: any;
}

interface UserRoleResponse {
  role: string | null;
  error: PostgrestError | null;
}

// Mock the family service
vi.mock('@/services/family', () => ({
  familyService: {
    getFamily: vi.fn(),
    getUserFamilies: vi.fn(),
    getFamilyMembers: vi.fn(),
    createFamily: vi.fn(),
    inviteFamilyMember: vi.fn(),
    getUserRole: vi.fn(),
    getCurrentUserFamily: vi.fn(),
    leaveFamily: vi.fn(),
    getPendingInvitations: vi.fn()
  }
}));

describe('Family Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  const mockFamily: Family = {
    id: 'family-123',
    name: 'Test Family',
    description: 'A test family',
    created_by: 'user-123'
  };

  const mockMembers: FamilyMember[] = [
    {
      id: 'member-1',
      family_id: 'family-123',
      user_id: 'user-123',
      role: 'admin',
      status: 'active',
      user_details: {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com'
      }
    },
    {
      id: 'member-2',
      family_id: 'family-123',
      user_id: 'user-456',
      role: 'member',
      status: 'active',
      user_details: {
        first_name: 'Another',
        last_name: 'User',
        email: 'another@example.com'
      }
    }
  ];

  // Create mock service members with the structure expected by the service
  const mockServiceMembers: ServiceFamilyMemberWithUser[] = mockMembers.map(member => ({
    id: member.id,
    family_id: member.family_id,
    user_id: member.user_id,
    role: member.role,
    status: member.status,
    users: {
      email: member.user_details?.email || '',
      user_metadata: {
        first_name: member.user_details?.first_name,
        last_name: member.user_details?.last_name,
        avatar_url: member.user_details?.avatar_url
      }
    }
  }));

  describe('initialization', () => {
    it('should initialize with default state', () => {
      const store = useFamilyStore();
      expect(store.currentFamily).toBeNull();
      expect(store.familyMembers).toEqual([]);
      expect(store.userRole).toBeNull();
      expect(store.loading).toBe(false);
    });

    it('should load family data successfully', async () => {
      vi.mocked(familyService.getFamily).mockResolvedValue({
        data: mockFamily,
        error: null
      } as ServiceResponse<Family>);

      vi.mocked(familyService.getFamilyMembers).mockResolvedValue({
        data: mockServiceMembers,
        error: null
      });

      vi.mocked(familyService.getUserRole).mockResolvedValue({
        role: 'admin',
        error: null
      } as UserRoleResponse);

      const store = useFamilyStore();
      await store.loadFamilyData('family-123');

      expect(store.currentFamily).toEqual(mockFamily);
      expect(store.familyMembers.length).toEqual(mockMembers.length);
      expect(store.userRole).toBe('admin');
      expect(store.loading).toBe(false);
    });

    it('should handle initialization errors', async () => {
      const mockError: PostgrestError = {
        code: 'ERROR',
        message: 'Failed to load family',
        details: '',
        hint: '',
        name: 'PostgrestError'
      };
      
      vi.mocked(familyService.getFamily).mockResolvedValue({
        data: null,
        error: mockError
      } as ServiceResponse<Family>);

      const store = useFamilyStore();
      const result = await store.loadFamilyData('family-123');

      expect(result.success).toBe(false);
      expect(result.error).toBe(mockError.message);
      expect(store.currentFamily).toBeNull();
    });
  });

  describe('family creation', () => {
    it('should create a new family successfully', async () => {
      vi.mocked(familyService.createFamily).mockResolvedValue({
        data: mockFamily,
        error: null
      } as ServiceResponse<Family>);

      vi.mocked(familyService.getFamilyMembers).mockResolvedValue({
        data: mockServiceMembers,
        error: null
      });

      const store = useFamilyStore();
      const result = await store.createFamily({
        name: mockFamily.name,
        description: mockFamily.description || ''
      });

      expect(result.success).toBe(true);
      expect(store.currentFamily).toEqual(mockFamily);
    });

    it('should handle family creation errors', async () => {
      const mockError: PostgrestError = {
        code: 'ERROR',
        message: 'Failed to create family',
        details: '',
        hint: '',
        name: 'PostgrestError'
      };
      
      vi.mocked(familyService.createFamily).mockResolvedValue({
        data: null,
        error: mockError
      } as ServiceResponse<Family>);

      const store = useFamilyStore();
      const result = await store.createFamily({
        name: mockFamily.name,
        description: ''
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe(mockError.message);
      expect(store.currentFamily).toBeNull();
    });
  });

  describe('member management', () => {
    it('should successfully invite family member', async () => {
      vi.mocked(familyService.inviteFamilyMember).mockResolvedValue({
        success: true,
        error: null
      } as InvitationResponse);

      const store = useFamilyStore();
      store.currentFamily = mockFamily;

      // Matches the expected interface for the store's inviteMember method
      const result = await store.inviteMember({
        email: 'new@example.com',
        role: 'member'
      });

      expect(result.success).toBe(true);
    });

    it('should handle invitation errors', async () => {
      const mockError = new Error('Invalid email');
      vi.mocked(familyService.inviteFamilyMember).mockResolvedValue({
        success: false,
        error: mockError
      } as InvitationResponse);

      const store = useFamilyStore();
      store.currentFamily = mockFamily;

      // Matches the expected interface for the store's inviteMember method
      const result = await store.inviteMember({
        email: 'invalid',
        role: 'member'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe(mockError.message);
    });

    it('should update family members list after changes', async () => {
      const store = useFamilyStore();
      store.currentFamily = mockFamily;
      store.familyMembers = mockMembers;

      // Add a new member with the service's expected structure
      const newServiceMember: ServiceFamilyMemberWithUser = {
        id: 'member-3',
        family_id: 'family-123',
        user_id: 'user-789',
        role: 'member',
        status: 'active',
        users: {
          email: 'third@example.com',
          user_metadata: {
            first_name: 'Third',
            last_name: 'User'
          }
        }
      };

      vi.mocked(familyService.getFamilyMembers).mockResolvedValue({
        data: [...mockServiceMembers, newServiceMember],
        error: null
      });

      await store.refreshMembers();

      expect(store.familyMembers).toHaveLength(3);
    });
  });

  describe('computed properties', () => {
    it('should correctly identify user as admin', () => {
      const store = useFamilyStore();
      store.userRole = 'admin';
      expect(store.isAdmin).toBe(true);
    });

    it('should correctly identify user as not admin', () => {
      const store = useFamilyStore();
      store.userRole = 'member';
      expect(store.isAdmin).toBe(false);
    });

    it('should return correct family name', () => {
      const store = useFamilyStore();
      store.currentFamily = mockFamily;
      expect(store.familyName).toBe(mockFamily.name);
    });

    it('should provide family context information', () => {
      const store = useFamilyStore();
      store.currentFamily = mockFamily;
      
      expect(store.familyContext).toEqual({
        familyId: mockFamily.id,
        familyName: mockFamily.name,
        isAdmin: false,
        memberCount: 0
      });
    });
  });

  describe('error handling', () => {
    it('should handle missing family ID', async () => {
      const store = useFamilyStore();
      const result = await store.loadFamilyData('');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Family ID is required');
    });

    it('should handle service unavailability', async () => {
      vi.mocked(familyService.getFamily).mockRejectedValue(new Error('Service unavailable'));

      const store = useFamilyStore();
      const result = await store.loadFamilyData('family-123');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Service unavailable');
      expect(store.loading).toBe(false);
    });
  });

  describe('state management', () => {
    it('should clear state when resetting', () => {
      const store = useFamilyStore();
      store.currentFamily = mockFamily;
      store.familyMembers = mockMembers;
      store.userRole = 'admin';

      store.$reset();

      expect(store.currentFamily).toBeNull();
      expect(store.familyMembers).toEqual([]);
      expect(store.userRole).toBeNull();
    });

    it('should maintain loading state during async operations', async () => {
      vi.mocked(familyService.getFamily).mockImplementation(
        () => new Promise<{ data: Family | null; error: PostgrestError | null }>(resolve => setTimeout(() => {
          resolve({ data: null, error: null });
        }, 100))
      );

      const store = useFamilyStore();
      const loadPromise = store.loadFamilyData('family-123');
      
      expect(store.loading).toBe(true);
      await loadPromise;
      expect(store.loading).toBe(false);
    });
  });
});
