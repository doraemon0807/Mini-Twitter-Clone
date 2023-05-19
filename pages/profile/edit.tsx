import Button from "@/components/button";
import ErrorMessage from "@/components/errorMessage";
import Input from "@/components/input";
import Layout from "@/components/layout";
import TextArea from "@/components/textarea";
import useMutation from "@/lib/useMutation";
import useUser from "@/lib/useUser";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface EditProfileForm {
  name: string;
  username: string;
  description: string;
  formError: string;
}

interface EditProfileResponse {
  ok: boolean;
  error?: string;
}

const Upload: NextPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<EditProfileForm>({ mode: "onSubmit" });

  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.name) setValue("name", user.name);
    if (user?.username) setValue("username", user.username);
    if (user?.description) setValue("description", user.description);
  }, [user]);

  const [editProfile, { loading, data }] =
    useMutation<EditProfileResponse>("/api/users/me");

  const onValid = (form: EditProfileForm) => {
    if (loading) return;
    editProfile(form);
  };

  useEffect(() => {
    if (data && !data.ok && data.error) {
      setError("formError", {
        message: data.error,
      });
    }
  }, [data, setError]);

  useEffect(() => {
    if (data?.ok) {
      router.push(`/profile/${user?.id}`);
    }
  }, [data, router]);

  return (
    <Layout canGoBack seoTitle="Edit Profile">
      <form
        onSubmit={handleSubmit(onValid)}
        onChange={() => clearErrors()}
        className="space-y-4 px-6"
      >
        <Input
          register={register("name", {
            required: "Please enter your display name.",
            minLength: {
              message: "Your display name must be longer than 5 letters.",
              value: 5,
            },
          })}
          name="displayName"
          label="Display Name"
          kind="text"
          required
        />
        <ErrorMessage>{errors.name?.message}</ErrorMessage>
        <Input
          register={register("username", {
            required: "Please choose a username.",
            minLength: {
              message: "Your username must be longer than 5 letters.",
              value: 5,
            },
          })}
          name="username"
          label="Username"
          kind="username"
          required
        />
        <ErrorMessage>{errors.username?.message}</ErrorMessage>
        <ErrorMessage>{errors.formError?.message}</ErrorMessage>
        <TextArea
          register={register("description")}
          name="description"
          label="Description"
          placeholder="Talk about yourself..."
        />

        <Button loading={loading} text="Update Profile" />
      </form>
    </Layout>
  );
};

export default Upload;
