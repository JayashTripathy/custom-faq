import { storageAtom } from "@/storage";
import { useAtom } from "jotai";
import Link from "next/link";
import { useSession } from "next-auth/react";
import React from "react";
import { api } from "@/utils/api";

function index() {
  const alluser = api.example.getAllUsers.useQuery();

  return (
    <>
      {/* backgrond svgs */}
      {/* <div className="left-50 absolute -top-[70px] h-[500px] w-[500px] rounded-full bg-primary opacity-10 blur-3xl " />

      <div className="absolute right-10 top-10 h-[100px] w-[100px] rounded-full bg-primary opacity-30 blur-[600px] " /> */}

      <div className="mx-auto max-w-[80%] overflow-hidden z-10 w-screen overflow-x-hidden ">
        <div className="py-10  text-2xl md:text-4xl text text-center shrink-0 whitespace-nowrap ">
          Craft your FAQ pages
          <br />
          <span className="font-extrabold italic  md:text-7xl text-transparent bg-clip-text bg-gradient-to-br from-violet-400 to-primary "> Effortlessly!</span>
          <img src="temp.png" alt="" className="w-4/5 mx-auto" />
        </div>
      </div>
    </>
  );
}

export default index;
