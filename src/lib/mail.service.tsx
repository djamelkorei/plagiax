import { render, toPlainText } from "@react-email/render";
import type { JSX } from "react";
import { Resend } from "resend";
import { AppContext } from "@/data/context";
import ResetPasswordEmailTempla from "@/emails/reset-password.email.template";
import WelcomeEmailTemplate from "@/emails/welcome.email.template";

const resend = new Resend(process.env.RESEND_KEY);

const sendEmail = async (
  to: string,
  subject: string,
  template: JSX.Element,
) => {
  const html = await render(template);
  const text = toPlainText(html);

  if (process.env.NODE_ENV === "development") {
    to = process.env.TEST_EMAIL ?? "";
  }

  if (!to) {
    return;
  }

  await resend.emails.send({
    from: AppContext.emailNoReply,
    to: to,
    subject: subject,
    html: html,
    text: text,
  });
};

const sendWelcomeEmail = async (
  userName: string,
  userEmail: string,
  link: string,
  password: string,
) => {
  const subject = `Welcome to ${AppContext.name}!`;
  const template = (
    <WelcomeEmailTemplate
      userName={userName}
      userEmail={userEmail}
      userPassword={password}
      link={link}
    />
  );
  await sendEmail(userEmail, subject, template);
};

const sendResetPasswordEmail = async (
  userName: string,
  userEmail: string,
  link: string,
) => {
  const subject = `Reset Your ${AppContext.name} Password`;
  const template = <ResetPasswordEmailTempla userName={userName} link={link} />;
  await sendEmail(userEmail, subject, template);
};

export const MailService = {
  sendWelcomeEmail,
  sendResetPasswordEmail,
};
