import db from "@/lib/db";
import Avatar from "@/components/avatar";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { Reply, Tweet, User } from "@prisma/client";
import { compactNumber, formatDate, formatTime } from "@/lib/timeConvert";
import Layout from "@/components/layout";
import useMutation from "@/lib/useMutation";
import { useRouter } from "next/router";
import useSWR from "swr";
import TextArea from "@/components/textarea";
import Button from "@/components/button";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Link from "next/link";
import useUser from "@/lib/useUser";
import Confirmation from "@/components/confirmation";
import ReplyObject from "@/components/reply";
import { Tooltip } from "react-tooltip";

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

interface TweetDeleteResponse {
  ok: boolean;
}

interface ReplyDeleteResponse {
  ok: boolean;
}

const CountsReplies = () => {
  const router = useRouter();

  const [like, { loading: likeLoading }] = useMutation<LikeResponse>(
    `/api/tweets/${router.query.id}/like`
  );

  const [countUrl, setCountUrl] = useState("");
  useEffect(() => {
    setCountUrl(`/api/tweets/${router.query.id}/count`);
  }, []);

  const { data: countData, mutate: countMutate } = useSWR<CountResponse>(
    router.query.id ? countUrl : null
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReplyForm>({ mode: "onSubmit" });

  const [postReply, { data: postReplyData, loading: postReplyLoading }] =
    useMutation<ReplyResponse>(`/api/tweets/${router.query.id}/reply`);

  const [url, setUrl] = useState("");
  useEffect(() => {
    setUrl(`/api/tweets/${router.query.id}`);
  }, []);

  const { data, mutate } = useSWR<TweetResponse>(router.query.id ? url : null);

  const onValid = (form: ReplyForm) => {
    if (postReplyLoading) return;
    postReply(form);
  };

  useEffect(() => {
    if (postReplyData && postReplyData.ok) {
      reset();
      mutate();
      countMutate();
    }
  }, [postReplyData]);

  const [replyId, setReplyId] = useState("");

  const [deleteReply, { data: deleteReplyData, loading: deleteReplyLoading }] =
    useMutation<ReplyDeleteResponse>(`/api/replies/${replyId}/delete`);

  const handleDeleteReply = () => {
    if (deleteReplyLoading) return;
    deleteReply({});
  };

  useEffect(() => {
    if (deleteReplyData && deleteReplyData.ok) {
      reset();
      mutate();
      countMutate();
    }
  }, [deleteReplyData]);
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
            className="flex items-center space-x-0.5 text-sm text-gray-500 hover:text-green-500"
          >
            {countData?.isLiked ? (
              <svg
                className="h-6 w-6 transition-colors"
                fill="#24d665"
                stroke="#5bc481"
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
      <div className="space-y-2">
        {data?.tweet.reply.map((reply) => (
          <ReplyObject
            key={reply.id}
            reply={reply}
            handleDeleteReply={handleDeleteReply}
            setReplyId={setReplyId}
          />
        ))}
      </div>
      <form onSubmit={handleSubmit(onValid)} className="w-full">
        <TextArea
          register={register("answer", {
            required: "You must enter your answer before replying.",
          })}
          placeholder="Reply to this Tweet!"
        />
        <span className="text-sm text-red-500">{errors.answer?.message}</span>
        <Button loading={postReplyLoading} text="Reply" />
      </form>
    </>
  );
};

const TweetDetail: NextPage<TweetResponse> = ({ tweet }) => {
  const router = useRouter();

  useEffect(() => {
    if (!tweet) {
      router.push("/404");
    }
  }, [tweet, router]);

  const createdAt = new Date(tweet.createdAt);
  const postedDate = formatDate(createdAt);
  const postedTime = formatTime(createdAt);

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteTweet, { data, loading }] = useMutation<TweetDeleteResponse>(
    `/api/tweets/${router.query.id}/delete`
  );

  const { user } = useUser();

  const handleDeleteTweet = () => {
    if (loading) return;
    deleteTweet({});
  };

  useEffect(() => {
    if (data && data.ok) {
      router.push("/");
    }
  }, [data, router]);

  return (
    <Layout canGoBack seoTitle="Tweet">
      <div className="mx-3 mt-2 flex flex-col justify-start space-y-5 rounded-lg border p-5 shadow-sm">
        <div className="flex justify-between">
          <Link href={`/profile/${tweet.userId}`} className="flex space-x-2">
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
          </Link>
          {tweet.user.id === user?.id ? (
            <div className="relative space-x-1 text-gray-400">
              <button
                data-tooltip-id="editTweet"
                data-tooltip-content="Edit this Tweet"
                className="rounded-lg border border-white p-2 hover:border-gray-200 hover:text-green-500 hover:shadow-sm"
                onClick={() => router.push(`/tweet/${router.query.id}/edit`)}
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </button>
              <Tooltip id="editTweet" delayShow={300} className="tooltip" />
              <button
                data-tooltip-id="deleteTweet"
                data-tooltip-content="Delete this Tweet"
                className="rounded-lg border border-white p-2 hover:border-gray-200 hover:text-green-500 hover:shadow-sm"
                onClick={() => setDeleteConfirm(true)}
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
              <Tooltip id="deleteTweet" delayShow={300} className="tooltip" />
              {deleteConfirm ? (
                <Confirmation
                  text="Are you sure you want to delete this Tweet?"
                  button1="Delete"
                  button2="Cancel"
                  onClick1={handleDeleteTweet}
                  onClick2={() => setDeleteConfirm(false)}
                />
              ) : null}
            </div>
          ) : null}
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
        </div>
        <CountsReplies />
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
      notFound: true,
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

  if (!tweet) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      tweet: JSON.parse(JSON.stringify(tweet)),
    },
  };
};

export default TweetDetail;
