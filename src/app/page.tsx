'use client';
import Link from 'next/link';
export default function Home() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-10 text-white relative overflow-hidden'>
      {/* Soft Faded Background Overlay */}
      <div className='fixed inset-0 bg-black bg-opacity-40 backdrop-blur-md z-0'></div>

      {/* Content (Centered & Non-Scrollable) */}
      <div className='relative z-10 text-center px-10 py-14 rounded-xl shadow-xl bg-white bg-opacity-10 backdrop-blur-md max-w-4xl'>
        {/* Title */}
        <h1 className='text-5xl font-extrabold mb-6 tracking-wide text-yellow-400 drop-shadow-lg'>
          Master Chess Like a Pro
        </h1>

        {/* Subtext */}
        <p className='text-lg text-gray-300 font-medium mb-8'>
          Explore expert blogs, free resources, and tournament insights.
        </p>

        {/* CTA Buttons */}
        <div className='flex gap-6 justify-center'>
          <Link
            href='/dashboard'
            className='inline-flex items-center justify-center px-6 py-3 rounded-full bg-yellow-400 text-gray-900 text-lg font-bold shadow-md transition-all transform hover:scale-105 hover:bg-yellow-300'
          >
            ♟ Start Game
          </Link>
          <Link
            href='/homepage'
            className='inline-flex items-center justify-center px-6 py-3 rounded-full bg-blue-500 text-white text-lg font-bold shadow-md transition-all transform hover:scale-105 hover:bg-blue-400'
          >
            📖 Blog & Insights
          </Link>
        </div>

        {/* Footer Text */}
        <div className='mt-8 text-lg text-gray-300 font-medium'>
          Created by <span className='text-white font-semibold'>Abhishek</span>
        </div>
      </div>
    </div>
  );
}
