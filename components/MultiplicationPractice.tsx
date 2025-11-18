
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ProgressBar from './common/ProgressBar';
import FeedbackIndicator from './common/FeedbackIndicator';
import { type FeedbackStatus } from './common/FeedbackIndicator';

interface MultiplicationPracticeProps {
  onBackToMenu: () => void;
}

const MultiplicationPractice: React.FC<MultiplicationPracticeProps> = ({ onBackToMenu }) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackStatus>('neutral');
  const answerInputRef = useRef<HTMLInputElement>(null);

  const generateNewQuestion = useCallback(() => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setAnswer('');
    setFeedback('neutral');
    answerInputRef.current?.focus();
  }, []);

  useEffect(() => {
    generateNewQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAnswer = useCallback(() => {
    if (feedback !== 'neutral') return;

    if (parseInt(answer, 10) === num1 * num2) {
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
        setAnswer('');
      }, 1500);
    }
  }, [answer, num1, num2, generateNewQuestion, score, feedback]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkAnswer();
  };

  return (
    <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl w-full text-center">
      <header className="relative mb-6">
        <button onClick={onBackToMenu} className="absolute left-0 top-1 text-blue-500 hover:text-blue-700 font-bold">&larr; Menü</button>
        <h2 className="text-3xl font-bold text-orange-500">Einmaleins</h2>
      </header>
      <ProgressBar score={score} total={5} color="bg-orange-400" />
      <div className="my-12 relative h-32 flex items-center justify-center">
        <div className="text-5xl sm:text-6xl font-black text-slate-700 tracking-wider flex items-center justify-center space-x-4">
          <span>{num1}</span>
          <span>&times;</span>
          <span>{num2}</span>
          <span>=</span>
          <form onSubmit={handleSubmit} className="inline-block">
            <input
              ref={answerInputRef}
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-28 sm:w-32 text-center bg-orange-50 border-2 border-orange-200 rounded-lg p-2 focus:border-orange-500 focus:ring-orange-500 transition"
              disabled={feedback !== 'neutral'}
              autoFocus
            />
          </form>
        </div>
        <FeedbackIndicator status={feedback} />
      </div>
      <button 
        onClick={checkAnswer} 
        disabled={feedback !== 'neutral' || !answer}
        className="w-full bg-orange-500 text-white font-bold py-4 px-4 rounded-xl text-2xl shadow-lg transform transition hover:scale-105 disabled:bg-slate-300 disabled:scale-100">
        Prüfen
      </button>
    </div>
  );
};

export default MultiplicationPractice;
