import { db } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { formSchema } from "@/lib/validators/editFaqForm";

export const faqRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return db.faq.findMany({
      where: {
        userId: ctx.session.user.id,
      },

      include:{
        faqs: true,
      }
    });
  }),
  delete: protectedProcedure
    .input(
      z.object({
        faqId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = ctx.session.user;
      const faq = await db.faq.findFirst({
        where: {
          id: input.faqId,
          userId: id,
        },
      });
      
      if (!faq) throw new TRPCError({ code: "NOT_FOUND" });

      const deleteFaqPage = db.faq.delete({
        where: {
          id: faq?.id,
        },
        
      });

      const deleteFaq = db.faqItem.deleteMany({
        where:{
          faqId: faq?.id,
        }
        
      })
      await db.$transaction([deleteFaq, deleteFaqPage]);
      
      return faq;
   
    }),
  create: protectedProcedure
    .input(formSchema)
    .mutation(async ({ ctx, input }) => {
      const { id } = ctx.session.user;
      try {
        const faq = await db.faq.create({
          data: {
            ...input, 
            faqs: {
              createMany: {
                data: input.faqs.map((faq) => ({
                  question: faq.question,
                  answer: faq.answer,
                })),
              },
            },
            userId: id,
          },
          include: {
            faqs: true,
          },
        });

        return faq;
      } catch (err: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while submitting the form",
        });
      }
    }),

  getFaqPage: protectedProcedure
    .input(
      z.object({
        faqTitle: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return db.faq.findFirst({
        where: {
          title: input.faqTitle,
          userId: ctx.session.user.id,
        },

        include:{
          faqs: true,
        }
      });
    }),
});
