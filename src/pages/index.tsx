import { storageAtom } from "@/storage";
import { useAtom } from "jotai";
import Link from "next/link";
import { useSession } from "next-auth/react";
import React from "react";

function index() {
  const [storage, setStorage] = useAtom(storageAtom);


  return <Link href={"/auth/signin"}>Click me</Link>;
}

export default index;
