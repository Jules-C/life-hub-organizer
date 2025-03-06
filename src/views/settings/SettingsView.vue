<template>
  <AppLayout>
    <div class="bg-white shadow rounded-lg">
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.name"
            @click="activeTab = tab.name"
            :class="[
              activeTab === tab.name
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Profile Settings Tab -->
      <div v-if="activeTab === 'profile'">
        <ProfileSettings
          :loading="loading"
          :saving="savingProfile"
          :profile="profile"
          @save-profile="saveProfile"
        />
      </div>

      <!-- Features Settings Tab -->
      <div v-if="activeTab === 'features'">
        <FeaturesSettings
          :loading="loading"
          :saving="savingFeatures"
          :features="features"
          @save-features="saveFeatures"
        />
      </div>

      <!-- Notifications Settings Tab -->
      <div v-if="activeTab === 'notifications'">
        <NotificationsSettings
          :loading="loading"
          :saving="savingNotifications"
          :notifications="notifications"
          @save-notifications="saveNotifications"
        />
      </div>

      <!-- Family Settings Tab -->
      <div v-if="activeTab === 'family'">
        <FamilySettings
          :loading="loading"
          :saving="savingFamily"
          :is-personal-only="isPersonalOnly"
          :family-id="familyId"
          :family-members="familyMembersWithType"
          @create-family="showCreateFamilyModal = true"
          @invite-member="showInviteMemberModal = true"
        />
      </div>

      <!-- Integrations Settings Tab -->
      <div v-if="activeTab === 'integrations'">
        <IntegrationsSettings
          :loading="loading"
        />
      </div>
    </div>

    <!-- Modals -->
    <CreateFamilyModal
      :show="showCreateFamilyModal"
      :saving="savingFamily"
      :new-family="newFamily"
      @close="showCreateFamilyModal = false"
      @create="createFamily"
    />

    <InviteMemberModal
      :show="showInviteMemberModal"
      :saving="savingFamily"
      :new-member="newMember"
      @close="showInviteMemberModal = false"
      @invite="inviteMember"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import AppLayout from '@/components/layouts/AppLayout.vue'; // Make sure this path is correct
import ProfileSettings from './components/ProfileSettings.vue';
import FeaturesSettings from './components/FeaturesSettings.vue';
import NotificationsSettings from './components/NotificationsSettings.vue';
import FamilySettings from './components/FamilySettings.vue';
import IntegrationsSettings from './components/IntegrationsSettings.vue';
import CreateFamilyModal from './components/CreateFamilyModal.vue';
import InviteMemberModal from './components/InviteMemberModal.vue';
import { useAuthStore } from '@/stores/auth';
import { useUserPreferencesStore } from '@/stores/userPreferences';
import { useFamilyStore } from '@/stores/family';
import type { UserProfile } from '@/types/user';
import type { FeatureToggles, NotificationPreferences } from '@/stores/userPreferences';
import type { FamilyMember } from '@/types/family';

// Set up stores
const authStore = useAuthStore();
const preferencesStore = useUserPreferencesStore();
const familyStore = useFamilyStore();

// State variables
const loading = ref(true);
const activeTab = ref('profile');
const isPersonalOnly = ref(true);
const familyId = ref<string | null>(null);
const familyMembers = ref<FamilyMember[]>([]);

// Form data
const profile = ref<UserProfile>({
  firstName: '',
  lastName: '',
  email: ''
});

const features = ref<FeatureToggles>({
  healthTracking: true,
  healthPrivacy: false,
  personalEvents: true,
  workSchedule: true
});

const notifications = ref<NotificationPreferences>({
  email: true,
  browser: true,
  documents: true,
  calendar: true,
  tasks: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00'
});

// Modal state
const showCreateFamilyModal = ref(false);
const showInviteMemberModal = ref(false);

// Save state
const savingProfile = ref(false);
const savingFeatures = ref(false);
const savingNotifications = ref(false);
const savingFamily = ref(false);

// Modal data
const newFamily = ref({
  name: '',
  description: ''
});

const newMember = ref({
  email: '',
  role: 'member'
});

// Tab definitions
const tabs = [
  { name: 'profile', label: 'Profile' },
  { name: 'features', label: 'Features' },
  { name: 'notifications', label: 'Notifications' },
  { name: 'family', label: 'Family' },
  { name: 'integrations', label: 'Integrations' }
];

// Computed property to ensure family members are properly typed
const familyMembersWithType = computed(() => {
  return familyMembers.value as FamilyMember[];
});

// Methods
async function saveProfile(profileData: UserProfile) {
  savingProfile.value = true;
  try {
    const result = await authStore.updateProfile(profileData);
    if (!result.success) {
      throw new Error(result.error);
    }
    profile.value = profileData;
  } catch (error) {
    console.error('Failed to update profile:', error);
  } finally {
    savingProfile.value = false;
  }
}

async function saveFeatures(featureData: FeatureToggles) {
  savingFeatures.value = true;
  try {
    const result = await preferencesStore.updateFeatures(featureData);
    if (!result.success) {
      throw new Error(result.error);
    }
    features.value = featureData;
  } catch (error) {
    console.error('Failed to update features:', error);
  } finally {
    savingFeatures.value = false;
  }
}

async function saveNotifications(notificationData: NotificationPreferences) {
  savingNotifications.value = true;
  try {
    const result = await preferencesStore.updateNotifications(notificationData);
    if (!result.success) {
      throw new Error(result.error);
    }
    notifications.value = notificationData;
  } catch (error) {
    console.error('Failed to update notifications:', error);
  } finally {
    savingNotifications.value = false;
  }
}

async function createFamily(familyData: { name: string; description: string }) {
  savingFamily.value = true;
  try {
    const result = await familyStore.createFamily({
      name: familyData.name,
      description: familyData.description || ''
    });
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    // Update local state
    isPersonalOnly.value = false;
    familyId.value = familyStore.currentFamily?.id || null;
    familyMembers.value = familyStore.familyMembers;
    
    // Close modal
    showCreateFamilyModal.value = false;
  } catch (error) {
    console.error('Failed to create family:', error);
  } finally {
    savingFamily.value = false;
  }
}

async function inviteMember(memberData: { email: string; role: string }) {
  savingFamily.value = true;
  try {
    const result = await familyStore.inviteMember({
      email: memberData.email,
      role: memberData.role
    });
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    // Refresh members list
    await familyStore.refreshMembers();
    familyMembers.value = familyStore.familyMembers;
    
    // Close modal
    showInviteMemberModal.value = false;
  } catch (error) {
    console.error('Failed to invite member:', error);
  } finally {
    savingFamily.value = false;
  }
}

// Lifecycle hooks
onMounted(async () => {
  loading.value = true;
  
  try {
    // Load user profile
    if (authStore.user) {
      profile.value = {
        firstName: authStore.user.user_metadata?.first_name || '',
        lastName: authStore.user.user_metadata?.last_name || '',
        email: authStore.user.email || '',
        avatar: authStore.user.user_metadata?.avatar_url || ''
      };
    }
    
    // Load user preferences
    await preferencesStore.initialize();
    features.value = { ...preferencesStore.features };
    notifications.value = { ...preferencesStore.notifications };
    
    // Load family data
    await familyStore.initialize();
    isPersonalOnly.value = !familyStore.hasFamily;
    familyId.value = familyStore.currentFamily?.id || null;
    familyMembers.value = familyStore.familyMembers;
  } catch (error) {
    console.error('Error loading settings data:', error);
  } finally {
    loading.value = false;
  }
});
</script>