import { Head, Html, Main, NextScript } from "next/document";

export default function MyDocument() {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600&family=PT+Serif:wght@400;700&family=Roboto:wght@300;400;500&family=Source+Serif+Pro:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
        {/* <link rel="shortcut icon" href="/favicon/favicon.ico" /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
