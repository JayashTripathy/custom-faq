
import { useRouter } from "next/router";
import React from "react";
import { api } from "@/utils/api";
import Loader from "@/components/loader";
import { FaqForm } from "@/components/faqForm";
import { ArrowLeft } from "lucide-react";

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
        <div className="flex h-full w-full items-center justify-center">
          <Loader className="w-10 " />
        </div>
      ) : (
        <div className="mx-auto  h-full rounded-3xl  px-4 md:mt-4 md:max-w-[1200px] md:p-8 ">
          <button
            className="flex gap-2 py-3 text-primary"
            onClick={() => router.back()}
          >
            {" "}
            <ArrowLeft /> back to dashboard
          </button>
          <hr />
          <br />
          <FaqForm mode="edit" existingFaqData={faq} />
        </div>
      )}
    </>
  );
}

export default Page;
