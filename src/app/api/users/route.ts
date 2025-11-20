import { NextResponse } from "next/server";
import type { Pageable } from "@/dto/pageable.dto";
import type { UserDTO } from "@/dto/user.dto";
import { getServerUser } from "@/lib/auth.service";
import { prisma } from "@/prisma";

export async function GET(req: Request) {
  try {
    const authUser = await getServerUser();

    if (!authUser || !authUser.is_instructor) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const q = Number(searchParams.get("q") ?? "");
    const page = Number(searchParams.get("page") ?? "1");
    const pageSize = Number(searchParams.get("pageSize") ?? "10");

    const offset = (page - 1) * pageSize;

    const submissionList = await prisma.$queryRaw<UserDTO[]>`
      select u.id         as id,
             u.name       as name,
             u.email      as email,
             u.active     as active,
             u.created_at as created_at
      from users u
      where u.deleted_at is null
        and u.instructor_id = ${authUser.id}
        and (
        ${q} is null
          or ${q} = ''
          or lower(u.name) like lower(concat('%', ${q}, '%'))
          or lower(u.email) like lower(concat('%', ${q}, '%'))
        )
      order by u.created_at desc
      limit ${pageSize} offset ${offset}
    `;

    const totalCount = await prisma.$queryRaw<{ count: bigint }[]>`
      select count(*) as count
      from users u
      where u.deleted_at is null
        and u.instructor_id = ${authUser.id}
    `;

    const count = Number(totalCount[0]?.count ?? 0);

    const pageable: Pageable<UserDTO> = {
      data: submissionList.map((s: UserDTO) => ({
        ...s,
        id: Number(s.id),
        active: Number(s.active) === 1,
      })),
      pagination: {
        page,
        pageSize,
        total: count,
        totalPages: Math.ceil(count / pageSize),
      },
    };
    return NextResponse.json(pageable);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
