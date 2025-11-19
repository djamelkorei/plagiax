"use server";

import {prisma} from "@/prisma";
import {getServerUser} from "@/lib/auth.service";

export async function userDeleteAction(formData: FormData) {

  const userId = Number(formData.get('userId') ?? 0);
  if (!userId) {
    return
  }
  const auth = await getServerUser();
  if (!auth || !auth.is_instructor) {
    return
  }

  try {

    const result = await prisma.$executeRaw`
      update users
      set deleted_at     = now(),
          email_previous = email,
          email          = null
      where id = ${userId}
        and instructor_id = ${auth.id}
    `;

    if (result === 0) {
      console.log("Not authorized to delete or user not found");
    }

    return result > 0;
  } catch (error) {
    console.log(`Error deleting user with id: ${userId}`)
  }
}
