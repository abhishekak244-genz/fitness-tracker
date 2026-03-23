import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 20, textAlign: 'center',
    }}>
      <div style={{ animation: 'fadeInUp 0.5s ease' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(6rem,20vw,12rem)', color: 'var(--primary)', lineHeight: 1, opacity: 0.15, letterSpacing: '0.05em' }}>
          404
        </div>
        <div style={{ marginTop: -30 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text)', letterSpacing: '0.08em', marginBottom: 8 }}>
            PAGE NOT FOUND
          </h2>
          <p style={{ color: 'var(--text3)', fontSize: '0.9rem', maxWidth: 300, margin: '0 auto 24px' }}>
            Looks like this rep doesn't exist. Get back to the gym floor.
          </p>
          <Link to="/" className="btn-primary-ft" style={{ display: 'inline-flex' }}>
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}