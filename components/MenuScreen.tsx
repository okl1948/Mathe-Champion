
import React from 'react';
import { GameMode, Difficulty } from '../types';

interface MenuScreenProps {
  onSelectGame: (mode: GameMode) => void;
  difficulty: Difficulty;
  setDifficulty: (diff: Difficulty) => void;
  stickersCount: number;
  totalStickers: number;
}

const MenuButton: React.FC<{ onClick: () => void; color: string; children: React.ReactNode; subtext?: string }> = ({ onClick, color, children, subtext }) => (
    <button
        onClick={onClick}
        className={`w-full text-white font-bold py-5 px-4 rounded-xl text-2xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-opacity-50 ${color} relative overflow-hidden`}
    >
        <div className="relative z-10">{children}</div>
        {subtext && <div className="text-sm opacity-80 font-normal mt-1 relative z-10">{subtext}</div>}
    </button>
);

const DifficultyStar: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center transition-all transform ${active ? 'scale-110 opacity-100' : 'scale-100 opacity-50 hover:opacity-80'}`}
  >
    <svg className={`w-12 h-12 ${active ? 'text-yellow-400 fill-current drop-shadow-lg' : 'text-slate-300 fill-current'}`} viewBox="0 0 24 24">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
    <span className={`text-xs font-bold mt-1 ${active ? 'text-slate-700' : 'text-slate-400'}`}>{label}</span>
  </button>
);

const MenuScreen: React.FC<MenuScreenProps> = ({ onSelectGame, difficulty, setDifficulty, stickersCount, totalStickers }) => {
  return (
    <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl text-center space-y-6 animate-fade-in max-w-2xl mx-auto">
      <header className="flex justify-between items-center border-b pb-4 mb-4">
        <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-700 tracking-tight text-left">Mathe-Champion!</h1>
            <p className="text-slate-400 text-left text-sm">Wähle ein Spiel und Schwierigkeit</p>
        </div>
        <button 
          onClick={() => onSelectGame(GameMode.StickerAlbum)}
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg font-bold text-sm flex flex-col items-center transition"
        >
          <span>Sticker</span>
          <span className="text-xs">{stickersCount}/{totalStickers}</span>
        </button>
      </header>
      
      {/* Difficulty Selector */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
        <p className="text-slate-500 font-bold mb-2 uppercase text-xs tracking-wider">Schwierigkeit wählen</p>
        <div className="flex justify-center space-x-8">
          <DifficultyStar 
            active={difficulty === Difficulty.Easy} 
            onClick={() => setDifficulty(Difficulty.Easy)} 
            label="Einfach" 
          />
          <DifficultyStar 
            active={difficulty === Difficulty.Medium} 
            onClick={() => setDifficulty(Difficulty.Medium)} 
            label="Mittel" 
          />
          <DifficultyStar 
            active={difficulty === Difficulty.Hard} 
            onClick={() => setDifficulty(Difficulty.Hard)} 
            label="Schwer" 
          />
        </div>
      </div>

      <div className="space-y-4">
          <MenuButton 
            onClick={() => onSelectGame(GameMode.Multiplication)} 
            color="bg-orange-500 hover:bg-orange-600 focus:ring-orange-300"
            subtext={difficulty === Difficulty.Easy ? "1er, 2er, 5er, 10er Reihen" : difficulty === Difficulty.Medium ? "3er, 4er, 8er Reihen" : "Alle Reihen gemischt"}
          >
              1er-Reihe & Co.
          </MenuButton>
          <MenuButton 
            onClick={() => onSelectGame(GameMode.TensNeighbors)} 
            color="bg-blue-500 hover:bg-blue-600 focus:ring-blue-300"
            subtext={`Zahlen bis ${difficulty === Difficulty.Easy ? '100' : difficulty === Difficulty.Medium ? '500' : '1000'}`}
          >
              Zehnernachbarn
          </MenuButton>
          <MenuButton 
            onClick={() => onSelectGame(GameMode.Decomposition)} 
            color="bg-teal-500 hover:bg-teal-600 focus:ring-teal-300"
            subtext="Zahlen zerlegen"
          >
              Zahlen zerlegen
          </MenuButton>
      </div>
    </div>
  );
};

export default MenuScreen;
