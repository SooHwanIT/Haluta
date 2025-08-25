import React from 'react';

interface StatsProps {
  time: number;
  wpm: number;
  errors: number; // 누적 오타
  currentTypos: number; // 현재 오타
}

const StatItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="text-center flex-1">
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <div className="text-2xl sm:text-3xl font-bold text-gray-200 dark:text-gray-600 transition-colors">{value}</div>
  </div>
);

const Stats: React.FC<StatsProps> = ({ time, wpm, errors, currentTypos }) => {
  return (
    <div className="flex justify-center w-full gap-8 sm:gap-12 mb-8">
      <StatItem label="시간" value={`${time}s`} />
      <StatItem label="분당 타수" value={wpm} />
      <StatItem label="오타" value={errors} />
        {/* <StatItem label="오타 / 누적" value={
                <span>
                <span>{currentTypos}</span>
                <span className="text-base mx-1">/</span>
                <span>{errors}</span>
                </span>
            } /> */}
    </div>
  );
};

export default Stats;
