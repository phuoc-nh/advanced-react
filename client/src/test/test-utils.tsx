import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, RenderOptions } from '@testing-library/react'
import { createTRPCReact, httpLink } from '@trpc/react-query'
import type { AppRouter } from '@advanced-react/server'

// Create a mock tRPC client for testing
const testTrpc = createTRPCReact<AppRouter>()

function createTestTrpcClient() {
	return testTrpc.createClient({
		links: [
			httpLink({
				url: 'http://localhost:3000/api/trpc', // Match the actual tRPC endpoint
			}),
		],
	})
}

// Custom render function with providers
function createTestQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				gcTime: 0,
			},
			mutations: {
				retry: false,
			},
		},
	})
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
	queryClient?: QueryClient
}

export function renderWithProviders(
	ui: React.ReactElement,
	{
		queryClient = createTestQueryClient(),
		...renderOptions
	}: CustomRenderOptions = {}
) {
	const trpcClient = createTestTrpcClient()

	function Wrapper({ children }: { children: React.ReactNode }) {
		return (
			<testTrpc.Provider client={trpcClient} queryClient={queryClient}>
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
			</testTrpc.Provider>
		)
	}

	return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Re-export everything from testing-library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
