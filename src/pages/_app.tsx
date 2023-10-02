import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import AppProviders from "@/utils/providers";
import { ThemeProvider } from 'next-themes'

import { api } from "@/utils/api";

import "@/styles/globals.css";
import Layout from "@/components/layout";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <AppProviders>
      <ThemeProvider attribute='data-theme' defaultTheme="dark"   >
        <Layout>
          <Component {...pageProps} />
        </Layout>
        </ThemeProvider>
      </AppProviders>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
