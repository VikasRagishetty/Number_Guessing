import React, { useState } from 'react';
import { Sliders, Shield, Zap, Flame, Sparkles } from 'lucide-react';
import { DIFFICULTY_PRESETS } from '../../constants/difficulty';
import { Modal } from '../common/Modal/Modal';
import { Button } from '../common/Button/Button';
import './DifficultySelector.css';

export function DifficultySelector({
  activeDifficulty,
  onSelectDifficulty,
  customRange,
  onUpdateCustomRange,
}) {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [tempCustom, setTempCustom] = useState(customRange);

  const handleCustomSave = (e) => {
    e.preventDefault();
    if (tempCustom.min >= tempCustom.max) {
      alert('Minimum range must be strictly less than Maximum!');
      return;
    }
    onUpdateCustomRange(tempCustom);
    onSelectDifficulty('CUSTOM');
    setShowCustomModal(false);
  };

  return (
    <div className="difficulty-container">
      <div className="difficulty-pills">
        {Object.entries(DIFFICULTY_PRESETS).map(([key, diff]) => {
          const isActive = activeDifficulty === key;

          if (key === 'CUSTOM') {
            return (
              <button
                key={key}
                className={`diff-btn ${isActive ? 'active' : ''}`}
                onClick={() => setShowCustomModal(true)}
                title="Configure custom range & rules"
              >
                <Sliders size={15} />
                <span>Custom Range</span>
              </button>
            );
          }

          return (
            <button
              key={key}
              className={`diff-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelectDifficulty(key)}
            >
              <span>{diff.badge}</span>
              <span className="diff-desc-short font-mono">1–{diff.max}</span>
            </button>
          );
        })}
      </div>

      {/* Custom Range Settings Modal */}
      <Modal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        title="Custom Game Parameters"
        icon={Sliders}
      >
        <form onSubmit={handleCustomSave} className="custom-diff-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="custom-min">Min Number</label>
              <input
                id="custom-min"
                type="number"
                value={tempCustom.min}
                onChange={(e) => setTempCustom({ ...tempCustom, min: parseInt(e.target.value, 10) || 1 })}
                className="input-field"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="custom-max">Max Number</label>
              <input
                id="custom-max"
                type="number"
                value={tempCustom.max}
                onChange={(e) => setTempCustom({ ...tempCustom, max: parseInt(e.target.value, 10) || 100 })}
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="custom-attempts">Allowed Attempts</label>
              <input
                id="custom-attempts"
                type="number"
                min="1"
                max="50"
                value={tempCustom.maxAttempts}
                onChange={(e) =>
                  setTempCustom({ ...tempCustom, maxAttempts: parseInt(e.target.value, 10) || 10 })
                }
                className="input-field"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="custom-time">Time Limit (Seconds)</label>
              <input
                id="custom-time"
                type="number"
                min="10"
                max="300"
                value={tempCustom.timeLimit}
                onChange={(e) =>
                  setTempCustom({ ...tempCustom, timeLimit: parseInt(e.target.value, 10) || 30 })
                }
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="custom-modal-actions">
            <Button variant="ghost" onClick={() => setShowCustomModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Apply & Play
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
