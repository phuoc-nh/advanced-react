# MSW Mock Server Setup

This project uses **Mock Service Worker (MSW)** for integration testing with a mock server that intercepts HTTP requests.

## Setup Complete ✅

The following files have been created and configured:

### Core MSW Files
- `src/test/mocks/handlers.ts` - API endpoint handlers
- `src/test/mocks/server.ts` - MSW server configuration
- `src/test/setup.ts` - Test setup with MSW lifecycle
- `vitest.config.ts` - Vitest configuration

### Test Utilities
- `src/test/test-utils.tsx` - Custom render function with providers
- `src/features/experiences/components/__tests__/ExperienceCard.integration.test.tsx` - Example integration test

## Usage

### Running Tests

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

Then run:
```bash
pnpm test
```

### Writing Integration Tests

Use the provided test utilities:

```tsx
import { renderWithProviders } from '@/test/test-utils'
import { server } from '@/test/mocks/server'
import { http, HttpResponse } from 'msw'

// Override handlers for specific tests
server.use(
  http.post('/api/trpc/experiences.attend', () => {
    return HttpResponse.json({ result: { data: { id: 1 } } })
  })
)
```

### Key Features

✅ **Real HTTP Interception** - Tests actual network calls
✅ **tRPC Compatible** - Handles tRPC endpoint format  
✅ **Error Testing** - Easy to mock error scenarios
✅ **Type Safe** - Full TypeScript support
✅ **Isolated Tests** - Each test can customize responses

The mock server is now ready for integration testing!
