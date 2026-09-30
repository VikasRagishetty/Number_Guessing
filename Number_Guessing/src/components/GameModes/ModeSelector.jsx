import React from 'react';
import { Target, Zap, Bot, Flame } from 'lucide-react';
import { GAME_MODES } from '../../constants/gameModes';
import './ModeSelector.css';

const ICON_MAP = {
  Target,
  Zap,
  Bot,
  Flame,
};

export function ModeSelector({ activeMode, onSelectMode }) {
  return (
    <div className="mode-selector-container">
      <div className="mode-tabs glass-panel">
        {Object.values(GAME_MODES).map((mode) => {
          const Icon = ICON_MAP[mode.icon] || Target;
          const isActive = activeMode === mode.id;

          return (
            <button
              key={mode.id}
              className={`mode-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelectMode(mode.id)}
            >
              <Icon size={18} className="mode-tab-icon" />
              <span className="mode-tab-name">{mode.name}</span>
              {isActive && <div className="active-indicator" />}
            </button>
          );
        })}
      </div>
      <p className="mode-tagline text-muted">
        {GAME_MODES[activeMode.toUpperCase()]?.tagline || ''}
      </p>
    </div>
  );
}
