import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '@/services/auth';
import type { User } from '@supabase/supabase-js';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const loading = ref(true);
  const isAuthenticated = computed(() => !!user.value);
  
  async function initialize() {
    loading.value = true;
    try {
      user.value = await authService.getCurrentUser();
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    } finally {
      loading.value = false;
    }
  }
  
  async function login(email: string, password: string) {
    loading.value = true;
    try {
      const { user: authUser, error } = await authService.signIn(email, password);
      if (error) throw error;
      user.value = authUser;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      loading.value = false;
    }
  }
  
  async function register(email: string, password: string, firstName: string, lastName: string) {
    loading.value = true;
    try {
      const { user: authUser, error } = await authService.signUp(email, password, firstName, lastName);
      if (error) throw error;
      user.value = authUser;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      loading.value = false;
    }
  }
  
  async function logout() {
    try {
      await authService.signOut();
      user.value = null;
      return { success: true };
    } catch (error: any) {
      console.error('Failed to logout:', error);
      return { success: false, error: error.message };
    }
  }
  
  async function updateProfile(updates: { firstName?: string; lastName?: string; avatarUrl?: string }) {
    if (!user.value) return { success: false, error: 'Not authenticated' };
    
    try {
      const { user: updatedUser, error } = await authService.updateProfile(
        user.value.id,
        updates
      );
      
      if (error) throw error;
      user.value = updatedUser;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
  
  return {
    user,
    loading,
    isAuthenticated,
    initialize,
    login,
    register,
    logout,
    updateProfile
  };
});
