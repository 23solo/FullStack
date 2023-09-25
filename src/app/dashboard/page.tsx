'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Messages from './Messages';
import MessageInput from './MessageInput';
import CreateRoom from './Room';
import JoinRoom from './JoinRoom';

type User = {
  name: string;
  color: 'W' | 'B';
  canCastleLeft: boolean;
  canCastleRight: boolean;
  isKingInCheck: boolean;
  kingCheckedFrom: [number, number];
  kingPosition: [number, number];
};
export default function dashboardPage() {
  const [userMove, setUserMove] = useState<number[][]>([]);
  const [grid, setGrid] = useState(Array<Array<Object>>);
  const [board, setBoard] = useState({});
  const [selectedCell, setSelectedCell] = useState<number[]>([]);
  const [user, setUser] = useState<User>();
  const [oppUser, setOppUser] = useState<User>();
  const [socket, setSocket] = useState<Socket>();
  const [error, setError] = useState('');
  const [roomId, setRoomId] = useState('');
  const [gameStatus, setGameStatus] = useState('');
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);

  useEffect(() => {
    const newSocket = io('http://localhost:8001'); // Replace with your server URL or IP address
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('chessMove', (board) => {
        setBoard(board);
        setGrid(board.grid);
      });

      socket.on('events', (data) => {
        setReceivedMessages((prevMessages) => [...prevMessages, data.msg]);
      });

      socket.on('gameStatus', (data) => {
        setGameStatus(' ' + data);
      });

      socket.on('user', (data) => {
        console.log(data);
        setUser(data.user);
        setOppUser(data.oppUser);
      });

      socket.on('message', (data) => {
        setReceivedMessages((prevMessages) => [...prevMessages, data]);
      });

      socket.on('error', (error) => {
        setError(error);
        console.log('Error:', error);
      });

      socket.on('chessinit', (data) => {
        setBoard(data.board);
        setGrid(data.board.grid);
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
    if (socket) socket.emit('join', { roomId: val });
  };

  const createRoom = () => {
    if (socket) {
      let color: string;
      let x: number = Math.round(Math.random() * 1 + 1);
      if (x == 1) color = 'B';
      else color = 'W';
      socket.emit('join', { color: color });
    }
  };

  //setBoard(res.data);
  const handleMessage = (value: string, roomId: string) => {
    if (socket) socket.emit('message', { roomId: roomId, msg: value });
  };

  const handleClick = (rowIndex: number, itemIndex: number) => {
    if (gameStatus == '') {
      let currMove = [rowIndex, itemIndex];
      setSelectedCell([rowIndex, itemIndex]);
      setUserMove((prevUserMove) => [...prevUserMove, currMove]);
    }
    // Add your code to perform any desired actions based on the click event
  };

  const getImage = (obj: {
    color: string;
    symbol: string;
    name: string;
    position: [];
  }) => {
    if (obj.name) {
      if (obj.name == 'Knight') {
        return `assets/pieces/${obj.color.toLowerCase()}N.svg`;
      }
      return `assets/pieces/${obj.color.toLowerCase()}${obj.name[0]}.svg`;
      // src / assets / pieces / bB.svg;
    }
  };

  useEffect(() => {
    if (userMove.length == 2) {
      updateBoard();
      setUserMove([]);
    }
  }, [userMove]);

  const updateBoard = async () => {
    const data = {
      user: user,
      userMove: userMove,
      board: board,
      roomId: roomId,
    };
    if (socket) {
      socket.emit('chessMove', data);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <div>
        {!roomId && (
          <div>
            <JoinRoom joinRoom={handleJoin} />
            <CreateRoom createRoom={createRoom} />
          </div>
        )}
        {roomId && (
          <div>
            <div className='btn p-2 m-4 border border-gray-600 rounded-lg bg-orange-400 focus:outline-none focus:border-gray-600'>
              Room Id is {roomId}
            </div>
            <div>
              <MessageInput handleMessage={handleMessage} roomId={roomId} />
              <Messages messages={receivedMessages} />
            </div>
          </div>
        )}
      </div>
      {error && <span>{error}</span>}
      <div>
        {oppUser && (
          <button
            type='button'
            className='btn p-2 m-4 border border-gray-600 rounded-lg bg-white focus:outline-none focus:border-gray-600'
          >
            {oppUser.name}
            {gameStatus}
          </button>
        )}
      </div>
      <div>
        <table className='chessboard'>
          <tbody>
            {grid.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((item, itemIndex) => (
                  <td
                    key={itemIndex}
                    className={`${
                      (rowIndex + itemIndex) % 2 === 0
                        ? 'white-cell'
                        : 'black-cell'
                    } ${
                      selectedCell[0] === rowIndex &&
                      selectedCell[1] === itemIndex
                        ? 'highlighted-cell'
                        : ''
                    }`}
                    onClick={() => handleClick(rowIndex, itemIndex)}
                  >
                    {/* Display the values */}
                    {Object.values(item).map((value, valueIndex) => (
                      <img
                        key={valueIndex}
                        src={getImage(value)}
                        alt={value.name}
                        className='opacity-0.9'
                      />
                    ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        {user && (
          <button
            type='button'
            className='btn p-2 m-4 border border-gray-600 rounded-lg bg-white focus:outline-none focus:border-gray-600'
          >
            {user.name}
            {gameStatus}
          </button>
        )}
      </div>
    </div>
  );
}
