<template>
  <div class="cycle-tracking-entry">
    <!-- Component implementation -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { cycleTrackingService, type CycleTrackingEntry as ServiceCycleTrackingEntry } from '@/services/health/cycleTracking';
import { getFamilyContext } from '@/utils/familyUtils';

// Props
const props = defineProps<{
  entryId?: string;
  readOnly?: boolean;
}>();

// Emits
const emit = defineEmits<{
  (e: 'save', entry: ServiceCycleTrackingEntry): void;
  (e: 'cancel'): void;
  (e: 'delete', entryId: string): void;
}>();

// State
const loading = ref(false);
const saving = ref(false);
const isPersonalOnly = ref(true);
const entry = ref<ServiceCycleTrackingEntry>({
  start_date: new Date().toISOString().split('T')[0],
  end_date: '',
  flow_intensity: 3,
  symptoms: {}, // Initialize as empty object
  notes: '',
  is_private: true
});

// Lifecycle
onMounted(async () => {
  loading.value = true;
  
  try {
    // Get family context to determine if user is in personal or family mode
    const context = await getFamilyContext();
    isPersonalOnly.value = context.isPersonalOnly;
    
    // Load existing entry if entryId is provided
    if (props.entryId) {
      const response = await cycleTrackingService.getEntry(props.entryId);
      if (response.data) {
        entry.value = { ...response.data };
      }
    }
  } catch (error) {
    console.error('Error loading entry:', error);
  } finally {
    loading.value = false;
  }
});

// Methods
async function saveEntry() {
  if (!entry.value.start_date) return;
  
  saving.value = true;
  
  try {
    let response;
    
    if (props.entryId) {
      // Update existing entry
      response = await cycleTrackingService.updateEntry(
        props.entryId,
        entry.value
      );
    } else {
      // Use addEntry instead of createEntry (matching service implementation)
      response = await cycleTrackingService.addEntry(entry.value);
    }
    
    if (response.error) throw response.error;
    
    if (response.data) {
      emit('save', response.data);
    }
  } catch (error) {
    console.error('Error saving entry:', error);
  } finally {
    saving.value = false;
  }
}

async function deleteEntry() {
  if (!props.entryId) return;
  
  saving.value = true;
  
  try {
    const response = await cycleTrackingService.deleteEntry(props.entryId);
    
    if (response.error) throw response.error;
    
    emit('delete', props.entryId);
  } catch (error) {
    console.error('Error deleting entry:', error);
  } finally {
    saving.value = false;
  }
}

function cancel() {
  emit('cancel');
}
</script>
