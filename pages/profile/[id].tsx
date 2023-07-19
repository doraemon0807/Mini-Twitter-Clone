import Avatar from "@/components/avatar";
import Layout from "@/components/layout";
import { cls } from "@/lib/utils";
import { withSsrSession } from "@/lib/withSession";
import { Liked, Tweet, User } from "@prisma/client";
import { NextPage, NextPageContext } from "next";
import { useEffect, useState } from "react";
import db from "@/lib/db";
import { useRouter } from "next/router";
import TweetPost from "@/components/tweet";
import useSWRInfinite from "swr/infinite";
import useInfiniteScroll from "@/lib/useInfiniteScroll";
import Confirmation from "@/components/confirmation";
import useMutation from "@/lib/useMutation";
import { Tooltip } from "react-tooltip";

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
  const router = useRouter();

  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const [logout, { data, loading }] = useMutation(`/api/users/me/logout`);

  const handleLogout = () => {
    if (loading) return;
    logout({});
  };

  useEffect(() => {
    if (data && data.ok) {
      console.log("logging out!");
      router.push("/enter");
    }
  }, [router, data]);

  return (
    <Layout hasNavBar seoTitle="Profile">
      <div className="px-4 py-5">
        <div className="flex flex-col items-start space-y-3 px-6">
          <Avatar size="big" color={profile.avatarColor} />
          <div className="flex w-full items-start justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-900">
                {profile.name}
              </span>
              <span className="text-sm text-gray-500">@{profile.username}</span>
            </div>

            {myProfile ? (
              <div className="relative flex space-x-2 text-gray-600">
                <button
                  data-tooltip-id="editProfile"
                  data-tooltip-content="Edit my Profile"
                  onClick={() => router.push("/profile/edit")}
                  className="rounded-lg border border-white p-2 hover:border-gray-200 hover:text-green-500 hover:shadow-sm"
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
                <Tooltip id="editProfile" delayShow={300} className="tooltip" />
                <button
                  data-tooltip-id="logout"
                  data-tooltip-content="Log Out"
                  onClick={() => setLogoutConfirm(true)}
                  className="rounded-lg border border-white p-2 hover:border-gray-200 hover:text-green-500 hover:shadow-sm"
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
                      d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"
                    />
                  </svg>
                </button>
                <Tooltip id="logout" delayShow={300} className="tooltip" />
                {logoutConfirm ? (
                  <Confirmation
                    text="Are you sure you want to logout?"
                    button1="Logout"
                    button2="Cancel"
                    onClick1={handleLogout}
                    onClick2={() => setLogoutConfirm(false)}
                  />
                ) : null}
              </div>
            ) : null}
          </div>
          <p className="box-border text-base text-gray-700">
            {profile.description}
          </p>
        </div>
        <div className="mt-10 flex justify-around">
          <div className="mt-8 grid w-full grid-cols-2 gap-16 border-b">
            <button
              className={cls(
                "border-b-2 pb-4 font-medium transition-colors",
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
                "border-b-2 pb-4 font-medium transition-colors",
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
      notFound: true,
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
