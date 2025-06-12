import { createTRPCQueryUtils, createTRPCReact, httpBatchLink } from '@trpc/react-query';
import type { AppRouter } from '@advanced-react/server';
import { useState } from 'react';
import { env } from './lib/utils/env';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from './routeTree.gen';
import Spinner from './features/shared/components/ui/Spinner';
import { ErrorComponent } from './features/shared/components/ErrorComponent';

export const queryClient = new QueryClient()

export const trpc = createTRPCReact<AppRouter>();

// const [trpcClient] = useState(() =>
//   trpc.createClient({
//     links: [
//       httpBatchLink({
//         url: env.VITE_SERVER_BASE_URL,
//       }),
//     ],
//   }),
// );
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: env.VITE_SERVER_BASE_URL,
    }),
  ],
});

export const trpcQueryUtils = createTRPCQueryUtils({
  queryClient,
  client: trpcClient
})

function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
    context: {
      trpcQueryUtils,
    },
    defaultPendingComponent: () => <div className='flex items-center justify-center'><Spinner /></div>,
    defaultErrorComponent: ErrorComponent,
    Wrap: function WrapComponent({ children }) {
      return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </trpc.Provider>
      );
    },
  });

  return router;
}

export const router = createRouter();
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}