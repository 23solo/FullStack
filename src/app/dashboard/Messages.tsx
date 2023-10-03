import { useEffect, useRef } from 'react';

export default function Messages({ messages }: { messages: string[] }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <textarea
      style={{
        width: '100%',
        height: '400px',
        overflow: 'auto',
        fontFamily: 'Arial',
        fontSize: '14px',
        lineHeight: '1.5',
        padding: '5px',
        borderRadius: '5px',
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
        border: '1px solid #ccc',
        backgroundColor: 'beige',
      }}
      readOnly={true}
      ref={textareaRef}
      defaultValue={messages
        .map((message, index) => {
          return `${message}\n`;
        })
        .join('')}
    ></textarea>
  );
}
