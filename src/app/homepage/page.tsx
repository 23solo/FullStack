'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function HomePage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch('/api/blogs')
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((err) => console.error('Error fetching blogs:', err));
  }, []);

  return (
    <>
      <Head>
        <title>ChessMaster - Improve Your Chess Skills</title>
        <meta
          name='description'
          content='Improve your chess skills with expert blogs, free resources, and tournament insights. Join now!'
        />
        <meta
          name='keywords'
          content='chess, chess strategy, chess blog, chess tournaments, free chess resources'
        />
      </Head>
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
              href='/signup'
              className='inline-flex items-center justify-center px-6 py-3 rounded-full bg-yellow-400 text-gray-900 text-lg font-bold shadow-md transition-all transform hover:scale-105 hover:bg-yellow-300'
            >
              ♟ Join Now
            </Link>
          </div>

          {/* Blog Section */}
          <section className='mt-10'>
            <h2 className='text-4xl font-bold text-center mb-6'>
              Latest Blog Posts
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {blogs.length > 0 ? (
                blogs.map((blog: any) => (
                  <div
                    key={blog.id}
                    className='bg-gray-800/80 p-6 rounded-lg shadow-lg hover:shadow-xl transition border border-gray-700 backdrop-blur-md'
                  >
                    <h3 className='text-2xl font-semibold mb-2'>
                      {blog.title}
                    </h3>
                    <p className='text-gray-400 text-sm mb-2'>{blog.date}</p>
                    <p className='text-gray-300 mb-4'>{blog.excerpt}</p>
                    <Link
                      href={`/blog/${blog.id}`}
                      className='text-yellow-400 font-semibold hover:underline'
                    >
                      Read More →
                    </Link>
                  </div>
                ))
              ) : (
                <p className='text-center text-gray-400'>Loading blogs...</p>
              )}
            </div>
          </section>

          {/* Free Resources Section */}
          <section className='mt-16 text-center'>
            <h2 className='text-4xl font-bold mb-6'>Free Chess Resources</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              <Link
                href='/resources/openings'
                className='block bg-blue-700/80 text-white p-4 rounded-lg shadow-md hover:bg-blue-800 transition border border-blue-600 backdrop-blur-md'
              >
                Chess Openings Guide
              </Link>
              <Link
                href='/resources/endgames'
                className='block bg-green-700/80 text-white p-4 rounded-lg shadow-md hover:bg-green-800 transition border border-green-600 backdrop-blur-md'
              >
                Mastering Endgames
              </Link>
              <Link
                href='/resources/tactics'
                className='block bg-purple-700/80 text-white p-4 rounded-lg shadow-md hover:bg-purple-800 transition border border-purple-600 backdrop-blur-md'
              >
                Tactical Patterns
              </Link>
              <Link
                href='/resources/downloads'
                className='block bg-red-700/80 text-white p-4 rounded-lg shadow-md hover:bg-red-800 transition border border-red-600 backdrop-blur-md'
              >
                Download Free PDFs
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
