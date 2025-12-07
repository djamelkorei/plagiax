import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { AuthDto } from "@/dto/user.dto";
import { prisma } from "@/prisma";

const JWT_SECRET = process.env.JWT_SECRET ?? "";

export type JwtPayload = {
  id: string;
  email: string;
};

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export async function getServerUser(): Promise<AuthDto | null> {
  const token = (await cookies()).get("auth_token")?.value;
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  const authUser = await prisma.$queryRaw<AuthDto[]>`
    select u.id,
           u.email,
           u.name,
           r.name = 'instructor'                                                                             as is_instructor,
           u.ai_enabled                                                                                      as ai_enabled,
           coalesce(u.membership_threshold, ins.membership_threshold)                                        as membership_threshold,
           coalesce(u.membership_length, ins.membership_length)                                              as membership_length,
           coalesce(u.membership_student_count, ins.membership_student_count)                                as membership_student_count,
           coalesce(u.membership_started_at, ins.membership_started_at)                                      as membership_started_at,
           coalesce(u.membership_ended_at, ins.membership_ended_at)                                          as membership_ended_at,
           date(coalesce(u.membership_ended_at, ins.membership_ended_at)) >=
           curdate()                                                                                         as is_membership_active,
           IF(date(COALESCE(u.membership_started_at, ins.membership_started_at)) <= CURDATE()
                AND date(COALESCE(u.membership_ended_at, ins.membership_ended_at)) >= CURDATE(),
              GREATEST(
                DATEDIFF(
                  date(COALESCE(u.membership_ended_at, ins.membership_ended_at)),
                  CURDATE()
                ),
                0
              ),
              0
           )                                                                                                 AS membership_days_left,
           (select count(*)
            from submissions s
            where exists(select 1
                         from users u3
                         where u3.id = u.id
                           and (s.user_id = u3.instructor_id
                           or s.user_id =
                              u3.id)))                                                                     as submission_count,
           (select count(*)
            from users u2
            where u2.instructor_id = u.id
              and u2.deleted_at is null)                                                                     as student_count,
           (select if(r.name = 'instructor', usage_daily_instructor, usage_daily_student)
            from settings
            limit 1)                                                                                         as daily_quota,
           (select count(*)
            from submissions s2
            where s2.user_id = u.id
              and date(s2.created_at) = curdate())                                                           as submission_day_count
    from users u
           left join users ins on ins.id = u.instructor_id
           join model_has_roles mhr
                on mhr.model_id = u.id
           join roles r on mhr.role_id = r.id
    where u.id = ${Number(decoded.id)}
  `;

  if (authUser && authUser.length > 0) {
    return {
      ...authUser[0],
      id: Number(authUser[0].id),
      daily_quota: Number(authUser[0].daily_quota),
      submission_day_count: Number(authUser[0].submission_day_count),
      student_count: Number(authUser[0].student_count),
      submission_count: Number(authUser[0].submission_count),
      membership_days_left: Number(authUser[0].membership_days_left),
      is_membership_active: Number(authUser[0].is_membership_active) > 0,
      is_instructor: Number(authUser[0].is_instructor) > 0,
    };
  }
  return null;
}

export async function generateAuthResetLink(email: string) {
  const plainToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = await bcrypt.hash(plainToken, 10);

  await prisma.password_reset_tokens.deleteMany({
    where: { email },
  });

  await prisma.password_reset_tokens.create({
    data: {
      email,
      token: hashedToken,
      created_at: new Date(),
    },
  });

  return `${process.env.APP_URL}/reset-password?token=${plainToken}&email=${encodeURIComponent(email)}`;
}
