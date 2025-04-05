import React from 'react';

type PawnPromotionModalProps = {
  onSelect: (piece: string) => void;
  pieceColor: 'W' | 'B';
};

const PawnPromotionModal: React.FC<PawnPromotionModalProps> = ({
  onSelect,
  pieceColor,
}) => {
  const pieces = ['Q', 'R', 'B', 'N'];

  const images: Record<string, string> = {
    Q: `/assets/pieces/${pieceColor.toLowerCase()}Q.svg`,
    R: `/assets/pieces/${pieceColor.toLowerCase()}R.svg`,
    B: `/assets/pieces/${pieceColor.toLowerCase()}B.svg`,
    N: `/assets/pieces/${pieceColor.toLowerCase()}N.svg`,
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg'>
        <h2 className='text-lg font-semibold mb-4 text-center'>
          Promote Your Pawn
        </h2>
        <div className='flex justify-center gap-4'>
          {pieces.map((piece) => (
            <button
              key={piece}
              onClick={() => onSelect(piece)}
              className='p-2 hover:opacity-80'
            >
              <img src={images[piece]} alt={piece} className='w-16 h-16' />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PawnPromotionModal;
