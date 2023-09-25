import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import AppProviders from "@/utils/providers";

import { api } from "@/utils/api";

import "@/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <AppProviders>
        <Component {...pageProps} />
      </AppProviders>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
