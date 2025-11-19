
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ProgressBar from './common/ProgressBar';
import FeedbackIndicator from './common/FeedbackIndicator';
import LevelCompletionModal from './common/LevelCompletionModal';
import { type FeedbackStatus } from './common/FeedbackIndicator';
import { Difficulty } from '../types';

interface DecomposeNumbersProps {
  onBackToMenu: () => void;
  difficulty: Difficulty;
  onLevelComplete: () => number | null;
}

const DecomposeNumbers: React.FC<DecomposeNumbersProps> = ({ onBackToMenu, difficulty, onLevelComplete }) => {
  const [number, setNumber] = useState(0);
  const [tens, setTens] = useState('');
  const [ones, setOnes] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackStatus>('neutral');
  const [rewardSticker, setRewardSticker] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const tensInputRef = useRef<HTMLInputElement>(null);
  const onesInputRef = useRef<HTMLInputElement>(null);
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
    if (difficulty === Difficulty.Easy) { min = 11; max = 40; }
    else if (difficulty === Difficulty.Medium) { min = 41; max = 80; }
    else { min = 81; max = 99; }

    setNumber(Math.floor(Math.random() * (max - min + 1)) + min);
    setTens('');
    setOnes('');
    setFeedback('neutral');
    setTimeout(() => tensInputRef.current?.focus(), 50);
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

    const correctTens = Math.floor(number / 10) * 10;
    const correctOnes = number % 10;

    if (parseInt(tens, 10) === correctTens && parseInt(ones, 10) === correctOnes) {
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
        setTens('');
        setOnes('');
        tensInputRef.current?.focus();
      }, 1500);
    }
  }, [tens, ones, number, generateNewQuestion, score, feedback, totalQuestions]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkAnswer();
  };

  const correctTens = Math.floor(number / 10) * 10;
  const correctOnes = number % 10;

  return (
    <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl w-full text-center relative">
      {showModal && (
        <LevelCompletionModal stickerIndex={rewardSticker} onClose={onBackToMenu} />
      )}
      
      <header className="relative mb-6 flex items-center justify-center">
        <button onClick={onBackToMenu} className="absolute left-0 text-slate-400 hover:text-slate-600 font-bold flex items-center">
            <span className="text-xl mr-1">&larr;</span>
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-500">Zahlen zerlegen</h2>
      </header>
      <ProgressBar score={score} total={totalQuestions} color="bg-teal-400" />
       
      <div className="my-6 text-center">
        <p className="text-slate-400 text-sm sm:text-base mb-2 uppercase tracking-wide font-bold">Wie heißt die Rechnung?</p>
      </div>

      <div className="my-8 relative h-32 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="text-4xl sm:text-5xl font-black text-slate-700 tracking-wider flex items-center justify-center flex-wrap gap-2 sm:gap-4">
            <div className="w-24 text-center">{number}</div>
            <div className="text-slate-300">=</div>
            <input
                ref={tensInputRef}
                type="number"
                inputMode="numeric"
                autoComplete="off"
                value={tens}
                placeholder={correctTens.toString().replace(/./g, '?')}
                onChange={(e) => {
                    setTens(e.target.value)
                    const expectedLength = correctTens.toString().length;
                    if (e.target.value.length >= expectedLength) onesInputRef.current?.focus();
                }}
                className="w-24 sm:w-28 text-center bg-teal-50 border-b-4 border-teal-200 rounded-lg p-2 focus:border-teal-500 focus:outline-none transition-colors placeholder-teal-200"
                disabled={feedback !== 'neutral'}
                autoFocus
            />
            <span className="text-teal-400">+</span>
            <input
                ref={onesInputRef}
                type="number"
                inputMode="numeric"
                autoComplete="off"
                value={ones}
                placeholder={correctOnes.toString().replace(/./g, '?')}
                onChange={(e) => {
                    setOnes(e.target.value);
                    const expectedLength = correctOnes.toString().length;
                    if (e.target.value.length >= expectedLength) {
                        checkButtonRef.current?.focus();
                    }
                }}
                className="w-24 sm:w-28 text-center bg-teal-50 border-b-4 border-teal-200 rounded-lg p-2 focus:border-teal-500 focus:outline-none transition-colors placeholder-teal-200"
                disabled={feedback !== 'neutral'}
            />
        </form>
        <FeedbackIndicator status={feedback} />
      </div>

      <button 
        ref={checkButtonRef}
        onClick={checkAnswer} 
        disabled={feedback !== 'neutral' || !tens || !ones}
        className="w-full bg-teal-500 text-white font-bold py-4 px-4 rounded-xl text-xl sm:text-2xl shadow-lg transform transition hover:scale-[1.02] active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:scale-100">
        Prüfen
      </button>
    </div>
  );
};

export default DecomposeNumbers;
