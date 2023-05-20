import Avatar from "@/components/avatar";
import useUser from "@/lib/useUser";
import Link from "next/link";
import { useRouter } from "next/router";
import { Tooltip } from "react-tooltip";

export default function NavBar() {
  const router = useRouter();
  const { user } = useUser();

  return (
    <nav className="fixed bottom-0 flex w-full max-w-xl items-center justify-evenly bg-white px-10 py-5 text-gray-800">
      <Link
        href="/"
        className="flex h-12 w-12 flex-col items-center"
        data-tooltip-id="allTweets"
        data-tooltip-content="All Tweets"
      >
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
            stroke="#c7c7c7"
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
      <Tooltip id="allTweets" delayShow={300} className="tooltip" />
      <Link
        href={`/profile/${user?.id}`}
        className="flex flex-col items-center space-y-2"
        data-tooltip-id="myProfile"
        data-tooltip-content="My Profile"
      >
        {router.asPath === `/profile/${user?.id}` ? (
          <Avatar color={"#f3f4f6"} select />
        ) : (
          <Avatar color={"#f3f4f6"} unselect />
        )}
      </Link>
      <Tooltip id="myProfile" delayShow={300} className="tooltip" />
    </nav>
  );
}
