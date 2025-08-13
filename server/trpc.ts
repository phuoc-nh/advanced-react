import { initTRPC, TRPCError } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { eq } from "drizzle-orm";
import { ZodError } from "zod";

import { db } from "./database";
import { auth } from "./features/auth";
import { CurrentUser, usersTable } from "./features/auth/models";

// Context available to all procedures
type Context = Awaited<ReturnType<typeof createContext>>;

// Create context for each request
export async function createContext(
  opts: trpcExpress.CreateExpressContextOptions,
) {
  const context = {
    req: opts.req,
    res: opts.res,
    user: null as CurrentUser | null,
    accessToken: null as string | null,
  };
  console.log("=== CREATE CONTEXT DEBUG ===");
  console.log("Request URL:", opts.req.url);
  console.log("Request Method:", opts.req.method);
  console.log("Cookie Header:", opts.req.headers.cookie);
  console.log("Parsed Cookies:", opts.req.cookies);
  console.log("Environment:", process.env.NODE_ENV);

  // Get authorization header
  const authHeader = opts.req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  // 🔧 FIX: Try access token first, then fall back to refresh token
  if (authHeader && authHeader !== "undefined") {
    const token = authHeader.split(" ")[1];
    console.log("Extracted Token:", token);
    
    const accessTokenPayload = auth.verifyToken(token);
    console.log("Access Token Payload:", accessTokenPayload);

    if (accessTokenPayload && accessTokenPayload.refreshToken) {
      // Valid access token - get user from embedded refresh token
      const refreshTokenPayload = auth.verifyToken(accessTokenPayload.refreshToken);
      // const s = auth.verifyToken(refreshToken);
      if (refreshTokenPayload && typeof refreshTokenPayload !== 'boolean' && refreshTokenPayload.userId) {
        const user = await db.query.usersTable.findFirst({
          where: eq(usersTable.id, refreshTokenPayload.userId),
        });
        
        if (user) {
          context.user = user;
          console.log("✅ User authenticated via access token");
          return context;
        }
      }
    }
  }

  // 🔧 FIX: If access token failed/missing, try refresh token from cookies
  const refreshToken = opts.req.cookies["refreshToken"];
  console.log("refreshToken from cookies:", refreshToken);
  
  if (refreshToken) {
    const refreshTokenPayload = auth.verifyToken(refreshToken);
    console.log("Refresh Token Payload:", refreshTokenPayload);

    if (refreshTokenPayload && typeof refreshTokenPayload !== 'boolean' && refreshTokenPayload.userId) {
      const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.id, refreshTokenPayload.userId),
      });

      if (user) {
        // Create new access token
        const accessToken = auth.createToken(
          { refreshToken },
          { expiresIn: "15m" },
        );
        
        console.log("✅ User authenticated via refresh token, new access token created");
        console.log("New access token:", accessToken);
        
        context.user = user;
        context.accessToken = accessToken;
        return context;
      }
    }
  }

  console.log("❌ No valid authentication found");
  return context;
}

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  errorFormatter(opts) {
    const { shape, error } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          // Only show zod errors for bad request errors
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

// Create protected procedure
const authMiddleware = t.middleware(({ next, ctx }) => {
  console.log("authMiddleware - ctx.user", ctx.user);
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated!!!",
    });
  }

  return next({
    ctx: {
      ...ctx,
      // Ready to be used in procedures
      user: ctx.user as CurrentUser,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(authMiddleware);
