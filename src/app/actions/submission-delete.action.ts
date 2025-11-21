"use server";

import { getServerUser } from "@/lib/auth.service";
import { prisma } from "@/prisma";

export async function submissionDeleteAction(formData: FormData) {
  const submissionId = Number(formData.get("submissionId") ?? 0);
  if (!submissionId) {
    return;
  }
  const auth = await getServerUser();
  if (!auth) {
    return;
  }

  try {
    const result = await prisma.$executeRaw`
      update submissions s
      set status     = 'DELETED',
          deleted_at = now()
      where s.id = ${submissionId}
        and s.user_id in (select u.id
                          from users u
                          where u.id = ${auth.id}
                             or u.instructor_id = ${auth.id});
    `;

    if (result === 0) {
      console.log("Not authorized to delete or submission not found");
    }

    return result > 0;
  } catch (error) {
    console.log(`Error deleting submission with id: ${submissionId}`, error);
  }
}
