import React, { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';

// ── Hardcoded constants — no workouts.json dependency ──────────────
const BODY_TYPES = [
  { id: 'ectomorph',  label: 'Ectomorph',  icon: '🏃', description: 'Lean & long, difficulty building muscle' },
  { id: 'mesomorph',  label: 'Mesomorph',  icon: '💪', description: 'Athletic & muscular, gains muscle easily' },
  { id: 'endomorph',  label: 'Endomorph',  icon: '🏋️', description: 'Stocky & solid, gains fat more easily' },
];

const FITNESS_GOALS = [
  'Lose Weight', 'Build Muscle', 'Improve Endurance',
  'Increase Strength', 'Stay Active', 'Improve Flexibility',
];

const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Elite'];

const STEPS = ['Identity', 'Body', 'Goals'];

export default function Setup() {
  const { setupUser } = useWorkout();

  const [step,   setStep]   = useState(0);
  const [saving, setSaving] = useState(false);
  const [form,   setForm]   = useState({
    name: '', gender: '', bodyType: '',
    age: '', weight: '', height: '',
    goal: '', experience: '', weeklyTarget: 3,
  });
  const [errors, setErrors] = useState({});

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.name.trim()) e.name   = 'Name is required';
      if (!form.gender)      e.gender = 'Select your gender';
    }
    if (step === 1 && !form.bodyType)  e.bodyType   = 'Select a body type';
    if (step === 2) {
      if (!form.goal)       e.goal       = 'Select a goal';
      if (!form.experience) e.experience = 'Select experience level';
    }
    setErrors(e);
    return !Object.keys(e).length;
  };

  const next   = () => { if (validate()) setStep(s => s + 1); };
  const back   = () => setStep(s => s - 1);

  const submit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await setupUser(form);
    } catch {
      setErrors({ _server: 'Could not save. Is json-server running on port 3000?' });
    } finally {
      setSaving(false);
    }
  };

  // ── shared button style helpers ──
  const selBtn = (active) => ({
    border:      `1.5px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
    background:  active ? 'rgba(93,214,44,0.1)' : 'var(--bg2)',
    color:       active ? 'var(--primary)' : 'var(--text2)',
    cursor:      'pointer',
    transition:  'all 0.2s',
    fontFamily:  'var(--font-body)',
    fontWeight:  600,
  });

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, position: 'relative', overflow: 'hidden',
    }}>
      {/* BG blobs */}
      <div style={{ position:'absolute', top:'10%', left:'5%', width:300, height:300, borderRadius:'50%', background:'rgba(93,214,44,0.04)', filter:'blur(80px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'10%', right:'5%', width:400, height:400, borderRadius:'50%', background:'rgba(93,214,44,0.03)', filter:'blur(100px)', pointerEvents:'none' }} />

      <div style={{ width:'100%', maxWidth:560, animation:'fadeInUp 0.5s ease' }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ width:64, height:64, borderRadius:16, background:'var(--primary)', margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', color:'#000', fontFamily:'var(--font-display)', boxShadow:'0 0 30px rgba(93,214,44,0.4)' }}>
            FT
          </div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2.2rem', letterSpacing:'0.1em' }}>
            FIT<span style={{ color:'var(--primary)' }}>TRACK</span>
          </h1>
          <p style={{ color:'var(--text3)', fontSize:'0.9rem', marginTop:4 }}>Your personal fitness companion</p>
        </div>

        {/* Step indicators */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', marginBottom:32 }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background: i <= step ? 'var(--primary)' : 'var(--card2)', border:`2px solid ${i <= step ? 'var(--primary)' : 'var(--border)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', fontWeight:700, color: i <= step ? '#000' : 'var(--text3)', transition:'all 0.3s' }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ fontSize:'0.72rem', color: i === step ? 'var(--primary)' : 'var(--text3)', fontWeight: i === step ? 700 : 400, letterSpacing:'0.06em', textTransform:'uppercase' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ width:80, height:2, background: i < step ? 'var(--primary)' : 'var(--border)', margin:'0 8px', marginBottom:22, transition:'background 0.3s' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:32 }}>

          {/* Server error */}
          {errors._server && (
            <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'12px 16px', marginBottom:16, fontSize:'0.85rem', color:'var(--danger)' }}>
              ⚠️ {errors._server}
            </div>
          )}

          {/* ── Step 0: Identity ── */}
          {step === 0 && (
            <div style={{ animation:'fadeInUp 0.3s ease' }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', marginBottom:4 }}>WHO ARE YOU?</h2>
              <p style={{ color:'var(--text3)', fontSize:'0.875rem', marginBottom:28 }}>Let's get to know you first.</p>

              <div className="form-group-ft">
                <label className="label-ft">Your Name</label>
                <input className="input-ft" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Alex Johnson" />
                {errors.name && <p style={{ color:'var(--danger)', fontSize:'0.8rem', marginTop:4 }}>{errors.name}</p>}
              </div>

              <div className="form-group-ft">
                <label className="label-ft">Gender</label>
                <div style={{ display:'flex', gap:10 }}>
                  {['Male','Female','Other'].map(g => (
                    <button key={g} onClick={() => set('gender', g)} style={{ flex:1, padding:12, borderRadius:10, ...selBtn(form.gender === g), fontSize:'0.9rem' }}>
                      {g === 'Male' ? '♂ Male' : g === 'Female' ? '♀ Female' : '⚥ Other'}
                    </button>
                  ))}
                </div>
                {errors.gender && <p style={{ color:'var(--danger)', fontSize:'0.8rem', marginTop:4 }}>{errors.gender}</p>}
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
                {[
                  { label:'Age',        key:'age',    placeholder:'25',  type:'number' },
                  { label:'Weight (kg)',key:'weight', placeholder:'75',  type:'number' },
                  { label:'Height (cm)',key:'height', placeholder:'175', type:'number' },
                ].map(field => (
                  <div key={field.key} className="form-group-ft" style={{ marginBottom:0 }}>
                    <label className="label-ft">{field.label}</label>
                    <input className="input-ft" type={field.type} value={form[field.key]} onChange={e => set(field.key, e.target.value)} placeholder={field.placeholder} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 1: Body Type ── */}
          {step === 1 && (
            <div style={{ animation:'fadeInUp 0.3s ease' }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', marginBottom:4 }}>YOUR BODY TYPE</h2>
              <p style={{ color:'var(--text3)', fontSize:'0.875rem', marginBottom:28 }}>This helps personalise your recommendations.</p>

              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {BODY_TYPES.map(bt => (
                  <button key={bt.id} onClick={() => set('bodyType', bt.id)} style={{ padding:'18px 20px', borderRadius:12, textAlign:'left', display:'flex', alignItems:'center', gap:16, ...selBtn(form.bodyType === bt.id) }}>
                    <span style={{ fontSize:'2rem' }}>{bt.icon}</span>
                    <div>
                      <div style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', color: form.bodyType === bt.id ? 'var(--primary)' : 'var(--text)', letterSpacing:'0.05em' }}>{bt.label}</div>
                      <div style={{ fontSize:'0.82rem', color:'var(--text3)', marginTop:2 }}>{bt.description}</div>
                    </div>
                    {form.bodyType === bt.id && <span style={{ marginLeft:'auto', color:'var(--primary)', fontSize:'1.2rem' }}>✓</span>}
                  </button>
                ))}
              </div>
              {errors.bodyType && <p style={{ color:'var(--danger)', fontSize:'0.8rem', marginTop:8 }}>{errors.bodyType}</p>}
            </div>
          )}

          {/* ── Step 2: Goals ── */}
          {step === 2 && (
            <div style={{ animation:'fadeInUp 0.3s ease' }}>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', marginBottom:4 }}>YOUR GOALS</h2>
              <p style={{ color:'var(--text3)', fontSize:'0.875rem', marginBottom:24 }}>Set the stage for your transformation.</p>

              <div className="form-group-ft">
                <label className="label-ft">Primary Goal</label>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8 }}>
                  {FITNESS_GOALS.map(g => (
                    <button key={g} onClick={() => set('goal', g)} style={{ padding:'11px 14px', borderRadius:10, textAlign:'left', fontSize:'0.85rem', ...selBtn(form.goal === g) }}>
                      {g}
                    </button>
                  ))}
                </div>
                {errors.goal && <p style={{ color:'var(--danger)', fontSize:'0.8rem', marginTop:4 }}>{errors.goal}</p>}
              </div>

              <div className="form-group-ft">
                <label className="label-ft">Experience Level</label>
                <div style={{ display:'flex', gap:8 }}>
                  {EXPERIENCE_LEVELS.map(lvl => (
                    <button key={lvl} onClick={() => set('experience', lvl)} style={{ flex:1, padding:'10px 6px', borderRadius:10, fontSize:'0.78rem', ...selBtn(form.experience === lvl) }}>
                      {lvl}
                    </button>
                  ))}
                </div>
                {errors.experience && <p style={{ color:'var(--danger)', fontSize:'0.8rem', marginTop:4 }}>{errors.experience}</p>}
              </div>

              <div className="form-group-ft">
                <label className="label-ft">
                  Weekly Target: <span style={{ color:'var(--primary)' }}>{form.weeklyTarget} days</span>
                </label>
                <input type="range" min={1} max={7} value={form.weeklyTarget}
                  onChange={e => set('weeklyTarget', parseInt(e.target.value))}
                  style={{ width:'100%', accentColor:'var(--primary)' }} />
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'var(--text3)', marginTop:4 }}>
                  <span>1 day</span><span>7 days</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:28 }}>
            {step > 0
              ? <button onClick={back} className="btn-ghost-ft">← Back</button>
              : <div />
            }
            {step < STEPS.length - 1
              ? <button onClick={next} className="btn-primary-ft">Continue →</button>
              : <button onClick={submit} className="btn-primary-ft" disabled={saving}>
                  {saving ? '⏳ Saving...' : '🚀 Start Tracking'}
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}