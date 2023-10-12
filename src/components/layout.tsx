import React, { useEffect } from "react";
import Navbar from "./navbar";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

function Layout({ children }: React.PropsWithChildren) {
  const { data } = useSession();
  const router = useRouter();
  const user = data?.user;

  const hideNavbarPaths = [""];
  const protectedRoutes = ["/dashboard"];

  useEffect(() => {
    if (!user && protectedRoutes.includes(router.pathname)) {
      void router.push("/auth/signin")
    }
  }, [router.pathname]);

  const hideNavbar = hideNavbarPaths.includes(router.pathname);

  return (
    <div className="">
      {!hideNavbar && <Navbar />}
      {children}
    </div>
  );
}

export default Layout;
