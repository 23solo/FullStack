'use client';

import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

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
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      {userName}
      <h1 className='mb-4 text-lg text-green-900'>
        {loading ? 'Processing' : 'Login'}
      </h1>
      <hr />
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
        className='border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black'
        id='password'
        type='password'
        value={user.password}
        onChange={(e) => {
          setUser({ ...user, password: e.target.value });
        }}
        onKeyDown={(e) => {
          if (e.key == 'Enter') {
            onLogin();
          }
        }}
        placeholder='password'
      />
      <button
        disabled={buttonDisabled}
        className={`btn p-2 border border-gray-600 rounded-lg mb-4 focus:border-gray-600 ${buttonColor}`}
        onClick={onLogin}
      >
        {buttonDisabled ? 'Enter Creds' : 'Sign In'}
      </button>
      {errorMessage && <span className='text-red-500'>{errorMessage}</span>}
      <Link
        href='/signup'
        className='bg-slate-100 text-black text-xs btn p-2 border border-gray-600 rounded-lg mb-4 focus:border-gray-600'
      >
        Visit Signup
      </Link>
    </div>
  );
}
