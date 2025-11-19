
import React from 'react';
import { STICKER_ICONS } from '../../types';

interface LevelCompletionModalProps {
  stickerIndex: number | null;
  onClose: () => void;
}

const LevelCompletionModal: React.FC<LevelCompletionModalProps> = ({ stickerIndex, onClose }) => {
  return (
    <div 
      className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-60 backdrop-blur-sm p-4 transition-opacity duration-300" 
      onClick={onClose}
    >
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-xs sm:max-w-sm w-full text-center transform transition-all scale-100 hover:scale-105 cursor-pointer border-4 border-white ring-4 ring-opacity-50 ring-indigo-300">
        {stickerIndex !== null ? (
          <>
            <h3 className="text-2xl font-black text-indigo-600 mb-4 uppercase tracking-wide">Neuer Sticker!</h3>
            <div className="text-8xl mb-6 animate-bounce filter drop-shadow-xl select-none">
              {STICKER_ICONS[stickerIndex]}
            </div>
            <p className="text-slate-600 font-bold text-lg">Klasse gemacht!</p>
          </>
        ) : (
          <>
            <h3 className="text-3xl font-black text-green-500 mb-6 uppercase tracking-wide">Super!</h3>
            <div className="text-7xl mb-6 animate-pulse select-none">🎉</div>
            <p className="text-slate-600 font-bold text-lg">Runde geschafft!</p>
          </>
        )}
        <div className="mt-8 text-xs text-slate-400 uppercase tracking-widest font-extrabold bg-slate-100 py-2 rounded-full">
          Tippe zum Fortfahren
        </div>
      </div>
    </div>
  );
};

export default LevelCompletionModal;
