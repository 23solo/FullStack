'use client';

import axios from 'axios';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [buttonColor, setButtonColor] = useState('bg-red-400');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      setButtonDisabled(true);
      setErrorMessage('');
      setSuccessMessage('');

      await axios.post(
        `${process.env.API_URL}/auth/forgot-password`,
        { email },
        { withCredentials: true }
      );

      setSuccessMessage(
        'If an account exists with this email, you will receive password reset instructions.'
      );
      setButtonDisabled(true);
      setButtonColor('bg-gray-400');
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.error || 'An error occurred. Please try again.'
      );
      setButtonDisabled(!isValidEmail(email));
      setButtonColor(isValidEmail(email) ? 'bg-green-500' : 'bg-red-400');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email.length > 0 && !loading && !successMessage) {
      if (isValidEmail(email)) {
        setButtonDisabled(false);
        setButtonColor('bg-green-500');
      } else {
        setButtonDisabled(true);
        setButtonColor('bg-red-400');
      }
    } else {
      setButtonDisabled(true);
      setButtonColor(successMessage ? 'bg-gray-400' : 'bg-red-400');
    }
  }, [email, loading, successMessage]);

  return (
    <div className="min-h-screen bg-[url('/assets/chess-background.webp')] bg-cover bg-center flex items-center justify-center">
      {/* Card Container */}
      <div className='bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md'>
        {/* Title */}
        <h1 className='text-2xl font-semibold text-center text-gray-800 mb-6'>
          {loading ? 'Processing...' : 'Forgot Password'}
        </h1>

        {/* Email Input */}
        <label htmlFor='email' className='block font-medium text-gray-700'>
          Email
        </label>
        <input
          className='border border-gray-400 text-black rounded-md px-3 py-2 w-full mb-4 focus:ring focus:ring-yellow-300'
          id='email'
          type='text'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter your email'
          onKeyDown={(e) => e.key === 'Enter' && !buttonDisabled && onSubmit()}
          disabled={loading || !!successMessage}
        />

        {/* Submit Button */}
        <button
          disabled={buttonDisabled}
          className={`w-full text-white font-semibold py-2 rounded-md transition ${buttonColor}`}
          onClick={onSubmit}
        >
          {loading
            ? 'Sending...'
            : successMessage
            ? 'Email Sent'
            : buttonDisabled
            ? 'Enter Email'
            : 'Send Reset Link'}
        </button>

        {/* Error Message */}
        {errorMessage && (
          <p className='text-red-500 text-center mt-2'>{errorMessage}</p>
        )}

        {/* Success Message */}
        {successMessage && (
          <p className='text-green-500 text-center mt-2'>{successMessage}</p>
        )}

        {/* Back to Login Link */}
        <div className='text-center mt-4'>
          <Link href='/login' className='text-blue-500 hover:underline text-sm'>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
