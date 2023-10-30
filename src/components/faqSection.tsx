import { formSchema } from "@/lib/validators/editFaqForm";
import React from "react";
import { z } from "zod";

function FaqSection(props: { faq: z.infer<typeof formSchema> }) {
  const { faq } = props;


  return (
    <div className={`mx-auto md:w-3/5 px-2  ${(faq.logo || faq.backdrop) ? " translate-y-24" : ""}`}>
      <div className={`relative my-3  grid w-full items-center gap-1.5 rounded-3xl bg-card py-6`}>
        {faq.logo && (
          <div
            className={`} absolute -bottom-16 left-1/2 grid  aspect-square
            w-[120px] -translate-x-1/2  items-center justify-center  rounded-3xl border-[5px] border-background bg-muted p-3 mb-20   `}
            style={{
              backgroundImage: `url(${faq.logo})`,
              backgroundSize: "cover",
            }}
          />
        )}
      </div>
      <div className="text-center text-3xl font-bold">{faq.title}</div>
      <div className="my-4 mt-10">
        <div className={`text-lg font-semibold ${faq.theme} text-primary `}>Description</div>
        <p className="py-1 text-sm ">{faq.description}</p>
      </div>
    </div>
  );
}

export default FaqSection;
