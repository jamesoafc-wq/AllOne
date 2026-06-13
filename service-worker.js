<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#101828" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="AllInOneFit" />
  <meta name="description" content="A private all-in-one gym, habits, calories, protein, goals, calendar and progress tracker." />
  <link rel="manifest" href="site.webmanifest" />
  <link rel="apple-touch-icon" href="assets/icon-192.png" />
  <link rel="icon" type="image/png" sizes="192x192" href="assets/icon-192.png" />
  <link rel="stylesheet" href="styles.css" />
  <title>AllInOneFit</title>
</head>
<body>
  <div id="appShell" class="app-shell">
    <header class="topbar">
      <div>
        <p class="eyebrow">AllInOneFit</p>
        <h1 id="screenTitle">Dashboard</h1>
      </div>
      <button id="installButton" class="ghost install hidden" type="button">Install</button>
    </header>

    <main id="app" class="screen" aria-live="polite"></main>

    <nav class="tabbar" aria-label="Main navigation">
      <button class="tab active" data-view="dashboard" type="button"><span>Gym</span>Today</button>
      <button class="tab" data-view="workout" type="button"><span>Habits</span>Gym</button>
      <button class="tab" data-view="nutrition" type="button"><span>Protein</span>Food</button>
      <button class="tab" data-view="habits" type="button"><span>Done</span>Habits</button>
      <button class="tab" data-view="calendar" type="button"><span>Empty</span>Calendar</button>
      <button class="tab" data-view="progress" type="button"><span>Progress</span>Progress</button>
      <button class="tab" data-view="settings" type="button"><span>Settings</span>Settings</button>
    </nav>
  </div>

  <template id="toastTemplate">
    <div class="toast" role="status"></div>
  </template>

  <script src="app.js" defer></script>
</body>
</html>
