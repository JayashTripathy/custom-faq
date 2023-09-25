import { storageAtom } from "@/storage";
import { useAtom } from "jotai";
import React from "react";

function index() {
  const [storage, setStorage] = useAtom(storageAtom);

  return (
    <button
      onClick={() =>
        setStorage({
          ...storage,
          test: "sdsadas",
        })
      }
    >
      index
    </button>
  );
}

export default index;
