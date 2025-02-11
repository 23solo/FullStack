'use client';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Messages from './Messages';
import MessageInput from './MessageInput';
import CreateRoom from './Room';
import JoinRoom from './JoinRoom';

const ChessmovesClient = () => {
  const [socket, setSocket] = useState<Socket>();
  const [message, setMessage] = useState('');
  const [roomId, setRoomId] = useState('');
  const [receivedMessages, setReceivedMessages] = useState<string[]>(['test']);

  useEffect(() => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND}`, {
      path: '/socket.io',
    }); // Replace with your server URL or IP address
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('events', (data) => {
        setReceivedMessages((prevMessages) => [...prevMessages, data]);
      });

      socket.on('message', (data) => {
        setReceivedMessages((prevMessages) => [...prevMessages, data]);
      });

      socket.on('error', (error) => {
        console.log('Error:', error);
      });

      // Listen for roomCreated event
      socket.on('roomCreated', (roomId) => {
        setRoomId(roomId);
        // Share the room ID with other clients for them to join the same room
      });
    }
  }, [socket]);

  const handleJoin = (val: string) => {
    setRoomId(val);
    if (socket) socket.emit('join', val);
  };

  const createRoom = () => {
    if (socket) socket.emit('join', 'createRoom');
  };

  const handleMessage = (value: string, roomId: string) => {
    if (socket) socket.emit('message', { roomId: roomId, msg: value });
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6'>
      {/* Room Join & Create Section */}
      <div className='w-full max-w-md bg-white shadow-lg rounded-lg p-6 text-center'>
        <h2 className='text-2xl font-bold text-gray-800 mb-4'>
          Join or Create a Room
        </h2>
        <div className='flex flex-col gap-4'>
          <JoinRoom joinRoom={handleJoin} />
          <CreateRoom createRoom={createRoom} />
        </div>
      </div>

      {/* Game ID Display */}
      {roomId && (
        <div className='mt-6 bg-orange-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md'>
          Game ID: <span className='font-bold'>{roomId}</span>
        </div>
      )}

      {/* Message Input & Chat Section */}
      <div className='w-full max-w-lg mt-6 p-4 bg-white shadow-md rounded-lg'>
        <h3 className='text-lg font-semibold text-gray-700 mb-3'>
          Chat with Opponent
        </h3>
        <MessageInput handleMessage={handleMessage} roomId={roomId} />
        <Messages messages={receivedMessages} />
      </div>
    </div>
  );
};

export default ChessmovesClient;
