import React from "react";
import { useRouter } from "next/router";
import Client from "./client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function Index(props: { faqData: string }) {
  // const { faqData } = props;
  // console.log(faqData, "here it is");
  const router = useRouter();
  const title = router.query.title as string;

  return (
    <div className="h-screen w-screen bg-white">
      {title ? <Client title={title} /> : <></>}
    </div>
  );
}

// export async function getServerSideProps(context: any) {
//   const data = await prisma.faq.findUnique({
//     where: {
//       title: context.query.title,
//     },
//   });
//   const faqData = JSON.stringify(data);

//   return {
//     props: {
//       faqData,
//     },
//   };
// }
export default Index;
