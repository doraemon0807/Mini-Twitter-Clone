import Button from "@/components/button";
import ErrorMessage from "@/components/errorMessage";
import Input from "@/components/input";
import Layout from "@/components/layout";
import useMutation from "@/lib/useMutation";
import { cls } from "@/lib/utils";
import { Token, User } from "@prisma/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface EnterForm {
  email?: string;
  phone?: string;
}

interface ConfirmForm {
  token?: string;
}

interface ConfirmResult {
  ok: boolean;
  error?: string;
  authUser: User;
}

interface EnterResult {
  ok: boolean;
  token: Token;
  error?: string;
}

const Enter: NextPage = () => {
  const router = useRouter();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors: enterFormErrors },
  } = useForm<EnterForm>({
    mode: "onSubmit",
  });
  const { register: confirmRegister, handleSubmit: confirmHandleSubmit } =
    useForm<ConfirmForm>({
      mode: "onSubmit",
    });

  const [method, setMethod] = useState<"email" | "phone">("email");

  const [enter, { loading: enterLoading, data: enterData }] =
    useMutation<EnterResult>("/api/users/enter");
  const [confirm, { loading: confirmLoading, data: confirmData }] =
    useMutation<ConfirmResult>("/api/users/confirm");

  const regions = [
    {
      name: "CA",
      number: "+1",
    },
    {
      name: "US",
      number: "+1",
    },
    {
      name: "KR",
      number: "+82",
    },
  ];

  const [regionIndex, setRegionIndex] = useState<number>(0);

  const onEmailClick = () => {
    setMethod("email");
    reset();
  };

  const onPhoneClick = () => {
    setMethod("phone");
    reset();
  };

  const onValid = (form: EnterForm) => {
    if (enterLoading) return;
    if (method === "phone") {
      const regionNumber = regions[regionIndex].number;
      const newForm = {
        phone: regionNumber + form.phone,
      };
      enter(newForm);
    } else {
      enter(form);
    }
  };

  const onConfirmValid = (form: ConfirmForm) => {
    if (confirmLoading) return;
    confirm(form);
  };

  useEffect(() => {
    if (enterData && enterData.token) {
      setTimeout(() => {
        alert(`Your token is ${enterData.token.payload}`);
      }, 1000);
    }
  }, [enterData]);

  useEffect(() => {
    if (confirmData && confirmData.ok) {
      if (confirmData.authUser.setup) {
        router.push("/404", "/");
        // window.location.href = "/";
      } else {
        router.push("/setup");
      }
    }
  }, [confirmData, router]);

  return (
    <Layout seoTitle="Connect">
      <div className="mt-20 px-4">
        {enterData?.ok ? (
          <>
            <h3 className="mb-20 px-20 text-[50px] font-medium leading-[1.3]">
              The one-time password has been sent!
            </h3>
            <div className="flex flex-col space-y-1 text-gray-900">
              {method === "email" ? (
                <>
                  <span className="text-sm text-gray-900">
                    If you cannot find the email, make sure to check your junk
                    mail.
                  </span>
                </>
              ) : method === "phone" ? (
                <span className="text-sm text-gray-900">
                  Please check your text message.
                </span>
              ) : null}
            </div>
            <form
              onSubmit={confirmHandleSubmit(onConfirmValid)}
              className="mt-8 flex flex-col"
            >
              <div className="space-y-3">
                <Input
                  register={confirmRegister("token", {
                    required: "Please enter your verification code.",
                  })}
                  name="token"
                  label="Verification Code"
                  kind="text"
                  required
                />
                <ErrorMessage>{confirmData?.error}</ErrorMessage>
                <Button loading={confirmLoading} text="Confirm Code" />
              </div>
            </form>
          </>
        ) : (
          <>
            <h3 className="mb-20 px-12 text-[50px] font-medium leading-[1.3]">
              See what's happening in the world right now.
            </h3>
            <div className="flex flex-col items-center">
              <h5 className="text-sm font-medium text-gray-500">
                Enter using:
              </h5>
              <div className="mt-8 grid w-full grid-cols-2 gap-16 border-b">
                <button
                  className={cls(
                    "border-b-2 pb-4 font-medium transition-colors",
                    method === "email"
                      ? "border-green-500 text-green-500"
                      : "border-transparent text-gray-500"
                  )}
                  onClick={onEmailClick}
                >
                  Email Address
                </button>
                <button
                  className={cls(
                    "border-b-2 pb-4 font-medium transition-colors",
                    method === "phone"
                      ? " border-green-500 text-green-500"
                      : "border-transparent text-gray-500"
                  )}
                  onClick={onPhoneClick}
                >
                  Phone Number
                </button>
              </div>
            </div>
            <form
              onSubmit={handleSubmit(onValid)}
              className="mt-8 flex flex-col"
            >
              {method === "email" && (
                <div className="space-y-3">
                  <Input
                    register={register("email", {
                      required: "Please enter your email address.",
                      validate: {
                        notEmail: (value) =>
                          value?.includes("@") ||
                          "Please enter a correct email address.",
                      },
                    })}
                    name="email"
                    label="Email Address"
                    kind="text"
                  />
                  <ErrorMessage>{enterFormErrors?.email?.message}</ErrorMessage>
                  <Button loading={enterLoading} text="Get One-time Password" />
                </div>
              )}
              {method === "phone" && (
                <div className="space-y-3">
                  <Input
                    register={register("phone", {
                      required: "Please enter your phone number.",
                      pattern: {
                        message: "Please enter a correct phone number.",
                        value: /^\d[0-9]{5,12}$/,
                      },
                    })}
                    name="phone"
                    label="Phone Number"
                    kind="phone"
                    regions={regions}
                    setRegionIndex={setRegionIndex}
                  />
                  <ErrorMessage>{enterFormErrors?.phone?.message}</ErrorMessage>
                  <Button loading={enterLoading} text="Get One-time Password" />
                </div>
              )}
            </form>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Enter;
