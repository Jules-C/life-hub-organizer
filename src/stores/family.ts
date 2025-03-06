// src/stores/family.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Family, FamilyMember, FamilyInvitation } from '@/types/family';
import { familyService, type FamilyData, type FamilyMemberWithUser } from '@/services/family';
import type { PostgrestError } from '@supabase/supabase-js';

interface StoreResult {
  success: boolean;
  error?: string;
}

// Type converter functions to handle the mismatches between service and model types
function convertFamilyDataToFamily(data: FamilyData | null): Family | null {
  if (!data || !data.id) return null;
  
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    created_by: data.created_by || '',
    created_at: data.created_at,
    updated_at: data.created_at // Since we don't have updated_at in FamilyData
  };
}

function convertServiceMembersToMembers(members: FamilyMemberWithUser[] | null): FamilyMember[] {
  if (!members) return [];
  
  return members.map(member => ({
    id: member.id,
    family_id: member.family_id,
    user_id: member.user_id,
    role: (member.role === 'admin' || member.role === 'member') ? member.role : 'member',
    status: member.status || 'active',
    joined_at: member.joined_at,
    user_details: member.users ? {
      first_name: member.users.user_metadata?.first_name || '',
      last_name: member.users.user_metadata?.last_name || '',
      email: member.users.email,
      avatar_url: member.users.user_metadata?.avatar_url
    } : undefined
  }));
}

// Convert FamilyInvitation to service format
function convertInvitationToServiceFormat(invitation: Pick<FamilyInvitation, 'email' | 'role'>, familyId: string): {
  email: string;
  role: string;
  family_id: string;
  invited_by: string;
} {
  return {
    email: invitation.email,
    role: invitation.role,
    family_id: familyId,
    invited_by: 'currentUser' // This would be the actual user ID in a real implementation
  };
}

