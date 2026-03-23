import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import StatCard from '../components/StatCard';
import WorkoutCard from '../components/WorkoutCard';
import { VolumeBarChart } from '../components/ProgressChart';
import foodsData from '../data/Foods.json';
import workoutsData from '../data/workouts.json';
import {
  RiAddCircleLine, RiBookOpenLine, RiBarChartLine, RiHistoryLine, RiDeleteBin6Line,
} from 'react-icons/ri';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function Home() {
  const {
    user, workouts,
    addNutrition, deleteNutrition, deleteWorkout,
    getThisWeekWorkouts, getTotalVolume, getStreak,
    getWeeklyVolume, getTodayCalories, getTodayNutrition,
  } = useWorkout();

  const [tip] = useState(() => {
    const tips = workoutsData?.dailyTips || [
      'Progressive overload is the #1 driver of muscle growth. Add weight or reps each week.',
      'Sleep 7-9 hours. Growth hormone peaks during deep sleep.',
      'Protein synthesis stays elevated 24-48h post workout. Keep protein high every day.',
      'Compound lifts first, isolation last. Prioritise squats, deadlifts, bench, and rows.',
      'Track your workouts. What gets measured gets improved.',
      'Consistency beats intensity. 3 solid workouts/week for a year beats 6 chaotic weeks.',
      'Hydrate. Even 2% dehydration significantly reduces strength output.',
      'Deload every 4-6 weeks. Strategic rest prevents injury and resets CNS fatigue.',
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  });
  const [showNutritionForm, setShowNutritionForm] = useState(false);
  const [foodSearch,   setFoodSearch]   = useState('');
  const [selectedFood, setSelectedFood] = useState('');
  const [qty,          setQty]          = useState(1);
  const [saving,       setSaving]       = useState(false);

  const weekWorkouts  = getThisWeekWorkouts();
  const totalVol      = getTotalVolume();
  const streak        = getStreak();
  const weeklyData    = getWeeklyVolume();
  const todayCals     = getTodayCalories();
  const todayNutrition = getTodayNutrition();

  const calorieGoal = user?.goal === 'Lose Weight' ? 1800 : user?.goal === 'Build Muscle' ? 2800 : 2200;
  const weekGoalPct = Math.min(100, Math.round((weekWorkouts.length / (user?.weeklyTarget || 3)) * 100));

  const filteredFoods = foodsData.foods.filter(f =>
    f.name.toLowerCase().includes(foodSearch.toLowerCase()) ||
    f.category.toLowerCase().includes(foodSearch.toLowerCase())
  );

  const handleAddNutrition = async () => {
    const food = foodsData.foods.find(f => f.id === selectedFood);
    if (!food) return;
    setSaving(true);
    await addNutrition({
      foodId:   food.id,
      foodName: food.name,
      icon:     food.icon,
      calories: Math.round(food.calories * qty),
      protein:  Math.round(food.protein  * qty),
      carbs:    Math.round(food.carbs    * qty),
      fat:      Math.round(food.fat      * qty),
      qty,
    });
    setSaving(false);
    setSelectedFood(''); setQty(1); setShowNutritionForm(false); setFoodSearch('');
  };

  return (
    <div className="page-wrap">
      <div className="container-ft">

        {/* ── Hero Banner ── */}
        <div style={{
          position: 'relative', borderRadius: 18, overflow: 'hidden',
          background: 'linear-gradient(135deg, #0F0F0F 0%, #141414 50%, #111 100%)',
          border: '1px solid rgba(93,214,44,0.2)', padding: '40px 36px', marginBottom: 28,
          boxShadow: '0 0 60px rgba(93,214,44,0.06)',
        }}>
          <div style={{ position: 'absolute', right: -60, top: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(93,214,44,0.04)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 40, top: 40, width: 120, height: 120, borderRadius: '50%', background: 'rgba(93,214,44,0.06)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--primary)', marginBottom: 8 }}>
              {getGreeting()}
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.2rem)', letterSpacing: '0.05em', marginBottom: 8, lineHeight: 1 }}>
              {user?.name?.toUpperCase() || 'ATHLETE'} 👊
            </h1>
            <p style={{ color: 'var(--text2)', fontSize: '0.95rem', maxWidth: 400, marginBottom: 24 }}>
              {user?.goal ? `Goal: ${user.goal}` : "Ready to crush today's session?"} · {streak > 0 ? `🔥 ${streak}-day streak` : 'Start your streak today!'}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/tracker" className="btn-primary-ft"><RiAddCircleLine size={16} /> Log Workout</Link>
              <Link to="/library" className="btn-ghost-ft"><RiBookOpenLine size={16} /> Exercise Library</Link>
            </div>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid-4" style={{ marginBottom: 28 }}>
          <StatCard icon="🏋️" label="Total Workouts" value={workouts.length}      color="var(--primary)" delay={50} />
          <StatCard icon="📅" label="This Week"       value={weekWorkouts.length}   color="#3b82f6" delay={100} trendLabel={`of ${user?.weeklyTarget || 3} target`} />
          <StatCard icon="⚡" label="Total Volume"    value={totalVol} unit="kg"   color="#f59e0b" delay={150} />
          <StatCard icon="🔥" label="Day Streak"      value={streak}               color="#ef4444" delay={200} trendLabel="consecutive days" />
        </div>

        {/* ── Weekly Progress + Activity Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
          <div className="card-ft">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '0.05em' }}>WEEKLY GOAL</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{weekWorkouts.length} / {user?.weeklyTarget || 3} workouts</p>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: weekGoalPct === 100 ? 'var(--primary)' : 'var(--text)' }}>{weekGoalPct}%</span>
            </div>
            <div className="progress-ft" style={{ height: 10, marginBottom: 20 }}>
              <div className="progress-fill-ft" style={{ width: `${weekGoalPct}%` }} />
            </div>
            <VolumeBarChart data={weeklyData} />
          </div>

          <div className="card-ft">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '0.05em', marginBottom: 4 }}>7-DAY ACTIVITY</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: 20 }}>This week's training days</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              {weeklyData.map((d, i) => {
                const isToday = i === new Date().getDay();
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: d.hasWorkout ? 'var(--primary)' : isToday ? 'rgba(93,214,44,0.1)' : 'var(--card2)', border: `1.5px solid ${d.hasWorkout ? 'var(--primary)' : isToday ? 'rgba(93,214,44,0.4)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: d.hasWorkout ? '#000' : 'var(--text3)', fontWeight: 700 }}>
                      {d.hasWorkout ? '✓' : isToday ? '•' : ''}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: isToday ? 'var(--primary)' : 'var(--text3)', fontWeight: isToday ? 700 : 400 }}>{d.day}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 24 }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: 10 }}>Muscle groups this week</p>
              {['Chest','Back','Legs','Core'].map((mg, i) => {
                const pct    = [72, 55, 40, 85][i];
                const colors = ['#ef4444','#3b82f6','#8b5cf6','#5DD62C'];
                return (
                  <div key={mg} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text2)', width: 44, textAlign: 'right' }}>{mg}</span>
                    <div style={{ flex: 1, height: 5, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: colors[i], borderRadius: 99 }} />
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text3)', width: 28 }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Nutrition ── */}
        <div className="card-ft" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '0.05em' }}>TODAY'S NUTRITION</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{todayCals} / {calorieGoal} kcal</p>
            </div>
            <button onClick={() => setShowNutritionForm(!showNutritionForm)} className="btn-outline-ft" style={{ fontSize: '0.82rem', padding: '8px 16px' }}>
              <RiAddCircleLine size={14} /> Add Food
            </button>
          </div>

          <div className="progress-ft" style={{ height: 12, marginBottom: 16 }}>
            <div className="progress-fill-ft" style={{ width: `${Math.min(100, (todayCals / calorieGoal) * 100)}%` }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: (showNutritionForm || todayNutrition.length > 0) ? 20 : 0 }}>
            {[
              { label: 'Protein', val: todayNutrition.reduce((t,n) => t+(n.protein||0), 0), color: '#ef4444' },
              { label: 'Carbs',   val: todayNutrition.reduce((t,n) => t+(n.carbs||0),   0), color: '#f59e0b' },
              { label: 'Fats',    val: todayNutrition.reduce((t,n) => t+(n.fat||0),     0), color: '#3b82f6' },
            ].map(m => (
              <div key={m.label} style={{ textAlign: 'center', padding: 12, background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: m.color }}>{Math.round(m.val)}<span style={{ fontSize: '0.9rem' }}>g</span></div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Add food form */}
          {showNutritionForm && (
            <div style={{ background: 'var(--bg2)', borderRadius: 12, padding: 16, marginBottom: 16, border: '1px solid var(--border)', animation: 'fadeInUp 0.2s ease' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px auto', gap: 10, alignItems: 'end' }}>
                <div>
                  <label className="label-ft">Search Food</label>
                  <input className="input-ft" value={foodSearch} onChange={e => setFoodSearch(e.target.value)} placeholder="e.g. Chicken, Oats..." style={{ marginBottom: 6 }} />
                  {foodSearch && (
                    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, maxHeight: 160, overflowY: 'auto' }}>
                      {filteredFoods.slice(0, 6).map(f => (
                        <div key={f.id} onClick={() => { setSelectedFood(f.id); setFoodSearch(f.name); }} style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8, background: selectedFood === f.id ? 'rgba(93,214,44,0.1)' : 'transparent', color: selectedFood === f.id ? 'var(--primary)' : 'var(--text)' }}>
                          <span>{f.icon}</span>
                          <span style={{ flex: 1 }}>{f.name}</span>
                          <span style={{ color: 'var(--text3)', fontSize: '0.75rem' }}>{f.calories} kcal</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="label-ft">Qty</label>
                  <input className="input-ft" type="number" value={qty} onChange={e => setQty(parseFloat(e.target.value)||1)} min={0.5} step={0.5} />
                </div>
                <button onClick={handleAddNutrition} className="btn-primary-ft" style={{ height: 46, alignSelf: 'end' }} disabled={!selectedFood || saving}>
                  {saving ? '...' : 'Add'}
                </button>
              </div>
            </div>
          )}

          {/* Food log */}
          {todayNutrition.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {todayNutrition.map(n => (
                <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--bg2)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '1.1rem' }}>{n.icon || '🍽️'}</span>
                  <span style={{ flex: 1, fontSize: '0.87rem', fontWeight: 500 }}>{n.foodName}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{n.calories} kcal</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>P:{n.protein}g C:{n.carbs}g F:{n.fat}g</span>
                  <button onClick={() => deleteNutrition(n.id)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: '2px' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}>
                    <RiDeleteBin6Line size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {todayNutrition.length === 0 && !showNutritionForm && (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text3)', fontSize: '0.875rem' }}>
              No food logged today. Hit "Add Food" to track calories.
            </div>
          )}
        </div>

        {/* ── Recent Workouts + Quick Actions ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 28 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 className="section-title" style={{ fontSize: '1.3rem' }}>RECENT WORKOUTS</h3>
              <Link to="/history" style={{ fontSize: '0.82rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>View All →</Link>
            </div>
            {workouts.slice(0, 3).map(w => (
              <WorkoutCard key={w.id} workout={w} onDelete={deleteWorkout} />
            ))}
            {workouts.length === 0 && (
              <div className="card-ft" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text3)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🏋️</div>
                <p style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginBottom: 6 }}>NO WORKOUTS YET</p>
                <p style={{ fontSize: '0.85rem' }}>Log your first session to get started!</p>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card-ft">
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.08em', marginBottom: 14 }}>QUICK ACTIONS</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { to: '/tracker',  icon: <RiAddCircleLine size={16} />, label: 'Log Workout' },
                  { to: '/library',  icon: <RiBookOpenLine  size={16} />, label: 'Browse Exercises' },
                  { to: '/progress', icon: <RiBarChartLine  size={16} />, label: 'View Progress' },
                  { to: '/history',  icon: <RiHistoryLine   size={16} />, label: 'Workout History' },
                ].map(({ to, icon, label }) => (
                  <Link key={to} to={to} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)', textDecoration: 'none', color: 'var(--text2)', fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(93,214,44,0.3)'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.background = 'rgba(93,214,44,0.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.background = 'var(--bg2)'; }}
                  >
                    <span style={{ color: 'var(--primary)' }}>{icon}</span>{label}
                  </Link>
                ))}
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, rgba(93,214,44,0.08), rgba(93,214,44,0.03))', border: '1px solid rgba(93,214,44,0.2)', borderRadius: 'var(--radius)', padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: '1.1rem' }}>💡</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'var(--primary)', letterSpacing: '0.08em' }}>DAILY TIP</span>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text2)', lineHeight: 1.65 }}>{tip}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}