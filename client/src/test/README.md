# MSW Mock Server Setup

This project uses **Mock Service Worker (MSW)** to mock API calls during integration testing. This allows for realistic testing without hitting real APIs.

## Files Structure

```
src/test/
├── setup.ts                     # Test setup with MSW server lifecycle
├── test-utils.tsx               # Custom render utilities with providers
└── mocks/
    ├── handlers.ts              # API request handlers
    └── server.ts                # MSW server configuration
```

## Usage

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

### Writing Integration Tests

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { server } from '@/test/mocks/server'
import { http, HttpResponse } from 'msw'
import { renderWithProviders } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'

describe('Component Integration Tests', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    server.resetHandlers()
  })

  it('handles successful API call', async () => {
    // Override default handler for this test
    server.use(
      http.post('/api/trpc/experiences.attend', () => {
        return HttpResponse.json({
          result: { data: { id: 1 } }
        })
      })
    )

    renderWithProviders(<YourComponent />)

    const button = screen.getByText('Attend')
    await user.click(button)

    // Assert expected behavior
    expect(screen.getByText('Success')).toBeInTheDocument()
  })

  it('handles API error', async () => {
    // Mock error response
    server.use(
      http.post('/api/trpc/experiences.attend', () => {
        return HttpResponse.json({
          error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to attend'
          }
        }, { status: 500 })
      })
    )

    renderWithProviders(<YourComponent />)

    const button = screen.getByText('Attend')
    await user.click(button)

    // Assert error handling
    expect(screen.getByText('Error occurred')).toBeInTheDocument()
  })
})
```

### Mocking Hooks

```typescript
// Mock tRPC hooks
vi.mock('@/lib/trpc', () => ({
  trpc: {
    experiences: {
      attend: {
        useMutation: () => ({
          mutate: vi.fn(),
          isPending: false,
        })
      }
    }
  }
}))

// Mock current user
vi.mock('@/features/auth/hooks/useCurrentUser', () => ({
  useCurrentUser: () => ({
    currentUser: { id: 2, name: 'Test User' }
  })
}))
```

## Benefits

1. **Real HTTP Intercepting**: MSW intercepts actual HTTP requests at the network level
2. **No API Dependencies**: Tests run without needing a real backend
3. **Realistic Testing**: Tests the full request/response cycle
4. **Error Scenarios**: Easy to test failure cases
5. **Isolated Tests**: Each test can customize API responses
6. **Fast Execution**: No network latency, tests run quickly

## Key Features

- **Automatic Setup**: MSW server starts/stops automatically with test lifecycle
- **Request Matching**: Handlers match requests by method and URL
- **Response Customization**: Easy to customize responses per test
- **Error Simulation**: Built-in error handlers for testing edge cases
- **Type Safety**: Full TypeScript support with proper typing

## Configuration

The MSW setup is configured in:

- `vitest.config.ts`: Vitest configuration with jsdom environment
- `src/test/setup.ts`: MSW server lifecycle management
- `src/test/mocks/handlers.ts`: Default API handlers
- `src/test/mocks/server.ts`: MSW server instance
