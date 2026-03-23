import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { userApi, workoutApi, nutritionApi, statsApi } from '../api/allFitnessApi';

const WorkoutContext = createContext();

const initialState = {
  user:             null,
  workouts:         [],
  nutrition:        [],
  isSetupComplete:  false,
  loading:          true,   
  error:            null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':   return { ...state, loading: action.payload };
    case 'SET_ERROR':     return { ...state, error: action.payload, loading: false };

    case 'LOAD_USER':
      return { ...state, user: action.payload, isSetupComplete: !!action.payload, loading: false };

    case 'LOAD_WORKOUTS':
      return { ...state, workouts: action.payload };

    case 'LOAD_NUTRITION':
      return { ...state, nutrition: action.payload };

    case 'SET_USER':
      return { ...state, user: action.payload, isSetupComplete: true };

    case 'ADD_WORKOUT':
      return { ...state, workouts: [action.payload, ...state.workouts] };

    case 'DELETE_WORKOUT':
      return { ...state, workouts: state.workouts.filter(w => w.id !== action.payload) };

    case 'ADD_NUTRITION':
      return { ...state, nutrition: [action.payload, ...state.nutrition] };

    case 'DELETE_NUTRITION':
      return { ...state, nutrition: state.nutrition.filter(n => n.id !== action.payload) };

    case 'RESET':
      return { ...initialState, loading: false };

    default:
      return state;
  }
}

export function WorkoutProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ─── Boot: load everything from JSON server ────────────────────────
  useEffect(() => {
    async function boot() {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const [user, workouts, nutrition] = await Promise.all([
          userApi.get(),
          workoutApi.getAll(),
          nutritionApi.getAll(),
        ]);
        dispatch({ type: 'LOAD_USER',      payload: user      });
        dispatch({ type: 'LOAD_WORKOUTS',  payload: workouts  });
        dispatch({ type: 'LOAD_NUTRITION', payload: nutrition });
      } catch (err) {
        console.error('[Context] Boot failed:', err.message);
        dispatch({ type: 'SET_ERROR', payload: 'Could not connect to JSON server. Make sure it\'s running on port 3000.' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
    boot();
  }, []);

  // ─── Actions ──────────────────────────────────────────────────────

  const setupUser = useCallback(async (userData) => {
    const saved = await userApi.create(userData);
    dispatch({ type: 'SET_USER', payload: saved });
    return saved;
  }, []);

  const updateUser = useCallback(async (updates) => {
    const updated = await userApi.update(updates);
    dispatch({ type: 'SET_USER', payload: updated });
    return updated;
  }, []);

  const addWorkout = useCallback(async (workout) => {
    const saved = await workoutApi.add(workout);
    dispatch({ type: 'ADD_WORKOUT', payload: saved });
    return saved;
  }, []);

  const deleteWorkout = useCallback(async (id) => {
    await workoutApi.delete(id);
    dispatch({ type: 'DELETE_WORKOUT', payload: id });
  }, []);

  const addNutrition = useCallback(async (entry) => {
    const saved = await nutritionApi.add(entry);
    dispatch({ type: 'ADD_NUTRITION', payload: saved });
    return saved;
  }, []);

  const deleteNutrition = useCallback(async (id) => {
    await nutritionApi.delete(id);
    dispatch({ type: 'DELETE_NUTRITION', payload: id });
  }, []);

  const resetAll = useCallback(async () => {
    // Delete all records from JSON server
    await Promise.allSettled([
      userApi.delete(),
      ...state.workouts.map(w  => workoutApi.delete(w.id)),
      ...state.nutrition.map(n => nutritionApi.delete(n.id)),
    ]);
    dispatch({ type: 'RESET' });
  }, [state.workouts, state.nutrition]);

  // ─── Computed helpers (pure, from in-memory state) ────────────────

  const getThisWeekWorkouts = useCallback(() => {
    const now   = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);
    return state.workouts.filter(w => new Date(w.date) >= start);
  }, [state.workouts]);

  const getTotalVolume    = useCallback(() => statsApi.getTotalVolume(state.workouts),    [state.workouts]);
  const getStreak         = useCallback(() => statsApi.getStreak(state.workouts),         [state.workouts]);
  const getPersonalRecords= useCallback(() => statsApi.getPersonalRecords(state.workouts),[state.workouts]);
  const getWeeklyVolume   = useCallback(() => statsApi.getWeeklyVolume(state.workouts),   [state.workouts]);
  const getMonthlyFreq    = useCallback(() => statsApi.getMonthlyFrequency(state.workouts),[state.workouts]);

  const getTodayCalories  = useCallback(() => {
    const today = new Date().toDateString();
    return state.nutrition
      .filter(n => new Date(n.date).toDateString() === today)
      .reduce((t, n) => t + (n.calories || 0), 0);
  }, [state.nutrition]);

  const getTodayNutrition = useCallback(() => {
    const today = new Date().toDateString();
    return state.nutrition.filter(n => new Date(n.date).toDateString() === today);
  }, [state.nutrition]);

  const value = {
    // state
    ...state,
    // actions
    setupUser,
    updateUser,
    addWorkout,
    deleteWorkout,
    addNutrition,
    deleteNutrition,
    resetAll,
    // computed
    getThisWeekWorkouts,
    getTotalVolume,
    getStreak,
    getPersonalRecords,
    getWeeklyVolume,
    getMonthlyFreq,
    getTodayCalories,
    getTodayNutrition,
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error('useWorkout must be used inside WorkoutProvider');
  return ctx;
}

export default WorkoutContext;