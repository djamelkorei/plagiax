import {NextResponse} from "next/server";
import {getServerUser} from "@/lib/auth.service";
import {prisma} from "@/prisma";
import {Pageable} from "@/dto/pageable.dto";
import {UserDTO} from "@/dto/user.dto";

export async function GET(req: Request) {
  try {
    const authUser = await getServerUser();

    if (!authUser) {
      return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }

    const {searchParams} = new URL(req.url);

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
      data: submissionList.map(s => ({
        ...s,
        id: Number(s.id),
          active: Number(s.active) === 1
      })),
      pagination: {
        page,
        pageSize,
        total: count,
        totalPages: Math.ceil(count / pageSize)
      }
    }
    return NextResponse.json(pageable);
  } catch (err) {
    console.error(err);
    return NextResponse.json({message: "Server error"}, {status: 500});
  }
}
