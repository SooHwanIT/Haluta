import { useState, useEffect } from 'react';
import { useTypingGame } from './hooks/useTypingGame';
import { useRanking } from './hooks/useRanking';
import TypingArea from './components/TypingArea';
import Stats from './components/Stats';
import Ranking from './components/Ranking';
import SubmitModal from './components/SubmitModal';
import { Sun, Moon, PanelLeftClose, PanelRightClose } from 'lucide-react';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { state: gameState, actions: gameActions } = useTypingGame();
  const { state: rankingState, actions: rankingActions } = useRanking();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (gameState.status === 'finished') {
      setIsModalOpen(true);
    }
  }, [gameState.status]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSubmitScore = async (name: string) => {
    await rankingActions.submitScore({ name, wpm: gameState.wpm, errors: gameState.errors });
  };

  return (
    <div className="gradient-bg min-h-screen font-sans transition-colors duration-300 ">
      <div className="relative min-h-screen bg-black/90 dark:bg-white/5">
        {/* === START: Modified Code === */}
        <header className="absolute top-0 left-0 p-4 z-50">
          <button onClick={toggleDarkMode} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        <div className="absolute top-0 right-0 p-4 z-50 lg:hidden">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
            {isSidebarOpen ? <PanelRightClose size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>
        {/* === END: Modified Code === */}

        <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 lg:gap-8">
          <main className="w-full max-w-3xl mx-auto transition-all duration-500 flex-grow flex flex-col items-center justify-center">
            <Stats wpm={gameState.wpm} time={gameState.time} errors={gameState.errors} currentTypos={gameState.currentTypos} />
            <TypingArea text={gameState.text} userInput={gameState.userInput} onUserInputChange={gameActions.handleUserInputChange} status={gameState.status} />
          </main>
          
          <aside className={`fixed lg:relative top-0 right-0 h-full lg:h-auto bg-white/70 dark:bg-black/50 backdrop-blur-xl lg:bg-transparent lg:dark:bg-transparent lg:backdrop-blur-none transition-all duration-300 ease-in-out z-40 ${isSidebarOpen ? 'translate-x-0 lg:w-80' : 'translate-x-full lg:w-0 lg:opacity-0'}`}>
            <Ranking 
              rankingList={rankingState.rankingList} 
              currentUserWpm={gameState.status === 'running' ? gameState.wpm : null} 
              errors={gameState.status === 'running' ? gameState.errors  : null}
              isOpen={isSidebarOpen} 
              onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
            />
          </aside>

          {!isSidebarOpen && (
            <div className="hidden lg:block fixed top-1/2 right-0 transform -translate-y-1/2 z-40">
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-l-full bg-white/50 dark:bg-black/30 backdrop-blur-lg text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-black/50 transition-colors" aria-label="랭킹 펼치기">
                <PanelLeftClose size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      <SubmitModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmitScore} stats={{ wpm: gameState.wpm, errors: gameState.errors, time: gameState.time }} submissionStatus={rankingState.submissionStatus} />
    </div>
  );
}