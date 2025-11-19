
import React, { useState, useCallback, useEffect } from 'react';
import { GameMode, Difficulty } from './types';
import MenuScreen from './components/MenuScreen';
import MultiplicationPractice from './components/MultiplicationPractice';
import TensNeighbors from './components/TensNeighbors';
import DecomposeNumbers from './components/DecomposeNumbers';
import StickerAlbum from './components/StickerAlbum';

const TOTAL_STICKERS = 6;

const App: React.FC = () => {
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.Menu);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy);
  const [stickers, setStickers] = useState<number[]>([]);

  // Load stickers from local storage on mount
  useEffect(() => {
    const savedStickers = localStorage.getItem('math_app_stickers');
    if (savedStickers) {
      try {
        setStickers(JSON.parse(savedStickers));
      } catch (e) {
        console.error("Failed to parse stickers", e);
      }
    }
  }, []);

  const saveSticker = useCallback((newStickerId: number) => {
    setStickers(prevStickers => {
        if (prevStickers.includes(newStickerId)) return prevStickers;
        const newStickers = [...prevStickers, newStickerId];
        localStorage.setItem('math_app_stickers', JSON.stringify(newStickers));
        return newStickers;
    });
  }, []);

  // Cheat Codes Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.altKey && e.shiftKey) {
            let key = -1;
            // Use e.code to handle cases where Shift modifies the key char (e.g. Shift+1 = !)
            if (e.code.startsWith('Digit')) {
                key = parseInt(e.code.replace('Digit', ''), 10);
            } else if (e.code.startsWith('Numpad')) {
                key = parseInt(e.code.replace('Numpad', ''), 10);
            }

            if (!isNaN(key) && key >= 1 && key <= TOTAL_STICKERS) {
                saveSticker(key - 1);
            }
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveSticker]);

  const handleLevelComplete = useCallback((): number | null => {
    // Check current state via functional update or just access state if dependency is handled.
    // Since this is a callback passed down, we need access to latest stickers.
    // However, stickers is in dependency array.
    
    if (stickers.length >= TOTAL_STICKERS) return null;
    
    const availableStickers = Array.from({ length: TOTAL_STICKERS }, (_, i) => i).filter(id => !stickers.includes(id));
    
    if (availableStickers.length > 0) {
      const randomSticker = availableStickers[Math.floor(Math.random() * availableStickers.length)];
      saveSticker(randomSticker);
      return randomSticker; // Return the newly acquired sticker index
    }
    return null;
  }, [stickers, saveSticker]);

  const handleSelectGame = useCallback((mode: GameMode) => {
    setGameMode(mode);
  }, []);

  const handleBackToMenu = useCallback(() => {
    setGameMode(GameMode.Menu);
  }, []);

  const renderGameMode = () => {
    switch (gameMode) {
      case GameMode.Multiplication:
        return <MultiplicationPractice onBackToMenu={handleBackToMenu} difficulty={difficulty} onLevelComplete={handleLevelComplete} />;
      case GameMode.TensNeighbors:
        return <TensNeighbors onBackToMenu={handleBackToMenu} difficulty={difficulty} onLevelComplete={handleLevelComplete} />;
      case GameMode.Decomposition:
        return <DecomposeNumbers onBackToMenu={handleBackToMenu} difficulty={difficulty} onLevelComplete={handleLevelComplete} />;
      case GameMode.StickerAlbum:
        return <StickerAlbum stickers={stickers} totalStickers={TOTAL_STICKERS} onBack={handleBackToMenu} />;
      case GameMode.Menu:
      default:
        return (
            <MenuScreen 
                onSelectGame={handleSelectGame} 
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                stickersCount={stickers.length}
                totalStickers={TOTAL_STICKERS}
            />
        );
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 text-slate-800 flex flex-col items-center justify-center p-4 transition-all duration-500 font-nunito">
      <div className="w-full max-w-lg mx-auto">
        {renderGameMode()}
      </div>
    </div>
  );
};

export default App;
