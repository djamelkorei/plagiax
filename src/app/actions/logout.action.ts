"use server";

import { cookies } from "next/headers";

export async function logoutAction() {
  (await cookies()).set("auth_token", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    expires: new Date(0),
  });
}
