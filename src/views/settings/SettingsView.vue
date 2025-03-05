<template>
  <AppLayout>
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h2 class="text-xl font-semibold text-gray-900">Settings</h2>
        <p class="mt-1 text-sm text-gray-500">
          Manage your account and preferences
        </p>
      </div>
      
      <!-- Settings Tabs -->
      <div class="border-t border-gray-200">
        <div class="px-4 py-4 sm:px-6">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8">
              <button
                @click="activeTab = 'profile'"
                class="py-4 px-1 border-b-2 font-medium text-sm"
                :class="activeTab === 'profile' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              >
                Profile
              </button>
              <button
                @click="activeTab = 'family'"
                class="py-4 px-1 border-b-2 font-medium text-sm"
                :class="activeTab === 'family' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              >
                Family
              </button>
              <button
                @click="activeTab = 'integrations'"
                class="py-4 px-1 border-b-2 font-medium text-sm"
                :class="activeTab === 'integrations' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              >
                Integrations
              </button>
              <button
                @click="activeTab = 'features'"
                class="py-4 px-1 border-b-2 font-medium text-sm"
                :class="activeTab === 'features' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              >
                Features
              </button>
              <button
                @click="activeTab = 'notifications'"
                class="py-4 px-1 border-b-2 font-medium text-sm"
                :class="activeTab === 'notifications' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              >
                Notifications
              </button>
            </nav>
          </div>
        </div>
        
        <!-- Profile Tab -->
        <ProfileSettings
          v-if="activeTab === 'profile'"
          :loading="loading"
          :saving="saving"
          :profile="profile"
          @save-profile="saveProfile"
        />
        
        <!-- Family Tab -->
        <FamilySettings
          v-if="activeTab === 'family'"
          :loading="loading"
          :saving="saving"
          :is-personal-only="isPersonalOnly"
          :family-id="familyId"
          :family-members="familyMembers"
          @create-family="showCreateFamilyModal = true"
          @invite-member="showInviteMemberModal = true"
        />
        
        <!-- Integrations Tab -->
        <IntegrationsSettings
          v-if="activeTab === 'integrations'"
          :loading="loading"
        />
        
        <!-- Features Tab -->
        <FeaturesSettings
          v-if="activeTab === 'features'"
          :loading="loading"
          :saving="saving"
          :features="features"
          @save-features="saveFeatures"
        />
        
        <!-- Notifications Tab -->
        <NotificationsSettings
          v-if="activeTab === 'notifications'"
          :loading="loading"
          :saving="saving"
          :notifications="notifications"
          @save-notifications="saveNotifications"
        />
      </div>
    </div>
    
    <!-- Create Family Modal -->
    <CreateFamilyModal
      :show="showCreateFamilyModal"
      :saving="saving"
      :new-family="newFamily"
      @close="showCreateFamilyModal = false"
      @create="createFamily"
    />

    <!-- Invite Member Modal -->
    <InviteMemberModal
      :show="showInviteMemberModal"
      :saving="saving"
      :new-member="newMember"
      @close="showInviteMemberModal = false"
      @invite="inviteMember"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AppLayout from '@/components/layout/AppLayout.vue';
import ProfileSettings from '@/views/settings/components/ProfileSettings.vue';
import FamilySettings from '@/views/settings/components/FamilySettings.vue';
import IntegrationsSettings from '@/views/settings/components/IntegrationsSettings.vue';
import FeaturesSettings from '@/views/settings/components/FeaturesSettings.vue';
import NotificationsSettings from '@/views/settings/components/NotificationsSettings.vue';
import CreateFamilyModal from '@/views/settings/components/CreateFamilyModal.vue';
import InviteMemberModal from '@/views/settings/components/InviteMemberModal.vue';
import { useAuthStore } from '@/stores/auth';
import { useUserPreferencesStore } from '@/stores/userPreferences';
import { getFamilyContext } from '@/utils/familyUtils';
import { supabase } from '@/services/supabase';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
}

