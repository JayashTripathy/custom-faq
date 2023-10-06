import { db } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const faqRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return db.faq.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  delete: protectedProcedure
    .input(
      z.object({
        faqId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
        const {id} = ctx.session.user

        const faq = await db.faq.findFirst({
            where:{
                id: input.faqId,
                userId: id
            }
        });

        if (!faq) throw new TRPCError({code: "NOT_FOUND"});

        return db.faq.delete({
            where: {
                id: faq?.id
            }
        });
    }),
});
