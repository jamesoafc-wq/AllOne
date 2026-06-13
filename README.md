:root {
  color-scheme: dark;
  --bg: #0b1220;
  --panel: rgba(255, 255, 255, 0.07);
  --panel-strong: rgba(255, 255, 255, 0.11);
  --panel-soft: rgba(255, 255, 255, 0.045);
  --border: rgba(255, 255, 255, 0.12);
  --text: #f8fafc;
  --muted: #a9b4c5;
  --muted-2: #728096;
  --accent: #8b5cf6;
  --accent-2: #22c55e;
  --danger: #fb7185;
  --warn: #fbbf24;
  --blue: #38bdf8;
  --shadow: 0 20px 80px rgba(0,0,0,0.35);
  --radius: 22px;
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}

* { box-sizing: border-box; }
html { min-height: 100%; background: var(--bg); }
body {
  margin: 0;
  min-height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
  background:
    radial-gradient(circle at top left, rgba(139,92,246,0.25), transparent 35rem),
    radial-gradient(circle at top right, rgba(34,197,94,0.14), transparent 28rem),
    var(--bg);
  color: var(--text);
}
button, input, select, textarea { font: inherit; }
button { cursor: pointer; }
.app-shell {
  width: min(1180px, 100%);
  margin: 0 auto;
  min-height: 100dvh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}
