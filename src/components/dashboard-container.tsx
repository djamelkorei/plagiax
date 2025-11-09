'use client'

import {Activity, ReactNode} from "react";
import {Badge, Box, Button, Flex, Text} from "@chakra-ui/react";
import {HiOutlineHome, HiOutlineMail} from "react-icons/hi";
import {usePathname} from "next/navigation";

interface DashboardContainerProps {
  title: string,
  children?: ReactNode
}

export const DashboardContainer = (props: DashboardContainerProps) => {

  const pathname = usePathname();
  const isDashboardHome = pathname === '/dashboard';

  return (
    <Flex flexDirection={'column'}>
      <Flex gap={3}
            borderBottom={'1px solid'}
            borderColor={'border'}
            pb={4}
            alignItems={'center'}
      >
        <HiOutlineHome/>
        <Text fontWeight={'semibold'} textStyle={'xs'}>/</Text>
        {props.title}
      </Flex>

      <Activity mode={isDashboardHome ? 'hidden' : 'visible'}>
        <MembershipBar/>
      </Activity>


      <Box  minH={{base: 'full', md: 'calc(100vh - 250px)'}} py={6}>
        {props.children}
      </Box>
    </Flex>
  )
}


export const MembershipBar = () => {

  return (
    <Flex gap={6}
          borderBottom={'1px solid'}
          borderColor={'border'}
          py={4}
          alignItems={'center'}
    >
      <Flex gap={2} alignItems={'center'}>
        <Text textStyle={'sm'} fontWeight={'semibold'}>Membership</Text>
        <Badge colorPalette={'teal'}>Active</Badge>
      </Flex>

      <Text color={'gray.300'}>|</Text>

      <Flex gap={2} alignItems={'center'}>
        <Text textStyle={'sm'} fontWeight={'semibold'}>Students</Text>
        <Badge colorPalette={'teal'}>1/2000</Badge>
      </Flex>

      <Text color={'gray.300'}>|</Text>

      <Flex gap={2} alignItems={'center'}>
        <Text textStyle={'sm'} fontWeight={'semibold'}>Days left</Text>
        <Badge colorPalette={'teal'}>34</Badge>
      </Flex>

      <Flex alignItems={'center'} gap={2} ms={'auto'}>

        Need help ?

        <Button size={'xs'} ms={'auto'}>
          Contact Us
          <HiOutlineMail/>
        </Button>

      </Flex>

    </Flex>
  )
}
