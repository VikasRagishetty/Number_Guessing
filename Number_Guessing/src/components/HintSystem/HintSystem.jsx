import React from 'react';
import { Lightbulb, Lock, Unlock, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card } from '../common/Card/Card';
import { Button } from '../common/Button/Button';
import { Badge } from '../common/Badge/Badge';
import './HintSystem.css';

export function HintSystem({
  availableHints,
  unlockedHints,
  onUnlockHint,
  disabled = false,
}) {
  return (
    <Card className="hints-card" padding="md">
      <div className="hints-header">
        <div className="hints-title-wrap">
          <Lightbulb size={20} className="hints-icon text-amber" />
          <h3 className="hints-title">Quantum Intelligence Clues</h3>
        </div>
        <Badge variant="warning" size="sm">
          {unlockedHints.length} / {availableHints.length} Unlocked
        </Badge>
      </div>

      <div className="hints-grid">
        {availableHints.map((hint) => {
          const isUnlocked = unlockedHints.some((h) => h.id === hint.id);

          return (
            <div
              key={hint.id}
              className={`hint-item ${isUnlocked ? 'hint-unlocked animate-slide-up' : 'hint-locked'}`}
            >
              <div className="hint-meta">
                <span className="hint-type-icon">{hint.icon}</span>
                <span className="hint-name">{hint.title}</span>
              </div>

              <div className="hint-content">
                {isUnlocked ? (
                  <div className="hint-revealed-text">
                    <CheckCircle2 size={16} className="text-emerald" />
                    <span>{hint.description}</span>
                  </div>
                ) : (
                  <Button
                    variant="glass"
                    size="sm"
                    disabled={disabled}
                    onClick={() => onUnlockHint(hint.id)}
                    icon={Lock}
                    className="unlock-btn"
                  >
                    Unlock Clue (-{hint.cost} pts)
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
