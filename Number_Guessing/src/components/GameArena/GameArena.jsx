import React from 'react';
import { Card } from '../common/Card/Card';
import { ProximityRadar } from './ProximityRadar';
import { RangeIndicator } from './RangeIndicator';
import { InputControl } from './InputControl';
import { FeedbackBanner } from './FeedbackBanner';
import './GameArena.css';

export function GameArena({
  gameStatus,
  secretNumber,
  attemptsTaken,
  maxAttempts,
  activeConfig,
  currentBounds,
  lastProximity,
  lastGuessFeedback,
  shakeTrigger,
  scoreEarned,
  onSubmitGuess,
  onPlayAgain,
  gameMode,
  survivalLevel,
  timer,
}) {
  return (
    <Card className="game-arena-card" glow glowColor={gameStatus === 'WON' ? 'success' : 'primary'} padding="lg">
      {/* Visual Proximity Meter & Radar */}
      <ProximityRadar
        proximity={lastProximity}
        attemptsRemaining={attemptsTaken}
        maxAttempts={maxAttempts}
        gameMode={gameMode}
        timer={timer}
      />

      {/* Dynamic Range Bounds Slider */}
      <RangeIndicator
        totalMin={activeConfig.min}
        totalMax={activeConfig.max}
        currentMin={currentBounds.min}
        currentMax={currentBounds.max}
      />

      {/* Input Control or Result Card */}
      {gameStatus === 'PLAYING' ? (
        <>
          <InputControl
            min={activeConfig.min}
            max={activeConfig.max}
            onSubmitGuess={onSubmitGuess}
            disabled={gameStatus !== 'PLAYING'}
            shake={shakeTrigger > 0}
          />
          <FeedbackBanner
            gameStatus={gameStatus}
            lastGuessFeedback={lastGuessFeedback}
            attemptsTaken={attemptsTaken}
            maxAttempts={maxAttempts}
            secretNumber={secretNumber}
            scoreEarned={scoreEarned}
            onPlayAgain={onPlayAgain}
            gameMode={gameMode}
            survivalLevel={survivalLevel}
            timeRemaining={timer.secondsLeft}
          />
        </>
      ) : (
        <FeedbackBanner
          gameStatus={gameStatus}
          lastGuessFeedback={lastGuessFeedback}
          attemptsTaken={attemptsTaken}
          maxAttempts={maxAttempts}
          secretNumber={secretNumber}
          scoreEarned={scoreEarned}
          onPlayAgain={onPlayAgain}
          gameMode={gameMode}
          survivalLevel={survivalLevel}
          timeRemaining={timer.secondsLeft}
        />
      )}
    </Card>
  );
}
