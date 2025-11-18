
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ProgressBar from './common/ProgressBar';
import FeedbackIndicator from './common/FeedbackIndicator';
import { type FeedbackStatus } from './common/FeedbackIndicator';

interface TensNeighborsProps {
  onBackToMenu: () => void;
}

const TensNeighbors: React.FC<TensNeighborsProps> = ({ onBackToMenu }) => {
  const [number, setNumber] = useState(0);
  const [lower, setLower] = useState('');
  const [upper, setUpper] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackStatus>('neutral');

  const lowerInputRef = useRef<HTMLInputElement>(null);
  const upperInputRef = useRef<HTMLInputElement>(null);

  const generateNewQuestion = useCallback(() => {
    let newNum;
    do {
      newNum = Math.floor(Math.random() * 89) + 11; // 11 to 99
    } while (newNum % 10 === 0);
    setNumber(newNum);
    setLower('');
    setUpper('');
    setFeedback('neutral');
    lowerInputRef.current?.focus();
  }, []);

  useEffect(() => {
    generateNewQuestion();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAnswer = useCallback(() => {
    if (feedback !== 'neutral') return;
    
    const correctLower = Math.floor(number / 10) * 10;
    const correctUpper = Math.ceil(number / 10) * 10;

    if (parseInt(lower, 10) === correctLower && parseInt(upper, 10) === correctUpper) {
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
        setLower('');
        setUpper('');
      }, 1500);
    }
  }, [lower, upper, number, generateNewQuestion, score, feedback]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkAnswer();
  };

  return (
    <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl w-full text-center">
      <header className="relative mb-6">
        <button onClick={onBackToMenu} className="absolute left-0 top-1 text-blue-500 hover:text-blue-700 font-bold">&larr; Menü</button>
        <h2 className="text-3xl font-bold text-blue-500">Zehnernachbarn</h2>
      </header>
      <ProgressBar score={score} total={5} color="bg-blue-400" />
      <div className="my-8 text-center">
        <p className="text-slate-500 text-xl mb-2">Welche Zehnernachbarn hat die Zahl?</p>
        <p className="text-8xl font-black text-slate-700">{number}</p>
      </div>
      <div className="my-8 relative h-24 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="flex items-center justify-center space-x-4">
            <input
              ref={lowerInputRef}
              type="number"
              value={lower}
              onChange={(e) => {
                setLower(e.target.value);
                if (e.target.value.length === 2) upperInputRef.current?.focus();
              }}
              className="w-28 text-center bg-blue-50 border-2 border-blue-200 rounded-lg p-2 text-4xl font-bold focus:border-blue-500 focus:ring-blue-500 transition"
              disabled={feedback !== 'neutral'}
              autoFocus
            />
            <div className="w-12 h-12 flex items-center justify-center bg-slate-200 rounded-full text-slate-500 text-2xl font-bold">{number}</div>
            <input
              ref={upperInputRef}
              type="number"
              value={upper}
              onChange={(e) => setUpper(e.target.value)}
              className="w-28 text-center bg-blue-50 border-2 border-blue-200 rounded-lg p-2 text-4xl font-bold focus:border-blue-500 focus:ring-blue-500 transition"
              disabled={feedback !== 'neutral'}
            />
        </form>
         <FeedbackIndicator status={feedback} />
      </div>
      <button onClick={checkAnswer} disabled={feedback !== 'neutral' || !lower || !upper} className="w-full bg-blue-500 text-white font-bold py-4 px-4 rounded-xl text-2xl shadow-lg transform transition hover:scale-105 disabled:bg-slate-300 disabled:scale-100">
        Prüfen
      </button>
    </div>
  );
};

export default TensNeighbors;
