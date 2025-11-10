import {render, toPlainText} from "@react-email/render";
import WelcomeEmailTemplate from "@/emails/welcome.email.template";
import {AppContext} from "@/data/context";
import ResetPasswordEmailTempla from "@/emails/reset-password.email.template";
import {JSX} from "react";

const sendEmail = async (to: string, subject: string, template: JSX.Element) => {

  const html = await render(template);
  const text = toPlainText(html);

  console.log(`[${new Date().toISOString()}] Sending email:
  To: ${to}
  Subject: ${subject}
  HTML Content: ${html}
  Plain Text Content: ${text}`);
  // TODO: update
}

const sendWelcomeEmail = async (userName: string, userEmail: string) => {
  const subject = `Welcome to ${AppContext.name}!`;
  const link = "";
  const template = <WelcomeEmailTemplate userName={userName} link={link}/>;
  await sendEmail(userEmail, subject, template);
}

const sendResetPasswordEmail = async (userName: string, userEmail: string) => {
  const subject = `Reset Your ${AppContext.name} Password`;
  const link = "";
  const template = <ResetPasswordEmailTempla userName={userName} link={link}/>;
  await sendEmail(userEmail, subject, template);
}

export const MailService = {
  sendWelcomeEmail,
  sendResetPasswordEmail
}
