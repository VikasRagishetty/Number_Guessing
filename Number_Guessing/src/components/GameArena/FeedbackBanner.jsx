import React from 'react';
import { ArrowUp, ArrowDown, Award, AlertCircle, RotateCcw, Trophy, Zap, Flame } from 'lucide-react';
import { Button } from '../common/Button/Button';
import { Badge } from '../common/Badge/Badge';
import './FeedbackBanner.css';

export function FeedbackBanner({
  gameStatus,
  lastGuessFeedback,
  attemptsTaken,
  maxAttempts,
  secretNumber,
  scoreEarned,
  onPlayAgain,
  gameMode,
  survivalLevel,
  timeRemaining,
}) {
  if (gameStatus === 'WON') {
    return (
      <div className="game-result-card result-win animate-victory">
        <div className="win-trophy-wrap">
          <Trophy size={48} className="trophy-icon text-amber" />
        </div>
        <h2 className="result-title">QUANTUM ACCURACY!</h2>
        <p className="result-subtitle">
          You cracked the secret target <strong className="font-mono text-cyan">({secretNumber})</strong> in{' '}
          <strong className="font-mono text-main">{attemptsTaken}</strong> {attemptsTaken === 1 ? 'attempt' : 'attempts'}!
        </p>

        <div className="score-breakdown-grid">
          <div className="score-box">
            <span className="score-box-label">Round Score</span>
            <span className="score-box-val font-mono text-gradient">+{scoreEarned.toLocaleString()}</span>
          </div>
          {gameMode === 'survival' && (
            <div className="score-box">
              <span className="score-box-label">Survival Wave</span>
              <span className="score-box-val font-mono text-rose">Wave {survivalLevel}</span>
            </div>
          )}
          {gameMode === 'time_attack' && (
            <div className="score-box">
              <span className="score-box-label">Time Saved</span>
              <span className="score-box-val font-mono text-amber">+{timeRemaining}s</span>
            </div>
          )}
        </div>

        <Button
          variant="primary"
          size="lg"
          icon={RotateCcw}
          onClick={onPlayAgain}
          className="play-again-btn"
        >
          {gameMode === 'survival' ? `Advance to Wave ${survivalLevel}` : 'Play Next Round'}
        </Button>
      </div>
    );
  }

  if (gameStatus === 'LOST') {
    return (
      <div className="game-result-card result-loss animate-slide-up">
        <div className="loss-icon-wrap">
          <AlertCircle size={48} className="loss-icon text-rose" />
        </div>
        <h2 className="result-title">SYSTEM COMPROMISED</h2>
        <p className="result-subtitle">
          Out of attempts! The target secret integer was{' '}
          <strong className="font-mono text-rose target-reveal">{secretNumber}</strong>.
        </p>

        <Button
          variant="danger"
          size="lg"
          icon={RotateCcw}
          onClick={onPlayAgain}
          className="play-again-btn"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!lastGuessFeedback) return null;

  return (
    <div className={`feedback-alert animate-slide-up ${lastGuessFeedback === 'HIGH' ? 'alert-high' : 'alert-low'}`}>
      <div className="feedback-icon-box">
        {lastGuessFeedback === 'HIGH' ? (
          <ArrowDown size={22} className="alert-arrow-down" />
        ) : (
          <ArrowUp size={22} className="alert-arrow-up" />
        )}
      </div>
      <div className="feedback-message">
        <span className="feedback-headline">
          {lastGuessFeedback === 'HIGH' ? 'TOO HIGH!' : 'TOO LOW!'}
        </span>
        <span className="feedback-subtext">
          {lastGuessFeedback === 'HIGH'
            ? 'Your estimate was above the target. Pick a smaller number.'
            : 'Your estimate was below the target. Aim higher.'}
        </span>
      </div>
    </div>
  );
}
