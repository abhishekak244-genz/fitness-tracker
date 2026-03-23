import React, { useState } from 'react';
import { RiArrowDownSLine, RiArrowUpSLine, RiAddCircleLine } from 'react-icons/ri';

const difficultyColor = {
  Beginner:     { bg: 'rgba(93,214,44,0.1)',   color: '#5DD62C',  border: 'rgba(93,214,44,0.2)'   },
  Intermediate: { bg: 'rgba(245,158,11,0.1)',  color: '#fbbf24',  border: 'rgba(245,158,11,0.2)'  },
  Advanced:     { bg: 'rgba(239,68,68,0.1)',   color: '#f87171',  border: 'rgba(239,68,68,0.2)'   },
};

const categoryColor = {
  Chest:     '#ef4444',
  Back:      '#3b82f6',
  Legs:      '#8b5cf6',
  Shoulders: '#f59e0b',
  Arms:      '#ec4899',
  Core:      '#5DD62C',
};

export default function ExerciseCard({ exercise, onAdd, showAdd = false }) {
  const [expanded, setExpanded] = useState(false);
  const diff = difficultyColor[exercise.difficulty] || difficultyColor.Beginner;
  const catColor = categoryColor[exercise.category] || '#888';

  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', overflow: 'hidden',
      transition: 'all 0.25s ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* Category strip */}
      <div style={{ height: 3, background: catColor }} />

      {/* Header */}
      <div style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{
                fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.08em', color: catColor,
                background: `${catColor}15`, padding: '2px 8px', borderRadius: 20,
                border: `1px solid ${catColor}30`,
              }}>{exercise.category}</span>
              <span style={{
                fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.06em', color: diff.color,
                background: diff.bg, padding: '2px 8px', borderRadius: 20,
                border: `1px solid ${diff.border}`,
              }}>{exercise.difficulty}</span>
            </div>

            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--text)', letterSpacing: '0.04em', marginBottom: 4 }}>
              {exercise.name}
            </h4>

            <p style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{exercise.equipment}</p>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {showAdd && onAdd && (
              <button onClick={() => onAdd(exercise)} style={{
                background: 'rgba(93,214,44,0.1)', color: 'var(--primary)',
                border: '1px solid rgba(93,214,44,0.3)', borderRadius: 8,
                padding: '6px 12px', fontSize: '0.8rem', fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                fontFamily: 'var(--font-body)', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(93,214,44,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(93,214,44,0.1)'; }}
              >
                <RiAddCircleLine size={14} /> Add
              </button>
            )}
            <button onClick={() => setExpanded(!expanded)} style={{
              background: 'var(--card2)', color: 'var(--text2)',
              border: '1px solid var(--border)', borderRadius: 8,
              padding: '6px 10px', cursor: 'pointer', transition: 'all 0.2s',
            }}>
              {expanded ? <RiArrowUpSLine size={16} /> : <RiArrowDownSLine size={16} />}
            </button>
          </div>
        </div>

        {/* Muscles row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10 }}>
          {exercise.muscles?.map(m => (
            <span key={m} style={{
              background: 'var(--card2)', border: '1px solid var(--border)',
              borderRadius: 20, padding: '2px 8px', fontSize: '0.72rem',
              color: 'var(--text2)', fontWeight: 500,
            }}>{m}</span>
          ))}
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div style={{
          padding: '0 20px 18px', borderTop: '1px solid var(--border)',
          animation: 'fadeInUp 0.2s ease',
        }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text2)', lineHeight: 1.6, paddingTop: 14, marginBottom: 12 }}>
            {exercise.description}
          </p>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: 8 }}>
              Pro Tips
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {exercise.tips?.map((tip, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.83rem', color: 'var(--text2)' }}>
                  <span style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }}>▸</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}