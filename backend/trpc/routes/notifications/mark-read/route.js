import { z } from "zod";
import { publicProcedure } from "../../create-context.js";
import { notificationDb } from "../../../db/supabase.js";

export default publicProcedure
  .input(z.object({ 
    notificationId: z.string()
  }))
  .mutation(async ({ input }) => {
    return await notificationDb.markRead(input.notificationId);
  });