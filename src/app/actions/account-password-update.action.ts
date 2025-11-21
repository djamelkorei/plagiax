"use server";

import bcrypt from "bcryptjs";
import { getServerUser } from "@/lib/auth.service";
import { AccountPasswordFormSchema } from "@/lib/form.service";
import { prisma } from "@/prisma";

export async function accountPasswordUpdate(
  formData: FormData,
): Promise<{ hasError: boolean; message: string }> {
  const authUser = await getServerUser();
  if (!authUser) {
    return { hasError: true, message: "Unauthorized" };
  }

  const body = Object.fromEntries(formData);
  const parsed = AccountPasswordFormSchema.safeParse(body);

  if (!parsed.success) return { hasError: true, message: "Invalid input" };

  const current = await prisma.users.findUnique({
    where: {
      id: authUser.id,
    },
  });

  const match = await bcrypt.compare(
    parsed.data.current_password,
    current?.password ?? "",
  );
  if (!match)
    return {
      hasError: true,
      message: "Password does match your current password",
    };

  try {
    const now = new Date();
    const passwordHash = await bcrypt.hash(parsed.data.new_password, 7);

    await prisma.users.update({
      data: {
        password: passwordHash,
        updated_at: now,
      },
      where: {
        id: authUser.id,
      },
    });
  } catch (error) {
    console.error(`Exception in writeFile() with error`, error);
  }

  return {
    hasError: false,
    message: "success",
  };
}
