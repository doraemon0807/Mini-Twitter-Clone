import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

interface LayoutProps {
  canGoBack?: boolean;
  children: React.ReactNode;
  seoTitle: string;
}

export default function Layout({ canGoBack, children, seoTitle }: LayoutProps) {
  const headText = `${seoTitle} | Mini-Twitter`;

  const router = useRouter();
  let parentPath = router.pathname.split("/").slice(0, -1).join("/");
  if (parentPath.includes("tweet")) {
    parentPath = "/";
  }
  const goBack = () => {
    router.push(parentPath);
  };

  return (
    <div>
      <Head>
        <title>{headText}</title>
      </Head>
      <div className="fixed top-0 flex min-h-[52px] w-full max-w-xl items-center border-b bg-white px-10 py-3 text-lg font-medium text-gray-800">
        <div className="relative flex w-full items-center justify-center">
          {canGoBack && (
            <button
              className="absolute -left-4 hover:text-orange-500"
              onClick={goBack}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                />
              </svg>
            </button>
          )}
          <Link href="/" className="h-10 w-10">
            <svg
              fill="#22c55e"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="jsx-4289183593"
            >
              <path
                d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"
                className="jsx-4289183593"
              ></path>
            </svg>
          </Link>
        </div>
      </div>
      <div className="pb-10 pt-16">{children}</div>
    </div>
  );
}
