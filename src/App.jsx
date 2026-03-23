import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { WorkoutProvider, useWorkout } from './context/WorkoutContext';
import Navbar from './components/Navbar';
import Setup from './pages/Setup';
import Home from './pages/Home';
import Tracker from './pages/Tracker';
import ExerciseLibrary from './pages/ExerciseLibrary';
import Progress from './pages/Progress';
import History from './pages/History';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import './index.css';

// ── Loading screen while JSON server responds ──
function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', gap: 20,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: 'var(--primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#000',
        animation: 'pulse-green 1.5s infinite',
        boxShadow: '0 0 30px rgba(93,214,44,0.5)',
      }}>FT</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text2)', letterSpacing: '0.15em' }}>
        CONNECTING...
      </div>
      <div style={{ width: 120, height: 2, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%', background: 'var(--primary)', borderRadius: 99,
          animation: 'shimmerBar 1.4s ease infinite',
        }} />
      </div>
      <style>{`
        @keyframes shimmerBar {
          0%   { width: 0%;   margin-left: 0; }
          50%  { width: 80%;  margin-left: 10%; }
          100% { width: 0%;   margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}

// ── Error screen if JSON server is unreachable ──
function ErrorScreen({ message }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', background: 'var(--bg)',
      padding: 20, gap: 16, textAlign: 'center',
    }}>
      <div style={{ fontSize: '3rem' }}>🔌</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--danger)', letterSpacing: '0.05em' }}>
        SERVER OFFLINE
      </h2>
      <p style={{ color: 'var(--text2)', maxWidth: 400, lineHeight: 1.7, fontSize: '0.9rem' }}>
        {message}
      </p>
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '14px 22px',
        fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--primary)',
        marginTop: 8,
      }}>
        npx json-server --watch db.json --port 3000
      </div>
      <button onClick={() => window.location.reload()} className="btn-outline-ft" style={{ marginTop: 8 }}>
        ↺ Retry Connection
      </button>
    </div>
  );
}

// ── Main routes ──
function AppRoutes() {
  const { isSetupComplete, loading, error } = useWorkout();

  if (loading) return <LoadingScreen />;
  if (error)   return <ErrorScreen message={error} />;

  if (!isSetupComplete) {
    return (
      <Routes>
        <Route path="/"  element={<Setup />} />
        <Route path="*"  element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-content">
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/tracker"   element={<Tracker />} />
          <Route path="/library"   element={<ExerciseLibrary />} />
          <Route path="/progress"  element={<Progress />} />
          <Route path="/history"   element={<History />} />
          <Route path="/profile"   element={<Profile />} />
          <Route path="*"          element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <WorkoutProvider>
      <div className="app-wrapper">
        <AppRoutes />
      </div>
    </WorkoutProvider>
  );
}