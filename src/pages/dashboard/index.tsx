import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import React from "react";

function Dashboard() {
  return (
    <div className=" absolute top-0 flex h-screen w-full flex-col p-4  px-10 pt-32  ">
      <div className="mb-4 flex justify-between text-4xl font-bold">
        <div>All Creations</div>
        <Button className="flex gap-1  p-3 text-xl" variant={"secondary"}>
          Create <PlusSquare size={20} className="text-primary" />{" "}
        </Button>
      </div>

      <div className="h-full   overflow-auto  rounded-3xl border bg-muted/10"></div>
    </div>
  );
}

export default Dashboard;
