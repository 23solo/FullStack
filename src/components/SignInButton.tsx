'use client';

import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const SignInButton = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tokenExists, setTokenExists] = useState(false);

  useEffect(() => {
    checkToken();
    setIsLoading(false);
  }, []);
  const onSignOut = async () => {
    try {
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
    }
  };

  // check if user is active (using token or session)
  if (tokenExists == true)
    return (
      <div className='flex ml-auto'>
        <p className='text-sky-600'></p>
        {!isLoading && (
          <button
            className={`btn p-2 border border-gray-600 text-black rounded-lg bg-pink-100 focus:outline-none focus:border-gray-600 `}
            type='button'
            onClick={onSignOut}
          >
            Sign Out
          </button>
        )}
      </div>
    );

  return (
    <div className='flex gap-4 ml-auto items-center'>
      {!isLoading && (
        <div>
          <Link
            href={'/login'}
            className='flex gap-4 ml-auto bg-green-600 text-green-200 p-2 rounded'
          >
            Sign In
          </Link>
        </div>
      )}
      {!isLoading && (
        <Link
          href={'/signup'}
          className='flex gap-4 ml-auto bg-green-600 text-green-200 p-2 rounded'
        >
          Sign Up
        </Link>
      )}
    </div>
  );
};

export default SignInButton;
