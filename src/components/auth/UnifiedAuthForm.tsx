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
  redirectTo = "/voting-form",
}) => {
  const router = useRouter();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for OTP resend
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validatePhoneNumber = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    const nigerianPhoneRegex = /^(234|0)?[789][01]\d{8}$/;
    return nigerianPhoneRegex.test(cleanPhone);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const normalizePhoneNumber = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.startsWith("234")) {
      return `+${cleanPhone}`;
    } else if (cleanPhone.startsWith("0")) {
      return `+234${cleanPhone.slice(1)}`;
    } else {
      return `+234${cleanPhone}`;
    }
  };

  const handleRequestOTP = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast.error("Please enter a valid Nigerian phone number");
      return;
    }

    if (!validatePassword(password)) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const normalizedPhone = normalizePhoneNumber(phoneNumber);
      const response = await fetch(
        `${API_BASE_URL}/api/auth/signup/request-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: normalizedPhone,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Verification code sent to your phone!");
        setOtpSent(true);
        setCountdown(60);
      } else {
        toast.error(data.message || "Failed to send verification code");
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
      const normalizedPhone = normalizePhoneNumber(phoneNumber);
      const response = await fetch(
        `${API_BASE_URL}/api/auth/signup/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: normalizedPhone,
            otp: otp,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Account created successfully!");
        await login(normalizedPhone, data.token);
        router.push(redirectTo);
      } else {
        toast.error(data.message || "Invalid verification code");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast.error("Please enter a valid Nigerian phone number");
      return;
    }

    if (!validatePassword(password)) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const normalizedPhone = normalizePhoneNumber(phoneNumber);
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: normalizedPhone,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Login successful!");
        await login(normalizedPhone, data.token);
        router.push(redirectTo);
      } else {
        toast.error(data.message || "Invalid phone number or password");
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
    setPhoneNumber("");
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
      <div className="max-w-md w-full space-y-8">
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
                ? "Enter your phone number and password to continue"
                : "Enter your phone number and password to get started"}
            </p>
          </div>

          {/* Phone Number Input */}
          <div className="mb-6">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">🇳🇬 +234</span>
              </div>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="801 234 5678"
                className={`w-full pl-20 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  phoneNumber && !validatePhoneNumber(phoneNumber)
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300"
                }`}
                required
              />
            </div>
            {phoneNumber && !validatePhoneNumber(phoneNumber) && (
              <p className="mt-1 text-sm text-red-600">
                Please enter a valid Nigerian phone number
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
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                password && !validatePassword(password)
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300"
              }`}
              required
            />
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
                Enter the 6-digit code sent to your phone
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
                  !validatePhoneNumber(phoneNumber) ||
                  !validatePassword(password)
                }
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                  loading ||
                  !validatePhoneNumber(phoneNumber) ||
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
                      !validatePhoneNumber(phoneNumber) ||
                      !validatePassword(password)
                    }
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                      loading ||
                      !validatePhoneNumber(phoneNumber) ||
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
          {/* <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="text-sm font-medium text-green-800 mb-2">
              🔒 Security Features
            </h4>
            <div className="text-xs text-green-700 space-y-1">
              <div>• Phone number verification for new accounts</div>
              <div>• Secure password authentication</div>
              <div>• Rate limiting protection</div>
              <div>• 24-hour rolling window voting</div>
            </div>
          </div> */}
        </motion.div>
      </div>
    </div>
  );
};

export default UnifiedAuthForm;
