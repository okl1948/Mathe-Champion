
import React from 'react';
import { STICKER_ICONS } from '../types';

interface StickerAlbumProps {
  stickers: number[];
  totalStickers: number;
  onBack: () => void;
}

const CloudSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
     <path d="M18.5,5.5c-2.4,0-4.4,1.6-5.2,3.8c-0.6-0.2-1.2-0.3-1.8-0.3c-3,0-5.5,2.5-5.5,5.5s2.5,5.5,5.5,5.5h7c3.6,0,6.5-2.9,6.5-6.5S22.1,5.5,18.5,5.5z"/>
  </svg>
);

const StickerAlbum: React.FC<StickerAlbumProps> = ({ stickers, totalStickers, onBack }) => {
  const isComplete = stickers.length >= totalStickers;

  return (
    <div className={`min-h-[60vh] p-8 rounded-2xl shadow-xl text-center transition-all duration-1000 relative overflow-hidden ${
      isComplete 
        ? 'bg-gradient-to-b from-sky-400 via-sky-300 to-blue-200 text-white' 
        : 'bg-white text-slate-700'
    }`}>
      {isComplete && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <CloudSVG className="absolute top-4 right-4 w-24 h-24 text-white opacity-40 animate-[pulse_4s_ease-in-out_infinite]" />
            <CloudSVG className="absolute top-16 -left-6 w-32 h-32 text-white opacity-30 animate-[pulse_5s_ease-in-out_infinite_1s]" />
            <CloudSVG className="absolute bottom-12 right-12 w-20 h-20 text-white opacity-20 animate-[pulse_3s_ease-in-out_infinite_0.5s]" />
            <CloudSVG className="absolute bottom-4 left-4 w-16 h-16 text-white opacity-25 animate-[pulse_6s_ease-in-out_infinite_2s]" />
        </div>
      )}

      <header className="flex items-center justify-between mb-8 pb-4 border-b border-white/20 relative z-10">
        <button 
          onClick={onBack} 
          className={`font-bold text-lg flex items-center px-3 py-2 rounded-lg transition-colors ${
            isComplete 
                ? 'bg-white/20 hover:bg-white/30 text-white' 
                : 'bg-slate-100 hover:bg-slate-200 text-blue-500'
          }`}
        >
          <span>&larr;</span>
          <span className="ml-1 hidden sm:inline">Zurück</span>
        </button>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex-1 text-center mx-2 leading-tight drop-shadow-sm">
          {isComplete ? 'Bravo!' : 'Dein Album'}
        </h2>
        <div className="w-10"></div>
      </header>

      {isComplete && (
        <div className="mb-8 animate-bounce text-xl font-bold drop-shadow-md relative z-10">
            Glückwunsch! Du hast alle Sticker gesammelt!
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-md mx-auto relative z-10">
        {STICKER_ICONS.map((icon, index) => {
          const isUnlocked = stickers.includes(index);
          return (
            <div 
              key={index} 
              className={`
                aspect-square flex items-center justify-center text-6xl rounded-2xl border-4 shadow-sm transition-all duration-500
                ${isUnlocked 
                  ? 'bg-white border-yellow-400 scale-100 rotate-0' 
                  : 'bg-slate-100 border-slate-200 scale-95 grayscale opacity-30'
                }
                ${isComplete && isUnlocked ? 'animate-[wiggle_1s_ease-in-out_infinite] shadow-2xl border-white' : ''}
              `}
            >
              {isUnlocked ? icon : '?'}
            </div>
          );
        })}
      </div>

      <div className="mt-10 text-lg font-bold opacity-80 relative z-10">
        {stickers.length} / {totalStickers} Sticker gesammelt
      </div>
      
      <style>{`
        @keyframes wiggle {
            0%, 100% { transform: rotate(-3deg); }
            50% { transform: rotate(3deg); }
        }
      `}</style>
    </div>
  );
};

export default StickerAlbum;
