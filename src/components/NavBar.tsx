import Link from 'next/link';
import React from 'react';
import SignInButton from './SignInButton';

const NavBar = () => {
  return (
    <header className='flex p-2 bg-gradient-to-b from-white to-gray-200 shadow'>
      <Link
        className='transition-colors text-black hover:text-blue-500'
        href={'/'}
      >
        Home Page
      </Link>
      <SignInButton />
    </header>
  );
};

export default NavBar;
