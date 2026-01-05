"use client";

import { useState } from "react";
import Link from "next/link";
import { Filter, Star, Heart, ChevronDown } from "lucide-react";
import { motion } from "motion/react";

import { products } from "../../data/products";
import { useApp } from "../../context/AppContext";

interface Props {
  occasion?: string;
}

export default function ProductListing({ occasion }: Props) {
  const { addToCart, toggleWishlist, isInWishlist } = useApp();

  const [sortBy, setSortBy] = useState("popularity");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);

  /* ================= FILTER ================= */
const normalizedOccasion = occasion?.toLowerCase().trim();

const filteredProducts = products.filter((product) => {
  if (!normalizedOccasion || normalizedOccasion === "all") return true;

  return (
    product.occasion &&
    product.occasion.toLowerCase().trim() === normalizedOccasion
  );
});


  /* ================= SORT ================= */
  const sortedProducts = [...filteredProducts]
    .filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);
        default:
          return (b.reviews ?? 0) - (a.reviews ?? 0);
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* ================= BREADCRUMB ================= */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-pink-600">
            Home
          </Link>
          <span>/</span>
          <span className="capitalize text-gray-800">
            {occasion || "All Products"}
          </span>
        </div>

        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl capitalize mb-2">
              {occasion || "All"}{" "}
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Gifts
              </span>
            </h1>
            <p className="text-gray-600">
              {sortedProducts.length} products found
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-full"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-4 py-2 pr-10 bg-white border rounded-full"
              >
                <option value="popularity">Sort by Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" />
            </div>
          </div>
        </div>

        {/* ================= FILTER PANEL ================= */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-8 p-6 bg-white rounded-2xl shadow-lg"
          >
            <label className="block text-sm mb-2">Price Range</label>
            <input
              type="range"
              min={0}
              max={5000}
              step={100}
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([0, Number(e.target.value)])
              }
              className="w-full"
            />
            <p className="text-sm text-gray-600 mt-2">
              ₹0 – ₹{priceRange[1]}
            </p>
          </motion.div>
        )}

        {/* ================= PRODUCTS GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="relative">
                <Link href={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                </Link>

                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isInWishlist(product.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600"
                    }`}
                  />
                </button>
              </div>

              <div className="p-4">
                <Link href={`/product/${product.id}`}>
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-2 my-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{product.rating}</span>
                  <span className="text-sm text-gray-500">
                    ({product.reviews})
                  </span>
                </div>

                <div className="text-2xl mb-3">₹{product.price}</div>

                <button
                  onClick={() => addToCart(product)}
                  className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ================= EMPTY STATE ================= */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">
              No products found matching your criteria
            </p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full"
            >
              View All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
