import React from "react";
import { useRouter } from "next/router";
import Client from "./client";

function Index() {
  const router = useRouter();
  const title = router.query.title as string;

  
  
  return title ? <Client title={title} /> : <></>;
}

export default Index;
