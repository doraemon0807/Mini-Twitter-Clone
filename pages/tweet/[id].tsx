import db from "@/lib/db";
import Avatar from "@/components/avatar";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { Reply, Tweet, User } from "@prisma/client";
import {
  compactNumber,
  createdAgo,
  formatDate,
  formatTime,
} from "@/lib/timeConvert";
import Layout from "@/components/layout";
import useMutation from "@/lib/useMutation";
import { useRouter } from "next/router";
import useSWR from "swr";
import TextArea from "@/components/textarea";
import Button from "@/components/button";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface ReplyWithUser extends Reply {
  user: User;
}

interface TweetWithUserAndCountAndReply extends Tweet {
  user: User;
  reply: ReplyWithUser[];
  _count: {
    liked: number;
    reply: number;
  };
}

interface TweetResponse {
  tweet: TweetWithUserAndCountAndReply;
}

interface LikeResponse {
  ok: boolean;
  isLiked: boolean;
}

interface CountResponse {
  ok: boolean;
  tweetCount: TweetWithUserAndCountAndReply;
  isLiked: boolean;
}

interface ReplyForm {
  answer: string;
}

interface ReplyResponse {
  ok: boolean;
  reply: Reply;
}

const Counts = () => {
  const router = useRouter();

  const [like, { loading: likeLoading }] = useMutation<LikeResponse>(
    `/api/tweets/${router.query.id}/like`
  );

  const { data: countData, mutate: countMutate } = useSWR<CountResponse>(
    router.query.id ? `/api/tweets/${router.query.id}/count` : null
  );

  const likedCompact = compactNumber(countData?.tweetCount._count.liked || 0);
  const replyCompact = compactNumber(countData?.tweetCount._count.reply || 0);

  const onLikeClick = () => {
    if (!countData) return;
    countMutate(
      (prev: any) => ({
        ...prev,
        tweetCount: {
          ...prev.tweetCount,
          _count: {
            ...prev.tweetCount._count,
            liked: prev.isLiked
              ? prev.tweetCount._count.liked - 1
              : prev.tweetCount._count.liked + 1,
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
                {countData?.tweetCount._count.reply === 1 ? "Reply" : "Replies"}
              </span>
            </div>
            <div className="flex items-center space-x-0.5 text-sm text-gray-500">
              <span className="font-medium text-gray-900">{likedCompact}</span>
              <span>
                {countData?.tweetCount._count.liked === 1 ? "Like" : "Likes"}
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
                stroke="#15803c"
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

const Replies = () => {
  const router = useRouter();
  const { data } = useSWR<TweetResponse>(
    router.query.id ? `/api/tweets/${router.query.id}` : null
  );
  return (
    <>
      {data?.tweet.reply.map((reply) => (
        <div key={reply.id} className="flex items-start space-x-3">
          <Avatar size="small" color={reply.user.avatarColor} />
          <div className="flex flex-col">
            <div className="flex items-center space-x-1">
              <span className="block text-sm font-medium text-gray-700">
                {reply.user.name}
              </span>
              <span className="text-sm text-gray-500">
                @{reply.user.username}
              </span>
              <span className="text-sm text-gray-500">·</span>
              <span className="text-sm text-gray-500">
                {createdAgo(reply.createdAt)}
              </span>
            </div>
            <p className="mt-2 text-gray-700">{reply.answer}</p>
          </div>
        </div>
      ))}
    </>
  );
};

const TweetDetail: NextPage<TweetResponse> = ({ tweet }) => {
  const createdAt = new Date(tweet.createdAt);
  const postedDate = formatDate(createdAt);
  const postedTime = formatTime(createdAt);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReplyForm>({ mode: "onSubmit" });

  const { mutate } = useSWR(
    router.query.id ? `/api/tweets/${router.query.id}` : null
  );

  const [postReply, { data: postReplyData, loading: postReplyLoading }] =
    useMutation<ReplyResponse>(`/api/tweets/${router.query.id}/reply`);

  const onValid = (form: ReplyForm) => {
    if (postReplyLoading) return;
    postReply(form);
  };

  useEffect(() => {
    if (postReplyData && postReplyData.ok) {
      reset();
      mutate();
    }
  }, [postReplyData]);

  return (
    <Layout canGoBack seoTitle="Tweet">
      <div className="mt-2 flex flex-col justify-start space-y-5 rounded-lg border p-3">
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
        <Replies />
        <form onSubmit={handleSubmit(onValid)} className="px-4">
          <TextArea
            register={register("answer", {
              required: "You must write your answer before replying.",
            })}
            placeholder="Reply to this Tweet!"
          />
          <span className="text-sm text-red-500">{errors.answer?.message}</span>
          <Button loading={postReplyLoading} text="Reply" />
        </form>
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
      reply: {
        select: {
          answer: true,
          id: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarColor: true,
            },
          },
        },
        take: 10,
      },
      _count: {
        select: {
          liked: true,
          reply: true,
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
