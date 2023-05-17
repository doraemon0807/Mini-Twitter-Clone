import Button from "@/components/button";
import ErrorMessage from "@/components/errorMessage";
import Layout from "@/components/layout";
import TextArea from "@/components/textarea";
import useMutation from "@/lib/useMutation";
import { Tweet } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface UploadTweetForm {
  description: string;
}

interface UploadTweetResult {
  ok: boolean;
  tweet: Tweet;
}

const Upload: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UploadTweetForm>({ mode: "onSubmit" });

  const router = useRouter();

  const [postTweet, { loading, data }] =
    useMutation<UploadTweetResult>("/api/tweets");

  const onValid = (form: UploadTweetForm) => {
    if (loading) return;
    postTweet(form);
  };

  useEffect(() => {
    if (data?.ok) {
      router.push(`/tweet/${data.tweet.id}`);
    }
  }, [data, router]);

  return (
    <Layout canGoBack seoTitle="Post Tweet">
      <form className="space-y-4 px-4" onSubmit={handleSubmit(onValid)}>
        <TextArea
          register={register("description", {
            required: "Please write the description.",
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

export default Upload;
