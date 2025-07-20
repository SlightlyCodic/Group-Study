import { z } from "zod";
import { publicProcedure } from "../../../create-context.js";
import { groupDb } from "../../../db/supabase.js";

export default publicProcedure
  .input(z.object({ 
    inviteCode: z.string().length(6),
    userId: z.string()
  }))
  .mutation(async ({ input }) => {
    return await groupDb.join(input.inviteCode, input.userId);
  });