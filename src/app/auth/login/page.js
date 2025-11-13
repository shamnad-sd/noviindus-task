'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const setMobile = useAuthStore((state) => state.setMobile);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // if (!validatePhone(phoneNumber)) {
    //   setError('Please enter a valid 10-digit mobile number');
    //   return;
    // }

    setLoading(true);

    try {
      const response = await authAPI.sendOTP(phoneNumber);
      
      if (response.success) {
        setMobile(phoneNumber);
        toast.success(response.message || 'OTP sent successfully!');
        router.push('/auth/verify-otp');
      } else {
        setError(response.message || 'Failed to send OTP');
        toast.error(response.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('OTP send error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to send OTP. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Enter your phone number
        </h2>
        <p className="text-gray-600 mb-8">
          We use your mobile number to identify your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Phone Number Input */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-500 text-lg">🇮🇳 +91</span>
              </div>
              <input
                id="phone"
                type="text"
                value={phoneNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 13) {
                    setPhoneNumber(value);
                    setError('');
                  }
                }}
                placeholder="1234 567891"
                className={`w-full pl-24 pr-4 py-4 border-2 rounded-xl text-lg focus:outline-none focus:ring-2 transition-all ${
                  error
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-200 focus:border-[#1B5A7E] focus:ring-blue-100'
                }`}
                disabled={loading}
                maxLength={13}
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
          </div>

          {/* Terms & Conditions */}
          <div className="text-sm text-gray-600">
            By tapping Get started, you agree to the{' '}
            <a href="#" className="text-[#1B5A7E] hover:underline font-medium">
              Terms & Conditions
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || phoneNumber.length !== 13}
            className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-lg transition-all duration-200 ${
              loading || phoneNumber.length !== 13
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#1B5A7E] hover:bg-[#13465F] hover:shadow-lg transform hover:-translate-y-0.5'
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
              'Get Started'
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}