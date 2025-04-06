'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Messages from './Messages';
import MessageInput from './MessageInput';
import CreateRoom from './Room';
import JoinRoom from './JoinRoom';
import PawnPromotionModal from './PawnPromotionalModel';
import AuthenticatedLayout from '@/components/AuthenticatedLayout';

type User = {
  name: string;
  color: 'W' | 'B';
  canCastleLeft: boolean;
  canCastleRight: boolean;
  isKingInCheck: boolean;
  kingCheckedFrom: [number, number];
  kingPosition: [number, number];
  rating: number;
  timeLeft: number;
};
export type Cell = {
  color: string;
  position?: [number, number];
  piece?: any;
};
export type Move = {
  currentI: number;
  currentJ: number;
  toI: number;
  toJ: number;
};

export default function DashboardPage() {
  const [userMove, setUserMove] = useState<number[][]>([]);
  const [grid, setGrid] = useState(Array<Array<Cell>>);
  const [board, setBoard] = useState();
  const [currentTurn, setCurrentTurn] = useState('W');
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
  const [gameStatus, setGameStatus] = useState<{
    status: 'won' | 'lost' | null;
    winner?: string;
    loser?: string;
  } | null>(null);
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  const [userName, setUserName] = useState('');
  const [promotionMove, setPromotionMove] = useState<{
    move: Move;
    user: User;
  } | null>(null);

  useEffect(() => {
    const newSocket = io(`${process.env.API_URL}`, {
      path: '/socket.io',
      transports: ['websocket'],
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
        setCurrentTurn((prev) => (prev === 'W' ? 'B' : 'W'));
        // setCheckKingRed([]);
      });

      socket.on('gameStatus', (data) => {
        setGameStatus(data);
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

      socket.on('updateTime', (data) => {
        // Update user
        setUser((prevUser) => {
          if (!prevUser) return prevUser; // Ensure user is defined
          return {
            ...prevUser,
            timeLeft: prevUser.color === 'W' ? data.whiteTime : data.blackTime,
          };
        });

        // Update opponent user
        setOppUser((prevOppUser) => {
          if (!prevOppUser) return prevOppUser; // Ensure opponent user is defined
          return {
            ...prevOppUser,
            timeLeft:
              prevOppUser.color === 'W' ? data.whiteTime : data.blackTime,
          };
        });
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
    if (!gameStatus) {
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

  const formatTime = (timeLeft: number) => {
    const totalSeconds = Math.floor(timeLeft / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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

  // ⏳ Auto-decreasing timer
  useEffect(() => {
    if (gameStatus) return;
    const interval = setInterval(() => {
      setUser((prevUser) => {
        if (!prevUser || prevUser.timeLeft <= 0) return prevUser;
        if (prevUser.color === currentTurn) {
          return { ...prevUser, timeLeft: prevUser.timeLeft - 1000 };
        }
        return prevUser;
      });

      setOppUser((prevOppUser) => {
        if (!prevOppUser || prevOppUser.timeLeft <= 0) return prevOppUser;
        if (prevOppUser.color === currentTurn) {
          return { ...prevOppUser, timeLeft: prevOppUser.timeLeft - 1000 };
        }
        return prevOppUser;
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [currentTurn, gameStatus]);

  useEffect(() => {
    if (userMove.length === 2) {
      pawnPromoteCheck(); // Check if promotion is needed
    }
  }, [userMove]);

  const pawnPromoteCheck = () => {
    if (!user) return;
    const [fromRow, fromCol] = userMove[0];
    const [toRow, toCol] = userMove[1];

    // if (board) console.log(grid[fromRow][fromCol].piece.name);

    if (
      grid[fromRow][fromCol].piece.name === 'Pawn' &&
      ((user.color === 'W' && toRow === 0) ||
        (user.color === 'B' && toRow === 0))
    ) {
      // Wait for user to select promotion piece
      setPromotionMove({
        move: {
          currentI: fromRow,
          currentJ: fromCol,
          toI: toRow,
          toJ: toCol,
        },
        user,
      });
    } else {
      // No promotion needed, update board immediately
      updateBoard();
    }
  };

  const handlePawnPromotion = (piece: string) => {
    if (promotionMove) {
      setPromotionMove(null);
      updateBoard(piece);
    }
  };

  const updateBoard = (promotion: any = false) => {
    const data = {
      user: user,
      userMove: userMove,
      board: board,
      roomId: roomId,
      promotionPiece: promotion,
    };

    if (socket) {
      socket.emit('chessMove', data);
    }
  };

  return (
    <AuthenticatedLayout requireAuth>
      <div className='flex h-screen w-full backdrop-blur-lg pt-[5vh] relative'>
        {/* Sidebar */}
        <div className='w-64 text-white p-6 flex flex-col items-center justify-center shadow-lg h-full fixed left-0 top-0 bg-gray-900'>
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
            <div className='bg-yellow-400 text-white p-4 rounded-lg shadow-lg text-center text-lg font-extrabold border-2 border-white'>
              Game ID: <span className='underline'>{roomId}</span>
            </div>
          )}

          <div className='text-center text-sm text-gray-400 mt-4'>
            Chess Game - Abhishek
          </div>
        </div>

        {/* Main Chessboard Section */}
        <div className='flex flex-row items-start justify-center w-full ml-64 p-4 relative'>
          <div className='flex flex-col items-center w-full max-w-3xl relative'>
            {gameStatus && (
              <div className='absolute inset-0 flex items-center justify-center z-10 bg-black bg-opacity-50'>
                <div className='bg-slate-800 text-white text-center py-8 px-10 rounded-lg font-semibold shadow-lg text-2xl'>
                  <h2 className='text-3xl font-bold mb-4'>
                    {gameStatus.status === 'won' ? '🎉 Victory!' : '😞 Defeat'}
                  </h2>
                  <p className='text-lg'>
                    {gameStatus.status === 'won'
                      ? `Congratulations, ${gameStatus.winner}!`
                      : `Sorry, ${gameStatus.loser} you ran out of time.`}
                  </p>
                  <button
                    onClick={() => setGameStatus(null)}
                    className='mt-6 px-5 py-2 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all'
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Opponent Info */}
            {oppUser && (
              <div className='flex justify-between items-center w-full max-w-2xl mb-2 px-4 py-2 bg-gray-800 text-white rounded-lg shadow-lg'>
                <span className='font-bold'>
                  {oppUser.name} ({oppUser.rating || 1500})
                </span>
                <span className='bg-gray-700 px-3 py-1 rounded-lg text-sm'>
                  {formatTime(oppUser.timeLeft)}
                </span>
              </div>
            )}

            {/* Chessboard */}
            {board && (
              <div
                className={`relative p-4 rounded-lg shadow-lg w-full max-w-2xl border-4 border-gray-600 bg-[#858585] backdrop-blur-lg ${
                  gameStatus ? 'blur-sm' : ''
                }`}
              >
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
            <div>
              {promotionMove && (
                <PawnPromotionModal
                  onSelect={handlePawnPromotion}
                  pieceColor={promotionMove.user.color}
                />
              )}
            </div>

            {boardError && (
              <span className='text-red-600 mt-2 text-center'>
                {boardError}
              </span>
            )}

            {/* User Info */}
            {user && (
              <div className='flex justify-between items-center w-full max-w-2xl mt-2 px-4 py-2 bg-gray-800 text-white rounded-lg shadow-lg'>
                <span className='font-bold'>
                  {user.name} ({oppUser?.rating || 1500})
                </span>
                <span className='bg-gray-700 px-3 py-1 rounded-lg text-sm'>
                  {formatTime(user.timeLeft)}
                </span>
              </div>
            )}
          </div>
        </div>
        {/* Chat Section (Right-aligned) */}
        {oppUser && (
          <div className='w-80 text-white p-6 flex flex-col items-center justify-center shadow-lg h-full right-0 top-0 bg-gray-900'>
            <div className='overflow-auto p-4 rounded-lg shadow-md w-full'>
              <Messages messages={receivedMessages} />
            </div>
            <div className='p-4 border-t border-gray-700 w-full'>
              <MessageInput handleMessage={handleMessage} roomId={roomId} />
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
