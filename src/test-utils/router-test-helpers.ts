// src/test-utils/router-test-helpers.ts
import { vi } from 'vitest';
import type { Router, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';

/**
 * Creates a mock route location for testing
 */
export function createMockRoute(
  options: Partial<RouteLocationNormalized> = {}
): RouteLocationNormalized {
  return {
    fullPath: '/',
    hash: '',
    query: {},
    matched: [],
    meta: {},
    name: undefined,
    params: {},
    path: '/',
    redirectedFrom: undefined,
    ...options
  } as RouteLocationNormalized;
}

/**
 * Create a mock navigation guard next function
 */
export function createMockNext(): NavigationGuardNext {
  // Use explicit type casting to ensure compatibility with NavigationGuardNext
  return vi.fn((to?: any) => {}) as unknown as NavigationGuardNext;
}

/**
 * Creates a simple mock router for testing
 */
export function createMockRouter(options: Partial<Router> = {}): Router {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    beforeEach: vi.fn(),
    beforeResolve: vi.fn(),
    afterEach: vi.fn(),
    addRoute: vi.fn(),
    removeRoute: vi.fn(),
    hasRoute: vi.fn().mockReturnValue(true),
    getRoutes: vi.fn().mockReturnValue([]),
    resolve: vi.fn(),
    options: {},
    currentRoute: {
      value: createMockRoute()
    },
    onError: vi.fn(),
    ...options
  } as unknown as Router;
}

/**
 * Execute a navigation guard directly
 * This utility helps test router navigation guards
 */
export async function executeNavigationGuard(
  guard: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => Promise<void>,
  to: Partial<RouteLocationNormalized> = {},
  from: Partial<RouteLocationNormalized> = {}
): Promise<NavigationGuardNext> {
  const mockNext = createMockNext();
  await guard(
    createMockRoute(to),
    createMockRoute(from),
    mockNext
  );
  return mockNext;
}
