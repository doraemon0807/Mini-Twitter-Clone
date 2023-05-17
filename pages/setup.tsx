import Button from "@/components/button";
import ErrorMessage from "@/components/errorMessage";
import Input from "@/components/input";
import Layout from "@/components/layout";
import TextArea from "@/components/textarea";
import useMutation from "@/lib/useMutation";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface SetupForm {
  username: string;
  name: string;
  description: string;
}

interface SetupResult {
  ok: boolean;
  error?: string;
}

const Setup: NextPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetupForm>({ mode: "onSubmit" });

  const [setup, { data, loading }] =
    useMutation<SetupResult>(`/api/users/setup`);

  const onValid = (form: SetupForm) => {
    setup(form);
  };

  useEffect(() => {
    if (data && data.ok) {
      router.push("/");
    }
  }, [data, router]);

  return (
    <Layout seoTitle="Setup">
      <div className="mt-20 px-4">
        <h3 className="mb-20 px-20 text-[50px] font-medium leading-[1.3]">
          Let's set up your account!
        </h3>
        <form onSubmit={handleSubmit(onValid)} className="space-y-4 px-6">
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
          <TextArea
            register={register("description")}
            name="description"
            label="Description"
            placeholder="Talk about yourself..."
          />
          <ErrorMessage>{data?.error}</ErrorMessage>
          <Button loading={loading} text="Confirm Token" />
        </form>
      </div>
    </Layout>
  );
};

export default Setup;
