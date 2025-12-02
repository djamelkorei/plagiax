"use client";

import {
  Badge,
  Box,
  Button,
  Flex,
  Skeleton,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import React, { Activity, type ReactNode } from "react";
import { HiOutlineHome, HiOutlineMail } from "react-icons/hi";
import { useAuth } from "@/hooks/use-auth";

interface DashboardContainerProps {
  title: string;
  children?: ReactNode;
  breadcrumbs: string[];
}

export const DashboardContainer = (props: DashboardContainerProps) => {
  const pathname = usePathname();
  const isDashboardHome = pathname === "/dashboard";

  return (
    <Flex flexDirection={"column"}>
      <Flex
        gap={3}
        borderBottom={"1px solid"}
        borderColor={"border"}
        pb={4}
        alignItems={"center"}
      >
        <HiOutlineHome />

        {props.breadcrumbs.map((item) => (
          <React.Fragment key={item}>
            <Text fontWeight={"semibold"} textStyle={"2xs"}>
              /
            </Text>
            {item}
          </React.Fragment>
        ))}
      </Flex>

      <Activity mode={isDashboardHome ? "hidden" : "visible"}>
        <MembershipBar />
      </Activity>

      <Box minH={{ base: "full", md: "calc(100vh - 250px)" }} py={6}>
        {props.children}
      </Box>
    </Flex>
  );
};

export const MembershipBar = () => {
  const isLargeScreen = useBreakpointValue({
    base: false,
    sm: false,
    md: true,
    lg: true,
  });
  const auth = useAuth((s) => s.auth);
  const isAuthLoading = useAuth((s) => s.isAuthLoading);

  return (
    <Flex
      gap={{ base: 3, md: 6 }}
      borderBottom={"1px solid"}
      borderColor={"border"}
      py={4}
      alignItems={"center"}
      justifyContent={{ base: "center", md: "left" }}
      flexWrap={"wrap"}
      //  flexDirection={{ base: "column", md: "row" }}
    >
      <Flex gap={2} alignItems={"center"}>
        <Text textStyle={"sm"} fontWeight={"semibold"}>
          Membership
        </Text>
        <Skeleton loading={isAuthLoading}>
          <Badge colorPalette={auth.is_membership_active ? "teal" : "red"}>
            {auth.is_membership_active ? "Active" : "Inactive"}
          </Badge>
        </Skeleton>
      </Flex>

      <Text color={"gray.300"} display={{ base: "none", md: "block" }}>
        |
      </Text>

      <Flex gap={2} alignItems={"center"}>
        <Text textStyle={"sm"} fontWeight={"semibold"}>
          Days Left
        </Text>
        <Skeleton loading={isAuthLoading}>
          <Badge colorPalette={auth.is_membership_active ? "teal" : "red"}>
            {auth.membership_days_left} days
          </Badge>
        </Skeleton>
      </Flex>

      {auth.is_instructor && (
        <>
          <Text color={"gray.300"} display={{ base: "none", md: "block" }}>
            |
          </Text>

          <Flex gap={2} alignItems={"center"}>
            <Text textStyle={"sm"} fontWeight={"semibold"}>
              Student Accounts
            </Text>
            <Badge
              colorPalette={
                auth.is_membership_active
                  ? auth.student_count === auth.membership_student_count
                    ? "orange"
                    : "teal"
                  : "red"
              }
            >
              {auth.student_count}/
              {auth.membership_student_count.toLocaleString()}
            </Badge>
          </Flex>
        </>
      )}

      {isLargeScreen && (
        <Flex
          alignItems={"center"}
          gap={2}
          ms={{ base: "inherit", md: "auto" }}
        >
          <Text display={{ base: "none", xl: "block" }}>Need help ?</Text>
          <Button size={"xs"} ms={"auto"}>
            Contact Us
            <HiOutlineMail />
          </Button>
        </Flex>
      )}
    </Flex>
  );
};
