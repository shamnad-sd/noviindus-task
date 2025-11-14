"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import toast from "react-hot-toast";

const Login = () => {
  const router = useRouter();
  const setMobile = useAuthStore((state) => state.setMobile);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fullNumber = "+91" + phoneNumber;

    try {
      const response = await authAPI.sendOTP(fullNumber);

      if (response.success) {
        setMobile(fullNumber);
        toast.success(response.message || "OTP sent successfully!");
        router.push("/auth/verify-otp");
      } else {
        setError(response.message || "Failed to send OTP");
        toast.error(response.message || "Failed to send OTP");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to send OTP. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-xl shadow-2xl p-7">
        <h2 className="text-[20px] md:text-[24px] font-bold text-gray-900 mb-2">
          Enter your phone number
        </h2>
        <p className="text-gray-600 mb-8">
          We use your mobile number to identify your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="relative">
              {/* Floating label */}
              <label
                htmlFor="phone"
                className="absolute left-3 -top-3 bg-white px-3 text-sm font-medium text-gray-600 z-10"
              >
                Phone number
              </label>
              
              <div className="relative">
                {/* Fixed prefix */}
                <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-700 text-lg font-semibold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="18"
                    viewBox="0 0 24 18"
                    className=""
                  >
                    <rect width="24" height="18" fill="#FF9933" />
                    <rect y="6" width="24" height="6" fill="#FFFFFF" />
                    <rect y="12" width="24" height="6" fill="#138808" />
                    <circle cx="12" cy="9" r="2" fill="#000080" />
                  </svg>
                  +91
                </span>
                <input
                  id="phone"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/[^\d]/g, "")
                      .slice(0, 10);
                    setPhoneNumber(value);
                    setError("");
                  }}
                  placeholder="1234567890"
                  className={`w-full pl-24 pr-4 py-4 border-2 rounded-xl text-lg focus:outline-none focus:ring-2 transition-all ${
                    error
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-[#1B5A7E] focus:ring-blue-100"
                  }`}
                  disabled={loading}
                  maxLength={10}
                  autoComplete="off"
                  inputMode="numeric"
                />
              </div>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </p>
            )}
          </div>

          <div className="text-[11px] text-gray-600 pb-20 md:pb-40">
            By tapping Get started, you agree to the{" "}
            <a href="#" className="text-[#1B5A7E] hover:underline font-medium">
              Terms & Conditions
            </a>
          </div>

          <button
            type="submit"
            disabled={loading || !validatePhone(phoneNumber)}
            className={`w-full py-3 px-6 cursor-pointer rounded-xl text-white font-semibold text-lg transition-all duration-200 ${
              loading || !validatePhone(phoneNumber)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1C3141] hover:bg-[#13465F] hover:shadow-lg transform hover:-translate-y-0.5"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending OTP...
              </span>
            ) : (
              "Get Started"
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};
export default Login;