export const useFamilyStore = defineStore('family', () => {
  // State
  const currentFamily = ref<Family | null>(null);
  const familyMembers = ref<FamilyMember[]>([]);
  const pendingInvitations = ref<any[]>([]);
  const userRole = ref<string | null>(null);
  const isInitialized = ref(false);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  // Getters
  const hasFamily = computed(() => !!currentFamily.value);
  
  const isAdmin = computed(() => userRole.value === 'admin');
  
  const familyName = computed(() => currentFamily.value?.name || '');
  
  const familyContext = computed(() => ({
    familyId: currentFamily.value?.id || null,
    familyName: currentFamily.value?.name || '',
    isAdmin: isAdmin.value,
    memberCount: familyMembers.value.length
  }));

  // Actions
  async function initialize(): Promise<StoreResult> {
    if (isInitialized.value) return { success: true };
    
    loading.value = true;
    error.value = null;
    
    try {
      // Get current user's family
      const { data: familyData, error: fetchError } = await familyService.getCurrentUserFamily();
      
      if (fetchError) {
        throw new Error(fetchError.message);
      }
      
      if (familyData && familyData.id) {
        currentFamily.value = convertFamilyDataToFamily(familyData);
        
        // Get family members
        const { data: members, error: membersError } = await familyService.getFamilyMembers(familyData.id);
        
        if (membersError) {
          throw new Error(membersError.message);
        }
        
        familyMembers.value = convertServiceMembersToMembers(members);
        
        // Get user role
        const { role } = await familyService.getUserRole(familyData.id, 'currentUser');
        userRole.value = role;
      }
      
      isInitialized.value = true;
      return { success: true };
    } catch (err) {
      console.error('Error initializing family store:', err);
      error.value = err instanceof Error ? err : new Error(String(err));
      return {
        success: false,
        error: error.value.message
      };
    } finally {
      loading.value = false;
    }
  }
  
  async function loadFamilyData(familyId: string): Promise<StoreResult> {
    if (!familyId) {
      return { success: false, error: 'Family ID is required' };
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      // Get family details
      const { data: familyData, error: fetchError } = await familyService.getFamily(familyId);
      
      if (fetchError) {
        throw fetchError;
      }
      
      if (familyData && familyData.id) {
        currentFamily.value = convertFamilyDataToFamily(familyData);
        
        // Get family members
        const { data: members, error: membersError } = await familyService.getFamilyMembers(familyId);
        
        if (membersError) {
          throw membersError;
        }
        
        familyMembers.value = convertServiceMembersToMembers(members);
        
        // Get user role
        const { role } = await familyService.getUserRole(familyId, 'currentUser');
        userRole.value = role;
      }
      
      return { success: true };
    } catch (err) {
      console.error('Error loading family data:', err);
      error.value = err instanceof Error ? err : new Error(String(err));
      return {
        success: false,
        error: error.value.message
      };
    } finally {
      loading.value = false;
    }
  }

  async function createFamily(familyData: { name: string, description?: string }): Promise<StoreResult> {
    loading.value = true;
    error.value = null;
    
    try {
      const { data, error: createError } = await familyService.createFamily(familyData);
      
      if (createError) {
        throw createError;
      }
      
      if (data && data.id) {
        currentFamily.value = convertFamilyDataToFamily(data);
        
        // Add current user as admin
        const { data: members, error: membersError } = await familyService.getFamilyMembers(data.id);
        
        if (membersError) {
          throw membersError;
        }
        
        familyMembers.value = convertServiceMembersToMembers(members);
        userRole.value = 'admin'; // Creator is automatically admin
      }
      
      return { success: true };
    } catch (err) {
      console.error('Error creating family:', err);
      error.value = err instanceof Error ? err : new Error(String(err));
      return {
        success: false,
        error: error.value.message
      };
    } finally {
      loading.value = false;
    }
  }

  async function inviteMember(invitation: Pick<FamilyInvitation, 'email' | 'role'>): Promise<StoreResult> {
    if (!currentFamily.value) {
      return { success: false, error: 'No family selected' };
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      const serviceInvitation = convertInvitationToServiceFormat(
        invitation, 
        currentFamily.value.id
      );
      
      const { success, error: inviteError } = await familyService.inviteFamilyMember(serviceInvitation);
      
      if (inviteError) {
        throw inviteError;
      }
      
      return { success };
    } catch (err) {
      console.error('Error inviting family member:', err);
      error.value = err instanceof Error ? err : new Error(String(err));
      return {
        success: false,
        error: error.value.message
      };
    } finally {
      loading.value = false;
    }
  }

  async function refreshMembers(): Promise<StoreResult> {
    if (!currentFamily.value) {
      return { success: false, error: 'No family selected' };
    }
    
    loading.value = true;
    
    try {
      const { data, error: fetchError } = await familyService.getFamilyMembers(currentFamily.value.id);
      
      if (fetchError) {
        throw fetchError;
      }
      
      familyMembers.value = convertServiceMembersToMembers(data);
      return { success: true };
    } catch (err) {
      console.error('Error refreshing members:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err)
      };
    } finally {
      loading.value = false;
    }
  }

  async function loadPendingInvitations(): Promise<StoreResult> {
    if (!currentFamily.value) return { success: false, error: 'No family selected' };
    
    loading.value = true;
    error.value = null;
    
    try {
      const { data, error: fetchError } = await familyService.getPendingInvitations(currentFamily.value.id);
      
      if (fetchError) {
        throw fetchError;
      }
      
      pendingInvitations.value = data || [];
      
      return { success: true };
    } catch (err) {
      console.error('Error loading pending invitations:', err);
      error.value = err instanceof Error ? err : new Error(String(err));
      return {
        success: false,
        error: error.value.message
      };
    } finally {
      loading.value = false;
    }
  }

  async function leaveFamily(): Promise<StoreResult> {
    if (!currentFamily.value) return { success: false, error: 'No family to leave' };
    
    loading.value = true;
    error.value = null;
    
    try {
      const { error: leaveError } = await familyService.leaveFamily(currentFamily.value.id);
      
      if (leaveError) {
        throw leaveError;
      }
      
      // Reset store state
      $reset();
      
      return { success: true };
    } catch (err) {
      console.error('Error leaving family:', err);
      error.value = err instanceof Error ? err : new Error(String(err));
      return {
        success: false,
        error: error.value.message
      };
    } finally {
      loading.value = false;
    }
  }
  
  function $reset(): void {
    currentFamily.value = null;
    familyMembers.value = [];
    pendingInvitations.value = [];
    userRole.value = null;
    isInitialized.value = false;
    loading.value = false;
    error.value = null;
  }

  return {
    // State
    currentFamily,
    familyMembers,
    pendingInvitations,
    userRole,
    isInitialized,
    loading,
    error,
    
    // Getters
    hasFamily,
    isAdmin,
    familyName,
    familyContext,
    
    // Actions
    initialize,
    loadFamilyData,
    createFamily,
    inviteMember,
    refreshMembers,
    loadPendingInvitations,
    leaveFamily,
    $reset
  };
});