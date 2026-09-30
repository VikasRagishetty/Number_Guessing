import React, { useState, useRef, useEffect } from 'react';
import { Send, Hash, Delete, CornerDownLeft, Grid } from 'lucide-react';
import { Button } from '../common/Button/Button';
import './InputControl.css';

export function InputControl({
  min,
  max,
  onSubmitGuess,
  disabled = false,
  shake = false,
}) {
  const [guessInput, setGuessInput] = useState('');
  const [showKeypad, setShowKeypad] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!guessInput.trim() || disabled) return;
    onSubmitGuess(guessInput);
    setGuessInput('');
  };

  const handleStep = (delta) => {
    const current = parseInt(guessInput, 10) || Math.floor((min + max) / 2);
    const next = Math.max(min, Math.min(max, current + delta));
    setGuessInput(next.toString());
  };

  const handleKeypadPress = (val) => {
    if (val === 'backspace') {
      setGuessInput((prev) => prev.slice(0, -1));
    } else if (val === 'enter') {
      handleSubmit();
    } else {
      setGuessInput((prev) => {
        const next = prev + val;
        if (Number(next) > max) return prev;
        return next;
      });
    }
  };

  return (
    <div className={`input-control-container ${shake ? 'animate-shake' : ''}`}>
      <form onSubmit={handleSubmit} className="guess-form">
        <div className="input-field-group">
          <Hash className="input-hash-icon" size={24} />
          <input
            ref={inputRef}
            type="number"
            min={min}
            max={max}
            value={guessInput}
            onChange={(e) => setGuessInput(e.target.value)}
            placeholder={`Enter integer (${min}–${max})`}
            className="guess-input font-mono"
            disabled={disabled}
            autoComplete="off"
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={disabled || !guessInput.trim()}
            icon={Send}
            className="submit-guess-btn"
          >
            Guess
          </Button>
        </div>

        {/* Quick Stepper Modifier Chips */}
        <div className="stepper-chips">
          <span className="stepper-label">Quick Step:</span>
          <button type="button" className="step-chip" onClick={() => handleStep(-10)} disabled={disabled}>-10</button>
          <button type="button" className="step-chip" onClick={() => handleStep(-5)} disabled={disabled}>-5</button>
          <button type="button" className="step-chip" onClick={() => handleStep(-1)} disabled={disabled}>-1</button>
          <button type="button" className="step-chip" onClick={() => handleStep(1)} disabled={disabled}>+1</button>
          <button type="button" className="step-chip" onClick={() => handleStep(5)} disabled={disabled}>+5</button>
          <button type="button" className="step-chip" onClick={() => handleStep(10)} disabled={disabled}>+10</button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowKeypad(!showKeypad)}
            className="keypad-toggle-btn"
            icon={Grid}
          >
            {showKeypad ? 'Hide Keypad' : 'Keypad'}
          </Button>
        </div>
      </form>

      {/* On-screen Cyber Keypad */}
      {showKeypad && (
        <div className="virtual-keypad glass-panel animate-slide-up">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              className="keypad-btn font-mono"
              onClick={() => handleKeypadPress(num.toString())}
              disabled={disabled}
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            className="keypad-btn keypad-special"
            onClick={() => handleKeypadPress('backspace')}
            disabled={disabled}
          >
            <Delete size={20} />
          </button>
          <button
            type="button"
            className="keypad-btn font-mono"
            onClick={() => handleKeypadPress('0')}
            disabled={disabled}
          >
            0
          </button>
          <button
            type="button"
            className="keypad-btn keypad-submit"
            onClick={() => handleKeypadPress('enter')}
            disabled={disabled || !guessInput.trim()}
          >
            <CornerDownLeft size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
