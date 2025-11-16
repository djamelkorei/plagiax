'use client';

import {Button, Card, Field, Fieldset, Flex, Input, Skeleton, Stack} from "@chakra-ui/react";
import {DashboardContainer} from "@/components/dashboard-container";
import {MdArrowRightAlt} from "react-icons/md";
import {FormProvider, useForm} from "react-hook-form";
import {
  AccountInfoFormRequest,
  AccountInfoFormSchema,
  AccountPasswordFormRequest,
  AccountPasswordFormSchema
} from "@/lib/form.service";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAuth} from "@/hooks/use-auth";
import {useEffect, useState} from "react";
import {accountInfoUpdate} from "@/app/actions/account-info-update.action";
import {FormHelper} from "@/helpers/form.helper";
import {toaster} from "@/components/ui/toaster";
import {AuthDto} from "@/dto/user.dto";
import {accountPasswordUpdate} from "@/app/actions/account-password-update.action";

export default function DashboardAccount() {

  const authUser = useAuth(state => state.auth);
  const isAuthLoading = useAuth(state => state.isAuthLoading);
  const [initial, setInitial] = useState(true);

  useEffect(() => {
    if (isAuthLoading) {
      setTimeout(() => {
        setInitial(false);
      }, 300)
    }
  }, [isAuthLoading]);
  return (
    <DashboardContainer
      title={'Submissions'}
      breadcrumbs={['dashboard', 'account']}
    >
      <Flex gap={6} flexDirection={'column'}>

        <Skeleton loading={isAuthLoading && initial} height={'318px'}>
          {authUser.id > 0 && (
            <AccountDetails authUser={authUser}/>
          )}
        </Skeleton>

        <AccountPassword/>

      </Flex>
    </DashboardContainer>
  )

}


const AccountDetails = ({authUser}: { authUser: AuthDto }) => {

  const [loading, setLoading] = useState(false);
  const isAuthLoading = useAuth(state => state.isAuthLoading);
  const loadUser = useAuth(state => state.loadUser);

  const formMethods = useForm<AccountInfoFormRequest>({
    resolver: zodResolver(AccountInfoFormSchema),
    defaultValues: {
      name: authUser?.name ?? '',
      email: authUser?.email ?? '',
    }
  });

  useEffect(() => {
    if (!isAuthLoading && authUser?.id) {
      formMethods.reset({
        name: authUser.name,
        email: authUser.email,
      });
    }
  }, [authUser, isAuthLoading]);

  const onSubmit = (data: AccountInfoFormRequest) => {
    setLoading(true);
    accountInfoUpdate(FormHelper.toFormData(data)).then((res) => {
      if (res.hasError) {
        formMethods.setError('email', {
          type: 'server',
          message: res.message,
        });
        setLoading(false);
      } else {
        loadUser().then(() => {
          setTimeout(() => {
            toaster.success({
              title: '',
              description: 'updated successfully'
            });
            setLoading(false);
          }, 300)
        })
      }
    })
  }

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

                <Field.Root invalid={!!formMethods.formState.errors.name} flex={1}>
                  <Field.Label>Name</Field.Label>
                  <Input {...formMethods.register('name')} type="text" placeholder={'Enter your name'}/>
                  <Field.ErrorText>{formMethods.formState.errors.name?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!formMethods.formState.errors.email} flex={1}>
                  <Field.Label>Email</Field.Label>
                  <Input {...formMethods.register('email')} type="email" placeholder={'Enter your email'}/>
                  <Field.ErrorText>{formMethods.formState.errors.email?.message}</Field.ErrorText>
                </Field.Root>

              </Fieldset.Content>

              <Button loading={loading} type={'submit'} w={'fit-content'}>Update <MdArrowRightAlt/></Button>

            </Fieldset.Root>
          </form>
        </FormProvider>
      </Card.Body>
    </Card.Root>
  )
}

const AccountPassword = () => {

  const [loading, setLoading] = useState(false);
  const loadUser = useAuth(state => state.loadUser);

  const formMethods = useForm<AccountPasswordFormRequest>({
    resolver: zodResolver(AccountPasswordFormSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    }
  });

  const onSubmit = (data: AccountPasswordFormRequest) => {
    setLoading(true);
    accountPasswordUpdate(FormHelper.toFormData(data)).then((res) => {
      if (res.hasError) {
        formMethods.setError('current_password', {
          type: 'server',
          message: res.message,
        });
        setLoading(false);
      } else {
        loadUser().then(() => {
          setTimeout(() => {
            formMethods.reset({
              current_password: '',
              new_password: '',
              confirm_password: ''
            })

            toaster.success({
              title: '',
              description: 'updated successfully'
            });
            setLoading(false);
          }, 300)
        })
      }
    })
  }

  return (
    <Card.Root>
      <Card.Body>
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)}>
            <Fieldset.Root>
              <Stack>
                <Stack>
                  <Fieldset.Legend>Update Password</Fieldset.Legend>
                  <Fieldset.HelperText>
                    Ensure your account is using a long, random password to stay secure.
                  </Fieldset.HelperText>
                </Stack>
              </Stack>

              <Fieldset.Content>

                <Field.Root invalid={!!formMethods.formState.errors.current_password} flex={1}>
                  <Field.Label>Current Password</Field.Label>
                  <Input {...formMethods.register('current_password')} type="text"
                         placeholder={'Enter your current password'}/>
                  <Field.ErrorText>{formMethods.formState.errors.current_password?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!formMethods.formState.errors.new_password} flex={1}>
                  <Field.Label>New Password</Field.Label>
                  <Input {...formMethods.register('new_password')} type="text" placeholder={'Enter your new password'}/>
                  <Field.ErrorText>{formMethods.formState.errors.new_password?.message}</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={!!formMethods.formState.errors.confirm_password} flex={1}>
                  <Field.Label>Confirm Password</Field.Label>
                  <Input {...formMethods.register('confirm_password')} type="text"
                         placeholder={'Enter your confirm password'}/>
                  <Field.ErrorText>{formMethods.formState.errors.confirm_password?.message}</Field.ErrorText>
                </Field.Root>

              </Fieldset.Content>

              <Button loading={loading} type='submit' w={'fit-content'}>Submit <MdArrowRightAlt/></Button>

            </Fieldset.Root>
          </form>
        </FormProvider>
      </Card.Body>
    </Card.Root>
  )
}
