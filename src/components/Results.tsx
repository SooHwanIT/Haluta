import React from 'react';

interface ResultsProps {
  wpm: number;
  time: number;
  errors: number;
  accuracy: number;
  onRestart: () => void;
}

const Results: React.FC<ResultsProps> = ({ wpm, time, errors, accuracy, onRestart }) => {
  return (
    <div className="text-center py-10">
      <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6">결과</h2>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-lg mb-8 max-w-xs mx-auto">
        <p className="text-gray-600 dark:text-gray-400 text-right">평균 타수:</p>
        <p className="font-semibold text-gray-800 dark:text-gray-200 text-left">{wpm}</p>
        <p className="text-gray-600 dark:text-gray-400 text-right">소요 시간:</p>
        <p className="font-semibold text-gray-800 dark:text-gray-200 text-left">{time}초</p>
        <p className="text-gray-600 dark:text-gray-400 text-right">정확도:</p>
        <p className="font-semibold text-gray-800 dark:text-gray-200 text-left">{accuracy}%</p>
        <p className="text-gray-600 dark:text-gray-400 text-right">오타 수:</p>
        <p className="font-semibold text-gray-800 dark:text-gray-200 text-left">{errors}개</p>
      </div>
      <button
        onClick={onRestart}
        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        다시 도전
      </button>
    </div>
  );
};

export default Results;