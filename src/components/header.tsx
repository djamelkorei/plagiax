"use client";

import {
  Avatar,
  Box,
  Button,
  CloseButton,
  Container,
  Dialog,
  Flex,
  Portal,
  Show,
  Skeleton,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, useEffect, useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { IoLogOutOutline } from "react-icons/io5";
import { MdLogin } from "react-icons/md";
import { logoutAction } from "@/app/actions/logout.action";
import { Authorize } from "@/components/authorize";
import { Logo } from "@/components/logo";
import { useAuth } from "@/hooks/use-auth";

export const Header = () => {
  const isSmallScreen = useBreakpointValue({
    base: true,
    sm: true,
    md: false,
    lg: false,
  });

  const [open, setOpen] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: need to watch screen change
  useEffect(() => {
    setOpen(false);
  }, [isSmallScreen, setOpen]);

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

          {!isSmallScreen && <NavLinks isDrawer={false} />}

          <Button
            variant="outline"
            size="sm"
            display={isSmallScreen ? "flex" : "none"}
            onClick={() => {
              setOpen(true);
            }}
          >
            <CiMenuBurger />
          </Button>
          <Dialog.Root size="full" motionPreset="slide-in-bottom" open={open}>
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content>
                  <Dialog.Body
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    gap={5}
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <Flex py={10}>
                      <Logo />
                    </Flex>
                    <NavLinks isDrawer={true} />

                    {/*<Button w={"fit-content"} size={"md"}>*/}
                    {/*  Contact Us*/}
                    {/*  <HiOutlineMail />*/}
                    {/*</Button>*/}
                  </Dialog.Body>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton
                      size="sm"
                      onClick={() => {
                        setOpen(false);
                      }}
                    />
                  </Dialog.CloseTrigger>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        </Flex>
      </Container>
    </Box>
  );
};

const NavLinks = ({ isDrawer }: { isDrawer: boolean }) => {
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
    <>
      <Activity
        mode={
          isAuthenticated || (isDashboardPage && isAuthLoading)
            ? "visible"
            : "hidden"
        }
      >
        <Skeleton loading={isAuthLoading}>
          <Flex
            gap={6}
            alignItems={"center"}
            flexDirection={isDrawer ? "column" : "row"}
          >
            <NavLink text={"Dashboard"} href={"/dashboard"} />
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

          {/*<Show when={isLoginPage}>*/}
          {/*  <Button asChild>*/}
          {/*    <Link href={"/login"}>*/}
          {/*      Contact us*/}
          {/*      <MdArrowRightAlt />*/}
          {/*    </Link>*/}
          {/*  </Button>*/}
          {/*</Show>*/}
        </Skeleton>
      </Activity>

      <Activity mode={isAuthenticated ? "visible" : "hidden"}>
        <Flex
          gap={2}
          alignItems={"center"}
          flexDirection={isDrawer ? "column" : "row"}
        >
          <Button
            variant={"ghost"}
            cursor={"pointer"}
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
          {!isDrawer && <Text>|</Text>}
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
        </Flex>
      </Activity>
    </>
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
