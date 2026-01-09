import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  await connectDB();

  const { email, otp } = await req.json();

  const user = await User.findOne({ email });
  if (!user || !user.resetOtp || !user.resetOtpExpiry) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (user.resetOtpExpiry < new Date()) {
    return NextResponse.json({ error: "OTP expired" }, { status: 400 });
  }

  const isValid = await bcrypt.compare(otp, user.resetOtp);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
  }

  return NextResponse.json({ message: "OTP verified" });
}
