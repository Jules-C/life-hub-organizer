// src/types/tests.d.ts
import '@vue/test-utils';
import type { ComponentPublicInstance } from 'vue';

// Augment Vue Test Utils to allow accessing component properties in tests
declare module '@vue/test-utils' {
  interface VueWrapper {
    vm: ComponentPublicInstance & Record<string, any>;
  }
}
