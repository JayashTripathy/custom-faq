import { storageAtom } from "@/storage";
import { useAtom } from "jotai";
import React, { useEffect } from "react";

function AppProviders({ children }: React.PropsWithChildren) {
  const [storage, setStorage] = useAtom(storageAtom);

  const getStorage = () => {
    const storage = localStorage.getItem("storage");

    if (storage) {
      setStorage(JSON.parse(storage));
    } else {
      setStorage({});
    }
  };

  useEffect(() => {
    if (storage === null) return;
    localStorage.setItem("storage", JSON.stringify(storage));
  }, [storage]);

  useEffect(() => {
    getStorage();
  }, []);

  return <>{children}</>;
}

export default AppProviders;
