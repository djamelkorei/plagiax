'use client'

import Head from "next/head";
import {AppContext} from "@/data/context";
import {Box, Button, Field, Fieldset, Flex, HStack, Input, Separator, Show, Stack, Text} from "@chakra-ui/react";
import {Logo} from "@/components/logo";
import {MdArrowRightAlt} from "react-icons/md";
import {useForm, UseFormReset} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {PasswordResetInitFormRequest, PasswordResetInitFormSchema} from "@/lib/form.service";
import {resetPasswordInitAction} from "@/app/actions/reset-password-init.action";
import {FormHelper} from "@/helpers/form.helper";
import {toaster} from "@/components/ui/toaster";
import {useState} from "react";


export default function ForgetPassword() {

  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const methods = useForm<PasswordResetInitFormRequest>({
    resolver: zodResolver(PasswordResetInitFormSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = (data: PasswordResetInitFormRequest, reset: UseFormReset<PasswordResetInitFormRequest>) => {
    setLoading(true);
    resetPasswordInitAction(FormHelper.toFormData(data)).then(() => {
      setTimeout(() => {
        setLoading(false);
        setCompleted(true)
        reset();
        toaster.success({
          title: '',
          description: 'Successfully sent.'
        });
      }, 300)
    })
  }


  return (
    <>
      <Head>
        <title>Login | ${AppContext.name}</title>
      </Head>
      <Flex w={'full'} alignItems={'center'} flexDirection={'column'} minH={'500px'} height={'calc(100vh - 200px)'}
            justifyContent={'center'}
            gap={10} py={10}>

        <Box w={'full'}>
          <form onSubmit={methods.handleSubmit((data) => onSubmit(data, methods.reset))}>
            <Fieldset.Root size="lg" maxW={'lg'} mx={'auto'}>

              <Logo mb={4} textStyle={'4xl'}/>

              <Stack>
                <Fieldset.Legend>
                  Forget Password
                </Fieldset.Legend>
                <Fieldset.HelperText>
                  Forgot your password? No problem. Just let us know your email address and we will email you a password
                  reset link that will allow you to choose a new one.
                </Fieldset.HelperText>
              </Stack>

              <Show when={!completed}>
                <Fieldset.Content>

                  <Field.Root invalid={!!methods.formState.errors.email}>
                    <Field.Label>Email address</Field.Label>
                    <Input {...methods.register('email')} name="email" type="email"
                           placeholder={'Enter your email address'}/>
                    <Field.ErrorText>{methods.formState.errors.email?.message}</Field.ErrorText>
                  </Field.Root>

                </Fieldset.Content>

                <HStack justifyContent={'space-between'}>
                  <Button type="submit" alignSelf="flex-start" w={'full'} loading={loading}>
                    Email a password reset link
                    <MdArrowRightAlt/>
                  </Button>
                </HStack>
              </Show>

              <Show when={completed}>
                <Separator/>

                <Text textStyle={'sm'}>
                  An email has been sent to you. Kindly check your mailbox.
                </Text>

                <Button onClick={() => {
                  setCompleted(false);
                }} alignSelf="flex-start" w={'full'} loading={loading}>
                  Send again
                  <MdArrowRightAlt/>
                </Button>
              </Show>

            </Fieldset.Root>
          </form>
        </Box>
      </Flex>
    </>
  );
}
