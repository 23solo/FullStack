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
        console.log('Room Created:', roomId);
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
    console.log('Room id', roomId);

    if (socket) socket.emit('message', { roomId: roomId, msg: value });
  };

  return (
    <div>
      <JoinRoom joinRoom={handleJoin} />
      <CreateRoom createRoom={createRoom} />
      {roomId && (
        <div className='btn p-2 m-4 border border-gray-600 rounded-lg bg-orange-400 focus:outline-none focus:border-gray-600'>
          Game Id is {roomId}
        </div>
      )}
      <MessageInput handleMessage={handleMessage} roomId={roomId} />
      <Messages messages={receivedMessages} />
    </div>
  );
};

export default ChessmovesClient;
