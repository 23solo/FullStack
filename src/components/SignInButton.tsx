'use client';

import { FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import LoadingScreen from './LoadingScreen';

const SignInButton = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tokenExists, setTokenExists] = useState(false);

  useEffect(() => {
    checkToken();
  }, []);

  const onSignOut = async () => {
    try {
      setIsLoading(true);
      axios.defaults.withCredentials = true;
      await axios.post(
        `${process.env.API_URL}/auth/signout`,
        { token: Cookies.get('token') },
        {
          method: `POST`,
          withCredentials: true,
        }
      );
      setTokenExists(false);
      Cookies.remove('token');
      window.location.reload();
    } catch (error) {
      console.log('Error!!', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkToken = async () => {
    try {
      axios.defaults.withCredentials = true;

      const res = await axios.post(`${process.env.API_URL}/auth/get_token`, {
        method: `POST`,
        withCredentials: true,
      });

      if (res.data.success || Cookies.get('token')) {
        setTokenExists(true);
      } else {
        setTokenExists(false);
      }
    } catch (error) {
      setTokenExists(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // Return null because this is just a button component
  }

  if (tokenExists) {
    return (
      <div className='absolute top-4 right-4 flex items-center gap-4'>
        <button
          className='flex items-center gap-2 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all'
          type='button'
          onClick={onSignOut}
        >
          <FaSignOutAlt /> Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className='absolute top-4 right-4 flex items-center gap-4'>
      <Link
        href='/login'
        className='flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all'
      >
        <FaSignInAlt /> Sign In
      </Link>
      <Link
        href='/signup'
        className='flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-all'
      >
        <FaUserPlus /> Sign Up
      </Link>
    </div>
  );
};

export default SignInButton;
