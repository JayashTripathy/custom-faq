import { formSchema } from "@/lib/validators/editFaqForm";
import { pagethemes } from "@/utils/faqThemes";
import React, { CSSProperties, ReactNode } from "react";
import { z } from "zod";
import Accordion from "./accordion";

function FaqSection(props: {
  faq: z.infer<typeof formSchema>;
  admin?: boolean;
}) {
  const { faq, admin = false } = props;

  const Subheading = (props: {
    children: ReactNode;
    [key: string]: any;
  }): React.ReactElement => {
    const { children, ...rest } = props;
    return (
      <div
        className={`text-lg font-semibold ${faq.theme} text-primary `}
        {...rest}
      >
        {children}
      </div>
    );
  };

  return (
    <div
      className={`mx-auto  md:w-3/5  ${
        faq.logo || faq.backdrop ? "md:translate-y-24" : ""
      }`}
      style={
        {
          "--test": "red",
        } as CSSProperties
      }
    >
      {faq.backdrop && (
        <div
          className="grid  aspect-[5/1] w-full items-center justify-center overflow-hidden   bg-muted md:rounded-3xl   "
          style={
            {
              backgroundImage: `url(${faq.backdrop})`,
              backgroundSize: "cover",
            } as CSSProperties
          }
        ></div>
      )}
      {faq.logo && (
        <div
          className={`relative my-3  grid w-full items-center gap-1.5 rounded-3xl bg-card py-6`}
        >
          <div
            className={`} absolute -bottom-16 left-1/2 mb-14  grid
            aspect-square w-[120px]  -translate-x-1/2 items-center  justify-center rounded-3xl border-[5px] border-background bg-muted p-3   `}
            style={{
              backgroundImage: `url(${faq.logo})`,
              backgroundSize: "cover",
            }}
          />
        </div>
      )}
      <div className="pt-5 text-center text-3xl font-bold ">{faq.title}</div>
      {faq.organization && <div className="text-center text-sm italic opacity-70">{faq.organization}</div>}
      <div className="my-4 mt-10 w-full  gap-2 md:flex">
        <div className={`${faq.address && "md:w-[70%]"}`}>
          <Subheading>Description</Subheading>
          <p className="py-1 text-sm  ">{faq.description}</p>
        </div>
        {faq.address && (
          <div className="">
            <Subheading>Socials</Subheading>
            <p className="py-1 text-sm ">{faq.address}</p>
          </div>
        )}
      </div>

      <Accordion/>
    </div>
  );
}

export default FaqSection;
