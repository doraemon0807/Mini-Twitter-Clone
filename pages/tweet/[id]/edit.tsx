import db from "@/lib/db";
import Button from "@/components/button";
import ErrorMessage from "@/components/errorMessage";
import Layout from "@/components/layout";
import TextArea from "@/components/textarea";
import useMutation from "@/lib/useMutation";
import { Tweet } from "@prisma/client";
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface EditTweetForm {
  description: string;
}

interface EditTweetResult {
  ok: boolean;
  tweet: Tweet;
}

const EditProfile: NextPage<EditTweetResult> = ({ tweet }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditTweetForm>({ mode: "onSubmit" });

  const router = useRouter();

  useEffect(() => {
    if (tweet) setValue("description", tweet.description);
  }, []);

  const [editTweet, { loading, data }] = useMutation<EditTweetResult>(
    `/api/tweets/${router.query.id}`
  );

  const onValid = (form: EditTweetForm) => {
    if (loading) return;
    editTweet(form);
  };

  useEffect(() => {
    if (data && data.ok) {
      router.push(`/tweet/${data.tweet.id}`);
    }
  }, [data, router]);

  return (
    <Layout canGoBack seoTitle="Post Tweet">
      <form className="space-y-4 px-4" onSubmit={handleSubmit(onValid)}>
        <TextArea
          register={register("description", {
            required: "Please enter the description.",
            minLength: {
              message: "Your Tweet must be longer than 5 letters.",
              value: 5,
            },
          })}
          name="description"
          placeholder="What do you have in mind?"
        />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>
        <Button loading={loading} text="Post Tweet" />
      </form>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
}: GetServerSidePropsContext) => {
  const tweetId = Number(query.id);

  const tweet = await db.tweet.findUnique({
    where: {
      id: tweetId,
    },
  });

  return {
    props: {
      tweet: JSON.parse(JSON.stringify(tweet)),
    },
  };
};

export default EditProfile;
