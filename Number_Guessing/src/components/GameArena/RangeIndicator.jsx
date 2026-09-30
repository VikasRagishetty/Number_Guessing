import React from 'react';
import './RangeIndicator.css';

export function RangeIndicator({ totalMin, totalMax, currentMin, currentMax }) {
  const totalSpan = totalMax - totalMin || 1;
  const leftPercent = Math.max(0, Math.min(100, ((currentMin - totalMin) / totalSpan) * 100));
  const widthPercent = Math.max(3, Math.min(100, ((currentMax - currentMin) / totalSpan) * 100));

  return (
    <div className="range-indicator-container">
      <div className="range-labels">
        <div className="range-boundary min-bound">
          <span className="bound-tag">MIN</span>
          <span className="bound-val font-mono">{totalMin}</span>
        </div>
        <div className="narrowed-scope-tag">
          Active Search Window: <strong className="font-mono text-cyan">[{currentMin} – {currentMax}]</strong>
        </div>
        <div className="range-boundary max-bound">
          <span className="bound-tag">MAX</span>
          <span className="bound-val font-mono">{totalMax}</span>
        </div>
      </div>

      <div className="range-track-wrapper">
        <div className="range-track-bg" />
        <div
          className="range-active-window"
          style={{
            left: `${leftPercent}%`,
            width: `${widthPercent}%`,
          }}
        >
          <div className="window-handle left-handle" />
          <div className="mystery-badge font-mono">?</div>
          <div className="window-handle right-handle" />
        </div>
      </div>
    </div>
  );
}
