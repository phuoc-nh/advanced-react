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
  console.log("All Headers:", JSON.stringify(opts.req.headers, null, 2));
  console.log("All Cookies:", JSON.stringify(opts.req.cookies, null, 2));
  console.log("Environment:", process.env.NODE_ENV);

  // Get authorization header
  const authHeader = opts.req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  if (!authHeader) {
    console.log("❌ No authorization header found");
    return context;
  }

  // If no authorization header, return
  if (!authHeader) {
    return context;
  }

  // Get token from authorization header
  const token = authHeader.split(" ")[1];
  console.log("Extracted Token:", token);
  console.log("Token Length:", token ? token.length : 0);
  // Verify access token
  const accessTokenPayload = auth.verifyToken(token);

  if (!accessTokenPayload) {
    // Get refresh token from cookies
    const refreshToken = opts.req.cookies["refreshToken"];
    console.log("refreshToken from cookies:", refreshToken);
    // If no refresh token, return
    if (!refreshToken) {
      return context;
    }

    // Verify refresh token
    const refreshTokenPayload = auth.verifyToken(refreshToken);

    // If refresh token is invalid or no user id, return
    if (!refreshTokenPayload || !refreshTokenPayload.userId) {
      return context;
    }

    // Get user from database
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, refreshTokenPayload.userId),
    });

    // If user not found, return
    if (!user) {
      return context;
    }

    const accessToken = auth.createToken(
      { refreshToken },
      { expiresIn: "15m" },
    );
    console.log("accessToken with refreshToken:", accessToken);
    context.user = user;
    context.accessToken = accessToken;
  } else {
    // If no refresh token inside access token, return
    if (!accessTokenPayload.refreshToken) {
      return context;
    }

    const refreshTokenPayload = auth.verifyToken(
      accessTokenPayload.refreshToken,
    );

    // If refresh token is invalid or no user id, return
    if (!refreshTokenPayload || !refreshTokenPayload.userId) {
      return context;
    }

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, refreshTokenPayload.userId),
    });

    // If user not found, return
    if (!user) {
      return context;
    }

    context.user = user;
  }

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
