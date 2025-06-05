import { useState } from "react";
import Navbar from "./features/shared/components/Navbar";
import { ThemeProvider } from "./features/shared/components/ThemeProvider";
import { Toaster } from "./features/shared/components/ui/Toaster";
import { trpc } from "./trpc";
import { httpBatchLink } from "@trpc/react-query";
import { env } from "./lib/utils/env";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ExperienceList from "./features/experiences/components/ExperienceList";

export function App() {

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: env.VITE_SERVER_BASE_URL,
          // You can pass any HTTP headers you wish here
          // async headers() {
          //   return {
          //     authorization: getAuthCookie(),
          //   };
          // },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {/* Your app here */}

        <ThemeProvider defaultTheme="dark" >
          <Toaster />
          <div className="flex justify-center gap-8 pb-8">
            <Navbar />
            <div className="min-h-screen w-full max-w-2xl">
              <header className="mb-4 border-b border-neutral-200 p-4 dark:border-neutral-800">
                <h1 className="text-center text-xl font-bold">
                  Advanced Patterns React
                </h1>
                <p className="text-center text-sm text-neutral-500">
                  <b>
                    <span className="dark:text-primary-500">Cosden</span> Solutions
                  </b>
                </p>
              </header>
              <Index />
            </div>
          </div>
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function Index() {
  const experienceQuery = trpc.experiences.feed.useQuery({})



  return (
    <ExperienceList
      experiences={experienceQuery.data?.experiences ?? []}
      isLoading={experienceQuery.isLoading}
    />
  )
}