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

  const authUser = await prisma.$queryRaw<AuthDto[]>`
    select u.id,
           u.email,
           u.name,
           u.membership_threshold,
           u.membership_length,
           u.membership_student_count,
           u.membership_started_at,
           u.membership_ended_at,
           (select count(*)
            from submissions s
            where exists(select 1
                         from users u2
                         where s.user_id = u2.instructor_id
                            or s.user_id = u2.id))                              as submission_count,
           (select count(*) from users where instructor_id = u.id and active)   as student_count,
           if(u.membership_started_at <= curdate() and u.membership_ended_at >= curdate(),
              greatest(ceil(datediff(u.membership_ended_at, curdate())), 0), 0) as membership_days_left,
           u.membership_ended_at >= curdate()                                   as is_membership_active,
           r.name = 'instructor'                                                as is_instructor
    from users u
           join model_has_roles mhr on mhr.model_id = u.id
           join roles r on mhr.role_id = r.id
    where u.id = ${Number(decoded.id)}
  `;

  if (authUser && authUser.length > 0) {
    return {
      ...authUser[0],
      id: Number(authUser[0].id),
      student_count: Number(authUser[0].student_count),
      submission_count: Number(authUser[0].submission_count),
      membership_days_left: Number(authUser[0].membership_days_left),
      is_membership_active: Number(authUser[0].is_membership_active) > 0,
      is_instructor: Number(authUser[0].is_instructor) > 0
    }
  }
  return null;
}
