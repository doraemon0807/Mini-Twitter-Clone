import Avatar from "@/components/avatar";
import { cls } from "@/lib/utils";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import useUser from "../lib/useUser";

interface LayoutProps {
  canGoBack?: boolean;
  hasNavBar?: boolean;
  children: React.ReactNode;
  seoTitle: string;
}
export default function Layout({
  canGoBack,
  hasNavBar,
  children,
  seoTitle,
}: LayoutProps) {
  const headText = `${seoTitle} | Mini-Twitter`;

  const router = useRouter();
  let parentPath = router.pathname.split("/").slice(0, -1).join("/");
  const goBack = () => {
    if (parentPath.includes("[id]")){
      router.back()
    } else {
      router.push(parentPath)
    }
  };

  const { user } = useUser();

  return (
    <div>
      <Head>
        <title>{headText}</title>
      </Head>
      <div className="fixed top-0 z-10 flex min-h-[52px] w-full max-w-xl items-center bg-white px-10 py-3 text-lg font-medium text-gray-800">
        <div className="relative flex w-full items-center justify-center">
          {canGoBack && (
            <button
              className="absolute -left-4 hover:text-green-500"
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
      <div className={cls("pt-16", hasNavBar ? "pb-20" : "pb-10")}>
        {children}
      </div>
      {hasNavBar && (
        <nav className="fixed bottom-0 flex w-full max-w-xl items-center justify-evenly border-t bg-white px-10 py-5 text-gray-800">
          <Link href="/" className="flex h-12 w-12 flex-col items-center">
            {router.pathname === "/" ? (
              <svg
                fill="none"
                stroke="gray"
                strokeWidth={1.2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="h-11 w-11 translate-y-1 rounded-full ring-4 ring-green-300 ring-offset-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                />
              </svg>
            ) : (
              <svg
                fill="none"
                stroke="gray"
                strokeWidth={1.2}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="h-11 w-11 translate-y-1 rounded-full transition-all hover:ring-4 hover:ring-green-300 hover:ring-offset-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                />
              </svg>
            )}
          </Link>
          <Link
            href={`/profile/${user?.id}`}
            className="flex flex-col items-center space-y-2"
          >
            {router.asPath === `/profile/${user?.id}` ? (
              <Avatar color={user?.avatarColor} select />
            ) : (
              <Avatar color={user?.avatarColor} unselect />
            )}
          </Link>
        </nav>
      )}
    </div>
  );
}
