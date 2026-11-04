/* app.js — router, pages, charts and task tracker. Data comes from data.js. */
(function () {
  "use strict";

  const DATA = window.SCM_DATA;
  const TASKS_KEY = "scm.tasks.v1";
  const PIC_FILTER_KEY = "scm.picFilter";
  const COLLAPSE_KEY = "scm.sidebarCollapsed";

  const STATUS = {
    "Initiated":   { cls: "initiated", color: "#2563eb" },
    "In Progress": { cls: "progress",  color: "#d97706" },
    "Completed":   { cls: "completed", color: "#16a34a" }
  };

  /* ---------- Icons (inline SVG, stroke style) ---------- */
  const P = {
    dashboard: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
    tenders: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    suppliers: '<path d="M3 21V8l6-4 6 4v13"/><path d="M15 12h6v9H3M7 12h4M7 16h4"/>',
    inventory: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
    orders: '<path d="M6 2h12v20l-3-2-3 2-3-2-3 2z"/><path d="M9 7h6M9 11h6M9 15h3"/>',
    logistics: '<path d="M1 6h13v10H1zM14 10h4l3 3v3h-7"/><circle cx="5.5" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/>',
    reports: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    chevron: '<path d="m15 18-6-6 6-6"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    play: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    list: '<path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>'
  };
  const icon = (name) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name]}</svg>`;

  /* ---------- Helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const parseDate = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const fmtDate = (s) => s ? parseDate(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  const fmtShort = (s) => parseDate(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  const fmtMoney = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
  const daysUntil = (s) => Math.round((parseDate(s) - today()) / 86400000);
  const personById = (id) => DATA.people.find((p) => p.id === id) || { name: "Unassigned", role: "", color: "#94a3b8" };
  const tenderById = (id) => DATA.tenders.find((t) => t.id === id);
  const initials = (name) => name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const isOverdue = (t) => t.status !== "Completed" && parseDate(t.deadline) < today();

  const avatar = (p, lg) => `<span class="avatar${lg ? " avatar--lg" : ""}" style="background:${p.color}" title="${esc(p.name)}">${initials(p.name)}</span>`;
  const personChip = (id) => { const p = personById(id); return `<span class="person">${avatar(p)}<span>${esc(p.name)}</span></span>`; };
  const statusBadge = (s) => `<span class="badge badge--${(STATUS[s] || {}).cls || "neutral"}">${esc(s)}</span>`;
  const progressBar = (t) => `<div class="progress"><div class="progress__bar"><div class="progress__fill" style="width:${t.progress}%;background:${STATUS[t.status].color}"></div></div><span class="progress__val">${t.progress}%</span></div>`;
  const deadlineCell = (t) => isOverdue(t)
    ? `<span class="is-overdue-date">${fmtDate(t.deadline)}</span> <span class="badge badge--overdue">Overdue</span>`
    : fmtDate(t.deadline);

  /* ---------- Charts ---------- */
  let charts = [];
  const destroyCharts = () => { charts.forEach((c) => c.destroy()); charts = []; };
  if (window.Chart) {
    Chart.defaults.font.family = "Inter, system-ui, sans-serif";
    Chart.defaults.color = "#64748b";
    Chart.defaults.plugins.tooltip.backgroundColor = "#0f172a";
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
  }
  function makeChart(id, config) {
    const el = document.getElementById(id);
    if (!el || !window.Chart) return;
    charts.push(new Chart(el, config));
  }
  const gridOpts = { color: "#eef1f5", drawTicks: false };
  const axisBase = { border: { display: false }, ticks: { padding: 8 } };

  // Month buckets from earliest created date to the latest month in data (max 12).
  function monthBuckets() {
    const dates = DATA.tenders.flatMap((t) => [t.created, t.completed].filter(Boolean)).map(parseDate);
    const max = new Date(Math.max(...dates));
    let start = new Date(Math.min(...dates));
    start = new Date(start.getFullYear(), start.getMonth(), 1);
    const months = [];
    for (let d = new Date(start); d <= max; d.setMonth(d.getMonth() + 1)) months.push(new Date(d));
    return months.slice(-12);
  }
  const monthKey = (d) => `${d.getFullYear()}-${d.getMonth()}`;
  const monthLabel = (d) => d.toLocaleDateString("en-GB", { month: "short" });

  /* ---------- Tasks (localStorage) ---------- */
  function loadTasks() {
    try {
      const raw = localStorage.getItem(TASKS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* storage unavailable */ }
    return DATA.tasks.map((t) => ({ ...t }));
  }
  let tasks = loadTasks();
  function saveTasks() {
    try { localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)); } catch (e) { /* ignore */ }
  }
  let picFilter = (() => { try { return localStorage.getItem(PIC_FILTER_KEY) || "all"; } catch (e) { return "all"; } })();

  function renderTasks() {
    const list = $("#taskList");
    const visible = tasks
      .filter((t) => picFilter === "all" || t.picId === picFilter)
      .sort((a, b) => (a.done - b.done) || a.due.localeCompare(b.due));
    const done = visible.filter((t) => t.done).length;
    const pct = visible.length ? Math.round((done / visible.length) * 100) : 0;
    $("#taskStats").innerHTML = `<span><b>${done}</b> / ${visible.length} done</span><span class="pbar"><i style="width:${pct}%"></i></span><span>${pct}%</span>`;

    const open = tasks.filter((t) => !t.done).length;
    $("#tasksCount").textContent = open;

    if (!visible.length) { list.innerHTML = `<li class="empty">No tasks for this person.</li>`; return; }

    list.innerHTML = visible.map((t) => {
      const p = personById(t.picId);
      const tender = tenderById(t.tenderId);
      const d = daysUntil(t.due);
      const dueTxt = d === 0 ? "Due today" : d === 1 ? "Due tomorrow" : d < 0 ? `${-d}d overdue` : `Due ${fmtShort(t.due)}`;
      return `<li class="task${t.done ? " is-done" : ""}" data-id="${esc(t.id)}">
        <input type="checkbox" class="task__check" ${t.done ? "checked" : ""} aria-label="Mark done">
        <div class="task__body">
          <span class="task__title">${esc(t.title)}</span>
          <a class="task__tender" href="#/tenders/${encodeURIComponent(t.tenderId)}">${esc(t.tenderId)} · ${esc(tender ? tender.name : "Unknown tender")}</a>
          <div class="task__meta">
            <span class="prio prio--${esc(t.priority)}">${esc(t.priority)}</span>
            <span class="${!t.done && d < 0 ? "due--late" : ""}">${dueTxt}</span>
          </div>
          <div class="task__pic">${avatar(p)}<div>${esc(p.name)}<small>${esc(p.role)}</small></div></div>
        </div>
        <button class="icon-btn task__del" aria-label="Delete task" title="Delete">${icon("trash")}</button>
      </li>`;
    }).join("");
  }

  function initTaskPanel() {
    const sel = $("#picFilter");
    sel.innerHTML = `<option value="all">All PICs</option>` + DATA.people.map((p) => `<option value="${p.id}">${esc(p.name)}</option>`).join("");
    if (![...sel.options].some((o) => o.value === picFilter)) picFilter = "all";
    sel.value = picFilter;
    sel.addEventListener("change", () => {
      picFilter = sel.value;
      try { localStorage.setItem(PIC_FILTER_KEY, picFilter); } catch (e) { /* ignore */ }
      renderTasks();
    });

    $("#taskList").addEventListener("change", (e) => {
      if (!e.target.classList.contains("task__check")) return;
      const id = e.target.closest(".task").dataset.id;
      const t = tasks.find((x) => x.id === id);
      if (t) { t.done = e.target.checked; saveTasks(); renderTasks(); refreshTaskViews(); }
    });
    $("#taskList").addEventListener("click", (e) => {
      const del = e.target.closest(".task__del");
      if (!del) return;
      const id = del.closest(".task").dataset.id;
      tasks = tasks.filter((x) => x.id !== id);
      saveTasks(); renderTasks(); refreshTaskViews();
    });

    // Add-task dialog
    const dlg = $("#taskDialog");
    const form = $("#taskForm");
    form.tenderId.innerHTML = DATA.tenders
      .filter((t) => t.status !== "Completed")
      .map((t) => `<option value="${t.id}">${esc(t.id)} · ${esc(t.name)}</option>`).join("");
    form.picId.innerHTML = DATA.people.map((p) => `<option value="${p.id}">${esc(p.name)} — ${esc(p.role)}</option>`).join("");

    $("#addTaskBtn").addEventListener("click", () => {
      form.reset();
      const d = today(); d.setDate(d.getDate() + 7);
      form.due.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (picFilter !== "all") form.picId.value = picFilter;
      dlg.showModal();
      form.title.focus();
    });
    $("#cancelTask").addEventListener("click", () => dlg.close());
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = form.title.value.trim();
      if (!title) return;
      tasks.push({
        id: "t" + Date.now(),
        title,
        tenderId: form.tenderId.value,
        picId: form.picId.value,
        due: form.due.value,
        priority: form.priority.value,
        done: false
      });
      saveTasks(); renderTasks(); refreshTaskViews();
      dlg.close();
    });
  }

  // Tender detail page shows tasks too; re-render it when tasks change.
  function refreshTaskViews() {
    const m = location.hash.match(/^#\/tenders\/(.+)$/);
    if (m) pageTenderDetail($("#view"), decodeURIComponent(m[1]));
  }

  /* ---------- Pages ---------- */
  const PAGES = [
    { key: "dashboard",  label: "Dashboard",       icon: "dashboard", sub: "Summary of tender activity" },
    { key: "tenders",    label: "Tenders",         icon: "tenders",   sub: "All tenders and their progress" },
    { key: "suppliers",  label: "Suppliers",       icon: "suppliers", sub: "Supplier directory and performance" },
    { key: "inventory",  label: "Inventory",       icon: "inventory", sub: "Stock levels across warehouses" },
    { key: "orders",     label: "Purchase Orders", icon: "orders",    sub: "Recent purchase orders" },
    { key: "logistics",  label: "Logistics",       icon: "logistics", sub: "Inbound shipments and carriers" },
    { key: "reports",    label: "Reports",         icon: "reports",   sub: "Exports and analytics" },
    { key: "settings",   label: "Settings",        icon: "settings",  sub: "Workspace preferences" }
  ];

  const kpiCard = (label, value, meta, iconName, color, bg) => `
    <div class="card kpi" style="--accent:${color}">
      <div class="kpi__top"><span>${label}</span><span class="kpi__icon" style="background:${bg};color:${color}">${icon(iconName)}</span></div>
      <div class="kpi__value">${value}</div>
      <div class="kpi__meta">${meta}</div>
    </div>`;

  const tenderTableCard = (title, subtitle, withCategory) => `
    <div class="card">
      <div class="card__head">
        <div><h3>${title}</h3><p class="muted">${subtitle}</p></div>
        <div class="table-tools">
          <input type="search" class="input" id="tenderSearch" placeholder="Search tender name…" aria-label="Search tenders">
          <select class="input" id="statusFilter" aria-label="Filter by status">
            <option value="all">All statuses</option>
            <option>Initiated</option><option>In Progress</option><option>Completed</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>Tender name</th><th>ID</th>${withCategory ? "<th>Category</th>" : ""}<th>Status</th><th>Progress</th><th>Deadline</th><th>PIC</th>${withCategory ? '<th class="num">Budget</th>' : ""}
          </tr></thead>
          <tbody id="tenderRows"></tbody>
        </table>
      </div>
    </div>`;

  function bindTenderTable(withCategory) {
    const search = $("#tenderSearch"), filter = $("#statusFilter"), body = $("#tenderRows");
    const draw = () => {
      const q = search.value.trim().toLowerCase();
      const f = filter.value;
      const rows = DATA.tenders.filter((t) =>
        (!q || t.name.toLowerCase().includes(q)) &&
        (f === "all" || (f === "overdue" ? isOverdue(t) : t.status === f))
      ).sort((a, b) => a.deadline.localeCompare(b.deadline));
      const cols = withCategory ? 8 : 6;
      body.innerHTML = rows.length ? rows.map((t) => `
        <tr class="clickable" data-id="${esc(t.id)}" tabindex="0">
          <td class="cell-name">${esc(t.name)}</td>
          <td class="cell-id">${esc(t.id)}</td>
          ${withCategory ? `<td>${esc(t.category)}</td>` : ""}
          <td>${statusBadge(t.status)}</td>
          <td>${progressBar(t)}</td>
          <td>${deadlineCell(t)}</td>
          <td>${personChip(t.pic)}</td>
          ${withCategory ? `<td class="num">${fmtMoney(t.budget)}</td>` : ""}
        </tr>`).join("") : `<tr><td colspan="${cols}" class="empty">No tenders match your filters.</td></tr>`;
    };
    search.addEventListener("input", draw);
    filter.addEventListener("change", draw);
    const open = (e) => { const tr = e.target.closest("tr[data-id]"); if (tr) location.hash = `#/tenders/${encodeURIComponent(tr.dataset.id)}`; };
    body.addEventListener("click", open);
    body.addEventListener("keydown", (e) => { if (e.key === "Enter") open(e); });
    draw();
  }

  function pageDashboard(view) {
    const T = DATA.tenders;
    const count = (s) => T.filter((t) => t.status === s).length;
    const total = T.length, ini = count("Initiated"), prog = count("In Progress"), comp = count("Completed");
    const overdue = T.filter(isOverdue).length;
    const pct = (n) => total ? Math.round((n / total) * 100) : 0;

    view.innerHTML = `
      <div class="grid grid--kpi">
        ${kpiCard("Total Tenders", total, `${fmtMoney(T.reduce((s, t) => s + t.budget, 0))} total budget`, "list", "#1d4ed8", "#eff4ff")}
        ${kpiCard("Initiated", ini, `${pct(ini)}% of all tenders`, "play", STATUS.Initiated.color, "#e8f0fe")}
        ${kpiCard("In Progress", prog, `${pct(prog)}% of all tenders`, "clock", STATUS["In Progress"].color, "#fef3e2")}
        ${kpiCard("Completed", comp, `${pct(comp)}% completion rate`, "check", STATUS.Completed.color, "#e7f6ec")}
        ${kpiCard("Overdue", overdue, overdue ? "Past deadline, not completed" : "Nothing overdue", "alert", "#dc2626", "#fdecec")}
      </div>

      <div class="grid grid--charts">
        <div class="card">
          <div class="card__head"><div><h3>Tender status</h3><p class="muted">Breakdown of all tenders</p></div></div>
          <div class="chart-box chart-box--donut"><canvas id="donutChart" aria-label="Tender status donut chart"></canvas></div>
          <div class="legend">
            ${Object.keys(STATUS).map((s) => `<span><i style="background:${STATUS[s].color}"></i>${s} <b>${count(s)}</b></span>`).join("")}
          </div>
        </div>
        <div class="card">
          <div class="card__head"><div><h3>Tenders per month</h3><p class="muted">New tenders opened, by status today</p></div></div>
          <div class="chart-box"><canvas id="barChart" aria-label="Tenders per month bar chart"></canvas></div>
        </div>
      </div>

      <div class="grid">
        <div class="card">
          <div class="card__head"><div><h3>Completion trend</h3><p class="muted">Cumulative tenders opened vs. completed</p></div></div>
          <div class="chart-box"><canvas id="lineChart" aria-label="Completion trend line chart"></canvas></div>
        </div>
      </div>

      ${tenderTableCard("Tender progress", "Click a row to open tender details", false)}
    `;

    bindTenderTable(false);

    // Donut
    makeChart("donutChart", {
      type: "doughnut",
      data: {
        labels: Object.keys(STATUS),
        datasets: [{ data: Object.keys(STATUS).map(count), backgroundColor: Object.values(STATUS).map((s) => s.color), borderColor: "#fff", borderWidth: 3, hoverOffset: 6 }]
      },
      options: { maintainAspectRatio: false, cutout: "68%", plugins: { legend: { display: false } } }
    });

    // Bar (stacked by status)
    const months = monthBuckets();
    const byMonth = (status) => months.map((m) => T.filter((t) => t.status === status && monthKey(parseDate(t.created)) === monthKey(m)).length);
    makeChart("barChart", {
      type: "bar",
      data: {
        labels: months.map(monthLabel),
        datasets: Object.keys(STATUS).map((s) => ({ label: s, data: byMonth(s), backgroundColor: STATUS[s].color, borderRadius: 4, maxBarThickness: 28 }))
      },
      options: {
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom", labels: { boxWidth: 10, boxHeight: 10, useBorderRadius: true, borderRadius: 3 } } },
        scales: {
          x: { ...axisBase, stacked: true, grid: { display: false } },
          y: { ...axisBase, stacked: true, beginAtZero: true, ticks: { precision: 0, padding: 8 }, grid: gridOpts }
        }
      }
    });

    // Line (cumulative)
    const endOf = (m) => new Date(m.getFullYear(), m.getMonth() + 1, 0);
    const cumOpened = months.map((m) => T.filter((t) => parseDate(t.created) <= endOf(m)).length);
    const cumDone = months.map((m) => T.filter((t) => t.completed && parseDate(t.completed) <= endOf(m)).length);
    makeChart("lineChart", {
      type: "line",
      data: {
        labels: months.map(monthLabel),
        datasets: [
          { label: "Completed", data: cumDone, borderColor: STATUS.Completed.color, backgroundColor: "rgba(22,163,74,.08)", fill: true, tension: .35, pointRadius: 3, pointHoverRadius: 5, borderWidth: 2 },
          { label: "Opened", data: cumOpened, borderColor: "#94a3b8", borderDash: [5, 4], tension: .35, pointRadius: 0, borderWidth: 2 }
        ]
      },
      options: {
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { position: "bottom", labels: { boxWidth: 10, boxHeight: 10, useBorderRadius: true, borderRadius: 3 } },
          tooltip: { callbacks: { afterBody: (items) => { const i = items[0].dataIndex; return cumOpened[i] ? `Completion rate: ${Math.round(cumDone[i] / cumOpened[i] * 100)}%` : ""; } } }
        },
        scales: {
          x: { ...axisBase, grid: { display: false } },
          y: { ...axisBase, beginAtZero: true, ticks: { precision: 0, padding: 8 }, grid: gridOpts }
        }
      }
    });
  }

  function pageTenders(view) {
    const T = DATA.tenders;
    view.innerHTML = `
      <div class="grid grid--kpi4">
        ${Object.keys(STATUS).map((s) => kpiCard(s, T.filter((t) => t.status === s).length, "tenders", s === "Completed" ? "check" : s === "Initiated" ? "play" : "clock", STATUS[s].color, `var(--${STATUS[s].cls}-bg)`)).join("")}
        ${kpiCard("Overdue", T.filter(isOverdue).length, "need attention", "alert", "#dc2626", "#fdecec")}
      </div>
      ${tenderTableCard("All tenders", `${T.length} tenders · click a row for details`, true)}
    `;
    bindTenderTable(true);
  }

  function pageTenderDetail(view, id) {
    const t = tenderById(id);
    if (!t) { view.innerHTML = `<a class="back" href="#/tenders">${icon("chevron")} Back to tenders</a><div class="card empty">Tender not found.</div>`; return; }
    const p = personById(t.pic);
    const related = tasks.filter((x) => x.tenderId === t.id);
    const d = daysUntil(t.deadline);
    const stages = [
      { label: "Tender initiated", date: t.created, done: true },
      { label: "Bidding & evaluation", date: null, done: t.progress >= 40 },
      { label: "Award & contract", date: null, done: t.progress >= 80 },
      { label: "Completed", date: t.completed, done: t.status === "Completed" }
    ];
    $("#pageTitle").textContent = t.name;
    $("#pageSub").textContent = t.id;

    view.innerHTML = `
      <a class="back" href="#/tenders">${icon("chevron")} Back to tenders</a>
      <div class="card" style="margin-bottom:20px">
        <div class="detail-head">
          <div>
            <span class="cell-id">${esc(t.id)}</span>
            <h2>${esc(t.name)}</h2>
            <div style="display:flex;gap:8px;flex-wrap:wrap">${statusBadge(t.status)}${isOverdue(t) ? '<span class="badge badge--overdue">Overdue</span>' : ""}<span class="badge badge--neutral">${esc(t.category)}</span></div>
          </div>
          <div style="min-width:220px">${progressBar(t)}</div>
        </div>
        <p style="color:var(--text-2);margin:16px 0 20px">${esc(t.description)}</p>
        <dl class="dl">
          <div><dt>Budget</dt><dd>${fmtMoney(t.budget)}</dd></div>
          <div><dt>Created</dt><dd>${fmtDate(t.created)}</dd></div>
          <div><dt>Deadline</dt><dd class="${isOverdue(t) ? "is-overdue-date" : ""}">${fmtDate(t.deadline)}${t.status !== "Completed" ? ` <span class="muted">(${d < 0 ? `${-d} days late` : `${d} days left`})</span>` : ""}</dd></div>
          <div><dt>Completed</dt><dd>${fmtDate(t.completed)}</dd></div>
          <div><dt>Awarded supplier</dt><dd>${esc(t.supplier)}</dd></div>
        </dl>
      </div>
      <div class="grid grid--3">
        <div class="card">
          <div class="card__head"><h3>Person in charge</h3></div>
          <div class="person">${avatar(p, true)}<div><div style="font-weight:600">${esc(p.name)}</div><div class="muted" style="font-size:13px">${esc(p.role)}</div></div></div>
        </div>
        <div class="card">
          <div class="card__head"><h3>Timeline</h3></div>
          <ul class="timeline">${stages.map((s) => `<li class="${s.done ? "done" : ""}">${s.label}<small>${s.date ? fmtDate(s.date) : s.done ? "Done" : "Pending"}</small></li>`).join("")}</ul>
        </div>
        <div class="card">
          <div class="card__head"><h3>Related tasks</h3><span class="muted">${related.filter((x) => x.done).length}/${related.length} done</span></div>
          ${related.length ? `<ul class="timeline">${related.map((x) => `<li class="${x.done ? "done" : ""}">${esc(x.title)}<small>${esc(personById(x.picId).name)} · due ${fmtDate(x.due)}</small></li>`).join("")}</ul>` : '<p class="muted">No tasks yet. Use “Add task” in the task tracker.</p>'}
        </div>
      </div>`;
  }

  function pageSuppliers(view) {
    const S = DATA.suppliers;
    const avg = (k) => (S.reduce((s, x) => s + x[k], 0) / S.length);
    const stars = (r) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));
    const stBadge = (s) => `<span class="badge ${s === "Preferred" ? "badge--completed" : s === "On Watch" ? "badge--overdue" : "badge--initiated"}">${s}</span>`;
    view.innerHTML = `
      <div class="grid grid--kpi4">
        ${kpiCard("Suppliers", S.length, "in directory", "suppliers", "#1d4ed8", "#eff4ff")}
        ${kpiCard("Preferred", S.filter((s) => s.status === "Preferred").length, "top-rated partners", "check", STATUS.Completed.color, "#e7f6ec")}
        ${kpiCard("Avg. rating", avg("rating").toFixed(1), "out of 5", "reports", STATUS["In Progress"].color, "#fef3e2")}
        ${kpiCard("Avg. on-time", Math.round(avg("onTime")) + "%", "delivery performance", "clock", STATUS.Initiated.color, "#e8f0fe")}
      </div>
      <div class="grid grid--3">
        ${S.map((s) => `
          <div class="card supplier-card">
            <div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start">
              <div><h3 style="font-size:15px">${esc(s.name)}</h3><span class="muted" style="font-size:12px">${esc(s.id)} · ${esc(s.country)}</span></div>
              ${stBadge(s.status)}
            </div>
            <div style="display:flex;justify-content:space-between;font-size:13px;color:var(--text-2)"><span>${esc(s.category)}</span><span class="stars" title="${s.rating}">${stars(s.rating)}</span></div>
            <div><div style="font-size:12px;color:var(--muted);margin-bottom:4px">On-time delivery</div>
              <div class="progress"><div class="progress__bar"><div class="progress__fill" style="width:${s.onTime}%;background:${s.onTime >= 90 ? STATUS.Completed.color : s.onTime >= 85 ? STATUS["In Progress"].color : "#dc2626"}"></div></div><span class="progress__val">${s.onTime}%</span></div></div>
            <div style="font-size:13px;color:var(--text-2)">${s.activeContracts} active contract${s.activeContracts > 1 ? "s" : ""}</div>
          </div>`).join("")}
      </div>`;
  }

  function pageInventory(view) {
    const I = DATA.inventory;
    const low = I.filter((i) => i.qty < i.reorder);
    view.innerHTML = `
      <div class="grid grid--kpi4">
        ${kpiCard("SKUs tracked", I.length, "across all warehouses", "inventory", "#1d4ed8", "#eff4ff")}
        ${kpiCard("Below reorder", low.length, "need replenishment", "alert", "#dc2626", "#fdecec")}
        ${kpiCard("Healthy", I.length - low.length, "above reorder point", "check", STATUS.Completed.color, "#e7f6ec")}
        ${kpiCard("Warehouses", new Set(I.map((i) => i.warehouse)).size, "active sites", "suppliers", STATUS.Initiated.color, "#e8f0fe")}
      </div>
      <div class="card">
        <div class="card__head"><div><h3>Stock levels</h3><p class="muted">Bar shows quantity relative to 2× reorder point</p></div></div>
        <div class="table-wrap"><table>
          <thead><tr><th>SKU</th><th>Item</th><th>Warehouse</th><th class="num">Qty</th><th class="num">Reorder at</th><th>Level</th><th>Status</th></tr></thead>
          <tbody>${I.map((i) => {
            const pct = Math.min(100, Math.round((i.qty / (i.reorder * 2)) * 100));
            const lowItem = i.qty < i.reorder;
            return `<tr><td class="cell-id">${esc(i.sku)}</td><td class="cell-name">${esc(i.name)}</td><td>${esc(i.warehouse)}</td>
              <td class="num">${i.qty.toLocaleString()} ${esc(i.unit)}</td><td class="num">${i.reorder.toLocaleString()}</td>
              <td><div class="progress"><div class="progress__bar"><div class="progress__fill" style="width:${pct}%;background:${lowItem ? "#dc2626" : STATUS.Completed.color}"></div></div></div></td>
              <td>${lowItem ? '<span class="badge badge--overdue">Low stock</span>' : '<span class="badge badge--completed">OK</span>'}</td></tr>`;
          }).join("")}</tbody>
        </table></div>
      </div>`;
  }

  function pageOrders(view) {
    const O = DATA.purchaseOrders;
    const cls = { Pending: "badge--progress", Approved: "badge--initiated", Shipped: "badge--neutral", Delivered: "badge--completed" };
    view.innerHTML = `
      <div class="grid grid--kpi4">
        ${kpiCard("Open POs", O.filter((o) => o.status !== "Delivered").length, "not yet delivered", "orders", "#1d4ed8", "#eff4ff")}
        ${kpiCard("Pending approval", O.filter((o) => o.status === "Pending").length, "awaiting sign-off", "clock", STATUS["In Progress"].color, "#fef3e2")}
        ${kpiCard("Delivered", O.filter((o) => o.status === "Delivered").length, "this period", "check", STATUS.Completed.color, "#e7f6ec")}
        ${kpiCard("Total value", fmtMoney(O.reduce((s, o) => s + o.amount, 0)), "all listed POs", "reports", STATUS.Initiated.color, "#e8f0fe")}
      </div>
      <div class="card">
        <div class="card__head"><div><h3>Purchase orders</h3><p class="muted">Most recent first</p></div></div>
        <div class="table-wrap"><table>
          <thead><tr><th>PO number</th><th>Supplier</th><th>Tender</th><th>Date</th><th class="num">Amount</th><th>Status</th></tr></thead>
          <tbody>${[...O].sort((a, b) => b.date.localeCompare(a.date)).map((o) => `<tr>
            <td class="cell-id">${esc(o.id)}</td><td class="cell-name">${esc(o.supplier)}</td>
            <td><a href="#/tenders/${encodeURIComponent(o.tenderId)}">${esc(o.tenderId)}</a></td>
            <td>${fmtDate(o.date)}</td><td class="num">${fmtMoney(o.amount)}</td>
            <td><span class="badge ${cls[o.status] || "badge--neutral"}">${esc(o.status)}</span></td></tr>`).join("")}</tbody>
        </table></div>
      </div>`;
  }

  function pageLogistics(view) {
    const S = DATA.shipments;
    const cls = { "In Transit": "badge--initiated", Customs: "badge--progress", Delayed: "badge--overdue", Delivered: "badge--completed" };
    view.innerHTML = `
      <div class="grid grid--kpi4">
        ${kpiCard("Shipments", S.length, "tracked this week", "logistics", "#1d4ed8", "#eff4ff")}
        ${kpiCard("In transit", S.filter((s) => s.status === "In Transit").length, "on the move", "play", STATUS.Initiated.color, "#e8f0fe")}
        ${kpiCard("At customs", S.filter((s) => s.status === "Customs").length, "awaiting clearance", "clock", STATUS["In Progress"].color, "#fef3e2")}
        ${kpiCard("Delayed", S.filter((s) => s.status === "Delayed").length, "behind ETA", "alert", "#dc2626", "#fdecec")}
      </div>
      <div class="grid grid--2">
        <div class="card">
          <div class="card__head"><div><h3>Shipments by mode</h3><p class="muted">Count of tracked shipments</p></div></div>
          <div class="chart-box"><canvas id="modeChart"></canvas></div>
        </div>
        <div class="card">
          <div class="card__head"><div><h3>Route map</h3><p class="muted">Placeholder — connect a map provider</p></div></div>
          <div class="chart-box" style="display:grid;place-items:center;background:var(--surface-2);border:1px dashed var(--border);border-radius:10px;color:var(--muted)">${icon("logistics")}&nbsp; Map coming soon</div>
        </div>
      </div>
      <div class="card">
        <div class="card__head"><h3>Inbound shipments</h3></div>
        <div class="table-wrap"><table>
          <thead><tr><th>Shipment</th><th>Origin</th><th>Destination</th><th>Carrier</th><th>Mode</th><th>ETA</th><th>Status</th></tr></thead>
          <tbody>${S.map((s) => `<tr><td class="cell-id">${esc(s.id)}</td><td>${esc(s.origin)}</td><td>${esc(s.destination)}</td><td>${esc(s.carrier)}</td><td>${esc(s.mode)}</td><td>${fmtDate(s.eta)}</td><td><span class="badge ${cls[s.status] || "badge--neutral"}">${esc(s.status)}</span></td></tr>`).join("")}</tbody>
        </table></div>
      </div>`;
    const modes = [...new Set(S.map((s) => s.mode))];
    makeChart("modeChart", {
      type: "bar",
      data: { labels: modes, datasets: [{ label: "Shipments", data: modes.map((m) => S.filter((s) => s.mode === m).length), backgroundColor: "#3b82f6", borderRadius: 6, maxBarThickness: 40 }] },
      options: { maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { ...axisBase, grid: { display: false } }, y: { ...axisBase, beginAtZero: true, ticks: { precision: 0, padding: 8 }, grid: gridOpts } } }
    });
  }

  function pageReports(view) {
    const reports = [
      ["Tender status report", "Status, progress and deadlines for every tender."],
      ["Supplier performance", "Ratings and on-time delivery by supplier."],
      ["Spend analysis", "Budget vs. purchase-order spend by category."],
      ["Inventory valuation", "Stock on hand and reorder exposure."],
      ["Logistics KPIs", "Transit times, delays and carrier scorecards."],
      ["Task completion", "Tasks completed by PIC and tender."]
    ];
    const byCat = {};
    DATA.tenders.forEach((t) => { byCat[t.category] = (byCat[t.category] || 0) + t.budget; });
    view.innerHTML = `
      <div class="grid grid--3">
        ${reports.map(([t, d]) => `<div class="card report-card" tabindex="0"><span class="kpi__icon">${icon("file")}</span><div><h3 style="font-size:15px">${t}</h3><p>${d}</p></div></div>`).join("")}
      </div>
      <div class="card">
        <div class="card__head"><div><h3>Tender budget by category</h3><p class="muted">Sum of tender budgets</p></div></div>
        <div class="chart-box"><canvas id="catChart"></canvas></div>
      </div>
      <p class="placeholder-note">Report exports are placeholders — wire them to your reporting backend.</p>`;
    const cats = Object.keys(byCat).sort((a, b) => byCat[b] - byCat[a]);
    makeChart("catChart", {
      type: "bar",
      data: { labels: cats, datasets: [{ label: "Budget", data: cats.map((c) => byCat[c]), backgroundColor: "#3b82f6", borderRadius: 6, maxBarThickness: 26 }] },
      options: {
        indexAxis: "y", maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => fmtMoney(c.raw) } } },
        scales: { x: { ...axisBase, grid: gridOpts, ticks: { padding: 8, callback: (v) => "$" + v / 1000 + "k" } }, y: { ...axisBase, grid: { display: false } } }
      }
    });
  }

  function pageSettings(view) {
    const row = (title, desc, control) => `<div class="settings-row"><div><div style="font-weight:500">${title}</div><p class="muted">${desc}</p></div>${control}</div>`;
    const sw = (on) => `<label class="switch"><input type="checkbox" ${on ? "checked" : ""}><span></span></label>`;
    view.innerHTML = `
      <div class="grid grid--2">
        <div class="card">
          <div class="card__head"><h3>Company</h3></div>
          <div class="form" style="padding:0">
            <label>Company name<input class="input" value="${esc(DATA.company.name)}" disabled></label>
            <label>Logo<div style="display:flex;align-items:center;gap:12px"><div class="logo">${esc(DATA.company.short)}</div><span class="muted">Placeholder — replace in data.js</span></div></label>
          </div>
        </div>
        <div class="card">
          <div class="card__head"><h3>Notifications</h3></div>
          ${row("Overdue tender alerts", "Email the PIC when a deadline passes", sw(true))}
          ${row("Daily task digest", "Summary of tasks due today", sw(true))}
          ${row("Supplier rating changes", "Notify when a rating drops below 3.5", sw(false))}
        </div>
      </div>
      <div class="card">
        <div class="card__head"><h3>Data</h3></div>
        ${row("Reset tasks", "Clear saved task changes and restore sample tasks", '<button class="btn btn--ghost" id="resetTasks">Reset</button>')}
      </div>`;
    $("#resetTasks").addEventListener("click", () => {
      if (!confirm("Restore the sample tasks? Your task changes will be lost.")) return;
      try { localStorage.removeItem(TASKS_KEY); } catch (e) { /* ignore */ }
      tasks = DATA.tasks.map((t) => ({ ...t }));
      renderTasks();
    });
  }

  const RENDER = {
    dashboard: pageDashboard, tenders: pageTenders, suppliers: pageSuppliers, inventory: pageInventory,
    orders: pageOrders, logistics: pageLogistics, reports: pageReports, settings: pageSettings
  };

  /* ---------- Router ---------- */
  function route() {
    const [, key = "dashboard", param] = (location.hash || "#/dashboard").split("/");
    const page = PAGES.find((p) => p.key === key) || PAGES[0];
    const view = $("#view");

    destroyCharts();
    document.querySelectorAll(".nav a").forEach((a) => a.classList.toggle("active", a.dataset.key === page.key));
    $("#pageTitle").textContent = page.label;
    $("#pageSub").textContent = page.sub;
    document.title = `${page.label} · Supply Chain`;

    view.style.animation = "none"; void view.offsetWidth; view.style.animation = "";
    if (page.key === "tenders" && param) pageTenderDetail(view, decodeURIComponent(param));
    else RENDER[page.key](view);

    $("#app").classList.remove("nav-open", "panel-open");
    window.scrollTo(0, 0);
  }

  /* ---------- Shell ---------- */
  function initShell() {
    $("#logo").textContent = DATA.company.short;
    $("#companyName").textContent = DATA.company.name;
    $("#nav").innerHTML = PAGES.map((p) => `<a href="#/${p.key}" data-key="${p.key}" title="${p.label}">${icon(p.icon)}<span>${p.label}</span></a>`).join("");
    $("#collapseBtn").innerHTML = icon("chevron");
    $("#menuBtn").innerHTML = icon("menu");
    $("#panelClose").innerHTML = icon("close");
    $("#tasksToggleIcon").innerHTML = icon("check");

    const app = $("#app");
    try { if (localStorage.getItem(COLLAPSE_KEY) === "1") app.classList.add("is-collapsed"); } catch (e) { /* ignore */ }
    $("#collapseBtn").addEventListener("click", () => {
      app.classList.toggle("is-collapsed");
      try { localStorage.setItem(COLLAPSE_KEY, app.classList.contains("is-collapsed") ? "1" : "0"); } catch (e) { /* ignore */ }
      setTimeout(() => charts.forEach((c) => c.resize()), 250);
    });
    $("#menuBtn").addEventListener("click", () => app.classList.add("nav-open"));
    $("#tasksToggle").addEventListener("click", () => app.classList.add("panel-open"));
    $("#panelClose").addEventListener("click", () => app.classList.remove("panel-open"));
    $("#scrim").addEventListener("click", () => app.classList.remove("nav-open", "panel-open"));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") app.classList.remove("nav-open", "panel-open"); });
  }

  initShell();
  initTaskPanel();
  renderTasks();
  window.addEventListener("hashchange", route);
  route();
})();
