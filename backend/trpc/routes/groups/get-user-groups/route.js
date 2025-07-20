import { z } from "zod";
import { publicProcedure } from "../../../create-context.js";
import { groupDb } from "../../../db/supabase.js";

export default publicProcedure
  .input(z.object({ 
    userId: z.string()
  }))
  .query(async ({ input }) => {
    return await groupDb.getUserGroups(input.userId);
  });