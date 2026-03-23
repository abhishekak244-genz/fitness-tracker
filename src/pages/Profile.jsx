import React, { useState, useEffect } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import { statsApi } from '../api/allFitnessApi';
// Hardcoded — no workouts.json dependency
const BODY_TYPES = [
  { id: 'ectomorph', label: 'Ectomorph' },
  { id: 'mesomorph', label: 'Mesomorph' },
  { id: 'endomorph', label: 'Endomorph' },
];
const FITNESS_GOALS = [
  'Lose Weight','Build Muscle','Improve Endurance',
  'Increase Strength','Stay Active','Improve Flexibility',
];
const EXPERIENCE_LEVELS = ['Beginner','Intermediate','Advanced','Elite'];
import {
  RiEditLine, RiSaveLine, RiCloseLine, RiUserLine,
  RiScalesLine, RiTrophyLine, RiFireLine, RiRefreshLine,
} from 'react-icons/ri';

export default function Profile() {
  const { user, workouts, updateUser, resetAll, getStreak, getTotalVolume, getPersonalRecords } = useWorkout();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...user });
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm({ ...user }); }, [user]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    await updateUser(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = async () => {
    if (window.confirm('⚠️ This will delete ALL your data and reset the app. Are you sure?')) {
      await resetAll();
    }
  };

  const bmi = statsApi.calculateBMI(user?.weight, user?.height);
  const bmiCategory = statsApi.getBMICategory(bmi);
  const streak = getStreak();
  const totalVol = getTotalVolume();
  const prs = getPersonalRecords();
  const prCount = Object.keys(prs).length;

  const bodyTypeLabel = BODY_TYPES.find(b => b.id === user?.bodyType)?.label || user?.bodyType;

  return (
    <div className="page-wrap">
      <div className="container-ft" style={{ maxWidth: 900 }}>

        {/* Toast */}
        {saved && (
          <div className="toast-ft">
            <span className="toast-icon">✅</span>
            Profile updated successfully!
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div className="accent-line" />
          <h1 className="section-title">PROFILE</h1>
          <p className="section-subtitle">Manage your info and track your stats.</p>
        </div>

        {/* ── Hero Profile Card ── */}
        <div style={{
          background: 'linear-gradient(135deg, #141414 0%, #181818 100%)',
          border: '1px solid rgba(93,214,44,0.2)',
          borderRadius: 18, padding: '32px 36px',
          marginBottom: 24, position: 'relative', overflow: 'hidden',
        }}>
          {/* BG decoration */}
          <div style={{ position: 'absolute', right: -60, top: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(93,214,44,0.04)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(93,214,44,0.15)',
              border: '3px solid var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontFamily: 'var(--font-display)',
              color: 'var(--primary)', letterSpacing: '0.05em', flexShrink: 0,
              boxShadow: '0 0 30px rgba(93,214,44,0.2)',
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text)', letterSpacing: '0.05em', marginBottom: 4 }}>
                {user?.name || 'Athlete'}
              </h2>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {user?.gender && (
                  <span className="badge-ft badge-gray">{user.gender}</span>
                )}
                {bodyTypeLabel && (
                  <span className="badge-ft badge-green">{bodyTypeLabel}</span>
                )}
                {user?.experience && (
                  <span className="badge-ft badge-blue">{user.experience}</span>
                )}
                {user?.goal && (
                  <span className="badge-ft badge-yellow">{user.goal}</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="btn-outline-ft">
                  <RiEditLine size={15} /> Edit Profile
                </button>
              ) : (
                <>
                  <button onClick={() => { setEditing(false); setForm({ ...user }); }} className="btn-ghost-ft">
                    <RiCloseLine size={15} /> Cancel
                  </button>
                  <button onClick={handleSave} className="btn-primary-ft">
                    <RiSaveLine size={15} /> Save
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>

          {/* ── Edit Form ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Personal Info */}
            <div className="card-ft">
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.08em', marginBottom: 18, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiUserLine size={16} color="var(--primary)" /> PERSONAL INFO
              </h4>

              <div className="grid-2" style={{ gap: 14 }}>
                <div className="form-group-ft" style={{ marginBottom: 0 }}>
                  <label className="label-ft">Full Name</label>
                  {editing
                    ? <input className="input-ft" value={form.name || ''} onChange={e => set('name', e.target.value)} />
                    : <div style={readStyle}>{user?.name || '—'}</div>}
                </div>

                <div className="form-group-ft" style={{ marginBottom: 0 }}>
                  <label className="label-ft">Gender</label>
                  {editing ? (
                    <select className="select-ft" value={form.gender || ''} onChange={e => set('gender', e.target.value)}>
                      <option value="">Select</option>
                      {['Male', 'Female', 'Other'].map(g => <option key={g}>{g}</option>)}
                    </select>
                  ) : <div style={readStyle}>{user?.gender || '—'}</div>}
                </div>

                <div className="form-group-ft" style={{ marginBottom: 0 }}>
                  <label className="label-ft">Age</label>
                  {editing
                    ? <input className="input-ft" type="number" value={form.age || ''} onChange={e => set('age', e.target.value)} placeholder="25" />
                    : <div style={readStyle}>{user?.age ? `${user.age} yrs` : '—'}</div>}
                </div>

                <div className="form-group-ft" style={{ marginBottom: 0 }}>
                  <label className="label-ft">Body Type</label>
                  {editing ? (
                    <select className="select-ft" value={form.bodyType || ''} onChange={e => set('bodyType', e.target.value)}>
                      <option value="">Select</option>
                      {BODY_TYPES.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
                    </select>
                  ) : <div style={readStyle}>{bodyTypeLabel || '—'}</div>}
                </div>

                <div className="form-group-ft" style={{ marginBottom: 0 }}>
                  <label className="label-ft">Weight (kg)</label>
                  {editing
                    ? <input className="input-ft" type="number" value={form.weight || ''} onChange={e => set('weight', e.target.value)} placeholder="75" />
                    : <div style={readStyle}>{user?.weight ? `${user.weight} kg` : '—'}</div>}
                </div>

                <div className="form-group-ft" style={{ marginBottom: 0 }}>
                  <label className="label-ft">Height (cm)</label>
                  {editing
                    ? <input className="input-ft" type="number" value={form.height || ''} onChange={e => set('height', e.target.value)} placeholder="175" />
                    : <div style={readStyle}>{user?.height ? `${user.height} cm` : '—'}</div>}
                </div>
              </div>
            </div>

            {/* Fitness Info */}
            <div className="card-ft">
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.08em', marginBottom: 18, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiTrophyLine size={16} color="var(--primary)" /> FITNESS INFO
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label className="label-ft">Primary Goal</label>
                  {editing ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
                      {FITNESS_GOALS.map(g => (
                        <button key={g} onClick={() => set('goal', g)} style={{
                          padding: '10px 12px', borderRadius: 8, textAlign: 'left',
                          border: `1.5px solid ${form.goal === g ? 'var(--primary)' : 'var(--border)'}`,
                          background: form.goal === g ? 'rgba(93,214,44,0.1)' : 'var(--bg2)',
                          color: form.goal === g ? 'var(--primary)' : 'var(--text2)',
                          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.82rem',
                          cursor: 'pointer', transition: 'all 0.2s',
                        }}>{g}</button>
                      ))}
                    </div>
                  ) : <div style={readStyle}>{user?.goal || '—'}</div>}
                </div>

                <div>
                  <label className="label-ft">Experience Level</label>
                  {editing ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      {EXPERIENCE_LEVELS.map(lvl => (
                        <button key={lvl} onClick={() => set('experience', lvl)} style={{
                          flex: 1, padding: '9px 6px', borderRadius: 8,
                          border: `1.5px solid ${form.experience === lvl ? 'var(--primary)' : 'var(--border)'}`,
                          background: form.experience === lvl ? 'rgba(93,214,44,0.1)' : 'var(--bg2)',
                          color: form.experience === lvl ? 'var(--primary)' : 'var(--text2)',
                          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.78rem',
                          cursor: 'pointer', transition: 'all 0.2s',
                        }}>{lvl}</button>
                      ))}
                    </div>
                  ) : <div style={readStyle}>{user?.experience || '—'}</div>}
                </div>

                <div>
                  <label className="label-ft">
                    Weekly Target{editing && <span style={{ color: 'var(--primary)', marginLeft: 6 }}>{form.weeklyTarget || 3} days</span>}
                  </label>
                  {editing ? (
                    <>
                      <input type="range" min={1} max={7} value={form.weeklyTarget || 3}
                        onChange={e => set('weeklyTarget', parseInt(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--primary)', marginTop: 4 }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text3)' }}>
                        <span>1 day</span><span>7 days</span>
                      </div>
                    </>
                  ) : <div style={readStyle}>{user?.weeklyTarget || 3} days / week</div>}
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: BMI + Stats ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* BMI Card */}
            <div className="card-ft">
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.08em', marginBottom: 18, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiScalesLine size={16} color="var(--primary)" /> BMI CALCULATOR
              </h4>

              {bmi ? (
                <div style={{ textAlign: 'center' }}>
                  {/* BMI Gauge */}
                  <div style={{ position: 'relative', marginBottom: 16 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', color: bmiCategory.color, lineHeight: 1 }}>
                      {bmi}
                    </div>
                    <div style={{
                      display: 'inline-block', padding: '4px 16px', borderRadius: 20,
                      background: `${bmiCategory.color}20`, border: `1px solid ${bmiCategory.color}40`,
                      color: bmiCategory.color, fontSize: '0.8rem', fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4,
                    }}>{bmiCategory.label}</div>
                  </div>

                  {/* BMI Range Bar */}
                  <div style={{ position: 'relative', height: 8, borderRadius: 99, overflow: 'hidden', marginBottom: 8, background: 'linear-gradient(90deg, #3b82f6, #5DD62C, #f59e0b, #ef4444)' }}>
                    <div style={{
                      position: 'absolute',
                      left: `${Math.min(95, Math.max(2, ((bmi - 15) / 25) * 100))}%`,
                      top: -4, width: 16, height: 16, borderRadius: '50%',
                      background: '#fff', border: `3px solid ${bmiCategory.color}`,
                      transform: 'translateX(-50%)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text3)' }}>
                    <span>Underweight</span><span>Normal</span><span>Over</span><span>Obese</span>
                  </div>

                  <hr className="divider-ft" />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div style={{ padding: '10px', background: 'var(--bg2)', borderRadius: 8, textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text)' }}>{user?.weight} kg</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Weight</div>
                    </div>
                    <div style={{ padding: '10px', background: 'var(--bg2)', borderRadius: 8, textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text)' }}>{user?.height} cm</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Height</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text3)', fontSize: '0.875rem' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>⚖️</div>
                  Add weight & height to calculate your BMI
                </div>
              )}
            </div>

            {/* Live Stats */}
            <div className="card-ft">
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.08em', marginBottom: 16, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiFireLine size={16} color="var(--primary)" /> YOUR STATS
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Total Workouts', value: workouts.length, icon: '🏋️', color: 'var(--primary)' },
                  { label: 'Current Streak',  value: `${streak} days`,     icon: '🔥', color: '#ef4444' },
                  { label: 'Total Volume',    value: totalVol >= 1000 ? `${(totalVol/1000).toFixed(1)}k kg` : `${Math.round(totalVol)} kg`, icon: '⚡', color: '#f59e0b' },
                  { label: 'Personal Records', value: prCount,             icon: '🏆', color: '#8b5cf6' },
                  { label: 'Member Since',    value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—', icon: '📅', color: '#3b82f6' },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--bg2)', borderRadius: 8, border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '1rem', flexShrink: 0 }}>{s.icon}</span>
                    <span style={{ flex: 1, fontSize: '0.85rem', color: 'var(--text2)' }}>{s.label}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius)', padding: 20 }}>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '0.08em', color: '#f87171', marginBottom: 8 }}>
                ⚠️ DANGER ZONE
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: 12, lineHeight: 1.5 }}>
                Reset all data and start fresh. This cannot be undone.
              </p>
              <button onClick={handleReset} className="btn-danger-ft" style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6 }}>
                <RiRefreshLine size={14} /> Reset All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const readStyle = {
  padding: '11px 14px',
  background: 'var(--bg2)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '0.95rem',
  color: 'var(--text)',
  minHeight: 44,
  display: 'flex',
  alignItems: 'center',
};