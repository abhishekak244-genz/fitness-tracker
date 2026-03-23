// ═══════════════════════════════════════════════
//  allFitnessApi.js — uses apiService wrapper
//  apiService(httpMethod, url, reqBody)
//  → returns full axios response { data, status }
// ═══════════════════════════════════════════════

import apiService from './Apiservice';

export const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// ════════════════════════════════════════════════
//  USER API  →  /users
// ════════════════════════════════════════════════
export const userApi = {

  /** GET /users → return first user or null */
  get: async () => {
    try {
      const response = await apiService('GET', '/users');
      const data = response.data;
      return Array.isArray(data) ? (data[0] || null) : null;
    } catch { return null; }
  },

  /** Create user — POST if new, PUT if exists */
  create: async (userData) => {
    const payload = { id: '1', ...userData, createdAt: new Date().toISOString() };
    try {
      // Check if user already exists
      const checkRes = await apiService('GET', '/users?id=1');
      const existing = checkRes.data;
      if (Array.isArray(existing) && existing.length > 0) {
        // User exists → PUT (full replace)
        const response = await apiService('PUT', '/users/1', payload);
        return response.data;
      } else {
        // User doesn't exist → POST (create)
        const response = await apiService('POST', '/users', payload);
        return response.data;
      }
    } catch {
      // Fallback → POST
      const response = await apiService('POST', '/users', payload);
      return response.data;
    }
  },

  /** PATCH /users/1 — partial update */
  update: async (updates) => {
    const response = await apiService('PATCH', '/users/1', updates);
    return response.data;
  },

  /** DELETE /users/1 */
  delete: async () => {
    try {
      await apiService('DELETE', '/users/1');
    } catch { /* ignore if not found */ }
  },
};

// ════════════════════════════════════════════════
//  WORKOUT API  →  /workouts
// ════════════════════════════════════════════════
export const workoutApi = {

  /** GET /workouts → all workouts, newest first */
  getAll: async () => {
    try {
      const response = await apiService('GET', '/workouts?_sort=date&_order=desc');
      return response.data || [];
    } catch { return []; }
  },

  /** POST /workouts → add new workout */
  add: async (workout) => {
    const payload = {
      ...workout,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const response = await apiService('POST', '/workouts', payload);
    return response.data;
  },

  /** DELETE /workouts/:id */
  delete: async (id) => {
    const response = await apiService('DELETE', `/workouts/${id}`);
    return response.data;
  },

  /** Filter workouts to current calendar week */
  getThisWeek: async () => {
    const all   = await workoutApi.getAll();
    const start = new Date();
    start.setDate(start.getDate() - start.getDay());
    start.setHours(0, 0, 0, 0);
    return all.filter(w => new Date(w.date) >= start);
  },
};

// ════════════════════════════════════════════════
//  NUTRITION API  →  /nutrition
// ════════════════════════════════════════════════
export const nutritionApi = {

  /** GET /nutrition → all entries, newest first */
  getAll: async () => {
    try {
      const response = await apiService('GET', '/nutrition?_sort=date&_order=desc');
      return response.data || [];
    } catch { return []; }
  },

  /** POST /nutrition → log food entry */
  add: async (entry) => {
    const payload = {
      ...entry,
      id:   generateId(),
      date: entry.date || new Date().toISOString(),
    };
    const response = await apiService('POST', '/nutrition', payload);
    return response.data;
  },

  /** DELETE /nutrition/:id */
  delete: async (id) => {
    const response = await apiService('DELETE', `/nutrition/${id}`);
    return response.data;
  },

  /** Filter to today's entries */
  getTodayLog: async () => {
    const all   = await nutritionApi.getAll();
    const today = new Date().toDateString();
    return all.filter(n => new Date(n.date).toDateString() === today);
  },
};

// ════════════════════════════════════════════════
//  STATS — pure computed helpers (no HTTP calls)
//  All functions guard against undefined input
// ════════════════════════════════════════════════
export const statsApi = {

  getTotalVolume: (workouts) =>
    (workouts || []).reduce((t, w) =>
      t + (w.exercises || []).reduce((et, ex) =>
        et + (ex.sets || []).reduce((st, s) =>
          st + (parseFloat(s.reps || 0) * parseFloat(s.weight || 0)), 0), 0), 0),

  getStreak: (workouts) => {
    const list = workouts || [];
    if (!list.length) return 0;
    const sorted = [...new Set(list.map(w => new Date(w.date).toDateString()))]
      .sort((a, b) => new Date(b) - new Date(a));
    let streak = 0;
    let cur = new Date();
    cur.setHours(0, 0, 0, 0);
    for (const ds of sorted) {
      const diff = Math.floor((cur - new Date(ds)) / 86400000);
      if (diff <= 1) { streak++; cur = new Date(ds); } else break;
    }
    return streak;
  },

  getPersonalRecords: (workouts) => {
    const records = {};
    (workouts || []).forEach(w =>
      (w.exercises || []).forEach(ex =>
        (ex.sets || []).forEach(s => {
          const wt = parseFloat(s.weight || 0);
          if (!records[ex.name] || wt > records[ex.name].weight)
            records[ex.name] = { weight: wt, reps: parseFloat(s.reps || 0), date: w.date };
        })
      )
    );
    return records;
  },

  getWeeklyVolume: (workouts) => {
    const list = workouts || [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now  = new Date();
    return days.map((day, i) => {
      const date = new Date(now);
      date.setDate(now.getDate() - now.getDay() + i);
      const ds          = date.toDateString();
      const dayWorkouts = list.filter(w => new Date(w.date).toDateString() === ds);
      const volume      = statsApi.getTotalVolume(dayWorkouts);
      return { day, volume, hasWorkout: dayWorkouts.length > 0 };
    });
  },

  getMonthlyFrequency: (workouts) => {
    const months = {};
    (workouts || []).forEach(w => {
      const d   = new Date(w.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months[key] = (months[key] || 0) + 1;
    });
    return months;
  },

  calculateBMI: (weight, height) => {
    if (!weight || !height) return null;
    return parseFloat((weight / ((height / 100) ** 2)).toFixed(1));
  },

  getBMICategory: (bmi) => {
    if (!bmi) return null;
    if (bmi < 18.5) return { label: 'Underweight', color: '#3b82f6' };
    if (bmi < 25)   return { label: 'Normal',      color: '#5DD62C' };
    if (bmi < 30)   return { label: 'Overweight',  color: '#f59e0b' };
    return                 { label: 'Obese',        color: '#ef4444' };
  },
};