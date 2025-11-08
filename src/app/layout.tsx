import type {Metadata} from "next";
import {Provider} from "@/components/ui/provider"
import {Geist, Geist_Mono} from "next/font/google";

import {Button, Container, Flex, Text} from "@chakra-ui/react"
import {Logo} from "@/components/logo";
import {AppContext} from "@/data/context";
import {MdLogin} from "react-icons/md";

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

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body className={`${geistSans.variable} ${geistMono.variable}`}>
    <Provider>

      <Flex direction="column" h="full" w={'full'} gap={6}>

        <Container px={{base: 8, lg: 40}}>
          {/*Navbar*/}
          <Flex padding={6} gap={6}
                alignItems={'center'}
                justifyContent={'space-between'}
                borderBottom={'1px solid'}
                borderColor={'border'}>
            <Logo/>

            <Button>
              Login
              <MdLogin/>
            </Button>
          </Flex>

          {children}


          {/*Footer*/}
          <Flex padding={6} gap={6}
                alignItems={'center'}
                justifyContent={'space-between'}
                borderTop={'1px solid'}
                borderColor={'border'}
                flexWrap={'wrap'}
          >
            <Logo/>

            <Flex>
              <Button variant={'ghost'}>
                Terms of Use
              </Button>
              <Button variant={'ghost'}>
                Privacy
              </Button>
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
