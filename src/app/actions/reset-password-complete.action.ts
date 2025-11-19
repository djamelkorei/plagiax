"use server";

import {prisma} from "@/prisma";
import {PasswordResetCompleteFormSchema} from "@/lib/form.service";
import bcrypt from "bcryptjs";

export async function resetPasswordCompleteAction(formData: FormData): Promise<{ hasError: boolean, message: string }> {

  const body = Object.fromEntries(formData);
  const parsed = PasswordResetCompleteFormSchema.safeParse(body);

  if (!parsed.success) return {hasError: true, message: "Invalid input"};

  const passwordResetToken = await prisma.password_reset_tokens.findFirst({
    where: {
      email: parsed.data.email
    }
  });

  if (!passwordResetToken) {
    return {hasError: true, message: "Invalid token"};
  }

  const tokenExpiredIn = 30 * 60 * 1000;
  const createdAt = new Date(passwordResetToken?.created_at!).getTime();

  if ((Date.now() - createdAt) > tokenExpiredIn) {
    return {hasError: true, message: "Expired token"};
  }

  const user = await prisma.users.findUnique({
    where: {
      email: parsed.data.email
    }
  });

  if (user) {
    const passwordHash = await bcrypt.hash(parsed.data.password, 7);
    await prisma.$transaction(async (tx) => {
      await tx.users.update({
        data: {
          password: passwordHash,
          updated_at: new Date(),
        },
        where: {
          email: parsed.data.email,
        },
      });

      await tx.password_reset_tokens.deleteMany({
        where: {
          email: parsed.data.email,
        },
      });
    });
  }

  return {
    hasError: false,
    message: 'success'
  }
}
