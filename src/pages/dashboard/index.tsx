import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { Edit2, Plus, Snail, Trash } from "lucide-react";
import React from "react";

function Dashboard() {
  const faqQuery = api.faq.getAll.useQuery();

  const faqData = faqQuery?.data;

  return (
    <div className=" absolute z-0 top-0 flex h-screen w-full flex-col p-4  px-10 pt-32  ">
      <div className="mb-4 flex justify-between text-4xl font-bold">
        <div>Library</div>
        <Button className="flex gap-1  p-3 text-xl" variant={"secondary"}>
          Create <Plus size={23} className="text-primary" />{" "}
        </Button>
      </div>

      <div className="h-full   overflow-auto  rounded-3xl border bg-muted/10 p-4 ">
        {faqData && faqData?.length === 0 ? (
          <div className=" flex h-full w-full flex-col items-center justify-center gap-3">
            <Snail size={30} />
            <div>seems this place is a quiet library</div>
            <Button className="flex gap-1  p-3 text-xl" variant={"secondary"}>
              Create <Plus size={23} className="text-primary" />{" "}
            </Button>
          </div>
        ) : faqQuery.isLoading ? (
          <div className="flex flex-col gap-4">
            {Array(20)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-20 w-full animate-pulse rounded-xl bg-muted p-3"
                >
                  <div className=" animate-pulse  rounded-xl bg-muted p-3 delay-75 "></div>
                </div>
              ))}
          </div>
        ) : (
          <ul className="flex flex-col">
            {faqData
              ?.sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )
              .map((faq) => (
                <li className="flex justify-between items-center bg-accent/70 hover:bg-accent/50 transition-all duration-75 ease-in-out rounded-lg p-4 cursor-pointer shadow-md  " key={faq.id}>
                  <div>
                    <div>{faq.title}</div>
                    <div>{faq.description}</div>
                  </div>
                  <div className="gap-1 flex justify-center items-center">
                    <Button variant={"outline"} className="h-12 w-12"><Edit2  /></Button>
                    <Button variant={"destructive"} className=" h-12 w-12"><Trash  /></Button>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
