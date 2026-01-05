"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Wallet,
  Building2,
  Smartphone,
  CircleCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

import { useApp } from "../context/AppContext";

export default function CheckoutPage() {
  const { cart, getCartTotal, user, setIsAuthOpen, clearCart } = useApp();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    mobile: user?.phone || "",
    email: user?.email || "",
    address: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    instructions: "",
    giftNote: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("upi");

  const subtotal = getCartTotal();
  const shipping = subtotal > 1500 ? 0 : 99;
  const discount = 0;
  const total = subtotal + shipping - discount;

  /* ================= LOGIN REQUIRED ================= */
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-12 rounded-3xl shadow-lg">
          <h2 className="text-3xl mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">
            You need to login to proceed with checkout
          </p>
          <button
            onClick={() => {
              setIsAuthOpen(true);
              router.push("/");
            }}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full"
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  /* ================= EMPTY CART ================= */
  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-12 rounded-3xl shadow-lg">
          <h2 className="text-3xl mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Add some products to proceed with checkout
          </p>
          <button
            onClick={() => router.push("/products")}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  /* ================= SUBMIT ================= */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
      return;
    }

    setOrderPlaced(true);
    clearCart();
    toast.success("Order placed successfully!");

    setTimeout(() => {
      router.push("/");
    }, 3000);
  };

  /* ================= SUCCESS ================= */
  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="text-center bg-white p-12 rounded-3xl shadow-2xl max-w-md"
        >
          <CircleCheck className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h2 className="text-4xl mb-4">Order Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your order has been placed successfully.
          </p>
          <div className="text-left bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 mb-1">Order ID</p>
            <p className="font-mono">#DK{Date.now()}</p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  /* ================= MAIN ================= */
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FORM */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="bg-white rounded-3xl shadow-lg p-8 space-y-6"
                  >
                    <h2 className="text-2xl">Delivery Details</h2>

                    <input
                      required
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full px-4 py-3 border rounded-lg"
                    />

                    <input
                      required
                      placeholder="Mobile"
                      value={formData.mobile}
                      onChange={(e) =>
                        setFormData({ ...formData, mobile: e.target.value })
                      }
                      className="w-full px-4 py-3 border rounded-lg"
                    />

                    <input
                      required
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border rounded-lg"
                    />

                    <textarea
                      placeholder="Full Address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full px-4 py-3 border rounded-lg"
                    />

                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full"
                    >
                      Continue to Payment
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="bg-white rounded-3xl shadow-lg p-8 space-y-6"
                  >
                    <h2 className="text-2xl">Payment Method</h2>

                    {[
                      { id: "upi", label: "UPI" },
                      { id: "card", label: "Card" },
                      { id: "cod", label: "Cash on Delivery" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id)}
                        className={`w-full p-4 border rounded-xl ${
                          paymentMethod === m.id
                            ? "border-pink-500 bg-pink-50"
                            : "border-gray-200"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 py-4 bg-gray-100 rounded-full"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full"
                      >
                        Place Order
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* SUMMARY */}
          <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-24">
            <h3 className="text-xl mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between text-lg border-t pt-3">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
