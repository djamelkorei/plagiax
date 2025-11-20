import { NextResponse } from "next/server";
import type { Pageable } from "@/dto/pageable.dto";
import type { SubmissionDto } from "@/dto/submission.dto";
import { getServerUser } from "@/lib/auth.service";
import { prisma } from "@/prisma";

export async function GET(req: Request) {
  try {
    const authUser = await getServerUser();

    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const q = searchParams.get("q") ?? "";
    const page = Number(searchParams.get("page") ?? "1");
    const pageSize = Number(searchParams.get("pageSize") ?? "10");

    const offset = (page - 1) * pageSize;

    const submissionList = await prisma.$queryRaw<SubmissionDto[]>`
      select cast(s.id as signed)            as id,
             s.title,
             s.posted_at,

             s.original_filename,
             s.file_link,

             s.report_link,
             cast(s.similarity as signed)    as similarity,
             s.status,
             s.admin_error_message           as error_message,

             s.ai_link,
             cast(s.ai_similarity as signed) as ai_similarity,
             s.ai_error_message,
             s.ai_state,

             u.name                          as user_name,
             u.email                         as user_email
      from submissions s
             join users u on u.id = s.user_id
      where s.deleted_at is null
        and s.status != 'DELETED'
        and (u.id = ${authUser.id} or u.instructor_id = ${authUser.id})
        and (
        ${q} is null
          or ${q} = ''
          or lower(s.title) like lower(concat('%', ${q}, '%'))
          or lower(u.name) like lower(concat('%', ${q}, '%'))
          or lower(u.email) like lower(concat('%', ${q}, '%'))
        )
      order by s.posted_at desc
      limit ${pageSize} offset ${offset}
     `;

    const totalCount = await prisma.$queryRaw<{ count: bigint }[]>`
      select cast(count(*) as signed) as count
      from submissions s
             join users u on u.id = s.user_id
      where u.id = ${authUser.id}
         or u.instructor_id = ${authUser.id}
    `;

    const count = Number(totalCount[0]?.count ?? 0);

    const pageable: Pageable<SubmissionDto> = {
      data: submissionList.map((s) => ({
        ...s,
        id: Number(s.id),
        similarity: Number(s.similarity),
        ai_similarity: Number(s.ai_similarity),
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
