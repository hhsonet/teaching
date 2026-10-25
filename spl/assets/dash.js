// Course dashboard, "v6" design. Structured Programming Language (CSE 1112).
(function () {
  var root = document.getElementById('app');
  var BASE = root.dataset.base || '';
  var CURRENT = Math.min(12, Math.max(1, parseInt(root.dataset.current, 10) || 1));
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
    ['Project', 10, 'Team project (CO4)', ['Teams of 3 students build a C program that solves a real-world scenario', 'The project uses structures, functions and file handling together', 'Team project in lecture 11']],
    ['Class Performance', 30, 'Base score, plus bonus for assignments and active participation', ['The base score is the best 2 of the 3 class tests (Class Test 01, 02 and 03)', 'Additional marks may be awarded for assignments and active participation in class activities']],
    ['Viva', 10, 'Oral assessment', ['Oral assessment']],
    ['Mid-Term Exam', 20, 'Covers lectures 1 to 5', ['Lecture 6', 'Covers lectures 1 to 5']],
    ['Final Exam', 20, 'Covers lectures 7 to 11', ['Lecture 12', 'Covers lectures 7 to 11']]
  ];
  var WHEN = ['Every class', 'Weekly', 'L11', 'L03 · L08 · L10', 'To be announced', 'L06', 'L12'];
  var TL = { topic: 'Lecture', due: 'Due', review: 'Review', project: 'Project', survey: 'Survey', exam: 'Exam', ct: 'Class test', log: 'Class log', admin: 'Overview' };
  var DESC = {
    'Review of ICS': 'Input and output, variables, operators and selection statements from Introduction to Computer Systems.',
    'Class Test 01': 'Covers lectures 1 and 2. Counts toward class performance (best 2 of 3 tests).',
    'Practice problems, lectures 1 to 4': 'Practice problems from lectures 1 to 4.',
    'Midterm exam': '20 marks. Covers lectures 1 to 5.',
    'Class Test 02': 'Counts toward class performance (best 2 of 3 tests).',
    'Class Test 03': 'Counts toward class performance (best 2 of 3 tests).',
    'Team project': 'Teams of 3 build a modular C program using structures, functions and file handling. 10 marks.',
    'Final exam': '20 marks. Covers lectures 7 to 11.'
  };
  var DETAILS = {
    1: 'Review of ICS: input and output, variables, operators, selection statements',
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

  // Counseling schedule. Add one entry per slot: { day, time, room, with }.
  var COUNSELING = [
    { day: 'To be announced', time: '', room: '', with: 'Hamudi Hasan Sonet' }
  ];

  var PAGES = {
    home: ['home', 'Home'], info: ['syllabus', 'Syllabus'], lectures: ['lectures', 'Lectures'], materials: ['materials', 'Materials'],
    team: ['teaching-team', 'Teaching Team'], project: ['project', 'Project']
  };
  var ALIAS = { overview: 'home', schedule: 'lectures', assessment: 'info', syllabus: 'info', staff: 'team', faculty: 'team', 'teaching-team': 'team' };

  var ICON = {
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
    info: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>',
    lectures: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>',
    materials: '<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>',
    team: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>'
  };
  var icon = function (k) { return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICON[k] + '</svg>'; };

  var SIDE_KEY = 'spl-v6-sidebar';
  var state = { page: 'home', lec: null, open: [0], filter: 'all', sidebar: true, drawer: false, lecList: true };
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
    if (m) { state.page = 'lecture'; state.lec = clamp(parseInt(m[1], 10)); return; }
    m = location.hash.match(/^#\/([\w-]+)/);
    var k = m ? (ALIAS[m[1]] || m[1]) : 'home';
    state.page = PAGES[k] ? k : 'home'; state.lec = null;
  }

  // ---- shell ----
  function sidebar() {
    var navKey = state.page === 'lecture' ? 'lectures' : state.page;
    var nav = ['home', 'info', 'lectures', 'materials', 'team'].map(function (k) {
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
      '<div class="stack g2"><div class="sec-label">Resources</div><a class="link-item" href="' + link('problem-sets') + '"><span>Problem sets</span></a><a class="link-item" href="' + link('code') + '"><span>Code</span></a></div>' +
      '<button class="reset who" data-act="go:team"><span class="avatar">HHS</span><span class="stack g2" style="min-width:0"><span class="n1">Hamudi Hasan Sonet</span><span class="n2">Course teacher</span></span></button>' +
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
      return '<div class="ch-row" data-i="' + i + '"><span class="ch-nm"><i style="background:' + SHADES[i] + '"></i>' + esc(p[0]) + '</span><span class="ch-bar"><b style="width:' + (p[1] / 30 * 100) + '%;background:' + SHADES[i] + '"></b></span><span class="ch-mk">' + p[1] + '</span></div>';
    }).join('');
    return '<div class="card ch-card"><div class="ch-head"><span class="k">Mark distribution</span><span class="mono" style="font-size:12px;color:#71717a">100 marks</span></div><div class="ch-stack" role="img" aria-label="Mark distribution">' + segs + '</div><div class="ch-rows">' + rows + '</div></div>';
  }

  var HOME_RESOURCES = [
    ['DOC', 'Syllabus', 'Course plan, marks and outcomes', '#info'],
    ['SET', 'Problem sets', 'Topic-wise C problems, with PDF', 'problem-sets'],
    ['C', 'Code', 'Example programs, one folder per lecture', 'code'],
    ['BOOK', 'Programming in ANSI C', 'E. Balagurusamy · 5th edition or later', ''],
    ['BOOK', 'Teach Yourself C', 'Herbert Schildt', ''],
    ['WEB', 'C reference', 'Language and library reference', 'https://en.cppreference.com/w/c'],
    ['WEB', 'GCC compiler', 'Download and install instructions', 'https://gcc.gnu.org/install/'],
    ['WEB', 'Online C compiler', 'Run code in the browser, no setup', 'https://www.onlinegdb.com/online_c_compiler']
  ];
  function homeResources() {
    return HOME_RESOURCES.map(function (r) {
      if (r[3] === '#info') return '<button class="reset mat" data-act="go:info"><span class="tag">' + r[0] + '</span><span class="stack g2" style="flex:1;min-width:0;text-align:left"><span class="t">' + esc(r[1]) + '</span><span class="s">' + esc(r[2]) + '</span></span><span class="go">→</span></button>';
      var href = !r[3] ? '' : /^https?:/.test(r[3]) ? r[3] : link(r[3]);
      var ext = /^https?:/.test(r[3]);
      return '<a class="mat' + (href ? '' : ' plain') + '" ' + (href ? 'href="' + esc(href) + '"' + (ext ? ' target="_blank" rel="noopener"' : '') : '') + '><span class="tag">' + r[0] + '</span><span class="stack g2" style="flex:1;min-width:0"><span class="t">' + esc(r[1]) + '</span><span class="s">' + esc(r[2]) + '</span></span><span class="go">' + (href ? (ext ? '↗' : '→') : '') + '</span></a>';
    }).join('');
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
      '<section class="hero"><div class="hero-in"><span class="pill"><i></i>CSE 1112 · Dept. of CSE · United International University</span><h1>Structured Programming Language</h1>' +
      '<p>A 12-session lab in structured C programming. We review the basics, then work through functions and loops, arrays, strings, structures and pointers, and finish with a team project. Marks are split across attendance, assignments, a project, class performance, viva and two exams, totaling 100.</p>' +
      '<div class="row wrap g8"><button class="reset btn btn-dark btn-lg" data-act="lec:' + c + '">Continue · Lecture ' + pad(c) + ' <span style="opacity:.6">→</span></button><button class="reset btn btn-out btn-lg" data-act="go:lectures">View schedule</button><a class="btn btn-out btn-lg noul" href="' + link('problem-sets') + '">Problem sets</a></div></div>' +
      '<div class="hero-stats"><div><span class="k">Progress</span><span class="big">' + pad(c) + '<span class="of"> / 12</span></span><span class="bar"><i style="width:' + (c / 12 * 100) + '%"></i></span></div>' +
      '<div><span class="k">This week</span><span class="big">' + h[0] + '</span><span class="k" style="font-weight:400">' + curUnit + '</span></div>' +
      '<div><span class="k">Next deadline</span><span class="big">Lecture ' + nd.n + '</span><span class="k" style="font-weight:400">' + esc(nd.label) + '</span></div>' +
      '<div><span class="k">Assessment</span><span class="big">100<span class="of"> marks</span></span><span class="k" style="font-weight:400">7 parts · midterm L06 · final L12</span></div></div></section>' +

      '<section class="stack g16"><h2 class="h2">General information</h2><div class="grid2">' +
      '<div class="card person-card"><span class="k">Course teacher</span><div class="row" style="gap:14px"><span class="av" style="width:44px;height:44px;font-size:14px">HHS</span><span class="stack g3" style="min-width:0"><span style="font-size:15px;font-weight:600;line-height:1.3;text-wrap:pretty">Hamudi Hasan Sonet</span><span class="muted" style="font-size:13px;line-height:1.4">Senior Programmer, United International University</span></span></div>' +
      '<div class="row wrap g8" style="margin-top:auto"><a class="btn btn-dark noul" href="mailto:sonet@admin.uiu.ac.bd"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex:none"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-10 5L2 7"></path></svg>sonet@admin.uiu.ac.bd</a><button class="reset btn btn-out" data-act="go:team">Teaching team</button></div></div>' +
      '<div class="card person-card"><span class="k">Reference books</span><div class="stack g12"><div class="row" style="gap:14px"><span class="book">C</span><span class="stack g3" style="min-width:0"><span style="font-size:15px;font-weight:600;line-height:1.3">Programming in ANSI C</span><span class="muted" style="font-size:13px">E. Balagurusamy · 5th edition or later</span></span></div>' +
      '<div class="row" style="gap:14px"><span class="book" style="background:#3f3f46">C</span><span class="stack g3" style="min-width:0"><span style="font-size:15px;font-weight:600;line-height:1.3">Teach Yourself C</span><span class="muted" style="font-size:13px">Herbert Schildt</span></span></div></div></div></div>' +
      '<div class="card hid"><div class="between" style="padding:14px 20px;border-bottom:1px solid #e4e4e7"><span style="font-size:14px;font-weight:600">Key dates</span><span class="mono muted" style="font-size:12px">12 lectures · 6 units</span></div>' +
      '<div class="dates"><button class="reset" data-act="lec:6"><span class="k">Midterm</span><span class="big">Lecture 06</span><span class="k" style="font-weight:400">20 marks · lectures 1 to 5</span></button>' +
      '<button class="reset" data-act="lec:11"><span class="k">Team project</span><span class="big">Lecture 11</span><span class="k" style="font-weight:400">10 marks</span></button>' +
      '<button class="reset" data-act="lec:12"><span class="k">Final</span><span class="big">Lecture 12</span><span class="k" style="font-weight:400">20 marks · lectures 7 to 11</span></button></div></div>' +
      '</section>' +

      '<div class="grid2 w"><section class="stack g16" style="min-width:0"><div class="between" style="align-items:baseline"><h2 class="h2">Upcoming lectures</h2><button class="reset link-more" data-act="go:lectures">All 12 →</button></div><div class="card tl-card"><div class="tl">' + upcoming + '</div></div></section>' +
      '<section class="stack g16" style="min-width:0"><div class="between" style="align-items:baseline"><h2 class="h2">Assessment</h2><button class="reset link-more" data-act="go:info">Full syllabus →</button></div>' + assessChart() + '</section></div>' +
      '<section class="stack g16"><div class="between" style="align-items:baseline"><h2 class="h2">Resources</h2><span class="muted" style="font-size:13px">Course pages, books and tools</span></div><div class="mats wrapt">' + homeResources() + '</div></section></div>';
  }

  var BOOKS = [['Programming in ANSI C', 'E. Balagurusamy · 5th edition or later'], ['Teach Yourself C', 'Herbert Schildt']];
  function info() {
    var rows = PARTS.map(function (p, i) {
      var open = state.open.indexOf(i) > -1;
      return '<div class="part' + (open ? ' open' : '') + '"><div class="trow cols-ev" data-act="acc:' + i + '"><span style="font-weight:500">' + p[0] + '</span>' +
        '<span class="marks"><b>' + pad(p[1]) + '</b><span class="bar"><i style="width:' + (p[1] / 30 * 100) + '%;background:' + SHADES[i] + '"></i></span></span><span style="color:#52525b;line-height:1.45">' + esc(p[2]) + '</span>' +
        '<span class="chev muted" style="text-align:center;transform:' + (open ? 'rotate(180deg)' : 'none') + '">⌄</span></div>' +
        (open ? '<div class="part-d cols-ev"><span></span><ul>' + p[3].map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul></div>' : '') + '</div>';
    }).join('');
    var cos = COS.map(function (c) { return '<tr><td class="c-ty">' + c[0] + '</td><td class="c-dt">' + esc(c[1]) + '</td></tr>'; }).join('');
    var plan = L.map(function (l, i) {
      var n = i + 1, exam = /Exam$/.test(l[0]);
      return '<tr class="plan-row" data-act="lec:' + n + '"><td class="c-n">' + n + '</td><td class="c-ty" style="font-weight:' + (exam ? 700 : 500) + '">' + l[0] + '</td><td class="c-dt">' + details(n) + '</td></tr>';
    }).join('');
    var books = BOOKS.map(function (b, i) { return '<tr><td class="c-n">' + (i + 1) + '</td><td class="c-ty">' + esc(b[0]) + '</td><td class="c-dt">' + esc(b[1]) + '</td></tr>'; }).join('');
    var sec = function (title, body) { return '<section class="stack g16"><h2 class="h2">' + title + '</h2>' + body + '</section>'; };
    var tbl = function (head, body) { return '<div class="card ta-wrap"><table class="ev-table" style="min-width:420px"><thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table></div>'; };
    return '<div class="stack g32"><div class="stack g8"><span class="eyebrow">CSE 1112 · Fall 2026</span><h1 class="h1">Syllabus</h1><p class="lede">Structured Programming Language Laboratory. A 12-session lab in structured C programming. Marks are split across attendance, assignments, a project, class performance, viva and two exams, totaling 100.</p></div>' +
      sec('At a glance', tbl('<th>Instructor</th><th>Email</th>', '<tr><td class="c-ty">Hamudi Hasan Sonet (HHS)</td><td class="c-dt"><a class="person-mail" href="mailto:sonet@admin.uiu.ac.bd">sonet@admin.uiu.ac.bd</a></td></tr>')) +
      sec('Reference books', tbl('<th>#</th><th>Book</th><th>Author</th>', books)) +
      sec('Course outcomes', tbl('<th>CO</th><th>Description</th>', cos)) +
      sec('Course plan', tbl('<th>Lecture</th><th>Topic</th><th>Details</th>', plan)) +
      sec('Assessment &amp; Evaluation Details', '<div class="card sx"><div class="tbl"><div class="thead cols-ev"><span>Assessment Types</span><span>Marks</span><span>Details</span><span></span></div>' + rows +
        '<div class="trow total cols-ev" style="border-bottom:0"><span>Total</span><span class="mono">100</span><span style="font-weight:400;color:#71717a">7 components</span><span></span></div></div></div>') +
      sec('Evaluation details', '<div class="grid2">' +
        '<div class="card pad stack g8"><span style="font-size:14px;font-weight:600">Class Performance</span><span style="font-size:14px;line-height:1.6;color:#52525b">Class Performance marks will be calculated based on the best 2 out of 3 class tests as the base. Additional marks may be awarded for assignments and active participation in class activities.</span></div>' +
        '<div class="card pad stack g8"><span style="font-size:14px;font-weight:600">Project</span><span style="font-size:14px;line-height:1.6;color:#52525b">Teams of 3 students build a C program that solves a real-world scenario. The project uses structures, functions and file handling together.</span></div></div>') + '</div>';
  }

  function details(n) {
    return esc(DETAILS[n]).replace(/(Class Test \d+( \([^)]*\))?)/g, '<strong>$1</strong>');
  }
  function lectures() {
    var rows = L.map(function (l, i) {
      var n = i + 1, st = status(n), exam = /Exam$/.test(l[0]);
      return '<div class="trow cols-lec clickable' + (state.filter === 'deadlines' && !isDl(l[1]) ? ' dim' : '') + '" style="' + (n === CURRENT ? 'background:#fafafa' : '') + '" data-act="lec:' + n + '"><span class="num">' + pad(n) + '</span><span style="font-weight:' + (exam ? 700 : 500) + '">' + l[0] + '</span>' +
        '<span style="color:#52525b;line-height:1.5">' + details(n) + '</span><span class="jstart">' + badge(st[0], st[1]) + '</span></div>';
    }).join('');
    var f = [['all', 'All'], ['deadlines', 'Deadlines']].map(function (x) { return '<button class="reset' + (state.filter === x[0] ? ' on' : '') + '" data-act="filter:' + x[0] + '">' + x[1] + '</button>'; }).join('');
    return '<div class="stack g24"><div class="between wrap" style="align-items:flex-end;gap:16px"><div class="stack g8"><h1 class="h1">Lectures</h1><p class="sub">12 lectures. Click one to open its page.</p></div><div class="seg">' + f + '</div></div>' +
      '<div class="card sx"><div style="min-width:600px"><div class="thead cols-lec"><span>Lecture</span><span>Topic</span><span>Details</span><span>Status</span></div>' + rows + '</div></div></div>';
  }

  var LECDATA = {
    1: {
      outcome: 'After this class you can write C programs that read input, calculate with operators and make decisions with selection statements.',
      before: [
        'Revise from ICS: variables, data types and operators.',
        'Set up a C compiler (GCC) and a code editor. Make sure you can compile and run hello world.',
        'Warm-up: what does printf("%d", 7 / 2); print? (Answer: 3)'
      ],
      steps: [
        { t: 'Input and output', d: 'printf prints values and scanf reads them. Add two numbers:',
          code: ['#include <stdio.h>', '', 'int main(void) {', '    int a, b;', '    scanf("%d %d", &a, &b);', '    printf("%d\\n", a + b);', '    return 0;', '}'], out: 'Input 3 4, output 7' },
        { t: 'Variables and operators', d: 'Declare a variable with a type, then use arithmetic and relational operators. Integer division drops the fraction and % gives the remainder:',
          code: ['int a = 7, b = 2;', 'printf("%d %d\\n", a / b, a % b);'], out: 'Output 3 1' },
        { t: 'Selection statements', d: 'if / else if / else and switch choose which code runs. Even or odd:',
          code: ['int n;', 'scanf("%d", &n);', 'if (n % 2 == 0)', '    printf("Even\\n");', 'else', '    printf("Odd\\n");'], out: 'Input 7, output Odd' },
        { t: 'Exercise', d: 'Solve problems 1 to 3 from the problem set, in order.' }
      ],
      mistakes: [
        'Using = instead of == in a condition.',
        'Forgetting & in scanf("%d", &n).',
        'Integer division: 7 / 2 is 3, not 3.5.'
      ],
      problems: [
        { level: 'Easy', when: 'In class', t: 'Sum of two numbers', d: 'Read two integers and print their sum.', ex: 'Input 3 4, output 7' },
        { level: 'Easy', when: 'In class', t: 'Even or odd', d: 'Read an integer and print Even or Odd.', ex: 'Input 7, output Odd' },
        { level: 'Easy', when: 'In class', t: 'Largest of three', d: 'Read three integers and print the largest.', ex: 'Input 4 19 7, output 19' },
        { level: 'Medium', when: 'After class', t: 'Seconds to time', d: 'Read a number of seconds and print the hours, minutes and seconds.', ex: 'Input 3725, output 1 2 5' },
        { level: 'Medium', when: 'After class', t: 'Grade', d: 'Read a score from 0 to 100 and print the grade: 80 and above A+, 70-79 A, 60-69 B, 50-59 C, 40-49 D, below 40 F.', ex: 'Input 73, output A' }
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
        'Finish problems 1 to 3 from class.',
        'Solve problems 4 and 5 on your own.',
        'Solutions are released after the deadline (to be announced).'
      ],
      assess: [
        'Attendance: full marks for attending 10 or more classes. 2 absences are ignored.',
        'Class performance: your work in class counts toward the 30 marks.',
        'Next class: Function & Loop.'
      ]
    }
  };

  var LEVEL_V = { Easy: 'secondary', Medium: 'outline', Hard: 'default' };

  function problemText(d, i) {
    var x = d.problems[i];
    return 'Problem ' + (i + 1) + ' (' + x.level + '): ' + x.t + '\n' + x.d + '\nExample: ' + x.ex;
  }
  function allProblemsText(n) {
    var d = LECDATA[n];
    return 'Structured Programming Language, Lecture ' + pad(n) + ' problem set\n\n' + d.problems.map(function (x, i) { return problemText(d, i); }).join('\n\n') + '\n';
  }

  function codeBlock(lines, out) {
    return '<pre class="code"><code>' + esc(lines.join('\n')) + '</code></pre>' + (out ? '<span class="code-out">' + esc(out) + '</span>' : '');
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
      return '<tr><td class="c-n">' + (i + 1) + '</td><td class="c-t">' + esc(x.t) + '</td><td class="c-d">' + esc(x.d) + '</td><td class="c-ex">' + esc(x.ex) + '</td>' +
        '<td>' + badge(x.level, LEVEL_V[x.level]) + '</td><td class="c-w">' + esc(x.when) + '</td><td><button type="button" class="reset btn btn-out sm" data-act="copy:' + n + ':' + i + '">Copy</button></td></tr>';
    }).join('');
    return '<section class="stack g12"><div class="between wrap" style="align-items:flex-end;gap:12px"><div class="stack g4"><h2 class="h2">Problem set</h2><span class="muted" style="font-size:13px">' + d.problems.length + ' problems. Share with classmates and the teaching team. <a href="' + link('problem-sets') + '">All problem sets →</a></span></div>' +
      '<div class="row wrap g8"><button class="reset btn btn-out" data-act="copyall:' + n + '">Copy all</button><button class="reset btn btn-out" data-act="dl:' + n + '">Download .txt</button><button class="reset btn btn-out" data-act="copylink:' + n + '">Copy link</button></div></div>' +
      '<div class="card prob-card"><div class="prob-wrap"><table class="prob-table"><thead><tr><th>#</th><th>Problem</th><th>Description</th><th>Example</th><th>Level</th><th>When</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div><span class="toast" id="toast" role="status"></span></div></section>';
  }
  function lectureTemplate(n, d) {
    var h = L[n - 1][0], st = status(n), u = UNIT_OF[h];
    var steps = d.steps.map(function (x, i) {
      return '<div class="step"><span class="step-n">' + (i + 1) + '</span><div class="stack g6" style="min-width:0"><span class="t">' + esc(x.t) + '</span><span class="d">' + esc(x.d) + '</span>' + (x.code ? codeBlock(x.code, x.out) : '') + '</div></div>';
    }).join('');
    var unit = u !== undefined ? 'Unit ' + (u + 1) + ' of 6 · ' + TOPICS[u][0] : '';
    return '<div class="stack g32"><div class="stack g12"><button class="reset back" data-act="go:lectures">← All lectures</button>' +
      '<div class="row g10"><span class="eyebrow">Lecture ' + pad(n) + ' of 12</span>' + badge(st[0], st[1]) + '</div><h1 class="h1">' + h + '</h1><p class="sub">' + esc(unit ? unit + ' · ' + DETAILS[n] : DETAILS[n]) + '</p></div>' +
      '<div class="callout"><span class="k">Outcome</span><p>' + esc(d.outcome) + '</p></div>' +
      listCard('Before class', 'About 5 minutes of work.', d.before) +
      '<section class="stack g12"><h2 class="h2">In class</h2><div class="card hid"><div class="steps">' + steps + '</div></div></section>' +
      problemSetCard(n, d) +
      listCard('Common mistakes', 'Watch for these.', d.mistakes) +
      resourcesCard(d.resources) +
      listCard('After class', '', d.after) +
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
    return '<div class="stack g32"><div class="between wrap" style="align-items:flex-end;gap:16px"><div class="stack g8"><h1 class="h1">Materials</h1><p class="sub">Slides, class notes and readings for every lecture.</p></div><span class="pill-count">' + (posted ? posted + ' files posted' : 'Nothing posted yet') + '</span></div>' +
      '<div class="card sx"><div class="tbl"><div class="thead cols-mat"><span>#</span><span>Topic</span><span>Slides</span><span>Notes</span><span>Readings</span></div>' + rows + '</div></div></div>';
  }

  function team() {
    var f = FACULTY[0];
    var ta = ASSISTANTS.map(function (t) {
      var name = t.linkedin ? '<a class="ta-link" href="' + esc(t.linkedin) + '" target="_blank" rel="noopener">' + esc(t.name) + '</a>' : '<span class="ta-link">' + esc(t.name) + '</span>';
      var mail = t.email ? '<a class="person-mail" href="mailto:' + esc(t.email) + '">' + esc(t.email) + '</a>' : '<span class="muted">—</span>';
      return '<tr><td>' + name + '</td><td>' + esc(t.designation) + '</td><td>' + mail + '</td></tr>';
    }).join('');
    return '<div class="stack g32"><div class="stack g8"><h1 class="h1">Teaching Team</h1><p class="sub">Faculty and teaching assistants for this course.</p></div>' +
      '<section class="stack g16"><h2 class="h2">Course teacher</h2><div class="card people"><div class="av" style="flex:none;min-width:56px;height:56px;padding:0 12px;border-radius:999px;font-size:15px">' + f.initials + '</div>' +
      '<div class="stack g6" style="min-width:0"><span style="font-size:16px;font-weight:600;letter-spacing:-.01em;line-height:1.3;text-wrap:pretty">' + esc(f.name) + '</span><span class="muted" style="font-size:14px;line-height:1.45;text-wrap:pretty">' + esc(f.title) + '</span>' +
      '<a class="person-mail" style="align-self:flex-start" href="mailto:' + esc(f.email) + '">' + esc(f.email) + '</a></div></div></section>' +
      '<section class="stack g16"><h2 class="h2">Counseling schedule</h2><div class="card ta-wrap"><table class="ev-table" style="min-width:460px"><thead><tr><th>Day</th><th>Time</th><th>Room</th><th>With</th></tr></thead><tbody>' + COUNSELING.map(function (c) {
        return '<tr><td class="c-ty">' + esc(c.day) + '</td><td class="c-dt">' + (c.time ? esc(c.time) : '<span class="muted">—</span>') + '</td><td class="c-dt">' + (c.room ? esc(c.room) : '<span class="muted">—</span>') + '</td><td class="c-dt">' + esc(c.with) + '</td></tr>';
      }).join('') + '</tbody></table></div></section>' +
      '<section class="stack g16"><h2 class="h2">Teaching assistants</h2><div class="card ta-wrap"><table class="ta-table"><thead><tr><th>Name</th><th>Designation</th><th>Email</th></tr></thead><tbody>' + ta + '</tbody></table></div></section></div>';
  }

  function stat(k, v, s) { return '<div><span class="k">' + k + '</span><span class="big">' + v + '</span><span class="k" style="font-weight:400">' + s + '</span></div>'; }
  function project() {
    var st = status(11);
    return '<div class="stack g36"><div class="stack g10"><span class="eyebrow">Assignment · 10 marks</span><h1 class="h1">Project</h1><p class="lede">A team project that applies structures, functions and file handling together in one modular C program.</p></div>' +
      '<div class="stats">' + stat('Marks', '10', 'of 100') + stat('Team size', '3', 'students') + stat('Lecture', 'L11', 'team project') + stat('Outcome', 'CO4', 'work in a team') + '</div>' +
      '<section class="stack g16"><h2 class="h2">Requirements</h2><ul class="bullets" style="gap:8px"><li>Teams of 3 students build a C program that solves a real-world scenario.</li><li>The project uses structures, functions and file handling together.</li><li>Organize the project using abstraction through structures.</li></ul></section>' +
      '<section class="soft between wrap" style="gap:16px"><div class="stack g4"><span style="font-size:14px;font-weight:500">Team project · Lecture 11</span><span class="muted" style="font-size:13px">A modular program using structures and functions, file.</span></div><div class="row g8">' + badge(st[0], st[1]) + '<button class="reset btn btn-dark" data-act="lec:11">Lecture 11 →</button></div></section></div>';
  }

  var VIEW = { home: home, info: info, lectures: lectures, lecture: lecture, materials: materials, team: team, project: project };

  function render() {
    document.body.style.overflow = state.drawer ? 'hidden' : '';
    root.innerHTML = '<div class="shell"><div class="scrim' + (state.drawer ? ' on' : '') + '" data-act="closeDrawer"></div>' + sidebar() +
      '<div class="frame">' + header() + '<main>' + VIEW[state.page]() + '</main>' +
      '<footer class="foot"><div><span>Structured Programming Language · CSE 1112 · United International University</span></div></footer></div></div>';
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
    else if (k === 'closeDrawer') { state.drawer = false; render(); }
    else if (k === 'toggleLecs') { state.lecList = !state.lecList; render(); }
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
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && state.drawer) { state.drawer = false; render(); } });
  window.addEventListener('resize', function () { if (state.drawer && !isMobile()) { state.drawer = false; render(); } });
  window.addEventListener('popstate', function () { parseHash(); render(); });
  parseHash();
  render();
})();
