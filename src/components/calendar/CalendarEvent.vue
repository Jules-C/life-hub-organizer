<template>
  <div 
    class="px-2 py-1 text-xs rounded-md truncate cursor-pointer"
    :class="[baseClass, customClass]"
    @click.stop="handleClick"
  >
    <div v-if="showTime && event.start_time" class="inline-block mr-1 font-medium">
      {{ formatTime(event.start_time) }}
    </div>
    <span :class="{'font-medium': showTime && event.start_time}">{{ event.title }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Event object interface - common properties across different event types
interface CalendarEvent {
  id?: string;
  title: string;
  start_time?: string; // ISO format
  end_time?: string; // ISO format
  event_type?: string;
  color?: string;
  visibility?: string;
  is_private?: boolean;
  [key: string]: any; // Allow additional properties
}

interface Props {
  event: CalendarEvent;
  eventType?: 'default' | 'personal' | 'family' | 'health' | 'work'; // Type of event for styling
  customClass?: string; // Additional custom CSS classes
  showTime?: boolean; // Whether to show the start time
}

const props = withDefaults(defineProps<Props>(), {
  eventType: 'default',
  customClass: '',
  showTime: true
});

const emit = defineEmits(['event-click']);

// Computed styles based on event type
const baseClass = computed(() => {
  // Use event.color if available, otherwise use event type
  if (props.event.color) {
    // We can't dynamically generate Tailwind classes, so handle specific colors
    // This is just a fallback - customClass should be passed for custom colors
    return '';
  }

  // Default styles based on event type
  switch (props.eventType) {
    case 'personal':
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'family':
      return 'bg-purple-100 text-purple-800 border border-purple-200';
    case 'health':
      return 'bg-pink-100 text-pink-800 border border-pink-200';
    case 'work':
      return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    default:
      // Check event.event_type as a fallback
      if (props.event.event_type === 'work') {
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      } else if (props.event.event_type === 'health') {
        return 'bg-pink-100 text-pink-800 border border-pink-200';
      }
      return 'bg-gray-100 text-gray-800 border border-gray-200';
  }
});

// Format time from ISO string to display format
function formatTime(isoString: string): string {
  if (!isoString) return '';
  
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Handle click on the event
function handleClick() {
  emit('event-click', props.event);
}
</script>