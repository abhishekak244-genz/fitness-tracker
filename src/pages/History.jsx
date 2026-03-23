import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import WorkoutCard from '../components/WorkoutCard';

const FILTERS = [
  { label: 'All Time', value: 'all' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 7 Days', value: '7d' },
];

export default function History() {
  const { workouts, deleteWorkout } = useWorkout();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const handleDelete = async (id) => { await deleteWorkout(id); };

  const filtered = workouts.filter(w => {
    if (filter === 'all') return true;
    const days = filter === '30d' ? 30 : 7;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return new Date(w.date) >= cutoff;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'volume') {
      const volA = a.exercises?.reduce((t, e) => t + (e.sets?.reduce((st, s) => st + (parseFloat(s.reps || 0) * parseFloat(s.weight || 0)), 0) || 0), 0) || 0;
      const volB = b.exercises?.reduce((t, e) => t + (e.sets?.reduce((st, s) => st + (parseFloat(s.reps || 0) * parseFloat(s.weight || 0)), 0) || 0), 0) || 0;
      return volB - volA;
    }
    return 0;
  });

  // Group by month
  const grouped = sorted.reduce((acc, w) => {
    const d = new Date(w.date);
    const key = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!acc[key]) acc[key] = [];
    acc[key].push(w);
    return acc;
  }, {});

  return (
    <div className="page-wrap">
      <div className="container-ft" style={{ maxWidth: 800 }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <div className="accent-line" />
            <h1 className="section-title">HISTORY</h1>
            <p className="section-subtitle">{workouts.length} total workouts logged</p>
          </div>
          <Link to="/tracker" className="btn-primary-ft"><span>+</span> Log New</Link>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="tabs-ft">
            {FILTERS.map(f => (
              <button key={f.value} onClick={() => setFilter(f.value)} className={`tab-ft ${filter === f.value ? 'active' : ''}`}>
                {f.label}
              </button>
            ))}
          </div>

          <select className="select-ft" value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ width: 160 }}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="volume">Highest Volume</option>
          </select>
        </div>

        {/* Summary row */}
        {sorted.length > 0 && (
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, padding: '14px 20px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--primary)' }}>{sorted.length}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Workouts</div>
            </div>
            <div style={{ width: 1, background: 'var(--border)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--text)' }}>
                {sorted.reduce((t, w) => t + (w.exercises?.reduce((et, e) => et + (e.sets?.length || 0), 0) || 0), 0)}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Sets</div>
            </div>
            <div style={{ width: 1, background: 'var(--border)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#f59e0b' }}>
                {(() => {
                  const vol = sorted.reduce((t, w) => t + (w.exercises?.reduce((et, e) => et + (e.sets?.reduce((st, s) => st + (parseFloat(s.reps || 0) * parseFloat(s.weight || 0)), 0) || 0), 0) || 0), 0);
                  return vol >= 1000 ? (vol / 1000).toFixed(1) + 'k' : Math.round(vol);
                })()}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Volume kg</div>
            </div>
            <div style={{ width: 1, background: 'var(--border)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#3b82f6' }}>
                {sorted.reduce((t, w) => t + (parseInt(w.duration) || 0), 0)} min
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Time</div>
            </div>
          </div>
        )}

        {/* Workout List */}
        {sorted.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p className="empty-state-title">NO WORKOUTS FOUND</p>
            <p className="empty-state-text">
              {filter !== 'all' ? 'No workouts in this time range.' : 'Start logging your workouts to build your history.'}
            </p>
            <Link to="/tracker" className="btn-primary-ft" style={{ marginTop: 12 }}>Log First Workout</Link>
          </div>
        ) : (
          Object.entries(grouped).map(([month, mWorkouts]) => (
            <div key={month} style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--primary)', letterSpacing: '0.1em' }}>{month.toUpperCase()}</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{mWorkouts.length} session{mWorkouts.length !== 1 ? 's' : ''}</span>
              </div>
              {mWorkouts.map(w => (
                <WorkoutCard key={w.id} workout={w} onDelete={handleDelete} />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}