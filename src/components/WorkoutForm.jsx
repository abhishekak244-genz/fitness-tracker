import React, { useState } from 'react';
import exercises from '../data/Exercises.json';
import { generateId } from '../api/allFitnessApi';
import { RiAddLine, RiDeleteBin6Line, RiSearch2Line } from 'react-icons/ri';

const CATEGORIES = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];


export default function WorkoutForm({ initialData = {}, onSave, onCancel, saveLabel = 'Save Workout' }) {
  const [form, setForm] = useState({
    name:     initialData.name     || '',
    date:     initialData.date     || new Date().toISOString().split('T')[0],
    duration: initialData.duration || '',
    notes:    initialData.notes    || '',
  });

  const [selectedExercises, setSelectedExercises] = useState(
    initialData.exercises?.map(ex => ({ ...ex, instanceId: generateId() })) || []
  );

  const [exSearch,    setExSearch]    = useState('');
  const [exCategory,  setExCategory]  = useState('All');
  const [showLibrary, setShowLibrary] = useState(false);
  const [errors,      setErrors]      = useState({});

  const filteredExercises = exercises.filter(ex => {
    const matchCat    = exCategory === 'All' || ex.category === exCategory;
    const matchSearch = ex.name.toLowerCase().includes(exSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  /* ── Exercise management ── */
  const addExercise = (ex) => {
    if (selectedExercises.find(e => e.id === ex.id)) return;
    setSelectedExercises(prev => [
      ...prev,
      { ...ex, instanceId: generateId(), sets: [{ reps: '', weight: '' }] },
    ]);
    setShowLibrary(false);
  };

  const removeExercise = (instanceId) =>
    setSelectedExercises(prev => prev.filter(e => e.instanceId !== instanceId));

  const addSet = (instanceId) =>
    setSelectedExercises(prev => prev.map(e =>
      e.instanceId === instanceId
        ? { ...e, sets: [...e.sets, { reps: '', weight: '' }] }
        : e
    ));

  const removeSet = (instanceId, si) =>
    setSelectedExercises(prev => prev.map(e =>
      e.instanceId === instanceId
        ? { ...e, sets: e.sets.filter((_, i) => i !== si) }
        : e
    ));

  const updateSet = (instanceId, si, field, value) =>
    setSelectedExercises(prev => prev.map(e =>
      e.instanceId === instanceId
        ? { ...e, sets: e.sets.map((s, i) => i === si ? { ...s, [field]: value } : s) }
        : e
    ));

  /* ── Validation & Submit ── */
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Workout name is required';
    if (!form.date)        e.date = 'Date is required';
    if (!selectedExercises.length) e.exercises = 'Add at least one exercise';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave?.({
      ...form,
      exercises: selectedExercises.map(({ instanceId, ...rest }) => rest),
    });
  };

  /* ── Summary ── */
  const totalSets = selectedExercises.reduce((t, e) => t + e.sets.length, 0);
  const totalVol  = selectedExercises.reduce((t, e) =>
    t + e.sets.reduce((st, s) => st + (parseFloat(s.reps || 0) * parseFloat(s.weight || 0)), 0), 0
  );

  return (
    <div>
      {/* ── Summary chips ── */}
      {selectedExercises.length > 0 && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {[
            { label: `${selectedExercises.length} exercises`, style: {} },
            { label: `${totalSets} sets`, style: {} },
            ...(totalVol > 0 ? [{ label: `${totalVol >= 1000 ? (totalVol/1000).toFixed(1)+'k' : Math.round(totalVol)} kg`, style: { background: 'rgba(93,214,44,0.1)', border: '1px solid rgba(93,214,44,0.3)', color: 'var(--primary)', fontWeight: 700 } }] : []),
          ].map((chip, i) => (
            <span key={i} style={{
              padding: '5px 14px', borderRadius: 20,
              background: 'var(--card)', border: '1px solid var(--border)',
              fontSize: '0.8rem', color: 'var(--text2)',
              ...chip.style,
            }}>{chip.label}</span>
          ))}
        </div>
      )}

      {/* ── Meta form ── */}
      <div className="card-ft" style={{ marginBottom: 16 }}>
        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', letterSpacing: '0.08em', marginBottom: 16, color: 'var(--text)' }}>
          WORKOUT DETAILS
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 14 }}>
          <div className="form-group-ft" style={{ marginBottom: 0 }}>
            <label className="label-ft">Workout Name</label>
            <input className="input-ft" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Push Day, Upper Body..." />
            {errors.name && <p style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: 4 }}>{errors.name}</p>}
          </div>
          <div className="form-group-ft" style={{ marginBottom: 0 }}>
            <label className="label-ft">Date</label>
            <input className="input-ft" type="date" value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>
          <div className="form-group-ft" style={{ marginBottom: 0 }}>
            <label className="label-ft">Duration (min)</label>
            <input className="input-ft" type="number" value={form.duration}
              onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
              placeholder="60" min={1} />
          </div>
        </div>
      </div>

      {/* ── Exercises ── */}
      <div className="card-ft" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', letterSpacing: '0.08em', color: 'var(--text)' }}>EXERCISES</h4>
          <button onClick={() => setShowLibrary(!showLibrary)} className="btn-outline-ft" style={{ fontSize: '0.82rem', padding: '8px 16px' }}>
            <RiAddLine size={14} /> Add Exercise
          </button>
        </div>

        {/* Library picker */}
        {showLibrary && (
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 16, animation: 'fadeInUp 0.2s ease' }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <RiSearch2Line style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none' }} size={16} />
                <input className="input-ft" value={exSearch} onChange={e => setExSearch(e.target.value)}
                  placeholder="Search exercises..." style={{ paddingLeft: 36 }} />
              </div>
              <select className="select-ft" value={exCategory}
                onChange={e => setExCategory(e.target.value)} style={{ width: 130 }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 8, maxHeight: 220, overflowY: 'auto' }}>
              {filteredExercises.map(ex => {
                const added = !!selectedExercises.find(e => e.id === ex.id);
                return (
                  <div key={ex.id} onClick={() => !added && addExercise(ex)} style={{
                    padding: '10px 14px', borderRadius: 8,
                    border: `1px solid ${added ? 'rgba(93,214,44,0.3)' : 'var(--border)'}`,
                    background: added ? 'rgba(93,214,44,0.07)' : 'var(--card)',
                    cursor: added ? 'default' : 'pointer',
                    opacity: added ? 0.6 : 1, transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { if (!added) { e.currentTarget.style.borderColor = 'rgba(93,214,44,0.5)'; e.currentTarget.style.background = 'rgba(93,214,44,0.05)'; } }}
                    onMouseLeave={e => { if (!added) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--card)'; } }}
                  >
                    <div style={{ fontSize: '0.87rem', fontWeight: 600, color: added ? 'var(--primary)' : 'var(--text)', marginBottom: 2 }}>
                      {added && '✓ '}{ex.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{ex.category} · {ex.difficulty}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {errors.exercises && (
          <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginBottom: 12 }}>{errors.exercises}</p>
        )}

        {/* Exercise list */}
        {selectedExercises.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '28px 20px', color: 'var(--text3)', border: '2px dashed var(--border)', borderRadius: 10 }}>
            <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>➕</div>
            <p style={{ fontSize: '0.875rem' }}>Click "Add Exercise" to start building your workout</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {selectedExercises.map((ex, exIdx) => (
              <div key={ex.instanceId} style={{ background: 'var(--bg2)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
                {/* Exercise header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--card2)', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--primary)' }}>
                      {String(exIdx + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--text)', letterSpacing: '0.05em' }}>{ex.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>{ex.category} · {ex.equipment}</div>
                    </div>
                  </div>
                  <button onClick={() => removeExercise(ex.instanceId)} className="btn-danger-ft" style={{ padding: '6px 10px' }}>
                    <RiDeleteBin6Line size={13} />
                  </button>
                </div>

                {/* Sets */}
                <div style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text3)', paddingLeft: 4 }}>
                    <span style={{ width: 34 }}>Set</span>
                    <span style={{ flex: 1 }}>Reps</span>
                    <span style={{ flex: 1 }}>Weight (kg)</span>
                    <span style={{ width: 30 }} />
                  </div>

                  {ex.sets.map((set, si) => (
                    <div key={si} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 7,
                        background: 'var(--card)', border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.78rem', fontWeight: 700, color: 'var(--text3)', flexShrink: 0,
                      }}>{si + 1}</div>
                      <input className="input-ft" type="number" value={set.reps}
                        onChange={e => updateSet(ex.instanceId, si, 'reps', e.target.value)}
                        placeholder="12" min={1} style={{ flex: 1, padding: '8px 12px' }} />
                      <input className="input-ft" type="number" value={set.weight}
                        onChange={e => updateSet(ex.instanceId, si, 'weight', e.target.value)}
                        placeholder="0" min={0} step={0.5} style={{ flex: 1, padding: '8px 12px' }} />
                      <button onClick={() => removeSet(ex.instanceId, si)}
                        disabled={ex.sets.length === 1}
                        style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: ex.sets.length === 1 ? 'not-allowed' : 'pointer', padding: '4px', width: 30, opacity: ex.sets.length === 1 ? 0.3 : 1 }}
                        onMouseEnter={e => { if (ex.sets.length > 1) e.currentTarget.style.color = 'var(--danger)'; }}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}
                      >✕</button>
                    </div>
                  ))}

                  <button onClick={() => addSet(ex.instanceId)} style={{
                    background: 'transparent', color: 'var(--primary)',
                    border: '1px dashed rgba(93,214,44,0.3)', borderRadius: 8,
                    padding: '7px 14px', cursor: 'pointer', fontSize: '0.82rem',
                    fontWeight: 600, fontFamily: 'var(--font-body)', width: '100%',
                    marginTop: 4, transition: 'background 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(93,214,44,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >+ Add Set</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Notes ── */}
      <div className="card-ft" style={{ marginBottom: 20 }}>
        <label className="label-ft">Notes (optional)</label>
        <textarea className="textarea-ft" value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          placeholder="How did it feel? PRs? Notes for next time..." rows={3} />
      </div>

      {/* ── Actions ── */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        {onCancel && (
          <button onClick={onCancel} className="btn-ghost-ft">Cancel</button>
        )}
        <button onClick={handleSave} className="btn-primary-ft" style={{ padding: '13px 32px' }}>
          ✓ {saveLabel}
        </button>
      </div>
    </div>
  );
}