import { Storage, storageAtom } from "@/storage";
import { SetStateAction, useAtom } from "jotai";
import React, { useEffect } from "react";

function AppProviders({ children }: React.PropsWithChildren) {
  const [storage, setStorage] = useAtom(storageAtom);

  const getStorage = () => {
    const storage = localStorage.getItem("wiseFAQ-store");
    if (storage) {
      setStorage(JSON.parse(storage) as SetStateAction<Storage | null>);
    } else {
      setStorage((p) => ({ ...p, messages: [] }));
    }
  };

  useEffect(() => {
    if (storage === null) return;
    localStorage.setItem("wiseFAQ-store", JSON.stringify(storage));
  }, [storage]);

  useEffect(() => {
    getStorage();
  }, []);

  return <>{children}</>;
}

export default AppProviders;
