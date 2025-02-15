'use client';

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
export type Cell = {
  color: string;
  position?: [number, number];
  piece?: any;
};
export default function DashboardPage() {
  const [userMove, setUserMove] = useState<number[][]>([]);
  const [grid, setGrid] = useState(Array<Array<Cell>>);
  const [board, setBoard] = useState();
  const [selectedCellYellow, setSelectedCellYellow] = useState<number[]>([]);
  const [selectedCellGreen, setSelectedCellGreen] = useState<number[]>([]);
  const [selectedOppBlue, setSelectedOppBlue] = useState<number[]>([]);
  const [checkKingRed, setCheckKingRed] = useState<number[]>([]);
  const [user, setUser] = useState<User>();
  const [oppUser, setOppUser] = useState<User>();
  const [socket, setSocket] = useState<Socket>();
  const [boardError, setBoardError] = useState('');
  const [error, setError] = useState('');
  const [roomId, setRoomId] = useState('');
  const [gameStatus, setGameStatus] = useState('');
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const newSocket = io(`${process.env.API_URL}`, {
      path: '/socket.io',
    }); // Replace with your server URL or IP address
    setSocket(newSocket);
    if (typeof window !== 'undefined') {
      // Access the localStorage
      const name = localStorage.getItem('userName');
      if (name) {
        setUserName(name);
      }
    }
    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('chessMove', (board) => {
        setCheckKingRed([]);
        setBoard(board);
        setGrid(board.grid);
        // setCheckKingRed([]);
      });

      socket.on('gameStatus', (data) => {
        setGameStatus(' ' + data);
      });

      socket.on('user', (data) => {
        setUser(data.user);
        setOppUser(data.oppUser);
      });

      socket.on('oppUserMove', (data) => {
        setSelectedCellGreen([data[0], data[1]]);
      });

      socket.on('kingCheck', (data) => {
        setCheckKingRed([data[0], data[1]]);
      });

      socket.on('error', (msg) => {
        setError(msg);
      });

      socket.on('message', (data) => {
        setReceivedMessages((prevMessages) => [...prevMessages, data]);
      });

      socket.on('board_error', (board_error) => {
        setBoardError(board_error);
      });

      socket.on('chessinit', (data) => {
        setBoard(data.board);
        setGrid(data.board.grid);
      });

      // Listen for roomCreated event
      socket.on('roomCreated', (roomId) => {
        setError('');
        setRoomId(roomId);
        // Share the room ID with other clients for them to join the same room
      });
    }
  }, [socket]);

  const handleJoin = (val: string) => {
    if (socket) socket.emit('join', { roomId: val.trim(), name: userName });
  };

  const createRoom = () => {
    if (socket) {
      let color: string;
      let x: number = Math.round(Math.random() * 1 + 1);
      if (x == 1) color = 'B';
      else color = 'W';
      socket.emit('create', { color: color, name: userName });
    }
  };

  //setBoard(res.data);
  const handleMessage = (value: string, roomId: string) => {
    if (socket)
      socket.emit('message', { user: userName, roomId: roomId, msg: value });
  };

  const handleClick = (rowIndex: number, itemIndex: number) => {
    if (gameStatus == '') {
      let currMove = [rowIndex, itemIndex];
      if (
        grid[rowIndex][itemIndex]?.piece?.color == user?.color &&
        !userMove[0]
      ) {
        setSelectedCellYellow([rowIndex, itemIndex]);
        setSelectedCellGreen([]);
        setSelectedOppBlue([]);
        setUserMove((prevUserMove) => [...prevUserMove, currMove]);
      } else if (
        userMove[0] &&
        grid[rowIndex][itemIndex]?.piece?.color == user?.color
      ) {
        setUserMove([currMove]);
        setSelectedCellYellow([rowIndex, itemIndex]);
      } else if (userMove[0]) {
        setSelectedCellGreen([rowIndex, itemIndex]);
        setSelectedCellYellow([]);
        setUserMove((prevUserMove) => [...prevUserMove, currMove]);
      }
      setBoardError('');
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
      setBoardError('');
    }
  }, [userMove]);

  const updateBoard = () => {
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
    <div className='flex h-screen w-full backdrop-blur-lg pt-[5vh]'>
      {/* Sidebar */}
      <div className='w-64 text-white p-6 flex flex-col items-center shadow-lg h-full fixed left-0 top-0 bg-gray-900'>
        {error && (
          <span className='text-red-500 font-semibold mb-4'>{error}</span>
        )}
        {!roomId && (
          <div className='flex flex-col gap-4'>
            <JoinRoom joinRoom={handleJoin} />
            <CreateRoom createRoom={createRoom} />
          </div>
        )}
        {roomId && !oppUser && (
          <div className='mt-4 bg-orange-500 text-white p-3 rounded-lg shadow-md text-center'>
            Game ID: <span className='font-bold'>{roomId}</span>
          </div>
        )}

        <div className='mt-auto text-center text-sm text-gray-400'>
          Chess Game - Abhishek
        </div>
      </div>

      {/* Main Chessboard Section */}
      <div className='flex flex-row items-start justify-center w-full ml-64 p-4'>
        <div className='flex flex-col items-center w-full max-w-3xl'>
          {gameStatus && (
            <div className='bg-slate-800 text-white text-center py-3 px-5 rounded-lg font-semibold shadow-lg mb-4'>
              You {gameStatus}
            </div>
          )}

          {/* Opponent Info */}
          {oppUser && (
            <div className='flex justify-between items-center w-full max-w-2xl mb-2 px-4 py-2 bg-gray-800 text-white rounded-lg shadow-lg'>
              <span className='font-bold'>
                {oppUser.name} ({oppUser.rating || 1500})
              </span>
              <span className='bg-gray-700 px-3 py-1 rounded-lg text-sm'>
                {oppUser.timeLeft}
              </span>
            </div>
          )}

          {/* Chessboard */}
          {board && (
            <div className='relative p-4 rounded-lg shadow-lg w-full max-w-2xl border-4 border-gray-600 bg-[#8B5A2B] backdrop-blur-lg'>
              <table className='chessboard w-full border border-gray-700 rounded-lg overflow-hidden'>
                <tbody>
                  {grid.map((row, rowIndex) => (
                    <tr key={rowIndex} className='chessboard-row'>
                      {row.map((item, itemIndex) => (
                        <td
                          key={itemIndex}
                          className={`relative aspect-square border ${
                            (rowIndex + itemIndex) % 2 === 0
                              ? 'bg-gray-100'
                              : 'bg-brown-500'
                          } ${
                            selectedCellYellow[0] === rowIndex &&
                            selectedCellYellow[1] === itemIndex
                              ? 'bg-yellow-400'
                              : ''
                          } ${
                            selectedCellGreen[0] === rowIndex &&
                            selectedCellGreen[1] === itemIndex
                              ? 'bg-green-500'
                              : ''
                          } ${
                            checkKingRed[0] === rowIndex &&
                            checkKingRed[1] === itemIndex
                              ? 'bg-red-500'
                              : ''
                          } ${
                            selectedOppBlue[0] === rowIndex &&
                            selectedOppBlue[1] === itemIndex
                              ? 'bg-blue-500'
                              : ''
                          } hover:opacity-80 transition-all cursor-pointer`}
                          onClick={() => handleClick(rowIndex, itemIndex)}
                        >
                          {Object.values(item).map((value, valueIndex) =>
                            value.name ? (
                              <img
                                key={valueIndex}
                                src={getImage(value)}
                                alt={value.name}
                                className='absolute inset-0 w-full h-full object-contain opacity-90'
                              />
                            ) : null
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {boardError && (
            <span className='text-red-600 mt-2 text-center'>{boardError}</span>
          )}

          {/* User Info */}
          {user && (
            <div className='flex justify-between items-center w-full max-w-2xl mt-2 px-4 py-2 bg-gray-800 text-white rounded-lg shadow-lg'>
              <span className='font-bold'>
                {user.name} ({oppUser.rating || 1500})
              </span>
              <span className='bg-gray-700 px-3 py-1 rounded-lg text-sm'>
                {user.timeLeft || '2:00'}
              </span>
            </div>
          )}
        </div>

        {/* Chat Section (Right-aligned) */}
        {oppUser && (
          <div className='w-80 bg-gray-900 text-white p-4 rounded-lg shadow-lg ml-4'>
            <div className='h-64 overflow-auto p-4 rounded-lg shadow-md'>
              <Messages messages={receivedMessages} />
            </div>
            <div className='p-4 border-t border-gray-700'>
              <MessageInput handleMessage={handleMessage} roomId={roomId} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
