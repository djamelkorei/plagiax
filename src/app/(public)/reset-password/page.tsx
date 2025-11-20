"use client";

import {
  Box,
  Button,
  Field,
  Fieldset,
  Flex,
  HStack,
  Stack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { MdArrowRightAlt } from "react-icons/md";
import { resetPasswordCompleteAction } from "@/app/actions/reset-password-complete.action";
import { Logo } from "@/components/logo";
import { PasswordInput } from "@/components/ui/password-input";
import { toaster } from "@/components/ui/toaster";
import { AppContext } from "@/data/context";
import { FormHelper } from "@/helpers/form.helper";
import {
  type PasswordResetCompleteFormRequest,
  PasswordResetCompleteFormSchema,
} from "@/lib/form.service";

export default function ResetPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formMethods = useForm<PasswordResetCompleteFormRequest>({
    resolver: zodResolver(PasswordResetCompleteFormSchema),
    defaultValues: {
      email: "",
      token: "",
      password: "",
      confirm_password: "",
    },
  });

  const { setError, handleSubmit } = formMethods;

  const onSubmit = (data: PasswordResetCompleteFormRequest) => {
    setLoading(true);
    resetPasswordCompleteAction(FormHelper.toFormData(data))
      .then(() => {
        setTimeout(() => {
          //setLoading(false);
          toaster.success({
            title: "",
            description: "Successfully updated.",
          });
          router.push("/login");
        }, 300);
      })
      .catch((error) => {
        setLoading(false);
        const message = error.response?.data?.message || "Something went wrong";
        setError("email", {
          type: "server",
          message,
        });
      });
  };

  return (
    <>
      <Head>
        <title>Login | ${AppContext.name}</title>
      </Head>
      <Flex
        w={"full"}
        alignItems={"center"}
        flexDirection={"column"}
        minH={"500px"}
        height={"calc(100vh - 200px)"}
        justifyContent={"center"}
        gap={10}
        py={10}
      >
        <Box w={"full"}>
          <FormProvider {...formMethods}>
            <form onSubmit={handleSubmit((data) => onSubmit(data))}>
              <Suspense>
                <ResetPasswordForm loading={loading} />
              </Suspense>
            </form>
          </FormProvider>
        </Box>
      </Flex>
    </>
  );
}

const ResetPasswordForm = ({ loading }: { loading: boolean }) => {
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("token");
  const emailParam = searchParams.get("email");

  const {
    setValue,
    formState: { errors },
    register,
  } = useFormContext<PasswordResetCompleteFormRequest>();

  useEffect(() => {
    if (tokenParam) setValue("token", tokenParam);
    if (emailParam) setValue("email", emailParam);
  }, [tokenParam, emailParam, setValue]);

  return (
    <Fieldset.Root size="lg" maxW={"lg"} mx={"auto"}>
      <Logo mb={4} textStyle={"4xl"} />

      <Stack>
        <Fieldset.Legend>Reset Your Password</Fieldset.Legend>
        <Fieldset.HelperText>
          Please enter your new password below. Make sure it's something secure.
        </Fieldset.HelperText>
      </Stack>

      <Fieldset.Content>
        <Field.Root invalid={!!errors.password}>
          <Field.Label>New Password</Field.Label>
          <PasswordInput
            {...register("password")}
            type="password"
            placeholder={"Enter your new password"}
          />
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.confirm_password}>
          <Field.Label>Confirm Password</Field.Label>
          <PasswordInput
            {...register("confirm_password")}
            type="password"
            placeholder={"Confirm your new password"}
          />
          <Field.ErrorText>{errors.confirm_password?.message}</Field.ErrorText>
        </Field.Root>
      </Fieldset.Content>

      <HStack justifyContent={"space-between"}>
        <Button
          loading={loading}
          type="submit"
          alignSelf="flex-start"
          w={"full"}
        >
          Reset Password
          <MdArrowRightAlt />
        </Button>
      </HStack>
    </Fieldset.Root>
  );
};
