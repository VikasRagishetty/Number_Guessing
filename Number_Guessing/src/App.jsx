import React, { useState, useEffect } from 'react';
import { Header } from './components/Header/Header';
import { ModeSelector } from './components/GameModes/ModeSelector';
import { DifficultySelector } from './components/GameModes/DifficultySelector';
import { AiGuesserArena } from './components/GameModes/AiGuesserArena';
import { MultiplayerSetup } from './components/GameModes/MultiplayerSetup';
import { GameArena } from './components/GameArena/GameArena';
import { HintSystem } from './components/HintSystem/HintSystem';
import { HistoryLog } from './components/HistoryLog/HistoryLog';
import { StatsModal } from './components/StatsModal/StatsModal';
import { RulesModal } from './components/RulesModal/RulesModal';
import { ConfettiEffect } from './components/ConfettiEffect/ConfettiEffect';
import { useNumberGuessing } from './hooks/useNumberGuessing';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

export function App() {
  const [currentTheme, setCurrentTheme] = useLocalStorage('quantum_guess_theme', 'default');
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  // Core Game State Hook
  const {
    gameMode,
    setGameMode,
    difficultyKey,
    setDifficultyKey,
    customRange,
    setCustomRange,
    activeConfig,
    secretNumber,
    gameStatus,
    attemptsTaken,
    maxAttempts,
    guessHistory,
    currentBounds,
    lastProximity,
    lastGuessFeedback,
    shakeTrigger,
    scoreEarned,
    availableHints,
    unlockedHints,
    unlockHint,
    stats,
    resetStats,
    survivalLevel,
    survivalStreak,
    timer,
    startNewGame,
    submitGuess,
    setMultiplayerSecret,
    soundFX,
  } = useNumberGuessing();

  // Sync theme with root document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  return (
    <div className="app-wrapper">
      {/* Victory Confetti */}
      <ConfettiEffect active={gameStatus === 'WON'} />

      {/* Top Navigation & Score Bar */}
      <Header
        score={stats.highScore}
        streak={gameMode === 'survival' ? survivalStreak : stats.currentStreak}
        soundEnabled={soundFX.soundEnabled}
        onToggleSound={soundFX.toggleSound}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenRules={() => setIsRulesOpen(true)}
        onResetGame={() => startNewGame()}
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
      />

      <main className="main-content">
        {/* Game Mode Tab Bar */}
        <ModeSelector activeMode={gameMode} onSelectMode={setGameMode} />

        {/* Difficulty Selection (for Classic, Time Attack, Custom) */}
        {gameMode !== 'ai_guesser' && gameMode !== 'survival' && (
          <DifficultySelector
            activeDifficulty={difficultyKey}
            onSelectDifficulty={setDifficultyKey}
            customRange={customRange}
            onUpdateCustomRange={setCustomRange}
          />
        )}

        {/* Conditional Arena Renderer */}
        {gameStatus === 'MULTIPLAYER_SETUP' ? (
          <MultiplayerSetup onLockNumber={setMultiplayerSecret} />
        ) : gameMode === 'ai_guesser' ? (
          <AiGuesserArena />
        ) : (
          <div className="game-layout-grid">
            {/* Center Interactive Game Arena */}
            <GameArena
              gameStatus={gameStatus}
              secretNumber={secretNumber}
              attemptsTaken={attemptsTaken}
              maxAttempts={maxAttempts}
              activeConfig={activeConfig}
              currentBounds={currentBounds}
              lastProximity={lastProximity}
              lastGuessFeedback={lastGuessFeedback}
              shakeTrigger={shakeTrigger}
              scoreEarned={scoreEarned}
              onSubmitGuess={submitGuess}
              onPlayAgain={() => startNewGame()}
              gameMode={gameMode}
              survivalLevel={survivalLevel}
              timer={timer}
            />

            {/* Sidebar: Clues & History */}
            <div className="side-panel">
              <HintSystem
                availableHints={availableHints}
                unlockedHints={unlockedHints}
                onUnlockHint={unlockHint}
                disabled={gameStatus !== 'PLAYING'}
              />

              <HistoryLog guessHistory={guessHistory} />
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        onResetStats={resetStats}
      />

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-left">
          <span className="footer-brand">QUANTUM GUESS</span>
          <span>• Powered by React & Modern Web Audio</span>
        </div>
        <div className="footer-right">
          <span>Proximity Radar • AI Deductions • Time Attack</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
