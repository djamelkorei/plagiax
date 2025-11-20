"use client";

import Link from "next/link";

import { Logo } from "@/components/logo";
import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Show,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { MdArrowRightAlt, MdLogin } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import { Activity } from "react";
import { useAuth } from "@/hooks/use-auth";
import { IoLogOutOutline } from "react-icons/io5";
import { logoutAction } from "@/app/actions/logout.action";
import { Authorize } from "@/components/authorize";

export const Header = () => {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const isDashboardPage = pathname.startsWith("/dashboard");
  const router = useRouter();

  const loadUser = useAuth((s) => s.loadUser);
  const auth = useAuth((s) => s.auth);
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const isAuthLoading = useAuth((s) => s.isAuthLoading);

  const logoutHandler = () => {
    logoutAction().then(() => {
      loadUser().finally(() => {
        router.push("/login");
      });
    });
  };

  return (
    <Box borderBottom={"1px solid"} borderColor={"border"}>
      <Container px={{ base: 8, lg: 40 }}>
        <Flex
          height={20}
          paddingX={{ base: 0, md: 0 }}
          gap={6}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Link href={"/"}>
            <Logo />
          </Link>

          <Activity
            mode={
              isAuthenticated || (isDashboardPage && isAuthLoading)
                ? "visible"
                : "hidden"
            }
          >
            <Skeleton loading={isAuthLoading}>
              <Flex gap={6} alignItems={"center"}>
                <Authorize roles={["instructor"]}>
                  <NavLink text={"Dashboard"} href={"/dashboard"} />
                </Authorize>
                <NavLink text={"Submissions"} href={"/dashboard/submissions"} />
                <Authorize roles={["instructor"]}>
                  <NavLink text={"Students"} href={"/dashboard/students"} />
                </Authorize>
              </Flex>
            </Skeleton>
          </Activity>

          <Activity mode={isAuthenticated ? "hidden" : "visible"}>
            <Skeleton loading={isAuthLoading} ms={{ base: 0, lg: "8rem" }}>
              <Show when={!isLoginPage}>
                <Button asChild>
                  <Link href={"/login"}>
                    Login
                    <MdLogin />
                  </Link>
                </Button>
              </Show>

              <Show when={isLoginPage}>
                <Button asChild>
                  <Link href={"/login"}>
                    Contact us
                    <MdArrowRightAlt />
                  </Link>
                </Button>
              </Show>
            </Skeleton>
          </Activity>

          <Activity mode={isAuthenticated ? "visible" : "hidden"}>
            <HStack>
              <Button
                variant={"ghost"}
                cursor={"pointer"}
                p={1}
                borderRadius={4}
                alignItems={"center"}
                gap={1}
                onClick={() => {
                  router.push("/dashboard/account");
                }}
              >
                <Avatar.Root size={"2xs"}>
                  <Avatar.Fallback name={auth.name} />
                </Avatar.Root>
                <Text textStyle={"sm"}>{auth.name}</Text>
              </Button>
              |
              <Button
                size={"md"}
                colorPalette={"orange"}
                variant={"ghost"}
                onClick={() => {
                  logoutHandler();
                }}
              >
                <IoLogOutOutline />
                logout
              </Button>
            </HStack>
          </Activity>
        </Flex>
      </Container>
    </Box>
  );
};

const NavLink = ({ text, href }: { text: string; href: string }) => {
  const path = usePathname();
  const isActive = path === href;
  return (
    <Text
      transition={"all 0.2s ease"}
      color={isActive ? "black" : "gray.500"}
      _hover={{ color: "black" }}
      fontSize={"0.875rem"}
      borderBottom={"1px solid"}
      borderBottomColor={isActive ? "black" : "transparent"}
    >
      <Link href={href}>{text}</Link>
    </Text>
  );
};
