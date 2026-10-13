// C Programming Problem Sets. Vanilla port of the "Problem Sets" design.
// Reads PS_DATA from problem-sets.data.js. List view and detail view share one page (#/ps-01).
(function () {
  var root = document.getElementById('ps-app');
  var BASE = root.getAttribute('data-base') || '';
  var FILES = BASE + '/assets/problem-sets/';
  var D = window.PS_DATA || { SITE: {}, PROBLEM_SETS: [] };
  var SITE = D.SITE, SETS = D.PROBLEM_SETS;
  var THEME_KEY = 'spl-ps-theme';

  var TYPE_LABEL = { pdf: 'PDF', document: 'Document', online: 'Online practice', code: 'C source' };
  var LEVEL = { Beginner: 1, Intermediate: 2, Advanced: 3 };
  var KW = {};
  ('auto break case char const continue default do double else enum extern float for goto if int long register return short signed sizeof static struct switch typedef union unsigned void volatile while size_t').split(' ').forEach(function (k) { KW[k] = 1; });

  var state = { query: '', topic: 'all', difficulty: 'all', type: 'all', sort: 'newest', selectedId: null, loading: true, theme: 'light' };
  var listScroll = 0;

  var pad = function (n) { return String(n).padStart(2, '0'); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var fmt = function (iso) { return iso ? new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''; };
  var fileName = function (u) { return (u || '').split('/').pop(); };
  var $ = function (id) { return document.getElementById(id); };

  var I = {
    search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>',
    chev: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>',
    x: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>',
    list: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 12h11"></path><path d="M10 18h11"></path><path d="M10 6h11"></path><path d="M4 10h2"></path><path d="M4 6h1v4"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path></svg>',
    file: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path></svg>',
    cal: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path></svg>',
    dl: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="m7 10 5 5 5-5"></path><path d="M12 15V3"></path></svg>',
    back: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>',
    clock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>',
    code: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="m10 13-2 2 2 2"></path><path d="m14 17 2-2-2-2"></path></svg>',
    doc: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>',
    ext: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>',
    sun: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>',
    moon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>'
  };

  // ---- helpers ----
  function highlight(code) {
    return code.split('\n').map(function (line) {
      var toks = [], re = /(\/\/.*$|\/\*.*?\*\/)|(^\s*#\s*\w+.*$)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|(\s+|.)/g, m;
      while ((m = re.exec(line))) {
        var c = 'var(--code-fg)';
        if (m[1]) c = 'var(--code-com)'; else if (m[2]) c = 'var(--code-pp)'; else if (m[3]) c = 'var(--code-str)'; else if (m[4]) c = 'var(--code-num)';
        else if (m[5]) { if (KW[m[5]]) c = 'var(--code-kw)'; else if (/^\s*\(/.test(line.slice(re.lastIndex))) c = 'var(--code-fn)'; }
        var last = toks[toks.length - 1];
        if (last && last.c === c) last.s += m[0]; else toks.push({ s: m[0], c: c });
      }
      return '<span class="ln">' + toks.map(function (t) { return '<span style="color:' + t.c + '">' + esc(t.s) + '</span>'; }).join('') + '</span>';
    }).join('');
  }
  function inline(text) {
    return text.split(/\n\s*\n/).map(function (p) {
      return '<p>' + p.split(/`([^`]+)`/).map(function (t, i) { return i % 2 ? '<code class="i">' + esc(t) + '</code>' : esc(t); }).join('') + '</p>';
    }).join('');
  }
  function bars(d) { var l = LEVEL[d] || 1; return '<span class="bars" aria-hidden="true"><i></i><i' + (l < 2 ? ' class="off"' : '') + '></i><i' + (l < 3 ? ' class="off"' : '') + '></i></span>'; }
  function level(d) { return '<span class="level" title="Difficulty">' + bars(d) + esc(d) + '</span>'; }
  function typeLabel(s) { return TYPE_LABEL[s.fileType] || s.fileType; }
  function problemCount(s) { return (s.problems || []).length || s.problemCount; }

  // ---- data: hide files that are not published ----
  function exists(url) {
    return fetch(FILES + url, { method: 'HEAD' }).then(function (r) { return r.ok; }, function () { return false; });
  }
  function checkFiles() {
    var jobs = [];
    SETS.forEach(function (s) {
      if (s.downloadUrl) jobs.push(exists(s.downloadUrl).then(function (ok) { if (!ok) { delete s.downloadUrl; } }));
      if (s.resources) {
        jobs.push(Promise.all(s.resources.map(function (r) { return exists(r.url).then(function (ok) { return ok ? r : null; }); })).then(function (list) { s.resources = list.filter(Boolean); }));
      }
    });
    return Promise.all(jobs);
  }

  // ---- list view ----
  function filtered() {
    var q = state.query.trim().toLowerCase();
    var out = SETS.filter(function (s) {
      return (!q || [s.title, s.description, s.topics.join(' '), 'ps ' + pad(s.number), 'problem set ' + s.number].join(' ').toLowerCase().indexOf(q) > -1) &&
        (state.topic === 'all' || s.topics.indexOf(state.topic) > -1) &&
        (state.difficulty === 'all' || s.difficulty === state.difficulty) &&
        (state.type === 'all' || s.fileType === state.type);
    });
    var d = function (s) { return s.publishedAt || ''; };
    if (state.sort === 'title') out.sort(function (a, b) { return a.title.localeCompare(b.title); });
    else out.sort(function (a, b) { return state.sort === 'oldest' ? d(a).localeCompare(d(b)) || a.number - b.number : d(b).localeCompare(d(a)) || b.number - a.number; });
    return out;
  }
  function rowHtml(s) {
    var extras = (s.resources || []).length, date = s.updatedAt || s.publishedAt, tl = typeLabel(s);
    var meta = s.downloadUrl && s.fileSize ? tl + ' · ' + s.fileSize : tl;
    var dl = s.downloadUrl
      ? '<a class="btn btn-sm" href="' + esc(FILES + s.downloadUrl) + '" download="' + esc(fileName(s.downloadUrl)) + '" aria-label="Download ' + esc(tl) + ' for Problem Set ' + s.number + '">' + I.dl + (s.fileType === 'pdf' ? 'PDF' : 'Download') + '</a>'
      : '<span class="none">Not yet available</span>';
    return '<tr>' +
      '<td class="c-id">PS ' + pad(s.number) + '</td>' +
      '<td class="c-title"><a href="#/' + s.id + '" data-open="' + s.id + '">' + esc(s.title) + '</a><p>' + esc(s.description) + '</p></td>' +
      '<td class="c-topics"><ul class="chips" aria-label="Topics">' + s.topics.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></td>' +
      '<td>' + level(s.difficulty) + '</td>' +
      '<td class="c-num">' + problemCount(s) + '</td>' +
      '<td class="c-file">' + esc(meta) + (extras ? '<br><span class="extra">+' + extras + ' resource' + (extras > 1 ? 's' : '') + '</span>' : '') + '</td>' +
      '<td class="c-date"><time datetime="' + esc(date) + '">' + fmt(date) + '</time>' + (s.updatedAt ? '<br><span class="extra">Updated</span>' : '') + '</td>' +
      '<td class="c-act"><button type="button" class="btn btn-sm btn-primary" data-open="' + s.id + '">View</button> ' + dl + '</td></tr>';
  }
  function tableHtml(list) {
    return '<div class="tbl-wrap"><table class="ps-table"><caption class="sr">Problem sets</caption><thead><tr><th scope="col">Set</th><th scope="col">Title</th><th scope="col">Topics</th><th scope="col">Level</th><th scope="col" class="c-num">Problems</th><th scope="col">Material</th><th scope="col">Date</th><th scope="col"><span class="sr">Actions</span></th></tr></thead><tbody>' +
      list.map(rowHtml).join('') + '</tbody></table></div>';
  }
  function selectHtml(id, label, options, value) {
    return '<div class="f-sel"><select id="' + id + '" class="ctl" aria-label="' + label + '">' +
      options.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (o[0] === value ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select>' + I.chev + '</div>';
  }
  function active() { return !!(state.query.trim() || state.topic !== 'all' || state.difficulty !== 'all' || state.type !== 'all'); }

  function listView() {
    var topics = []; SETS.forEach(function (s) { s.topics.forEach(function (t) { if (topics.indexOf(t) < 0) topics.push(t); }); });
    topics.sort();
    var types = []; SETS.forEach(function (s) { if (types.indexOf(s.fileType) < 0) types.push(s.fileType); });
    var problems = SETS.reduce(function (a, s) { return a + (problemCount(s) || 0); }, 0);
    return '<section class="hero" aria-labelledby="page-title"><p class="eyebrow">C PROGRAMMING</p><h1 id="page-title">C Programming Problem Sets</h1>' +
      '<p class="lede">Practice programming logic, strengthen your problem-solving skills, and prepare for assessments with carefully organized C programming exercises.</p>' +
      '<dl class="stats"><div><dt>Problem sets</dt><dd>' + SETS.length + '</dd></div><div><dt>Problems</dt><dd>' + problems + '</dd></div><div><dt>Topics</dt><dd>' + topics.length + '</dd></div></dl></section>' +
      '<section class="filters" aria-label="Search and filter problem sets"><div class="bar" role="search">' +
      '<div class="f-search">' + I.search + '<label for="ps-search" class="sr">Search problem sets</label><input id="ps-search" class="ctl" type="search" placeholder="Search by title, topic or description" autocomplete="off" value="' + esc(state.query) + '"></div>' +
      selectHtml('f-topic', 'Filter by topic', [['all', 'All topics']].concat(topics.map(function (t) { return [t, t]; })), state.topic) +
      selectHtml('f-diff', 'Filter by difficulty', [['all', 'All difficulties'], ['Beginner', 'Beginner'], ['Intermediate', 'Intermediate'], ['Advanced', 'Advanced']], state.difficulty) +
      selectHtml('f-type', 'Filter by material type', [['all', 'All materials']].concat(types.map(function (t) { return [t, TYPE_LABEL[t] || t]; })), state.type) +
      selectHtml('f-sort', 'Sort problem sets', [['newest', 'Newest first'], ['oldest', 'Oldest first'], ['title', 'Title A–Z']], state.sort) +
      '<button type="button" class="btn" id="f-clear">' + I.x + 'Clear filters</button></div>' +
      '<p class="count" id="count" aria-live="polite"></p></section><div id="results"></div>';
  }
  function updateResults() {
    var list = filtered(), res = $('results'), cnt = $('count'), clr = $('f-clear');
    if (!res) return;
    if (clr) clr.disabled = !active();
    if (state.loading) {
      cnt.textContent = 'Loading problem sets…';
      res.innerHTML = '<div class="skel-rows" aria-busy="true">' + [1, 2, 3, 4, 5, 6].map(function () { return '<div class="skel-row"><i style="width:48px"></i><i style="flex:1"></i><i style="width:90px"></i><i style="width:70px"></i></div>'; }).join('') + '</div>';
      return;
    }
    cnt.textContent = 'Showing ' + list.length + ' of ' + SETS.length + ' problem sets';
    res.innerHTML = list.length
      ? tableHtml(list)
      : '<div class="empty"><span class="ico">' + I.search + '</span><p class="ttl">No problem sets match your search</p><p class="sub">Try a different keyword, or remove some filters to see more results.</p><button type="button" class="btn btn-sm" data-clear="1">Clear filters</button></div>';
  }

  // ---- detail view ----
  function detailView(s) {
    var tl = typeLabel(s);
    var resources = [];
    if (s.downloadUrl) resources.push({ label: 'Problem set (' + tl + ')', url: s.downloadUrl, type: s.fileType, size: s.fileSize });
    (s.resources || []).forEach(function (r) { resources.push({ label: r.label, url: r.url, type: r.fileType, size: r.fileSize }); });
    var probs = (s.problems || []).map(function (p, i) {
      var n = p.number || i + 1, id = s.id + '-p' + n;
      return '<li class="prob" id="' + id + '"><article aria-labelledby="' + id + '-h"><div class="prob-h"><span class="prob-n" aria-hidden="true">' + n + '</span>' +
        '<h3 id="' + id + '-h"><span class="sr">Problem ' + n + ': </span>' + esc(p.title) + '</h3></div>' +
        '<div class="text">' + inline(p.statement || '') + '</div>' +
        (p.code ? '<figure class="fig src"><figcaption class="mono">C</figcaption><pre><code>' + highlight(p.code) + '</code></pre></figure>' : '') +
        ((p.inputFormat || p.outputFormat) ? '<dl class="io">' + (p.inputFormat ? '<div><dt>Input</dt><dd>' + esc(p.inputFormat) + '</dd></div>' : '') + (p.outputFormat ? '<div><dt>Output</dt><dd>' + esc(p.outputFormat) + '</dd></div>' : '') + '</dl>' : '') +
        ((p.sampleInput || p.sampleOutput) ? '<div class="samples">' +
          (p.sampleInput ? '<figure class="fig"><figcaption>Sample input</figcaption><pre>' + esc(p.sampleInput) + '</pre></figure>' : '') +
          (p.sampleOutput ? '<figure class="fig"><figcaption>Sample output</figcaption><pre>' + esc(p.sampleOutput) + '</pre></figure>' : '') + '</div>' : '') +
        ((p.constraints && p.constraints.length) ? '<div class="cons"><h4>Constraints</h4><ul>' + p.constraints.map(function (k) { return '<li>' + esc(k) + '</li>'; }).join('') + '</ul></div>' : '') +
        '</article></li>';
    }).join('');
    var toc = (s.problems || []).map(function (p, i) { var n = p.number || i + 1; return '<li><a href="#/' + s.id + '" data-jump="' + s.id + '-p' + n + '"><span>' + n + '.</span><span>' + esc(p.title) + '</span></a></li>'; }).join('');
    var res = resources.length
      ? '<ul>' + resources.map(function (r) {
        var meta = [TYPE_LABEL[r.type] || r.type, r.size].filter(Boolean).join(' · ');
        return '<li><a class="res" href="' + esc(FILES + r.url) + '" download="' + esc(fileName(r.url)) + '"><span class="ic">' + (r.type === 'code' ? I.code : I.doc) + '</span><span class="tx"><b>' + esc(r.label) + '</b><small>' + esc(meta) + '</small></span><span class="dli">' + I.dl + '</span></a></li>';
      }).join('') + '</ul>'
      : '<p class="none">No downloadable files have been published for this set yet. The problems below are complete.</p>';
    var act = s.downloadUrl
      ? '<a class="btn btn-primary dl" href="' + esc(FILES + s.downloadUrl) + '" download="' + esc(fileName(s.downloadUrl)) + '">' + I.dl + (s.fileType === 'pdf' ? 'Download PDF' : 'Download ' + tl.toLowerCase()) + '</a><span class="file">' + esc([tl, s.fileSize].filter(Boolean).join(' · ')) + '</span>'
      : '<span class="missing">' + I.clock + esc(tl) + ' not yet available — check back soon</span>';
    return '<button type="button" class="back" data-back="1">' + I.back + 'All problem sets</button>' +
      '<header class="d-head"><div class="d-tags"><span class="eyebrow">PROBLEM SET ' + pad(s.number) + '</span>' + level(s.difficulty) + '</div>' +
      '<h1 id="detail-title" tabindex="-1">' + esc(s.title) + '</h1><p class="lede">' + esc(s.description) + '</p>' +
      '<div class="d-meta"><span>' + problemCount(s) + ' problems</span><span aria-hidden="true">·</span><span>Published <time datetime="' + esc(s.publishedAt) + '">' + fmt(s.publishedAt) + '</time></span>' +
      (s.updatedAt ? '<span aria-hidden="true">·</span><span>Updated <time datetime="' + esc(s.updatedAt) + '">' + fmt(s.updatedAt) + '</time></span>' : '') + '</div>' +
      '<div class="d-act">' + act + '</div></header>' +
      '<div class="d-body"><div class="d-main"><h2 class="sr">Problems</h2><ol>' + probs + '</ol></div>' +
      '<aside class="d-side" aria-label="Problem set information"><section class="box" aria-labelledby="mat-h"><h2 id="mat-h">Materials</h2>' + res + '</section>' +
      '<section aria-labelledby="obj-h"><h2 class="side-h" id="obj-h">Learning objectives</h2><ul class="objs">' + (s.objectives || []).map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('') + '</ul>' +
      '<ul class="chips" aria-label="Topics">' + s.topics.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></section>' +
      '<nav class="toc" aria-labelledby="toc-h"><h2 class="side-h" id="toc-h">On this page</h2><ol>' + toc + '</ol></nav></aside></div>';
  }

  // ---- shell ----
  function shell() {
    var nav = [['Overview', BASE + '/'], ['Syllabus', BASE + '/syllabus/'], ['Teaching Team', BASE + '/teaching-team/']].map(function (l) { return '<a href="' + esc(l[1]) + '">' + l[0] + '</a>'; }).join('');
    root.innerHTML = '<div class="page"><a href="#main" class="skip">Skip to content</a>' +
      '<header class="top"><div class="top-in"><a class="brand" href="' + esc(BASE + '/') + '"><span class="tag">' + esc(SITE.courseShort || '') + '</span><span class="name">' + esc(SITE.courseTitle || '') + '</span></a>' +
      '<nav class="nav" aria-label="Course">' + nav + '<a href="#" aria-current="page" data-back="1">Problem Sets</a><button type="button" class="theme" id="theme"></button></nav></div></header>' +
      '<main id="main"><nav class="crumbs" aria-label="Breadcrumb"><ol id="crumbs"></ol></nav><div id="view"></div></main>' +
      '<footer class="foot"><div class="foot-in"><div><span>' + esc(SITE.courseTitle || '') + ' · C Programming Problem Sets</span><span>© ' + (SITE.year || new Date().getFullYear()) + ' ' + esc(SITE.author || '') + '</span></div>' +
      '<a href="' + esc(BASE + '/') + '">Course website ' + I.ext + '</a></div></footer></div>';
    setThemeButton();
  }
  function crumbs(s) {
    $('crumbs').innerHTML = '<li><a href="' + esc(BASE + '/') + '">Home</a></li><li aria-hidden="true">/</li>' +
      (s ? '<li><a href="#" data-back="1">Problem Sets</a></li><li aria-hidden="true">/</li><li aria-current="page">PS ' + pad(s.number) + '</li>' : '<li aria-current="page">Problem Sets</li>');
  }
  function render(focus) {
    var s = state.selectedId && SETS.filter(function (x) { return x.id === state.selectedId; })[0];
    crumbs(s);
    document.title = (s ? 'PS ' + pad(s.number) + ' · ' + s.title : 'C Programming Problem Sets') + ' | ' + (SITE.courseShort || '');
    $('view').innerHTML = s ? detailView(s) : listView();
    if (s) {
      window.scrollTo(0, 0);
      if (focus) requestAnimationFrame(function () { var h = $('detail-title'); if (h) h.focus({ preventScroll: true }); });
    } else {
      updateResults();
      window.scrollTo(0, listScroll || 0);
    }
  }

  // ---- theme ----
  function setThemeButton() {
    var b = $('theme'); if (!b) return;
    var dark = state.theme === 'dark', label = dark ? 'Switch to light theme' : 'Switch to dark theme';
    b.innerHTML = dark ? I.sun : I.moon; b.setAttribute('aria-label', label); b.title = label;
  }
  function setTheme(t, persist) {
    state.theme = t; document.documentElement.setAttribute('data-theme', t);
    if (persist) { try { localStorage.setItem(THEME_KEY, t); } catch (e) {} }
    setThemeButton();
  }

  // ---- routing ----
  function syncFromHash() {
    var m = location.hash.match(/^#\/([\w-]+)/);
    var id = m && SETS.some(function (s) { return s.id === m[1]; }) ? m[1] : null;
    if (id !== state.selectedId) { state.selectedId = id; render(!!id); }
  }
  function open(id) { listScroll = window.scrollY; history.pushState(null, '', '#/' + id); state.selectedId = id; render(true); }
  function back() {
    if (!state.selectedId) { window.scrollTo(0, 0); return; }
    history.pushState(null, '', location.pathname + location.search); state.selectedId = null; render(false);
  }

  // ---- events ----
  root.addEventListener('click', function (e) {
    var el = e.target.closest('[data-open],[data-back],[data-clear],[data-jump],#theme,#f-clear');
    if (!el) return;
    if (el.id === 'theme') return setTheme(state.theme === 'dark' ? 'light' : 'dark', true);
    if (el.id === 'f-clear' || el.hasAttribute('data-clear')) {
      state.query = ''; state.topic = state.difficulty = state.type = 'all';
      var q = $('ps-search'); if (q) q.value = '';
      ['f-topic', 'f-diff', 'f-type'].forEach(function (id) { $(id).value = 'all'; });
      return updateResults();
    }
    e.preventDefault();
    if (el.hasAttribute('data-open')) open(el.getAttribute('data-open'));
    else if (el.hasAttribute('data-back')) back();
    else if (el.hasAttribute('data-jump')) { var t = $(el.getAttribute('data-jump')); if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 8 }); }
  });
  root.addEventListener('input', function (e) { if (e.target.id === 'ps-search') { state.query = e.target.value; updateResults(); } });
  root.addEventListener('change', function (e) {
    var map = { 'f-topic': 'topic', 'f-diff': 'difficulty', 'f-type': 'type', 'f-sort': 'sort' };
    if (map[e.target.id]) { state[map[e.target.id]] = e.target.value; updateResults(); }
  });
  window.addEventListener('popstate', syncFromHash);
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && state.selectedId && !/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) back(); });

  // ---- start ----
  var saved = null; try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
  shell();
  setTheme(saved === 'dark' ? 'dark' : 'light', false);
  var m0 = location.hash.match(/^#\/([\w-]+)/);
  state.selectedId = m0 && SETS.some(function (s) { return s.id === m0[1]; }) ? m0[1] : null;
  render(!!state.selectedId);
  checkFiles().then(function () { state.loading = false; render(!!state.selectedId); }, function () { state.loading = false; render(!!state.selectedId); });
})();
