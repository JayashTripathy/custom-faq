"use client";
import React, { useEffect } from "react";
import { MainHeader } from "./ui/header";
import { ModeToggle } from "./ui/modeToggle";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Icons } from "./icons";
import { LogOut } from "lucide-react";
import { set } from "zod";

function Navbar() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [logoTheme, setLogoTheme] = React.useState<string>("logo-dark.svg");
  const { data } = useSession();
  useEffect(() => {
    setLogoTheme(`/logo-${theme === "system" ? systemTheme : theme}.svg`);
  }, [theme, systemTheme]);

  return (
    <div className="relative  z-10 p-4">
      <MainHeader
        heading={
          <Link href="/">
            <img src={logoTheme} className="max-w-[200px]" />
          </Link>
        }
      >
        <div className="ml-10 flex  w-full">
          <ul>
            <li>
              <Link href={"/dashboard"} className="hover:text-foreground/75 transition-all duration-100 ease-in-out">Dashboard</Link>
            </li>
          </ul>
        </div>
        <div className="flex items-center justify-center gap-3">
          <ModeToggle />
          {!data ? (
            <Link href="/auth/signin">
              <Button className="text-lg font-semibold">SignIn</Button>
            </Link>
          ) : (
            <Button
              variant={"ghost"}
              className="flex h-12 justify-center gap-4 rounded-xl   border-2 p-2"
              onClick={() => signOut()}
            >
              <img
                src={data.user.image || ""}
                className=" h-full rounded-xl "
                alt=""
              />
              <div className=" flex items-center justify-center gap-2 ">
                <div className="-translate-y-[2px] font-bold">logout </div>
                <LogOut size={15} className=" text-muted-foreground " />
              </div>
            </Button>
          )}
        </div>
      </MainHeader>
    </div>
  );
}

export default Navbar;
