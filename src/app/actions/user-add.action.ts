"use server";

import {prisma} from "@/prisma";
import {getServerUser} from "@/lib/auth.service";
import {AddUserFormSchema} from "@/lib/form.service";
import bcrypt from "bcryptjs";

export async function userAddAction(formData: FormData): Promise<{ hasError: boolean, message: string }> {

  const authUser = await getServerUser();
  if (!authUser || !authUser.is_instructor) {
    return {hasError: true, message: "Unauthorized"};
  }

  if (!authUser.is_membership_active) {
    return {
      hasError: true,
      message: "You consume all your daily quota for today, come back tomorrow or upgrade your plan"
    };
  }

  if (authUser.student_count + 1 > authUser.membership_student_count) {
    return {
      hasError: true,
      message: "Total quota exceeded, contact us so we can upgrade your membership"
    };
  }

  const body = Object.fromEntries(formData);
  const parsed = AddUserFormSchema.safeParse({
    ...body,
    id: Number(body.id),
    active: body.active === 'true',
  });

  if (!parsed.success) return {hasError: true, message: "Invalid input"};

  const exists = await prisma.users.findUnique({
    where: {
      email: parsed.data.email,
      ...(parsed.data.id ? {NOT: {id: parsed.data.id}} : {})
    },
  });

  if (exists) {
    return {
      hasError: true,
      message: 'Email already been used '
    }
  }

  try {


    const now = new Date();

    if (parsed.data.id) {

      await prisma.users.update({
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          active: parsed.data.active,
          updated_at: now
        },
        where: {
          id: parsed.data.id,
          instructor_id: authUser.id
        }
      });
    } else {

      const passwordHash = await bcrypt.hash(parsed.data.password, 7);

      await prisma.users.create({
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          password: passwordHash,
          instructor_id: authUser.id,
          ai_enabled: authUser.ai_enabled,
          active: true,
          created_at: now,
          updated_at: now
        },
      });
    }


  } catch (error) {
    console.error(`Exception in writeFile() with error`, error);
  }

  return {
    hasError: false,
    message: 'success'
  }
}
