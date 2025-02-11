import { useEffect, useRef } from 'react';

export default function Messages({ messages }: { messages: string[] }) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className='w-full h-96 overflow-auto p-4 bg-white border border-gray-300 rounded-lg shadow-md'
      ref={divRef}
    >
      {messages.map((message, index) => (
        <div key={index} className='mb-2'>
          <div className='bg-blue-100 text-blue-800 p-2 rounded-lg shadow-sm'>
            {message}
          </div>
        </div>
      ))}
    </div>
  );
}
