import React, { useState, useEffect } from 'react';

// 아이콘 라이브러리가 없다면 이 부분을 주석 처리하거나 제거하세요.
import { X } from 'lucide-react';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
  stats: { wpm: number; errors: number; time: number };
  submissionStatus: 'idle' | 'loading' | 'success' | 'error';
}

const SubmitModal: React.FC<SubmitModalProps> = ({ isOpen, onClose, onSubmit, stats, submissionStatus }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) {
      const savedName = localStorage.getItem('typing-userName');
      if (savedName) setName(savedName);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('typing-userName', name.trim());
      onSubmit(name.trim());
    }
  };

  if (!isOpen) return null;

  return (
    // ▼ 1. 화면 전체를 덮는 배경입니다. 클릭하면 onClose 함수가 호출되어 모달이 닫힙니다.
    <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      
      {/* ▼ 2. 실제 모달 콘텐츠입니다. 여기를 클릭해도 이벤트가 배경으로 전파되지 않아 모달이 닫히지 않습니다. */}
      <div onClick={(e) => e.stopPropagation()} className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md m-4">
        
        {/* 닫기(X) 버튼 */}
        <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
           <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">기록 등록</h2>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">랭킹은 하루에 한 번만 등록할 수 있습니다.</p>
        
        <div className="grid grid-cols-2 gap-4 text-center mb-6">
          <div><p className="text-sm text-gray-500">분당 타수</p><p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.wpm}</p></div>
          <div><p className="text-sm text-gray-500">오타</p><p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.errors}</p></div>
        </div>

        {submissionStatus === 'success' ? (
          <div className="text-center">
            <p className="text-green-500 font-bold mb-4">성공적으로 등록되었습니다!</p>
            <button onClick={onClose} className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md">닫기</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="이름을 입력하세요" className="w-full  px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 mb-4" required />
            <button type="submit" disabled={submissionStatus === 'loading'} className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 disabled:bg-blue-400">
              {submissionStatus === 'loading' ? '등록 중...' : '등록하기'}
            </button>
            {submissionStatus === 'error' && <p className="text-red-500 text-sm text-center mt-2">등록에 실패했습니다. 이미 등록하셨을 수 있습니다.</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default SubmitModal;