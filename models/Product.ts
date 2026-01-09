import mongoose, { Schema, Document, models } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;

  category: string;
  occasion: string;
  tags: string[];

  rating: number;
  reviews: number;

  description?: string;
  customizable: boolean;
  inStock: boolean;
  isActive: boolean;

  views: number;
  ordersCount: number;
  wishlistCount: number;
  lastOrderedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },

    image: { type: String, required: true },

    category: { type: String, required: true, index: true },
    occasion: { type: String, required: true, index: true },

    tags: { type: [String], default: [], index: true },

    description: { type: String },

    customizable: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true, index: true },

    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },

    views: { type: Number, default: 0, min: 0 },
    ordersCount: { type: Number, default: 0, min: 0 },
    wishlistCount: { type: Number, default: 0, min: 0 },

    lastOrderedAt: { type: Date },
  },
  { timestamps: true }
);

/* ================= VALIDATION ================= */
ProductSchema.pre("validate", async function () {
  if (
    this.originalPrice != null &&
    this.originalPrice < this.price
  ) {
    this.invalidate(
      "originalPrice",
      "Original price must be greater than or equal to price"
    );
  }
});

/* ================= INDEXES ================= */
ProductSchema.index({ name: "text", description: "text", tags: "text" });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ ordersCount: -1, wishlistCount: -1, views: -1 });
ProductSchema.index({ category: 1, price: 1 });
ProductSchema.index({ isActive: 1, inStock: 1 });

export default models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
