import React, { useMemo, useRef, useEffect } from 'react';
import { RankEntry } from '../data/mockData';

interface RankingProps {
  rankingList: RankEntry[];
  currentUserWpm: number | null;
  errors: number | null;
  isOpen: boolean;
  onToggle: () => void;
}

const ITEM_TOTAL_HEIGHT_REM = 3.5;

const Ranking: React.FC<RankingProps> = ({ rankingList, currentUserWpm, errors, isOpen, onToggle }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- 변경된 부분 시작 ---

  // 실시간 WPM을 랭킹 리스트에 합쳐 동적으로 정렬되는 새로운 리스트를 생성
  const displayList = useMemo(() => {
    let combinedList: (RankEntry & { isUser?: boolean })[] = [...rankingList];

    // 게임 중일 때만 '나'의 정보를 리스트에 추가
    if (currentUserWpm !== null && errors !== null) {
      const currentUserEntry = {
        id: 'currentUser',
        name: '나',
        wpm: currentUserWpm,
        errors: errors,
        isUser: true,
      };
      combinedList.push(currentUserEntry);
    }
    
    // WPM 내림차순, 오타 오름차순으로 정렬
    return combinedList.sort((a, b) => {
      if (b.wpm !== a.wpm) {
        return b.wpm - a.wpm;
      }
      return a.errors - b.errors;
    });
  }, [rankingList, currentUserWpm, errors]);

  // 변경된 displayList를 기준으로 '나'의 현재 순위(인덱스)를 찾음
  const userIndex = useMemo(() => {
    if (currentUserWpm === null) return -1;
    return displayList.findIndex(item => item.id === 'currentUser');
  }, [displayList, currentUserWpm]);


  // 스크롤 로직을 '나'의 인덱스 기준으로 변경
  useEffect(() => {
    if (userIndex !== -1 && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemHeightInPx = ITEM_TOTAL_HEIGHT_REM * parseFloat(getComputedStyle(document.documentElement).fontSize);
      const userCardTopPosition = userIndex * itemHeightInPx;
      const containerHeight = container.clientHeight;
      const targetScrollTop = userCardTopPosition - (containerHeight / 2) + (itemHeightInPx / 2);

      container.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth',
      });
    }
  }, [userIndex]); // userIndex가 바뀔 때마다 스크롤 효과 실행

  // --- 변경된 부분 끝 ---


  return (
    <div className="p-4 h-full w-72 lg:w-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        {/* <h2 className={`text-lg font-bold text-gray-800 dark:text-gray-100 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>실시간 랭킹</h2> */}
      </div>
      <div className={`transition-opacity duration-300 flex-grow flex flex-col ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex text-xs text-gray-500 dark:text-gray-400 px-2 pb-2 border-b border-gray-200 dark:border-gray-700">
          <span className="w-8 text-center">순위</span>
          <span className="flex-1 ml-2">이름</span>
          <span className="w-12 text-right">타수</span>
          <span className="w-12 text-right">오타</span>
        </div>
        
        <div 
            ref={scrollContainerRef} 
            className="relative mt-1 flex-grow max-h-[35rem] snap-y overflow-y-auto scrollbar-hide"
            >
          {/* 변경: 정렬된 displayList를 기준으로 렌더링 */}
          {displayList.map((rank, index) => {
            // '나'의 순위일 경우 특별한 스타일 적용
            const isUser = 'isUser' in rank && rank.isUser;
            const userHighlightClass = isUser ? 'bg-blue-500/20 border-2 border-blue-500' : '';

            return (
              <div key={rank.id} className={`flex snap-start items-center p-2 my-1 h-12 rounded-md transition-colors ${userHighlightClass}`}>
                <span className={`w-8 text-center font-bold ${isUser ? 'text-blue-600 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'}`}>{index + 1}</span>
                <span className={`flex-1 ml-2 truncate ${isUser ? 'font-bold text-blue-400 dark:text-blue-600' : 'text-gray-400 dark:text-gray-600'}`}>{rank.name}</span>
                <span className={`w-12 text-right font-bold ${isUser ? 'text-blue-600 dark:text-blue-400' : 'text-blue-600 dark:text-blue-400'}`}>{rank.wpm}</span>
                <span className={`w-12 text-right text-sm ${isUser ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>{rank.errors}</span>
              </div>
            );
          })}
          
          {/* 기존의 분리되어 있던 '나'의 순위 표시는 제거됨 */}
        </div>
      </div>
    </div>
  );
};

export default Ranking;