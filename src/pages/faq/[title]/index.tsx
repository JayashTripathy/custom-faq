import React from "react";
import { useRouter } from "next/router";
import Client from "./client";
import { PrismaClient } from "@prisma/client";
import { api } from "@/utils/api";

function Index(props: { faqData: string }) {
  const router = useRouter();
  const title = router.query.title as string;
 
  return (
    <div className="h-screen w-screen bg-white">
      {title ? <Client title={title} /> : <></>}
    </div>
  );
}

export default Index;
