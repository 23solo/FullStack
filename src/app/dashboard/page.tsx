'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function dashboardPage() {
  const [userMove, setUserMove] = useState<number[][]>([]);
  const [grid, setGrid] = useState(Array<Array<Object>>);
  const [board, setBoard] = useState({});
  const [selectedCell, setSelectedCell] = useState<number[]>([]);
  const [userWhite, setUserWhite] = useState(Object);
  const [userBlack, setUserBlack] = useState(Object);
  const user1 = {
    name: 'Solo',
    color: 'W',
    canCastleLeft: true,
    canCastleRight: true,
    isKingInCheck: false,
    kingPosition: [7, 4],
    kingCheckedFrom: [-1, -1],
  };

  const user2 = {
    name: 'Polo',
    color: 'B',
    canCastleLeft: true,
    canCastleRight: true,
    isKingInCheck: false,
    kingPosition: [0, 4],
    kingCheckedFrom: [-1, -1],
  };

  const getUserWhite = () => {
    setUserWhite(user1);
  };

  const getUserBlack = () => {
    setUserWhite(user2);
  };

  const checkMove = () => {
    console.log(userMove);
  };
  const handleClick = (rowIndex: number, itemIndex: number) => {
    console.log('Box clicked at position:', grid[rowIndex][itemIndex]);
    let currMove = [rowIndex, itemIndex];
    setSelectedCell([rowIndex, itemIndex]);
    setUserMove((prevUserMove) => [...prevUserMove, currMove]);

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
    getBoard();
  }, []);

  useEffect(() => {
    if (userMove.length == 2) {
      console.log(userMove);
      updateBoard();
      setUserMove([]);
    }
  }, [userMove]);

  const getBoard = async () => {
    const res = await axios.get('http://localhost:3333/chess-init');
    console.log(res.data);
    setBoard(res.data);
    setGrid(res.data.grid);
  };

  const updateBoard = async () => {
    const data = {
      users: [user1, user2],
      userMove: userMove,
      board: board,
    };
    const res = await axios.post('http://localhost:3333/chess-init', data);
    console.log(res.data.grid);
    setBoard(res.data);
    setGrid(res.data.grid);
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <div>
        <button
          type='button'
          className='btn p-2 m-4 border border-gray-600 rounded-lg bg-slate-500 focus:outline-none focus:border-gray-600'
          onClick={getUserBlack}
        >
          SetUser
        </button>
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
                        className=' opacity-0.9'
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
        <button
          type='button'
          className='btn p-2 m-4 border border-gray-600 rounded-lg bg-slate-500 focus:outline-none focus:border-gray-600'
          onClick={getUserWhite}
        >
          SetUser
        </button>
      </div>
    </div>
  );
}
