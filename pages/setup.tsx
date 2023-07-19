import Avatar from "@/components/avatar";
import Button from "@/components/button";
import ErrorMessage from "@/components/errorMessage";
import Input from "@/components/input";
import Layout from "@/components/layout";
import TextArea from "@/components/textarea";
import useMutation from "@/lib/useMutation";
import useUser from "@/lib/useUser";
import { randColor } from "@/lib/utils";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface SetupForm {
  username: string;
  name: string;
  description: string;
  avatarColor: string;
}

interface SetupResult {
  ok: boolean;
  error?: string;
}

const Setup: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<SetupForm>({ mode: "onSubmit" });

  const [setup, { data, loading }] =
    useMutation<SetupResult>(`/api/users/setup`);

  const onValid = (form: SetupForm) => {
    const newForm = {
      ...form,
      avatarColor: selectColor === "" ? user?.avatarColor : selectColor,
    };
    setup(newForm);
  };

  useEffect(() => {
    if (data && data.ok) {
      router.push("/enter");
    }
  }, [data, router]);

  useEffect(() => {
    if (data && data.error) {
      setError("username", { message: data.error });
    }
  }, [data]);

  const [selectColor, setSelectColor] = useState("");

  const handleColorClick = (color: string) => {
    setSelectColor(color);
  };

  return (
    <Layout canGoBack seoTitle="Setup">
      <div className="mt-12 px-4">
        <h3 className="mb-12 px-20 text-[50px] font-medium leading-[1.3]">
          Let's set up your account!
        </h3>
        <div className="align-center my-8 flex justify-around">
          <div className="rounded-full shadow-sm">
            <Avatar
              size="big"
              color={selectColor === "" ? user?.avatarColor : selectColor}
            />
          </div>
          <div className="grid grid-cols-9 place-content-center gap-2">
            {randColor.map((color, i) => (
              <button
                key={i}
                className="cursor h-8 w-8 place-self-center rounded-full shadow-xl ring-offset-4 focus:h-7 focus:w-7 focus:ring-2"
                style={{ backgroundColor: color }}
                onClick={() => handleColorClick(color)}
              ></button>
            ))}
          </div>
        </div>
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
          {/* <ErrorMessage>{data?.error}</ErrorMessage> */}
          <ErrorMessage>{errors.username?.message}</ErrorMessage>
          <TextArea
            register={register("description")}
            name="description"
            label="Description"
            placeholder="Talk about yourself..."
          />

          <Button loading={loading} text="Let's Get Started!" />
        </form>
      </div>
    </Layout>
  );
};

export default Setup;
