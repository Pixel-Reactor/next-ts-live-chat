import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MyContextProvider } from "../context/context";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MyContextProvider>
      <>
        <Head>
          <title>D🍩nut Chat</title>
          <meta
            name="description"
            content="Online Live Casual Chat"
          />
        </Head>
        <Component {...pageProps} />
      </>
    </MyContextProvider>
  );
}
