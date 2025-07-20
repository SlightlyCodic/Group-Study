import { z } from "zod";
import { publicProcedure } from "../../../create-context.js";
import { userDb } from "../../../db/supabase.js";

export default publicProcedure
  .input(z.object({ 
    userId: z.string(),
    status: z.string().min(1).max(200)
  }))
  .mutation(async ({ input }) => {
    return await userDb.updateStatus(input.userId, input.status);
  });