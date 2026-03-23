import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import exercises from '../data/Exercises.json';
import workoutsData from '../data/workouts.json'; // used for dailyTip etc if needed
import { generateId } from '../api/allFitnessApi';
import { RiAddLine, RiDeleteBin6Line, RiCheckLine, RiSearch2Line } from 'react-icons/ri';

const CATEGORIES = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

function Toast({ message, onClose }) {
  return (
    <div className="toast-ft">
      <span className="toast-icon">✅</span>
      {message}
    </div>
  );
}

export default function Tracker() {
  const navigate = useNavigate();
  const { addWorkout } = useWorkout();

  const [form, setForm] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    duration: '',
    notes: '',
  });
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exSearch, setExSearch] = useState('');
  const [exCategory, setExCategory] = useState('All');
  const [showLibrary, setShowLibrary] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredExercises = exercises.filter(ex => {
    const matchCat = exCategory === 'All' || ex.category === exCategory;
    const matchSearch = ex.name.toLowerCase().includes(exSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const addExercise = (ex) => {
    if (selectedExercises.find(e => e.id === ex.id)) return;
    setSelectedExercises(prev => [
      ...prev,
      { ...ex, instanceId: generateId(), sets: [{ reps: '', weight: '' }] },
    ]);
    setShowLibrary(false);
  };

  const removeExercise = (instanceId) => {
    setSelectedExercises(prev => prev.filter(e => e.instanceId !== instanceId));
  };

  const addSet = (instanceId) => {
    setSelectedExercises(prev => prev.map(e =>
      e.instanceId === instanceId
        ? { ...e, sets: [...e.sets, { reps: '', weight: '' }] }
        : e
    ));
  };

  const removeSet = (instanceId, setIdx) => {
    setSelectedExercises(prev => prev.map(e =>
      e.instanceId === instanceId
        ? { ...e, sets: e.sets.filter((_, i) => i !== setIdx) }
        : e
    ));
  };

  const updateSet = (instanceId, setIdx, field, value) => {
    setSelectedExercises(prev => prev.map(e =>
      e.instanceId === instanceId
        ? { ...e, sets: e.sets.map((s, i) => i === setIdx ? { ...s, [field]: value } : s) }
        : e
    ));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Workout name is required';
    if (!form.date) e.date = 'Date is required';
    if (selectedExercises.length === 0) e.exercises = 'Add at least one exercise';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    const workout = {
      id: generateId(),
      ...form,
      exercises: selectedExercises.map(({ instanceId, ...rest }) => rest),
      createdAt: new Date().toISOString(),
    };
    await addWorkout(workout);
    showToast('Workout saved successfully!');
    setTimeout(() => navigate('/history'), 1500);
  };

  const totalSets = selectedExercises.reduce((t, e) => t + e.sets.length, 0);
  const totalVol = selectedExercises.reduce((t, e) =>
    t + e.sets.reduce((st, s) => st + (parseFloat(s.reps || 0) * parseFloat(s.weight || 0)), 0), 0
  );

  return (
    <div className="page-wrap">
      {toast && <Toast message={toast} />}

      <div className="container-ft" style={{ maxWidth: 900 }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <div className="accent-line" />
            <h1 className="section-title">LOG WORKOUT</h1>
            <p className="section-subtitle">Track every rep. Every set. Every gain.</p>
          </div>
          {selectedExercises.length > 0 && (
            <div style={{ display: 'flex', gap: 12, fontSize: '0.8rem', color: 'var(--text2)' }}>
              <span style={{ padding: '6px 12px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }}>
                {selectedExercises.length} exercises
              </span>
              <span style={{ padding: '6px 12px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }}>
                {totalSets} sets
              </span>
              {totalVol > 0 && (
                <span style={{ padding: '6px 12px', background: 'rgba(93,214,44,0.1)', border: '1px solid rgba(93,214,44,0.3)', borderRadius: 8, color: 'var(--primary)', fontWeight: 700 }}>
                  {totalVol >= 1000 ? (totalVol / 1000).toFixed(1) + 'k' : Math.round(totalVol)} kg
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Workout Meta Form ── */}
        <div className="card-ft" style={{ marginBottom: 20 }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.08em', marginBottom: 18, color: 'var(--text)' }}>WORKOUT DETAILS</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16 }}>
            <div className="form-group-ft" style={{ marginBottom: 0 }}>
              <label className="label-ft">Workout Name</label>
              <input className="input-ft" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Push Day, Upper Body..." />
              {errors.name && <p style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: 4 }}>{errors.name}</p>}
            </div>
            <div className="form-group-ft" style={{ marginBottom: 0 }}>
              <label className="label-ft">Date</label>
              <input className="input-ft" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="form-group-ft" style={{ marginBottom: 0 }}>
              <label className="label-ft">Duration (min)</label>
              <input className="input-ft" type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="60" min={1} />
            </div>
          </div>
        </div>

        {/* ── Exercise Selector ── */}
        <div className="card-ft" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.08em', color: 'var(--text)' }}>EXERCISES</h4>
            <button onClick={() => setShowLibrary(!showLibrary)} className="btn-outline-ft" style={{ fontSize: '0.82rem', padding: '8px 16px' }}>
              <RiAddLine size={14} /> Add Exercise
            </button>
          </div>

          {/* Exercise Library Picker */}
          {showLibrary && (
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 20, animation: 'fadeInUp 0.2s ease' }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <RiSearch2Line style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} size={16} />
                  <input className="input-ft" value={exSearch} onChange={e => setExSearch(e.target.value)} placeholder="Search exercises..." style={{ paddingLeft: 36 }} />
                </div>
                <select className="select-ft" value={exCategory} onChange={e => setExCategory(e.target.value)} style={{ width: 130 }}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8, maxHeight: 240, overflowY: 'auto' }}>
                {filteredExercises.map(ex => {
                  const alreadyAdded = selectedExercises.find(e => e.id === ex.id);
                  return (
                    <div key={ex.id} onClick={() => !alreadyAdded && addExercise(ex)} style={{
                      padding: '10px 14px', borderRadius: 8,
                      border: `1px solid ${alreadyAdded ? 'rgba(93,214,44,0.3)' : 'var(--border)'}`,
                      background: alreadyAdded ? 'rgba(93,214,44,0.07)' : 'var(--card)',
                      cursor: alreadyAdded ? 'default' : 'pointer',
                      transition: 'all 0.2s',
                      opacity: alreadyAdded ? 0.6 : 1,
                    }}
                      onMouseEnter={e => { if (!alreadyAdded) { e.currentTarget.style.borderColor = 'rgba(93,214,44,0.5)'; e.currentTarget.style.background = 'rgba(93,214,44,0.05)'; } }}
                      onMouseLeave={e => { if (!alreadyAdded) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--card)'; } }}
                    >
                      <div style={{ fontSize: '0.87rem', fontWeight: 600, color: alreadyAdded ? 'var(--primary)' : 'var(--text)', marginBottom: 2 }}>
                        {alreadyAdded ? '✓ ' : ''}{ex.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{ex.category} · {ex.difficulty}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {errors.exercises && <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginBottom: 12 }}>{errors.exercises}</p>}

          {/* Selected Exercises */}
          {selectedExercises.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 20px', color: 'var(--text3)', border: '2px dashed var(--border)', borderRadius: 10 }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>➕</div>
              <p style={{ fontSize: '0.875rem' }}>No exercises added yet. Click "Add Exercise" to start building your workout.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {selectedExercises.map((ex, exIdx) => (
                <div key={ex.instanceId} style={{ background: 'var(--bg2)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
                  {/* Exercise header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--card2)', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--primary)' }}>{String(exIdx + 1).padStart(2, '0')}</span>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text)', letterSpacing: '0.05em' }}>{ex.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{ex.category} · {ex.equipment}</div>
                      </div>
                    </div>
                    <button onClick={() => removeExercise(ex.instanceId)} className="btn-danger-ft" style={{ padding: '6px 10px' }}>
                      <RiDeleteBin6Line size={14} />
                    </button>
                  </div>

                  {/* Sets */}
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text3)', paddingLeft: 4 }}>
                      <span style={{ width: 36 }}>Set</span>
                      <span style={{ flex: 1 }}>Reps</span>
                      <span style={{ flex: 1 }}>Weight (kg)</span>
                      <span style={{ width: 32 }}></span>
                    </div>

                    {ex.sets.map((set, setIdx) => (
                      <div key={setIdx} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 8,
                          background: 'var(--card)', border: '1px solid var(--border)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.8rem', fontWeight: 700, color: 'var(--text3)', flexShrink: 0,
                        }}>{setIdx + 1}</div>
                        <input className="input-ft" type="number" value={set.reps} onChange={e => updateSet(ex.instanceId, setIdx, 'reps', e.target.value)} placeholder="12" min={1} style={{ flex: 1, padding: '8px 12px' }} />
                        <input className="input-ft" type="number" value={set.weight} onChange={e => updateSet(ex.instanceId, setIdx, 'weight', e.target.value)} placeholder="0" min={0} step={0.5} style={{ flex: 1, padding: '8px 12px' }} />
                        <button onClick={() => removeSet(ex.instanceId, setIdx)} disabled={ex.sets.length === 1} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: ex.sets.length === 1 ? 'not-allowed' : 'pointer', padding: '4px', width: 32, opacity: ex.sets.length === 1 ? 0.3 : 1 }}
                          onMouseEnter={e => { if (ex.sets.length > 1) e.currentTarget.style.color = 'var(--danger)'; }}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}
                        >✕</button>
                      </div>
                    ))}

                    <button onClick={() => addSet(ex.instanceId)} style={{
                      background: 'transparent', color: 'var(--primary)',
                      border: '1px dashed rgba(93,214,44,0.3)', borderRadius: 8,
                      padding: '8px 14px', cursor: 'pointer', fontSize: '0.82rem',
                      fontWeight: 600, fontFamily: 'var(--font-body)', width: '100%',
                      marginTop: 4, transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(93,214,44,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      + Add Set
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Notes ── */}
        <div className="card-ft" style={{ marginBottom: 24 }}>
          <label className="label-ft">Notes (optional)</label>
          <textarea className="textarea-ft" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="How did it feel? Any PRs? Notes for next time..." rows={3} />
        </div>

        {/* ── Save Button ── */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={() => navigate('/')} className="btn-ghost-ft">Cancel</button>
          <button onClick={handleSave} className="btn-primary-ft" style={{ fontSize: '1rem', padding: '14px 36px' }}>
            <RiCheckLine size={18} /> Save Workout
          </button>
        </div>
      </div>
    </div>
  );
}