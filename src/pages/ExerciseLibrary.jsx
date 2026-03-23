import React, { useState } from 'react';
import ExerciseCard from '../components/ExerciseCard';
import exercises from '../data/Exercises.json';
import { RiSearch2Line } from 'react-icons/ri';

const CATEGORIES = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

const categoryIcons = {
  All: '🏋️', Chest: '💪', Back: '🔙', Legs: '🦵', Shoulders: '🏔️', Arms: '💪', Core: '⚡',
};

const categoryColors = {
  Chest: '#ef4444', Back: '#3b82f6', Legs: '#8b5cf6',
  Shoulders: '#f59e0b', Arms: '#ec4899', Core: '#5DD62C',
};

export default function ExerciseLibrary() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = exercises.filter(ex => {
    const matchCat = category === 'All' || ex.category === category;
    const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.muscles.some(m => m.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const counts = CATEGORIES.slice(1).reduce((acc, cat) => {
    acc[cat] = exercises.filter(e => e.category === cat).length;
    return acc;
  }, {});

  return (
    <div className="page-wrap">
      <div className="container-ft">

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div className="accent-line" />
          <h1 className="section-title">EXERCISE LIBRARY</h1>
          <p className="section-subtitle">{exercises.length} exercises across 6 muscle groups</p>
        </div>

        {/* Category cards */}
        <div className="grid-3" style={{ marginBottom: 28 }}>
          {CATEGORIES.slice(1).map(cat => {
            const active = category === cat;
            const color = categoryColors[cat];
            return (
              <button key={cat} onClick={() => setCategory(cat)} style={{
                background: active ? `${color}12` : 'var(--card)',
                border: `1.5px solid ${active ? color : 'var(--border)'}`,
                borderRadius: 'var(--radius)', padding: '16px 20px',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = `${color}50`; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--border)'; } }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: active ? color : 'var(--text)', letterSpacing: '0.05em' }}>{cat.toUpperCase()}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: active ? color : 'var(--text3)' }}>{counts[cat]}</span>
                </div>
                <div style={{ height: 2, background: active ? color : 'var(--border)', marginTop: 10, borderRadius: 2 }} />
              </button>
            );
          })}
        </div>

        {/* Search + Tabs */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <RiSearch2Line style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none' }} size={16} />
            <input
              className="input-ft" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search exercises or muscles..."
              style={{ paddingLeft: 38 }}
            />
          </div>

          <div className="tabs-ft">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} className={`tab-ft ${category === cat ? 'active' : ''}`}>
                {cat === 'All' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div style={{ marginBottom: 16, fontSize: '0.85rem', color: 'var(--text3)' }}>
          Showing <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{filtered.length}</span> exercise{filtered.length !== 1 ? 's' : ''}
          {category !== 'All' && <span> in <span style={{ color: 'var(--text2)' }}>{category}</span></span>}
          {search && <span> matching "<span style={{ color: 'var(--text2)' }}>{search}</span>"</span>}
        </div>

        {/* Exercise Grid */}
        {filtered.length > 0 ? (
          <div className="grid-3">
            {filtered.map(ex => <ExerciseCard key={ex.id} exercise={ex} />)}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <p className="empty-state-title">NO EXERCISES FOUND</p>
            <p className="empty-state-text">Try a different search term or category.</p>
            <button onClick={() => { setSearch(''); setCategory('All'); }} className="btn-outline-ft" style={{ marginTop: 8 }}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}