
import React from 'react';

interface ProgressBarProps {
  score: number;
  total: number;
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ score, total, color = 'bg-green-500' }) => {
  const percentage = (score / total) * 100;
  
  return (
    <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
      <div 
        className={`h-4 rounded-full ${color} transition-all duration-500 ease-out`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
