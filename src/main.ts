import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Import global CSS
import './assets/main.css'

// Create app instance and use Pinia
const app = createApp(App)
app.use(createPinia())

// Import and initialize user preferences
import { useUserPreferencesStore } from './stores/userPreferences';
const userPreferencesStore = useUserPreferencesStore();
userPreferencesStore.initialize().then(() => {
  console.log('User preferences initialized');
});

// Mount router and app
app.use(router)
app.mount('#app')