import Avatar from "@/components/avatar";
import Layout from "@/components/layout";
import { cls } from "@/lib/utils";
import { withSsrSession } from "@/lib/withSession";
import { Liked, Tweet, User } from "@prisma/client";
import { NextPage, NextPageContext } from "next";
import Link from "next/link";
import { useState } from "react";
import { SWRConfig } from "swr";
import db from "@/lib/db";
import useUser from "@/lib/useUser";

interface ProfileResponse {
  profile: User;
  tweet: Tweet;
  liked: Liked;
}

const Profile: NextPage = () => {
  const [method, setMethod] = useState<"tweet" | "liked">("tweet");

  const onTweetClick = () => {
    setMethod("tweet");
  };
  const onLikedClick = () => {
    setMethod("liked");
  };

  const { user } = useUser();

  return (
    <Layout hasNavBar seoTitle="Profile">
      <div className="px-4 py-5">
        <div className="flex flex-col items-start space-y-3">
          <Avatar size="big" color={user?.avatarColor} />
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-900">
                {user?.name}
              </span>
              <span className="text-sm text-gray-500">@{user?.username}</span>
            </div>

            <Link href="/profile/edit" className="">
              <button className="w-full rounded-xl border border-transparent bg-green-500 px-2 py-1 text-sm font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                Edit Profile
              </button>
            </Link>
          </div>
          <p className="text-sm text-gray-700">{user?.description}</p>
        </div>
        <div className="mt-10 flex justify-around">
          <div className="mt-8 grid w-full grid-cols-2 gap-16 border-b">
            <button
              className={cls(
                "border-b-2 pb-4 font-medium",
                method === "tweet"
                  ? "border-green-500 text-green-500"
                  : "border-transparent text-gray-500"
              )}
              onClick={onTweetClick}
            >
              Tweet
            </button>
            <button
              className={cls(
                "border-b-2 pb-4 font-medium",
                method === "liked"
                  ? " border-green-500 text-green-500"
                  : "border-transparent text-gray-500"
              )}
              onClick={onLikedClick}
            >
              Liked
            </button>
          </div>
        </div>
        <div className="mt-6">
          {method === "tweet" ? (
            <div>TWEETS</div>
          ) : method === "liked" ? (
            <div>LIKED</div>
          ) : null}
        </div>
      </div>
    </Layout>
  );
};

const ProfilePage: NextPage<ProfileResponse> = ({ profile, tweet, liked }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/profile": [{ ok: true, profile, tweet, liked }],
        },
      }}
    >
      <Profile />
    </SWRConfig>
  );
};

export const getServerSideProps = withSsrSession(async function ({
  req,
}: NextPageContext) {
  const profile = await db.user.findUnique({
    where: {
      id: req?.session.user?.id,
    },
  });

  if (!profile) {
    return {
      props: {},
    };
  }

  const tweet = await db.tweet.findMany({
    where: {
      userId: profile.id,
    },
  });

  const liked = await db.liked.findMany({
    where: {
      userId: profile.id,
    },
  });

  return {
    props: {
      profile: JSON.parse(JSON.stringify(profile)),
      tweet: JSON.parse(JSON.stringify(tweet)),
      liked: JSON.parse(JSON.stringify(liked)),
    },
  };
});

export default ProfilePage;
