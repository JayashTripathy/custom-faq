"use client";
import React, { useEffect } from "react";
import { MainHeader } from "./ui/header";
import { ModeToggle } from "./ui/modeToggle";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { GripVertical, LogOut, MoreHorizontal } from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useRouter } from "next/router";
import { Icons } from "./icons";

function Navbar() {
  const router = useRouter();
  const { theme, setTheme, systemTheme } = useTheme();
  const [logoTheme, setLogoTheme] = React.useState<string>("logo-dark.svg");
  const { data } = useSession();

  const components: { title: string; href: string; onClick?: () => void }[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
  ];

  useEffect(() => {
    setLogoTheme(`/logo-${theme === "system" ? systemTheme : theme}.svg`);
  }, [theme, systemTheme]);

  return (
    <div className="sticky top-0 z-10 w-screen p-4 backdrop-blur-3xl ">
      <MainHeader
        heading={
          <Link href="/">
            <img src={logoTheme} className="max-w-[150px] md:max-w-[200px] " />
          </Link>
        }
      >
        <div className="ml-10 hidden w-full  md:flex">
          <ul>
            <li>
              <Link
                href={"/dashboard"}
                className="transition-all duration-100 ease-in-out hover:text-foreground/75"
              >
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
        <div className="hidden items-center justify-center gap-3 md:flex">
          <ModeToggle />
          {!data ? (
            <Link href="/auth/signin">
              <Button className="text-lg font-semibold">SignIn</Button>
            </Link>
          ) : (
            <Button
              variant={"ghost"}
              className="flex  justify-center gap-2 rounded-xl   border-2  "
              onClick={() => void signOut()}
            >
              <img
                src={data.user.image ?? ""}
                className=" h-6 w-6 rounded-xl "
                alt=""
              />
              <div className=" flex items-center justify-center gap-2 ">
                <div className=" font-bold">Logout </div>
                <LogOut size={15} className=" text-muted-foreground " />
              </div>
            </Button>
          )}
        </div>
        <Sheet>
          <SheetTrigger className="md:hidden">
            <MoreHorizontal />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <h1 className="text-left text-xl font-bold"> Options </h1>
            </SheetHeader>
            <SheetClose className="py-8" asChild>
              <button
                type="submit"
                onClick={() => router.push("/dashboard")}
                className="transition-all duration-100 ease-in-out hover:text-foreground/75"
              >
                Dashboard
              </button>
            </SheetClose>
            <SheetFooter>
              {!data ? (
                <SheetClose asChild>
             
                    <Button type="submit" onClick={() => router.push("/auth/signin")} className="text-lg font-semibold">
                      SignIn
                    </Button>
             

                </SheetClose>
              ) : (
                <Button
                  variant={"ghost"}
                  className="flex  justify-center gap-2 rounded-xl   border-2  "
                  onClick={() => void signOut()}
                >
                  <img
                    src={data.user.image ?? ""}
                    className=" h-6 w-6 rounded-xl "
                    alt=""
                  />
                  <div className=" flex items-center justify-center gap-2 ">
                    <div className=" font-bold">Logout </div>
                    <LogOut size={15} className=" text-muted-foreground " />
                  </div>
                </Button>
              )}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </MainHeader>
    </div>
  );
}

export default Navbar;
