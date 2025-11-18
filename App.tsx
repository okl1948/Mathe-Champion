
import React, { useState, useCallback } from 'react';
import { GameMode } from './types';
import MenuScreen from './components/MenuScreen';
import MultiplicationPractice from './components/MultiplicationPractice';
import TensNeighbors from './components/TensNeighbors';
import DecomposeNumbers from './components/DecomposeNumbers';

const App: React.FC = () => {
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.Menu);

  const handleSelectGame = useCallback((mode: GameMode) => {
    setGameMode(mode);
  }, []);

  const handleBackToMenu = useCallback(() => {
    setGameMode(GameMode.Menu);
  }, []);

  const renderGameMode = () => {
    switch (gameMode) {
      case GameMode.Multiplication:
        return <MultiplicationPractice onBackToMenu={handleBackToMenu} />;
      case GameMode.TensNeighbors:
        return <TensNeighbors onBackToMenu={handleBackToMenu} />;
      case GameMode.Decomposition:
        return <DecomposeNumbers onBackToMenu={handleBackToMenu} />;
      case GameMode.Menu:
      default:
        return <MenuScreen onSelectGame={handleSelectGame} />;
    }
  };

  return (
    <div className="min-h-screen bg-sky-100 text-slate-800 flex flex-col items-center justify-center p-4 transition-all duration-500">
      <div className="w-full max-w-lg mx-auto">
        {renderGameMode()}
      </div>
    </div>
  );
};

export default App;
