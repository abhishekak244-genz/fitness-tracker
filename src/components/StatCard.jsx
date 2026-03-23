import React, { useEffect, useRef, useState } from 'react';

export default function StatCard({ icon, label, value, unit = '', color = 'var(--primary)', trend, trendLabel, delay = 0 }) {
  const [displayed, setDisplayed] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef();

  // Animate number on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
      const num = parseFloat(value) || 0;
      if (num === 0) { setDisplayed(0); return; }
      const duration = 900;
      const steps = 40;
      const increment = num / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= num) { setDisplayed(num); clearInterval(interval); }
        else setDisplayed(current);
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  const formatValue = (v) => {
    const n = parseFloat(v) || 0;
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    if (Number.isInteger(n)) return n;
    return n.toFixed(1);
  };

  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'default',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(16px)',
      transitionDelay: `${delay}ms`,
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${color}40`;
        e.currentTarget.style.boxShadow = `0 0 24px ${color}15`;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* BG glow blob */}
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 120, height: 120, borderRadius: '50%',
        background: `${color}08`, filter: 'blur(30px)',
        pointerEvents: 'none',
      }} />

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: `${color}15`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.3rem',
        }}>
          {icon}
        </div>
        {trend !== undefined && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '4px 10px', borderRadius: 20,
            background: trend >= 0 ? 'rgba(93,214,44,0.1)' : 'rgba(239,68,68,0.1)',
            fontSize: '0.75rem', fontWeight: 700,
            color: trend >= 0 ? 'var(--primary)' : 'var(--danger)',
          }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>

      {/* Value */}
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: '2.6rem',
        color: color, lineHeight: 1, letterSpacing: '0.02em',
        marginBottom: 6,
      }}>
        {formatValue(displayed)}
        {unit && <span style={{ fontSize: '1.2rem', marginLeft: 4, opacity: 0.7 }}>{unit}</span>}
      </div>

      {/* Label */}
      <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text2)' }}>
        {label}
      </div>

      {trendLabel && (
        <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: 6 }}>{trendLabel}</div>
      )}

      {/* Bottom accent line */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        width: '40%', height: '2px',
        background: `linear-gradient(90deg, ${color}, transparent)`,
        borderRadius: '0 2px 0 0',
      }} />
    </div>
  );
}