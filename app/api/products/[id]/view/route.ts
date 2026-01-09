import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  await Product.findByIdAndUpdate(params.id, {
    $inc: { views: 1 },
  });

  return NextResponse.json({ success: true });
}
