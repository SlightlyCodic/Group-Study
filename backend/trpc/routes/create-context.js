import { initTRPC } from "@trpc/server";
import superjson from "superjson";

// Context creation function
export const createContext = async (opts) => {
  return {
    req: opts.req,
    // You can add more context items here like database connections, auth, etc.
  };
};

// Initialize tRPC
const t = initTRPC.context().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;