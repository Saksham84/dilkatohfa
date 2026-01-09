"use client";
import { X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import toast from "react-hot-toast";

type Step = "login" | "signup" | "forgot" | "otp" | "reset";

export function AuthModal() {
  const { isAuthOpen, setIsAuthOpen, login, signup, loading } = useApp();

  const [step, setStep] = useState<Step>("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  const resetAll = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setOtp("");
  };

  /* ================= LOGIN ================= */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast("Email and password are required", { icon: "⚠️" });
      return;
    }
    await login(email, password);
  };

  /* ================= SIGNUP ================= */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast("All fields are required", { icon: "⚠️" });
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    await signup(name, email, password);
    toast.success("Signup successful! Please login.");
    resetAll();
    setStep("login");
  };

  /* ================= SEND OTP ================= */
  const handleSendOtp = async () => {
    if (!email) {
      toast("Email is required", { icon: "⚠️" });
      return;
    }

    setSendingOtp(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      toast.success("OTP sent to your email");
      setStep("otp");
    } finally {
      setSendingOtp(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const handleVerifyOtp = async () => {
    if (!otp) {
      toast("OTP is required", { icon: "⚠️" });
      return;
    }

    setVerifyingOtp(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      toast.success("OTP verified");
      setStep("reset");
    } finally {
      setVerifyingOtp(false);
    }
  };

  /* ================= RESET PASSWORD ================= */
  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      toast("All fields are required", { icon: "⚠️" });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setResettingPassword(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      toast.success("Password reset successful");
      resetAll();
      setStep("login");
    } finally {
      setResettingPassword(false);
    }
  };

  const titleMap: Record<Step, string> = {
    login: "Welcome Back",
    signup: "Join Dilkatohfa",
    forgot: "Forgot Password",
    otp: "Verify OTP",
    reset: "Reset Password",
  };

  return (
    <AnimatePresence>
      {isAuthOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAuthOpen(false)}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-50 p-8"
          >
            <button
              onClick={() => setIsAuthOpen(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-3xl mb-6 text-center">
              {titleMap[step]}
            </h2>

            {/* ================= FORMS ================= */}
            {step === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-400"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-400"
                  />
                </div>

                <button
                  disabled={loading}
                  className="w-full py-3 rounded-full text-white bg-gradient-to-r from-pink-500 to-purple-500"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                <button
                  type="button"
                  onClick={() => setStep("forgot")}
                  className="text-sm text-pink-600 w-full"
                >
                  Forgot password?
                </button>

                <button
                  type="button"
                  onClick={() => setStep("signup")}
                  className="text-sm text-gray-600 w-full"
                >
                  Don&apos;t have an account? Sign up
                </button>
              </form>
            )}

            {step === "signup" && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-400"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-400"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-400"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-400"
                  />
                </div>

                <button className="w-full py-3 rounded-full text-white bg-gradient-to-r from-pink-500 to-purple-500">
                  Sign Up
                </button>

                <button
                  type="button"
                  onClick={() => setStep("login")}
                  className="text-sm text-gray-600 w-full"
                >
                  Already have an account? Login
                </button>
              </form>
            )}

            {step === "forgot" && (
              <div className="space-y-4">
                <label className="block text-sm mb-2">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-400"
                />
                <button
                  onClick={handleSendOtp}
                  disabled={sendingOtp}
                  className="w-full py-3 rounded-full text-white bg-gradient-to-r from-pink-500 to-purple-500"
                >
                  {sendingOtp ? "Sending OTP..." : "Send OTP"}
                </button>
              </div>
            )}

            {step === "otp" && (
              <div className="space-y-4">
                <label className="block text-sm mb-2">OTP</label>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-400"
                />
                <button
                  onClick={handleVerifyOtp}
                  disabled={verifyingOtp}
                  className="w-full py-3 rounded-full text-white bg-gradient-to-r from-pink-500 to-purple-500"
                >
                  {verifyingOtp ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            )}

            {step === "reset" && (
              <div className="space-y-4">
                <label className="block text-sm mb-2">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-400"
                />

                <label className="block text-sm mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-400"
                />

                <button
                  onClick={handleResetPassword}
                  disabled={resettingPassword}
                  className="w-full py-3 rounded-full text-white bg-gradient-to-r from-pink-500 to-purple-500"
                >
                  {resettingPassword
                    ? "Resetting..."
                    : "Reset Password"}
                </button>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                By continuing, you agree to our Terms of Service and Privacy
                Policy
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
