# TypeScript Error Resolution Guide for Vue 3 & Vitest

This guide provides a systematic approach to resolving TypeScript errors in Vue 3 applications using Vitest.

## Installation Requirements

Before addressing type errors, ensure all required dependencies are installed:

```bash
# Run this script to install required dependencies
./install-dependencies.sh
```

## Core Issues and Solutions

### 1. Missing `@pinia/testing` Module

Error:
```
Cannot find module '@pinia/testing' or its corresponding type declarations.
```

Solution:
- Install the `@pinia/testing` package
- This package is required for proper Pinia store testing in Vue components

### 2. Vue Component Property Access in Tests

Error:
```
Property 'events' does not exist on type 'ComponentPublicInstance<...>'
```

Solution:
- Use the `ComponentTestProps` type from `src/test-utils/vue-types.ts`
- This provides type-safe access to component properties in tests

```typescript
// Example usage
const wrapper = mount(MyComponent);
const vm = wrapper.vm as unknown as ComponentTestProps;
expect(vm.events?.length).toBe(1);
```

### 3. Router Navigation Guard Testing

Error:
```
Expected 1 arguments, but got 3.
```

Solution:
- Use the router-test-helpers.ts utilities for properly testing router guards
- Specifically, use `executeNavigationGuard` to simplify testing

```typescript
// Example usage
const next = await executeNavigationGuard(
  myGuard,
  { meta: { requiresAuth: true } },
  {}
);
expect(next).toHaveBeenCalledWith({ name: 'login' });
```

### 4. Supabase Response Type Mismatches

Error:
```
Argument of type 'SupabaseAuthResponse' is not assignable to parameter type 'AuthTokenResponsePassword'
```

Solution:
- Use helper functions from `src/types/auth.ts` to create properly typed responses
- Use type adapters from `src/test-utils/response-adapters.ts` for complex transformations

```typescript
// Example usage
const response = createAuthResponse(mockUser, mockSession);
vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue(response);
```

### 5. FamilyMember Type Mismatches

Error:
```
Property 'users' is missing in type 'FamilyMember' but required in type 'FamilyMemberWithUser'.
```

Solution:
- Use the `adaptFamilyMembers` function to convert between types
- This handles the differences between database models and required interfaces

```typescript
// Example usage
const familyMembersResponse = {
  data: familyMembers,
  error: null
};

const adaptedResponse = adaptResponse(
  familyMembersResponse,
  adaptFamilyMembers
);
```

## Testing Best Practices

1. **Type Your Test Helpers:**
   - Create strongly typed test utilities
   - Avoid generic `any` types

2. **Use Proper Mocking:**
   - Mock at the module level with `vi.mock()`
   - Create well-typed mock responses 

3. **Handle Component Props:**
   - Use the provided component helpers for type-safe access
   - Create proper type definitions for component methods and properties

4. **Focus on One File at a Time:**
   - Fix base type definitions first
   - Then fix test utilities
   - Finally address individual component tests
