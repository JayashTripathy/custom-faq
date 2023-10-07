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
      <div className="absolute top-0 ">
       
      </div>
      <div>
        <div className="text-center text-2xl md:text-5xl py-10">
          
          Create Stunning
          <br/>
          <span className="font-bold text-primary"> FAQ </span>Page for your
          </div>
      </div>
    </>
  );
}

export default index;
