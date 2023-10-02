"useClient"
import React from "react";
import { MainHeader } from "./ui/header";
import { ModeToggle } from "./ui/modeToggle";
import { useTheme } from "next-themes";

function Navbar() {
  const { theme, setTheme, systemTheme } = useTheme();
  return (
    <div className="p-4">
      <MainHeader
        heading={
          <img
            src={`logo-${
              theme === "system"
                ? systemTheme === "dark"
                  ? "dark"
                  : "light"
                : theme === "dark"
                ? "dark"
                : "light"
            }.png`}
            className="max-w-[200px]"
          />
        }
      >
        <ModeToggle />
      </MainHeader>
    </div>
  );
}

export default Navbar;
