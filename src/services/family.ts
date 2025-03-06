import { supabase } from './supabase'
import type { PostgrestError } from '@supabase/supabase-js'

export interface FamilyData {
  id?: string
  name: string
  description?: string
  created_by?: string
  created_at?: string
}

export interface FamilyMember {
  id?: string
  family_id: string
  user_id: string
  role: string
  status?: 'active' | 'invited' | 'declined'
  joined_at?: string
}

// Update the FamilyMemberWithUser interface
export interface FamilyMemberWithUser {
  id: string
  family_id: string
  role: string
  user_id: string
  status?: 'active' | 'invited' | 'declined'
  joined_at?: string
  users: {
    // This should be a single object, not an array
    email: string
    user_metadata: any
  }
}

export interface FamilyInvitation {
  email: string
  role: string
  family_id: string
  invited_by: string
  status?: 'pending' | 'accepted' | 'declined'
}

export const familyService = {
  /**
   * Create a new family
   */
  async createFamily(family: Partial<FamilyData>): Promise<{ data: FamilyData | null; error: PostgrestError | null }> {
    const { data, error } = await supabase.from('families').insert(family).select().single()

    return { data, error }
  },

  /**
   * Get a family by ID
   */
  async getFamily(id: string): Promise<{ data: FamilyData | null; error: PostgrestError | null }> {
    const { data, error } = await supabase.from('families').select('*').eq('id', id).single()

    return { data, error }
  },

  /**
   * Get all families for the current user
   */
  async getUserFamilies(): Promise<{ data: FamilyData[] | null; error: PostgrestError | null }> {
    const { data, error } = await supabase.from('families').select('*').order('name')

    return { data, error }
  },

  /**
   * Get the current user's family
   */
  async getCurrentUserFamily(): Promise<{ data: FamilyData | null; error: PostgrestError | null }> {
    try {
      // First get the user data
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        return { data: null, error: { message: 'User not authenticated', code: 'AUTH_ERROR' } as PostgrestError };
      }

      // Get the family member record for this user
      const { data: memberData, error: memberError } = await supabase
        .from('family_members')
        .select('family_id')
        .eq('user_id', userData.user.id)
        .eq('status', 'active')
        .single();

      if (memberError || !memberData) {
        // Not an error, user might not be in a family
        return { data: null, error: null };
      }

      // Get the family details
      return await this.getFamily(memberData.family_id);
    } catch (error) {
      console.error('Error getting current user family:', error);
      return { data: null, error: error as PostgrestError };
    }
  },

  /**
   * Add a member to a family
   */
  async addFamilyMember(member: Partial<FamilyMember>): Promise<{ data: FamilyMember | null; error: PostgrestError | null }> {
    const { data, error } = await supabase.from('family_members').insert(member).select().single()

    return { data, error }
  },

  /**
   * Get family members
   */
  async getFamilyMembers(familyId: string): Promise<{ data: FamilyMemberWithUser[] | null; error: PostgrestError | null }> {
    const { data: rawData, error } = await supabase
      .from('family_members')
      .select(
        `
        id,
        family_id,
        role,
        user_id,
        status,
        joined_at,
        users:user_id (
          email,
          user_metadata
        )
      `
      )
      .eq('family_id', familyId)

    // Transform the data to match the expected interface
    const data = rawData
      ? (rawData.map((member) => ({
          ...member,
          users: Array.isArray(member.users) ? member.users[0] : member.users,
        })) as FamilyMemberWithUser[])
      : null

    return { data, error }
  },

  /**
   * Get the user's role in a family
   */
  async getUserRole(familyId: string, userId: string): Promise<{ role: string | null; error: PostgrestError | null }> {
    const { data, error } = await supabase.from('family_members').select('role').eq('family_id', familyId).eq('user_id', userId).single()

    return { role: data?.role || null, error }
  },

  /**
   * Get pending invitations for a family
   */
  async getPendingInvitations(familyId: string): Promise<{ data: any[] | null; error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('family_id', familyId)
      .eq('status', 'pending');

    return { data, error };
  },

  /**
   * Leave a family
   */
  async leaveFamily(familyId: string): Promise<{ error: PostgrestError | null }> {
    try {
      // Get the current user
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        return { error: { message: 'User not authenticated', code: 'AUTH_ERROR' } as PostgrestError };
      }

      // Check if the user is the only admin
      const { data: adminData, error: adminError } = await supabase
        .from('family_members')
        .select('*')
        .eq('family_id', familyId)
        .eq('role', 'admin');

      if (adminError) {
        return { error: adminError };
      }

      // If only one admin and it's this user, don't allow leaving
      if (adminData.length === 1 && adminData[0].user_id === userData.user.id) {
        return { error: { message: 'Cannot leave family: you are the only admin', code: 'ONLY_ADMIN' } as PostgrestError };
      }

      // Remove the user from the family
      const { error: deleteError } = await supabase
        .from('family_members')
        .delete()
        .eq('family_id', familyId)
        .eq('user_id', userData.user.id);

      return { error: deleteError };
    } catch (error) {
      console.error('Error leaving family:', error);
      return { error: error as PostgrestError };
    }
  },

  /**
   * Create family invitation and send email
   */
  async inviteFamilyMember(invitation: FamilyInvitation): Promise<{ success: boolean; error: any }> {
    try {
      // First, check if this is a valid family
      const { data: familyData, error: familyError } = await this.getFamily(invitation.family_id)

      if (familyError || !familyData) {
        throw new Error('Invalid family ID')
      }

      // Check if the inviter is an admin
      const { role, error: roleError } = await this.getUserRole(invitation.family_id, invitation.invited_by)

      if (roleError || role !== 'admin') {
        throw new Error('Only family admins can send invitations')
      }

      // Generate a unique token for this invitation
      const token = crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

      // Create an invitation record in the database
      const { data: invitationData, error: insertError } = await supabase
        .from('invitations')
        .insert({
          email: invitation.email,
          family_id: invitation.family_id,
          role: invitation.role,
          invited_by: invitation.invited_by,
          status: 'pending',
          token: token,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Send invitation email using Edge Function
      try {
        const { error: emailError } = await supabase.functions.invoke('send-invitation-email', {
          body: {
            email: invitation.email,
            familyId: invitation.family_id,
            familyName: familyData.name,
            token: token,
            invitedBy: invitation.invited_by,
          },
        })

        if (emailError) {
          console.warn('Email sending failed, but invitation was created:', emailError)
        }
      } catch (emailError) {
        console.warn('Email sending failed, but invitation was created:', emailError)
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('Error inviting family member:', error)
      return { success: false, error }
    }
  },

  /**
   * Accept an invitation
   */
  async acceptInvitation(token: string): Promise<{ success: boolean; error: any }> {
    try {
      // Call the database function to process the invitation
      const { data, error } = await supabase.rpc('accept_invitation', {
        token_param: token,
      })

      if (error) throw error
      return { success: true, error: null }
    } catch (error) {
      console.error('Error accepting invitation:', error)
      return { success: false, error }
    }
  },

  /**
   * Get invitation details by token
   */
  async getInvitation(token: string): Promise<{ data: any; error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('invitations')
      .select(
        `
        id,
        email,
        family_id,
        role,
        status,
        invited_by,
        created_at,
        expires_at,
        families:family_id (
          name
        )
      `
      )
      .eq('token', token)
      .single()

    return { data, error }
  },
}