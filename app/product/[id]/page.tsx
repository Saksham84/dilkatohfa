"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
    Heart,
    ShoppingCart,
    Star,
    Truck,
    Shield,
    RotateCcw,
} from "lucide-react";
import { motion } from "motion/react";

import { products } from "../../data/products";
import { useApp } from "../../context/AppContext";

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { addToCart, toggleWishlist, isInWishlist } = useApp();

    const product = products.find((p) => p.id === id);

    const [quantity, setQuantity] = useState(1);
    const [pincode, setPincode] = useState("");
    const [customization, setCustomization] = useState({
        name: "",
        message: "",
        date: "",
    });

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl mb-4">Product not found</h2>
                    <Link href="/products" className="text-pink-600 hover:underline">
                        Back to products
                    </Link>
                </div>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(
            product,
            quantity,
            product.customizable ? customization : undefined
        );
    };

    const handleBuyNow = () => {
        handleAddToCart();
        router.push("/checkout");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* ================= BREADCRUMB ================= */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                    <Link href="/" className="hover:text-pink-600">
                        Home
                    </Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-pink-600">
                        Products
                    </Link>
                    <span>/</span>
                    <span className="text-gray-800">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* ================= IMAGE SECTION (NEW) ================= */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="sticky top-24 bg-white rounded-3xl shadow-lg overflow-hidden relative">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-[500px] object-cover"
                            />

                            {/* Discount badge */}
                            {product.originalPrice && (
                                <div className="absolute top-6 left-6 px-4 py-2 bg-red-500 text-white rounded-full text-sm">
                                    {Math.round(
                                        ((product.originalPrice - product.price) /
                                            product.originalPrice) *
                                        100
                                    )}
                                    % OFF
                                </div>
                            )}

                            {/* Wishlist */}
                            <button
                                onClick={() => toggleWishlist(product)}
                                className="absolute top-6 right-6 p-3 bg-white rounded-full shadow-lg"
                            >
                                <Heart
                                    className={`w-6 h-6 ${isInWishlist(product.id)
                                            ? "fill-red-500 text-red-500"
                                            : "text-gray-600"
                                        }`}
                                />
                            </button>
                        </div>
                    </motion.div>

                    {/* ================= DETAILS ================= */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div>
                            <div className="text-sm text-gray-500 mb-2">
                                {product.category}
                            </div>
                            <h1 className="text-4xl mb-4">{product.name}</h1>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    <span>{product.rating}</span>
                                </div>
                                <span className="text-gray-600">
                                    {product.reviews} reviews
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-4xl">₹{product.price}</span>
                            {product.originalPrice && (
                                <>
                                    <span className="line-through text-gray-400">
                                        ₹{product.originalPrice}
                                    </span>
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                                        Save ₹{product.originalPrice - product.price}
                                    </span>
                                </>
                            )}
                        </div>

                        <p className="text-gray-600">{product.description}</p>

                        {/* ================= BADGES ================= */}
                        <div className="flex gap-6 text-sm">
                            <span className="flex items-center gap-2 text-green-600">
                                <Shield className="w-5 h-5" /> 100% Genuine
                            </span>
                            <span className="flex items-center gap-2 text-blue-600">
                                <Truck className="w-5 h-5" /> Fast Delivery
                            </span>
                            <span className="flex items-center gap-2 text-purple-600">
                                <RotateCcw className="w-5 h-5" /> Easy Returns
                            </span>
                        </div>

                        {/* ================= CUSTOMIZATION ================= */}
                        {product.customizable && (
                            <div className="bg-purple-50 p-6 rounded-2xl space-y-4">
                                <h3 className="font-semibold">Customize Your Gift</h3>

                                <input
                                    placeholder="Name on gift"
                                    value={customization.name}
                                    onChange={(e) =>
                                        setCustomization({ ...customization, name: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border rounded-lg"
                                />

                                <textarea
                                    placeholder="Special message"
                                    rows={3}
                                    value={customization.message}
                                    onChange={(e) =>
                                        setCustomization({
                                            ...customization,
                                            message: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 border rounded-lg"
                                />

                                <input
                                    type="date"
                                    value={customization.date}
                                    onChange={(e) =>
                                        setCustomization({ ...customization, date: e.target.value })
                                    }
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                        )}

                        {/* ================= DELIVERY ================= */}
                        <div className="bg-blue-50 p-6 rounded-2xl">
                            <div className="flex gap-2">
                                <input
                                    placeholder="Enter pincode"
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                    className="flex-1 px-4 py-2 border rounded-lg"
                                />
                                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg">
                                    Check
                                </button>
                            </div>
                        </div>

                        {/* ================= QUANTITY ================= */}
                        <div>
                            <label className="block text-sm mb-2">Quantity</label>
                            <div className="flex gap-4 items-center">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                    -
                                </button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                        </div>

                        {/* ================= ACTIONS ================= */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 py-4 border-2 border-pink-500 text-pink-600 rounded-full flex justify-center gap-2"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </button>

                            <button
                                onClick={handleBuyNow}
                                className="flex-1 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full"
                            >
                                Buy Now
                            </button>
                        </div>
                    </motion.div>
                </div>
                {/* ================= RELATED ================= */}
                <div className="mt-20">
                    <h2 className="text-3xl mb-8">You May Also Like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.slice(0, 4).map((p) => (
                            <Link
                                key={p.id}
                                href={`/product/${p.id}`}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden"
                            >
                                <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="font-semibold">{p.name}</h3>
                                    <p className="text-xl">₹{p.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
