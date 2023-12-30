import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import AppProviders from "@/utils/providers";
import { ThemeProvider } from "next-themes";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import Layout from "@/components/layout";

import { Roboto, Open_Sans, Lato, Poppins } from "next/font/google";

const roboto = Roboto({
  weight: ["100", "300", "500", "700", "900"],
  subsets: ["latin-ext"],
  variable: "--font-roboto",
});

const openSans = Open_Sans({
  weight: ["300", "500", "700", "800"],
  subsets: ["latin-ext"],
  variable: "--font-opensans",
});

const lato = Lato({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin-ext"],
  variable: "--font-lato",
});

const poppins = Poppins({
  weight: ["300", "400", "700", "800", "900"],
  subsets: ["latin-ext"],
  variable: "--font-poppins",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <main className={`${roboto.variable} ${lato.variable} ${openSans.variable}  ${poppins.variable}`}>
      <SessionProvider session={session}>
        <AppProviders>
          <ThemeProvider attribute="data-theme" defaultTheme="dark">
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ThemeProvider>
        </AppProviders>
      </SessionProvider>
    </main>
  );
};

export default api.withTRPC(MyApp);
