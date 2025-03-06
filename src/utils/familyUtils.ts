// src/utils/familyUtils.ts
import { supabase } from '@/services/supabase';

/**
 * Returns family context for the current user
 * @returns {Promise<{familyId: string | null, isPersonalOnly: boolean}>}
 */
export async function getFamilyContext(): Promise<{familyId: string | null, isPersonalOnly: boolean}> {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Auth error in getFamilyContext:', authError);
      return { familyId: null, isPersonalOnly: true };
    }
    
    // Check if user is part of a family
    const { data: familyMembers, error: familyError } = await supabase
      .from('family_members')
      .select('family_id, role')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .limit(1);
    
    if (familyError) {
      console.error('Error fetching family data:', familyError);
      return { familyId: null, isPersonalOnly: true };
    }
    
    if (familyMembers && familyMembers.length > 0) {
      return { 
        familyId: familyMembers[0].family_id,
        isPersonalOnly: false
      };
    }
    
    // User is not part of a family
    return { familyId: null, isPersonalOnly: true };
  } catch (error) {
    console.error('Unexpected error in getFamilyContext:', error);
    return { familyId: null, isPersonalOnly: true };
  }
}

/**
 * Returns the user's role in a family
 * @param familyId - The family ID to check role for
 * @returns {Promise<string | null>} - 'admin', 'member', or null if not a member
 */
export async function getUserFamilyRole(familyId: string): Promise<string | null> {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Auth error in getUserFamilyRole:', authError);
      return null;
    }
    
    // Get user's role in the family
    const { data, error: roleError } = await supabase
      .from('family_members')
      .select('role')
      .eq('family_id', familyId)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();
    
    if (roleError || !data) {
      console.error('Error fetching user role:', roleError);
      return null;
    }
    
    return data.role;
  } catch (error) {
    console.error('Unexpected error in getUserFamilyRole:', error);
    return null;
  }
}

/**
 * Checks if the user is an admin of a family
 * @param familyId - The family ID to check admin status for
 * @returns {Promise<boolean>}
 */
export async function isUserFamilyAdmin(familyId: string): Promise<boolean> {
  const role = await getUserFamilyRole(familyId);
  return role === 'admin';
}
