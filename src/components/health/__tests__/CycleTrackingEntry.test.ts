// src/components/health/__tests__/CycleTrackingEntry.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import CycleTrackingEntry from '../CycleTrackingEntry.vue';
import { cycleTrackingService } from '@/services/health/cycleTracking';
import { getFamilyContext } from '@/utils/familyUtils';
import type { CycleTrackingEntry as CycleTrackingEntryType } from '@/types/calendar';

// Define return type for the mocked getFamilyContext
interface FamilyContext {
  familyId: string | null;
  isPersonalOnly: boolean;
}

// Mock the required services
vi.mock('@/services/health/cycleTracking');
vi.mock('@/utils/familyUtils', () => ({
  getFamilyContext: vi.fn().mockResolvedValue({
    familyId: null,
    isPersonalOnly: true
  } as FamilyContext)
}));