import Head from "next/head";
import {AppContext} from "@/data/context";
import {Box, Button, Field, Fieldset, Flex, HStack, Input, Stack} from "@chakra-ui/react";
import {Logo} from "@/components/logo";
import {MdArrowRightAlt} from "react-icons/md";


export default function ForgetPassword() {

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
                Forget Password
              </Fieldset.Legend>
              <Fieldset.HelperText>
                Forgot your password? No problem. Just let us know your email address and we will email you a password
                reset link that will allow you to choose a new one.
              </Fieldset.HelperText>
            </Stack>

            <Fieldset.Content>

              <Field.Root invalid={false}>
                <Field.Label>Email address</Field.Label>
                <Input name="email" type="email" placeholder={'Enter your email address'}/>
                <Field.ErrorText>This is an error text</Field.ErrorText>
              </Field.Root>

            </Fieldset.Content>

            <HStack justifyContent={'space-between'}>
              <Button type="submit" alignSelf="flex-start" w={'full'}>
                Email a password reset link
                <MdArrowRightAlt/>
              </Button>
            </HStack>
          </Fieldset.Root>
        </Box>
      </Flex>
    </>
  );
}
