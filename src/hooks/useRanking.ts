import { useState, useEffect, useCallback } from 'react';

// --- 타입 정의 (서버와 동일하게 유지) ---
export interface RankEntry {
  id: number;
  name: string;
  errors: number;
  wpm: number;
}

export interface NewScore {
  name:string;
  wpm: number;
  errors: number;
}

type SubmissionStatus = 'idle' | 'loading' | 'success' | 'error';

interface RankingState {
  rankingList: RankEntry[];
  submissionStatus: SubmissionStatus;
  error: string | null;
}

// --- API 설정 ---
// Vite 프로젝트의 .env.local 파일에 아래와 같이 API 주소를 설정해주세요.
// VITE_API_URL=http://localhost:3001
const API_URL = import.meta.env.VITE_API_URL;

// --- API 호출 함수 ---

/**
 * 서버에서 랭킹 목록을 가져옵니다.
 */
const fetchRankingAPI = async (): Promise<RankEntry[]> => {
  if (!API_URL) {
    throw new Error("VITE_API_URL is not defined in .env file");
  }
  const response = await fetch(`${API_URL}/ranking`);
  if (!response.ok) {
    throw new Error('랭킹 데이터를 불러오는 데 실패했습니다.');
  }
  return response.json();
};

/**
 * 새로운 점수를 서버에 등록합니다.
 */
const submitScoreAPI = async (score: NewScore): Promise<RankEntry> => {
  if (!API_URL) {
    throw new Error("VITE_API_URL is not defined in .env file");
  }
  const response = await fetch(`${API_URL}/ranking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(score),
  });

  if (!response.ok) {
    // 서버에서 보낸 에러 메시지를 사용
    const errorData = await response.json();
    throw new Error(errorData.message || '랭킹 등록에 실패했습니다.');
  }
  return response.json();
};


/**
 * 랭킹 데이터를 관리하는 React Custom Hook
 */
export const useRanking = () => {
  const [state, setState] = useState<RankingState>({
    rankingList: [],
    submissionStatus: 'idle',
    error: null
  });

  /**
   * 랭킹 목록을 불러와 상태를 업데이트하는 함수
   */
  const loadRanking = useCallback(async () => {
    try {
      const data = await fetchRankingAPI();
      // 서버에서 이미 정렬해서 보내주지만, 클라이언트에서 한 번 더 정렬하여 안정성을 높입니다.
      const sortedData = [...data].sort((a, b) => {
        if (b.wpm !== a.wpm) return b.wpm - a.wpm;
        return a.errors - b.errors;
      });
      setState(prev => ({ ...prev, rankingList: sortedData, error: null }));
    } catch (e) {
      const message = e instanceof Error ? e.message : "랭킹을 불러오는데 실패했습니다.";
      setState(prev => ({ ...prev, error: message }));
    }
  }, []);

  // 컴포넌트 마운트 시 랭킹 목록을 불러옵니다.
  useEffect(() => {
    loadRanking();
  }, [loadRanking]);

  /**
   * 새로운 점수를 서버에 제출하는 함수
   */
  const submitScore = async (score: NewScore) => {
    setState(prev => ({ ...prev, submissionStatus: 'loading', error: null }));
    try {
      await submitScoreAPI(score);
      setState(prev => ({ ...prev, submissionStatus: 'success' }));
      await loadRanking(); // 점수 등록 성공 후 랭킹 목록을 새로고침합니다.
    } catch (e) {
      const message = e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.";
      setState(prev => ({ ...prev, submissionStatus: 'error', error: message }));
    }
  };
  
  /**
   * 제출 상태(submissionStatus)를 초기화하는 함수
   */
  const resetSubmissionStatus = useCallback(() => {
    setState(prev => ({ ...prev, submissionStatus: 'idle', error: null }));
  }, []);

  return { 
    state, 
    actions: { 
      submitScore,
      resetSubmissionStatus
    } 
  };
};
