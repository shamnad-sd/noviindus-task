'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

const OTP = () => {
  const router = useRouter();
  const mobile = useAuthStore((state) => state.mobile);
  const setTokens = useAuthStore((state) => state.setTokens);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (!mobile) {
      router.push('/auth/login');
      return;
    }

    // Countdown timer for resend
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend, mobile, router]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '').slice(0, 6);
    setOtp(value);
    setError('');

    // Auto-submit when 6 digits are entered
    if (value.length === 6) {
      handleSubmit(value);
    }
  };

  const handleSubmit = async (otpValue = null) => {
    const otpCode = otpValue || otp;
    
    if (otpCode.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.verifyOTP(mobile, otpCode);

      if (response.success) {
        if (response.login) {
          // User exists, store tokens and redirect to instructions
          setTokens(response.access_token, response.refresh_token);
          toast.success('Login successful!');
          router.push('/instructions');
        } else {
          // New user, redirect to profile creation
          toast.success('OTP verified! Please complete your profile.');
          router.push('/auth/profile');
        }
      } else {
        setError(response.message || 'Invalid OTP');
        toast.error(response.message || 'Invalid OTP');
        setOtp('');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to verify OTP. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');

    try {
      const response = await authAPI.sendOTP(mobile);
      
      if (response.success) {
        toast.success('OTP sent successfully!');
        setCanResend(false);
        setCountdown(30);
        setOtp('');
      } else {
        toast.error(response.message || 'Failed to resend OTP');
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const formatPhoneNumber = (phone) => {
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, '+91 $1$2 $3');
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-xl shadow-2xl p-7">
        <h2 className="text-[20px] md:text-[24px] font-bold text-gray-900 mb-2">
          Enter the code we texted you
        </h2>
        <p className="text-gray-600 mb-8">
          We've sent an SMS to {formatPhoneNumber(mobile || '')}
        </p>

        <div className="space-y-6">
          {/* OTP Input */}
          <div>
            <div className="relative">
              {/* Floating label */}
              <label
                htmlFor="otp"
                className="absolute left-3 -top-3 bg-white px-3 text-sm font-medium text-gray-600 z-10"
              >
                SMS code
              </label>

              <input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={handleChange}
                placeholder="123456"
                className={`w-full px-4 py-4 border-2 rounded-xl text-lg tracking-widest focus:outline-none focus:ring-2 transition-all ${
                  error
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:border-[#1B5A7E] focus:ring-blue-100'
                }`}
                disabled={loading}
                autoComplete="one-time-code"
              />
            </div>

            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                {error}
              </p>
            )}

            <p className="mt-2 text-[12px] text-gray-600">
              Your 6 digit code is on its way. This can sometimes take a few moments to arrive.
            </p>

            {/* Resend Code */}
            <div className="mt-4 text-sm pb-20 md:pb-30">
              {canResend ? (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="text-[#1C3141] font-semibold cursor-pointer hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resending ? 'Resending...' : 'Resend code'}
                </button>
              ) : (
                <span className="text-[#1C3141] font-semibold">
                  Resend code in {countdown}s
                </span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={loading || otp.length !== 6}
            className={`w-full py-3 px-6 cursor-pointer rounded-xl text-white font-semibold text-lg transition-all duration-200 ${
              loading || otp.length !== 6
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#1C3141] hover:bg-[#13465F] hover:shadow-lg transform hover:-translate-y-0.5'
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
                Verifying...
              </span>
            ) : (
              'Get Started'
            )}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}

export default OTP;