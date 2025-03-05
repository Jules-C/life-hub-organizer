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
  joined_at?: string
}

// Update the FamilyMemberWithUser interface
export interface FamilyMemberWithUser {
  id: string
  family_id: string
  role: string
  user_id: string
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
