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
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1 className='mb-4 text-lg text-green-900'>
        {loading ? 'Processing...' : 'SignUp'}
      </h1>
      <hr />
      <label htmlFor='username'>Username</label>
      <input
        className='border border-gray-600 text-black rounded-lg mb-4 focus:outline-none focus:border-gray-600'
        id='username'
        type='text'
        value={user.username}
        onChange={(e) => {
          setUser({ ...user, username: e.target.value });
        }}
        placeholder='username'
      />
      <label htmlFor='email'>Email</label>
      <input
        className='border border-gray-600 text-black rounded-lg mb-4 focus:outline-none focus:border-gray-600'
        id='email'
        type='text'
        value={user.email}
        onChange={(e) => {
          setUser({ ...user, email: e.target.value });
        }}
        placeholder='email'
      />
      <label htmlFor='password'>Password</label>
      <input
        className='border text-black border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-gray-600'
        id='password'
        type='password'
        value={user.password}
        onChange={(e) => {
          setUser({ ...user, password: e.target.value });
        }}
        placeholder='password'
      />
      <button
        className={`btn p-2 border border-gray-600 text-black rounded-lg mb-4 focus:outline-none focus:border-gray-600 ${buttonColor}`}
        type='button'
        onClick={onSignup}
        disabled={buttonDisabled}
      >
        {buttonDisabled ? 'Enter Creds' : 'SignUp'}
      </button>
      {responseMessage && (
        <span className='text-sky-950'>{responseMessage}</span>
      )}
      <Link
        href='/login'
        className='bg-slate-100 text-black btn text-xs p-2 border border-gray-600 rounded-lg mb-4 focus:border-gray-600'
      >
        Visit Login
      </Link>
    </div>
  );
}
