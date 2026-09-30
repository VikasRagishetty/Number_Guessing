import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    localStorage.removeItem('quantum_guess_user_stats');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0d1117',
          color: '#f0f6fc',
          fontFamily: 'Outfit, sans-serif',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2rem', color: '#f43f5e', marginBottom: '1rem' }}>
            Oops! Quantum Glitch Detected
          </h1>
          <p style={{ maxWidth: '500px', color: '#8b949e', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            The game encountered an unexpected runtime state. You can reset your session to restore normal operation.
          </p>
          <pre style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '1rem',
            borderRadius: '8px',
            maxWidth: '600px',
            overflowX: 'auto',
            color: '#38bdf8',
            fontSize: '0.85rem',
            marginBottom: '1.5rem'
          }}>
            {this.state.error?.message || 'Unknown error'}
          </pre>
          <button
            onClick={this.handleReload}
            style={{
              padding: '0.75rem 1.75rem',
              borderRadius: '9999px',
              border: 'none',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              color: '#ffffff',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Reset Game & Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
