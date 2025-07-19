import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './mocks/server'

// Start mock server before all tests
beforeAll(() => server.listen({
  onUnhandledRequest: 'error' // Fail tests on unhandled requests
}))

// Reset handlers between tests to avoid state leakage
afterEach(() => server.resetHandlers())

// Clean up after all tests
afterAll(() => server.close())
