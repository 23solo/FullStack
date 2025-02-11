import { useState } from 'react';
type RoomInputProps = {
  joinRoom: (value: string) => void;
};
export default function JoinRoom(props: RoomInputProps) {
  const [value, setValue] = useState('');

  return (
    <div className='flex flex-col items-center'>
      <h6 className='text-lg font-bold mb-4 text-gray-800'>Have Game Id?</h6>
      <input
        type='tel'
        className='text-black border border-gray-300 rounded-lg p-2 w-64 mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
        value={value}
        placeholder='Enter Game Id Here...'
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setValue('');
            props.joinRoom(value);
          }
        }}
      />
      <button
        className={`btn p-2 m-2 border border-gray-600 rounded-lg bg-blue-600 text-white transition duration-200 ease-in-out transform hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
        type='button'
        onClick={() => props.joinRoom(value)}
        disabled={!value} // Disable the button when value doesn't exist
        style={{
          padding: '10px 20px',
          cursor: value ? 'pointer' : 'not-allowed', // Set cursor to not-allowed when disabled
        }}
      >
        Join
      </button>
    </div>
  );
}
