import {NextResponse} from "next/server";
import {getServerUser} from "@/lib/auth.service";

export async function GET() {
  try {
    const authUser = await getServerUser();

    if (!authUser) {
      return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }

    return NextResponse.json(authUser);
  } catch (err) {
    console.error(err);
    return NextResponse.json({message: "Server error"}, {status: 500});
  }
}
