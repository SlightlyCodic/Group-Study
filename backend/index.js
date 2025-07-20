import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router.js";
import { createContext } from "./trpc/create-context.js";

const app = new Hono();

// Enable CORS for all routes
app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

// Mount tRPC router at /api/trpc
app.use(
  "/api/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext,
  })
);

// Simple health check endpoint
app.get("/", (c) => {
  return c.json({ 
    status: "ok", 
    message: "Group Status API is running on Railway",
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 3000
  });
});

app.get("/api", (c) => {
  return c.json({ 
    status: "ok", 
    message: "Group Status API is running on Railway",
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 3000
  });
});

export default app;