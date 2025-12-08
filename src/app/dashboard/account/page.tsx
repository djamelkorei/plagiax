"use client";

import {
  Button,
  Card,
  Field,
  Fieldset,
  Flex,
  Input,
  Skeleton,
  Stack,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { MdArrowRightAlt } from "react-icons/md";
import { accountInfoUpdate } from "@/app/actions/account-info-update.action";
import { DashboardContainer } from "@/components/dashboard-container";
import { toaster } from "@/components/ui/toaster";
import type { AuthDto } from "@/dto/user.dto";
import { FormHelper } from "@/helpers/form.helper";
import { useAuth } from "@/hooks/use-auth";
import {
  type AccountInfoFormRequest,
  AccountInfoFormSchema,
} from "@/lib/form.service";

export default function DashboardAccount() {
  const authUser = useAuth((state) => state.auth);
  const isAuthLoading = useAuth((state) => state.isAuthLoading);
  const [initial, setInitial] = useState(true);

  useEffect(() => {
    if (isAuthLoading) {
      setTimeout(() => {
        setInitial(false);
      }, 300);
    }
  }, [isAuthLoading]);
  return (
    <DashboardContainer
      title={"Submissions"}
      breadcrumbs={["dashboard", "account"]}
    >
      <Flex gap={6} flexDirection={"column"}>
        <Skeleton loading={isAuthLoading && initial} height={"318px"}>
          {authUser.id > 0 && <AccountDetails authUser={authUser} />}
        </Skeleton>

        {/*<AccountPassword />*/}
      </Flex>
    </DashboardContainer>
  );
}

const AccountDetails = ({ authUser }: { authUser: AuthDto }) => {
  const [loading, setLoading] = useState(false);
  const isAuthLoading = useAuth((state) => state.isAuthLoading);
  const loadUser = useAuth((state) => state.loadUser);

  const formMethods = useForm<AccountInfoFormRequest>({
    resolver: zodResolver(AccountInfoFormSchema),
    defaultValues: {
      name: authUser?.name ?? "",
      email: authUser?.email ?? "",
    },
  });

  useEffect(() => {
    if (!isAuthLoading && authUser?.id) {
      formMethods.reset({
        name: authUser.name,
        email: authUser.email,
      });
    }
  }, [authUser, isAuthLoading, formMethods.reset]);

  const onSubmit = (data: AccountInfoFormRequest) => {
    setLoading(true);
    accountInfoUpdate(FormHelper.toFormData(data)).then((res) => {
      if (res.hasError) {
        formMethods.setError("email", {
          type: "server",
          message: res.message,
        });
        setLoading(false);
      } else {
        loadUser().then(() => {
          setTimeout(() => {
            toaster.success({
              title: "",
              description: "updated successfully",
            });
            setLoading(false);
          }, 300);
        });
      }
    });
  };

  return (
    <Card.Root>
      <Card.Body>
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)}>
            <Fieldset.Root>
              <Stack>
                <Fieldset.Legend>Profile Information</Fieldset.Legend>
                <Fieldset.HelperText>
                  Update your account's profile information and email address.
                </Fieldset.HelperText>
              </Stack>

              <Fieldset.Content>
                <Field.Root
                  invalid={!!formMethods.formState.errors.name}
                  flex={1}
                >
                  <Field.Label>Name</Field.Label>
                  <Input
                    {...formMethods.register("name")}
                    type="text"
                    placeholder={"Enter your name"}
                  />
                  <Field.ErrorText>
                    {formMethods.formState.errors.name?.message}
                  </Field.ErrorText>
                </Field.Root>

                <Field.Root
                  invalid={!!formMethods.formState.errors.email}
                  flex={1}
                >
                  <Field.Label>Email</Field.Label>
                  <Input
                    {...formMethods.register("email")}
                    type="email"
                    placeholder={"Enter your email"}
                    disabled
                  />
                  <Field.ErrorText>
                    {formMethods.formState.errors.email?.message}
                  </Field.ErrorText>
                </Field.Root>
              </Fieldset.Content>

              <Button loading={loading} type={"submit"} w={"fit-content"}>
                Update <MdArrowRightAlt />
              </Button>
            </Fieldset.Root>
          </form>
        </FormProvider>
      </Card.Body>
    </Card.Root>
  );
};

// const OTP_RESEND_SECONDS = 60;

