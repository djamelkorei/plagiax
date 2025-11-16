import Head from "next/head";
import {AppContext} from "@/data/context";
import {Box, Button, Field, Fieldset, Flex, HStack, Stack} from "@chakra-ui/react";
import {Logo} from "@/components/logo";
import {MdArrowRightAlt} from "react-icons/md";
import {PasswordInput} from "@/components/ui/password-input";


export default function ResetPassword() {

  return (
    <>
      <Head>
        <title>Login | ${AppContext.name}</title>
      </Head>
      <Flex w={'full'} alignItems={'center'} flexDirection={'column'} minH={'500px'} height={'calc(100vh - 200px)'}
            justifyContent={'center'}
            gap={10} py={10}>

        <Box w={'full'}>

          <Fieldset.Root size="lg" maxW={'lg'} mx={'auto'}>

            <Logo mb={4} textStyle={'4xl'}/>

            <Stack>
              <Fieldset.Legend>
                Reset Your Password
              </Fieldset.Legend>
              <Fieldset.HelperText>
                Please enter your new password below. Make sure it's something secure.
              </Fieldset.HelperText>
            </Stack>

            <Fieldset.Content>

              <Field.Root invalid={false}>
                <Field.Label>New Password</Field.Label>
                <PasswordInput name="newPassword" type="password" placeholder={"Enter your new password"}/>
                <Field.ErrorText>This is an error text</Field.ErrorText>
              </Field.Root>

              <Field.Root invalid={false}>
                <Field.Label>Confirm Password</Field.Label>
                <PasswordInput name="confirmPassword" type="password" placeholder={"Confirm your new password"}/>
                <Field.ErrorText>This is an error text</Field.ErrorText>
              </Field.Root>

            </Fieldset.Content>

            <HStack justifyContent={"space-between"}>
              <Button type="submit" alignSelf="flex-start" w={"full"}>
                Reset Password
                <MdArrowRightAlt/>
              </Button>
            </HStack>
          </Fieldset.Root>
        </Box>
      </Flex>
    </>
  );
}
