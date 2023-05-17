import db from "@/lib/db";
import Avatar from "@/components/avatar";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { Tweet, User } from "@prisma/client";
import {
  compactNumber,
  createdAgo,
  formatDate,
  formatTime,
} from "@/lib/timeConvert";
import Layout from "@/components/layout";
import useMutation from "@/lib/useMutation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";
import { cls } from "@/lib/utils";

interface TweetWithUserAndCount extends Tweet {
  user: User;
  _count: {
    Liked: number;
    Reply: number;
  };
}

interface TweetResponse {
  tweet: TweetWithUserAndCount;
}

interface LikeResponse {
  ok: boolean;
  isLiked: boolean;
}

interface CountResponse {
  ok: boolean;
  tweetCount: TweetWithUserAndCount;
  isLiked: boolean;
}

const Counts = () => {
  const router = useRouter();

  const [like, { data: likeData, loading: likeLoading }] =
    useMutation<LikeResponse>(`/api/tweets/${router.query.id}/like`);

  const { data: countData, mutate: countMutate } = useSWR<CountResponse>(
    `/api/tweets/${router.query.id}/count`
  );

  const likedCompact = compactNumber(countData?.tweetCount._count.Liked || 0);
  const replyCompact = compactNumber(countData?.tweetCount._count.Reply || 0);

  const onLikeClick = () => {
    if (!countData) return;
    countMutate(
      (prev: any) => ({
        ...prev,
        tweetCount: {
          ...prev.tweetCount,
          _count: {
            ...prev.tweetCount._count,
            Liked: prev.isLiked
              ? prev.tweetCount._count.Liked - 1
              : prev.tweetCount._count.Liked + 1,
          },
        },
        isLiked: !prev.isLiked,
      }),
      false
    );

    if (!likeLoading) {
      like({});
    }
  };

  return (
    <>
      <div>
        <div className="flex items-center justify-between border-y border-gray-100 py-3">
          <div className="flex space-x-6">
            <div className="flex items-center space-x-0.5 text-sm text-gray-500">
              <span className="font-medium text-gray-900">{replyCompact}</span>
              <span>
                {countData?.tweetCount._count.Reply === 1 ? "Reply" : "Replies"}
              </span>
            </div>
            <div className="flex items-center space-x-0.5 text-sm text-gray-500">
              <span className="font-medium text-gray-900">{likedCompact}</span>
              <span>
                {countData?.tweetCount._count.Liked === 1 ? "Like" : "Likes"}
              </span>
            </div>
          </div>
          <button
            onClick={onLikeClick}
            className="flex items-center space-x-0.5 text-sm text-gray-500"
          >
            {countData?.isLiked ? (
              <svg
                className="h-6 w-6"
                fill="#22c55e"
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
            ) : (
              <svg
                className="h-6 w-6"
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
            )}
          </button>
        </div>
      </div>
    </>
  );
};

const Comments = () => {
  return <div>COMMENTS HERE</div>;
};

const TweetDetail: NextPage<TweetResponse> = ({ tweet }) => {
  const createdAt = new Date(tweet.createdAt);

  const postedDate = formatDate(createdAt);
  const postedTime = formatTime(createdAt);

  return (
    <Layout canGoBack seoTitle="Tweet">
      <div className="flex flex-col justify-start space-y-5 rounded-lg border p-3">
        <div className="flex space-x-2">
          <Avatar color={tweet.user.avatarColor} />
          <div className="flex flex-col">
            <div className="flex flex-col items-start justify-center">
              <span className="text-sm font-medium text-gray-900">
                {tweet.user.name}
              </span>
              <span className="text-sm text-gray-500">
                @{tweet.user.username}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-start text-base text-gray-900">
          <span>{tweet.description}</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-start space-x-1 text-sm text-gray-500">
            <span>{postedTime}</span>
            <span>·</span>
            <span>{postedDate}</span>
          </div>
          <Counts />
        </div>
        <Comments />
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  if (!ctx.params?.id) {
    return {
      props: {},
    };
  }

  const tweetId = Number(ctx?.params?.id);

  const tweet = await db.tweet.findUnique({
    where: {
      id: tweetId,
    },
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
          Liked: true,
          Reply: true,
        },
      },
    },
  });

  return {
    props: {
      tweet: JSON.parse(JSON.stringify(tweet)),
    },
  };
};

export default TweetDetail;
