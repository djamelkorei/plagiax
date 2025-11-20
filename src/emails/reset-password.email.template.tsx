import TemplateEmail from "@/emails/lib/template.email";
import { ButtonEmail } from "@/emails/lib/button.email";
import { AppContext } from "@/data/context";
import { TextEmail } from "@/emails/lib/text.email";

interface EmailVerificationProps {
  userName: string;
  link: string;
}

export default function ResetPasswordEmailTemplate({
  userName,
  link,
}: EmailVerificationProps) {
  return (
    <TemplateEmail title={`Reset Your ${AppContext.name} Password`}>
      <TextEmail>Hi {userName},</TextEmail>

      <TextEmail>
        We received a request to reset your {AppContext.name} password. To
        proceed, please use the one-time link below to set a new password for
        your account:
      </TextEmail>

      <ButtonEmail href={link}>Reset Your Password</ButtonEmail>

      <TextEmail>
        ⚠️ This link will expire in 30 minutes, so be sure to use it promptly.
      </TextEmail>

      <TextEmail>
        If you did not request a password reset, you can safely ignore this
        email—your account will remain secure.
      </TextEmail>

      <TextEmail>
        If you have any questions or need assistance, feel free to reach out
        anytime. We’re here to help!
      </TextEmail>
    </TemplateEmail>
  );
}
