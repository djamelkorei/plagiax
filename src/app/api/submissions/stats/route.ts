import {NextResponse} from "next/server";
import {getServerUser} from "@/lib/auth.service";
import {prisma} from "@/prisma";
import {SubmissionStatsDto} from "@/dto/submission.dto";

export async function GET() {
  try {
    const authUser = await getServerUser();

    if (!authUser) {
      return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }

    const submissionStatsLines = await prisma.$queryRaw<SubmissionStatsDto[]>`
      select year(s.created_at)  as year,
             month(s.created_at) as month,
             count(*)            as count
      from submissions s
             join users u on u.id = s.user_id
      where u.id = ${authUser.id}
         or u.instructor_id = ${authUser.id}
      group by year, month
      order by year desc, month desc
      limit 10
    `;

    return NextResponse.json(submissionStatsLines.map(line => {
      return {
        month: Number(line.month),
        year: Number(line.year),
        count: Number(line.count),
      }
    }));
  } catch (err) {
    console.error(err);
    return NextResponse.json({message: "Server error"}, {status: 500});
  }
}
