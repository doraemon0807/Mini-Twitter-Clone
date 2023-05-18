import Avatar from "@/components/avatar";
import { formatDateShort } from "@/lib/timeConvert";
import { Tweet, User } from "@prisma/client";
import Link from "next/link";

interface TweetWithUserAndCount extends Tweet {
  user: User;
  _count: {
    reply: number;
    liked: number;
  };
}

interface TweetProp {
  tweet: TweetWithUserAndCount;
}

export default function TweetPost({ tweet }: TweetProp) {
  const time = new Date(tweet.createdAt);
  const postedTime = formatDateShort(time);

  return (
    <Link href={`/tweet/${tweet.id}`}>
      <div className="flex cursor-pointer justify-start space-x-3 rounded-lg border p-3 shadow-sm">
        <Avatar color={tweet.user.avatarColor} />
        <div className="flex flex-col space-y-3">
          <div className="flex space-x-2">
            <div className="flex flex-col">
              <div className="flex items-center justify-start space-x-1">
                <span className="text-sm font-medium text-gray-900">
                  {tweet.user.name}
                </span>
                <span className="text-sm text-gray-500">
                  @{tweet.user.username}
                </span>
                <span>·</span>
                <span className="text-xs text-gray-500">{postedTime}</span>
              </div>
              <div className="flex justify-start text-sm text-gray-900">
                <span>{tweet.description}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-start space-x-5">
            <div className="flex items-center space-x-0.5 text-sm text-gray-500">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
              <span>{tweet._count.reply}</span>
            </div>
            <div className="flex items-center space-x-0.5 text-sm text-gray-500">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
              <span>{tweet._count.liked}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
