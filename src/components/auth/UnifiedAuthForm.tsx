"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE_URL } from "@/config/api";

interface UnifiedAuthFormProps {
  redirectTo?: string;
}

const UnifiedAuthForm: React.FC<UnifiedAuthFormProps> = ({
  redirectTo = "/awards",
}) => {
  const router = useRouter();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // Countdown timer for OTP resend
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleApiError = (error: any) => {
    switch (error.code) {
      case "FAKE_EMAIL_DETECTED":
        return "Temporary email addresses are not allowed";
      case "BOT_EMAIL_DETECTED":
        return "Suspicious email pattern detected";
      case "DUPLICATE_EMAIL":
        return "Email already used recently. Please use a different email or wait 24 hours.";
      case "EMAIL_NOT_VERIFIED":
        return "Please verify your email address before voting";
      case "VOTING_LIMIT_EXCEEDED":
        return `You can vote again in ${error.remainingHours} hours`;
      case "RATE_LIMITED":
        return "Too many requests. Please try again later.";
      default:
        return error.error || "An error occurred";
    }
  };

  const handleRequestOTP = async () => {
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!validatePassword(password)) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/email-auth/signup/request-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Verification code sent to your email!");
        setOtpSent(true);
        setCountdown(60);
      } else {
        const errorMessage = handleApiError(data);
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/email-auth/signup/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            otp: otp,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Account created successfully!");
        await login(data.user, data.token);
        router.push(redirectTo);
      } else {
        const errorMessage = handleApiError(data);
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!validatePassword(password)) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/email-auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Login successful!");
        await login(data.user, data.token);
        router.push(redirectTo);
      } else {
        const errorMessage = handleApiError(data);
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    await handleRequestOTP();
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setOtp("");
    setOtpSent(false);
    setCountdown(0);
  };

  const switchTab = (tab: "login" | "signup") => {
    setActiveTab(tab);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-xl p-8"
        >
          {/* Tab Navigation */}
          <div className="flex mb-8">
            <button
              onClick={() => switchTab("login")}
              className={`flex-1 py-2 px-4 text-center font-medium rounded-l-lg transition-colors ${
                activeTab === "login"
                  ? "bg-[#005B96] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => switchTab("signup")}
              className={`flex-1 py-2 px-4 text-center font-medium rounded-r-lg transition-colors ${
                activeTab === "signup"
                  ? "bg-[#005B96] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {activeTab === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-gray-600">
              {activeTab === "login"
                ? "Enter your email and password to continue"
                : "Enter your email and password to get started"}
            </p>
          </div>

          {/* Email Input */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                email && !validateEmail(email)
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300"
              }`}
              required
            />
            {email && !validateEmail(email) && (
              <p className="mt-1 text-sm text-red-600">
                Please enter a valid email address
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  password && !validatePassword(password)
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {password && !validatePassword(password) && (
              <p className="mt-1 text-sm text-red-600">
                Password must be at least 6 characters long
              </p>
            )}
          </div>

          {/* OTP Input (Signup only) */}
          {activeTab === "signup" && otpSent && (
            <div className="mb-6">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Verification Code *
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="123456"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center text-2xl tracking-widest"
                maxLength={6}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the 6-digit code sent to your email
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {activeTab === "login" ? (
              <motion.button
                onClick={handleLogin}
                disabled={
                  loading ||
                  !validateEmail(email) ||
                  !validatePassword(password)
                }
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                  loading ||
                  !validateEmail(email) ||
                  !validatePassword(password)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#005B96] hover:bg-[#004080] cursor-pointer"
                }`}
              >
                {loading ? "Signing In..." : "Sign In"}
              </motion.button>
            ) : (
              <>
                {!otpSent ? (
                  <motion.button
                    onClick={handleRequestOTP}
                    disabled={
                      loading ||
                      !validateEmail(email) ||
                      !validatePassword(password)
                    }
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                      loading ||
                      !validateEmail(email) ||
                      !validatePassword(password)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#005B96] hover:bg-[#004080] cursor-pointer"
                    }`}
                  >
                    {loading ? "Sending..." : "Send Verification Code"}
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleVerifyOTP}
                    disabled={loading || otp.length !== 6}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                      loading || otp.length !== 6
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#005B96] hover:bg-[#004080] cursor-pointer"
                    }`}
                  >
                    {loading ? "Verifying..." : "Verify & Create Account"}
                  </motion.button>
                )}
              </>
            )}
          </div>

          {/* Resend OTP (Signup only) */}
          {activeTab === "signup" && otpSent && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 mb-2">
                Didn't receive the code?
              </p>
              <button
                onClick={handleResendOTP}
                disabled={countdown > 0 || loading}
                className={`text-sm font-medium ${
                  countdown > 0 || loading
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-[#005B96] hover:text-[#004080] cursor-pointer"
                }`}
              >
                {loading
                  ? "Sending..."
                  : countdown > 0
                  ? `Resend in ${countdown}s`
                  : "Resend code"}
              </button>
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="text-sm font-medium text-green-800 mb-2">
              🔒 Security Features
            </h4>
            <div className="text-xs text-green-700 space-y-1">
              <div>• Email verification for new accounts</div>
              <div>• Secure password authentication</div>
              <div>• Fake email detection & blocking</div>
              <div>• Rate limiting protection</div>
              <div>• 24-hour rolling window voting</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UnifiedAuthForm;
