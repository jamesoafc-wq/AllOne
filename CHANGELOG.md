'use strict';

const STORAGE_KEY = 'allInOneFit.state.v1';
const app = document.getElementById('app');
const screenTitle = document.getElementById('screenTitle');
let currentView = 'dashboard';
let activeWorkoutSets = [];
let calendarCursor = startOfMonth(new Date());
let deferredInstallPrompt = null;

const DEFAULT_EXERCISES = [
  ['Bench Press', 'Chest', 'Barbell'], ['Incline Bench Press', 'Chest', 'Barbell'], ['Dumbbell Bench Press', 'Chest', 'Dumbbell'], ['Incline Dumbbell Press', 'Chest', 'Dumbbell'], ['Chest Press Machine', 'Chest', 'Machine'], ['Cable Fly', 'Chest', 'Cable'], ['Pec Deck', 'Chest', 'Machine'], ['Push-Up', 'Chest', 'Bodyweight'], ['Dip', 'Chest', 'Bodyweight'],
  ['Back Squat', 'Legs', 'Barbell'], ['Front Squat', 'Legs', 'Barbell'], ['Leg Press', 'Legs', 'Machine'], ['Hack Squat', 'Legs', 'Machine'], ['Bulgarian Split Squat', 'Legs', 'Dumbbell'], ['Walking Lunge', 'Legs', 'Dumbbell'], ['Leg Extension', 'Legs', 'Machine'], ['Lying Leg Curl', 'Legs', 'Machine'], ['Seated Leg Curl', 'Legs', 'Machine'], ['Romanian Deadlift', 'Legs', 'Barbell'], ['Hip Thrust', 'Glutes', 'Barbell'], ['Calf Raise', 'Calves', 'Machine'],
  ['Deadlift', 'Back', 'Barbell'], ['Rack Pull', 'Back', 'Barbell'], ['Pull-Up', 'Back', 'Bodyweight'], ['Chin-Up', 'Back', 'Bodyweight'], ['Lat Pulldown', 'Back', 'Cable'], ['Seated Cable Row', 'Back', 'Cable'], ['Bent Over Row', 'Back', 'Barbell'], ['Single Arm Dumbbell Row', 'Back', 'Dumbbell'], ['T-Bar Row', 'Back', 'Machine'], ['Chest Supported Row', 'Back', 'Machine'], ['Face Pull', 'Rear Delts', 'Cable'], ['Straight Arm Pulldown', 'Back', 'Cable'],
  ['Overhead Press', 'Shoulders', 'Barbell'], ['Dumbbell Shoulder Press', 'Shoulders', 'Dumbbell'], ['Machine Shoulder Press', 'Shoulders', 'Machine'], ['Lateral Raise', 'Shoulders', 'Dumbbell'], ['Cable Lateral Raise', 'Shoulders', 'Cable'], ['Rear Delt Fly', 'Rear Delts', 'Dumbbell'], ['Reverse Pec Deck', 'Rear Delts', 'Machine'], ['Upright Row', 'Shoulders', 'Barbell'], ['Shrug', 'Traps', 'Dumbbell'],
  ['Barbell Curl', 'Biceps', 'Barbell'], ['Dumbbell Curl', 'Biceps', 'Dumbbell'], ['Hammer Curl', 'Biceps', 'Dumbbell'], ['Preacher Curl', 'Biceps', 'Machine'], ['Cable Curl', 'Biceps', 'Cable'], ['Incline Dumbbell Curl', 'Biceps', 'Dumbbell'],
  ['Close Grip Bench Press', 'Triceps', 'Barbell'], ['Triceps Pushdown', 'Triceps', 'Cable'], ['Overhead Triceps Extension', 'Triceps', 'Cable'], ['Skull Crusher', 'Triceps', 'Barbell'], ['Dumbbell Triceps Extension', 'Triceps', 'Dumbbell'], ['Assisted Dip', 'Triceps', 'Machine'],
  ['Plank', 'Core', 'Bodyweight'], ['Hanging Leg Raise', 'Core', 'Bodyweight'], ['Cable Crunch', 'Core', 'Cable'], ['Ab Wheel', 'Core', 'Bodyweight'], ['Russian Twist', 'Core', 'Bodyweight'], ['Pallof Press', 'Core', 'Cable'],
  ['Treadmill Run', 'Cardio', 'Cardio'], ['Incline Walk', 'Cardio', 'Cardio'], ['Bike', 'Cardio', 'Cardio'], ['Rowing Machine', 'Cardio', 'Cardio'], ['Stairmaster', 'Cardio', 'Cardio'], ['Cross Trainer', 'Cardio', 'Cardio']
].map(([name, muscle, equipment], index) => ({ id: `ex-${index + 1}`, name, muscle, equipment, custom: false }));

function defaultState() {
  const today = dateKey(new Date());
  return {
    version: 1,
    exercises: DEFAULT_EXERCISES,
    workouts: [],
    habits: [
      { id: uid(), name: '10k steps', active: true, createdAt: today },
      { id: uid(), name: 'Drink water', active: true, createdAt: today },
      { id: uid(), name: 'Sleep routine', active: true, createdAt: today }
    ],
    habitChecks: {},
    nutrition: {},
    goals: {
      weeklyWorkoutGoal: 3,
      dailyProteinGoal: 160,
      dailyCalorieGoal: 2200
    },
    preferences: { weightUnit: 'kg' }
  };
}

