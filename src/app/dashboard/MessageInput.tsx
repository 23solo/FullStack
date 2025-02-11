import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
type MessageInputProps = {
  handleMessage: (value: string, roomId: string) => void;
  roomId: string;
};

export default function MessageInput(props: MessageInputProps) {
  const [value, setValue] = useState('');

  return (
    <div className='flex items-center p-4 bg-white rounded-lg shadow-lg border border-gray-300'>
      <input
        type='text'
        value={value}
        placeholder='Type your message...'
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && value.trim() !== '') {
            props.handleMessage(value.trim(), props.roomId);
            setValue('');
          }
        }}
        className='flex-grow border border-gray-300 rounded-lg p-3 shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200'
      />

      <button
        className='ml-2 p-2 bg-green-500 text-white rounded-full transition duration-200 ease-in-out transform hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'
        type='button'
        onClick={() => {
          if (value.trim() !== '') {
            props.handleMessage(value.trim(), props.roomId);
            setValue('');
          }
        }}
      >
        <FaPaperPlane size={20} />
      </button>
    </div>
  );
}
