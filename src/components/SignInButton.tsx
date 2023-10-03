'use client';

import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

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
      await axios.post(`${process.env.API_URL}/auth/signout`, {
        method: `POST`,
        withCredentials: true,
      });
      setTokenExists(false);
      window.location.reload();
    } catch (error) {
      console.log('Error!!', error);
    }
  };
  const checkToken = async () => {
    try {
      axios.defaults.withCredentials = true;
      console.log(`Port is  :${process.env.API_URL}`);

      const res = await axios.post(`${process.env.API_URL}/auth/get_token`, {
        method: `POST`,
        withCredentials: true,
      });
      console.log('res is', res);

      if (res.data.success || false) {
        setTokenExists(true);
      } else {
        setTokenExists(false);
      }
    } catch (error) {
      console.log('err is', error);
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
            className={`btn p-2 border border-gray-600 rounded-lg bg-pink-100 focus:outline-none focus:border-gray-600 `}
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