let state = loadState();

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== 'object') return defaultState();
    const fresh = defaultState();
    return {
      ...fresh,
      ...saved,
      exercises: mergeExercises(saved.exercises || [], fresh.exercises),
      goals: { ...fresh.goals, ...(saved.goals || {}) },
      preferences: { ...fresh.preferences, ...(saved.preferences || {}) }
    };
  } catch (error) {
    console.error(error);
    return defaultState();
  }
}

function mergeExercises(saved, defaults) {
  const byName = new Map();
  [...defaults, ...saved].forEach(ex => {
    if (ex && ex.name) byName.set(ex.name.toLowerCase(), ex);
  });
  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function dateKey(date) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function parseDate(key) {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function humanDate(key) {
  return parseDate(key).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
}

function shortDate(key) {
  return parseDate(key).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

function startOfMonth(date) { return new Date(date.getFullYear(), date.getMonth(), 1); }
function addDays(date, days) { const d = new Date(date); d.setDate(d.getDate() + days); return d; }
function addMonths(date, months) { return new Date(date.getFullYear(), date.getMonth() + months, 1); }
function startOfWeekMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function weekRangeFor(date) {
  const start = startOfWeekMonday(date);
  const end = addDays(start, 6);
  return { start, end, startKey: dateKey(start), endKey: dateKey(end) };
}

function workoutsForDate(key) {
  return state.workouts.filter(workout => workout.date === key);
}

function workoutsForRange(startKey, endKey) {
  return state.workouts.filter(workout => workout.date >= startKey && workout.date <= endKey);
}

function nutritionForDate(key) {
  if (!state.nutrition[key]) state.nutrition[key] = { entries: [] };
  return state.nutrition[key];
}

function nutritionTotals(key) {
  const day = state.nutrition[key] || { entries: [] };
  return day.entries.reduce((total, entry) => ({
    calories: total.calories + Number(entry.calories || 0),
    protein: total.protein + Number(entry.protein || 0)
  }), { calories: 0, protein: 0 });
}

function activeHabits() {
  return state.habits.filter(habit => habit.active !== false);
}

function habitDone(key, habitId) {
  return Boolean(state.habitChecks[key]?.[habitId]);
}

function allHabitsDone(key) {
  const habits = activeHabits();
  return habits.length > 0 && habits.every(habit => habitDone(key, habit.id));
}

function dailyStatus(key) {
  const totals = nutritionTotals(key);
  const gymDone = workoutsForDate(key).length > 0;
  const habitsDone = allHabitsDone(key);
  const proteinDone = totals.protein >= Number(state.goals.dailyProteinGoal || 0);
  return { gymDone, habitsDone, proteinDone, calories: totals.calories, protein: totals.protein };
}

function getExercise(id) {
  return state.exercises.find(ex => ex.id === id) || { id, name: 'Unknown exercise', muscle: '', equipment: '' };
}

function exerciseOptions(selectedId = '') {
  return state.exercises.map(ex => `<option value="${escapeHtml(ex.id)}" ${ex.id === selectedId ? 'selected' : ''}>${escapeHtml(ex.name)} - ${escapeHtml(ex.muscle)}</option>`).join('');
}

function setView(view) {
  currentView = view;
  document.querySelectorAll('.tab').forEach(tab => tab.classList.toggle('active', tab.dataset.view === view));
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function render() {
  const titles = {
    dashboard: 'Dashboard', workout: 'Gym Tracker', nutrition: 'Calories & Protein', habits: 'Habits', calendar: 'Calendar', progress: 'Progress', settings: 'Settings'
  };
  screenTitle.textContent = titles[currentView] || 'AllInOneFit';
  if (currentView === 'dashboard') renderDashboard();
  if (currentView === 'workout') renderWorkout();
  if (currentView === 'nutrition') renderNutrition();
  if (currentView === 'habits') renderHabits();
  if (currentView === 'calendar') renderCalendar();
  if (currentView === 'progress') renderProgress();
  if (currentView === 'settings') renderSettings();
}

function renderDashboard() {
  const today = dateKey(new Date());
  const status = dailyStatus(today);
  const week = weekRangeFor(new Date());
  const weekWorkouts = workoutsForRange(week.startKey, week.endKey).length;
  const goal = Number(state.goals.weeklyWorkoutGoal || 0);
  const percent = goal ? Math.min(100, Math.round((weekWorkouts / goal) * 100)) : 0;
  const habits = activeHabits();
  app.innerHTML = `
    <section class="grid">
      <div class="card">
        <div class="card-header">
          <div>
            <h2>${humanDate(today)}</h2>
            <p class="muted">Your daily three ticks: gym, all habits, and protein target.</p>
          </div>
          <button class="secondary small" data-action="go-calendar" type="button">Month view</button>
        </div>
        <div class="grid three">
          ${tickCard('Gym', status.gymDone, `${workoutsForDate(today).length} workout${workoutsForDate(today).length === 1 ? '' : 's'} today`)}
          ${tickCard('Habits', status.habitsDone, `${habits.filter(h => habitDone(today, h.id)).length}/${habits.length} completed`)}
          ${tickCard('Protein', status.proteinDone, `${Math.round(status.protein)}/${state.goals.dailyProteinGoal}g protein`)}
        </div>
      </div>

      <div class="grid two">
        <div class="card stat">
          <div class="label">This week workouts</div>
          <div class="value">${weekWorkouts}/${goal}</div>
          <div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div>
          <div class="sub">Monday ${shortDate(week.startKey)} -> Sunday ${shortDate(week.endKey)}</div>
        </div>
        <div class="card stat">
          <div class="label">Calories today</div>
          <div class="value">${Math.round(status.calories)}</div>
          <div class="progress-track"><div class="progress-fill" style="width:${Math.min(100, Math.round((status.calories / Math.max(1, state.goals.dailyCalorieGoal)) * 100))}%"></div></div>
          <div class="sub">Target ${state.goals.dailyCalorieGoal} kcal - Protein ${Math.round(status.protein)}g</div>
        </div>
      </div>

      <div class="grid two">
        <div class="card">
          <div class="card-header"><h2>Today's habits</h2><button class="secondary small" data-action="go-habits" type="button">Edit</button></div>
          <div class="list">
            ${habits.length ? habits.map(h => habitRow(h, today)).join('') : '<div class="empty">Add habits to start tracking your daily tick.</div>'}
          </div>
        </div>
        <div class="card">
          <div class="card-header"><h2>Quick actions</h2></div>
          <div class="grid two">
            <button data-action="go-workout" type="button">Log gym</button>
            <button data-action="go-nutrition" type="button">Log food</button>
            <button class="secondary" data-action="go-progress" type="button">View progress</button>
            <button class="secondary" data-action="go-settings" type="button">Goals</button>
          </div>
        </div>
      </div>
    </section>`;
}

function tickCard(title, done, subtitle) {
  return `<div class="card soft tick-card">
    <div class="tick ${done ? 'done' : 'fail'}">${done ? 'Done' : 'x'}</div>
    <div><strong>${title}</strong><div class="tiny">${escapeHtml(subtitle)}</div></div>
  </div>`;
}

function habitRow(habit, key) {
  const checked = habitDone(key, habit.id);
  return `<div class="list-item">
    <div class="list-main"><strong>${escapeHtml(habit.name)}</strong><span class="tiny">${checked ? 'Done' : 'Not done'} on ${humanDate(key)}</span></div>
    <button class="check-button ${checked ? 'checked' : ''}" data-action="toggle-habit" data-date="${key}" data-id="${habit.id}" type="button">Done</button>
  </div>`;
}

function renderWorkout() {
  const today = dateKey(new Date());
  if (!document.getElementById('workoutDate')) activeWorkoutSets = activeWorkoutSets || [];
  const selectedExercise = activeWorkoutSets[0]?.exerciseId || state.exercises[0]?.id || '';
  app.innerHTML = `
    <section class="grid">
      <div class="card">
        <div class="card-header">
          <div>
            <h2>Log a workout</h2>
            <p class="muted">Add sets like Strong: exercise, weight, reps, previous set reference, then save the session.</p>
          </div>
        </div>
        <div class="form-grid">
          <label class="col-3">Date<input id="workoutDate" type="date" value="${today}"></label>
          <label class="col-5">Exercise<select id="exerciseSelect">${exerciseOptions(selectedExercise)}</select></label>
          <label class="col-2">Weight<input id="setWeight" type="number" step="0.5" min="0" inputmode="decimal" placeholder="kg"></label>
          <label class="col-2">Reps<input id="setReps" type="number" step="1" min="0" inputmode="numeric" placeholder="reps"></label>
          <div class="col-12 row">
            <button data-action="add-set" type="button">Add set</button>
            <button class="secondary" data-action="prefill-previous" type="button">Use previous</button>
            <button class="ghost" data-action="clear-active-workout" type="button">Clear</button>
          </div>
        </div>
      </div>

      <div class="grid two">
        <div class="card">
          <div class="card-header"><h2>Previous sets</h2><span class="pill">Last time</span></div>
          <div id="previousSets">${renderPreviousSets(selectedExercise)}</div>
        </div>
        <div class="card">
          <div class="card-header"><h2>Current workout</h2><span class="pill ${activeWorkoutSets.length ? 'good' : ''}">${activeWorkoutSets.length} sets</span></div>
          ${renderActiveWorkoutTable()}
          <label style="margin-top:0.75rem;">Notes<textarea id="workoutNotes" placeholder="Optional notes"></textarea></label>
          <div class="row end" style="margin-top:0.75rem;"><button data-action="save-workout" type="button" ${activeWorkoutSets.length ? '' : 'disabled'}>Save workout</button></div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h2>Recent workouts</h2></div>
        ${renderRecentWorkouts()}
      </div>
    </section>`;
  const exSelect = document.getElementById('exerciseSelect');
  exSelect.addEventListener('change', () => {
    document.getElementById('previousSets').innerHTML = renderPreviousSets(exSelect.value);
  });
}

function renderPreviousSets(exerciseId) {
  const rows = [];
  const sorted = [...state.workouts].sort((a, b) => b.date.localeCompare(a.date) || (b.createdAt || '').localeCompare(a.createdAt || ''));
  for (const workout of sorted) {
    const matches = workout.sets.filter(set => set.exerciseId === exerciseId);
    if (matches.length) {
      matches.forEach((set, index) => rows.push(`<tr><td>${index + 1}</td><td>${escapeHtml(set.weight)} ${state.preferences.weightUnit}</td><td>${escapeHtml(set.reps)}</td><td>${shortDate(workout.date)}</td></tr>`));
      break;
    }
  }
  if (!rows.length) return '<div class="empty">No previous sets for this exercise yet.</div>';
  return `<div class="table-wrap"><table><thead><tr><th>Set</th><th>Weight</th><th>Reps</th><th>Date</th></tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
}

function getPreviousTopSet(exerciseId) {
  const sorted = [...state.workouts].sort((a, b) => b.date.localeCompare(a.date) || (b.createdAt || '').localeCompare(a.createdAt || ''));
  for (const workout of sorted) {
    const matches = workout.sets.filter(set => set.exerciseId === exerciseId);
    if (matches.length) return matches.sort((a, b) => (Number(b.weight) * Number(b.reps)) - (Number(a.weight) * Number(a.reps)))[0];
  }
  return null;
}

function renderActiveWorkoutTable() {
  if (!activeWorkoutSets.length) return '<div class="empty">Add your first set above.</div>';
  return `<div class="table-wrap"><table><thead><tr><th>#</th><th>Exercise</th><th>Weight</th><th>Reps</th><th></th></tr></thead><tbody>${activeWorkoutSets.map((set, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${escapeHtml(getExercise(set.exerciseId).name)}</td>
      <td><input data-action="edit-active-set" data-index="${index}" data-field="weight" type="number" step="0.5" value="${escapeHtml(set.weight)}"></td>
      <td><input data-action="edit-active-set" data-index="${index}" data-field="reps" type="number" step="1" value="${escapeHtml(set.reps)}"></td>
      <td><button class="danger small" data-action="remove-active-set" data-index="${index}" type="button">Remove</button></td>
    </tr>`).join('')}</tbody></table></div>`;
}

function renderRecentWorkouts(limit = 5) {
  const workouts = [...state.workouts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
  if (!workouts.length) return '<div class="empty">No workouts saved yet.</div>';
  return `<div class="list">${workouts.map(workout => {
    const grouped = groupSetsByExercise(workout.sets);
    return `<div class="list-item">
      <div class="list-main"><strong>${humanDate(workout.date)} - ${workout.sets.length} sets</strong><span class="tiny">${grouped.map(g => `${g.name} ${g.sets.length}x`).join(' - ')}</span></div>
      <button class="danger small" data-action="delete-workout" data-id="${workout.id}" type="button">Delete</button>
    </div>`;
  }).join('')}</div>`;
}

function groupSetsByExercise(sets) {
  const map = new Map();
  sets.forEach(set => {
    const ex = getExercise(set.exerciseId);
    if (!map.has(set.exerciseId)) map.set(set.exerciseId, { name: ex.name, sets: [] });
    map.get(set.exerciseId).sets.push(set);
  });
  return [...map.values()];
}

function renderNutrition() {
  const selectedDate = document.getElementById('nutritionDate')?.value || dateKey(new Date());
  const day = nutritionForDate(selectedDate);
  const totals = nutritionTotals(selectedDate);
  const proteinPct = Math.min(100, Math.round((totals.protein / Math.max(1, state.goals.dailyProteinGoal)) * 100));
  const calPct = Math.min(100, Math.round((totals.calories / Math.max(1, state.goals.dailyCalorieGoal)) * 100));
  app.innerHTML = `
    <section class="grid">
      <div class="card">
        <div class="card-header"><div><h2>Calories & protein</h2><p class="muted">Log foods or quick totals. The calendar protein tick turns green when you hit your protein goal.</p></div></div>
        <div class="form-grid">
          <label class="col-3">Date<input id="nutritionDate" type="date" value="${selectedDate}"></label>
          <label class="col-4">Food / meal<input id="foodName" type="text" placeholder="Chicken rice bowl"></label>
          <label class="col-2">Calories<input id="foodCalories" type="number" min="0" inputmode="numeric" placeholder="650"></label>
          <label class="col-2">Protein g<input id="foodProtein" type="number" min="0" step="0.1" inputmode="decimal" placeholder="45"></label>
          <div class="col-1"><button class="icon" data-action="add-food" type="button">+</button></div>
        </div>
      </div>

      <div class="grid two">
        <div class="card stat"><div class="label">Protein</div><div class="value">${Math.round(totals.protein)}g</div><div class="progress-track"><div class="progress-fill" style="width:${proteinPct}%"></div></div><div class="sub">Goal ${state.goals.dailyProteinGoal}g - ${proteinPct}%</div></div>
        <div class="card stat"><div class="label">Calories</div><div class="value">${Math.round(totals.calories)}</div><div class="progress-track"><div class="progress-fill" style="width:${calPct}%"></div></div><div class="sub">Target ${state.goals.dailyCalorieGoal} kcal - ${calPct}%</div></div>
      </div>

      <div class="card">
        <div class="card-header"><h2>Entries for ${humanDate(selectedDate)}</h2></div>
        ${day.entries.length ? `<div class="table-wrap"><table><thead><tr><th>Food</th><th>Calories</th><th>Protein</th><th></th></tr></thead><tbody>${day.entries.map(entry => `
          <tr><td>${escapeHtml(entry.name)}</td><td>${Math.round(entry.calories)}</td><td>${Math.round(entry.protein)}g</td><td><button class="danger small" data-action="delete-food" data-date="${selectedDate}" data-id="${entry.id}" type="button">Delete</button></td></tr>`).join('')}</tbody></table></div>` : '<div class="empty">No food logged for this date.</div>'}
      </div>
    </section>`;
  document.getElementById('nutritionDate').addEventListener('change', renderNutrition);
}

function renderHabits() {
  const selectedDate = document.getElementById('habitDate')?.value || dateKey(new Date());
  const habits = state.habits;
  app.innerHTML = `
    <section class="grid">
      <div class="card">
        <div class="card-header"><div><h2>Habit tracker</h2><p class="muted">The habit tick is green only when every active habit is checked for the day.</p></div><span class="pill ${allHabitsDone(selectedDate) ? 'good' : 'warn'}">${allHabitsDone(selectedDate) ? 'All done' : 'Not complete'}</span></div>
        <div class="form-grid">
          <label class="col-3">Date<input id="habitDate" type="date" value="${selectedDate}"></label>
          <label class="col-7">New habit<input id="newHabitName" type="text" placeholder="Mobility, steps, water, reading..."></label>
          <div class="col-2"><button data-action="add-habit" type="button">Add</button></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h2>Habits for ${humanDate(selectedDate)}</h2></div>
        <div class="list">
          ${habits.length ? habits.map(habit => `<div class="list-item ${habit.active === false ? 'muted' : ''}">
            <div class="list-main"><strong>${escapeHtml(habit.name)}</strong><span class="tiny">${habit.active === false ? 'Paused' : habitDone(selectedDate, habit.id) ? 'Done today' : 'Not done today'}</span></div>
            <div class="row">
              <button class="check-button ${habitDone(selectedDate, habit.id) ? 'checked' : ''}" data-action="toggle-habit" data-date="${selectedDate}" data-id="${habit.id}" type="button" ${habit.active === false ? 'disabled' : ''}>Done</button>
              <button class="secondary small" data-action="toggle-habit-active" data-id="${habit.id}" type="button">${habit.active === false ? 'Resume' : 'Pause'}</button>
              <button class="danger small" data-action="delete-habit" data-id="${habit.id}" type="button">Delete</button>
            </div>
          </div>`).join('') : '<div class="empty">Add your first habit.</div>'}
        </div>
      </div>
    </section>`;
  document.getElementById('habitDate').addEventListener('change', renderHabits);
}

function renderCalendar() {
  const monthStart = startOfMonth(calendarCursor);
  const gridStart = startOfWeekMonday(monthStart);
  const monthLabel = monthStart.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const days = Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
  const weeks = [];
  for (let i = 0; i < 6; i++) {
    const start = addDays(gridStart, i * 7);
    const end = addDays(start, 6);
    const range = { startKey: dateKey(start), endKey: dateKey(end) };
    const count = workoutsForRange(range.startKey, range.endKey).length;
    weeks.push({ start, end, count, passed: count >= Number(state.goals.weeklyWorkoutGoal || 0) });
  }
  app.innerHTML = `
    <section class="grid">
      <div class="card">
        <div class="card-header">
          <div><h2>${monthLabel}</h2><p class="muted">Each day shows G = gym, H = all habits, P = protein goal. Weeks run Monday to Sunday.</p></div>
          <div class="row"><button class="secondary small" data-action="prev-month" type="button"><-</button><button class="secondary small" data-action="today-month" type="button">Today</button><button class="secondary small" data-action="next-month" type="button">-></button></div>
        </div>
        <div class="calendar-wrap">
          <div class="calendar">
            ${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => `<div class="day-head">${day}</div>`).join('')}
            ${days.map(day => renderDayCell(day, monthStart)).join('')}
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h2>Weekly workout goal</h2><span class="pill">Goal: ${state.goals.weeklyWorkoutGoal}/week</span></div>
        <div class="week-summary">
          ${weeks.map(week => `<div class="card soft">
            <div class="row between"><strong>${shortDate(dateKey(week.start))} - ${shortDate(dateKey(week.end))}</strong><span class="pill ${week.passed ? 'good' : 'bad'}">${week.count}/${state.goals.weeklyWorkoutGoal}</span></div>
            <div class="tiny">${week.passed ? 'Passed workout goal' : 'Below weekly workout goal'}</div>
          </div>`).join('')}
        </div>
      </div>
    </section>`;
}

function renderDayCell(day, monthStart) {
  const key = dateKey(day);
  const status = dailyStatus(key);
  const out = day.getMonth() !== monthStart.getMonth();
  const today = key === dateKey(new Date());
  return `<button class="day-cell ${out ? 'out' : ''} ${today ? 'today' : ''}" data-action="select-calendar-day" data-date="${key}" type="button">
    <div class="row between"><span class="day-num">${day.getDate()}</span><span class="tiny">${workoutsForDate(key).length ? `${workoutsForDate(key).length} gym` : ''}</span></div>
    <div class="tiny">${Math.round(status.protein)}g P - ${Math.round(status.calories)} kcal</div>
    <div class="day-chips">
      <span class="mini-chip ${status.gymDone ? 'done' : 'fail'}">G</span>
      <span class="mini-chip ${status.habitsDone ? 'done' : 'fail'}">H</span>
      <span class="mini-chip ${status.proteinDone ? 'done' : 'fail'}">P</span>
    </div>
  </button>`;
}

function renderProgress() {
  const selectedExercise = document.getElementById('progressExercise')?.value || state.exercises[0]?.id || '';
  const history = exerciseHistory(selectedExercise);
  app.innerHTML = `
    <section class="grid">
      <div class="card">
        <div class="card-header"><div><h2>Exercise progress</h2><p class="muted">See your best weight, estimated 1RM and total volume over time for each exercise.</p></div></div>
        <label>Exercise<select id="progressExercise">${exerciseOptions(selectedExercise)}</select></label>
      </div>
      <div class="grid three">
        ${progressStat('Sessions', history.length)}
        ${progressStat(`Best weight (${state.preferences.weightUnit})`, history.length ? Math.max(...history.map(h => h.bestWeight)) : 0)}
        ${progressStat('Best est. 1RM', history.length ? Math.round(Math.max(...history.map(h => h.estimatedOneRepMax))) : 0)}
      </div>
      <div class="card">
        <div class="card-header"><h2>Best weight chart</h2><span class="pill">${escapeHtml(getExercise(selectedExercise).name)}</span></div>
        ${history.length > 1 ? '<canvas id="progressChart" class="chart" width="900" height="320"></canvas>' : '<div class="empty">Log this exercise at least twice to draw a chart.</div>'}
      </div>
      <div class="card">
        <div class="card-header"><h2>History</h2></div>
        ${history.length ? `<div class="table-wrap"><table><thead><tr><th>Date</th><th>Sets</th><th>Best weight</th><th>Best reps</th><th>Volume</th><th>Est. 1RM</th></tr></thead><tbody>${history.map(h => `<tr><td>${humanDate(h.date)}</td><td>${h.setCount}</td><td>${h.bestWeight} ${state.preferences.weightUnit}</td><td>${h.bestReps}</td><td>${Math.round(h.volume)}</td><td>${Math.round(h.estimatedOneRepMax)}</td></tr>`).join('')}</tbody></table></div>` : '<div class="empty">No history for this exercise yet.</div>'}
      </div>
    </section>`;
  document.getElementById('progressExercise').addEventListener('change', renderProgress);
  if (history.length > 1) setTimeout(() => drawChart(history), 0);
}

function progressStat(label, value) {
  return `<div class="card stat"><div class="label">${escapeHtml(label)}</div><div class="value">${escapeHtml(value)}</div><div class="sub">Based on saved workouts</div></div>`;
}

function exerciseHistory(exerciseId) {
  return state.workouts
    .filter(workout => workout.sets.some(set => set.exerciseId === exerciseId))
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(workout => {
      const sets = workout.sets.filter(set => set.exerciseId === exerciseId);
      const bestByWeight = [...sets].sort((a, b) => Number(b.weight) - Number(a.weight) || Number(b.reps) - Number(a.reps))[0];
      const volume = sets.reduce((sum, set) => sum + (Number(set.weight) * Number(set.reps)), 0);
      const estimatedOneRepMax = Math.max(...sets.map(set => Number(set.weight) * (1 + Number(set.reps) / 30)));
      return { date: workout.date, setCount: sets.length, bestWeight: Number(bestByWeight.weight), bestReps: Number(bestByWeight.reps), volume, estimatedOneRepMax };
    });
}

function drawChart(history) {
  const canvas = document.getElementById('progressChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  const pad = 44;
  const values = history.map(h => h.bestWeight);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  const span = Math.max(1, max - min);
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(255,255,255,0.16)';
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = '14px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
  for (let i = 0; i <= 4; i++) {
    const y = pad + ((height - pad * 2) * i / 4);
    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(width - pad, y); ctx.stroke();
    const label = Math.round(max - (span * i / 4));
    ctx.fillText(String(label), 8, y + 4);
  }
  const points = history.map((h, index) => {
    const x = pad + (history.length === 1 ? 0 : ((width - pad * 2) * index / (history.length - 1)));
    const y = height - pad - ((h.bestWeight - min) / span) * (height - pad * 2);
    return { x, y, h };
  });
  const gradient = ctx.createLinearGradient(pad, 0, width - pad, 0);
  gradient.addColorStop(0, '#8b5cf6'); gradient.addColorStop(0.5, '#38bdf8'); gradient.addColorStop(1, '#22c55e');
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 4;
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.beginPath();
  points.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
  ctx.stroke();
  points.forEach(point => {
    ctx.beginPath(); ctx.arc(point.x, point.y, 5, 0, Math.PI * 2); ctx.fillStyle = '#f8fafc'; ctx.fill();
  });
  ctx.fillStyle = 'rgba(255,255,255,0.62)';
  ctx.fillText(humanDate(history[0].date), pad, height - 12);
  ctx.textAlign = 'right';
  ctx.fillText(humanDate(history[history.length - 1].date), width - pad, height - 12);
  ctx.textAlign = 'left';
}

function renderSettings() {
  app.innerHTML = `
    <section class="grid">
      <div class="card">
        <div class="card-header"><div><h2>Goals</h2><p class="muted">Change the targets used by the dashboard and calendar ticks.</p></div></div>
        <div class="form-grid">
          <label class="col-4">Weekly workouts goal<input id="weeklyWorkoutGoal" type="number" min="0" step="1" value="${state.goals.weeklyWorkoutGoal}"></label>
          <label class="col-4">Daily protein goal g<input id="dailyProteinGoal" type="number" min="0" step="1" value="${state.goals.dailyProteinGoal}"></label>
          <label class="col-4">Daily calorie target<input id="dailyCalorieGoal" type="number" min="0" step="50" value="${state.goals.dailyCalorieGoal}"></label>
          <label class="col-4">Weight unit<select id="weightUnit"><option value="kg" ${state.preferences.weightUnit === 'kg' ? 'selected' : ''}>kg</option><option value="lb" ${state.preferences.weightUnit === 'lb' ? 'selected' : ''}>lb</option></select></label>
          <div class="col-8 row"><button data-action="save-goals" type="button">Save goals</button></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div><h2>Exercise library</h2><p class="muted">Add custom exercises; they appear in the gym tracker and progress charts.</p></div><span class="pill">${state.exercises.length} exercises</span></div>
        <div class="form-grid">
          <label class="col-5">Exercise name<input id="newExerciseName" type="text" placeholder="Smith Machine Squat"></label>
          <label class="col-3">Muscle<input id="newExerciseMuscle" type="text" placeholder="Legs"></label>
          <label class="col-3">Equipment<input id="newExerciseEquipment" type="text" placeholder="Machine"></label>
          <div class="col-1"><button class="icon" data-action="add-exercise" type="button">+</button></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div><h2>Backup</h2><p class="muted">Your data is private and stored on this device/browser. Export a backup before clearing Safari data or switching phones.</p></div></div>
        <div class="row">
          <button data-action="export-data" type="button">Export JSON</button>
          <label class="button secondary" for="importFile">Import JSON</label>
          <input id="importFile" type="file" accept="application/json" class="hidden">
          <button class="danger" data-action="reset-data" type="button">Reset all data</button>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div><h2>Install on iPhone</h2><p class="muted">After this is hosted on GitHub Pages, open the site in Safari and add it to your Home Screen.</p></div></div>
        <div class="code">Safari -> Share icon -> Add to Home Screen -> Add</div>
      </div>
    </section>`;
  document.getElementById('importFile').addEventListener('change', importData);
}

function addSet() {
  const exerciseId = document.getElementById('exerciseSelect')?.value;
  const weightInput = document.getElementById('setWeight');
  const repsInput = document.getElementById('setReps');
  const weight = Number(weightInput?.value || 0);
  const reps = Number(repsInput?.value || 0);
  if (!exerciseId) return toast('Choose an exercise first.');
  if (weight <= 0 && reps <= 0) return toast('Enter weight or reps for the set.');
  activeWorkoutSets.push({ id: uid(), exerciseId, weight, reps });
  weightInput.value = '';
  repsInput.value = '';
  renderWorkout();
}

function saveWorkout() {
  const date = document.getElementById('workoutDate')?.value || dateKey(new Date());
  const notes = document.getElementById('workoutNotes')?.value || '';
  if (!activeWorkoutSets.length) return toast('Add at least one set.');
  state.workouts.push({ id: uid(), date, notes, sets: activeWorkoutSets.map(set => ({ ...set })), createdAt: new Date().toISOString() });
  state.workouts.sort((a, b) => a.date.localeCompare(b.date));
  activeWorkoutSets = [];
  saveState();
  toast('Workout saved.');
  renderWorkout();
}

function addFood() {
  const date = document.getElementById('nutritionDate')?.value || dateKey(new Date());
  const name = document.getElementById('foodName')?.value.trim() || 'Food entry';
  const calories = Number(document.getElementById('foodCalories')?.value || 0);
  const protein = Number(document.getElementById('foodProtein')?.value || 0);
  if (calories <= 0 && protein <= 0) return toast('Enter calories or protein.');
  nutritionForDate(date).entries.push({ id: uid(), name, calories, protein });
  saveState();
  toast('Food logged.');
  renderNutrition();
}

function addHabit() {
  const input = document.getElementById('newHabitName');
  const name = input?.value.trim();
  if (!name) return toast('Enter a habit name.');
  state.habits.push({ id: uid(), name, active: true, createdAt: dateKey(new Date()) });
  saveState();
  toast('Habit added.');
  renderHabits();
}

function addExercise() {
  const name = document.getElementById('newExerciseName')?.value.trim();
  const muscle = document.getElementById('newExerciseMuscle')?.value.trim() || 'Custom';
  const equipment = document.getElementById('newExerciseEquipment')?.value.trim() || 'Other';
  if (!name) return toast('Enter an exercise name.');
  if (state.exercises.some(ex => ex.name.toLowerCase() === name.toLowerCase())) return toast('That exercise already exists.');
  state.exercises.push({ id: uid(), name, muscle, equipment, custom: true });
  state.exercises.sort((a, b) => a.name.localeCompare(b.name));
  saveState();
  toast('Exercise added.');
  renderSettings();
}

function toggleHabit(date, id) {
  if (!state.habitChecks[date]) state.habitChecks[date] = {};
  state.habitChecks[date][id] = !state.habitChecks[date][id];
  saveState();
  render();
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `allinonefit-backup-${dateKey(new Date())}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!imported || !Array.isArray(imported.exercises) || !Array.isArray(imported.workouts)) throw new Error('Invalid backup');
      state = { ...defaultState(), ...imported };
      saveState();
      toast('Backup imported.');
      renderSettings();
    } catch (error) {
      toast('Could not import that JSON file.');
    }
  };
  reader.readAsText(file);
}

function toast(message) {
  const template = document.getElementById('toastTemplate');
  const node = template.content.firstElementChild.cloneNode(true);
  node.textContent = message;
  document.body.appendChild(node);
  setTimeout(() => node.remove(), 2600);
}

app.addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  if (action === 'go-calendar') setView('calendar');
  if (action === 'go-habits') setView('habits');
  if (action === 'go-workout') setView('workout');
  if (action === 'go-nutrition') setView('nutrition');
  if (action === 'go-progress') setView('progress');
  if (action === 'go-settings') setView('settings');
  if (action === 'toggle-habit') toggleHabit(button.dataset.date, button.dataset.id);
  if (action === 'add-set') addSet();
  if (action === 'prefill-previous') {
    const exerciseId = document.getElementById('exerciseSelect')?.value;
    const previous = getPreviousTopSet(exerciseId);
    if (!previous) return toast('No previous set for this exercise yet.');
    document.getElementById('setWeight').value = previous.weight;
    document.getElementById('setReps').value = previous.reps;
    toast('Previous set filled.');
  }
  if (action === 'clear-active-workout') { activeWorkoutSets = []; renderWorkout(); }
  if (action === 'remove-active-set') { activeWorkoutSets.splice(Number(button.dataset.index), 1); renderWorkout(); }
  if (action === 'save-workout') saveWorkout();
  if (action === 'delete-workout') {
    if (!confirm('Delete this workout?')) return;
    state.workouts = state.workouts.filter(workout => workout.id !== button.dataset.id);
    saveState(); renderWorkout();
  }
  if (action === 'add-food') addFood();
  if (action === 'delete-food') {
    const day = nutritionForDate(button.dataset.date);
    day.entries = day.entries.filter(entry => entry.id !== button.dataset.id);
    saveState(); renderNutrition();
  }
  if (action === 'add-habit') addHabit();
  if (action === 'toggle-habit-active') {
    const habit = state.habits.find(h => h.id === button.dataset.id);
    if (habit) habit.active = habit.active === false;
    saveState(); renderHabits();
  }
  if (action === 'delete-habit') {
    if (!confirm('Delete this habit? Previous tick history for it will no longer be shown.')) return;
    state.habits = state.habits.filter(h => h.id !== button.dataset.id);
    saveState(); renderHabits();
  }
  if (action === 'prev-month') { calendarCursor = addMonths(calendarCursor, -1); renderCalendar(); }
  if (action === 'next-month') { calendarCursor = addMonths(calendarCursor, 1); renderCalendar(); }
  if (action === 'today-month') { calendarCursor = startOfMonth(new Date()); renderCalendar(); }
  if (action === 'select-calendar-day') {
    const key = button.dataset.date;
    toast(`${humanDate(key)} - Gym ${dailyStatus(key).gymDone ? 'Done' : 'x'} - Habits ${dailyStatus(key).habitsDone ? 'Done' : 'x'} - Protein ${dailyStatus(key).proteinDone ? 'Done' : 'x'}`);
  }
  if (action === 'save-goals') {
    state.goals.weeklyWorkoutGoal = Number(document.getElementById('weeklyWorkoutGoal').value || 0);
    state.goals.dailyProteinGoal = Number(document.getElementById('dailyProteinGoal').value || 0);
    state.goals.dailyCalorieGoal = Number(document.getElementById('dailyCalorieGoal').value || 0);
    state.preferences.weightUnit = document.getElementById('weightUnit').value;
    saveState(); toast('Goals saved.'); renderSettings();
  }
  if (action === 'add-exercise') addExercise();
  if (action === 'export-data') exportData();
  if (action === 'reset-data') {
    if (!confirm('Reset all AllInOneFit data on this browser?')) return;
    state = defaultState(); activeWorkoutSets = []; saveState(); toast('Data reset.'); renderSettings();
  }
});

app.addEventListener('input', event => {
  const input = event.target.closest('[data-action="edit-active-set"]');
  if (!input) return;
  const index = Number(input.dataset.index);
  const field = input.dataset.field;
  if (activeWorkoutSets[index]) activeWorkoutSets[index][field] = Number(input.value || 0);
});

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => setView(tab.dataset.view));
});

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  document.getElementById('installButton').classList.remove('hidden');
});

document.getElementById('installButton').addEventListener('click', async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  document.getElementById('installButton').classList.add('hidden');
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(error => console.warn('Service worker registration failed', error));
  });
}

render();
