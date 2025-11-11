import {render, toPlainText} from "@react-email/render";
import WelcomeEmailTemplate from "@/emails/welcome.email.template";
import {AppContext} from "@/data/context";
import ResetPasswordEmailTempla from "@/emails/reset-password.email.template";
import {JSX} from "react";
import {Resend} from 'resend';

const resend = new Resend(process.env.RESEND_KEY);

const sendEmail = async (to: string, subject: string, template: JSX.Element) => {

  const html = await render(template);
  const text = toPlainText(html);

  await resend.emails.send({
    from: AppContext.emailNoReply,
    to: to,
    subject: subject,
    html: html,
    text: text
  });

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
