import type {Metadata} from "next";
import {Provider} from "@/components/ui/provider"
import {Geist, Geist_Mono} from "next/font/google";

import {Box, Container, Flex, Link as ChakraLink, Text} from "@chakra-ui/react"
import {Logo} from "@/components/logo";
import {AppContext} from "@/data/context";
import Link from "next/link";
import {ReactNode} from "react";
import {Header} from "@/components/header";
import {Toaster} from "@/components/ui/toaster";
import {AuthContext} from "@/components/auth-context";
import {TopProgress} from "@/components/top-progress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: AppContext.name,
  description: "Plagiarism Detection Made Easy",
  keywords: "plagiarism detection, plagiarism checker, originality, content checker",
  openGraph: {
    title: `${AppContext.name} | Plagiarism Detection Made Easy`,
    description: `${AppContext.name} helps you easily detect plagiarism and ensure your content is original and error-free.`,
    url: AppContext.url,
    images: `${AppContext.url}/og-image.jpg`
  },
  twitter: {
    card: "summary_large_image",
    title: `${AppContext.name} | Plagiarism Detection Made Easy`,
    description: `${AppContext.name} helps you easily detect plagiarism and ensure your content is original and error-free.`,
    images: `${AppContext.url}/og-image.jpg`
  },
};

export default function RootLayout({children,}: Readonly<{ children: ReactNode }>) {

  return (
    <html lang="en" suppressHydrationWarning>
    <body className={`${geistSans.variable} ${geistMono.variable} `}>
    <Provider>



      <Flex direction="column" h="full" w={'full'} gap={6}>

        <TopProgress/>

        {/*Navbar*/}
        <Header/>

        <Container px={{base: 8, lg: 40}}>
          {children}
        </Container>

        <Toaster/>

        <AuthContext/>

        {/*Footer*/}
        <Box
          borderTop={'1px solid'}
          borderColor={'border'}
        >
          <Container px={{base: 8, lg: 40}}>
            <Flex paddingY={6}
                  paddingX={{base: 0, md: 0}} gap={6}
                  alignItems={'center'}
                  justifyContent={'space-between'}

                  flexWrap={'wrap'}
            >
              <Link href={'/'}>
                <Logo/>
              </Link>

              <Flex gap={4} textStyle={'sm'}>
                <ChakraLink variant={'underline'} asChild>
                  <Link href={'/terms'}>Terms of Use</Link>
                </ChakraLink>
                <ChakraLink variant={'underline'} asChild>
                  <Link href={'/privacy'}>Privacy</Link>
                </ChakraLink>
              </Flex>

              <Text textStyle={'sm'}>
                © {new Date().getFullYear()} {AppContext.name}. All rights reserved
              </Text>

            </Flex>
          </Container>
        </Box>

      </Flex>
    </Provider>
    </body>
    </html>
  );
}
