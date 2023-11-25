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
import { storageAtom } from "@/storage";
import { api } from "@/utils/api";
import { toast } from "./ui/use-toast";
import { Stream } from "stream";
function ChatBox(props: {
  theme?: string;
  onClose?: () => void;
  open?: boolean | null;
  faqId: string;
}) {
  const { theme, onClose, open, faqId } = props;
  const styles = getTheme(theme);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");
  const [storage, setStorage] = useAtom(storageAtom);
  const [streamingRes, setStreamingRes] = useState("");
  const chatAnimation =
    open === null ? "-translate-y-[100%]" : open ? "chat " : "hideChat";

  const aiMsgMutation = api.faq.generateAIResponse.useMutation();

  const onSend = () => {
    if (!input) {
      toast({
        variant: "default",
        title: "Error!",
        description: ` Message cannot be empty!`,
      });
      return;
    }
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
    setInput(() => "");
    aiMsgMutation.mutate(
      { faqId: faqId, question: input },
      {
        onSuccess: async (data: any) => {
          try {
            const response = await fetch("/api/ask", {
              method: "POST",
              body: JSON.stringify({
                faqId: faqId,
                question: input,
                context: data,
                prevQuestions: storage?.messages.slice(-5),
              }),
            });
            if (response.status === 500) {
              toast({
                variant: "default",
                title: "Error!",
                description: `Something went wrong!`,
              });
              return;
            }

            if (response.body) {
              const reader = response.body.getReader();
              const decoder = new TextDecoder();
              let done = false;
              let finalRes = "";
              while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value);
                setStreamingRes((p) => p + chunkValue);
                finalRes += chunkValue;
              }
              setStreamingRes("");
              setStorage((p) => ({
                ...p,
                messages: [
                  ...(p?.messages ?? []),
                  {
                    faqid: faqId,
                    isSent: false,
                    timestamp: Date.now(),
                    message: finalRes,
                  },
                ],
              }));
            }
          } catch (e) {
            console.log(e);
          }
        },
      },
    );
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

        <div className=" mb-16 flex flex-1  flex-col overflow-auto ">
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
          {streamingRes && (
            <div
              className="px-4 py-2 "
              style={{
                backgroundColor: styles?.muted,
                color: styles?.primary,
              }}
            >
              <div className="flex gap-5">
                <div className=" opacity-50 ">
                  <Bot />
                </div>
                {streamingRes}
              </div>
            </div>
          )}
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
