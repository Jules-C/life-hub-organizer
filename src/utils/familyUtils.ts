import { supabase } from '@/services/supabase';

/**
 * Gets the current user's family context
 * @returns Object with familyId and isPersonalOnly flag
 */
export async function getFamilyContext(): Promise<{ 
  familyId: string | null,
  isPersonalOnly: boolean 
}> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { familyId: null, isPersonalOnly: true };
    
    // Get user's families
    const { data: families, error } = await supabase
      .from('family_members')
      .select('family_id')
      .eq('user_id', user.id);
    
    if (error || !families || families.length === 0) {
      // User has no families - using as personal software
      return { familyId: null, isPersonalOnly: true };
    }
    
    // User has at least one family
    return { 
      familyId: families[0].family_id, // Default to first family
      isPersonalOnly: false
    };
  } catch (error) {
    console.error('Error getting family context:', error);
    return { familyId: null, isPersonalOnly: true };
  }
}