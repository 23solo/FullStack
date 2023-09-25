import { useState } from 'react';

type MessageInputProps = {
  handleMessage: (value: string, roomId: string) => void;
  roomId: string;
};

export default function MessageInput(props: MessageInputProps) {
  const [value, setValue] = useState('');

  return (
    <>
      <input
        type='tel'
        value={value}
        placeholder='Type Your message....'
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        className='btn p-2 m-4 border border-gray-600 rounded-lg bg-slate-500 focus:outline-none focus:border-gray-600'
        type='button'
        onClick={() => props.handleMessage(value, props.roomId)}
      >
        Send
      </button>
    </>
  );
}
