import useSWR from "swr";
import { Tweet } from "@prisma/client";

export interface TweetResponse {
  ok: boolean;
  tweet: Tweet;
}

export default function useTweet(tweetId: string) {
  const { data, error } = useSWR<TweetResponse>(`/api/tweets/${tweetId}`);

  return { tweet: data?.tweet, isLoading: !data && !error };
}
