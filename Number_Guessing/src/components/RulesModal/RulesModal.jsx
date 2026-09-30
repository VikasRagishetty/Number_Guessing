import React from 'react';
import { HelpCircle, Target, Zap, Bot, Flame, Thermometer, Keyboard } from 'lucide-react';
import { Modal } from '../common/Modal/Modal';
import { Button } from '../common/Button/Button';
import './RulesModal.css';

export function RulesModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quantum Intelligence Protocol & Rules" icon={HelpCircle} maxWidth="680px">
      <div className="rules-modal-container">
        {/* Game Modes Guide */}
        <div className="rule-block">
          <h4 className="rule-block-title">🎮 Game Modes Explained</h4>
          <div className="rules-mode-cards">
            <div className="rule-mode-card">
              <div className="mode-card-header">
                <Target size={18} className="text-cyan" />
                <strong>Classic Mode</strong>
              </div>
              <p>Guess the mystery integer within your allotted attempts. The Proximity Radar guides each step.</p>
            </div>

            <div className="rule-mode-card">
              <div className="mode-card-header">
                <Zap size={18} className="text-amber" />
                <strong>Time Attack</strong>
              </div>
              <p>Race the clock! Faster guesses award huge remaining-time score multipliers.</p>
            </div>

            <div className="rule-mode-card">
              <div className="mode-card-header">
                <Bot size={18} className="text-purple" />
                <strong>AI Reverse Guesser</strong>
              </div>
              <p>Think of a secret number. Let our algorithm deduce it using binary deduction in logarithmic steps!</p>
            </div>

            <div className="rule-mode-card">
              <div className="mode-card-header">
                <Flame size={18} className="text-rose" />
                <strong>Survival Streak</strong>
              </div>
              <p>Endless gauntlet! Each victory expands the range and lowers allowed tries. One loss resets your wave.</p>
            </div>
          </div>
        </div>

        {/* Proximity Heat Index */}
        <div className="rule-block">
          <h4 className="rule-block-title">🌡️ Proximity Radar Heat Index</h4>
          <div className="heat-legend-grid">
            <div className="heat-item heat-boiling">
              <span className="heat-emoji">🔥</span>
              <div className="heat-text">
                <strong>Boiling Hot</strong>
                <span>Distance ≤ 2 numbers or within 3% of range</span>
              </div>
            </div>
            <div className="heat-item heat-hot">
              <span className="heat-emoji">♨️</span>
              <div className="heat-text">
                <strong>Very Warm / Hot</strong>
                <span>Distance ≤ 5 numbers or within 8% of range</span>
              </div>
            </div>
            <div className="heat-item heat-warm">
              <span className="heat-emoji">🌤️</span>
              <div className="heat-text">
                <strong>Warm</strong>
                <span>Distance within 18% of range</span>
              </div>
            </div>
            <div className="heat-item heat-cold">
              <span className="heat-emoji">❄️</span>
              <div className="heat-text">
                <strong>Cold</strong>
                <span>Distance within 35% of range</span>
              </div>
            </div>
            <div className="heat-item heat-freezing">
              <span className="heat-emoji">🧊</span>
              <div className="heat-text">
                <strong>Freezing</strong>
                <span>More than 35% away from target</span>
              </div>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="rule-block">
          <h4 className="rule-block-title">⌨️ Keyboard Shortcuts</h4>
          <div className="shortcuts-grid">
            <div className="shortcut-row">
              <kbd className="key-badge">Enter</kbd>
              <span>Submit active guess</span>
            </div>
            <div className="shortcut-row">
              <kbd className="key-badge">Esc</kbd>
              <span>Close modals / dialogues</span>
            </div>
            <div className="shortcut-row">
              <kbd className="key-badge">0-9</kbd>
              <span>Quick numerical input</span>
            </div>
          </div>
        </div>

        <div className="rules-footer">
          <Button variant="primary" size="md" onClick={onClose}>
            Got It, Let's Play!
          </Button>
        </div>
      </div>
    </Modal>
  );
}
