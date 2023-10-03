import { useState } from 'react';
type RoomInputProps = {
  joinRoom: (value: string) => void;
};
export default function JoinRoom(props: RoomInputProps) {
  const [value, setValue] = useState('');

  return (
    <div>
      <h6 style={{ fontWeight: 'bold', fontSize: '18px' }}>Have Game Id?</h6>
      <input
        type='tel'
        value={value}
        placeholder='Enter Game Id Here...'
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key == 'Enter') {
            setValue('');
            props.joinRoom(value);
          }
        }}
        style={{
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          width: '200px',
          marginBottom: '10px',
        }}
      />
      <button
        className='btn p-2 m-4 border border-gray-600 rounded-lg bg-slate-500 focus:outline-none focus:border-gray-600'
        type='button'
        onClick={() => props.joinRoom(value)}
        disabled={!value} // Disable the button when value doesn't exist
        style={{
          padding: '8px 16px',
          color: '#fff',
          background: '#2D3748',
          border: 'none',
          borderRadius: '4px',
          pointerEvents: value ? 'auto' : 'none', // Set pointer-events to none when disabled
          cursor: value ? 'pointer' : 'default', // Set cursor to default when disabled
        }}
      >
        Join
      </button>
    </div>
  );
}
