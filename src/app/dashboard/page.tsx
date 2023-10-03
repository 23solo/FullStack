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
export default function dashboardPage() {
  const [userMove, setUserMove] = useState<number[][]>([]);
  const [grid, setGrid] = useState(Array<Array<Cell>>);
  const [board, setBoard] = useState();
  const [selectedCellYellow, setSelectedCellYellow] = useState<number[]>([]);
  const [selectedCellGreen, setSelectedCellGreen] = useState<number[]>([]);
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
        setBoard(board);
        setGrid(board.grid);
      });

      socket.on('gameStatus', (data) => {
        setGameStatus(' ' + data);
      });

      socket.on('user', (data) => {
        setUser(data.user);
        setOppUser(data.oppUser);
      });

      socket.on('error', (msg) => {
        setError(msg);
      });

      socket.on('message', (data) => {
        console.log('Message is', data);

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
      className={`flex flex-col items-center justify-center min-h-screen py-2 ${
        oppUser ? 'container' : ''
      }`}
    >
      {error && <span className='error'>{error}</span>}

      <div className={` ${oppUser ? 'sidebar' : ''}`}>
        {!roomId && (
          <div>
            <JoinRoom joinRoom={handleJoin} />
            <CreateRoom createRoom={createRoom} />
          </div>
        )}
        {!oppUser && roomId && (
          <div>
            <div className='btn p-2 m-4  border border-gray-600 rounded-lg bg-orange-400 focus:outline-none focus:border-gray-600'>
              Game Id <span className='text-lg font-bold'> {roomId}</span>
            </div>
          </div>
        )}
        {oppUser && (
          <div>
            <MessageInput handleMessage={handleMessage} roomId={roomId} />
            <Messages messages={receivedMessages} />
          </div>
        )}
      </div>

      {board && (
        <div className={`main-content ${oppUser ? 'board-present' : ''}`}>
          {gameStatus && (
            <span className='text-lg font-bold bg-slate-200 text-slate-900 text-center items-center justify-center'>
              You {gameStatus}
            </span>
          )}
          {oppUser && (
            <div className='container p-4 border border-gray-600 rounded-lg bg-white flex flex-col items-center justify-center'>
              <span className='text-lg font-bold text-center'>
                {oppUser.name}
              </span>
            </div>
          )}
          {boardError && <span className='error'>{boardError}</span>}
          <div className='table-wrapper'>
            <table className='chessboard'>
              <tbody>
                {grid.map((row, rowIndex) => (
                  <tr key={rowIndex} className='chessboard-row'>
                    {row.map((item, itemIndex) => (
                      <td
                        key={itemIndex}
                        className={`${
                          (rowIndex + itemIndex) % 2 === 0
                            ? 'white-cell'
                            : 'black-cell'
                        } ${
                          selectedCellYellow[0] === rowIndex &&
                          selectedCellYellow[1] === itemIndex
                            ? 'highlighted-cell-yellow'
                            : ''
                        } ${
                          selectedCellGreen[0] === rowIndex &&
                          selectedCellGreen[1] === itemIndex
                            ? 'highlighted-cell-green'
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
                                className='piece-image opacity-0.9'
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
          {user && (
            <div className='container p-4 border border-gray-600 rounded-lg bg-white flex flex-col items-center justify-center'>
              <span className='text-lg font-bold text-center'>{user.name}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
