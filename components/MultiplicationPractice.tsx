
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ProgressBar from './common/ProgressBar';
import FeedbackIndicator from './common/FeedbackIndicator';
import LevelCompletionModal from './common/LevelCompletionModal';
import { type FeedbackStatus } from './common/FeedbackIndicator';
import { Difficulty } from '../types';

interface MultiplicationPracticeProps {
  onBackToMenu: () => void;
  difficulty: Difficulty;
  onLevelComplete: () => number | null;
}

const MultiplicationPractice: React.FC<MultiplicationPracticeProps> = ({ onBackToMenu, difficulty, onLevelComplete }) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackStatus>('neutral');
  const [rewardSticker, setRewardSticker] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const answerInputRef = useRef<HTMLInputElement>(null);
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
    let possibleRows: number[] = [];
    
    if (difficulty === Difficulty.Easy) {
      possibleRows = [1, 2, 5, 10];
    } else if (difficulty === Difficulty.Medium) {
      possibleRows = [3, 4, 8]; 
    } else {
      possibleRows = [6, 7, 9];
      if (Math.random() > 0.7) possibleRows = [1,2,3,4,5,6,7,8,9,10];
    }

    const row = possibleRows[Math.floor(Math.random() * possibleRows.length)];
    const factor = Math.floor(Math.random() * 10) + 1;

    if (Math.random() > 0.5) {
        setNum1(row);
        setNum2(factor);
    } else {
        setNum1(factor);
        setNum2(row);
    }

    setAnswer('');
    setFeedback('neutral');
    setTimeout(() => answerInputRef.current?.focus(), 50);
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

    if (parseInt(answer, 10) === num1 * num2) {
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
        setAnswer('');
        answerInputRef.current?.focus();
      }, 1500);
    }
  }, [answer, num1, num2, generateNewQuestion, score, feedback, totalQuestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkAnswer();
  };

  return (
    <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl w-full text-center relative overflow-hidden">
      {showModal && (
        <LevelCompletionModal stickerIndex={rewardSticker} onClose={onBackToMenu} />
      )}

      <header className="relative mb-6 flex items-center justify-center">
        <button onClick={onBackToMenu} className="absolute left-0 text-slate-400 hover:text-slate-600 font-bold flex items-center">
            <span className="text-xl mr-1">&larr;</span>
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold text-orange-500">1er-Reihe & Co</h2>
      </header>
      
      <ProgressBar score={score} total={totalQuestions} color="bg-orange-400" />
      
      <div className="my-8 sm:my-12 relative h-32 flex flex-col items-center justify-center">
        <div className="text-5xl sm:text-6xl font-black text-slate-700 tracking-wider flex items-center justify-center space-x-3 sm:space-x-4">
        <span>{num1}</span>
        <span className="text-orange-400">&times;</span>
        <span>{num2}</span>
        <span className="text-slate-300">=</span>
        <form onSubmit={handleSubmit} className="inline-block">
            <input
            ref={answerInputRef}
            type="number"
            inputMode="numeric"
            autoComplete="off"
            value={answer}
            onChange={(e) => {
                setAnswer(e.target.value);
                const expectedLength = (num1 * num2).toString().length;
                if (e.target.value.length >= expectedLength) {
                    checkButtonRef.current?.focus();
                }
            }}
            className="w-24 sm:w-32 text-center bg-orange-50 border-b-4 border-orange-200 rounded-lg p-2 focus:border-orange-500 focus:outline-none transition-colors"
            disabled={feedback !== 'neutral'}
            autoFocus
            />
        </form>
        </div>
        <FeedbackIndicator status={feedback} />
      </div>

      <button 
        ref={checkButtonRef}
        onClick={checkAnswer} 
        disabled={feedback !== 'neutral' || !answer}
        className="w-full bg-orange-500 text-white font-bold py-4 px-4 rounded-xl text-xl sm:text-2xl shadow-lg transform transition hover:scale-[1.02] active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:scale-100 disabled:shadow-none">
        Prüfen
      </button>
    </div>
  );
};

export default MultiplicationPractice;
