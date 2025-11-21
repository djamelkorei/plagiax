import { AppContext } from "@/data/context";
import { ButtonEmail } from "@/emails/lib/button.email";
import TemplateEmail from "@/emails/lib/template.email";
import { TextEmail } from "@/emails/lib/text.email";

interface EmailVerificationProps {
  userName: string;
  userEmail: string;
  userPassword: string;
  link: string;
}

export default function WelcomeEmailTemplate({
  userName,
  userEmail,
  userPassword,
  link,
}: EmailVerificationProps) {
  return (
    <TemplateEmail title={`Welcome to ${AppContext.name}`}>
      <TextEmail>Hi {userName},</TextEmail>
      <TextEmail>
        We're excited to have you on board 🎉. You’ll be able to improve
        visibility throughout your writing process, ensuring originality and
        quality every step of the way.
      </TextEmail>

      <TextEmail>
        Your account has been successfully created. To get started, please use
        the login details below:
      </TextEmail>

      <TextEmail
        style={{ background: "#EEE", borderRadius: "4px", padding: "6px 12px" }}
      >
        Email: <span style={{ fontWeight: "bold" }}>{userEmail}</span>
        <br />
        Password: <span style={{ fontWeight: "bold" }}>{userPassword}</span>
      </TextEmail>

      <TextEmail>
        You can sign in at any time using your email and the password above. For
        security, we recommend changing your password after your first login.
      </TextEmail>

      <ButtonEmail href={link}>Sign in now</ButtonEmail>

      <TextEmail>
        If you have any questions or need assistance, feel free to reach out to
        us at any time. We're here to help!
      </TextEmail>
    </TemplateEmail>
  );
}
