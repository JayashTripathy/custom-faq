import { EditFaqForm } from "@/components/editFaqForm";
import React from "react";

function EditFaq() {
  return (
    <div className="mx-auto  h-full rounded-3xl  p-8 md:mt-4 md:max-w-[1200px] ">
      <h1 className=" text-xl ">Customize your page</h1>

      <EditFaqForm />
    </div>
  );
}

export default EditFaq;
