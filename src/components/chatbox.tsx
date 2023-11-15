import { getTheme } from "@/utils/getPageTheme";
import React, { useEffect, useRef, useState } from "react";
import { Bot, Send, SendHorizontal, X } from "lucide-react";
import { Textarea } from "./ui/textarea";
function ChatBox(props: { theme?: string; onClose?: () => void, open?: boolean }) {
  const { theme, onClose , open } = props;
  const styles = getTheme(theme);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");
  
  const chatAnimation = open ? "chat  backdrop-blur-md" : "hideChat"
  return (
    <div className={`fixed left-0 top-0 z-[51] flex h-screen  w-screen ${chatAnimation}   `} >
      <div
        className=" relative mx-5 my-10 flex   w-full flex-col rounded-3xl shadow-lg lg:mx-auto lg:w-2/5 "
        style={{
          backgroundColor: styles?.popover,
          color: styles?.popoverForeground,
        }}
      >
        <div>
          <div className="flex justify-between p-5">
            <div className="flex gap-2 font-bold ">
              <Bot /> Chat with AI
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
        <div className=" flex-1 overflow-auto">sda</div>
        <div className="absolute bottom-0 flex w-full  items-end p-1 ">
          <textarea
            className=" h-[50px]  max-h-[400px] flex-1 resize-none overflow-auto rounded-2xl p-3  outline-none"
            style={{
              background: styles?.muted,
              color: styles?.mutedForeground,
            }}
            ref={inputRef}
            defaultValue={input}
            onInput={(e) => {
              setInput(e.currentTarget.value);
              e.currentTarget.style.height = "50px";
              e.currentTarget.style.height =
                e.currentTarget.scrollHeight + "px";
            }}
          />
          <div
            className="absolute right-2  flex cursor-pointer items-center justify-center rounded-2xl p-3"
            style={{
              color: styles?.primary,
            }}
          >
            <SendHorizontal />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
