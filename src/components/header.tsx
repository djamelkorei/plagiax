'use client';

import Link from "next/link";

import {Logo} from "@/components/logo";
import {Avatar, Box, Button, Container, Flex, Show, Text} from "@chakra-ui/react";
import {MdLogin} from "react-icons/md";
import {usePathname, useRouter} from "next/navigation";
import {Activity} from "react";
import {useAuth} from "@/hooks/use-auth";


export const Header = () => {

  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const isAuthenticated = pathname.startsWith('/dashboard');
  const {auth} = useAuth();
  const router = useRouter();

  return (
    <Box
      borderBottom={'1px solid'}
      borderColor={'border'}
    >
      <Container px={{base: 8, lg: 40}}>
        <Flex
          height={20}
          paddingX={{base: 0, md: 0}}
          gap={6}
          alignItems={'center'}
          justifyContent={'space-between'}
        >

          <Link href={'/'}>
            <Logo/>
          </Link>


          <Activity mode={isAuthenticated ? 'visible' : 'hidden'}>
            <Flex gap={6} alignItems={'center'}>
              <NavLink text={'Dashboard'} href={'/dashboard'}/>
              <NavLink text={'Submissions'} href={'/dashboard/submissions'}/>
              <NavLink text={'Students'} href={'/dashboard/students'}/>
            </Flex>
          </Activity>


          <Activity mode={isAuthenticated ? 'hidden' : 'visible'}>
            <Show when={!isLoginPage}>
              <Button asChild>
                <Link href={'/login'}>
                  Login
                  <MdLogin/>
                </Link>
              </Button>
            </Show>
          </Activity>

          <Activity mode={isAuthenticated ? 'visible' : 'hidden'}>
            <Flex cursor={'pointer'} _hover={{bg: 'gray.50'}} p={1} borderRadius={4} alignItems={'center'} gap={1} onClick={() => {
              router.push('/dashboard/account');
            }}>
              <Avatar.Root size={'2xs'}>
                <Avatar.Fallback name={auth.name}/>
              </Avatar.Root>
              <Text textStyle={'sm'}>{auth.name}</Text>
            </Flex>

          </Activity>


        </Flex>
      </Container>
    </Box>

  )
}


const NavLink = ({text, href}: { text: string, href: string }) => {
  return (
    <Text transition={'all 0.2s ease'} color={'gray.500'} _hover={{color: 'black'}} fontSize={'0.875rem'}>
      <Link href={href}>
        {text}
      </Link>
    </Text>
  )
}
