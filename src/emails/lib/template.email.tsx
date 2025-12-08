import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import type { ReactNode } from "react";
import { AppContext } from "@/data/context";
import { DividerEmail } from "@/emails/lib/divider.email";
import { tailwindConfig } from "@/emails/lib/tailwind.config";
import { TextEmail } from "@/emails/lib/text.email";

export default function TemplateEmail({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Tailwind config={tailwindConfig}>
        <Body className="bg-[#fafafa] font-geist">
          <Preview>{title}</Preview>

          <h1
            className={
              "font-geist-mono font-bold text-2xl tracking-wide text-center py-5"
            }
          >
            Plagia<span className={"text-orange-400"}>X</span>
          </h1>

          <Container className="p-10 pt-5 mx-auto bg-[#FFF]">
            <TextEmail className={"text-[18px] font-semibold text-center"}>
              {title}
            </TextEmail>

            <DividerEmail />

            {children}

            <TextEmail>
              Kind regards,
              <br />
              The {AppContext.name} team
            </TextEmail>

            <DividerEmail />

            <Text className="text-[#777] text-[14px] leading-[1.5] m-0!">
              This email was sent via{" "}
              <a className={"text-[#555]"} href={AppContext.url}>
                {AppContext.name}
              </a>
              .
            </Text>

            {/*<Text className="text-[#777] text-[14px] leading-[1.5] m-0!">*/}
            {/*  If you require any assistance, don’t hesitate to reach out at :{" "}*/}
            {/*  <a*/}
            {/*    className={"text-[#555] text-underline"}*/}
            {/*    href={`mailto:${AppContext.email}`}*/}
            {/*  >*/}
            {/*    {AppContext.email}*/}
            {/*  </a>*/}
            {/*</Text>*/}
          </Container>

          <Container className="px-10 py-5 text-center">
            <Text className="text-[#777] text-[12px] leading-[1.5] m-0!">
              @ {new Date().getFullYear()} {AppContext.name} |{" "}
              {AppContext.domain}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
