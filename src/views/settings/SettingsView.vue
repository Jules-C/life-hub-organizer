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

// Computed property to ensure family members are properly typed
import { computed } from 'vue';
const familyMembersWithType = computed(() => {
  return familyMembers.value as FamilyMember[];
});
