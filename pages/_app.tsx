import { SWRConfig } from "swr";
import "../global.css";

export default function App({ Component, pageProps }: any) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          fetch(url).then((response) => response.json()),
      }}
    >
      <div className="h-screen w-full">
        <div className="fixed left-0 top-0 -z-10 h-full w-full bg-red-200 bg-gradient-to-tr from-indigo-200 via-sky-200 to-green-200 bg-fixed"></div>
        <div className="mx-auto min-h-full w-full max-w-xl bg-white font-Roboto shadow-lg">
          <Component {...pageProps} />
        </div>
      </div>
    </SWRConfig>
  );
}
