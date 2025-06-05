import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@advanced-react/server';
 
export const trpc = createTRPCReact<AppRouter>();