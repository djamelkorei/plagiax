import type {Metadata} from "next";
import {Provider} from "@/components/ui/provider"
import {Geist, Geist_Mono} from "next/font/google";

import {Container, Flex, Link as ChakraLink, Text} from "@chakra-ui/react"
import {Logo} from "@/components/logo";
import {AppContext} from "@/data/context";
import Link from "next/link";
import {ReactNode} from "react";
import {Header} from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plagiax",
  description: "Plagiarism Detection Made Easy",
};

export default function RootLayout({children,}: Readonly<{ children: ReactNode }>) {


  return (
    <html lang="en" suppressHydrationWarning>
    <body className={`${geistSans.variable} ${geistMono.variable}`}>
    <Provider>

      <Flex direction="column" h="full" w={'full'} gap={6}>

        <Container px={{base: 8, lg: 40}}>
          {/*Navbar*/}
          <Header/>

          {children}


          {/*Footer*/}
          <Flex paddingY={6}
                paddingX={{base: 6, md: 0}} gap={6}
                alignItems={'center'}
                justifyContent={'space-between'}
                borderTop={'1px solid'}
                borderColor={'border'}
                flexWrap={'wrap'}
          >
            <Link href={'/'}>
              <Logo/>
            </Link>

            <Flex gap={4}>
              <ChakraLink variant={'underline'} asChild>
                <Link href={'/terms'}>Terms of Use</Link>
              </ChakraLink>
              <ChakraLink variant={'underline'}>
                <Link href={'/privacy'}>Privacy</Link>
              </ChakraLink>
            </Flex>

            <Text>
              © {new Date().getFullYear()} {AppContext.name}. All rights reserved
            </Text>

          </Flex>


        </Container>


      </Flex>
    </Provider>
    </body>
    </html>
  );
}
