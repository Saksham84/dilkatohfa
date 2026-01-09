import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendOtpEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  await connectDB();

  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);

  user.resetOtp = hashedOtp;
  user.resetOtpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min
  await user.save();

  await sendOtpEmail(email, otp);

  return NextResponse.json({ message: "OTP sent" });
}
