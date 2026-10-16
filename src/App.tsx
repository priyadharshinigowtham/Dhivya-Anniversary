import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { QuizPage } from './components/QuizPage';
import { LetterPage } from './components/LetterPage';
import { PolaroidPage } from './components/PolaroidPage';
import { MemoryLanePage } from './components/MemoryLanePage';
import { EndingPage } from './components/EndingPage';
import { BackgroundMusic } from './components/BackgroundMusic';

type PageState = 'landing' | 'quiz' | 'letter' | 'polaroid' | 'memorylane' | 'ending';

function App() {
  const [page, setPage] = useState<PageState>('landing');
  // Music starts as soon as the page loads — Song 1 plays on landing
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(true);
  const [isMusicMuted, setIsMusicMuted] = useState<boolean>(false);
  // Track current stage for MemoryLane
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [stageCount, setStageCount] = useState<number>(0);

  // Landing → Quiz (Song 1 keeps playing)
  const handleBegin = () => {
    setIsMusicPlaying(true);
    setPage('quiz');
  };

  // Quiz → Letter (BackgroundMusic switches to Song 2 via page prop)
  const handleQuizContinue = () => {
    setPage('letter');
  };

  // Letter → Polaroid (BackgroundMusic switches to Song 3 via page prop)
  const handleLetterContinue = () => {
    setPage('polaroid');
  };

  // Polaroid → Memory Lane (BackgroundMusic mutes; MemoryLane manages its own songs)
  const handlePolaroidContinue = () => {
    setIsMusicPlaying(true);
    setPage('memorylane');
  };

  // Memory Lane → Ending (Song 1 resumes via page prop)
  const handleMemoryLaneContinue = () => {
    setIsMusicPlaying(true);
    setPage('ending');
  };

  // Ending → Landing (Song 1 resumes)
  const handleRestart = () => {
    setPage('landing');
    setIsMusicPlaying(true);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background Music — 3-song dynamic switcher */}
      <BackgroundMusic
        isPlaying={isMusicPlaying}
        setIsPlaying={setIsMusicPlaying}
        isMuted={isMusicMuted}
        setIsMuted={setIsMusicMuted}
        page={page}
        currentStage={currentStage}
        stageCount={stageCount}
      />

      {/* Page Routing */}
      <div className="w-full h-full">
        {page === 'landing' && (
          <div className="w-full h-full animate-fade-in">
            <LandingPage onBegin={handleBegin} />
          </div>
        )}
        {page === 'quiz' && (
          <div className="w-full h-full animate-fade-in">
            <QuizPage onContinue={handleQuizContinue} />
          </div>
        )}
        {page === 'letter' && (
          <div className="w-full h-full animate-fade-in">
            <LetterPage onContinue={handleLetterContinue} />
          </div>
        )}
        {page === 'polaroid' && (
          <div className="w-full h-full animate-fade-in">
            <PolaroidPage onContinue={handlePolaroidContinue} />
          </div>
        )}
        {page === 'memorylane' && (
          <div className="w-full h-full animate-fade-in">
            <MemoryLanePage 
              onContinue={handleMemoryLaneContinue} 
              isPlaying={isMusicPlaying}
              isMuted={isMusicMuted}
            />
          </div>
        )}
        {page === 'ending' && (
          <div className="w-full h-full animate-fade-in">
            <EndingPage onRestart={handleRestart} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
