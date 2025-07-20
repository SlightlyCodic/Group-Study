import { serve } from '@hono/node-server';
import app from './backend/index.js';

const port = process.env.PORT || 3000;

console.log("server.js is running");

serve({
  fetch: app.fetch,
  port: parseInt(port),
}, (info) => {
  console.log(`✅ Server is running on http://localhost:${info.port}`);
});