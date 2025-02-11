import Link from 'next/link';
import React from 'react';
import SignInButton from './SignInButton';
import { FaChessKnight } from 'react-icons/fa';

const NavBar = () => {
  return (
    <div className='w-full flex items-center justify-between px-6 py-3 absolute top-0 z-50'>
      {/* Left: Play (Home) Link */}
      <Link
        href='/'
        className='text-xl font-semibold text-white flex items-center gap-2 hover:text-gray-300 transition duration-300'
      >
        <FaChessKnight className='text-yellow-400' /> Play
      </Link>

      {/* Center: Blog & Insights */}
      <div className='absolute left-1/2 transform -translate-x-1/2'>
        <Link
          href='/homepage'
          className='text-lg font-medium text-white px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition duration-300'
        >
          Blog & Insights
        </Link>
      </div>

      {/* Right: Sign In Button */}
      <SignInButton />
    </div>
  );
};

export default NavBar;
