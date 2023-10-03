import { useState } from 'react';

export default function CreateRoom({
  createRoom,
}: {
  createRoom: (value: string) => void;
}) {
  const [value, setValue] = useState('');

  return (
    <>
      <button
        className='btn p-2 m-4 border border-gray-600 rounded-lg bg-green-500 focus:outline-none focus:border-gray-600'
        type='button'
        onClick={() => createRoom(value)}
      >
        Create Game
      </button>
    </>
  );
}
