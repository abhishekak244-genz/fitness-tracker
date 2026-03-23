import React, { useState } from 'react';
import { RiArrowDownSLine, RiArrowUpSLine, RiDeleteBin6Line, RiTimeLine, RiCalendarLine } from 'react-icons/ri';
import { useWorkout } from '../context/WorkoutContext';

export default function WorkoutCard({ workout, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const totalSets = workout.exercises?.reduce((t, ex) => t + (ex.sets?.length || 0), 0) || 0;
  const totalVolume = workout.exercises?.reduce((t, ex) => {
    return t + (ex.sets?.reduce((st, set) => st + (parseFloat(set.reps || 0) * parseFloat(set.weight || 0)), 0) || 0);
  }, 0) || 0;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 12,
      transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      {/* Header */}
      <div style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: 'rgba(93,214,44,0.1)', border: '1px solid rgba(93,214,44,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0,
        }}>🏋️</div>

        <div style={{ flex: 1 }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text)', letterSpacing: '0.04em', marginBottom: 2 }}>
            {workout.name}
          </h4>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <RiCalendarLine size={12} /> {formatDate(workout.date)}
            </span>
            {workout.duration && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <RiTimeLine size={12} /> {workout.duration} min
              </span>
            )}
          </div>
        </div>

        {/* Stats chips */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          <div style={{ textAlign: 'center', display: 'none' }} className="workout-stat">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--primary)' }}>{workout.exercises?.length || 0}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Exs</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text)' }}>{totalSets}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sets</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--primary)' }}>
              {totalVolume >= 1000 ? (totalVolume / 1000).toFixed(1) + 'k' : Math.round(totalVolume)}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Vol</div>
          </div>

          <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
            <button onClick={() => setExpanded(!expanded)} className="btn-icon-ft">
              {expanded ? <RiArrowUpSLine size={16} /> : <RiArrowDownSLine size={16} />}
            </button>
            {onDelete && (
              <button onClick={() => onDelete(workout.id)} style={{
                background: 'transparent', color: 'var(--text3)', border: 'none',
                cursor: 'pointer', padding: '8px', borderRadius: 8, transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text3)'; }}
              >
                <RiDeleteBin6Line size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded exercise breakdown */}
      {expanded && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '16px 20px', animation: 'fadeInUp 0.2s ease' }}>
          {workout.exercises?.map((ex, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>{String(i + 1).padStart(2, '0')}</span>
                {ex.name}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {ex.sets?.map((set, si) => (
                  <div key={si} style={{
                    background: 'var(--card2)', border: '1px solid var(--border)',
                    borderRadius: 8, padding: '6px 12px', fontSize: '0.8rem', color: 'var(--text2)',
                  }}>
                    <span style={{ color: 'var(--text3)', fontSize: '0.7rem', marginRight: 4 }}>Set {si + 1}</span>
                    <span style={{ fontWeight: 700, color: 'var(--text)' }}>{set.reps}</span>
                    <span style={{ color: 'var(--text3)', margin: '0 3px' }}>×</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{set.weight}kg</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {workout.notes && (
            <div style={{
              marginTop: 12, padding: '12px 16px', background: 'var(--bg2)',
              borderRadius: 8, borderLeft: '3px solid var(--primary)',
              fontSize: '0.85rem', color: 'var(--text2)', fontStyle: 'italic',
            }}>
              {workout.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}