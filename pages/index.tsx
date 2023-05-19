import db from "@/lib/db";
import Layout from "@/components/layout";
import useInfiniteScroll from "@/lib/useInfiniteScroll";
import { Tweet, User } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import React, { useEffect } from "react";
import { SWRConfig } from "swr";
import useSWRInfinite, { unstable_serialize } from "swr/infinite";
import TweetPost from "@/components/tweet";
import Link from "next/link";

interface TweetWithUserAndCount extends Tweet {
  user: User;
  _count: {
    liked: number;
    reply: number;
  };
}

interface TweetsResponse {
  ok: boolean;
  tweets: TweetWithUserAndCount[];
  totalPage: number;
}

const getKey = (pageIndex: number, previousPageData: TweetsResponse) => {
  if (pageIndex === 0) return `/api/tweets?page=1`;
  const page = pageIndex + 1;
  if (page > previousPageData.totalPage) {
    return null;
  }
  return `/api/tweets?page=${page}`;
};

const Home: NextPage = () => {
  const { data, setSize } = useSWRInfinite<TweetsResponse>(getKey);

  const page = useInfiniteScroll();

  useEffect(() => {
    setSize(page);
  }, [setSize, page]);

  return (
    <Layout seoTitle="Tweets" hasNavBar>
      <div className="relative flex flex-col px-10 py-5">
        {data ? (
          <div className="flex flex-col space-y-4">
            {data.map((item) =>
              item.tweets.map((tweet) => (
                <TweetPost tweet={tweet} key={tweet.id} />
              ))
            )}
          </div>
        ) : (
          <h1>Be the first one to tweet!</h1>
        )}

        <Link
          href="/tweet/post"
          className="group sticky bottom-40 aspect-square w-14 -translate-x-8 cursor-pointer self-end rounded-full border-transparent bg-green-400 p-4 text-white shadow-xl transition-colors"
        >
          <svg
            className="h-6 w-6 transition-transform group-hover:rotate-90 group-hover:scale-150"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </Link>
      </div>
    </Layout>
  );
};

const homePage: NextPage<TweetsResponse> = ({ tweets, totalPage }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          [unstable_serialize(getKey)]: [{ ok: true, tweets, totalPage }],
        },
      }}
    >
      <Home />
    </SWRConfig>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const tweets = await db.tweet.findMany({
    take: 10,
    skip: 0,
    orderBy: [
      {
        createdAt: "desc",
      },
      {
        id: "desc",
      },
    ],
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarColor: true,
        },
      },
      _count: {
        select: {
          liked: true,
          reply: true,
        },
      },
    },
  });

  const tweetCount = await db.tweet.count();

  return {
    props: {
      ok: true,
      tweets: JSON.parse(JSON.stringify(tweets)),
      totalPage: Math.ceil(tweetCount / 10),
    },
  };
};

export default homePage;
