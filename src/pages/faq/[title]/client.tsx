"use client";
import React, { CSSProperties, ReactNode, useEffect } from "react";
import Link from "next/link";
import { Link1Icon } from "@radix-ui/react-icons";
import { getTheme } from "@/utils/getPageTheme";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import Accordion from "@/components/accordion";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/use-toast";



function Client(props: { title: string }) {
  const { title } = props;
  const { data } = useSession();

  const me = data?.user;
  const router = useRouter();
  const { data: faq } = api.faq.getFaqPage.useQuery(
    { faqTitle: title },
    {
      enabled: !!title,
    },
  );
  const styles = getTheme(faq?.theme ?? undefined);
  const searchParams = useSearchParams();
  const adminMode = searchParams.get("adminMode");

  const isAdmin = me?.id == faq?.userId;



  

  const Subheading = (props: {
    children: ReactNode;
    [key: string]: any;
  }): React.ReactElement => {
    const { children, ...rest } = props;
    return (
      <div
        className={`text-lg font-semibold ${faq?.theme} text-primary `}
        style={{
          color: styles?.primary ?? " ",
        }}
        {...rest}
      >
        {children}
      </div>
    );
  };

  console.log(faq);

  const pageUrl = window.location.href.split("?")[0];

  return (
    <div
      className={` absolute inset-0 h-screen overflow-auto   `}
      style={
        {
          background: styles?.background,
          color: styles?.foreground,
        } as CSSProperties
      }
    >
      {isAdmin && adminMode ? (
        <div
          className=" mx-2 my-4 mb-0  rounded-2xl p-3  md:mx-auto md:w-3/4 "
          style={{
            background: styles?.accent,
          }}
        >
          <div className="">
            <div className="flex items-center">
              <div className="max-w-[100px] rounded-full  p-4  ">
                <img src="/stars.gif" className=" w-full  " />
              </div>
              <div className="flex w-full items-center justify-between">
                <div>
                  <div
                    className="text-2xl font-bold "
                    style={{
                      color: styles?.primary,
                    }}
                  >
                    Your page is live!
                  </div>
                  <div
                    className="text-sm"
                    style={{
                      color: styles?.mutedForeground,
                    }}
                  >
                    page is now accessible and you can share this where you
                    viewers <br />
                  </div>
                </div>
                <div className="flex gap-2 p-3">
                  <button
                    className={` ] aspect-square h-full rounded-2xl p-3 `}
                    style={{
                      borderColor: styles?.primary,
                      borderWidth: "1px",
                      borderStyle: "solid",
                    }}
                    onClick={async () => {
                      if (pageUrl) {
                        await navigator.clipboard.writeText(pageUrl);
                        toast({
                          title: "Success!",
                          description: "Link copied to clipboard",
                          type: "background",
                          duration: 2000,
                        });
                      }
                    }}
                  >
                    <Copy size={30} />
                  </button>
                  <button
                    style={{
                      background: styles?.primary,
                      color: styles?.background,
                    }}
                    className=" aspect-square h-full rounded-2xl p-3"
                    onClick={() =>
                      pageUrl &&
                      void window.open(pageUrl, "_blank", "noreferrer")
                    }
                  >
                    <ExternalLink size={30} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div
        className={` mx-auto  md:w-3/4 ${
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
        <div className="w-full overflow-visible">
          {faq?.logo && (
            <div
              className={`relative my-3  grid w-full items-center gap-1.5 rounded-3xl  py-6`}
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
          <div className="pt-5 text-center text-3xl font-bold ">
            {faq?.title}
          </div>
          {faq?.organization && (
            <div className="text-center text-sm italic opacity-70">
              {faq.organization}
            </div>
          )}
          <div className="my-4 mt-10 flex w-full flex-col gap-10 md:flex-row">
            <div className={`${faq?.address && "md:w-[70%]"}`}>
              <Subheading>Description</Subheading>
              <p className="py-1 text-sm  ">{faq?.description}</p>
            </div>
            {faq?.socials && (
              <div className="">
                <Subheading>Socials</Subheading>
                <div className="mt-1 flex">
                  {faq.socials.map((social, index) => (
                    <Link
                      key={index}
                      href={social.url}
                      className=" flex items-center justify-center gap-2 rounded-full  px-2 py-1 text-sm"
                      style={{
                        color: styles?.background,
                        background: styles?.primary,
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

          <Accordion faqs={faq?.faqs} theme={faq?.theme ?? undefined} />
        </div>
      </div>
    </div>
  );
}

export default Client;
