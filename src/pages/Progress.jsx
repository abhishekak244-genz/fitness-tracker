import React from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { VolumeBarChart, FrequencyLineChart } from '../components/ProgressChart';
import { statsApi } from '../api/allFitnessApi';
import { RiTrophyLine } from 'react-icons/ri';

export default function Progress() {
  const { workouts = [], getWeeklyVolume, getPersonalRecords } = useWorkout();

  // Always pass workouts explicitly — never call without arg
  const weeklyVol    = getWeeklyVolume ? getWeeklyVolume() : statsApi.getWeeklyVolume(workouts);
  const monthlyFreq  = statsApi.getMonthlyFrequency(workouts);
  const prs          = getPersonalRecords ? getPersonalRecords() : statsApi.getPersonalRecords(workouts);
  const prEntries    = Object.entries(prs || {}).slice(0, 8);

  const totalWorkouts = workouts.length;
  const totalVolume   = statsApi.getTotalVolume(workouts);
  const avgDuration   = workouts.length > 0
    ? Math.round(workouts.reduce((t, w) => t + (parseInt(w.duration) || 0), 0) / workouts.length)
    : 0;
  const totalSets = workouts.reduce((t, w) =>
    t + (w.exercises || []).reduce((et, e) => et + (e.sets?.length || 0), 0), 0);

  // Volume by muscle group
  const muscleVolume = {};
  workouts.forEach(w => {
    (w.exercises || []).forEach(ex => {
      const vol = (ex.sets || []).reduce((t, s) =>
        t + (parseFloat(s.reps || 0) * parseFloat(s.weight || 0)), 0);
      const cat = ex.category || 'Other';
      muscleVolume[cat] = (muscleVolume[cat] || 0) + vol;
    });
  });
  const maxMuscleVol = Math.max(...Object.values(muscleVolume), 1);
  const muscleColors = {
    Chest: '#ef4444', Back: '#3b82f6', Legs: '#8b5cf6',
    Shoulders: '#f59e0b', Arms: '#ec4899', Core: '#5DD62C',
  };

  return (
    <div className="page-wrap">
      <div className="container-ft">

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div className="accent-line" />
          <h1 className="section-title">PROGRESS</h1>
          <p className="section-subtitle">Visualise your journey. Track your gains.</p>
        </div>

        {/* Summary stats */}
        <div className="grid-4" style={{ marginBottom: 28 }}>
          {[
            { label: 'Total Workouts', value: totalWorkouts,  icon: '🏋️', color: 'var(--primary)' },
            { label: 'Total Volume',   value: totalVolume >= 1000 ? `${(totalVolume/1000).toFixed(1)}k` : Math.round(totalVolume), unit: 'kg', icon: '⚡', color: '#f59e0b' },
            { label: 'Total Sets',     value: totalSets,       icon: '🔢', color: '#3b82f6' },
            { label: 'Avg Duration',   value: avgDuration,     unit: 'min', icon: '⏱️', color: '#8b5cf6' },
          ].map(stat => (
            <div key={stat.label} className="card-ft" style={{ textAlign: 'center', padding: 20 }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{stat.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: stat.color, lineHeight: 1 }}>
                {stat.value}{stat.unit ? <span style={{ fontSize: '1rem' }}>{stat.unit}</span> : ''}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
          <div className="card-ft">
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.08em', marginBottom: 4 }}>WEEKLY VOLUME</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: 16 }}>Training load this week (kg)</p>
            {workouts.length > 0 ? (
              <VolumeBarChart data={weeklyVol} />
            ) : (
              <div className="empty-state" style={{ padding: '40px 0' }}>
                <div className="empty-state-icon">📊</div>
                <p className="empty-state-title">NO DATA YET</p>
              </div>
            )}
          </div>

          <div className="card-ft">
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.08em', marginBottom: 4 }}>MONTHLY FREQUENCY</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: 16 }}>Workouts per month</p>
            {workouts.length > 0 ? (
              <FrequencyLineChart data={monthlyFreq} />
            ) : (
              <div className="empty-state" style={{ padding: '40px 0' }}>
                <div className="empty-state-icon">📈</div>
                <p className="empty-state-title">NO DATA YET</p>
              </div>
            )}
          </div>
        </div>

        {/* PRs + Muscle Volume */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

          {/* Personal Records */}
          <div className="card-ft">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <RiTrophyLine size={18} color="#f59e0b" />
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.08em' }}>PERSONAL RECORDS</h4>
            </div>
            {prEntries.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {prEntries.map(([name, pr], i) => (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: i < 3 ? '#f59e0b' : 'var(--text3)', width: 24, flexShrink: 0 }}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.87rem', fontWeight: 600, color: 'var(--text)' }}>{name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>
                        {pr.date ? new Date(pr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--primary)' }}>
                        {pr.weight}<span style={{ fontSize: '0.75rem', marginLeft: 2 }}>kg</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>×{pr.reps} reps</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '32px 0' }}>
                <div className="empty-state-icon">🏆</div>
                <p className="empty-state-title">NO RECORDS YET</p>
                <p className="empty-state-text">Log workouts with weight to set personal records.</p>
              </div>
            )}
          </div>

          {/* Volume by Muscle */}
          <div className="card-ft">
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.08em', marginBottom: 20 }}>VOLUME BY MUSCLE</h4>
            {Object.keys(muscleVolume).length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {Object.entries(muscleVolume)
                  .sort((a, b) => b[1] - a[1])
                  .map(([muscle, vol]) => {
                    const pct   = Math.round((vol / maxMuscleVol) * 100);
                    const color = muscleColors[muscle] || '#888';
                    return (
                      <div key={muscle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text)', fontWeight: 600 }}>{muscle}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>
                            {vol >= 1000 ? `${(vol/1000).toFixed(1)}k` : Math.round(vol)} kg
                          </span>
                        </div>
                        <div style={{ background: 'var(--border)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', borderRadius: 99, background: color, transition: 'width 1s ease', boxShadow: `0 0 8px ${color}60` }} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '32px 0' }}>
                <div className="empty-state-icon">💪</div>
                <p className="empty-state-title">NO DATA YET</p>
                <p className="empty-state-text">Log workouts to see muscle volume breakdown.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}