"use server";

import { getServerUser } from "@/lib/auth.service";
import { AccountInfoFormSchema } from "@/lib/form.service";
import { prisma } from "@/prisma";

export async function accountInfoUpdate(
  formData: FormData,
): Promise<{ hasError: boolean; message: string }> {
  const authUser = await getServerUser();
  if (!authUser) {
    return { hasError: true, message: "Unauthorized" };
  }

  const body = Object.fromEntries(formData);
  const parsed = AccountInfoFormSchema.safeParse(body);

  if (!parsed.success) return { hasError: true, message: "Invalid input" };

  const exists = await prisma.users.findUnique({
    where: {
      email: parsed.data.email,
      NOT: {
        id: authUser.id,
      },
    },
  });

  if (exists) {
    return {
      hasError: true,
      message: "Email already been used ",
    };
  }

  try {
    const now = new Date();

    await prisma.users.update({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
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
