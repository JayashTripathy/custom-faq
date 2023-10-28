
import React from "react";
import Client from "./client";
import { useRouter } from "next/router";

function Index() {
const router = useRouter();
  console.log(router.pathname);
  return <Client/>;
}

export default Index;
