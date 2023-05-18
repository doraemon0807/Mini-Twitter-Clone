import Avatar from "@/components/avatar";
import Layout from "@/components/layout";
import { cls } from "@/lib/utils";
import { withSsrSession } from "@/lib/withSession";
import { Liked, Tweet, User } from "@prisma/client";
import { NextPage, NextPageContext } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import db from "@/lib/db";
import { useRouter } from "next/router";
import TweetPost from "@/components/tweet";
import useSWRInfinite from "swr/infinite";
import useInfiniteScroll from "@/lib/useInfiniteScroll";

interface TweetWithUserAndCount extends Tweet {
  user: User;
  _count: {
    reply: number;
    liked: number;
  };
}

interface LikedWithUserAndCount extends Liked {
  user: User;
  tweet: TweetWithUserAndCount;
}

interface LikedResponse {
  ok: boolean;
  liked: LikedWithUserAndCount[];
  totalPage: number;
}

interface TweetResponse {
  ok: boolean;
  tweet: TweetWithUserAndCount[];
  totalPage: number;
}

interface ProfileResponseSsr {
  profile: User;
  tweet: TweetWithUserAndCount[];
  liked: LikedWithUserAndCount[];
  myProfile: boolean;
}

const TweetTab = () => {
  const router = useRouter();

  const getKey = (pageIndex: number, previousPageData: LikedResponse) => {
    if (pageIndex === 0)
      return `/api/users/profile/${router.query.id}/tweet?page=1`;
    const page = pageIndex + 1;
    if (page > previousPageData.totalPage) {
      return null;
    }
    return `/api/users/profile/${router.query.id}/tweet?page=${page}`;
  };

  const { data: tweetData, setSize } = useSWRInfinite<TweetResponse>(getKey);

  const page = useInfiniteScroll();

  useEffect(() => {
    setSize(page);
  }, [setSize, page]);

  return (
    <div className="flex flex-col space-y-4">
      {tweetData?.map((item) =>
        item.tweet.map((tweet) => <TweetPost key={tweet.id} tweet={tweet} />)
      )}
    </div>
  );
};
const LikedTab = () => {
  const router = useRouter();

  const getKey = (pageIndex: number, previousPageData: LikedResponse) => {
    if (pageIndex === 0)
      return `/api/users/profile/${router.query.id}/liked?page=1`;
    const page = pageIndex + 1;
    if (page > previousPageData.totalPage) {
      return null;
    }
    return `/api/users/profile/${router.query.id}/liked?page=${page}`;
  };

  const { data: likedData, setSize } = useSWRInfinite<LikedResponse>(getKey);

  const page = useInfiniteScroll();

  useEffect(() => {
    setSize(page);
  }, [setSize, page]);

  return (
    <div className="flex flex-col space-y-4">
      {likedData?.map((item) =>
        item.liked.map((liked) => (
          <TweetPost key={liked.tweet.id} tweet={liked.tweet} />
        ))
      )}
    </div>
  );
};

const Profile: NextPage<ProfileResponseSsr> = ({ profile, myProfile }) => {
  const [method, setMethod] = useState<"tweet" | "liked">("tweet");

  const onTweetClick = () => {
    setMethod("tweet");
  };
  const onLikedClick = () => {
    setMethod("liked");
  };

  return (
    <Layout hasNavBar seoTitle="Profile">
      <div className="px-4 py-5">
        <div className="flex flex-col items-start space-y-3 px-6">
          <Avatar size="big" color={profile.avatarColor} />
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-900">
                {profile.name}
              </span>
              <span className="text-sm text-gray-500">@{profile.username}</span>
            </div>

            {myProfile ? (
              <Link href="/profile/edit" className="">
                <button className="w-full rounded-xl border border-transparent bg-green-500 px-2 py-1 text-sm font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                  Edit Profile
                </button>
              </Link>
            ) : (
              ""
            )}
          </div>
          <p className="text-sm text-gray-700">{profile.description}</p>
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
              TWEET
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
              LIKED
            </button>
          </div>
        </div>
        <div className="mt-6">
          {method === "tweet" ? (
            <TweetTab />
          ) : method === "liked" ? (
            <LikedTab />
          ) : null}
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = withSsrSession(async function ({
  req,
  query,
}: NextPageContext) {
  const profileId = Number(query.id);

  const profile = await db.user.findUnique({
    where: {
      id: profileId,
    },
  });

  if (!profile) {
    return {
      props: {},
    };
  }

  const myProfile = Boolean(profileId === req?.session.user?.id);

  return {
    props: {
      profile: JSON.parse(JSON.stringify(profile)),
      myProfile,
    },
  };
});

export default Profile;
