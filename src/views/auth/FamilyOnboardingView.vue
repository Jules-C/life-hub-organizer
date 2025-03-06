
<!-- This is just updating the relevant part with the fix at line 441 and 458 -->
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/services/supabase';
import { familyService } from '@/services/family';
import { useAuthStore } from '@/stores/auth';
import { useUserPreferencesStore } from '@/stores/userPreferences';

// Setup state
const currentStep = ref(1);
const selectedMode = ref('personal');
const submitting = ref(false);
const errorMessage = ref('');
const router = useRouter();
const authStore = useAuthStore();
const userPreferencesStore = useUserPreferencesStore();

// Family information
const familyInfo = ref({
  name: '',
  description: ''
});

// Family members
const familyMembers = ref([
  { email: '', role: 'member' }
]);

// Feature toggles for personal mode
const features = ref({
  healthTracking: true,
  healthPrivacy: false,
  personalEvents: true,
  workSchedule: true
});

// Navigation methods
function goToNextStep() {
  if (currentStep.value === 1) {
    currentStep.value = 2;
  } else if (currentStep.value === 2) {
    if (selectedMode.value === 'family') {
      // Validate family name
      if (!familyInfo.value.name.trim()) {
        errorMessage.value = 'Please enter a family name';
        return;
      }
      currentStep.value = 3;
    } else {
      // Complete setup for personal mode
      completeSetup();
    }
  }
}

function goToPreviousStep() {
  currentStep.value--;
  errorMessage.value = ''; // Clear any error messages when going back
}

// Member management
function addMember() {
  familyMembers.value.push({ email: '', role: 'member' });
}

function removeMember(index: number) {
  familyMembers.value.splice(index, 1);
}

function goToDashboard() {
  router.push('/');
}

// Create a family in the database
async function createFamily() {
  if (!authStore.user) {
    throw new Error('User not authenticated');
  }

  // Create family record
  const { data: familyData, error: familyError } = await familyService.createFamily({
    name: familyInfo.value.name,
    description: familyInfo.value.description,
    created_by: authStore.user.id
  });

  if (familyError) throw familyError;
  if (!familyData) throw new Error('Failed to create family');
  
  // Add the current user as an admin
  const { error: memberError } = await familyService.addFamilyMember({
    family_id: familyData.id,
    user_id: authStore.user.id,
    role: 'admin'
  });

  if (memberError) throw memberError;
  
  // Filter out empty emails
  const validMembers = familyMembers.value.filter(member => member.email.trim());
  
  // Process invitations for family members
  const invitationErrors = [];
  for (const member of validMembers) {
    try {
      await familyService.inviteFamilyMember({
        email: member.email,
        role: member.role,
        family_id: familyData.id as string, // Add type assertion here
        invited_by: authStore.user.id
      });
    } catch (error: any) { // Add type annotation for error
      console.error(`Failed to invite ${member.email}:`, error);
      invitationErrors.push(`${member.email}: ${error?.message || 'Unknown error'}`);
    }
  }
  
  // If there were any invitation errors, we still created the family successfully
  // but we should inform the user that some invitations failed
  if (invitationErrors.length > 0) {
    console.warn('Some invitations failed to send:', invitationErrors);
    // In a real app, you might want to display these errors to the user
    // or retry sending the invitations
  }
  
  return familyData;
}

// Save user preferences
async function saveUserPreferences() {
  // Update feature toggles in the user preferences store
  await userPreferencesStore.updateFeatures({
    healthTracking: features.value.healthTracking,
    healthPrivacy: features.value.healthPrivacy,
    personalEvents: features.value.personalEvents,
    workSchedule: features.value.workSchedule
  });
}

// Finish the setup process
async function completeSetup() {
  errorMessage.value = '';
  submitting.value = true;
  
  try {
    // If family mode, create the family
    if (selectedMode.value === 'family') {
      // Basic validation for family members
      const validEmails = familyMembers.value.every(member => 
        !member.email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)
      );
      
      if (!validEmails) {
        errorMessage.value = 'Please enter valid email addresses for all members';
        submitting.value = false;
        return;
      }
      
      await createFamily();
    }
    
    // In both modes, save user preferences
    await saveUserPreferences();
    
    // Show success step
    currentStep.value = 4;
    
  } catch (error: any) {
    console.error('Error during setup:', error);
    errorMessage.value = error.message || 'An unexpected error occurred during setup';
  } finally {
    submitting.value = false;
  }
}
</script>