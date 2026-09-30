import React, { useState } from 'react';
import { Button } from '../common/Button/Button';
import './ModeSelector.css';

export function MultiplayerSetup({ onLockNumber }) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleLock = () => {
    const num = parseInt(inputValue, 10);
    
    if (!inputValue) {
      setError('Please enter a number.');
      return;
    }
    if (isNaN(num)) {
      setError('Invalid number.');
      return;
    }
    if (num < 1) {
      setError('Number must be at least 1.');
      return;
    }
    if (num > 100) {
      setError('Number must be at most 100.');
      return;
    }

    setError('');
    onLockNumber(num);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', maxWidth: '400px', margin: '2rem auto' }}>
      <h2 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Player 1 — Choose a Secret Number</h2>
      <p style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Enter a number between 1 and 100.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="password"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError('');
          }}
          placeholder="Secret Number..."
          style={{
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--surface-glass-border)',
            background: 'var(--surface-input)',
            color: 'var(--text-main)',
            fontSize: '1.2rem',
            textAlign: 'center'
          }}
        />
        
        {error && <p style={{ color: 'var(--accent-danger)', margin: 0, fontSize: '0.9rem' }}>{error}</p>}

        <Button 
          variant="primary" 
          onClick={handleLock}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          Lock Number
        </Button>
      </div>
    </div>
  );
}
