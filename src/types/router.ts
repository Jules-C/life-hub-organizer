// src/types/router.ts
import type { RouteRecordRaw, RouteLocationNormalized } from 'vue-router';

export interface Features {
  healthTracking: boolean;
  healthPrivacy: boolean;
  personalEvents: boolean;
  workSchedule: boolean;
}

export interface RouterOptions {
  routes: RouteRecordRaw[];
}

// Type for testing route navigation guards
export type NavigationGuardNextCallback = (
  to?: RouteLocationNormalized | false | void | ((vm: any) => any)
) => void;

// Used for proper typing of mock.mockImplementation
export type NavigationGuardNextFunction = (
  callback?: NavigationGuardNextCallback
) => void;
