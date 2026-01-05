"use client";

import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";

import { useApp } from "../context/AppContext";

export function ShoppingCartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    getCartTotal,
  } = useApp();

  const router = useRouter();

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? (subtotal > 1500 ? 0 : 99) : 0;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* ================= BACKDROP ================= */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* ================= DRAWER ================= */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* ================= HEADER ================= */}
            <div className="flex items-center justify-between p-6 border-b border-pink-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-pink-600" />
                <h2 className="text-xl">Shopping Cart</h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-pink-50 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ================= CART ITEMS ================= */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-2">Your cart is empty</p>
                  <p className="text-sm text-gray-400 mb-4">
                    Add some gifts to make someone's day special!
                  </p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      router.push("/products");
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 p-3 bg-pink-50 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          ₹{item.price}
                        </p>

                        {item.customization && (
                          <div className="text-xs text-purple-600 mb-2">
                            {item.customization.name && (
                              <div>Name: {item.customization.name}</div>
                            )}
                            {item.customization.message && (
                              <div>
                                Message: {item.customization.message}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.id,
                                item.quantity - 1
                              )
                            }
                            className="p-1 bg-white rounded-full hover:bg-pink-100"
                          >
                            <Minus className="w-4 h-4" />
                          </button>

                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.id,
                                item.quantity + 1
                              )
                            }
                            className="p-1 bg-white rounded-full hover:bg-pink-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 hover:bg-red-50 rounded-full h-fit"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* ================= FOOTER ================= */}
            {cart.length > 0 && (
              <div className="border-t border-pink-100 p-6 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                  </div>

                  {shipping === 0 && subtotal > 0 && (
                    <p className="text-xs text-green-600">
                      You've unlocked free shipping!
                    </p>
                  )}

                  {shipping > 0 && (
                    <p className="text-xs text-gray-500">
                      Add ₹{1500 - subtotal} more for free shipping
                    </p>
                  )}

                  <div className="flex justify-between text-lg pt-2 border-t border-pink-100">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
