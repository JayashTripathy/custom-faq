
import React from "react";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { ChevronRightCircle } from "lucide-react";
import Link from "next/link";

function index() {
  const alluser = api.example.getAllUsers.useQuery();

  return (
    <>
      {/* backgrond svgs */}
      {/* <div className="left-50 absolute -top-[70px] h-[500px] w-[500px] rounded-full bg-primary opacity-10 blur-3xl " />

      <div className="absolute right-10 top-10 h-[100px] w-[100px] rounded-full bg-primary opacity-30 blur-[600px] " /> */}
      <div className="absolute top-0 left-0 w-screen h-screen bg-[url(/smudge.png)] -z-10 opacity-40"></div>
      <div className="mx-auto max-w-[80%] overflow-hidden z-10 w-screen overflow-x-hidden  ">
        <div className="py-10  text-2xl md:text-4xl text text-center shrink-0 whitespace-nowrap ">
          Craft your FAQ pages

          <br />
          <span className="font-extrabold italic  md:text-7xl text-transparent bg-clip-text bg-gradient-to-br from-violet-400 to-primary "> Effortlessly!</span>
          <Link href={"/dashboard"}>
          <Button variant={"outline"}  className="flex mx-auto rounded-full text-2xl h-full outline-4 pr-2 justify-center items-center gap-3 mt-4 border-1 ">Get your own<span className=" bg-primary p-2 rounded-full"><ChevronRightCircle /></span></Button>
          </Link>
          <img src="temp.png" alt="" className="w-4/5 mx-auto" />
        </div>
      </div>
    </>
  );
}

export default index;
