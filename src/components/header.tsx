'use client';

import Link from "next/link";

import {Logo} from "@/components/logo";
import {Button, Flex, Show} from "@chakra-ui/react";
import {MdLogin} from "react-icons/md";
import {usePathname} from "next/navigation";


export const Header = () => {

  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <Flex
          height={20}
          paddingX={{base: 6, md: 0}}
          gap={6}
          alignItems={'center'}
          justifyContent={'space-between'}
          borderBottom={'1px solid'}
          borderColor={'border'}>

      <Link href={'/'}>
        <Logo/>
      </Link>

      <Show when={!isLoginPage}>
        <Button asChild>
          <Link href={'/login'}>
            Login
          </Link>
          <MdLogin/>
        </Button>
      </Show>

    </Flex>
  )
}
