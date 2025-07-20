import { z } from "zod";
import { publicProcedure } from "../../create-context.js";
import { userDb } from "../../../../db/supabase.js";

export default publicProcedure
  .input(z.object({ 
    name: z.string().min(1).max(30),
    id: z.string()
  }))
  .mutation(async ({ input }) => {
    try {
      return await userDb.create(input.id, input.name);
    } catch (error) {
      // If user already exists, return existing user
      if (error.code === '23505') {
        return await userDb.getById(input.id);
      }
      throw error;
    }
  });