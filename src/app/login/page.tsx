'use client';

import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [buttonColor, setButtonColor] = useState('bg-red-400');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    return password.length >= 6; // Password must have at least 6 characters
  };

  const onLogin = async () => {
    try {
      setLoading(true);
      // for nextJS only
      // const response = await axios.post('/api/users/login', user);

      // For nestJs Backend
      const res = await axios.post(`${process.env.API_URL}/auth/signin`, user, {
        withCredentials: true,
      });

      const token = res.data.token;
      Cookies.set('token', token);

      localStorage.setItem('userName', res.data.name);
      router.push('/dashboard');
      window.location.reload();
    } catch (error: any) {
      setErrorMessage(error.response.data.error || 'Error !!!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      if (isValidEmail(user.email) && isValidPassword(user.password)) {
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
    <AuthenticatedLayout redirectIfAuth>
      <div className="min-h-screen bg-[url('/assets/chess-background.webp')] bg-cover bg-center flex items-center justify-center">
        {/* Card Container */}
        <div className='bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md'>
          {/* Title */}
          <h1 className='text-2xl font-semibold text-center text-gray-800 mb-6'>
            {loading ? 'Processing...' : 'Login'}
          </h1>

          {/* Email Input */}
          <label htmlFor='email' className='block font-medium text-gray-700'>
            Email
          </label>
          <input
            className='border border-gray-400 text-black rounded-md px-3 py-2 w-full mb-4 focus:ring focus:ring-yellow-300'
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
            className='border border-gray-400 text-black rounded-md px-3 py-2 w-full mb-4 focus:ring focus:ring-yellow-300'
            id='password'
            type='password'
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && onLogin()}
            placeholder='Enter your password'
          />

          {/* Sign In Button */}
          <button
            disabled={buttonDisabled}
            className={`w-full text-white font-semibold py-2 rounded-md transition ${buttonColor}`}
            onClick={onLogin}
          >
            {buttonDisabled ? 'Enter Credentials' : 'Sign In'}
          </button>

          {/* Error Message */}
          {errorMessage && (
            <p className='text-red-500 text-center mt-2'>{errorMessage}</p>
          )}

          {/* Signup Link */}
          <div className='text-center mt-4 space-y-2'>
            <Link
              href='/signup'
              className='text-blue-500 hover:underline text-sm block'
            >
              Don't have an account? Sign up
            </Link>
            <Link
              href='/forgot-password'
              className='text-blue-500 hover:underline text-sm block'
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
