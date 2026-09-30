import React from 'react';
import { Bot, ArrowUp, ArrowDown, Check, RotateCcw, Play, Sparkles, BrainCircuit } from 'lucide-react';
import { Button } from '../common/Button/Button';
import { Card } from '../common/Card/Card';
import { Badge } from '../common/Badge/Badge';
import { useAiGuesser } from '../../hooks/useAiGuesser';
import './AiGuesserArena.css';

export function AiGuesserArena() {
  const {
    minBound,
    setMinBound,
    maxBound,
    setMaxBound,
    currentMin,
    currentMax,
    currentGuess,
    stepCount,
    aiStatus,
    guessHistory,
    aiMessage,
    startAiSearch,
    handleUserFeedback,
    resetAi,
  } = useAiGuesser();

  const handleStart = (e) => {
    e.preventDefault();
    startAiSearch(Number(minBound), Number(maxBound));
  };

  return (
    <div className="ai-arena-container">
      {aiStatus === 'CONFIG' ? (
        <Card className="ai-config-card" glow glowColor="cyan" padding="lg">
          <div className="ai-config-header">
            <div className="ai-avatar pulse-glow">
              <Bot size={40} className="text-cyan" />
            </div>
            <h2 className="ai-card-title">Challenge the AI Guesser</h2>
            <p className="ai-card-desc">
              Think of any secret integer within your custom range. Our binary deduction engine will attempt to isolate and guess your number in logarithmic time!
            </p>
          </div>

          <form onSubmit={handleStart} className="ai-config-form">
            <div className="ai-range-inputs">
              <div className="range-field">
                <label htmlFor="ai-min-bound">Lowest Range</label>
                <input
                  id="ai-min-bound"
                  type="number"
                  value={minBound}
                  onChange={(e) => setMinBound(parseInt(e.target.value, 10) || 1)}
                  className="input-field"
                  required
                />
              </div>
              <div className="range-divider">to</div>
              <div className="range-field">
                <label htmlFor="ai-max-bound">Highest Range</label>
                <input
                  id="ai-max-bound"
                  type="number"
                  value={maxBound}
                  onChange={(e) => setMaxBound(parseInt(e.target.value, 10) || 100)}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="ai-presets">
              <span className="preset-label">Quick Ranges:</span>
              <button
                type="button"
                className="preset-chip"
                onClick={() => { setMinBound(1); setMaxBound(100); }}
              >
                1 – 100
              </button>
              <button
                type="button"
                className="preset-chip"
                onClick={() => { setMinBound(1); setMaxBound(500); }}
              >
                1 – 500
              </button>
              <button
                type="button"
                className="preset-chip"
                onClick={() => { setMinBound(1); setMaxBound(1000); }}
              >
                1 – 1,000
              </button>
              <button
                type="button"
                className="preset-chip"
                onClick={() => { setMinBound(1); setMaxBound(10000); }}
              >
                1 – 10,000
              </button>
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              icon={Play}
              className="start-ai-btn"
            >
              I Have My Secret Number, Start!
            </Button>
          </form>
        </Card>
      ) : (
        <div className="ai-active-grid">
          {/* Main AI Interaction Card */}
          <Card className="ai-play-card" glow glowColor={aiStatus === 'WON' ? 'success' : 'cyan'} padding="lg">
            <div className="ai-status-header">
              <div className="ai-avatar-active">
                {aiStatus === 'THINKING' ? (
                  <BrainCircuit size={32} className="ai-spin text-purple" />
                ) : (
                  <Bot size={32} className="text-cyan animate-float" />
                )}
              </div>
              <div className="ai-header-meta">
                <div className="ai-step-badge">
                  <Badge variant="cyan" size="sm">
                    Step #{stepCount}
                  </Badge>
                  <span className="active-scope font-mono">
                    Search Scope: [ {currentMin} ... {currentMax} ] ({Math.max(0, currentMax - currentMin + 1)} possibilities)
                  </span>
                </div>
                <p className="ai-speech-bubble">{aiMessage}</p>
              </div>
            </div>

            {/* AI Guess Display */}
            <div className="ai-guess-display">
              <span className="guess-caption">AI'S CURRENT HYPOTHESIS</span>
              <div className="ai-guess-number font-mono animate-slide-up">
                {aiStatus === 'THINKING' ? '...' : currentGuess}
              </div>
            </div>

            {/* Feedback Controls */}
            {aiStatus === 'GUESSING' && (
              <div className="ai-feedback-actions">
                <Button
                  variant="secondary"
                  size="lg"
                  icon={ArrowUp}
                  onClick={() => handleUserFeedback('HIGHER')}
                  className="feedback-btn higher-btn"
                >
                  Higher! (My number is bigger)
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  icon={Check}
                  onClick={() => handleUserFeedback('CORRECT')}
                  className="feedback-btn correct-btn"
                >
                  Bingo! Correct!
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  icon={ArrowDown}
                  onClick={() => handleUserFeedback('LOWER')}
                  className="feedback-btn lower-btn"
                >
                  Lower! (My number is smaller)
                </Button>
              </div>
            )}

            {(aiStatus === 'WON' || aiStatus === 'ERROR') && (
              <div className="ai-conclusion-actions">
                <Button
                  variant="accent"
                  size="lg"
                  icon={RotateCcw}
                  onClick={resetAi}
                >
                  Play Another Round
                </Button>
              </div>
            )}
          </Card>

          {/* AI Step Deductions Log */}
          <Card className="ai-log-card" padding="md">
            <h3 className="log-title">AI Deduction History</h3>
            <div className="ai-history-list">
              {guessHistory.length === 0 ? (
                <div className="empty-history">Deduction steps will appear here.</div>
              ) : (
                guessHistory.map((item, idx) => (
                  <div key={idx} className="ai-history-row animate-slide-up">
                    <span className="history-step font-mono">#{item.step}</span>
                    <span className="history-guess font-mono">{item.guess}</span>
                    <Badge
                      variant={
                        item.feedback === 'CORRECT'
                          ? 'success'
                          : item.feedback === 'HIGHER'
                          ? 'warning'
                          : 'cyan'
                      }
                      size="sm"
                    >
                      {item.feedback === 'CORRECT' ? '🎯 MATCH' : item.feedback === 'HIGHER' ? '⬆️ HIGHER' : '⬇️ LOWER'}
                    </Badge>
                    <span className="history-range font-mono">{item.remainingRange}</span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