// const AccountPassword = () => {
//   const [loading, setLoading] = useState(false);
//   const [otpSending, setOtpSending] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpTimer, setOtpTimer] = useState(0);
//
//   const loadUser = useAuth((state) => state.loadUser);
//
//   const {
//     handleSubmit,
//     reset,
//     formState: { errors },
//     setError,
//     register,
//   } = useForm<AccountPasswordFormRequest>({
//     resolver: zodResolver(AccountPasswordFormSchema),
//     defaultValues: {
//       current_password: "",
//       new_password: "",
//       confirm_password: "",
//       email_otp: "",
//     },
//   });
//
//   // Countdown for resend OTP
//   useEffect(() => {
//     if (!otpTimer) return;
//     const interval = setInterval(() => {
//       setOtpTimer((t) => (t > 0 ? t - 1 : 0));
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [otpTimer]);
//
//   const handleSendOtp = async () => {
//     try {
//       setOtpSending(true);
//
//       const res: { hasError: boolean; message: string } = await new Promise(
//         (resolve) => {
//           setTimeout(() => {
//             resolve({
//               hasError: false,
//               message: "Mock OTP sent successfully",
//             });
//           }, 500);
//         },
//       );
//
//       if (res.hasError) {
//         toaster.error({
//           title: "Unable to send code",
//           description: res.message ?? "Please try again in a moment.",
//         });
//         return;
//       }
//
//       setOtpSent(true);
//       setOtpTimer(OTP_RESEND_SECONDS);
//
//       toaster.success({
//         title: "Verification code sent",
//         description: "Check your email for the 6-digit code.",
//       });
//     } catch (error) {
//       toaster.error({
//         title: "Something went wrong",
//         description: "We couldn't send the code. Please try again.",
//       });
//     } finally {
//       setOtpSending(false);
//     }
//   };
//
//   const onSubmit = (
//     data: AccountPasswordFormRequest,
//     reset: UseFormReset<AccountPasswordFormRequest>,
//   ) => {
//     setLoading(true);
//     accountPasswordUpdate(FormHelper.toFormData(data)).then((res) => {
//       if (res.hasError) {
//         setError("current_password", {
//           type: "server",
//           message: res.message,
//         });
//         setLoading(false);
//       } else {
//         loadUser().then(() => {
//           setTimeout(() => {
//             reset();
//             toaster.success({
//               title: "",
//               description: "updated successfully",
//             });
//             setLoading(false);
//           }, 300);
//         });
//       }
//     });
//   };
//
//   return (
//     <Card.Root>
//       <Card.Body>
//         <form onSubmit={handleSubmit((data) => onSubmit(data, reset))}>
//           <Fieldset.Root>
//             <Stack>
//               <Stack>
//                 <Fieldset.Legend>Update Password</Fieldset.Legend>
//                 <Fieldset.HelperText>
//                   Ensure your account is using a long, random password to stay
//                   secure.
//                 </Fieldset.HelperText>
//               </Stack>
//             </Stack>
//
//             <Fieldset.Content>
//               {/* Email OTP */}
//               <Field.Root invalid={!!errors.email_otp} flex={1}>
//                 <Field.Label>Email Verification Code</Field.Label>
//                 <Stack direction="row" gap="2" align="center" w={"full"}>
//                   <Input
//                     {...register("email_otp")}
//                     type="text"
//                     inputMode="numeric"
//                     maxLength={6}
//                     flex={1}
//                     placeholder="Enter 6-digit code"
//                   />
//                   <Button
//                     type="button"
//                     loading={otpSending}
//                     disabled={otpSending || otpTimer > 0}
//                     onClick={handleSendOtp}
//                   >
//                     {otpTimer > 0
//                       ? `Resend in ${otpTimer}s`
//                       : otpSent
//                         ? "Resend code"
//                         : "Send code"}
//                   </Button>
//                 </Stack>
//                 <Field.HelperText>
//                   We’ll send the code to your account email.
//                 </Field.HelperText>
//                 <Field.ErrorText>{errors.email_otp?.message}</Field.ErrorText>
//               </Field.Root>
//
//               <Separator />
//
//               <Field.Root invalid={!!errors.current_password} flex={1}>
//                 <Field.Label>Current Password</Field.Label>
//                 <Input
//                   {...register("current_password")}
//                   type="text"
//                   placeholder={"Enter your current password"}
//                 />
//                 <Field.ErrorText>
//                   {errors.current_password?.message}
//                 </Field.ErrorText>
//               </Field.Root>
//
//               <Field.Root invalid={!!errors.new_password} flex={1}>
//                 <Field.Label>New Password</Field.Label>
//                 <Input
//                   {...register("new_password")}
//                   type="text"
//                   placeholder={"Enter your new password"}
//                 />
//                 <Field.ErrorText>
//                   {errors.new_password?.message}
//                 </Field.ErrorText>
//               </Field.Root>
//
//               <Field.Root invalid={!!errors.confirm_password} flex={1}>
//                 <Field.Label>Confirm Password</Field.Label>
//                 <Input
//                   {...register("confirm_password")}
//                   type="text"
//                   placeholder={"Enter your confirm password"}
//                 />
//                 <Field.ErrorText>
//                   {errors.confirm_password?.message}
//                 </Field.ErrorText>
//               </Field.Root>
//             </Fieldset.Content>
//
//             <Button loading={loading} type="submit" w={"fit-content"}>
//               Submit <MdArrowRightAlt />
//             </Button>
//           </Fieldset.Root>
//         </form>
//       </Card.Body>
//     </Card.Root>
//   );
// };
