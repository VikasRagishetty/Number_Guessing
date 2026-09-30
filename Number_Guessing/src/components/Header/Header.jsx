import React from 'react';
import {
  Volume2,
  VolumeX,
  BarChart2,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Flame,
  Trophy,
  Palette,
} from 'lucide-react';
import { Button } from '../common/Button/Button';
import { Badge } from '../common/Badge/Badge';
import { THEMES } from '../../constants/themes';
import './Header.css';

export function Header({
  score,
  streak,
  soundEnabled,
  onToggleSound,
  onOpenStats,
  onOpenRules,
  onResetGame,
  currentTheme,
  onSelectTheme,
}) {
  const [showThemeMenu, setShowThemeMenu] = React.useState(false);

  return (
    <header className="game-header glass-panel">
      <div className="header-left">
        <div className="logo-group">
          <div className="logo-icon-wrap">
            <Sparkles className="logo-icon animate-pulse-glow" size={24} />
          </div>
          <div className="logo-text-wrap">
            <h1 className="logo-title">QUANTUM<span className="text-gradient">GUESS</span></h1>
            <span className="logo-subtitle">Intelligent Number Deduction</span>
          </div>
        </div>
      </div>

      <div className="header-center">
        <div className="stat-pill">
          <Trophy size={16} className="pill-icon text-amber" />
          <span className="pill-label">Score</span>
          <span className="pill-value font-mono">{(score ?? 0).toLocaleString()}</span>
        </div>

        <div className="stat-pill">
          <Flame size={16} className="pill-icon text-rose" />
          <span className="pill-label">Streak</span>
          <span className="pill-value font-mono">{streak ?? 0}x</span>
          {(streak ?? 0) >= 3 && <Badge variant="hot" size="sm">🔥 On Fire</Badge>}
        </div>
      </div>

      <div className="header-right">
        {/* Theme Picker */}
        <div className="theme-picker-wrapper">
          <Button
            variant="glass"
            size="icon"
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            title="Change Theme"
            aria-label="Theme selector"
          >
            <Palette size={18} />
          </Button>

          {showThemeMenu && (
            <div className="theme-dropdown glass-panel animate-slide-up">
              <span className="dropdown-label">Theme Skins</span>
              {THEMES.map((th) => (
                <button
                  key={th.id}
                  className={`theme-option ${currentTheme === th.id ? 'active' : ''}`}
                  onClick={() => {
                    onSelectTheme(th.id);
                    setShowThemeMenu(false);
                  }}
                >
                  <span className="theme-dot" style={{ backgroundColor: th.color }} />
                  <span>{th.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sound Toggle */}
        <Button
          variant={soundEnabled ? 'glass' : 'secondary'}
          size="icon"
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          aria-label="Toggle Sound"
        >
          {soundEnabled ? <Volume2 size={18} className="text-cyan" /> : <VolumeX size={18} />}
        </Button>

        {/* Stats Trigger */}
        <Button
          variant="glass"
          size="icon"
          onClick={onOpenStats}
          title="Player Statistics"
          aria-label="View Stats"
        >
          <BarChart2 size={18} />
        </Button>

        {/* Rules Trigger */}
        <Button
          variant="glass"
          size="icon"
          onClick={onOpenRules}
          title="Rules & Guide"
          aria-label="Game Rules"
        >
          <HelpCircle size={18} />
        </Button>

        {/* Reset Game */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onResetGame}
          icon={RotateCcw}
          className="reset-btn"
        >
          New Round
        </Button>
      </div>
    </header>
  );
}
