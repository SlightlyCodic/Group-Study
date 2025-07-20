import { z } from "zod";
import { publicProcedure } from "../../create-context.js";
import { notificationDb } from "../../../db/supabase.js";

export default publicProcedure
  .input(z.object({ 
    userId: z.string()
  }))
  .query(async ({ input }) => {
    return await notificationDb.getUserNotifications(input.userId);
  });