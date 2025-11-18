"use server";

import {prisma} from "@/prisma";
import {PasswordResetInitFormSchema} from "@/lib/form.service";
import {MailService} from "@/lib/mail.service";
import {generateAuthResetLink} from "@/lib/auth.service";

export async function resetPasswordInitAction(formData: FormData): Promise<{ hasError: boolean, message: string }> {

  const body = Object.fromEntries(formData);
  const parsed = PasswordResetInitFormSchema.safeParse(body);

  if (!parsed.success) return {hasError: true, message: "Invalid input"};

  const user = await prisma.users.findUnique({
    where: {
      email: parsed.data.email
    }
  });

  if (user) {
    const link = await generateAuthResetLink(parsed.data.email);
    await MailService.sendResetPasswordEmail(user.name, parsed.data.email, link);
  }

  return {
    hasError: false,
    message: 'success'
  }
}
