import { db } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";


export const faqRouter = createTRPCRouter({
    getAll: protectedProcedure.query(({ctx}) => {
        return db.faq.findMany({
            where: {
                userId: ctx.session.user.id
            }
        })
    })
})