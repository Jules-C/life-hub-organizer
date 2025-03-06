<template>
  <div class="health-stats">
    <!-- Component implementation -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { cycleTrackingService, type CycleTrackingEntry } from '@/services/health/cycleTracking';

// Props
const props = defineProps<{
  userId?: string;
  startDate?: string;
  endDate?: string;
}>();

// State
const loading = ref(false);
const entries = ref<CycleTrackingEntry[]>([]);
const error = ref<string | null>(null);

// Lifecycle
onMounted(async () => {
  await loadData();
});

// Methods
async function loadData() {
  loading.value = true;
  error.value = null;
  
  try {
    // Default to last 3 months if dates not provided
    const end = props.endDate || new Date().toISOString();
    const start = props.startDate || new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString();
    
    const response = await cycleTrackingService.getEntriesForDateRange(start, end);
    
    if (response.error) throw response.error;
    
    entries.value = response.data || [];
  } catch (err) {
    console.error('Error loading health stats:', err);
    error.value = 'Failed to load health statistics. Please try again.';
  } finally {
    loading.value = false;
  }
}

// Computed stats
const averageCycleLength = computed(() => {
  if (entries.value.length < 2) return null;
  
  // Calculate average cycle length (days between start dates)
  let totalDays = 0;
  let cycles = 0;
  
  // Sort entries by start date
  const sortedEntries = [...entries.value].sort((a, b) => 
    new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );
  
  for (let i = 1; i < sortedEntries.length; i++) {
    const currentStart = new Date(sortedEntries[i].start_date);
    const prevStart = new Date(sortedEntries[i-1].start_date);
    const days = Math.round((currentStart.getTime() - prevStart.getTime()) / (1000 * 60 * 60 * 24));
    
    if (days > 0 && days < 60) { // Exclude outliers
      totalDays += days;
      cycles++;
    }
  }
  
  return cycles > 0 ? Math.round(totalDays / cycles) : null;
});

// More computed properties
const averagePeriodLength = computed(() => {
  if (entries.value.length === 0) return null;
  
  let totalDays = 0;
  let periodsWithEndDate = 0;
  
  entries.value.forEach(entry => {
    if (entry.start_date && entry.end_date) {
      const start = new Date(entry.start_date);
      const end = new Date(entry.end_date);
      const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      if (days > 0 && days < 14) { // Exclude invalid data
        totalDays += days;
        periodsWithEndDate++;
      }
    }
  });
  
  return periodsWithEndDate > 0 ? Math.round(totalDays / periodsWithEndDate) : null;
});
</script>