interface FeatureSettings {
  healthTracking: boolean;
  healthPrivacy: boolean;
  personalEvents: boolean;
  workSchedule: boolean;
}

interface NotificationSettings {
  email: boolean;
  browser: boolean;
  documents: boolean;
  calendar: boolean;
  tasks: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

interface FamilyMember {
  id: string;
  user_id: string;
  role: string;
  name: string;
  email: string;
  initials: string;
}

interface FamilyData {
  name: string;
  description: string;
}

interface NewMemberData {
  email: string;
  role: string;
}

interface SupabaseUserMetadata {
  first_name?: string;
  last_name?: string;
  [key: string]: any;
}

interface SupabaseUser {
  email?: string;
  user_metadata?: SupabaseUserMetadata;
  [key: string]: any;
}

interface SupabaseFamilyMember {
  id: string;
  role: string;
  user_id: string;
  auth?: {
    users?: SupabaseUser;
  };
  [key: string]: any;
}

const authStore = useAuthStore();
const userPreferencesStore = useUserPreferencesStore();

// UI state
const activeTab = ref('profile');
const loading = ref(true);
const saving = ref(false);
const showCreateFamilyModal = ref(false);
const showInviteMemberModal = ref(false);

// Family state
const isPersonalOnly = ref(true);
const familyId = ref<string | null>(null);
const familyMembers = ref<FamilyMember[]>([]);

// Profile data
const profile = ref<ProfileData>({
  firstName: '',
  lastName: '',
  email: ''
});

// Feature settings
const features = ref<FeatureSettings>({
  healthTracking: true,
  healthPrivacy: false,
  personalEvents: true,
  workSchedule: true
});

// Notification settings
const notifications = ref<NotificationSettings>({
  email: true,
  browser: true,
  documents: true,
  calendar: true,
  tasks: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00'
});

// Family creation form
const newFamily = ref<FamilyData>({
  name: '',
  description: ''
});

// Family member invitation form
const newMember = ref<NewMemberData>({
  email: '',
  role: 'member'
});

// Load data on component mount
onMounted(async () => {
  loading.value = true;
  
  try {
    // Check family context
    await checkFamilyContext();
    
    // Initialize user preferences
    await userPreferencesStore.initialize();
    
    // Copy the feature values from the store to our local state
    features.value = { ...userPreferencesStore.features };
    notifications.value = { ...userPreferencesStore.notifications };
    
    // Get user profile data if available
    if (authStore.user) {
      // Get user metadata from Supabase user
      const metadata = authStore.user.user_metadata || {};
      
      profile.value = {
        firstName: metadata.first_name || '',
        lastName: metadata.last_name || '',
        email: authStore.user.email || ''
      };
    }
    
    // Load family members if in family mode
    if (!isPersonalOnly.value && familyId.value) {
      await loadFamilyMembers();
    }
  } catch (error) {
    console.error('Error initializing settings:', error);
  } finally {
    loading.value = false;
  }
});

// Check if user is in personal-only mode or family mode
async function checkFamilyContext() {
  try {
    const { familyId: id, isPersonalOnly: personalOnly } = await getFamilyContext();
    isPersonalOnly.value = personalOnly;
    familyId.value = id;
  } catch (error) {
    console.error('Error checking family context:', error);
    isPersonalOnly.value = true;
    familyId.value = null;
  }
}

// Load family members
async function loadFamilyMembers() {
  try {
    if (!familyId.value) {
      familyMembers.value = [];
      return;
    }
    
    const { data, error } = await supabase
      .from('family_members')
      .select(`
        id,
        role,
        user_id,
        auth:users(email, user_metadata)
      `)
      .eq('family_id', familyId.value);
    
    if (error) throw error;
    
    if (data) {
      // Process the data carefully without assuming its exact structure
      familyMembers.value = data.map((member: any) => {
        // Safely access properties with optional chaining and fallbacks
        const userData = member.auth?.users || {};
        const metadata = userData.user_metadata || {};
        const name = `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim();
        const initials = (metadata.first_name?.[0] || '') + (metadata.last_name?.[0] || '');
        
        return {
          id: member.id || '',
          user_id: member.user_id || '',
          role: member.role || '',
          name: name || 'Unknown User',
          email: userData.email || '',
          initials: initials || 'U'
        };
      });
    }
  } catch (error) {
    console.error('Error loading family members:', error);
    familyMembers.value = []; // Reset on error
  }
}

// Save profile changes
async function saveProfile(updatedProfile: ProfileData) {
  saving.value = true;
  
  try {
    const result = await authStore.updateProfile({
      firstName: updatedProfile.firstName,
      lastName: updatedProfile.lastName
    });
    
    if (result.success) {
      alert('Profile updated successfully!');
    } else {
      alert('Failed to update profile: ' + result.error);
    }
  } catch (error) {
    console.error('Failed to update profile:', error);
    alert('An error occurred while updating your profile.');
  } finally {
    saving.value = false;
  }
}

// Save feature settings
async function saveFeatures(updatedFeatures: FeatureSettings) {
  saving.value = true;
  try {
    const result = await userPreferencesStore.updateFeatures(updatedFeatures);
    if (result.success) {
      alert('Feature settings saved successfully!');
    } else {
      alert('Failed to save feature settings: ' + result.error);
    }
  } catch (error) {
    console.error('Error saving features:', error);
    alert('An error occurred while saving your feature settings.');
  } finally {
    saving.value = false;
  }
}

// Save notification settings
async function saveNotifications(updatedNotifications: NotificationSettings) {
  saving.value = true;
  try {
    const result = await userPreferencesStore.updateNotifications(updatedNotifications);
    if (result.success) {
      alert('Notification settings saved successfully!');
    } else {
      alert('Failed to save notification settings: ' + result.error);
    }
  } catch (error) {
    console.error('Error saving notifications:', error);
    alert('An error occurred while saving your notification settings.');
  } finally {
    saving.value = false;
  }
}

// Create a new family
async function createFamily(familyData: FamilyData) {
  if (!familyData.name) return;
  
  saving.value = true;
  try {
    // Create the family record
    const { data: familyData, error: familyError } = await supabase
      .from('families')
      .insert({
        name: newFamily.value.name,
        description: newFamily.value.description,
        created_by: authStore.user?.id
      })
      .select()
      .single();
    
    if (familyError) throw familyError;
    
    // Add the current user as an admin
    if (familyData) {
      const { error: memberError } = await supabase
        .from('family_members')
        .insert({
          family_id: familyData.id,
          user_id: authStore.user?.id,
          role: 'admin'
        });
      
      if (memberError) throw memberError;
      
      // Update local state
      familyId.value = familyData.id;
      isPersonalOnly.value = false;
      
      // Reset form
      newFamily.value = { name: '', description: '' };
      
      // Close modal
      showCreateFamilyModal.value = false;
      
      // Show success message
      alert('Family created successfully!');
      
      // Refresh family context
      await checkFamilyContext();
    }
  } catch (error) {
    console.error('Error creating family:', error);
    alert('Failed to create family. Please try again.');
  } finally {
    saving.value = false;
  }
}

// Invite a family member
async function inviteMember(memberData: NewMemberData) {
  if (!memberData.email || !familyId.value) return;
  
  saving.value = true;
  try {
    // For a full implementation, you would typically:
    // 1. Check if the user with this email exists
    // 2. If yes, add them to family_members table
    // 3. If no, send an invitation email with signup link
    
    // In this simplified version, we'll just show a success message
    alert(`Invitation sent to ${memberData.email}!`);
    
    // Reset form
    newMember.value = { email: '', role: 'member' };
    
    // Close modal
    showInviteMemberModal.value = false;
  } catch (error) {
    console.error('Error inviting member:', error);
    alert('Failed to send invitation. Please try again.');
  } finally {
    saving.value = false;
  }
}
</script>