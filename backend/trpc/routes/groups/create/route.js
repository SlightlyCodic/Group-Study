import { z } from "zod";
import { publicProcedure } from "../../create-context.js";
import { groupDb } from "../../../db/supabase.js";

export default publicProcedure
  .input(z.object({ 
    groupName: z.string().min(1).max(30),
    userId: z.string(),
    groupId: z.string()
  }))
  .mutation(async ({ input }) => {
    return await groupDb.create(input.groupId, input.groupName, input.userId);
  });