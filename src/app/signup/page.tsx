'use client';

import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: '',
    password: '',
    username: '',
  });
  const [responseMessage, setResponseMessage] = useState('');
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [buttonColor, setButtonColor] = useState('bg-red-400');
  const [loading, setLoading] = React.useState(false);
  const onSignup = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const response: any = await axios.post(
        `${process.env.API_URL}/auth/signup`,
        user
      );
      setUser({ email: '', password: '', username: '' });
      setResponseMessage(response.data.message || 'Success !!!');
      // router.push('/login');
    } catch (error: any) {
      console.log('Error is ', error);
      setResponseMessage(error.response.data.error || 'Error !!!');
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    return password.length >= 6; // Password must have at least 6 characters
  };

  useEffect(() => {
    // Check if user has access
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    ) {
      if (isValidEmail(user.email) && isValidPassword(user.password)) {
        setResponseMessage('');
        setButtonDisabled(false);
        setButtonColor('bg-green-500');
      } else {
        setButtonDisabled(true);
        setButtonColor('bg-red-400');
      }
    } else {
      setButtonDisabled(true);

      setButtonColor('bg-red-400');
    }
  }, [user]);
  return (
    <div className="min-h-screen bg-[url('/assets/chess-background.webp')] bg-cover bg-center flex items-center justify-center">
      {/* Card Container */}
      <div className='bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md'>
        {/* Title */}
        <h1 className='text-2xl font-semibold text-center text-gray-800 mb-6'>
          {loading ? 'Processing...' : 'Sign Up'}
        </h1>

        {/* Username Input */}
        <label htmlFor='username' className='block font-medium text-gray-700'>
          Username
        </label>
        <input
          className='border border-gray-400 text-black rounded-md px-3 py-2 w-full mb-4 focus:ring focus:ring-green-300'
          id='username'
          type='text'
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          placeholder='Enter your username'
        />

        {/* Email Input */}
        <label htmlFor='email' className='block font-medium text-gray-700'>
          Email
        </label>
        <input
          className='border border-gray-400 text-black rounded-md px-3 py-2 w-full mb-4 focus:ring focus:ring-green-300'
          id='email'
          type='text'
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder='Enter your email'
        />

        {/* Password Input */}
        <label htmlFor='password' className='block font-medium text-gray-700'>
          Password
        </label>
        <input
          className='border border-gray-400 text-black rounded-md px-3 py-2 w-full mb-4 focus:ring focus:ring-green-300'
          id='password'
          type='password'
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder='Enter your password'
        />

        {/* Sign Up Button */}
        <button
          disabled={buttonDisabled}
          className={`w-full text-white font-semibold py-2 rounded-md transition ${buttonColor}`}
          onClick={onSignup}
        >
          {buttonDisabled ? 'Enter Credentials' : 'Sign Up'}
        </button>

        {/* Response Message */}
        {responseMessage && (
          <div className='flex items-center justify-center gap-2 bg-green-100 border border-green-400 text-green-700 rounded-md px-4 py-2 mt-4 shadow'>
            ✅ {responseMessage}
          </div>
        )}

        {/* Login Link */}
        <div className='text-center mt-4'>
          <Link href='/login' className='text-blue-500 hover:underline text-sm'>
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}
