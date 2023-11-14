import { getTheme } from "@/utils/getPageTheme";
import React from "react";
import { Bot, X } from "lucide-react";
function ChatBox(props: { theme?: string }) {
  const { theme } = props;
  const styles = getTheme(theme);
  return (
    <div className="fixed left-0 top-0 z-[51] flex h-screen  w-screen  backdrop-blur-md">
      <div
        className=" mx-5 my-10 flex w-full   flex-col rounded-3xl shadow-lg lg:mx-auto lg:w-2/5 "
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
            <X className="cursor-pointer transition-all duration-100 hover:scale-75 hover:opacity-60" />
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
        <div>dbus</div>
      </div>
    </div>
  );
}

export default ChatBox;
