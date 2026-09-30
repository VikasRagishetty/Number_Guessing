import React from 'react';
import { Flame, Snowflake, Sun, Thermometer, Zap } from 'lucide-react';
import './ProximityRadar.css';

export function ProximityRadar({ proximity, attemptsRemaining, maxAttempts, gameMode, timer }) {
  const percent = proximity ? proximity.percentClose : 0;
  const temp = proximity ? proximity.temp : 'DEFAULT';
  const label = proximity ? proximity.label : 'Waiting for 1st Guess';
  const emoji = proximity ? proximity.emoji : '🎯';

  // Calculate SVG circular stroke offset
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className={`proximity-radar-wrapper temp-${temp.toLowerCase()}`}>
      <div className="radar-meter">
        <svg className="radar-svg" viewBox="0 0 160 160">
          <defs>
            <linearGradient id="meterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--temp-freezing)" />
              <stop offset="50%" stopColor="var(--temp-warm)" />
              <stop offset="100%" stopColor="var(--temp-boiling)" />
            </linearGradient>
          </defs>
          {/* Background Track */}
          <circle
            className="radar-track"
            cx="80"
            cy="80"
            r={radius}
          />
          {/* Dynamic Fill Ring */}
          <circle
            className="radar-progress"
            cx="80"
            cy="80"
            r={radius}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: isNaN(strokeDashoffset) ? circumference : strokeDashoffset,
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="radar-center-content">
          <span className="radar-emoji">{emoji}</span>
          <span className="radar-percent font-mono">{percent}%</span>
          <span className="radar-closeness-tag">PROXIMITY</span>
        </div>
      </div>

      <div className="radar-meta">
        <div className="radar-status-pill">
          <Thermometer size={16} className="radar-status-icon" />
          <span className="radar-status-text">{label}</span>
        </div>

        <div className="attempts-countdown">
          {gameMode === 'time_attack' ? (
            <div className="time-attack-badge">
              <Zap size={14} className="text-amber" />
              <span className="font-mono">{timer?.secondsLeft || 0}s remaining</span>
            </div>
          ) : (
            <div className="attempts-badge">
              <span>Attempts:</span>
              <strong className="font-mono text-main">
                {Math.max(0, maxAttempts - attemptsRemaining)} / {maxAttempts}
              </strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
