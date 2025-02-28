<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar 
      :isHealthTrackingEnabled="isHealthTrackingEnabled" 
      :isPersonalEventsEnabled="isPersonalEventsEnabled"
    />

    <div class="py-10">
      <main>
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <slot></slot>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Navbar from '@/components/navigation/Navbar.vue';
import { useUserPreferencesStore } from '@/stores/userPreferences';

// Set up user preferences for feature toggles
const userPreferencesStore = useUserPreferencesStore();

// Create computed properties for feature toggles
const isHealthTrackingEnabled = computed(() => userPreferencesStore.isHealthTrackingEnabled);
const isPersonalEventsEnabled = computed(() => userPreferencesStore.isPersonalEventsEnabled);
</script>
