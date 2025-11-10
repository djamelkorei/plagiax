import TemplateEmail from "@/emails/lib/template.email";
import {ButtonEmail} from "@/emails/lib/button.email";
import {AppContext} from "@/data/context";
import {TextEmail} from "@/emails/lib/text.email";

interface EmailVerificationProps {
  userName: string;
  link: string;
}

export default function ResetPasswordEmailTempla({userName, link}: EmailVerificationProps) {
  return (
    <TemplateEmail
      title={`Welcome to ${AppContext.name}`}
    >
      <TextEmail>
        Hi {userName},
      </TextEmail>
      <TextEmail>
        We're excited to have you on board 🎉. You’ll be able to improve
        visibility throughout your writing process, ensuring originality and quality every step of the way.
      </TextEmail>

      <TextEmail>
        Your account has been successfully created. To get started, please use the one-time login link below to access
        your account and set your password:
      </TextEmail>

      <ButtonEmail href={link}>
        Set Your Password & Sign In
      </ButtonEmail>

      <TextEmail>
        This link is valid for a limited time, so be sure to use it soon.
      </TextEmail>

      <TextEmail>
        If you have any questions or need assistance, feel free to reach out to us at any time. We're here to help!
      </TextEmail>

    </TemplateEmail>
  );
}
