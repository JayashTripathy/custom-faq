import { useRouter } from "next/router";
import React from "react";
import { api } from "@/utils/api";
import Loader from "@/components/Loader";

function index() {
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

  console.log("edot", faqLoading);
  return <>{!faq ? <Loader /> : <div>dsadsad</div>}</>;
}

export default index;
