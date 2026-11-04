# Supply Chain Dashboard

Static web app (HTML/CSS/JS + Chart.js). Open `index.html` in a browser, or serve the folder (e.g. `python3 -m http.server`).

- `index.html` – app shell (sidebar, main view, task panel, add-task dialog)
- `styles.css` – design tokens, layout and responsive rules
- `app.js` – hash router (`#/dashboard`, `#/tenders`, `#/tenders/<id>`, …), pages, charts, task tracker
- `data.js` – **all sample data**. Replace `window.SCM_DATA` with real data, keeping the same field names.

Task changes are saved in `localStorage` (Settings → Reset tasks restores the sample tasks).
