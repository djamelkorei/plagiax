import jwt from "jsonwebtoken";
import {cookies} from "next/headers";
import {prisma} from "@/prisma";
import {AuthDto} from "@/dto/user.dto";

export type JwtPayload = {
  id: string;
  email: string;
};

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch {
    return null;
  }
}

export async function getServerUser(): Promise<AuthDto | null> {
  const token = (await cookies()).get("auth_token")?.value;
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  const authUser = await prisma.users.findUnique({
    where: {id: Number.parseInt(decoded.id)},
    select: {id: true, email: true, name: true},
  });

  return authUser ? {
    ...authUser,
    id: Number(authUser.id),
  } as (AuthDto) : null;
}
