import { formSchema } from "@/lib/validators/FaqForm";
import { Faq } from "@/types/faq";
import { getTheme } from "@/utils/getPageTheme";
import React, { useState } from "react";
import { z } from "zod";

const Accordion = (props: { faqs: Faq[] | undefined; theme?: string }) => {
  const { faqs, theme } = props;

  const styles = getTheme(theme);
  return (
    <section className="dark:bg-dark relative z-20 overflow-hidden  pb-12 pt-10 lg:pb-[90px] lg:pt-[80px]">
      <div className=" mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto mb-[60px] max-w-[520px] text-center lg:mb-20">
              <h2
                className="text-dark mb-2 text-2xl font-bold md:text-4xl z"
                style={{
                  color: styles?.primary,
                }}
              >
                Frequently Asked Questions
              </h2>
              <p className=" text-sm ">
                Here you can find answers to some of the most frequently asked
                questions
              </p>
            </div>
          </div>
        </div>

        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-2 ">
            {faqs?.map((item, index) => (
              <AccordionItem
                key={index}
                header={item.question}
                text={item.answer}
                theme={theme}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Accordion;

const AccordionItem = (props: {
  header: string;
  text: string;
  theme?: string;
}) => {
  const { header, text, theme } = props;
  const [active, setActive] = useState(false);

  const styles = getTheme(theme);
  const handleToggle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setActive(!active);
  };

  return (
    <div
      className=" mx-4 mb-6 rounded-lg   p-4  shadow-xl sm:p-8 lg:px-6 xl:px-8  "
      style={{
        borderWidth: "1px",
        borderColor: styles?.primary,
      }}
    >
      <button
        className={` flex w-full text-left justify-center items-center`}
        onClick={(e) => handleToggle(e)}
      >
        <div
          className={`mr-5 flex h-10 w-full max-w-[40px] items-center justify-center rounded-lg   dark:bg-white/5`}
          style={{
            background: styles?.accent,
            color: styles?.primary,
          }}
        >
          <svg
            className={`fill-${styles?.primary} stroke-${styles?.primary} duration-200 ease-in-out ${
              active ? "rotate-180" : ""
            }`}
            width="17"
            height="10"
            viewBox="0 0 17 10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.28687 8.43257L7.28679 8.43265L7.29496 8.43985C7.62576 8.73124 8.02464 8.86001 8.41472 8.86001C8.83092 8.86001 9.22376 8.69083 9.53447 8.41713L9.53454 8.41721L9.54184 8.41052L15.7631 2.70784L15.7691 2.70231L15.7749 2.69659C16.0981 2.38028 16.1985 1.80579 15.7981 1.41393C15.4803 1.1028 14.9167 1.00854 14.5249 1.38489L8.41472 7.00806L2.29995 1.38063L2.29151 1.37286L2.28271 1.36548C1.93092 1.07036 1.38469 1.06804 1.03129 1.41393L1.01755 1.42738L1.00488 1.44184C0.69687 1.79355 0.695778 2.34549 1.0545 2.69659L1.05999 2.70196L1.06565 2.70717L7.28687 8.43257Z"
              fill=""
              stroke=""
            />
          </svg>
        </div>

        <div className="w-full">
          <h4 className=" mt-1 md:text-lg text-sm font-semibold ">{header}</h4>
        </div>
      </button>

      <div
        className={` pl-[62px] duration-200 ease-in-out ${
          active ? "block" : "hidden"
        }`}
      >
        <p className="  py-3 md:text-base text-sm leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
};
