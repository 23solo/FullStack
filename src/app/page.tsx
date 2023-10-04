export default function Home() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-between p-24'>
      <h1
        style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '20px' }}
      >
        Welcome To ChessApp
      </h1>
      <a
        href='/dashboard'
        className='btn p-2 m-4 border items-center justify-content-center border-gray-600 rounded-lg bg-white text-black focus:outline-none focus:border-gray-600'
        style={{ fontSize: '20px', padding: '10px 20px' }}
      >
        Start Game
      </a>
      <div
        className='border-gray-600 rounded-lg text-black bg-inherit focus:outline-none focus:border-gray-600'
        style={{ marginTop: '20px', fontSize: '18px' }}
      >
        Created By Sol
      </div>
    </div>
  );
}
