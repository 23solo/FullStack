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
    <div
      className={`flex flex-col items-center justify-center h-screen w-full py-6 px-4 overflow-hidden ${
        oppUser ? 'container' : ''
      }`}
    >
      {/* Error Message */}
      {error && (
        <span className='text-red-600 font-semibold mb-4'>{error}</span>
      )}

      {/* Sidebar Section */}
      <div
        className={`w-full max-w-4xl p-6 bg-white bg-opacity-90 shadow-xl rounded-lg ${
          oppUser ? 'sidebar' : ''
        }`}
      >
        {!roomId && (
          <div className='flex flex-col gap-4'>
            <JoinRoom joinRoom={handleJoin} />
            <CreateRoom createRoom={createRoom} />
          </div>
        )}

        {!oppUser && roomId && (
          <div className='flex flex-col items-center mt-4'>
            <div className='px-4 py-3 border border-gray-600 rounded-lg bg-orange-500 text-white font-semibold shadow-md'>
              Game ID: <span className='text-lg font-bold'>{roomId}</span>
            </div>
          </div>
        )}

        {oppUser && (
          <div className='mt-6 w-full max-w-md mx-auto bg-white rounded-lg shadow-lg'>
            <div className='p-4 h-96 overflow-auto'>
              <Messages messages={receivedMessages} />
            </div>
            <div className='p-4 border-t border-gray-300'>
              <MessageInput handleMessage={handleMessage} roomId={roomId} />
            </div>
          </div>
        )}
      </div>

      {/* Main Chessboard Section */}
      {board && (
        <div className='w-full max-w-4xl mt-6 flex flex-col items-center overflow-hidden'>
          {/* Game Status */}
          {gameStatus && (
            <div className='bg-slate-800 text-white text-center py-3 px-5 rounded-lg font-semibold shadow-lg'>
              You {gameStatus}
            </div>
          )}

          {/* Opponent Info */}
          {oppUser && (
            <div className='p-4 border border-gray-600 rounded-lg bg-gray-800 text-white flex flex-col items-center justify-center mt-4 shadow-md overflow-hidden'>
              <span className='text-lg font-bold text-center'>
                {oppUser.name}
              </span>
            </div>
          )}

          {/* Board Errors */}
          {boardError && (
            <span className='text-red-600 mt-2 text-center'>{boardError}</span>
          )}

          {/* Chessboard */}
          <div className='table-wrapper mt-6 p-4 bg-gray-900 rounded-lg shadow-lg w-full max-w-lg'>
            <table className='chessboard w-full border border-gray-700 rounded-lg overflow-hidden'>
              <tbody>
                {grid.map((row, rowIndex) => (
                  <tr key={rowIndex} className='chessboard-row'>
                    {row.map((item, itemIndex) => (
                      <td
                        key={itemIndex}
                        className={`relative aspect-square border ${
                          (rowIndex + itemIndex) % 2 === 0
                            ? 'bg-gray-300'
                            : 'bg-gray-700'
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
                        }`}
                        onClick={() => handleClick(rowIndex, itemIndex)}
                        style={{ cursor: 'pointer' }}
                      >
                        {Object.values(item).map((value, valueIndex) => {
                          if (value.name) {
                            return (
                              <img
                                key={valueIndex}
                                src={getImage(value)}
                                alt={value.name}
                                className='piece-image absolute inset-0 w-full h-full object-contain opacity-90'
                              />
                            );
                          }
                        })}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* User Info */}
          {user && (
            <div className='p-4 border border-gray-600 rounded-lg bg-gray-800 text-white flex flex-col items-center justify-center mt-6 shadow-lg'>
              <span className='text-lg font-bold text-center'>{user.name}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
