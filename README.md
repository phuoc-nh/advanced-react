# Advanced React Patterns

This project demonstrates advanced React patterns and best practices for building scalable, maintainable, and type-safe applications.

## Core Architectural Principles

### 1. Single Responsibility Pattern
- Each component has a single, well-defined responsibility
- Example: `ExperienceDetail.tsx` is broken down into smaller, focused components:
  - `ExperienceDetailsMedia`: Handles only media display
  - `ExperienceDetailsHeader`: Manages title display
  - `ExperienceDetailsContent`: Handles content rendering
  - `ExperienceDetailsMeta`: Manages metadata display
  - `ExperienceCardActionButtons`: Handles action buttons logic

### 2. Feature-First Organization
```
src/
  features/
    experiences/
      components/
      hooks/
      types.ts
      api.ts
    users/
      components/
      hooks/
      types.ts
    shared/
      components/
      hooks/
      utils/
```

### 3. Type Safety Across Stack
- Types are defined once in `types.ts` and shared across the stack
- Database schema types are propagated to server and client
- TypeScript ensures type consistency across the entire application
- Example:
```typescript
// types.ts
export type ExperienceForDetails = {
  id: string;
  title: string;
  content: string;
  // ... other fields
};

// Used consistently across components and API calls
```

### 4. Optimistic Updates
- Implemented in mutation hooks (e.g., `useExperienceMutation`)
- Updates UI immediately while handling server response in background
- Provides better user experience with immediate feedback
- Example:
```typescript
const mutation = useExperienceMutation({
  onMutate: (newExperience) => {
    // Optimistically update UI
    queryClient.setQueryData(['experiences'], (old) => [...old, newExperience]);
  }
});
```

### 5. Separation of Concerns
- UI Components: Pure presentational components
- Logic: Custom hooks for business logic
- Data Fetching: Separate API layer
- Example structure:
```typescript
// Component (UI)
function ExperienceCard({ experience }: ExperienceCardProps) {
  const { handleAttend } = useExperienceActions(experience.id);
  return <Button onClick={handleAttend}>Attend</Button>;
}

// Hook (Logic)
function useExperienceActions(experienceId: string) {
  const mutation = useExperienceMutation();
  return { handleAttend: () => mutation.mutate(experienceId) };
}

// API (Data Fetching)
const experienceApi = {
  attend: (id: string) => api.post(`/experiences/${id}/attend`)
};
```

<!-- ### 6. Minimal API Interface
- Types are exposed only when necessary
- Internal types remain private to their feature
- Example:
```typescript
// types.ts
export type ExperienceForDetails = {
  id: string;
  title: string;
  // Only expose necessary fields
};

// Internal type (not exported)
type ExperienceInternal = {
  id: string;
  title: string;
  internalField: string; // Not exposed to consumers
};
``` -->

### 6. Testing Considerations
- Pure components are easier to test
- Business logic in hooks can be tested independently
- Example:
```typescript
// Easy to test pure component
function ExperienceTitle({ title }: { title: string }) {
  return <h1>{title}</h1>;
}

// Testable hook
function useExperienceLogic(experienceId: string) {
  // Business logic here
  return { /* ... */ };
}
```

## Best Practices

1. **Component Design**
   - Keep components small and focused
   - Use composition over inheritance
   - Prefer pure functions for components

2. **State Management**
   - Use React Query for server state
   - Local state for UI-specific concerns
   - Context for global UI state

3. **Type Safety**
   - Define types at the feature level
   - Share types across the stack
   - Use strict TypeScript configuration

4. **Performance**
   - Implement optimistic updates
   - Use proper memoization
   - Lazy load components when possible

5. **Testing**
   - Write unit tests for pure functions
   - Test hooks independently
   - Use integration tests for complex flows

## Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Start the development server: `pnpm dev`

