import React, { useState, useEffect } from 'react';

// 아이콘 컴포넌트들 (SVG)
const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const BlogIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const CoffeeIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
);

// 토글 스위치 컴포넌트
const ToggleSwitch = ({ label, enabled, setEnabled }) => (
  <div className="flex items-center justify-between w-full">
    <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
    <button
      onClick={() => setEnabled(!enabled)}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
        enabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ease-in-out ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

// 메인 InfoModal 컴포넌트 (개선됨)
function InfoModal() {
  // 호버 상태를 JS로 직접 제어
  const [isHovered, setIsHovered] = useState(false);
  
  // 토글 버튼 상태 관리
  const [powerTyping, setPowerTyping] = useState(false);
  const [anotherFeature, setAnotherFeature] = useState(true);

  const items = [
    <a key="github" href="https://github.com/SooHwanIT" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
      <GithubIcon className="w-5 h-5" />
      <span>GitHub</span>
    </a>,
    <a key="blog" href="https://itosablog.tistory.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
      <BlogIcon className="w-5 h-5" />
      <span>Blog</span>
    </a>,
    // 'Buy Me a Coffee'와 같은 후원 플랫폼 링크입니다. 'soohwanit'을 실제 아이디로 변경하세요.
    <a key="coffee" href="https://buymeacoffee.com/ghks36912w" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
      <CoffeeIcon className="w-5 h-5" />
      <span>Buy me a coffee</span>
    </a>,
    <ToggleSwitch key="power-typing" label="파워 타이핑 모드" enabled={powerTyping} setEnabled={setPowerTyping} />,
    // <ToggleSwitch key="another-feature" label="다른 기능 활성화" enabled={anotherFeature} setEnabled={setAnotherFeature} />,
  ];

  return (
    // onMouseEnter와 onMouseLeave를 사용하여 호버 영역 전체의 상태를 제어
    <div 
      className="fixed bottom-5 right-5 z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* 확장되는 패널: isHovered 상태에 따라 클래스가 동적으로 변경됨 */}
      <div 
        className={`
          absolute bottom-0 right-0
          w-60 p-4
          bg-white/80 dark:bg-gray-800/80
          backdrop-blur-sm
          border border-gray-200/50 dark:border-gray-700/50
          rounded-lg shadow-2xl
          
          origin-bottom-right
          transform transition-all duration-300 ease-out
          
          ${isHovered 
            ? 'scale-100 opacity-100 pointer-events-auto' 
            : 'scale-95 opacity-0 pointer-events-none'}
        `}
      >
        {/* 내부 컨텐츠 */}
        <div className="w-full flex flex-col gap-3">
            {items.map((item, index) => (
                <div
                    key={index}
                    className={`
                      transform transition-all duration-300 ease-out
                      ${isHovered 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-2'}
                    `}
                    style={{ transitionDelay: `${150 + index * 50}ms` }}
                >
                    {item}
                </div>
            ))}
        </div>
      </div>

      {/* Haluta 로고 */}
      <div 
        className="
          p-3
          text-sm font-mono font-semibold text-gray-400 dark:text-gray-500 
          select-none
        "
      >
        Haluta
      </div>
    </div>
  );
}


export default InfoModal;