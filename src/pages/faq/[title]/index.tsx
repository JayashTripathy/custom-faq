import React from "react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import FaqSection from "@/components/faqSection";
import { formSchema } from "@/lib/validators/editFaqForm";
import { z } from "zod";

function Index() {
  const router = useRouter();
  const title = router.query.title as string;

  const { data: pageData } = api.faq.getFaqPage.useQuery(
    { faqTitle: title },
    {
      enabled: !!title,
    },
  );
  console.log(pageData);
  const faqPage: z.infer<typeof formSchema> | null = pageData && {
    ...pageData,
    title: pageData.title,
    faqs:
      pageData?.faqs?.map((faq) => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
      })) || [],
    logo: pageData.logo ?? undefined,
    backdrop: pageData.backdrop ?? undefined,
    organization: pageData.organization ?? undefined,
    description: pageData.description ?? undefined,
    address: pageData.address ?? undefined,
    theme: pageData.theme ?? undefined,
  } || null;

  return faqPage ? <FaqSection faq={faqPage} /> : <></>;
}

export default Index;
