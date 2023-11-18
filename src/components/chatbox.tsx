import { getTheme } from "@/utils/getPageTheme";
import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  Send,
  SendHorizontal,
  User,
  User2,
  User2Icon,
  X,
} from "lucide-react";
import { Textarea } from "./ui/textarea";
import { useAtom } from "jotai";
import { Storage, storageAtom } from "@/storage";
import { api } from "@/utils/api";
function ChatBox(props: {
  theme?: string;
  onClose?: () => void;
  open?: boolean;
  faqId: string;
}) {
  const { theme, onClose, open, faqId } = props;
  const styles = getTheme(theme);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");
  const [storage, setStorage] = useAtom(storageAtom);

  const chatAnimation = open ? "chat " : "hideChat";

  const aiMsgMutation = api.faq.generateAIResponse.useMutation();

  const onSend = () => {
    setStorage((p) => ({
      ...p,
      messages: [
        ...(p?.messages ?? []),
        {
          faqid: faqId,
          isSent: true,
          timestamp: Date.now(),
          message: input,
        },
      ],
    }));
    setInput(() => " ");
    aiMsgMutation.mutate({ faqId: faqId, question: input });
  };

  return (
    <div
      className={`fixed left-0 top-0 z-[51] flex h-screen  w-screen ${chatAnimation}   `}
    >
      <div
        className=" relative mx-5 my-10 flex   w-full flex-col rounded-3xl shadow-lg lg:mx-auto lg:w-2/5 "
        style={{
          backgroundColor: styles?.popover,
          color: styles?.popoverForeground,
        }}
      >
        <div>
          <div className="flex justify-between px-5">
            <div className="my-3 flex items-center gap-2 font-bold ">
              <span
                className="aspect-square rounded-full p-2"
                style={{
                  backgroundColor: styles?.primary,
                  color: styles?.primaryForeground,
                }}
              >
                <Bot />{" "}
              </span>
              AI
            </div>
            <button onClick={onClose}>
              <X className="cursor-pointer transition-all duration-100 hover:scale-75 hover:opacity-60" />
            </button>
          </div>
          <div
            style={{
              borderWidth: "1px",
              opacity: 0.2,
              borderColor: styles?.popoverForeground,
              width: "100%",
            }}
          ></div>
        </div>

        <div className=" flex flex-1 flex-col  overflow-auto ">
          {storage?.messages?.map((item, index) => (
            <div
              key={index}
              className="px-4 py-2 "
              style={{
                backgroundColor: item.isSent ? " " : styles?.muted,
                color: item.isSent ? " " : styles?.primary,
              }}
            >
              <div className="flex gap-5">
                <div className=" opacity-50 ">
                  {item.isSent ? <User2Icon /> : <Bot />}
                </div>
                {item.message}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 flex w-full  items-end p-1 ">
          <textarea
            className=" h-[50px]  max-h-[400px] flex-1 resize-none overflow-auto rounded-2xl p-3  outline-none"
            style={{
              background: styles?.muted,
              color: styles?.mutedForeground,
            }}
            ref={inputRef}
            value={input}
            onInput={(e) => {
              setInput(e.currentTarget.value);
              e.currentTarget.style.height = "50px";
              e.currentTarget.style.height =
                e.currentTarget.scrollHeight + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
          />
          <button
            className="absolute right-2  flex cursor-pointer items-center justify-center rounded-2xl p-3"
            style={{
              color: styles?.primary,
            }}
            onClick={onSend}
          >
            <SendHorizontal />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
