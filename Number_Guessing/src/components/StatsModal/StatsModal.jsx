import React from 'react';
import { BarChart2, Trophy, Flame, Target, Percent, Trash2, Award } from 'lucide-react';
import { Modal } from '../common/Modal/Modal';
import { Button } from '../common/Button/Button';
import { Badge } from '../common/Badge/Badge';
import './StatsModal.css';

export function StatsModal({ isOpen, onClose, stats, onResetStats }) {
  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;
  const avgGuesses = stats.gamesWon > 0 ? (stats.totalGuesses / stats.gamesWon).toFixed(1) : 0;

  // Maximum count for distribution bar scaling
  const maxBar = Math.max(1, ...Object.values(stats.attemptsDistribution || {}));

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear all statistics and history?')) {
      onResetStats();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quantum Career Statistics" icon={BarChart2} maxWidth="640px">
      <div className="stats-modal-container">
        {/* Metric Cards Grid */}
        <div className="stats-metric-grid">
          <div className="metric-box">
            <span className="metric-num font-mono">{stats.gamesPlayed}</span>
            <span className="metric-label">Played</span>
          </div>
          <div className="metric-box">
            <span className="metric-num font-mono text-cyan">{winRate}%</span>
            <span className="metric-label">Win Rate</span>
          </div>
          <div className="metric-box">
            <span className="metric-num font-mono text-rose">{stats.currentStreak}</span>
            <span className="metric-label">Current Streak</span>
          </div>
          <div className="metric-box">
            <span className="metric-num font-mono text-amber">{stats.bestStreak}</span>
            <span className="metric-label">Max Streak</span>
          </div>
        </div>

        {/* Attempts Distribution */}
        <div className="distribution-section">
          <h4 className="section-title">Attempts Distribution (Wins)</h4>
          <div className="distribution-bars">
            {Object.entries(stats.attemptsDistribution || {}).map(([attempts, count]) => {
              const widthPct = Math.max(8, (count / maxBar) * 100);
              return (
                <div key={attempts} className="dist-row">
                  <span className="dist-label font-mono">{attempts}</span>
                  <div className="dist-track">
                    <div
                      className={`dist-fill ${count > 0 ? 'fill-active' : ''}`}
                      style={{ width: `${count > 0 ? widthPct : 6}%` }}
                    >
                      <span className="dist-val font-mono">{count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Matches Log */}
        <div className="recent-matches-section">
          <h4 className="section-title">Recent Matches</h4>
          <div className="recent-matches-list">
            {(stats.history || []).length === 0 ? (
              <div className="empty-matches">No completed games logged yet.</div>
            ) : (
              (stats.history || []).slice(0, 5).map((match) => (
                <div key={match.id} className="match-row">
                  <div className="match-left">
                    <Badge variant={match.won ? 'success' : 'danger'} size="sm">
                      {match.won ? 'VICTORY' : 'DEFEAT'}
                    </Badge>
                    <span className="match-mode">{match.mode?.replace('_', ' ').toUpperCase()}</span>
                  </div>
                  <div className="match-right">
                    <span className="match-detail font-mono">
                      {match.won ? `${match.attempts} tries` : `Target: ${match.secret}`}
                    </span>
                    <span className="match-score font-mono text-gradient">
                      +{match.score?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="stats-footer-actions">
          <Button variant="ghost" size="sm" icon={Trash2} onClick={handleReset} className="reset-stats-btn">
            Clear All History
          </Button>
          <Button variant="primary" size="md" onClick={onClose}>
            Back to Game
          </Button>
        </div>
      </div>
    </Modal>
  );
}
