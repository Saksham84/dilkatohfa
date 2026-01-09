import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    // 1️⃣ Connect DB safely
    await connectDB();

    // 2️⃣ Read cookies (async)
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { user: null },
        // { status: 401 }
      );
    }

    // 3️⃣ Validate JWT secret
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is missing");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // 4️⃣ Verify token
    const decoded = jwt.verify(token, secret) as {
      userId: string;
    };

    // 5️⃣ Fetch user
    const user = await User.findById(decoded.userId).select(
      "-password"
    );

    if (!user) {
      return NextResponse.json(
        { user: null },
        { status: 401 }
      );
    }

    // 6️⃣ Success
    return NextResponse.json({ user });
  } catch (error) {
    console.error("❌ /api/auth/me error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
