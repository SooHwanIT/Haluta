import React, { useMemo } from 'react';

interface TypingAreaProps {
  text: string;
  userInput: string;
  onUserInputChange: (value: string) => void;
  status: 'waiting' | 'running' | 'finished';
}

const TypingArea: React.FC<TypingAreaProps> = ({ text, userInput, onUserInputChange, status }) => {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const handleAreaClick = () => {
    inputRef.current?.focus();
  };

  const originalWords = useMemo(() => text.split(' '), [text]);
  const typedWords = useMemo(() => userInput.split(' '), [userInput]);

  const elements = typedWords.map((typedWord, i) => {
    const originalWord = originalWords[i];
    const isCurrentWord = i === typedWords.length - 1 && status !== 'finished';
    
    let wordElement;
    if (isCurrentWord) {
      wordElement = <span key={i}>{typedWord}</span>;
    } else {
      const isCorrect = typedWord === originalWord;
    //   wordElement = <span key={i} className={isCorrect ? '' : 'text-red-500 bg-red-500/10 rounded'}>{typedWord}</span>;
      wordElement = <span key={i} className={isCorrect ? 'text-gray-200 dark:text-gray-700' : 'text-red-500 underline decoration-pink-500 bg-red-500/10 rounded'}>{typedWord}</span>;
    }
    
    const space = i < typedWords.length - 1 ? ' ' : '';
    return <React.Fragment key={i}>{wordElement}{space}</React.Fragment>;
  });

  const cursor = status !== 'finished' ? <span className="animate-pulse text-blue-500">|</span> : null;
  const upcomingText = <span className="text-gray-600 dark:text-gray-400">{text.substring(userInput.length)}</span>;

  return (
    <div className="relative w-full" onClick={handleAreaClick}>
      <div className="text-xl sm:text-2xl leading-relaxed tracking-wide p-4 rounded-md select-none bg-black/5 dark:bg-white/5 min-h-[144px] text-gray-200 dark:text-gray-700 dark:text-gray-200" style={{ whiteSpace: 'pre-wrap' }}>
        {elements}
        {cursor}
        {upcomingText}
      </div>
      <textarea
        ref={inputRef}
        value={userInput}
        onChange={(e) => onUserInputChange(e.target.value)}
        className="absolute top-0 left-0 w-full h-full p-4 bg-transparent text-transparent caret-transparent resize-none border-none outline-none text-xl sm:text-2xl "
        autoFocus
        spellCheck="false"
        disabled={status === 'finished'}
      />
    </div>
  );
};

export default TypingArea;
