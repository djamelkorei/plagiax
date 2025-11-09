'use client';

import Link from "next/link";

import {Logo} from "@/components/logo";
import {Avatar, Box, Button, Container, Flex, Show} from "@chakra-ui/react";
import {MdLogin} from "react-icons/md";
import {usePathname} from "next/navigation";
import {Activity} from "react";
import {useAuth} from "@/hooks/use-auth";


export const Header = () => {

  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const isAuthenticated = pathname.startsWith('/dashboard');
  const {auth} = useAuth();

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
            <Flex alignItems={'center'} gap={2}>
              <Avatar.Root size={'2xs'}>
                <Avatar.Fallback name={auth.name}/>
              </Avatar.Root>
              {auth.name}
            </Flex>

          </Activity>


        </Flex>
      </Container>
    </Box>

  )
}
