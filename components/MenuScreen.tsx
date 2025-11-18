
import React from 'react';
import { GameMode } from '../types';

interface MenuScreenProps {
  onSelectGame: (mode: GameMode) => void;
}

const MenuButton: React.FC<{ onClick: () => void; color: string; children: React.ReactNode }> = ({ onClick, color, children }) => (
    <button
        onClick={onClick}
        className={`w-full text-white font-bold py-6 px-4 rounded-xl text-2xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-opacity-50 ${color}`}
    >
        {children}
    </button>
);

const MenuScreen: React.FC<MenuScreenProps> = ({ onSelectGame }) => {
  return (
    <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl text-center space-y-8 animate-fade-in">
      <header>
        <h1 className="text-5xl sm:text-6xl font-black text-slate-700 tracking-tight">Mathe-Champion!</h1>
        <p className="text-slate-500 mt-2 text-lg">Wähle ein Spiel und leg los!</p>
      </header>
      <div className="space-y-6">
          <MenuButton onClick={() => onSelectGame(GameMode.Multiplication)} color="bg-orange-500 hover:bg-orange-600 focus:ring-orange-300">
              Einmaleins
          </MenuButton>
          <MenuButton onClick={() => onSelectGame(GameMode.TensNeighbors)} color="bg-blue-500 hover:bg-blue-600 focus:ring-blue-300">
              Zehnernachbarn
          </MenuButton>
          <MenuButton onClick={() => onSelectGame(GameMode.Decomposition)} color="bg-teal-500 hover:bg-teal-600 focus:ring-teal-300">
              Zahlen zerlegen
          </MenuButton>
      </div>
    </div>
  );
};

export default MenuScreen;
