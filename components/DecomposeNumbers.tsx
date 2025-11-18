
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ProgressBar from './common/ProgressBar';
import FeedbackIndicator from './common/FeedbackIndicator';
import { type FeedbackStatus } from './common/FeedbackIndicator';

interface DecomposeNumbersProps {
  onBackToMenu: () => void;
}

const DecomposeNumbers: React.FC<DecomposeNumbersProps> = ({ onBackToMenu }) => {
  const [number, setNumber] = useState(0);
  const [tens, setTens] = useState('');
  const [ones, setOnes] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackStatus>('neutral');

  const tensInputRef = useRef<HTMLInputElement>(null);
  const onesInputRef = useRef<HTMLInputElement>(null);

  const generateNewQuestion = useCallback(() => {
    setNumber(Math.floor(Math.random() * 89) + 11); // 11 to 99
    setTens('');
    setOnes('');
    setFeedback('neutral');
    tensInputRef.current?.focus();
  }, []);

  useEffect(() => {
    generateNewQuestion();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAnswer = useCallback(() => {
    if (feedback !== 'neutral') return;

    const correctTens = Math.floor(number / 10) * 10;
    const correctOnes = number % 10;

    if (parseInt(tens, 10) === correctTens && parseInt(ones, 10) === correctOnes) {
      setFeedback('correct');
      setScore(prev => (prev < 5 ? prev + 1 : 5));
      setTimeout(() => {
        if (score + 1 === 5) {
             setTimeout(() => {
                setScore(0);
                generateNewQuestion();
            }, 1500);
        } else {
            generateNewQuestion();
        }
      }, 1000);
    } else {
      setFeedback('incorrect');
      setScore(0);
      setTimeout(() => {
        setFeedback('neutral');
        setTens('');
        setOnes('');
      }, 1500);
    }
  }, [tens, ones, number, generateNewQuestion, score, feedback]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkAnswer();
  };

  return (
    <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl w-full text-center">
      <header className="relative mb-6">
        <button onClick={onBackToMenu} className="absolute left-0 top-1 text-blue-500 hover:text-blue-700 font-bold">&larr; Menü</button>
        <h2 className="text-3xl font-bold text-teal-500">Zahlen zerlegen</h2>
      </header>
      <ProgressBar score={score} total={5} color="bg-teal-400" />
       <div className="my-8 text-center">
        <p className="text-slate-500 text-xl mb-2">Zerlege die Zahl!</p>
        <p className="text-8xl font-black text-slate-700">{number}</p>
      </div>
      <div className="my-12 relative h-24 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="text-5xl font-black text-slate-700 tracking-wider flex items-center justify-center space-x-4">
          <input
            ref={tensInputRef}
            type="number"
            value={tens}
            onChange={(e) => {
                setTens(e.target.value)
                if (e.target.value.length >= 2) onesInputRef.current?.focus();
            }}
            className="w-28 text-center bg-teal-50 border-2 border-teal-200 rounded-lg p-2 focus:border-teal-500 focus:ring-teal-500 transition"
            disabled={feedback !== 'neutral'}
            autoFocus
          />
          <span className="text-teal-400">+</span>
          <input
            ref={onesInputRef}
            type="number"
            value={ones}
            onChange={(e) => setOnes(e.target.value)}
            className="w-28 text-center bg-teal-50 border-2 border-teal-200 rounded-lg p-2 focus:border-teal-500 focus:ring-teal-500 transition"
            disabled={feedback !== 'neutral'}
          />
        </form>
         <FeedbackIndicator status={feedback} />
      </div>
      <button onClick={checkAnswer} disabled={feedback !== 'neutral' || !tens || !ones} className="w-full bg-teal-500 text-white font-bold py-4 px-4 rounded-xl text-2xl shadow-lg transform transition hover:scale-105 disabled:bg-slate-300 disabled:scale-100">
        Prüfen
      </button>
    </div>
  );
};

export default DecomposeNumbers;
