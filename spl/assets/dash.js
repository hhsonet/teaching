// Course dashboard, "v6" design. Structured Programming Language (CSE 1112).
(function () {
  var root = document.getElementById('app');
  var BASE = root.dataset.base || '';
  var WEEKS = [];
  try { WEEKS = JSON.parse(root.dataset.weeks || '[]') || []; } catch (e) {}
  // Current lecture: the first lecture whose last class date is today or later. Lectures without dates are skipped.
  // After the last dated lecture it stays on that lecture. With no dates at all, current_lecture from _config.yml is used.
  function pickLecture(weeks, today, fallback) {
    var dated = weeks.filter(function (w) { return w.dates && w.dates.length; }).map(function (w) {
      return { n: parseInt(w.lecture, 10), last: w.dates.slice().sort().pop() };
    }).sort(function (a, b) { return a.n - b.n; });
    if (!dated.length) return fallback;
    for (var i = 0; i < dated.length; i++) if (dated[i].last >= today) return dated[i].n;
    return dated[dated.length - 1].n;
  }
  var now = new Date();
  var TODAY = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
  var CURRENT = Math.min(12, Math.max(1, pickLecture(WEEKS, TODAY, parseInt(root.dataset.current, 10) || 1)));
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // "Oct 27, 28" for a lecture's class dates, or '' when none are set.
  function classDates(n) {
    var w = WEEKS.filter(function (x) { return parseInt(x.lecture, 10) === n; })[0];
    if (!w || !w.dates || !w.dates.length) return '';
    var last = '';
    return w.dates.slice().sort().map(function (d) {
      var p = d.split('-'), m = MONTHS[parseInt(p[1], 10) - 1], day = parseInt(p[2], 10), out = (m === last ? '' : m + ' ') + day;
      last = m; return out;
    }).join(', ');
  }
  var GITHUB = root.dataset.github || '#';
  var TEACHING = BASE.replace(/\/[^\/]*$/, '/') || '/';

  var TV = { due: 'default', exam: 'destructive', ct: 'destructive', project: 'outline', survey: 'outline', review: 'secondary', log: 'secondary', admin: 'secondary' };
  var L = [
    ['Basics', [['Review of ICS', 'review']]],
    ['Function & Loop', []],
    ['Array', [['Class Test 01', 'ct']]],
    ['String', []],
    ['Review', [['Practice problems, lectures 1 to 4', 'review']]],
    ['Midterm Exam', [['Midterm exam', 'exam']]],
    ['Structure', []],
    ['Structure', [['Class Test 02', 'ct']]],
    ['Pointer', []],
    ['Pointer', [['Class Test 03', 'ct']]],
    ['Project', [['Team project', 'project']]],
    ['Final Exam', [['Final exam', 'exam']]]
  ];
  var TOPICS = [['Basics', 1, 1], ['Function & Loop', 2, 2], ['Array', 3, 3], ['String', 4, 4], ['Structure', 7, 8], ['Pointer', 9, 10]];
  var UNIT_OF = { Basics: 0, 'Function & Loop': 1, Array: 2, String: 3, Structure: 4, Pointer: 5 };
  var PARTS = [
    ['Attendance', 5, 'Full marks for attending 10 or more classes; 2 absences ignored', ['There are 12 classes in total', 'Full marks for attending 10 or more classes', '2 absences are ignored']],
    ['Assignment', 10, '10 weekly progress logs, 1 mark each', ['10 weekly progress logs', '1 mark for each log']],
    ['Project & Viva', 20, 'Team project with an individual viva (CO4)', ['Teams of 3 students build a C program that solves a real-world scenario', 'The project uses structures, functions and file handling together', 'Team project in lecture 11', 'Viva: each member explains their own component']],
    ['Class Performance', 25, 'Base score, plus bonus for assignments and active participation', ['The base score is the best 2 of the 3 class tests (Class Test 01, 02 and 03)', 'Additional marks may be awarded for assignments and active participation in class activities']],
    ['Mid-Term Exam', 20, 'Covers lectures 1 to 5', ['Lecture 6', 'Covers lectures 1 to 5']],
    ['Final Exam', 20, 'Covers lectures 7 to 11', ['Lecture 12', 'Covers lectures 7 to 11']]
  ];
  var WHEN = ['Every class', 'Weekly', 'L11', 'L03 · L08 · L10', 'L06', 'L12'];
  var TL = { topic: 'Lecture', due: 'Due', review: 'Review', project: 'Project', survey: 'Survey', exam: 'Exam', ct: 'Class test', log: 'Class log', admin: 'Overview' };
  var DESC = {
    'Review of ICS': 'Input and output, variables, operators, selection statements and loops from Introduction to Computer Systems.',
    'Class Test 01': 'Covers lectures 1 and 2. Counts toward class performance (best 2 of 3 tests).',
    'Practice problems, lectures 1 to 4': 'Practice problems from lectures 1 to 4.',
    'Midterm exam': '20 marks. Covers lectures 1 to 5.',
    'Class Test 02': 'Counts toward class performance (best 2 of 3 tests).',
    'Class Test 03': 'Counts toward class performance (best 2 of 3 tests).',
    'Team project': 'Teams of 3 build a modular C program using structures, functions and file handling. 20 marks with the viva.',
    'Final exam': '20 marks. Covers lectures 7 to 11.'
  };
  var DETAILS = {
    1: 'Review of ICS: input and output, variables, operators, selection statements, loop',
    2: 'Functions with parameters and return values; for, while and do-while loops',
    3: 'One- and two-dimensional arrays; passing arrays to functions. Class Test 01 (lectures 1 and 2)',
    4: 'Character arrays; string library functions such as strlen, strcpy and strcmp',
    5: 'Practice problems from lectures 1 to 4',
    6: 'Covers lectures 1 to 5',
    7: 'Declaring structures, accessing members, arrays of structures',
    8: 'Passing structures to functions; nested structures. Class Test 02',
    9: 'Pointer declaration, address and dereference operators',
    10: 'Pointers with arrays, strings and functions. Class Test 03',
    11: 'Team project: a modular program using structures and functions, file',
    12: 'Covers lectures 7 to 11'
  };
  // Per-lecture materials. Paste links here: slides (PDF / Google Slides), notes, and papers [title, url].
  var MATERIALS = {
    1: { slides: '', notes: '', papers: [] }
  };
  var COS = [['CO1', 'Describe the structured programming language features.'], ['CO2', 'Design, compile and execute software programs to solve basic to moderate problems using a popular IDE.'], ['CO3', 'Implementation of modular programs using different data structures like array, structures.'], ['CO4', 'Work in a team and organize a project using abstraction through structures.']];

  var FACULTY = [
    { initials: 'HHS', name: 'Hamudi Hasan Sonet', title: 'Senior Programmer, United International University', email: 'sonet@admin.uiu.ac.bd' }
  ];
  // Teaching assistants. linkedin: profile URL; name links to it when set.
  var ASSISTANTS = [
    { name: 'To be announced', designation: 'Teaching Assistant', email: '', linkedin: '' }
  ];

  // Counseling schedule. Hours are 8:30 AM to 4:30 PM. Add one entry per slot, times in 24-hour form:
  // { day: 'Sun', start: '10:00', end: '11:00', room: '405', with: 'Hamudi Hasan Sonet' }; add kind: 'class' for a class session
  var COUNSEL_START = 8.5, COUNSEL_END = 16.5, COUNSEL_DAYS = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed'];
  var COUNSELING = [
    { day: 'Sun', start: '10:00', end: '12:30', room: '525', with: 'Hamudi Hasan Sonet' },
    { day: 'Tue', start: '08:30', end: '11:00', room: '525', with: 'Hamudi Hasan Sonet' },
    { kind: 'class', day: 'Mon', start: '08:30', end: '11:00', room: '522', with: 'CSE 1112 (F)' },
    { kind: 'class', day: 'Tue', start: '14:00', end: '16:30', room: '523', with: 'CSE 1112 (O)' }
  ];

  var PAGES = {
    home: ['home', 'Home'], info: ['syllabus', 'Syllabus'], lectures: ['lectures', 'Lectures'], materials: ['materials', 'Materials'],
    team: ['teaching-team', 'Counseling'], project: ['project', 'Project']
  };
  var ALIAS = { overview: 'home', schedule: 'lectures', assessment: 'info', syllabus: 'info', staff: 'team', faculty: 'team', 'teaching-team': 'team' };

  var ICON = {
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
    info: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>',
    lectures: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>',
    materials: '<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>',
    project: '<path d="M12 2 2 7l10 5 10-5-10-5z"></path><path d="m2 17 10 5 10-5"></path><path d="m2 12 10 5 10-5"></path>',
    team: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>'
  };
  var icon = function (k) { return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICON[k] + '</svg>'; };

  var SIDE_KEY = 'spl-v6-sidebar';
  // Lectures with a page ready. Add a number here to make it clickable everywhere.
  var OPEN_LECTURES = [1];
  var state = { page: 'home', lec: null, open: [0], filter: 'all', sidebar: true, drawer: false, lecList: true, modal: null };
  try { if (localStorage.getItem(SIDE_KEY) === '0') state.sidebar = false; } catch (e) {}

  var isMobile = function () { return window.matchMedia('(max-width: 899px)').matches; };
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var clamp = function (n) { return Math.min(12, Math.max(1, n)); };
  var badge = function (t, v) { return '<span class="bd bd-' + v + '">' + esc(t) + '</span>'; };
  var link = function (path) { return BASE + '/' + path + '/'; };
  var status = function (n) { return n < CURRENT ? ['Done', 'secondary'] : n === CURRENT ? ['This week', 'default'] : ['Upcoming', 'outline']; };
  var isDl = function (items) { return items.some(function (it) { return /^(due|exam|ct)$/.test(it[1]); }); };
  var arrowLink = function (href, label, ext) { return '<a class="noul" href="' + href + '"><span>' + label + '</span><span class="arr">' + (ext ? '↗' : '→') + '</span></a>'; };
  var goBtn = function (page, label) { return '<button class="reset" data-act="go:' + page + '"><span>' + label + '</span><span class="arr">→</span></button>'; };

  // ---- routing ----
  function go(page, lec) {
    state.page = page; state.lec = lec || null; state.drawer = false;
    var h = lec ? '#/lecture/' + lec : '#/' + PAGES[page][0];
    if (location.hash !== h) history.pushState(null, '', h);
    render(); window.scrollTo(0, 0);
  }
  function parseHash() {
    var m = location.hash.match(/^#\/lecture\/(\d+)/);
    if (m) { var ln = clamp(parseInt(m[1], 10)); if (OPEN_LECTURES.indexOf(ln) > -1) { state.page = 'lecture'; state.lec = ln; return; } state.page = 'lectures'; return; }
    m = location.hash.match(/^#\/([\w-]+)/);
    var k = m ? (ALIAS[m[1]] || m[1]) : 'home';
    state.page = PAGES[k] ? k : 'home'; state.lec = null;
  }

  // ---- shell ----
  function sidebar() {
    var navKey = state.page === 'lecture' ? 'lectures' : state.page;
    var nav = ['home', 'info', 'lectures', 'materials', 'project', 'team'].map(function (k) {
      return '<button class="reset nav-item' + (navKey === k ? ' on' : '') + '" data-act="go:' + k + '">' + icon(k) + '<span>' + PAGES[k][1] + '</span></button>';
    }).join('');
    var lecs = state.lecList ? L.map(function (l, i) {
      var n = i + 1;
      return '<button class="reset lec-item' + (state.lec === n ? ' on' : '') + (n < CURRENT ? ' past' : '') + (n === CURRENT ? ' cur' : '') + '" data-act="lec:' + n + '"><span class="n">' + pad(n) + '</span><span class="h">' + l[0] + '</span><span class="dot"></span></button>';
    }).join('') : '';
    return '<aside class="side' + (state.drawer ? ' open' : '') + (state.sidebar ? '' : ' hidden') + '" id="side">' +
      '<button class="reset brand" data-act="go:home"><span class="logo">SPL</span><span class="stack g2" style="min-width:0"><span class="t1">Structured Programming</span><span class="t2">CSE 1112 · 100 marks</span></span></button>' +
      '<div class="stack g2"><div class="sec-label">Course</div>' + nav + '</div>' +
      '<div class="stack g2"><button class="reset sec-label sec-toggle" data-act="toggleLecs"><span>Lectures</span><span class="chev" style="transform:' + (state.lecList ? 'rotate(180deg)' : 'none') + '">⌄</span></button>' + lecs + '</div>' +
      '<div class="stack g2"><div class="sec-label">Assignments</div><button class="reset link-item' + (state.page === 'project' ? ' on' : '') + '" data-act="go:project">Project</button></div>' +
      '<div class="stack g2"><div class="sec-label">Resources</div><a class="link-item" href="https://drive.google.com/drive/folders/1tE0oCDc2jl17sWwwA08xo1x9ykkj9sIu?usp=drive_link" target="_blank" rel="noopener"><span>Problem sets</span></a><a class="link-item" href="' + GITHUB + '/code" target="_blank" rel="noopener"><span>Code</span></a></div>' +
      '<button class="reset who" data-act="go:team"><span class="avatar hhs">HHS</span><span class="stack g2" style="min-width:0"><span class="n1">Hamudi Hasan Sonet</span><span class="n2">Course teacher</span></span></button>' +
      '</aside>';
  }
  function header() {
    var crumb = state.page === 'lecture' ? 'Lecture ' + pad(state.lec) : PAGES[state.page][1];
    var title = state.sidebar ? 'Close sidebar' : 'Open sidebar';
    return '<header class="top"><div class="crumbs">' +
      '<button class="reset icon-btn" data-act="toggleSide" title="' + title + '" aria-label="' + title + '" aria-expanded="' + (isMobile() ? state.drawer : state.sidebar) + '" aria-controls="side"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg></button>' +
      '<span class="vr"></span><a href="' + TEACHING + '">Teaching</a><span class="sep">/</span>' +
      '<button class="reset" data-act="go:home" style="white-space:nowrap">SPL</button><span class="sep">/</span><span class="here">' + crumb + '</span></div>' +
      '<a class="btn btn-dark" href="' + GITHUB + '">GitHub</a></header>';
  }

  // ---- pages ----
  var SHADES = ['#7fa58d', '#7a96b8', '#9a8fbb', '#d2ac6b', '#c993a4', '#7db0b0', '#c9807b'];
  function assessChart() {
    var segs = PARTS.map(function (p, i) { return '<i data-i="' + i + '" title="' + esc(p[0]) + ' · ' + p[1] + '" style="flex:' + p[1] + ';background:' + SHADES[i] + '"></i>'; }).join('');
    var rows = PARTS.map(function (p, i) {
      return '<div class="ch-row" data-i="' + i + '"><span class="ch-nm"><i style="background:' + SHADES[i] + '"></i>' + esc(p[0]) + '</span><span class="ch-bar"><b style="width:' + (p[1] / 25 * 100) + '%;background:' + SHADES[i] + '"></b></span><span class="ch-mk">' + p[1] + '</span></div>';
    }).join('');
    return '<div class="card ch-card"><div class="ch-head"><span class="k">Mark distribution</span><span class="mono" style="font-size:12px;color:#71717a">100 marks</span></div><div class="ch-stack" role="img" aria-label="Mark distribution">' + segs + '</div><div class="ch-rows">' + rows + '</div></div>';
  }

  var HOME_RESOURCES = [
    ['DOC', 'Syllabus', 'Course plan, marks and outcomes', '#info'],
    ['SET', 'Problem sets', 'Topic-wise C problems, with PDF', 'https://drive.google.com/drive/folders/1tE0oCDc2jl17sWwwA08xo1x9ykkj9sIu?usp=drive_link'],
    ['C', 'Code', 'Example programs, one folder per lecture', GITHUB + '/code'],
    ['SLIDE', 'Super Simple C', 'Slide deck introducing C programming', 'https://docs.google.com/presentation/d/1cxrnU-0y0p0pd4w1PfB-6gL7NcBBKg1Q/edit?usp=drive_link'],
    ['BOOK', 'Programming in ANSI C', 'E. Balagurusamy · 5th edition or later', 'https://drive.google.com/file/d/1u0pgbXTC7BGAHU0Z-ncumaTCAC964hsq/view?usp=sharing'],
    ['BOOK', 'Teach Yourself C', 'Herbert Schildt', ''],
    ['WEB', 'C reference', 'Language and library reference', 'https://en.cppreference.com/w/c'],
    ['WEB', 'GCC compiler', 'Download and install instructions', 'https://gcc.gnu.org/install/'],
    ['WEB', 'Code::Blocks', 'Free C IDE, download the installer with GCC (mingw-setup)', 'https://www.codeblocks.org/downloads/binaries/'],
    ['WEB', 'Online C compiler', 'Run code in the browser, no setup', 'https://www.onlinegdb.com/online_c_compiler']
  ];
  function resCards(list) {
    return list.map(function (r) {
      if (r[3] === '#info') return '<button class="reset mat" data-act="go:info"><span class="tag">' + r[0] + '</span><span class="stack g2" style="flex:1;min-width:0;text-align:left"><span class="t">' + esc(r[1]) + '</span><span class="s">' + esc(r[2]) + '</span></span><span class="go">→</span></button>';
      var href = !r[3] ? '' : /^https?:/.test(r[3]) ? r[3] : link(r[3]);
      var ext = /^https?:/.test(r[3]);
      return '<a class="mat' + (href ? '' : ' plain') + '" ' + (href ? 'href="' + esc(href) + '"' + (ext ? ' target="_blank" rel="noopener"' : '') : '') + '><span class="tag">' + r[0] + '</span><span class="stack g2" style="flex:1;min-width:0"><span class="t">' + esc(r[1]) + '</span><span class="s">' + esc(r[2]) + '</span></span><span class="go">' + (href ? (ext ? '↗' : '→') : '') + '</span></a>';
    }).join('');
  }

  function homeResources() { return resCards(HOME_RESOURCES); }
  var pick = function (names) { return HOME_RESOURCES.filter(function (r) { return names.indexOf(r[1]) > -1; }); };

  // Decorative hero art: a small C source window and floating C symbols.
  function heroArt() {
    var k = function (t) { return '<span class="c-k">' + t + '</span>'; };
    var f = function (t) { return '<span class="c-f">' + t + '</span>'; };
    var st = function (t) { return '<span class="c-s">' + t + '</span>'; };
    var pp = function (t) { return '<span class="c-p">' + t + '</span>'; };
    var cm = function (t) { return '<span class="c-c">' + t + '</span>'; };
    var lines = [
      pp('#include') + ' &lt;stdio.h&gt;',
      '',
      k('int') + ' ' + f('main') + '(' + k('void') + ') {',
      '    ' + k('int') + ' x = <span class="c-n">42</span>;',
      '    ' + k('int') + ' *p = &amp;x;',
      '    ' + f('printf') + '(' + st('"%d\\n"') + ', *p);',
      '    ' + k('return') + ' <span class="c-n">0</span>;',
      '}'
    ];
    var chips = [['{ }', 'c1'], ['[ ]', 'c2'], ['*p', 'c3'], ['&amp;x', 'c4'], ['#', 'c5'], ['-&gt;', 'c6'], ['%d', 'c7'], [';', 'c8']];
    return '<div class="hero-art" aria-hidden="true"><div class="code-win"><div class="code-bar"><i></i><i></i><i></i><span>main.c</span></div><pre class="code-body">' +
      lines.map(function (l, i) { return '<span class="cl"><b>' + (i + 1) + '</b>' + l + '</span>'; }).join('') + '</pre></div>' +
      chips.map(function (c) { return '<span class="chipx ' + c[1] + '">' + c[0] + '</span>'; }).join('') + '</div>';
  }

  function home() {
    var c = CURRENT, h = L[c - 1], u = UNIT_OF[h[0]];
    var curUnit = u !== undefined ? 'Unit ' + (u + 1) + ' of 6 · ' + TOPICS[u][0] : c === 11 ? 'Team project' : 'Review and exams';
    var deadlines = [];
    L.forEach(function (l, i) { l[1].forEach(function (it) { if (/^(due|exam|ct)$/.test(it[1]) && i + 1 >= c) deadlines.push({ t: it[0].replace('Due · ', ''), n: pad(i + 1), ex: it[1] !== 'due' }); }); });
    var nd = deadlines[0] ? { n: deadlines[0].n, label: deadlines[0].t } : { n: '—', label: 'No deadlines left' };
    var upcoming = L.slice(c - 1, c + 3).map(function (l, i) {
      var n = c + i, now = n === c, last = n === Math.min(L.length, c + 3);
      var tags = l[1].filter(function (it) { return /^(due|exam|ct|project)$/.test(it[1]); }).map(function (it) { return badge(it[0], TV[it[1]]); }).join('');
      return '<button class="reset tl-item' + (now ? ' now' : '') + (last ? ' last' : '') + '" data-act="lec:' + n + '"><span class="tl-dot"></span>' +
        '<span class="stack g4" style="min-width:0"><span class="tl-top"><span class="mono tl-n">L' + pad(n) + '</span><span class="tl-t">' + l[0] + '</span>' + (now ? '<span class="tag-now">This week</span>' : '') + '</span>' +
        '<span class="tl-d">' + esc(DETAILS[n]) + '</span>' + (tags ? '<span class="badges">' + tags + '</span>' : '') + '</span></button>';
    }).join('');
    return '<div class="stack g40">' +
      '<section class="hero">' + heroArt() + '<div class="hero-in"><span class="pill"><i></i>CSE 1112 · Dept. of CSE · United International University</span><h1>Structured Programming Language</h1>' +
      '<p>A 12-session lab in structured C programming. You move from basics, functions and loops through arrays, strings, structures and pointers, and finish with a team project.</p>' +
      '<div class="row wrap g8"><button class="reset btn btn-dark btn-lg" data-act="lec:' + c + '">Continue · Lecture ' + pad(c) + ' <span style="opacity:.6">→</span></button><button class="reset btn btn-out btn-lg" data-act="go:lectures">View schedule</button><a class="btn btn-out btn-lg noul" href="' + link('problem-sets') + '">Problem sets</a></div></div>' +
      '<div class="hero-stats"><div><span class="k">Progress</span><span class="big">' + pad(c) + '<span class="of"> / 12</span></span><span class="bar"><i style="width:' + (c / 12 * 100) + '%"></i></span></div>' +
      '<div><span class="k">This week</span><span class="big">' + h[0] + '</span><span class="k" style="font-weight:400">' + curUnit + (classDates(c) ? ' · ' + classDates(c) : '') + '</span></div>' +
      '<div><span class="k">Next deadline</span><span class="big">Lecture ' + nd.n + '</span><span class="k" style="font-weight:400">' + esc(nd.label) + '</span></div>' +
      '<div><span class="k">Assessment</span><span class="big">100<span class="of"> marks</span></span><span class="k" style="font-weight:400">6 parts · midterm L06 · final L12</span></div></div></section>' +

      '<section class="stack g16"><h2 class="h2">General information</h2><div class="grid2">' +
      '<div class="card person-card"><span class="k">Course teacher</span><div class="row" style="gap:14px"><span class="av hhs" style="width:44px;height:44px;font-size:14px">HHS</span><span class="stack g3" style="min-width:0"><span style="font-size:15px;font-weight:600;line-height:1.3;text-wrap:pretty">Hamudi Hasan Sonet</span><span class="muted" style="font-size:13px;line-height:1.4">Senior Programmer, United International University</span></span></div>' +
      '<div class="row wrap g8" style="margin-top:auto"><a class="btn btn-dark noul" href="mailto:sonet@admin.uiu.ac.bd"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex:none"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-10 5L2 7"></path></svg>sonet@admin.uiu.ac.bd</a><button class="reset btn btn-out" data-act="go:team">Counseling</button></div></div>' +
      '<div class="card person-card"><span class="k">Reference books</span><div class="stack g12"><div class="row" style="gap:14px"><span class="book">C</span><span class="stack g3" style="min-width:0"><span style="font-size:15px;font-weight:600;line-height:1.3"><a class="noul" style="color:inherit" href="https://drive.google.com/file/d/1u0pgbXTC7BGAHU0Z-ncumaTCAC964hsq/view?usp=sharing" target="_blank" rel="noopener">Programming in ANSI C ↗</a></span><span class="muted" style="font-size:13px">E. Balagurusamy · 5th edition or later</span></span></div>' +
      '<div class="row" style="gap:14px"><span class="book" style="background:#3f3f46">C</span><span class="stack g3" style="min-width:0"><span style="font-size:15px;font-weight:600;line-height:1.3">Teach Yourself C</span><span class="muted" style="font-size:13px">Herbert Schildt</span></span></div></div></div></div>' +
      '<div class="card hid"><div class="between" style="padding:14px 20px;border-bottom:1px solid #e4e4e7"><span style="font-size:14px;font-weight:600">Key dates</span><span class="mono muted" style="font-size:12px">12 lectures · 6 units</span></div>' +
      '<div class="dates"><button class="reset" data-act="lec:6"><span class="k">Midterm</span><span class="big">Lecture 06</span><span class="k" style="font-weight:400">20 marks · lectures 1 to 5</span></button>' +
      '<button class="reset" data-act="lec:11"><span class="k">Team project & viva</span><span class="big">Lecture 11</span><span class="k" style="font-weight:400">20 marks</span></button>' +
      '<button class="reset" data-act="lec:12"><span class="k">Final</span><span class="big">Lecture 12</span><span class="k" style="font-weight:400">20 marks · lectures 7 to 11</span></button></div></div>' +
      '</section>' +

      '<div class="grid2 w"><section class="stack g16" style="min-width:0"><div class="between" style="align-items:baseline"><h2 class="h2">Upcoming lectures</h2><button class="reset link-more" data-act="go:lectures">All 12 →</button></div><div class="card tl-card"><div class="tl">' + upcoming + '</div></div></section>' +
      '<section class="stack g16" style="min-width:0"><div class="between" style="align-items:baseline"><h2 class="h2">Assessment</h2><button class="reset link-more" data-act="go:info">Full syllabus →</button></div>' + assessChart() + '</section></div>' +
      '<section class="stack g16"><div class="between" style="align-items:baseline"><h2 class="h2">Resources</h2><span class="muted" style="font-size:13px">Course pages, books and tools</span></div><div class="mats wrapt">' + homeResources() + '</div></section></div>';
  }

  // Grading scale. Check against the current UIU grading policy.
  var GRADES = [['90 to 100', 'A', '4.00'], ['86 to 89', 'A-', '3.67'], ['82 to 85', 'B+', '3.33'], ['78 to 81', 'B', '3.00'], ['74 to 77', 'B-', '2.67'], ['70 to 73', 'C+', '2.33'], ['66 to 69', 'C', '2.00'], ['62 to 65', 'C-', '1.67'], ['58 to 61', 'D+', '1.33'], ['55 to 57', 'D', '1.00'], ['Below 55', 'F', '0.00']];
  // Course policies. Edit the wording to match the course rules.
  var POLICIES = [
    ['Attendance', 'Attend at least 10 of the 12 classes for full attendance marks. 2 absences are ignored.'],
    ['Late work', 'Submit weekly progress logs and the project by the stated deadline. Late work may lose marks.'],
    ['Class tests', 'The best 2 of 3 class tests count. Missed tests are not retaken unless the instructor approves.'],
    ['Academic integrity', 'Write your own code. Copying code from classmates or online, or sharing yours, is plagiarism and is reported under university rules.'],
    ['Teamwork', 'Every team member must contribute to the project. Marks may differ between members.']
  ];
  // Course outcomes covered by each lecture, in lecture order. Check against the course outcome mapping.
  var LEC_CO = [['CO1', 'CO2'], ['CO1', 'CO2'], ['CO2', 'CO3'], ['CO2', 'CO3'], ['CO1', 'CO2'], ['CO1', 'CO2'], ['CO3'], ['CO3'], ['CO1', 'CO3'], ['CO1', 'CO3'], ['CO4'], ['CO2', 'CO3']];
  var TOOLS = [['GCC', 'C compiler used to build and run programs.'], ['Code editor or IDE', 'Write code, for example VS Code or Code::Blocks.'], ['Terminal', 'Compile and run programs from the command line.']];
  var DAYFULL = { Sat: 'Saturday', Sun: 'Sunday', Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday' };
  function counselRows() {
    return COUNSELING.filter(function (c) { return c.kind !== 'class'; }).map(function (c) {
      return '<div class="card cn-i"><span class="cn-d">' + c.day + '</span><span class="cn-b"><b>' + DAYFULL[c.day] + '</b><span>' + clock(hm(c.start)) + ' – ' + clock(hm(c.end)) + '</span></span>' + (c.room ? '<span class="cn-r">Room ' + esc(c.room) + '</span>' : '') + '</div>';
    }).join('');
  }
  var BOOKS = [['Programming in ANSI C', 'E. Balagurusamy · 5th edition or later', 'https://drive.google.com/file/d/1u0pgbXTC7BGAHU0Z-ncumaTCAC964hsq/view?usp=sharing'], ['Teach Yourself C', 'Herbert Schildt']];
  function assessTiles() {
    var segs = PARTS.map(function (p, i) { return '<i title="' + esc(p[0]) + ' · ' + p[1] + '" style="flex:' + p[1] + ';background:' + SHADES[i] + '"></i>'; }).join('');
    var tiles = PARTS.map(function (p, i) {
      return '<div class="at" role="button" tabindex="0" aria-label="' + esc(p[0]) + ' details" data-act="modal:' + i + '" style="--c:' + SHADES[i] + '"><div class="at-top"><span class="at-nm">' + esc(p[0]) + '</span><span class="at-mk">' + p[1] + '</span></div><div class="at-bar"><i style="width:' + (p[1] / 25 * 100) + '%"></i></div><div class="at-foot"><p>' + esc(p[2]) + '</p></div></div>';
    }).join('');
    return '<div class="card asm"><div class="asm-head"><span class="k">Total</span><span class="asm-tot"><b>100</b> marks · ' + PARTS.length + ' components</span></div><div class="asm-stack" role="img" aria-label="Mark distribution">' + segs + '</div><div class="asm-grid">' + tiles + '</div></div>';
  }
  function info() {
    var cos = COS.map(function (c) { return '<tr><td class="c-ty">' + c[0] + '</td><td class="c-dt">' + esc(c[1]) + '</td></tr>'; }).join('');
    var books = BOOKS.map(function (b, i) { return '<tr><td class="c-n">' + (i + 1) + '</td><td class="c-ty">' + (b[2] ? '<a href="' + esc(b[2]) + '" target="_blank" rel="noopener">' + esc(b[0]) + ' ↗</a>' : esc(b[0])) + '</td><td class="c-dt">' + esc(b[1]) + '</td></tr>'; }).join('');
    var sec = function (title, body) { return '<section class="stack g16"><h2 class="h2">' + title + '</h2>' + body + '</section>'; };
    var tbl = function (head, body) { return '<div class="card ta-wrap"><table class="ev-table" style="min-width:420px"><thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table></div>'; };
    return '<div class="stack g32"><div class="stack g8"><span class="eyebrow">CSE 1112 · Fall 2026</span><h1 class="h1">Syllabus</h1><p class="lede">A 12-session lab in structured C programming. You move from basics, functions and loops through arrays, strings, structures and pointers, and finish with a team project.</p></div>' +
      sec('Counseling hours', '<div class="cn-grid">' + counselRows() + '</div>') +
      sec('Prerequisites', tbl('<th>Course</th><th>Why it matters</th>', '<tr><td class="c-ty">Introduction to Computer Systems (ICS)</td><td class="c-dt">Lecture 1 builds on input and output, variables, operators, selection statements and loops from ICS.</td></tr>')) +
      sec('Course outcomes', '<div class="co-hint">' + COS.map(function (c) { return '<div><b>' + c[0] + '</b><span>' + esc(c[1]) + '</span></div>'; }).join('') + '</div>') +
      sec('Course plan', lecTable(true)) +
      sec('Assessment &amp; Evaluation Details', assessTiles()) +
      sec('Grading scale', '<div class="card gs">' + GRADES.map(function (g) { return '<div class="gs-i' + (g[1] === 'F' ? ' f' : '') + (['A', 'A-'].indexOf(g[1]) > -1 ? ' gold' : ['B+', 'B'].indexOf(g[1]) > -1 ? ' hi' : ['B-', 'C+', 'C'].indexOf(g[1]) > -1 ? ' yel' : '') + '"><b>' + g[1] + '</b><span class="gs-p">' + g[2] + '</span><span class="gs-r">' + g[0].replace(' to ', '–') + '</span></div>'; }).join('') + '</div>') +
      sec('Policies', tbl('<th>Policy</th><th>Details</th>', POLICIES.map(function (p) { return '<tr><td class="c-ty">' + esc(p[0]) + '</td><td class="c-dt">' + esc(p[1]) + '</td></tr>'; }).join(''))) +
      sec('Tools', tbl('<th>Tool</th><th>Use</th>', TOOLS.map(function (t) { return '<tr><td class="c-ty">' + esc(t[0]) + '</td><td class="c-dt">' + esc(t[1]) + '</td></tr>'; }).join(''))) +
      sec('Reference books', tbl('<th>#</th><th>Book</th><th>Author</th>', books)) + '</div>';
  }

  function details(n) {
    return esc(DETAILS[n]).replace(/(Class Test \d+( \([^)]*\))?)/g, '<strong>$1</strong>');
  }
  function lecTable(co) {
    var rows = L.map(function (l, i) {
      var n = i + 1, st = status(n), exam = /Exam$/.test(l[0]), open = OPEN_LECTURES.indexOf(n) > -1;
      return '<div class="trow cols-lec' + (co ? ' cols-co' : '') + (open ? ' clickable' : '') + (state.filter === 'deadlines' && !isDl(l[1]) ? ' dim' : '') + '" style="' + (n === CURRENT ? 'background:#fafafa' : '') + '"' + (open ? ' data-act="lec:' + n + '"' : '') + '><span class="num">' + pad(n) + '</span><span style="font-weight:' + (exam ? 700 : 500) + '">' + l[0] + '</span>' +
        '<span style="color:#52525b;line-height:1.5">' + details(n) + '</span>' + (co ? '<span class="co-tags">' + LEC_CO[i].map(function (c) { return '<b>' + c + '</b>'; }).join('') + '</span>' : '') + '<span class="jstart">' + badge(st[0], st[1]) + '</span></div>';
    }).join('');
    return '<div class="card sx"><div style="min-width:600px"><div class="thead cols-lec' + (co ? ' cols-co' : '') + '"><span>Lecture</span><span>Topic</span><span>Details</span>' + (co ? '<span>CO</span>' : '') + '<span>Status</span></div>' + rows + '</div></div>';
  }
  function lectures() {
    var f = [['all', 'All'], ['deadlines', 'Deadlines']].map(function (x) { return '<button class="reset' + (state.filter === x[0] ? ' on' : '') + '" data-act="filter:' + x[0] + '">' + x[1] + '</button>'; }).join('');
    return '<div class="stack g24"><div class="between wrap" style="align-items:flex-end;gap:16px"><div class="stack g8"><h1 class="h1">Lectures</h1><p class="sub">12 lectures. Click one to open its page.</p></div><div class="seg">' + f + '</div></div>' +
      lecTable() + '</div>';
  }

  var LECDATA = {
    1: {
      outcome: 'After this class you can write C programs with the basic structure, read and print values, calculate with operators, make decisions with selection statements and repeat work with loops.',
      before: [
        'Revise from ICS: variables, data types, operators and loops.',
        'Set up a C compiler (GCC) and a code editor. Make sure you can compile and run hello world.',
        'Warm-up: what does printf("%d", 7 / 2); print? (Answer: 3)'
      ],
      steps: [
        { t: 'Program structure', d: 'Every C program starts at main. Compile and run with gcc main.c -o main, then ./main.',
          code: ['#include <stdio.h>', '', 'int main(void)', '{', '    printf("Hello, World!\\n");', '    return 0;', '}'], out: 'Output Hello, World!' },
        { t: 'Variables and data types', d: 'Each type has a format specifier: int uses %d, float uses %f, double uses %lf in scanf and %f in printf, char uses %c.',
          code: ['int age = 20;', 'float price = 99.5f;', 'double pi = 3.14159;', 'char grade = \'A\';'] },
        { t: 'Input and output', d: 'printf prints values and scanf reads them. scanf needs the address of each variable, so put & before the variable name.',
          code: ['int age;', 'float height;', '', 'printf("Enter age and height: ");', 'scanf("%d %f", &age, &height);', 'printf("Age: %d, height: %.2f\\n", age, height);'], out: 'Input 20 1.75, output Age: 20, height: 1.75' },
        { t: 'Operators', d: 'Arithmetic: + - * / %. Relational: == != < > <= >=. Logical: && || !. Assignment: = += -=. Increment: ++ --. In C, true is 1 and false is 0. Integer division truncates: 7 / 2 gives 3.',
          code: ['int x = 7;', 'x += 2;', 'printf("%d %d\\n", 7 % 3, 5 > 3);   // 1 1', 'printf("%d\\n", (x > 0) && (x < 10));   // 1'], out: 'Output 1 1, then 1' },
        { t: 'Selection: if', d: 'Use if, else if and else for ranges:',
          code: ['if (marks >= 80) {', '    printf("A+\\n");', '} else if (marks >= 60) {', '    printf("A\\n");', '} else {', '    printf("Fail\\n");', '}'], out: 'Input 65, output A' },
        { t: 'Selection: switch', d: 'Use switch when one value is compared with several constants. Each case needs a break, or execution falls through to the next case:',
          code: ['switch (choice) {', '    case 1: printf("Add\\n"); break;', '    case 2: printf("View\\n"); break;', '    default: printf("Invalid choice\\n");', '}'], out: 'Input 2, output View' },
        { t: 'Loops', d: 'Use for when the number of repetitions is known, while when a condition controls the loop, and do-while when the body must run at least once.',
          code: ['for (int i = 1; i <= 5; i++) {', '    printf("%d ", i);', '}', '', 'int n = 3;', 'while (n > 0) {', '    printf("%d\\n", n);', '    n--;', '}', '', 'int x;', 'do {', '    scanf("%d", &x);', '} while (x < 0);'], out: 'Output 1 2 3 4 5, then 3 2 1' },
        { t: 'Type casting', d: 'When two integers are divided, C truncates the result. A cast converts one operand to another type first. Without the cast, total / count gives 3.',
          code: ['int total = 7, count = 2;', 'float average = (float)total / count;   // 3.5'], out: 'average is 3.5' },
        { t: 'The char type', d: 'A char stores one character as a small integer using the ASCII code. For example, \'A\' is 65, \'a\' is 97 and \'0\' is 48. When reading a char after a number with scanf, write scanf(" %c", &c); with a leading space to skip the newline left in the input.',
          code: ['char c = \'A\';', 'printf("%c %d\\n", c, c);   // prints: A 65'], out: 'Output A 65' },
        { t: 'Math functions and random numbers', d: 'Include <math.h> for mathematical functions and compile with gcc main.c -o main -lm. Include <stdlib.h> and <time.h> for random numbers. Seed the generator once, or the same sequence repeats on every run. rand() % n gives a value from 0 to n - 1. Add an offset to move the range.',
          code: ['#include <math.h>', '#include <stdlib.h>', '#include <time.h>', '', 'double r = sqrt(16.0);      // 4.0', 'double p = pow(2.0, 3.0);   // 8.0', '', 'srand(time(NULL));', 'int dice = rand() % 6 + 1;   // a number from 1 to 6'] },
        { t: 'Nested conditions', d: 'A condition can sit inside another condition. Keep nesting shallow. Where possible, combine conditions with && instead.',
          code: ['if (age >= 18) {', '    if (has_id) {', '        printf("Entry allowed\\n");', '    } else {', '        printf("Bring an ID\\n");', '    }', '} else {', '    printf("Entry not allowed\\n");', '}'] },
        { t: 'Exercise', d: 'Solve problems 1 to 3 from the problem set, in order.' }
      ],
      mistakes: [
        'Using = instead of == in a condition.',
        'Forgetting break in a switch case, so execution falls through.',
        'Forgetting & in scanf("%d", &n).',
        'Integer division: 7 / 2 is 3, not 3.5.'
      ],
      problems: [
        { topic: 'Input and output', level: 'Easy', when: 'In class', t: 'Sum of two numbers', d: 'Read two integers and print their sum.', ex: 'Input 3 4, output 7' },
        { topic: 'Selection', level: 'Easy', when: 'In class', t: 'Even or odd', d: 'Read an integer and print Even or Odd.', ex: 'Input 7, output Odd' },
        { topic: 'Selection', level: 'Easy', when: 'In class', t: 'Largest of three', d: 'Read three integers and print the largest.', ex: 'Input 4 19 7, output 19' },
        { topic: 'Operators', level: 'Medium', when: 'After class', t: 'Seconds to time', d: 'Read a number of seconds and print the hours, minutes and seconds.', ex: 'Input 3725, output 1 2 5' },
        { topic: 'Selection', level: 'Medium', when: 'After class', t: 'Grade', d: 'Read a score from 0 to 100 and print the grade: 80 and above A+, 70-79 A, 60-69 B, 50-59 C, 40-49 D, below 40 F.', ex: 'Input 73, output A' },
        { topic: 'Input and output', level: 'Medium', when: 'After class', t: 'Rectangle report', d: 'Read the length and width as decimals. Print the area and the perimeter with 2 decimal places.', ex: 'Input 4.5 2, output Area: 9.00 Perimeter: 13.00' },
        { topic: 'Input and output', level: 'Hard', when: 'After class', t: 'Bill split', d: 'Read a bill amount, a tip percentage and the number of people. Print the tip, the total and each person’s share, all with 2 decimal places.', ex: 'Input 120 10 4, output Tip: 12.00 Total: 132.00 Each: 33.00' },
        { topic: 'Operators', level: 'Medium', when: 'After class', t: 'Swap without a third variable', d: 'Read two integers and swap them using only arithmetic operators, then print them.', ex: 'Input 5 9, output 9 5' },
        { topic: 'Operators', level: 'Hard', when: 'After class', t: 'Three-digit analyser', d: 'Read a three-digit number. Using only / and %, print the sum of its digits and the number with its digits reversed. No loops.', ex: 'Input 482, output 14 284' },
        { topic: 'Selection', level: 'Medium', when: 'After class', t: 'Leap year', d: 'Read a year and print whether it is a leap year. A year is a leap year if it is divisible by 4, except years divisible by 100 that are not divisible by 400.', ex: 'Input 2024, output Leap year. Input 1900, output Not a leap year' },
        { topic: 'Selection', level: 'Hard', when: 'After class', t: 'Triangle type', d: 'Read three side lengths. Print Invalid if they cannot form a triangle. Otherwise print Equilateral, Isosceles or Scalene.', ex: 'Input 3 4 5, output Scalene. Input 2 2 5, output Invalid' },
        { topic: 'Switch', level: 'Medium', when: 'After class', t: 'Calculator', d: 'Read two numbers and an operator (+ - * /) and print the result using switch. Print an error message for division by zero or an unknown operator.', ex: 'Input 8 / 2, output 4. Input 8 / 0, output Cannot divide by zero' },
        { topic: 'Switch', level: 'Hard', when: 'After class', t: 'Days in a month', d: 'Read a month number and a year. Print the number of days in that month, using switch and handling leap years for February.', ex: 'Input 2 2024, output 29. Input 4 2023, output 30' },
        { topic: 'Loops', level: 'Medium', when: 'After class', t: 'Digits sum and reverse', d: 'Read a positive integer. Using a loop, print the sum of its digits and the number with its digits reversed.', ex: 'Input 1234, output 10 4321' },
        { topic: 'Loops', level: 'Hard', when: 'After class', t: 'Primes up to n', d: 'Read n and print every prime number from 2 up to n, separated by spaces.', ex: 'Input 20, output 2 3 5 7 11 13 17 19' },
        { topic: 'Type casting and char', level: 'Medium', when: 'After class', t: 'Average of three', d: 'Read three integers and print their average with 2 decimal places. Use a cast so the division is not truncated.', ex: 'Input 7 8 10, output 8.33' },
        { topic: 'Type casting and char', level: 'Hard', when: 'After class', t: 'Caesar shift', d: 'Read a lowercase letter and a shift k. Print the letter shifted forward by k places, wrapping from z back to a.', ex: 'Input y 3, output b' },
        { topic: 'Math and random', level: 'Medium', when: 'After class', t: 'Hypotenuse', d: 'Read the two legs of a right triangle and print the hypotenuse with 2 decimal places using sqrt and pow.', ex: 'Input 3 4, output 5.00' },
        { topic: 'Math and random', level: 'Hard', when: 'After class', t: 'Two dice', d: 'Roll two dice with rand() until their sum is 7. Print each roll and how many rolls it took. Seed the generator with srand(time(NULL)).', ex: 'Output varies, for example 3 + 5, 6 + 2, 4 + 3, Rolls: 3' },
        { topic: 'Nested conditions', level: 'Medium', when: 'After class', t: 'Ticket price', d: 'Read an age and whether the person is a student (1 or 0). The base price is 100. Under 5 is free, ages 5 to 17 pay 50, and ages 18 and over pay 100 with a 20% discount for students.', ex: 'Input 20 1, output 80' },
        { topic: 'Nested conditions', level: 'Hard', when: 'After class', t: 'Quadratic roots', d: 'Read a, b and c of a quadratic equation. Print the roots if they are real, or say there are no real roots. Handle a = 0 as a linear equation.', ex: 'Input 1 -3 2, output 1 2. Input 1 0 1, output No real roots' }
      ],
      resources: [
        { t: 'C reference', d: 'Language and library reference', href: 'https://en.cppreference.com/w/c' },
        { t: 'GCC compiler', d: 'Download and install instructions', href: 'https://gcc.gnu.org/install/' },
        { t: 'Online C compiler', d: 'Run code in the browser, no setup', href: 'https://www.onlinegdb.com/online_c_compiler' },
        { t: 'Lecture slides', d: 'To be announced' },
        { t: 'Starter code', d: 'To be announced' },
        { t: 'Textbook chapter', d: 'To be announced' }
      ],
      after: [
        'Read two integers and print their sum, difference, product and quotient.',
        'Read a number and print whether it is even or odd.',
        'Read a mark and print its letter grade using else if.',
        'Solutions are released after the deadline (to be announced).'
      ],
      assess: [
        'Attendance: full marks for attending 10 or more classes. 2 absences are ignored.',
        'Class performance: your work in class counts toward the 25 marks.',
        'Next class: Function & Loop.'
      ]
    }
  };

  var LEVEL_V = { Easy: 'secondary', Medium: 'outline', Hard: 'default' };

  function problemText(d, i) {
    var x = d.problems[i];
    return 'Problem ' + (i + 1) + ' (' + x.level + (x.topic ? ', ' + x.topic : '') + '): ' + x.t + '\n' + x.d + '\nExample: ' + x.ex;
  }
  function allProblemsText(n) {
    var d = LECDATA[n];
    return 'Structured Programming Language, Lecture ' + pad(n) + ' problem set\n\n' + d.problems.map(function (x, i) { return problemText(d, i); }).join('\n\n') + '\n';
  }

  // Small C highlighter. Tokens are escaped one by one, so the result is safe HTML.
  var C_KW = /^(int|float|double|char|void|long|short|unsigned|signed|const|static|struct|typedef|enum|if|else|switch|case|default|break|continue|for|while|do|return|sizeof)$/;
  function hlC(src) {
    var re = /(\/\/[^\n]*)|("(?:\\.|[^"\\])*")|('(?:\\.|[^'\\])*')|(#\s*\w+)|(<[a-z_.]+\.h>)|(\b\d+(?:\.\d+)?f?\b)|([A-Za-z_]\w*)(\s*\()?/g;
    var out = '', last = 0, m;
    while ((m = re.exec(src))) {
      out += esc(src.slice(last, m.index)); last = re.lastIndex;
      var t = m[0];
      if (m[1]) out += '<span class="c-c">' + esc(t) + '</span>';
      else if (m[2] || m[3]) out += '<span class="c-s">' + esc(t) + '</span>';
      else if (m[4] || m[5]) out += '<span class="c-p">' + esc(t) + '</span>';
      else if (m[6]) out += '<span class="c-n">' + esc(t) + '</span>';
      else if (m[7]) {
        if (C_KW.test(m[7])) out += '<span class="c-k">' + esc(t) + '</span>';
        else if (m[8]) out += '<span class="c-f">' + esc(m[7]) + '</span>' + esc(m[8]);
        else out += esc(t);
      }
    }
    return out + esc(src.slice(last));
  }
  function codeBlock(lines, out) {
    return '<div class="codebox"><div class="cb-bar"><span>C</span><button class="reset cb-copy" data-act="copycode">Copy</button></div><pre class="code"><code>' + hlC(lines.join('\n')) + '</code></pre>' +
      (out ? '<div class="cb-out"><span class="cb-lab">Output</span><span class="cb-val">' + esc(out) + '</span></div>' : '') + '</div>';
  }
  // Progress for a lecture page: ids of finished checklist items, kept in this browser only.
  function loadDone(n) { try { return JSON.parse(localStorage.getItem('spl-done-' + n) || '[]'); } catch (e) { return []; } }
  function saveDone(n, a) { try { localStorage.setItem('spl-done-' + n, JSON.stringify(a)); } catch (e) {} }
  function chkList(id, title, desc, items, done, warn) {
    return '<section class="stack g12 anchor" id="sec-' + id + '"><div class="stack g4"><h2 class="h2">' + title + '</h2>' + (desc ? '<span class="muted" style="font-size:13px">' + desc + '</span>' : '') + '</div><ul class="chk">' +
      items.map(function (x, i) {
        var key = id + i, on = done.indexOf(key) > -1;
        return '<li><button class="reset chk-item' + (on ? ' done' : '') + '" data-act="chk:' + key + '" aria-pressed="' + on + '"><span class="chk-box">' + (on ? '✓' : '') + '</span><span>' + esc(x) + '</span></button></li>';
      }).join('') + '</ul></section>';
  }
  function warnList(id, title, desc, items) {
    return '<section class="stack g12 anchor" id="sec-' + id + '"><div class="stack g4"><h2 class="h2">' + title + '</h2>' + (desc ? '<span class="muted" style="font-size:13px">' + desc + '</span>' : '') + '</div><div class="warns">' +
      items.map(function (x) { return '<div class="warn"><span class="warn-i">!</span><span>' + esc(x) + '</span></div>'; }).join('') + '</div></section>';
  }
  function listCard(title, desc, items) {
    return '<section class="stack g12"><div class="stack g4"><h2 class="h2">' + title + '</h2>' + (desc ? '<span class="muted" style="font-size:13px">' + desc + '</span>' : '') + '</div><ul class="bullets">' +
      items.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></section>';
  }
  function resourcesCard(list) {
    var rows = list.map(function (r) {
      var tag = r.href ? '↗' : '';
      return '<a class="mat' + (r.href ? '' : ' off') + '" ' + (r.href ? 'href="' + esc(r.href) + '" target="_blank" rel="noopener"' : '') + '><span class="tag">' + (r.href ? 'WEB' : 'SOON') + '</span><span class="stack g2" style="flex:1;min-width:0"><span class="t">' + esc(r.t) + '</span><span class="s">' + esc(r.d) + '</span></span><span class="go">' + tag + '</span></a>';
    }).join('');
    return '<section class="stack g12"><div class="stack g4"><h2 class="h2">Resources</h2><span class="muted" style="font-size:13px">Links and files for this class.</span></div><div class="mats">' + rows + '</div></section>';
  }
  function problemSetCard(n, d) {
    var rows = d.problems.map(function (x, i) {
      return '<tr><td class="c-n">' + (i + 1) + '</td><td class="c-t">' + esc(x.t) + (x.topic ? '<span class="c-tp">' + esc(x.topic) + '</span>' : '') + '</td><td class="c-d">' + esc(x.d) + '</td><td class="c-ex">' + esc(x.ex) + '</td>' +
        '<td>' + badge(x.level, LEVEL_V[x.level]) + '</td><td class="c-w">' + esc(x.when) + '</td><td><button type="button" class="reset btn btn-out sm" data-act="copy:' + n + ':' + i + '">Copy</button></td></tr>';
    }).join('');
    return '<section class="stack g12"><div class="between wrap" style="align-items:flex-end;gap:12px"><div class="stack g4"><h2 class="h2">Problem set</h2><span class="muted" style="font-size:13px">' + d.problems.length + ' problems. Share with classmates and the teaching team. <a href="' + link('problem-sets') + '">All problem sets →</a></span></div>' +
      '<div class="row wrap g8"><button class="reset btn btn-out" data-act="copyall:' + n + '">Copy all</button><button class="reset btn btn-out" data-act="dl:' + n + '">Download .txt</button><button class="reset btn btn-out" data-act="copylink:' + n + '">Copy link</button></div></div>' +
      '<div class="card prob-card"><div class="prob-wrap"><table class="prob-table"><thead><tr><th>#</th><th>Problem</th><th>Description</th><th>Example</th><th>Level</th><th>When</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div><span class="toast" id="toast" role="status"></span></div></section>';
  }
  function lectureTemplate(n, d) {
    var h = L[n - 1][0], st = status(n), u = UNIT_OF[h], done = loadDone(n);
    var steps = d.steps.map(function (x, i) {
      var key = 's' + i, on = done.indexOf(key) > -1;
      return '<div class="step' + (on ? ' done' : '') + '"><button class="reset step-n" data-act="chk:' + key + '" data-n="' + (i + 1) + '" aria-pressed="' + on + '" aria-label="Mark step ' + (i + 1) + ' as done" title="Mark as done">' + (on ? '✓' : (i + 1)) + '</button><div class="stack g6" style="min-width:0"><span class="t">' + esc(x.t) + '</span><span class="d">' + esc(x.d) + '</span>' + (x.code ? codeBlock(x.code, x.out) : '') + '</div></div>';
    }).join('');
    var unit = u !== undefined ? 'Unit ' + (u + 1) + ' of 6 · ' + TOPICS[u][0] : '';
    var nav = [['outcome', 'Outcome'], ['before', 'Before class'], ['class', 'In class'], ['practice', 'Practice'], ['mistakes', 'Mistakes'], ['resources', 'Resources'], ['after', 'After class']].map(function (x) {
      return '<button class="reset" data-act="jump:' + x[0] + '">' + x[1] + '</button>';
    }).join('');
    return '<div class="stack g32 lec-page" data-lec="' + n + '"><div class="stack g12"><button class="reset back" data-act="go:lectures">← All lectures</button>' +
      '<div class="row g10"><span class="eyebrow">Lecture ' + pad(n) + ' of 12</span>' + badge(st[0], st[1]) + '</div><h1 class="h1">' + h + '</h1><p class="sub">' + esc(unit ? unit + ' · ' + DETAILS[n] : DETAILS[n]) + '</p>' +
      '<div class="lec-meta"><span>' + d.steps.length + ' steps</span><span>' + d.problems.length + ' practice problems</span><span>' + d.before.length + ' warm-up tasks</span></div></div>' +
      '<nav class="lec-nav" aria-label="On this page">' + nav + '</nav>' +
      '<div class="callout anchor" id="sec-outcome"><span class="k">What you will be able to do</span><p>' + esc(d.outcome) + '</p></div>' +
      chkList('before', 'Before class', 'About 5 minutes of work.', d.before, done) +
      '<section class="stack g12 anchor" id="sec-class"><h2 class="h2">In class</h2><div class="card hid"><div class="steps">' + steps + '</div></div></section>' +
      '<div class="anchor" id="sec-practice">' + problemSetCard(n, d) + '</div>' +
      warnList('mistakes', 'Common mistakes', 'Watch for these.', d.mistakes) +
      '<div class="anchor" id="sec-resources">' + resourcesCard(d.resources) + '</div>' +
      chkList('after', 'After class', '', d.after, done) +
      listCard('Assessment', '', d.assess) + prevNext(n) + '</div>';
  }

  function toast(msg) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg; el.classList.add('on');
    setTimeout(function () { el.classList.remove('on'); }, 1800);
  }
  function copyText(text, msg) {
    var done = function () { toast(msg); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { toast('Copy failed'); });
    else toast('Copy not supported');
  }
  function download(name, text) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    a.download = name; document.body.appendChild(a); a.click(); a.remove();
  }


  function lecture() {
    if (LECDATA[state.lec]) return lectureTemplate(state.lec, LECDATA[state.lec]);
    var n = state.lec, h = L[n - 1][0], items = L[n - 1][1], u = UNIT_OF[h], st = status(n);
    var list = [{ t: DETAILS[n], desc: u !== undefined ? 'Topic: ' + TOPICS[u][0] : '', label: TL.topic, v: 'outline' }]
      .concat(items.map(function (it) { return { t: it[0], desc: DESC[it[0]] || '', label: TL[it[1]], v: TV[it[1]] }; }));
    var nextDue = n < 12 ? L[n][1].filter(function (it) { return /^(due|exam|ct)$/.test(it[1]); }).map(function (it) { return it[0]; }) : [];
    var prep = ['Bring your laptop with GCC and a code editor set up', 'Revise the previous lecture'].concat(nextDue.length ? ['Next lecture: ' + nextDue.join(', ')] : []);
    var unit = u !== undefined ? 'Unit ' + (u + 1) + ' of 6 · ' + TOPICS[u][0] : n === 11 ? 'Team project' : 'Review and exams';
    var m = MATERIALS[n] || {};
    var mat = function (tag, t, href, sub) { return '<a class="mat' + (href ? '' : ' off') + '" ' + (href ? 'href="' + esc(href) + '"' : '') + '><span class="tag">' + tag + '</span><span class="stack g2" style="flex:1;min-width:0"><span class="t">' + esc(t) + '</span><span class="s">' + (href ? sub : 'Not posted yet') + '</span></span><span class="go">' + (href ? '↗' : '') + '</span></a>'; };
    var papers = (m.papers || []).map(function (p) { return mat('PDF', p[0], p[1], 'Reading'); });
    var mats = [mat('PPT', 'Slides', m.slides, 'Lecture ' + pad(n)), mat('TXT', 'Class notes', m.notes, 'Lecture ' + pad(n))].concat(papers);
    var posted = (m.slides ? 1 : 0) + (m.notes ? 1 : 0) + papers.length;
    return '<div class="stack g32"><div class="stack g12"><button class="reset back" data-act="go:lectures">← All lectures</button>' +
      '<div class="row g10"><span class="eyebrow">Lecture ' + pad(n) + ' of 12</span>' + badge(st[0], st[1]) + '</div><h1 class="h1">' + h + '</h1><p class="sub">' + unit + '</p></div>' +
      '<section class="stack g12"><h2 class="h2">In this lecture</h2><div class="card hid">' + list.map(function (x) { return '<div class="item-row">' + badge(x.label, x.v) + '<div class="stack g3" style="min-width:0"><span class="t">' + esc(x.t) + '</span><span class="d">' + esc(x.desc) + '</span></div></div>'; }).join('') + '</div></section>' +
      '<section class="stack g12"><div class="between" style="align-items:baseline"><h2 class="h2">Materials</h2><span class="muted" style="font-size:13px">' + (posted ? posted + ' posted' : 'Nothing posted yet') + '</span></div><div class="mats">' + mats.join('') + '</div></section>' +
      '<section class="stack g12"><h2 class="h2">Prepare</h2><ul class="bullets">' + prep.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul></section>' + prevNext(n) + '</div>';
  }
  function prevNext(n) {
    return '<div class="pn"><button class="reset" style="opacity:' + (n > 1 ? 1 : .35) + '" data-act="lec:' + clamp(n - 1) + '"><span class="l1">← Previous</span><span class="l2">' + (n > 1 ? pad(n - 1) + ' · ' + L[n - 2][0] : 'Start') + '</span></button>' +
      '<button class="reset r" style="opacity:' + (n < 12 ? 1 : .35) + '" data-act="lec:' + clamp(n + 1) + '"><span class="l1">Next →</span><span class="l2">' + (n < 12 ? pad(n + 1) + ' · ' + L[n][0] : 'End') + '</span></button></div>';
  }

  function materials() {
    var posted = 0;
    var rows = L.map(function (l, i) {
      var n = i + 1, m = MATERIALS[n] || {}, papers = m.papers || [];
      posted += (m.slides ? 1 : 0) + (m.notes ? 1 : 0) + papers.length;
      var f = function (href, label) { return href ? '<a class="mchip" href="' + esc(href) + '">' + label + ' <span style="color:#a1a1aa">↗</span></a>' : '<span class="dash">—</span>'; };
      return '<div class="trow cols-mat" style="' + (n === CURRENT ? 'background:#fafafa' : '') + '"><span class="num">' + pad(n) + '</span><button class="reset" style="font-weight:500;justify-self:start" data-act="lec:' + n + '">' + l[0] + '</button>' +
        '<span class="row">' + f(m.slides, 'Slides') + '</span><span class="row">' + f(m.notes, 'Notes') + '</span>' +
        '<span class="row wrap g6" style="min-width:0">' + (papers.length ? papers.map(function (p) { return '<a class="pchip" href="' + esc(p[1]) + '" title="' + esc(p[0]) + '">' + esc(p[0]) + '</a>'; }).join('') : '<span class="dash">—</span>') + '</span></div>';
    }).join('');
    return '<div class="stack g32"><div class="between wrap" style="align-items:flex-end;gap:16px"><div class="stack g8"><h1 class="h1">Materials</h1><p class="sub">Course files, tools and links, plus slides, notes and readings for every lecture.</p></div><span class="pill-count">' + (posted ? posted + ' files posted' : 'Nothing posted yet') + '</span></div>' +
      '<section class="stack g16"><h2 class="h2">Course files</h2><div class="mats wrapt">' + resCards(pick(['Problem sets', 'Code', 'Super Simple C', 'Programming in ANSI C', 'Teach Yourself C'])) + '</div></section>' +
      '<section class="stack g16"><h2 class="h2">Tools &amp; references</h2><div class="mats wrapt">' + resCards(pick(['GCC compiler', 'Code::Blocks', 'Online C compiler', 'C reference'])) + '</div></section>' +
      '<section class="stack g16"><h2 class="h2">Lecture materials</h2><div class="card sx"><div class="tbl"><div class="thead cols-mat"><span>#</span><span>Topic</span><span>Slides</span><span>Notes</span><span>Readings</span></div>' + rows + '</div></div></section></div>';
  }

  function hm(t) { var p = t.split(':'); return parseInt(p[0], 10) + parseInt(p[1] || '0', 10) / 60; }
  function clock(h) {
    var m = Math.round((h % 1) * 60), hh = Math.floor(h), ap = hh >= 12 ? 'PM' : 'AM', h12 = hh % 12 || 12;
    return h12 + ':' + (m < 10 ? '0' : '') + m + ' ' + ap;
  }
  function counselingTimeline() {
    var span = COUNSEL_END - COUNSEL_START, ticks = [];
    for (var h = COUNSEL_START; h <= COUNSEL_END + 0.001; h += 1) ticks.push(h);
    var axis = '<div class="cs-row cs-axis"><span></span><div class="cs-track">' + ticks.map(function (h) {
      return '<span class="cs-tick" style="left:' + ((h - COUNSEL_START) / span * 100) + '%">' + clock(h).replace(' AM', '').replace(' PM', '') + '</span>';
    }).join('') + '</div></div>';
    var rows = COUNSEL_DAYS.map(function (d) {
      var bars = COUNSELING.filter(function (c) { return c.day === d; }).map(function (c) {
        var l = Math.max(0, hm(c.start) - COUNSEL_START), w = Math.min(span, hm(c.end) - COUNSEL_START) - l;
        var cls = c.kind === 'class', tip = (cls ? 'Class · ' : 'Counseling · ') + d + ' ' + clock(hm(c.start)) + ' – ' + clock(hm(c.end)) + (c.room ? ' · Room ' + c.room : '') + ' · ' + c.with;
        return '<span class="cs-slot' + (cls ? ' cs-class' : '') + '" title="' + esc(tip) + '" style="left:' + (l / span * 100) + '%;width:' + (w / span * 100) + '%"><b>' + clock(hm(c.start)).replace(/ [AP]M/, '') + '–' + clock(hm(c.end)).replace(/ [AP]M/, '') + '</b><i>' + (cls ? esc(c.with) + (c.room ? ' · ' + esc(c.room) : '') : (c.room ? 'Room #' + esc(c.room) : esc(c.with.split(' ')[0]))) + '</i></span>';
      }).join('');
      return '<div class="cs-row"><span class="cs-day">' + d + '</span><div class="cs-track">' + bars + '</div></div>';
    }).join('');
    return '<div class="card cs-card"><div class="between wrap" style="gap:8px"><span class="cs-legend"><span><i class="lg-class"></i>Class</span><span><i class="lg-couns"></i>Counseling</span></span><span class="cs-range mono">' + clock(COUNSEL_START) + ' – ' + clock(COUNSEL_END) + '</span></div>' +
      '<div class="cs-scroll"><div class="cs-grid">' + axis + rows + '</div></div>' +
      '' + '</div>';
  }

  function team() {
    var f = FACULTY[0];
    var ta = ASSISTANTS.map(function (t) {
      var name = t.linkedin ? '<a class="ta-link" href="' + esc(t.linkedin) + '" target="_blank" rel="noopener">' + esc(t.name) + '</a>' : '<span class="ta-link">' + esc(t.name) + '</span>';
      var mail = t.email ? '<a class="person-mail" href="mailto:' + esc(t.email) + '">' + esc(t.email) + '</a>' : '<span class="muted">—</span>';
      return '<tr><td>' + name + '</td><td>' + esc(t.designation) + '</td><td>' + mail + '</td></tr>';
    }).join('');
    return '<div class="stack g32"><div class="stack g8"><h1 class="h1">Teaching Team</h1><p class="sub">Faculty and teaching assistants for this course.</p></div>' +
      '<section class="stack g16"><h2 class="h2">Course teacher</h2><div class="card people"><div class="av hhs" style="flex:none;min-width:56px;height:56px;padding:0 12px;border-radius:999px;font-size:15px">' + f.initials + '</div>' +
      '<div class="stack g6" style="min-width:0"><span style="font-size:16px;font-weight:600;letter-spacing:-.01em;line-height:1.3;text-wrap:pretty">' + esc(f.name) + '</span><span class="muted" style="font-size:14px;line-height:1.45;text-wrap:pretty">' + esc(f.title) + '</span>' +
      '<a class="person-mail" style="align-self:flex-start" href="mailto:' + esc(f.email) + '">' + esc(f.email) + '</a></div></div></section>' +
      '<section class="stack g16"><h2 class="h2">Class &amp; counseling schedule</h2>' + counselingTimeline() + '</section>' +
      '<section class="stack g16"><h2 class="h2">Teaching assistants</h2><div class="card ta-wrap"><table class="ta-table"><thead><tr><th>Name</th><th>Designation</th><th>Email</th></tr></thead><tbody>' + ta + '</tbody></table></div></section></div>';
  }

  function stat(k, v, s) { return '<div><span class="k">' + k + '</span><span class="big">' + v + '</span><span class="k" style="font-weight:400">' + s + '</span></div>'; }
  // Project guidelines. Edit the text here; the project page and its marks table are built from these lists.
  var PROJECT = {
    intro: 'Teams of three students design and build a C program that addresses a practical, real-world scenario. The project integrates structures, functions and file handling in a single application.',
    facts: [
      ['Team size', 'Three students per team. Submit one set of files listing all three names.'],
      ['Scenario', 'A practical problem that involves records to be stored, searched and updated.'],
      ['Schedule', 'Team formation and scenario approval by class 5, before the midterm. Design in week 10. Implementation, submission and demonstration in week 11.']
    ],
    scenarios: [
      ['Hostel room allocation', 'Rooms, residents, bed assignments and vacancy reports, with allocations saved to a file'],
      ['Campus lost and found', 'Reported items, finder and owner details, claim status, and search by category or date'],
      ['Community tool library', 'Neighbours borrow tools such as drills and ladders, with due dates, late fees and damage notes'],
      ['Farm harvest and market tracker', 'Crop records, yield per plot, selling prices by week, and profit or loss per crop'],
      ['Prepaid electricity meter billing', 'Customer accounts, meter readings, units consumed, bill calculation and payment history'],
      ['Courier parcel tracker', 'Parcels, sender and receiver records, status updates along the route, and delivery reports'],
      ['Canteen meal-plan ledger', 'Prepaid student balances, meal purchases, top-ups and a monthly spending summary']
    ],
    scenarioNote: 'Teams may propose an alternative scenario. It must be approved before development begins.',
    requirements: [
      ['Structures', 'At least two struct types, one nested within the other, and an array of structs to hold the records.'],
      ['Functions', 'At least eight functions, each with a single responsibility. Use parameters and return values, and include at least one function that modifies data through a pointer parameter.'],
      ['File handling', 'Read and write at least one file using fopen, fclose, and either fprintf and fscanf or fwrite and fread. Stored data must persist between program executions.'],
      ['Menu-driven interface', 'A main menu, presented in a loop, with options such as add, view, update, delete, search and save.'],
      ['Input validation and error handling', 'Invalid input is rejected, and file-open failures are reported without terminating the program unexpectedly.']
    ],
    modules: 'Organise the implementation into modules, for example a main program file, a records module and a file-handling module, each with a corresponding header file.',
    roles: [
      ['Member 1', 'Data structures', 'Defines the structs and implements the add, update and delete functions.'],
      ['Member 2', 'File handling', 'Implements the load and save functions and prepares the sample data file.'],
      ['Member 3', 'Interface and testing', 'Implements the menu, designs the test cases and leads the report.']
    ],
    rolesNote: 'Each member is assigned a primary responsibility, which also supports CO4. All members review the final code together before submission.',
    deliverables: [
      'Source code (.c and .h files), with a header comment and a comment for every function',
      'A sample data file, with representative test input and the expected output',
      'A project report of 2 to 4 pages, covering the scenario, the structures and functions, compilation and execution instructions, and a table of individual contributions',
      'A demonstration in week 11, in which each member explains their own component'
    ],
    rubric: [
      ['Working menu and features', 3], ['Correct use of structures', 3], ['Modular functions', 3], ['File handling and data persistence', 3],
      ['Code style, comments and input validation', 1], ['Report', 2], ['Viva: individual explanation of each member\u2019s component', 5]
    ],
    rules: [
      'All code must be the team\u2019s own work. Copied code, whether from other teams or external sources, receives zero marks.',
      'Each member must be able to explain and modify their own component during the viva. Individual viva marks depend on this.'
    ]
  };

  function project() {
    var P = PROJECT, st = status(11), total = P.rubric.reduce(function (t, r) { return t + r[1]; }, 0);
    var sec = function (t, body) { return '<section class="stack g16"><h2 class="h2">' + t + '</h2>' + body + '</section>'; };
    var facts = P.facts.map(function (f) { return '<div class="card pj-card"><span class="k">' + esc(f[0]) + '</span><span class="pj-t">' + esc(f[1]) + '</span></div>'; }).join('');
    var scen = P.scenarios.map(function (c, i) { return '<div class="card pj-card"><span class="pj-n mono">' + pad(i + 1) + '</span><b class="pj-h">' + esc(c[0]) + '</b><span class="pj-t">' + esc(c[1]) + '</span></div>'; }).join('');
    var reqs = P.requirements.map(function (r, i) { return '<li><span class="pj-no mono">' + (i + 1) + '</span><span class="stack g3" style="min-width:0"><b>' + esc(r[0]) + '</b><span class="pj-t">' + esc(r[1]) + '</span></span></li>'; }).join('');
    var roles = P.roles.map(function (r, i) { return '<div class="card pj-card" style="--c:' + SHADES[i * 2] + '"><span class="k">' + esc(r[0]) + '</span><b class="pj-h">' + esc(r[1]) + '</b><span class="pj-t">' + esc(r[2]) + '</span></div>'; }).join('');
    var R = 42, C = 2 * Math.PI * R, acc = 0;
    var arcs = P.rubric.map(function (r, i) {
      var len = r[1] / total * C, el = '<circle data-i="' + i + '" data-m="' + r[1] + '" data-n="' + esc(r[0].split(':')[0]) + '" cx="60" cy="60" r="' + R + '" fill="none" stroke="' + SHADES[i % 7] + '" stroke-width="14" stroke-dasharray="' + Math.max(0, len - 2).toFixed(2) + ' ' + (C - Math.max(0, len - 2)).toFixed(2) + '" stroke-dashoffset="' + (-acc).toFixed(2) + '"><title>' + esc(r[0]) + ' · ' + r[1] + '</title></circle>';
      acc += len; return el;
    }).join('');
    var donut = '<div class="pj-donut"><svg viewBox="0 0 120 120" role="img" aria-label="Mark distribution"><g transform="rotate(-90 60 60)">' + arcs + '</g></svg><div class="pj-donut-c" data-m="' + total + '" data-n="marks"><b>' + total + '</b><span>marks</span></div></div>';
    var legend = '<ul class="pj-leg">' + P.rubric.map(function (r, i) { return '<li data-i="' + i + '" data-m="' + r[1] + '" data-n="' + esc(r[0].split(':')[0]) + '"><i style="background:' + SHADES[i % 7] + '"></i><span>' + esc(r[0]) + '</span><b class="mono">' + r[1] + '</b></li>'; }).join('') + '</ul>';
    var rubric = donut + legend;
    return '<div class="stack g36"><div class="stack g10"><span class="eyebrow">Assignment · ' + total + ' marks</span><h1 class="h1">Project</h1><p class="lede">' + esc(P.intro) + '</p></div>' +
      '<div class="stats">' + stat('Marks', String(total), 'including a 5-mark viva') + stat('Team size', '3', 'students') + stat('Approval', 'Class 5', 'team and scenario') + stat('Submit', 'Week 11', 'demo and viva') + '</div>' +
      sec('Overview', '<div class="pj-grid">' + facts + '</div>') +
      sec('Scenario options', '<div class="pj-grid">' + scen + '</div><p class="muted" style="font-size:13px;margin:0">' + esc(P.scenarioNote) + '</p>') +
      sec('Technical requirements', '<div class="card"><ol class="pj-req">' + reqs + '</ol></div><p class="muted" style="font-size:13px;margin:0">' + esc(P.modules) + '</p>') +
      sec('Team roles', '<div class="pj-grid">' + roles + '</div><p class="muted" style="font-size:13px;margin:0">' + esc(P.rolesNote) + '</p>') +
      sec('Deliverables', '<ul class="bullets" style="gap:8px">' + P.deliverables.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul>') +
      sec('Assessment (' + total + ' marks)', '<div class="card pj-score">' + rubric + '</div>') +
      sec('Rules', '<ul class="bullets" style="gap:8px">' + P.rules.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul>') +
      '<section class="soft between wrap" style="gap:16px"><div class="stack g4"><span style="font-size:14px;font-weight:500">Team project · Lecture 11</span><span class="muted" style="font-size:13px">A modular program using structures, functions and file handling.</span></div><div class="row g8">' + badge(st[0], st[1]) + '</div></section></div>';
  }

  var VIEW = { home: home, info: info, lectures: lectures, lecture: lecture, materials: materials, team: team, project: project };

  function modal() {
    if (state.modal === null) return '';
    var p = PARTS[state.modal], i = state.modal;
    return '<div class="mdl-scrim" data-act="scrim"><div class="mdl" role="dialog" aria-modal="true" aria-label="' + esc(p[0]) + '" style="--c:' + SHADES[i] + '">' +
      '<button class="reset mdl-x" data-act="closeModal" aria-label="Close"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>' +
      '<span class="ev-k">' + p[1] + ' marks · ' + esc(WHEN[i]) + '</span><h3 class="mdl-t">' + esc(p[0]) + '</h3><p class="mdl-s">' + esc(p[2]) + '</p>' +
      '<ul>' + p[3].map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul></div></div>';
  }

  function render() {
    document.body.style.overflow = state.drawer || state.modal !== null ? 'hidden' : '';
    root.innerHTML = '<div class="shell"><div class="scrim' + (state.drawer ? ' on' : '') + '" data-act="closeDrawer"></div>' + sidebar() +
      '<div class="frame">' + header() + '<main>' + VIEW[state.page]() + '</main>' +
      '<footer class="foot"><div><span>Structured Programming Language · CSE 1112 · United International University</span></div></footer></div></div>' + modal();
    root.querySelectorAll('[data-act^="lec:"]').forEach(function (el) {
      if (OPEN_LECTURES.indexOf(parseInt(el.getAttribute('data-act').slice(4), 10)) > -1) return;
      el.removeAttribute('data-act'); el.setAttribute('data-locked', ''); el.setAttribute('aria-disabled', 'true');
      if (el.tagName === 'BUTTON') el.disabled = true;
    });
    document.title = (state.page === 'lecture' ? 'Lecture ' + pad(state.lec) : PAGES[state.page][1]) + ' | SPL';
  }

  root.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el) return;
    var a = el.getAttribute('data-act'), i = a.indexOf(':'), k = i < 0 ? a : a.slice(0, i), v = i < 0 ? '' : a.slice(i + 1);
    if (k === 'go') go(v);
    else if (k === 'lec') go('lecture', clamp(parseInt(v, 10)));
    else if (k === 'filter') { state.filter = v; render(); }
    else if (k === 'acc') { var n = parseInt(v, 10), p = state.open.indexOf(n); if (p > -1) state.open.splice(p, 1); else state.open.push(n); render(); }
    else if (k === 'copy') { var q = v.split(':'); copyText(problemText(LECDATA[q[0]], parseInt(q[1], 10)), 'Problem copied'); }
    else if (k === 'copyall') copyText(allProblemsText(v), 'Problem set copied');
    else if (k === 'copylink') copyText(location.href.split('#')[0] + '#/lecture/' + v, 'Link copied');
    else if (k === 'dl') download('spl-lecture-' + pad(parseInt(v, 10)) + '-problem-set.txt', allProblemsText(v));
    else if (k === 'toggleSide') {
      if (isMobile()) state.drawer = !state.drawer;
      else { state.sidebar = !state.sidebar; try { localStorage.setItem(SIDE_KEY, state.sidebar ? '1' : '0'); } catch (x) {} }
      render();
    }
    else if (k === 'chk') {
      var page = el.closest('.lec-page'), ln = page ? parseInt(page.getAttribute('data-lec'), 10) : state.lec, arr = loadDone(ln), at = arr.indexOf(v), on = at < 0;
      if (on) arr.push(v); else arr.splice(at, 1);
      saveDone(ln, arr);
      el.classList.toggle('done', on); el.setAttribute('aria-pressed', on);
      var stepEl = el.closest('.step'); if (stepEl) { stepEl.classList.toggle('done', on); el.textContent = on ? '✓' : el.getAttribute('data-n'); }
      var box = el.querySelector('.chk-box'); if (box) box.textContent = on ? '✓' : '';
    }
    else if (k === 'jump') { var tg = document.getElementById('sec-' + v); if (tg) tg.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); }
    else if (k === 'copycode') { var cb = el.closest('.codebox'); copyText(cb.querySelector('code').textContent, 'Code copied'); }
    else if (k === 'modal') { state.modal = parseInt(v, 10); render(); }
    else if (k === 'scrim') { if (e.target === el) { state.modal = null; render(); } }
    else if (k === 'closeModal') { state.modal = null; render(); }
    else if (k === 'closeDrawer') { state.drawer = false; render(); }
    else if (k === 'toggleLecs') { state.lecList = !state.lecList; render(); }
  });
  // Project marks donut: hover an arc or a legend row to enlarge it and show its marks in the centre.
  function donutHl(card, el) {
    var c = card.querySelector('.pj-donut-c'), src = el || c;
    card.classList.toggle('hl', !!el);
    card.querySelectorAll('[data-i]').forEach(function (x) { x.classList.toggle('is-hl', !!el && x.getAttribute('data-i') === el.getAttribute('data-i')); });
    c.querySelector('b').textContent = src.getAttribute('data-m');
    c.querySelector('span').textContent = el ? el.getAttribute('data-n') : 'marks';
    c.classList.toggle('on', !!el);
  }
  root.addEventListener('mouseover', function (e) {
    var card = e.target.closest('.pj-score'); if (!card) return;
    donutHl(card, e.target.closest('[data-i]'));
  });
  root.addEventListener('mouseout', function (e) {
    var card = e.target.closest('.pj-score');
    if (card && !(e.relatedTarget && card.contains(e.relatedTarget))) donutHl(card, null);
  });
  // Assessment chart: hover a segment or row to highlight it and dim the rest.
  function chartHl(card, idx) {
    card.classList.toggle('hl', idx !== null);
    card.querySelectorAll('[data-i]').forEach(function (el) { el.classList.toggle('is-hl', idx !== null && el.getAttribute('data-i') === idx); });
  }
  root.addEventListener('mouseover', function (e) {
    var card = e.target.closest('.ch-card'); if (!card) return;
    var it = e.target.closest('[data-i]');
    chartHl(card, it ? it.getAttribute('data-i') : null);
  });
  root.addEventListener('mouseout', function (e) {
    var card = e.target.closest('.ch-card');
    if (card && !(e.relatedTarget && card.contains(e.relatedTarget))) chartHl(card, null);
  });
  window.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('at')) { e.preventDefault(); e.target.click(); return; }if (e.key === 'Escape' && state.modal !== null) { state.modal = null; render(); } else if (e.key === 'Escape' && state.drawer) { state.drawer = false; render(); } });
  window.addEventListener('resize', function () { if (state.drawer && !isMobile()) { state.drawer = false; render(); } });
  window.addEventListener('popstate', function () { parseHash(); render(); });
  parseHash();
  render();
})();
