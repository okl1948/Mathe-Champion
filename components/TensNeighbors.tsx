
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ProgressBar from './common/ProgressBar';
import FeedbackIndicator from './common/FeedbackIndicator';
import LevelCompletionModal from './common/LevelCompletionModal';
import { type FeedbackStatus } from './common/FeedbackIndicator';
import { Difficulty } from '../types';

interface TensNeighborsProps {
  onBackToMenu: () => void;
  difficulty: Difficulty;
  onLevelComplete: () => number | null;
}

const TensNeighbors: React.FC<TensNeighborsProps> = ({ onBackToMenu, difficulty, onLevelComplete }) => {
  const [number, setNumber] = useState(0);
  const [lower, setLower] = useState('');
  const [upper, setUpper] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackStatus>('neutral');
  const [rewardSticker, setRewardSticker] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const lowerInputRef = useRef<HTMLInputElement>(null);
  const upperInputRef = useRef<HTMLInputElement>(null);
  const checkButtonRef = useRef<HTMLButtonElement>(null);

  const getTotalQuestions = () => {
    switch (difficulty) {
        case Difficulty.Hard: return 2;
        case Difficulty.Medium: return 5;
        case Difficulty.Easy: default: return 10;
    }
  };
  const totalQuestions = getTotalQuestions();

  const generateNewQuestion = useCallback(() => {
    let min, max;
    switch (difficulty) {
        case Difficulty.Easy: min = 11; max = 89; break;
        case Difficulty.Medium: min = 101; max = 499; break;
        case Difficulty.Hard: min = 501; max = 999; break;
        default: min = 11; max = 89;
    }

    let newNum;
    do {
      newNum = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (newNum % 10 === 0); 
    
    setNumber(newNum);
    setLower('');
    setUpper('');
    setFeedback('neutral');
    setTimeout(() => lowerInputRef.current?.focus(), 50);
  }, [difficulty]);

  useEffect(() => {
    generateNewQuestion();
  }, [generateNewQuestion]);

  const handleComplete = () => {
      const sticker = onLevelComplete();
      setRewardSticker(sticker);
      setShowModal(true);
  };

  const checkAnswer = useCallback(() => {
    if (feedback !== 'neutral') return;
    
    const correctLower = Math.floor(number / 10) * 10;
    const correctUpper = Math.ceil(number / 10) * 10;

    if (parseInt(lower, 10) === correctLower && parseInt(upper, 10) === correctUpper) {
      setFeedback('correct');
      const newScore = score + 1;
      setScore(newScore);
      
      if (newScore >= totalQuestions) {
          setTimeout(handleComplete, 500);
      } else {
         setTimeout(generateNewQuestion, 1000);
      }
    } else {
      setFeedback('incorrect');
      setTimeout(() => {
        setFeedback('neutral');
        setLower('');
        setUpper('');
        lowerInputRef.current?.focus();
      }, 1500);
    }
  }, [lower, upper, number, generateNewQuestion, score, feedback, totalQuestions]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkAnswer();
  };

  return (
    <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl w-full text-center relative">
      {showModal && (
        <LevelCompletionModal stickerIndex={rewardSticker} onClose={onBackToMenu} />
      )}
      
      <header className="relative mb-6 flex items-center justify-center">
        <button onClick={onBackToMenu} className="absolute left-0 text-slate-400 hover:text-slate-600 font-bold flex items-center">
            <span className="text-xl mr-1">&larr;</span>
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-500">Zehnernachbarn</h2>
      </header>
      <ProgressBar score={score} total={totalQuestions} color="bg-blue-400" />
      
      <div className="my-6 text-center">
        <p className="text-slate-400 text-sm sm:text-base mb-2 uppercase tracking-wide font-bold">Finde die Nachbarn</p>
      </div>

      <div className="my-8 relative h-32 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="flex items-center justify-center space-x-2 sm:space-x-4">
            <input
              ref={lowerInputRef}
              type="number"
              inputMode="numeric"
              autoComplete="off"
              value={lower}
              placeholder={(Math.floor(number/10)*10).toString().replace(/./g, '?')}
              onChange={(e) => {
                setLower(e.target.value);
                const expectedLen = (Math.floor(number/10)*10).toString().length;
                if (e.target.value.length >= expectedLen) upperInputRef.current?.focus();
              }}
              className="w-20 sm:w-28 text-center bg-blue-50 border-b-4 border-blue-200 rounded-lg p-2 text-2xl sm:text-3xl font-bold focus:border-blue-500 focus:outline-none transition-colors placeholder-blue-200"
              disabled={feedback !== 'neutral'}
              autoFocus
            />
            
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-slate-100 rounded-full text-slate-700 text-2xl sm:text-3xl font-black shadow-inner">
                {number}
            </div>
            
            <input
              ref={upperInputRef}
              type="number"
              inputMode="numeric"
              autoComplete="off"
              value={upper}
              onChange={(e) => {
                  setUpper(e.target.value);
                  const upperNeighbor = Math.ceil(number / 10) * 10;
                  const expectedLength = upperNeighbor.toString().length;
                  if (e.target.value.length >= expectedLength) {
                    checkButtonRef.current?.focus();
                  }
              }}
              className="w-20 sm:w-28 text-center bg-blue-50 border-b-4 border-blue-200 rounded-lg p-2 text-2xl sm:text-3xl font-bold focus:border-blue-500 focus:outline-none transition-colors"
              disabled={feedback !== 'neutral'}
            />
        </form>
        <FeedbackIndicator status={feedback} />
      </div>

      <button 
        ref={checkButtonRef}
        onClick={checkAnswer} 
        disabled={feedback !== 'neutral' || !lower || !upper} 
        className="w-full bg-blue-500 text-white font-bold py-4 px-4 rounded-xl text-xl sm:text-2xl shadow-lg transform transition hover:scale-[1.02] active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:scale-100">
        Prüfen
      </button>
    </div>
  );
};

export default TensNeighbors;
