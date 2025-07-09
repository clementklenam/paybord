import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface OtpVerificationProps {
  type: 'email' | 'phone';
  onSuccess?: () => void;
}

export function OtpVerification({ type, onSuccess }: OtpVerificationProps) {
  const [otp, setOtp] = useState('');
  const { verifyOtp, resendOtp, loading, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyOtp({ type, otp });
      onSuccess?.();
    } catch {
      // Error is handled by AuthContext
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp(type);
      // Show success message
    } catch {
      // Error is handled by AuthContext
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Verify your {type === 'email' ? 'email' : 'phone'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter verification code
          </label>
          <input
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter OTP"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={handleResend}
          disabled={loading}
          className="text-indigo-600 hover:text-indigo-800 text-sm"
        >
          Resend verification code
        </button>
      </div>
    </div>
  );
}
