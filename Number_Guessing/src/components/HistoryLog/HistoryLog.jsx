import React from 'react';
import { History, ArrowUp, ArrowDown, Target } from 'lucide-react';
import { Card } from '../common/Card/Card';
import { Badge } from '../common/Badge/Badge';
import './HistoryLog.css';

export function HistoryLog({ guessHistory }) {
  return (
    <Card className="history-card" padding="md">
      <div className="history-header">
        <div className="history-title-wrap">
          <History size={20} className="history-icon text-cyan" />
          <h3 className="history-title">Round History</h3>
        </div>
        <Badge variant="default" size="sm">
          {guessHistory.length} {guessHistory.length === 1 ? 'Entry' : 'Entries'}
        </Badge>
      </div>

      <div className="history-entries-list">
        {guessHistory.length === 0 ? (
          <div className="history-empty">
            <Target size={32} className="empty-target-icon" />
            <p>No guesses submitted yet. Take your first shot!</p>
          </div>
        ) : (
          guessHistory.map((item) => (
            <div
              key={item.attemptNumber}
              className="history-entry-row animate-slide-up"
            >
              <div className="entry-left">
                <span className="entry-attempt font-mono">#{item.attemptNumber}</span>
                <span className="entry-guess font-mono">{item.guess}</span>
              </div>

              <div className="entry-right">
                <Badge
                  variant={item.proximity?.badgeClass?.replace('badge-', '') || 'default'}
                  size="sm"
                >
                  {item.proximity?.emoji} {item.proximity?.label}
                </Badge>

                {item.feedback === 'HIGH' && (
                  <span className="direction-tag dir-high">
                    <ArrowDown size={14} /> High
                  </span>
                )}
                {item.feedback === 'LOW' && (
                  <span className="direction-tag dir-low">
                    <ArrowUp size={14} /> Low
                  </span>
                )}
                {item.feedback === 'CORRECT' && (
                  <span className="direction-tag dir-correct">
                    🎯 Correct
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
