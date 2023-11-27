import { EditFaqForm } from "@/components/editFaqForm";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

function EditFaq() {
  const router = useRouter();
  return (
    <div className="mx-auto  h-full rounded-3xl  md:p-8 px-4 md:mt-4 md:max-w-[1200px] ">
      <button className="flex gap-2 py-3 text-primary" onClick={() => router.back()}>
        {" "}
        <ArrowLeft /> back to dashboard
      </button>
      <hr />
      <br />
      <h1 className=" text-xl ">Customize your page</h1>

      <EditFaqForm />
    </div>
  );
}

export default EditFaq;
