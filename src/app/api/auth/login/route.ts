import {NextResponse} from "next/server";
import {prisma} from "@/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {LoginFormSchema} from "@/lib/form.service";

const TOKEN_EXPIRATION = 3; // 3 hours

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = LoginFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({message: "Invalid input"}, {status: 400});
    }

    const {email, password} = parsed.data;

    // 🔍 Find user in DB
    const user = await prisma.users.findUnique({where: {email}});
    if (!user) {
      return NextResponse.json(
        {message: "Invalid email or password"},
        {status: 401}
      );
    }

    // 🔐 Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        {message: "Invalid email or password"},
        {status: 401}
      );
    }

    // 🎟️ Generate JWT token
    const token = jwt.sign({
      id: Number(user.id),
      email: user.email
    }, process.env.JWT_SECRET!, {expiresIn: `${TOKEN_EXPIRATION}h`});

    // 🍪 Set cookie
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      token,
      user: {id: Number(user.id), email: user.email, name: user.name},
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * TOKEN_EXPIRATION,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {message: "Internal server error"},
      {status: 500}
    );
  }
}
