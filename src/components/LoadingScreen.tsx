'use client';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-[url('/assets/chess-background.webp')] bg-cover bg-center flex items-center justify-center">
      <div className='bg-white bg-opacity-90 p-8 rounded-lg shadow-lg flex flex-col items-center'>
        {/* You can replace this with any loading animation you prefer */}
        <div className='animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent'></div>
        <p className='mt-4 text-gray-600 font-medium'>Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
