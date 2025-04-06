'use client';

import axios from 'axios';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import LoadingScreen from '@/components/LoadingScreen';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const verifiedEmail = searchParams.get('email');

  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: '',
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [buttonColor, setButtonColor] = useState('bg-red-400');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authToken = Cookies.get('token');
        if (authToken) {
          const res = await axios.post(
            `${process.env.API_URL}/auth/get_token`,
            {},
            {
              withCredentials: true,
            }
          );
          setIsAuthenticated(res.data.success);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsInitializing(false);
      }
    };

    checkAuth();
  }, []);

  const isValidPassword = (password: string) => {
    return password.length >= 6;
  };

  const onSubmit = async () => {
    if (passwords.password !== passwords.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');

      if (isAuthenticated) {
        await axios.post(
          `${process.env.API_URL}/auth/change-password`,
          {
            newPassword: passwords.password,
          },
          { withCredentials: true }
        );
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else if (token) {
        await axios.post(
          `${process.env.API_URL}/auth/reset-password`,
          {
            token,
            newPassword: passwords.password,
          },
          { withCredentials: true }
        );
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else if (verifiedEmail) {
        await axios.post(
          `${process.env.API_URL}/auth/update-password`,
          {
            email: verifiedEmail,
            newPassword: passwords.password,
          },
          { withCredentials: true }
        );
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.error ||
          'An error occurred while updating the password'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (passwords.password.length > 0 && passwords.confirmPassword.length > 0) {
      if (
        isValidPassword(passwords.password) &&
        passwords.password === passwords.confirmPassword
      ) {
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
  }, [passwords]);

  if (isInitializing) {
    return <LoadingScreen />;
  }

  if (!token && !isAuthenticated && !verifiedEmail) {
    return (
      <div className="min-h-screen bg-[url('/assets/chess-background.webp')] bg-cover bg-center flex items-center justify-center">
        <div className='bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md'>
          <p className='text-red-500 text-center'>
            Invalid access. Please request a new password reset.
          </p>
          <div className='text-center mt-4'>
            <Link
              href='/forgot-password'
              className='text-blue-500 hover:underline text-sm'
            >
              Request Password Reset
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[url('/assets/chess-background.webp')] bg-cover bg-center flex items-center justify-center">
        <div className='bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md'>
          <div className='text-center space-y-4'>
            <div className='flex justify-center'>
              <div className='h-16 w-16 bg-green-100 rounded-full flex items-center justify-center'>
                <svg
                  className='h-10 w-10 text-green-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
            </div>

            <h2 className='text-2xl font-semibold text-gray-800'>
              Password Updated Successfully!
            </h2>

            <p className='text-gray-600'>
              {isAuthenticated
                ? 'Redirecting you to the dashboard...'
                : 'Please login with your new password.'}
            </p>

            <div className='flex justify-center'>
              <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900'></div>
            </div>

            <div className='mt-4'>
              <Link
                href={isAuthenticated ? '/dashboard' : '/login'}
                className='text-blue-500 hover:underline text-sm'
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Go to Login'} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/assets/chess-background.webp')] bg-cover bg-center flex items-center justify-center">
      <div className='bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md'>
        <h1 className='text-2xl font-semibold text-center text-gray-800 mb-6'>
          {loading
            ? 'Processing...'
            : isAuthenticated
            ? 'Change Password'
            : 'Reset Password'}
        </h1>

        <label htmlFor='password' className='block font-medium text-gray-700'>
          New Password
        </label>
        <input
          className='border border-gray-400 text-black rounded-md px-3 py-2 w-full mb-4 focus:ring focus:ring-yellow-300'
          id='password'
          type='password'
          value={passwords.password}
          onChange={(e) =>
            setPasswords({ ...passwords, password: e.target.value })
          }
          placeholder='Enter new password'
        />

        <label
          htmlFor='confirmPassword'
          className='block font-medium text-gray-700'
        >
          Confirm Password
        </label>
        <input
          className='border border-gray-400 text-black rounded-md px-3 py-2 w-full mb-4 focus:ring focus:ring-yellow-300'
          id='confirmPassword'
          type='password'
          value={passwords.confirmPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, confirmPassword: e.target.value })
          }
          onKeyDown={(e) => e.key === 'Enter' && !buttonDisabled && onSubmit()}
          placeholder='Confirm new password'
        />

        <button
          disabled={buttonDisabled || loading}
          className={`w-full text-white font-semibold py-2 rounded-md transition ${buttonColor}`}
          onClick={onSubmit}
        >
          {loading
            ? 'Updating...'
            : buttonDisabled
            ? 'Enter Passwords'
            : isAuthenticated
            ? 'Change Password'
            : 'Reset Password'}
        </button>

        {errorMessage && (
          <p className='text-red-500 text-center mt-2'>{errorMessage}</p>
        )}

        <div className='text-center mt-4'>
          <Link
            href={isAuthenticated ? '/dashboard' : '/login'}
            className='text-blue-500 hover:underline text-sm'
          >
            {isAuthenticated ? 'Back to Dashboard' : 'Back to Login'}
          </Link>
        </div>
      </div>
    </div>
  );
}
