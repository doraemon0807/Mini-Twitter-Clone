import db from "@/lib/db";
import Layout from "@/components/layout";
import useInfiniteScroll from "@/lib/useInfiniteScroll";
import { Tweet } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import React, { useEffect } from "react";
import { SWRConfig } from "swr";
import useSWRInfinite, { unstable_serialize } from "swr/infinite";
import TweetPost from "@/components/tweet";

interface TweetsResponse {
  ok: boolean;
  tweets: Tweet[];
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
  // const { data, setSize } = useSWRInfinite<TweetsResponse>(getKey);

  // const page = useInfiniteScroll();

  // useEffect(() => {
  //   setSize(page);
  // }, [setSize, page]);

  // console.log(data);

  const dummyTweets = [1, 2, 3, 4, 5, 6];

  return (
    <Layout seoTitle="Tweets">
      <div className="flex flex-col px-10 py-5">
        {dummyTweets ? (
          <div className="flex flex-col space-y-4">
            {dummyTweets.map((tweet) => (
              <TweetPost
                key={tweet}
                id={tweet}
                name={String(tweet)}
                description={String(tweet)}
                comments={tweet}
                liked={tweet}
              />
            ))}
          </div>
        ) : (
          <h1>Be the first one to tweet!</h1>
        )}
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
      _count: {
        select: {
          Liked: true,
        },
      },
    },
  });

  const tweetCount = await db.tweet.count();

  return {
    props: {
      ok: true,
      products: JSON.parse(JSON.stringify(tweets)),
      totalPage: Math.ceil(tweetCount / 10),
    },
  };
};

export default homePage;
