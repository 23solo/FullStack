import { useState } from 'react';
type RoomInputProps = {
  joinRoom: (value: string) => void;
};
export default function JoinRoom(props: RoomInputProps) {
  const [value, setValue] = useState('');

  return (
    <>
      <input
        type='tel'
        value={value}
        placeholder='Enter Room Id'
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        className='btn p-2 m-4 border border-gray-600 rounded-lg bg-slate-500 focus:outline-none focus:border-gray-600'
        type='button'
        onClick={() => props.joinRoom(value)}
      >
        Join
      </button>
    </>
  );
}
