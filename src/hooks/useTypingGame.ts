import { useState, useEffect, useRef, useCallback } from 'react';

// --- 타입 정의 ---
type GameStatus = 'waiting' | 'running' | 'finished';

interface TypingState {
  text: string;
  userInput: string;
  time: number;
  wpm: number; // 분당 타수 (Keystrokes Per Minute)
  errors: number; // 누적 (완성된 단어) 오타
  currentTypos: number; // 현재 단어의 글자 오타
  accuracy: number;
  status: GameStatus;
}

// --- API 설정 ---
// Vite 프로젝트의 .env.local 파일에 API 주소를 설정해주세요.
// VITE_API_URL=http://localhost:3001
const API_URL = import.meta.env.VITE_API_URL;

/**
 * 서버에서 오늘의 글을 가져옵니다.
 */
const fetchDailyTextAPI = async (): Promise<string> => {
  if (!API_URL) {
    throw new Error("VITE_API_URL is not defined in .env file");
  }
  const response = await fetch(`${API_URL}/word-of-the-day`);
  if (!response.ok) {
    throw new Error('오늘의 문장을 불러오는 데 실패했습니다.');
  }
  const data = await response.json();
  return data.text; // 서버 응답 형식에 맞게 data.text를 반환
};

// --- 한글 타수 계산 로직 ---
const initialStrokes = [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1];
const medialStrokes = [1, 1, 2, 2, 1, 1, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 1];
const finalStrokes = [0, 1, 2, 2, 1, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1];

/**
 * 주어진 문자열의 한글 타수를 계산합니다.
 * @param text 계산할 문자열
 * @returns 총 타수
 */
const getKoreanTypingCount = (text: string): number => {
  let count = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const charCode = char.charCodeAt(0);

    // 한글 음절 범위 (가-힣)
    if (charCode >= 0xAC00 && charCode <= 0xD7A3) {
      const relativeCode = charCode - 0xAC00;
      const initialIndex = Math.floor(relativeCode / (21 * 28));
      const medialIndex = Math.floor((relativeCode % (21 * 28)) / 28);
      const finalIndex = relativeCode % 28;

      count += initialStrokes[initialIndex];
      count += medialStrokes[medialIndex];
      if (finalIndex > 0) {
        count += finalStrokes[finalIndex];
      }
    } else {
      // 한글 음절이 아닌 경우 (공백, 특수문자, 영어 등)는 1타로 계산
      count += 1;
    }
  }
  return count;
};


/**
 * 타이핑 게임 로직을 관리하는 React Custom Hook
 */
export const useTypingGame = () => {
  const [state, setState] = useState<TypingState>({
    text: '문장을 불러오는 중입니다...',
    userInput: '',
    time: 0,
    wpm: 0,
    errors: 0,
    currentTypos: 0,
    accuracy: 100,
    status: 'waiting',
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const originalWordsRef = useRef<string[]>([]);

  /**
   * API를 통해 게임 데이터를 불러오고 상태를 초기화합니다.
   */
  const loadGameData = useCallback(async () => {
    try {
      const text = await fetchDailyTextAPI();
      originalWordsRef.current = text.split(' ');
      setState(s => ({ ...s, text }));
    } catch (error) {
      console.error("Failed to fetch daily text:", error);
      setState(s => ({ ...s, text: '문장을 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.' }));
    }
  }, []);

  // 컴포넌트 마운트 시 게임 데이터를 불러옵니다.
  useEffect(() => { 
    loadGameData(); 
  }, [loadGameData]);

  // 게임 상태(status)에 따라 타이머를 관리합니다.
  useEffect(() => {
    if (state.status === 'running') {
      timerRef.current = setInterval(() => {
        setState(prev => ({ ...prev, time: prev.time + 1 }));
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.status]);

  // 시간과 입력에 따라 타수와 정확도를 계산합니다.
  const calculateStats = useCallback((userInput: string, time: number) => {
    if (time === 0 || userInput.length === 0) return { wpm: 0, accuracy: 100 };
    
    // 분당 타수 계산 (한국식)
    const minutes = time / 60;
    const typingCount = getKoreanTypingCount(userInput);
    const wpm = Math.round(typingCount / minutes);

    // 정확도 계산
    const correctChars = userInput.split('').filter((char, i) => i < state.text.length && char === state.text[i]).length;
    const accuracy = Math.round((correctChars / userInput.length) * 100);

    return { wpm, accuracy };
  }, [state.text]);

  // 시간이 흐를 때마다 통계를 업데이트합니다.
  useEffect(() => {
    if (state.status === 'running') {
      const { wpm, accuracy } = calculateStats(state.userInput, state.time);
      setState(prev => ({ ...prev, wpm, accuracy }));
    }
  }, [state.time, state.userInput, state.status, calculateStats]);

  /**
   * 사용자 입력 변경을 처리하는 핸들러
   */
  const handleUserInputChange = (value: string) => {
    if (state.status === 'finished') return;
    if (state.status === 'waiting' && value.length > 0) {
      setState(prev => ({ ...prev, status: 'running' }));
    }

    const typedWords = value.split(' ');
    
    // 1. 누적 오타 계산 (완성된 단어 기준)
    let cumulativeErrors = 0;
    const wordsToCompare = typedWords.slice(0, typedWords.length - 1);
    wordsToCompare.forEach((word, index) => {
      if (word !== originalWordsRef.current[index]) {
        cumulativeErrors++;
      }
    });

    // 2. 현재 입력 중인 단어의 오타 계산 (글자 단위)
    const currentWordIndex = typedWords.length - 1;
    const currentTypedWord = typedWords[currentWordIndex] || '';
    const currentOriginalWord = originalWordsRef.current[currentWordIndex] || '';
    let currentTypos = 0;
    for (let i = 0; i < currentTypedWord.length; i++) {
      if (i >= currentOriginalWord.length || currentTypedWord[i] !== currentOriginalWord[i]) {
        currentTypos++;
      }
    }

    setState(prev => ({ ...prev, userInput: value, errors: cumulativeErrors, currentTypos }));

    // 3. 종료 조건 확인 (공백까지 포함하여 정확히 일치)
    if (value === state.text) {
      const finalTypedWords = value.trim().split(' ');
      let finalErrors = 0;
      finalTypedWords.forEach((word, index) => {
        if (word !== originalWordsRef.current[index]) {
          finalErrors++;
        }
      });
      setState(prev => ({ ...prev, status: 'finished', errors: finalErrors, currentTypos: 0 }));
    }
  };

  /**
   * 게임을 재시작하는 핸들러
   */
  const handleRestart = () => {
    setState({
      text: '문장을 불러오는 중입니다...',
      userInput: '',
      time: 0,
      wpm: 0,
      errors: 0,
      currentTypos: 0,
      accuracy: 100,
      status: 'waiting',
    });
    loadGameData();
  };

  return { state, actions: { handleUserInputChange, handleRestart } };
};
