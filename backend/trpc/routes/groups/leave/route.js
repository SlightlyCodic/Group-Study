import { z } from "zod";
import { publicProcedure } from "../../create-context.js";
import { groupDb } from "../../../db/supabase.js";

export default publicProcedure
  .input(z.object({ 
    groupId: z.string(),
    userId: z.string()
  }))
  .mutation(async ({ input }) => {
    return await groupDb.leave(input.groupId, input.userId);
  });