"use server";

import {cookies} from "next/headers";
import {prisma} from "@/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {LoginFormSchema} from "@/lib/form.service";

const TOKEN_EXPIRATION = 3;

export async function loginAction(formData: FormData) {
  const body = Object.fromEntries(formData);
  const parsed = LoginFormSchema.safeParse(body);

  if (!parsed.success) return {success: false, error: "Invalid input"};

  const {email, password} = parsed.data;

  const user = await prisma.users.findUnique({where: {email}});
  if (!user) return {success: false, error: "Invalid email or password"};

  const match = await bcrypt.compare(password, user.password);
  if (!match) return {success: false, error: "Invalid email or password"};

  // Create token
  const token = jwt.sign(
    {id: Number(user.id), email: user.email},
    process.env.JWT_SECRET!,
    {expiresIn: `${TOKEN_EXPIRATION}h`}
  );

  // Set cookie
  (await cookies()).set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * TOKEN_EXPIRATION,
    path: "/",
  });

  return {
    success: true,
    user: {
      id: Number(user.id),
      email: user.email,
      name: user.name,
    },
  };
}