.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: calc(1rem + env(safe-area-inset-top, 0px)) 1rem 0.75rem;
  background: linear-gradient(180deg, rgba(11,18,32,0.97), rgba(11,18,32,0.84), transparent);
  backdrop-filter: blur(20px);
}
.eyebrow {
  margin: 0 0 0.25rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-weight: 700;
  font-size: 0.72rem;
}
h1 {
  font-size: clamp(1.6rem, 5vw, 2.65rem);
  line-height: 1.05;
  margin: 0;
  letter-spacing: -0.045em;
}
h2 { margin: 0 0 0.75rem; letter-spacing: -0.025em; }
h3 { margin: 0 0 0.55rem; }
p { color: var(--muted); }
.screen {
  padding: 0.5rem 1rem calc(6.7rem + var(--safe-bottom));
  width: 100%;
}
.grid { display: grid; gap: 1rem; }
.grid.two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid.three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid.four { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1rem;
  box-shadow: var(--shadow);
}
.card.soft { background: var(--panel-soft); box-shadow: none; }
.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.8rem;
}
.stack { display: grid; gap: 0.75rem; }
.row { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
.row.between { justify-content: space-between; }
.row.end { justify-content: flex-end; }
.muted { color: var(--muted); }
.tiny { font-size: 0.78rem; color: var(--muted); }
.stat {
  min-height: 112px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.stat .value { font-size: clamp(1.7rem, 9vw, 3rem); font-weight: 850; letter-spacing: -0.06em; }
.stat .label { color: var(--muted); font-weight: 700; }
.stat .sub { color: var(--muted-2); font-size: 0.85rem; }
.tick-card {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.9rem;
  min-height: 90px;
}
.tick {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  border: 1px solid var(--border);
  background: var(--panel-soft);
  color: var(--muted);
  font-size: 1.3rem;
  font-weight: 900;
}
.tick.done { background: rgba(34,197,94,0.18); border-color: rgba(34,197,94,0.45); color: #86efac; }
.tick.fail { background: rgba(251,113,133,0.12); border-color: rgba(251,113,133,0.35); color: #fda4af; }
.progress-track {
  height: 12px;
  border-radius: 999px;
  background: var(--panel-soft);
  border: 1px solid var(--border);
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  min-width: 0;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent), var(--blue), var(--accent-2));
  transition: width 220ms ease;
}
button, .button {
  border: 0;
  background: linear-gradient(135deg, var(--accent), #4f46e5);
  color: white;
  border-radius: 14px;
  padding: 0.72rem 0.95rem;
  font-weight: 800;
  box-shadow: 0 12px 30px rgba(79,70,229,0.25);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}
button.secondary { background: rgba(255,255,255,0.08); box-shadow: none; border: 1px solid var(--border); }
button.ghost { background: transparent; box-shadow: none; border: 1px solid var(--border); }
button.danger { background: rgba(251,113,133,0.18); color: #fecdd3; box-shadow: none; border: 1px solid rgba(251,113,133,0.35); }
button.small { padding: 0.52rem 0.68rem; border-radius: 12px; font-size: 0.88rem; }
button.icon { width: 40px; height: 40px; padding: 0; border-radius: 13px; }
button:disabled { opacity: 0.45; cursor: not-allowed; }
.hidden { display: none !important; }
label { display: grid; gap: 0.35rem; color: var(--muted); font-size: 0.86rem; font-weight: 700; }
input, select, textarea {
  width: 100%;
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.06);
  color: var(--text);
  border-radius: 14px;
  padding: 0.75rem 0.85rem;
  outline: 0;
}
input:focus, select:focus, textarea:focus { border-color: rgba(139,92,246,0.65); box-shadow: 0 0 0 4px rgba(139,92,246,0.12); }
select option { background: #111827; color: var(--text); }
textarea { min-height: 84px; resize: vertical; }
.form-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 0.75rem; align-items: end; }
.col-2 { grid-column: span 2; } .col-3 { grid-column: span 3; } .col-4 { grid-column: span 4; } .col-5 { grid-column: span 5; } .col-6 { grid-column: span 6; } .col-7 { grid-column: span 7; } .col-8 { grid-column: span 8; } .col-12 { grid-column: span 12; }
.table-wrap { width: 100%; overflow-x: auto; border-radius: 16px; border: 1px solid var(--border); }
table { width: 100%; border-collapse: collapse; min-width: 560px; }
th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid var(--border); }
th { color: var(--muted); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em; }
tr:last-child td { border-bottom: 0; }
.pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  padding: 0.35rem 0.55rem;
  color: var(--muted);
  background: rgba(255,255,255,0.055);
  font-size: 0.82rem;
  font-weight: 800;
}
.pill.good { color: #bbf7d0; border-color: rgba(34,197,94,0.4); background: rgba(34,197,94,0.11); }
.pill.bad { color: #fecdd3; border-color: rgba(251,113,133,0.35); background: rgba(251,113,133,0.10); }
.pill.warn { color: #fde68a; border-color: rgba(251,191,36,0.35); background: rgba(251,191,36,0.10); }
.list { display: grid; gap: 0.65rem; }
.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem;
  padding: 0.78rem;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: rgba(255,255,255,0.045);
}
.list-main { min-width: 0; }
.list-main strong { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.check-button {
  width: 42px;
  height: 42px;
  padding: 0;
  border-radius: 14px;
  box-shadow: none;
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--border);
  color: var(--muted);
}
.check-button.checked { background: rgba(34,197,94,0.2); color: #86efac; border-color: rgba(34,197,94,0.45); }
.tabbar {
  position: fixed;
  left: 50%;
  bottom: max(0.75rem, var(--safe-bottom));
  transform: translateX(-50%);
  z-index: 20;
  width: min(1120px, calc(100% - 1rem));
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
  padding: 0.35rem;
  background: rgba(17, 24, 39, 0.82);
  border: 1px solid var(--border);
  border-radius: 24px;
  backdrop-filter: blur(22px);
  box-shadow: var(--shadow);
}
.tab {
  display: grid;
  gap: 0.15rem;
  justify-items: center;
  padding: 0.52rem 0.2rem;
  border-radius: 18px;
  background: transparent;
  box-shadow: none;
  color: var(--muted);
  font-size: 0.72rem;
  font-weight: 850;
  border: 0;
}
.tab span { font-size: 0.98rem; }
.tab.active { background: rgba(255,255,255,0.11); color: white; }
.calendar-wrap { overflow-x: auto; padding-bottom: 0.2rem; }
.calendar {
  display: grid;
  grid-template-columns: repeat(7, minmax(112px, 1fr));
  gap: 0.5rem;
  min-width: 760px;
}
.day-head { color: var(--muted); font-weight: 850; text-align: center; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em; }
.day-cell {
  min-height: 112px;
  padding: 0.65rem;
  border-radius: 18px;
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.045);
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}
.day-cell.out { opacity: 0.38; }
.day-cell.today { outline: 2px solid rgba(56,189,248,0.55); }
.day-num { font-weight: 900; }
.day-chips { display: flex; gap: 0.25rem; flex-wrap: wrap; margin-top: auto; }
.mini-chip {
  min-width: 27px;
  height: 27px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  font-size: 0.72rem;
  font-weight: 950;
  border: 1px solid var(--border);
  color: var(--muted);
  background: rgba(255,255,255,0.04);
}
.mini-chip.done { color: #86efac; border-color: rgba(34,197,94,0.45); background: rgba(34,197,94,0.15); }
.mini-chip.fail { color: #fda4af; border-color: rgba(251,113,133,0.35); background: rgba(251,113,133,0.10); }
.week-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 0.75rem;
}
canvas.chart {
  width: 100%;
  height: 280px;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: rgba(255,255,255,0.035);
}
.empty {
  padding: 1.1rem;
  border: 1px dashed var(--border);
  border-radius: 18px;
  color: var(--muted);
  text-align: center;
  background: rgba(255,255,255,0.025);
}
.toast {
  position: fixed;
  left: 50%;
  bottom: calc(5.8rem + var(--safe-bottom));
  transform: translateX(-50%);
  z-index: 999;
  width: min(440px, calc(100% - 2rem));
  background: #111827;
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 0.85rem 1rem;
  box-shadow: var(--shadow);
}
.code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.86rem;
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.05);
  border-radius: 14px;
  padding: 0.75rem;
  overflow-x: auto;
  color: #dbeafe;
}
@media (max-width: 860px) {
  .grid.two, .grid.three, .grid.four { grid-template-columns: 1fr; }
  .form-grid { grid-template-columns: 1fr 1fr; }
  .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-12 { grid-column: span 2; }
  .tabbar { grid-template-columns: repeat(7, 1fr); }
  .tab { font-size: 0.62rem; }
  .tab span { font-size: 0.88rem; }
  .screen { padding-left: 0.75rem; padding-right: 0.75rem; }
}
@media (max-width: 520px) {
  .form-grid { grid-template-columns: 1fr; }
  .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-12 { grid-column: span 1; }
  .row { align-items: stretch; }
  .row > button, .row > .button { flex: 1; }
  .tabbar { width: calc(100% - 0.5rem); border-radius: 21px; gap: 0; }
  .tab { padding: 0.48rem 0.05rem; }
  .topbar { padding-left: 0.75rem; padding-right: 0.75rem; }
}
@media (min-width: 1024px) {
  .screen { padding-top: 1rem; }
}
.day-cell { box-shadow: none; color: var(--text); text-align: left; align-items: stretch; }
