"use client";
import { useRouter } from "next/router";
import React from "react";
import { api } from "@/utils/api";
import Loader from "@/components/loader";
import { FaqForm } from "@/components/faqForm";

function Page() {
  const router = useRouter();
  const title = router.query.slug as string;
  const { data: faq, isLoading: faqLoading } = api.faq.getFaqPage.useQuery(
    { faqTitle: title },
    {
      enabled: !!title,
      onSuccess: (data) => {
        if (!data) {
          return router.push("/404");
        }
      },
    },
  );

  return (
    <>
      {!faq ? (
        <Loader />
      ) : (
        <div className="mx-auto  h-full rounded-3xl  px-4 md:mt-4 md:max-w-[1200px] md:p-8 ">
          <FaqForm mode="edit" existingFaqData={faq} />
        </div>
      )}
    </>
  );
}

export default Page;
