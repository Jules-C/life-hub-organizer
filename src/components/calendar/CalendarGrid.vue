<template>
  <div>
    <!-- Month Navigation -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <button
          @click="previousMonth"
          class="p-1 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 class="text-lg font-medium text-gray-900 mx-4">{{ currentMonthName }} {{ currentYear }}</h3>
        <button
          @click="nextMonth"
          class="p-1 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <!-- Additional Controls Slot -->
      <div>
        <slot name="controls"></slot>
      </div>
    </div>
    
    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
      <!-- Day Labels -->
      <div 
        v-for="day in dayNames" 
        :key="day"
        class="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500"
      >
        {{ day }}
      </div>
      
      <!-- Calendar Cells -->
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        class="min-h-[100px] p-2 bg-white border-t border-gray-200"
        :class="{ 
          'bg-gray-50': !day.isCurrentMonth,
          'bg-blue-50': day.isToday
        }"
        @click="selectDate(day)"
      >
        <!-- Date Number -->
        <div class="flex items-center justify-between">
          <span 
            class="text-sm font-medium"
            :class="{ 
              'text-gray-900': day.isCurrentMonth, 
              'text-gray-400': !day.isCurrentMonth,
              'text-blue-600': day.isToday
            }"
          >
            {{ day.date }}
          </span>
          
          <!-- Date Indicators - Top Right -->
          <slot name="date-indicators" :day="day"></slot>
        </div>
        
        <!-- Events for this day -->
        <div class="mt-2 space-y-1">
          <slot name="day-content" :day="day"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { isSameDay, formatDateString } from '@/utils/dateUtils';
import { getCalendarDays } from '@/utils/calendarUtils';


interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  dateString: string; // ISO format date string (YYYY-MM-DD)
  [key: string]: any; // Allow for additional custom properties
}

// Props
interface Props {
  initialDate?: Date;
  dayNames?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  initialDate: () => new Date(),
  dayNames: () => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
});

// Emits
const emit = defineEmits(['month-changed', 'date-selected']);

// State
const currentDate = ref(new Date(props.initialDate));

// Computed properties
const currentMonthName = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long' });
});

const currentYear = computed(() => {
  return currentDate.value.getFullYear();
});

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  return getCalendarDays(year, month);
});

// Methods
function previousMonth() {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() - 1);
  currentDate.value = newDate;
  emit('month-changed', { 
    month: newDate.getMonth(),
    year: newDate.getFullYear(),
    date: newDate
  });
}

function nextMonth() {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() + 1);
  currentDate.value = newDate;
  emit('month-changed', { 
    month: newDate.getMonth(),
    year: newDate.getFullYear(),
    date: newDate
  });
}

function selectDate(day: CalendarDay) {
  if (day.isCurrentMonth) {
    const selectedDate = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day.date);
    emit('date-selected', {
      date: selectedDate,
      dateString: day.dateString,
      day
    });
  }
}


// Public methods accessible from parent components
defineExpose({
  previousMonth,
  nextMonth,
  currentDate
});

// Watch for external changes to initialDate
watch(() => props.initialDate, (newDate) => {
  if (!isSameDay(new Date(newDate), currentDate.value)) {
    currentDate.value = new Date(newDate);
  }
});

onMounted(() => {
  // Emit initial month
  emit('month-changed', { 
    month: currentDate.value.getMonth(),
    year: currentDate.value.getFullYear(),
    date: currentDate.value
  });
});
</script>