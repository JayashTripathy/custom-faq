import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import AppProviders from "@/utils/providers";
import { ThemeProvider } from "next-themes";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import Layout from "@/components/layout";

import {
  Lato,
  Quicksand,
  Playfair_Display,
  Cormorant_Garamond,
} from "next/font/google";

const lato = Lato({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin-ext"],
  variable: "--font-lato",
});

const quicksand = Quicksand({
  weight: ["300", "400", "700"],
  subsets: ["latin-ext"],
  variable: "--font-quicksand",
});
const playfair = Playfair_Display({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin-ext"],
  variable: "--font-playfair",
});
const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin-ext"],
  variable: "--font-cormorant",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <main className={`${quicksand.variable} ${lato.variable} ${cormorant.variable} ${playfair.variable}`}>
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
