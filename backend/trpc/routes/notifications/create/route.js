import { z } from "zod";
import { publicProcedure } from "../../create-context.js";
import { notificationDb } from "../../../../db/supabase.js";

export default publicProcedure
  .input(z.object({ 
    notifications: z.array(z.object({
      id: z.string(),
      userId: z.string(),
      userName: z.string(),
      groupId: z.string(),
      groupName: z.string(),
      message: z.string(),
      timestamp: z.string(),
      read: z.boolean(),
    }))
  }))
  .mutation(async ({ input }) => {
    await notificationDb.create(input.notifications);
    return { success: true };
  });