import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export const runtime = "nodejs";

/* ================= ADD TO WISHLIST ================= */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    await Product.findByIdAndUpdate(id, {
      $inc: { wishlistCount: 1 },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("WISHLIST_ADD_ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add to wishlist" },
      { status: 500 }
    );
  }
}

/* ================= REMOVE FROM WISHLIST ================= */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    await Product.findByIdAndUpdate(id, {
      $inc: { wishlistCount: -1 },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("WISHLIST_REMOVE_ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove from wishlist" },
      { status: 500 }
    );
  }
}
