import React from "react";
import Navbar from "./navbar";
import { useRouter } from "next/router";


function Layout({ children }: React.PropsWithChildren) {
  const hideNavbarPaths = [""];

  const router = useRouter();
  const hideNavbar = hideNavbarPaths.includes(router.pathname);

  return (
    <div className=" ">
      {!hideNavbar && <Navbar />}
      {children}
    </div>
  );
}

export default Layout;
