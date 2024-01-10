import React, { CSSProperties, ReactNode } from "react";
import { Faq as FaqDetails, Social, FaqItem } from "@prisma/client";
import { Link1Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import { getTheme } from "@/utils/getPageTheme";
import Accordion from "./accordion";

interface CompleteFaq extends FaqDetails {
  socials: Social[];
  faqs: FaqItem[];
}
type Props = {
  faq: CompleteFaq;
};

function MainFaqSection({ faq }: Props) {
  const styles = getTheme(faq?.theme ?? undefined);
  const Subheading = (props: {
    children: ReactNode;
    [key: string]: any;
  }): React.ReactElement => {
    const { children, ...rest } = props;
    return (
      <div
        className={`text-lg font-semibold ${faq?.theme}  `}
        style={{
          color: `hsl(${styles?.primary})` ?? " ",
        }}
        {...rest}
      >
        {children}
      </div>
    );
  };
  return (
    <div
      className={`mx-auto md:mt-20  md:w-3/4 ${
        faq?.logo ?? faq?.backdrop ? "md:translate-y-10" : ""
      }`}
    >
      {faq?.backdrop && (
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
      <div className=" overflow-visible px-4">
        {faq?.logo && (
          <div
            className={`relative my-3  grid  items-center gap-1.5 rounded-3xl  py-6`}
          >
            <div
              className={`} absolute -bottom-16 left-1/2 mb-14  grid
    aspect-square w-[120px]  -translate-x-1/2 items-center  justify-center rounded-3xl border-[5px]   p-3   `}
              style={{
                backgroundImage: `url(${faq.logo})`,
                backgroundSize: "cover",
              }}
            />
          </div>
        )}
        <div className="pt-5 text-center text-3xl font-bold ">{faq?.title}</div>
        {faq?.organization && (
          <div className="text-center text-sm italic opacity-70">
            {faq.organization}
          </div>
        )}
        <div className="my-4 mt-10 flex w-full flex-col gap-10 md:flex-row">
          {faq?.description && (
            <div className={`${faq?.address && "md:w-[70%]"}`}>
              <Subheading>Description</Subheading>
              <p className="py-1 text-sm  ">{faq?.description}</p>
            </div>
          )}
          {faq && faq.socials?.length > 0 && (
            <div className="">
              <Subheading>Socials</Subheading>
              <div className="mt-1 flex gap-2">
                {faq.socials.map((social, index) => (
                  <Link
                    key={index}
                    href={social.url}
                    target="_blank"
                    className=" flex items-center justify-center gap-2 rounded-full  px-2 py-1 text-sm font-bold"
                    style={{
                      color: `hsl(${styles?.background})`,
                      background: `hsl(${styles?.primary})`,
                    }}
                  >
                    {social.name}
                    <Link1Icon />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        <div
          style={{
            height: ".1px",
            background: `hsl(${styles?.mutedForeground})`,
            width: "100%",
            margin: "auto",
            marginTop: "70px",
            opacity: 0.2,
          }}
        ></div>

        <Accordion faqs={faq?.faqs} theme={faq?.theme ?? undefined} />
      </div>
    </div>
  );
}

export default MainFaqSection;
