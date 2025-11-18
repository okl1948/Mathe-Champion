
import React from 'react';

export type FeedbackStatus = 'correct' | 'incorrect' | 'neutral';

interface FeedbackIndicatorProps {
  status: FeedbackStatus;
}

const CorrectIcon = () => (
  <svg className="w-24 h-24 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IncorrectIcon = () => (
  <svg className="w-24 h-24 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FeedbackIndicator: React.FC<FeedbackIndicatorProps> = ({ status }) => {
  if (status === 'neutral') {
    return null;
  }

  const getAnimationClass = () => {
    if (status === 'correct') return 'animate-zoom-in';
    if (status === 'incorrect') return 'animate-shake';
    return '';
  };
  
  return (
    <div className={`absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-lg ${getAnimationClass()}`}>
        <style>{`
            @keyframes zoom-in {
                0% { transform: scale(0.5); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
            .animate-zoom-in { animation: zoom-in 0.3s ease-out forwards; }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            .animate-shake { animation: shake 0.5s ease-in-out forwards; }
        `}</style>
      {status === 'correct' ? <CorrectIcon /> : <IncorrectIcon />}
    </div>
  );
};

export default FeedbackIndicator;
