// Course dashboard. Details for this course are still to be announced.
(function () {
  var root = document.getElementById('app');
  var BASE = root.dataset.base || '';
  var CURRENT = Math.min(12, Math.max(1, parseInt(root.dataset.current, 10) || 1));
  var GITHUB = root.dataset.github || '#';

  var TV = { due: 'default', exam: 'destructive', ct: 'destructive', project: 'outline', survey: 'outline', review: 'secondary', log: 'secondary', admin: 'secondary' };
  var L = [
    ['Review', [['Review: ICS, Loop and Basic Function', 'review']]],
    ['Function & Loop', []],
    ['Array', [['CT 01', 'ct']]],
    ['String', []],
    ['Review', [['Review of mid-term topics', 'review']]],
    ['Midterm', [['Midterm exam', 'exam']]],
    ['Structure', []],
    ['Structure', [['CT 02', 'ct']]],
    ['Pointer', []],
    ['Pointer', [['CT 03', 'ct']]],
    ['Project', [['Project presentation', 'project']]],
    ['Final', [['Final exam', 'exam']]]
  ];
  var TOPICS = [['Function & Loop', '', 2, 2], ['Array', '', 3, 3], ['String', '', 4, 4], ['Structure', '', 7, 8], ['Pointer', '', 9, 10]];
  var PARTS = [
    ['Attendance', 10, 'Marks for being present in class', ['There are 12 classes in total', 'Present in 10 classes: 5 marks']],
    ['Class performance', 30, 'Details to be announced', ['Details to be announced']],
    ['Home assignment', 10, 'Details to be announced', ['Details to be announced']],
    ['Project', 10, 'Details to be announced', ['Details to be announced']],
    ['Mid-term', 15, 'Details to be announced', ['Details to be announced']],
    ['Final exam', 25, 'Details to be announced', ['Details to be announced']]
  ];
  var AGENDA = [['Review on ICS', '', '—'], ['Loop', '', '—'], ['Basic function', '', '—']];
  var TABS = [['overview', 'Overview', ''], ['schedule', 'Schedule', '12'], ['assessment', 'Assessment', '100'], ['first', 'Lecture 1', 'L01']];
  var UNIT_OF = { 'Function & Loop': [0], Array: [1], String: [2], Structure: [3], Pointer: [4] };
  var TL = { topic: 'Lecture', due: 'Due', review: 'Review', project: 'Project', survey: 'Survey', exam: 'Exam', ct: 'Class test', log: 'Class log', admin: 'Overview' };
  var DESC = {
    'Review: ICS, Loop and Basic Function': 'Review of Introduction to Computer Systems, Loop and basic functions.',
    'CT 01': 'Class test on Array.',
    'Review of mid-term topics': 'Review before the mid-term.',
    'Midterm exam': '15 marks. Covers the topics up to class 5.',
    'CT 02': 'Class test on Structure.',
    'CT 03': 'Class test.',
    'Project presentation': 'Present your project.',
    'Final exam': '25 marks. Covers the whole course.'
  };
  var LOG_FIELDS = [['learned', 'What I learned', 'Key ideas from today…'], ['todo', 'What to do', 'Readings, code, submissions…'], ['questions', 'Questions to ask', 'Anything unclear…']];
  var LOG_KEY = 'spl-classlog';
  var SIDE_KEY = 'spl-sidebar';

  var state = { route: 'overview', lec: null, sel: null, open: [1], filter: 'all', sidebar: true, drawer: false, lecList: true, logs: {} };
  try { state.logs = JSON.parse(localStorage.getItem(LOG_KEY) || '{}'); } catch (e) {}
  try { if (localStorage.getItem(SIDE_KEY) === '0') state.sidebar = false; } catch (e) {}

  var isMobile = function () { return window.matchMedia('(max-width: 899px)').matches; };
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var clamp = function (n) { return Math.min(12, Math.max(1, n)); };
  var badge = function (t, v) { return '<span class="badge b-' + v + '">' + esc(t) + '</span>'; };
  var cur = function () { return state.sel != null ? state.sel : CURRENT; };
  var status = function (n) { var c = cur(); return n < c ? ['Done', 'secondary'] : n === c ? ['Current', 'default'] : ['Upcoming', 'outline']; };
  var statusBadge = function (n) { var s = status(n); return badge(s[0] === 'Current' ? 'This week' : s[0], s[1]); };
  var link = function (path) { return BASE + '/' + path + '/'; };

  function go(route, lec) {
    state.route = route; state.lec = lec || null; state.drawer = false;
    var h = lec ? '#/lecture/' + lec : '#/' + route;
    if (location.hash !== h) history.pushState(null, '', h);
    render(); window.scrollTo(0, 0);
  }
  function parseHash() {
    var m = location.hash.match(/^#\/lecture\/(\d+)/);
    if (m) { state.route = 'lecture'; state.lec = clamp(parseInt(m[1], 10)); return; }
    m = location.hash.match(/^#\/(overview|schedule|assessment|teaching-team|staff)/);
    state.route = m ? (m[1] === 'staff' ? 'teaching-team' : m[1]) : 'overview'; state.lec = null;
  }

  function sidebar() {
    var nav = TABS.map(function (t) {
      var on = t[0] === 'first' ? state.lec === 1 : state.route === t[0] && !state.lec;
      return '<button class="item' + (on ? ' on' : '') + '" data-act="' + (t[0] === 'first' ? 'lec:1' : 'tab:' + t[0]) + '"><span>' + t[1] + '</span><span class="hint">' + t[2] + '</span></button>';
    }).join('');
    var lecs = state.lecList ? L.map(function (l, i) {
      var n = i + 1, c = cur();
      return '<button class="item lec' + (state.lec === n ? ' on' : '') + (n < c ? ' past' : '') + (n === c ? ' cur' : '') + '" data-act="lec:' + n + '"><span class="n">' + pad(n) + '</span><span class="t">' + l[0] + '</span><span class="dot"></span></button>';
    }).join('') : '';
    return '<aside class="side' + (state.drawer ? ' open' : '') + (state.sidebar ? '' : ' collapsed') + '" id="side">' +
      '<div class="brand"><div class="logo">SPL</div><div class="stack g2" style="min-width:0"><span style="font-size:14px;font-weight:600;line-height:1.2">SPL</span><span class="muted" style="font-size:12px;line-height:1.2">Laboratory</span></div></div>' +
      '<div class="stack g2"><div class="sec-label">Course</div>' + nav + '</div>' +
      '<div class="stack g2"><button class="sec-label sec-toggle" data-act="toggleLecs"><span>Lectures</span><span style="display:inline-block;transition:transform .2s;transform:' + (state.lecList ? 'rotate(180deg)' : 'none') + '">⌄</span></button>' + lecs + '</div>' +
      '<div class="stack g2"><div class="sec-label">Resources</div>' +
      '<a class="item" href="' + link('syllabus') + '">Syllabus</a><a class="item" href="' + link('problem-sets') + '">Problem sets</a><a class="item" href="' + link('code') + '">Code</a></div>' +
      '<button class="who" data-act="tab:teaching-team"><div class="avatar">HHS</div><div class="stack g2" style="min-width:0"><span style="font-size:13px;font-weight:500;line-height:1.25">Hamudi Hasan Sonet</span><span class="muted" style="font-size:12px;line-height:1.2">Instructor</span></div></button>' +
      '</aside>';
  }

  function header() {
    var label = state.lec ? 'Lecture ' + pad(state.lec) : state.route === 'teaching-team' ? 'Teaching Team' : TABS.filter(function (t) { return t[0] === state.route; })[0][1];
    var title = state.sidebar ? 'Close sidebar' : 'Open sidebar';
    return '<header class="top"><div class="crumbs">' +
      '<button class="icon-btn" data-act="toggleSide" title="' + title + '" aria-label="' + title + '" aria-expanded="' + (isMobile() ? state.drawer : state.sidebar) + '" aria-controls="side"><svg class="ic-panel" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg><svg class="ic-burger" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg></button>' +
      '<span class="vr"></span><button data-act="tab:overview" style="white-space:nowrap">SPL</button><span class="sep">/</span>' +
      (state.lec ? '<button data-act="tab:schedule">Lectures</button><span class="sep">/</span>' : '') +
      '<span class="here">' + label + '</span></div>' +
      '<div class="row-between" style="gap:8px"><div class="stepper"><button class="arr" data-act="step:-1" aria-label="Previous lecture">‹</button>' +
      '<button class="mid" data-act="lec:' + (state.lec || cur()) + '" title="Open lecture page">Lecture <span class="mono">' + pad(state.lec || cur()) + '</span></button>' +
      '<button class="arr" data-act="step:1" aria-label="Next lecture">›</button></div>' +
      '<a class="btn-dark" href="' + GITHUB + '">GitHub</a></div></header>';
  }

  function tabsRow() {
    return '<div class="tabs">' + TABS.map(function (t) {
      var on = t[0] !== 'first' && state.route === t[0];
      return '<button class="' + (on ? 'on' : '') + '" data-act="' + (t[0] === 'first' ? 'lec:1' : 'tab:' + t[0]) + '">' + t[1] + '</button>';
    }).join('') + '</div>';
  }

  function overview() {
    var c = cur(), pct = Math.round(c / 12 * 100), h = L[c - 1];
    var deadlines = [];
    L.forEach(function (l, i) { l[1].forEach(function (it) { if ((/^(due|exam|ct)$/.test(it[1])) && i + 1 >= c) deadlines.push([it[0].replace('Due · ', ''), pad(i + 1)]); }); });
    var topics = TOPICS.map(function (t) {
      var set = t[2] != null, st = !set ? ['Upcoming', 'outline'] : c > t[3] ? ['Completed', 'secondary'] : c >= t[2] ? ['In progress', 'default'] : ['Upcoming', 'outline'];
      return '<div class="list-row"><div class="stack g2" style="min-width:0"><span class="label">' + t[0] + '</span><span class="sub">' + (t[1] ? t[1] + ' · ' : '') + (set ? 'L' + pad(t[2]) + '–L' + pad(t[3]) : 'Lectures to be announced') + '</span></div>' + badge(st[0], st[1]) + '</div>';
    }).join('');
    var dist = PARTS.map(function (p) {
      return '<div class="dist"><span class="nm">' + p[0] + '</span><div class="bar"><div style="width:' + (p[1] / 30 * 100) + '%;transition:none"></div></div><span class="mk">' + p[1] + '</span></div>';
    }).join('');
    return '<div class="stack g24"><div class="stack g6"><h1 class="page-title">Structured Programming Language</h1>' +
      '<p class="lede">Hands-on lab sessions in structured programming: writing, testing and debugging programs step by step. Reference book: <strong>ANSI C</strong>.</p></div>' + tabsRow() +
      '<div class="stack g16"><div class="grid3">' +
      '<div class="card pad"><div class="row-between"><span class="label">Progress</span><span class="mono muted" style="font-size:12px">' + pct + '%</span></div><div class="big">' + pad(c) + '<span class="of"> / 12</span></div><div class="bar"><div style="width:' + pct + '%"></div></div></div>' +
      '<div class="card pad"><div class="row-between"><button class="label" data-act="lec:' + c + '">This lecture →</button>' + statusBadge(c) + '</div><div class="big">' + h[0] + '</div><div class="badges">' + h[1].map(function (it) { return badge(it[0], TV[it[1]]); }).join('') + '</div></div>' +
      '<div class="card pad"><span class="label">Upcoming deadlines</span><div class="stack" style="gap:10px">' + deadlines.slice(0, 4).map(function (d) { return '<div class="deadline"><span>' + d[0] + '</span><span class="l">L' + d[1] + '</span></div>'; }).join('') + '</div></div></div>' +
      '<div class="grid2"><div class="card"><div class="card-h"><span class="card-title">Topics</span><span class="card-desc">Five units, in teaching order.</span></div><div class="card-b stack">' + topics + '</div></div>' +
      '<div class="card"><div class="card-h row"><div class="stack g6"><span class="card-title">Mark distribution</span><span class="card-desc">100 marks across six parts.</span></div><button class="btn-out" data-act="tab:assessment">Details</button></div><div class="stack g16" style="padding:12px 24px 24px;gap:14px">' + dist + '</div></div></div>' +
      '</div></div>';
  }

  function schedule() {
    var isDl = function (items) { return items.some(function (it) { return /^(due|exam|ct)$/.test(it[1]); }); };
    var rows = L.map(function (l, i) {
      var n = i + 1;
      return '<div class="tr' + (n === cur() ? ' cur' : '') + (state.filter === 'deadlines' && !isDl(l[1]) ? ' dim' : '') + '" data-act="lec:' + n + '"><span class="num">' + pad(n) + '</span><span class="hd">' + l[0] + '</span><div class="badges">' + l[1].map(function (it) { return badge(it[0], TV[it[1]]); }).join('') + '</div><span class="st">' + statusBadge(n) + '</span></div>';
    }).join('');
    var f = [['all', 'All'], ['deadlines', 'Deadlines']].map(function (x) { return '<button class="' + (state.filter === x[0] ? 'on' : '') + '" data-act="filter:' + x[0] + '">' + x[1] + '</button>'; }).join('');
    return '<div class="stack g24"><div class="stack g6"><h1 class="page-title">Structured Programming Language</h1></div>' + tabsRow() +
      '<div class="card" style="overflow:hidden"><div class="sched-h"><div class="stack g4"><span class="card-title">Lecture schedule</span><span class="card-desc">Click a row to open its lecture page.</span></div><div class="seg">' + f + '</div></div>' +
      '<div class="tbl"><div><div class="tr head"><span>#</span><span>Topic</span><span>Activities</span><span>Status</span></div>' + rows + '</div></div></div></div>';
  }

  function assessment() {
    var any = state.open.length > 0;
    var segs = PARTS.map(function (p, i) { return '<div data-act="acc:' + i + '" title="' + esc(p[0]) + ' · ' + p[1] + '" style="flex:' + p[1] + ';background:' + (!any || state.open.indexOf(i) > -1 ? '#18181b' : '#e4e4e7') + '"></div>'; }).join('');
    var accs = PARTS.map(function (p, i) {
      var open = state.open.indexOf(i) > -1;
      return '<div class="acc' + (open ? ' open' : '') + '"><button data-act="acc:' + i + '"><span class="stack g2" style="flex:1;min-width:0"><span class="nm">' + p[0] + '</span><span class="sm">' + p[2] + '</span></span><span class="mk">' + p[1] + '</span><span class="chev">⌄</span></button>' +
        (open ? '<ul>' + p[3].map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul>' : '') + '</div>';
    }).join('');
    return '<div class="stack g24"><div class="stack g6"><h1 class="page-title">Structured Programming Language</h1></div>' + tabsRow() +
      '<div class="card"><div class="card-h" style="padding-bottom:16px;gap:16px"><div class="stack g4"><span class="card-title">Assessment</span><span class="card-desc">100 marks total. Expand a part for requirements.</span></div><div class="segbar">' + segs + '</div></div>' +
      '<div style="padding:0 24px 8px">' + accs + '<div class="acc-total"><span>Total</span><span class="mono" style="margin-right:28px">100</span></div></div></div></div>';
  }

  var FACULTY = [
    { initials: 'HHS', name: 'Hamudi Hasan Sonet', title: 'Senior Programmer, United International University', email: 'hhsonet@gmail.com', role: 'Course teacher' }
  ];

  // Teaching assistants. linkedin: profile URL; name links to it when set.
  var ASSISTANTS = [
    { name: 'To be announced', designation: 'Teaching Assistant', email: '', linkedin: '' }
  ];

  function taTable(list) {
    var rows = list.map(function (t) {
      var name = t.linkedin ? '<a class="ta-link" href="' + esc(t.linkedin) + '" target="_blank" rel="noopener">' + esc(t.name) + '</a>' : esc(t.name);
      var mail = t.email ? '<a class="person-mail" href="mailto:' + esc(t.email) + '">' + esc(t.email) + '</a>' : '<span class="muted">—</span>';
      return '<tr><td>' + name + '</td><td>' + esc(t.designation) + '</td><td>' + mail + '</td></tr>';
    }).join('');
    return '<div class="card ta-wrap"><table class="ta-table"><thead><tr><th>Name</th><th>Designation</th><th>Email</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  }

  function personCards(list) {
    return list.map(function (f) {
      var mail = f.email ? '<a class="person-mail" href="mailto:' + esc(f.email) + '">' + esc(f.email) + '</a>' : '';
      return '<div class="card person"><div class="person-av">' + f.initials + '</div><div class="stack g6" style="min-width:0"><span class="person-name">' + esc(f.name) + '</span>' +
        '<span class="person-title">' + esc(f.title) + '</span>' + mail +
        '<span class="badge b-default" style="align-self:flex-start;border-color:#18181b">' + esc(f.role) + '</span></div></div>';
    }).join('');
  }

  function staff() {
    var cards = personCards(FACULTY), taCards = taTable(ASSISTANTS);
    return '<div class="stack" style="gap:32px"><div class="stack g8"><span class="mono muted" style="font-size:12px">Structured Programming Language</span>' +
      '<h1 class="lec-h1">Teaching Team</h1><p class="lede">Faculty and teaching assistants for this course.</p></div>' +
      '<div class="stack g16"><span class="card-title">Course teacher</span><div class="people">' + cards + '</div></div>' +
      '<div class="stack g16"><span class="card-title">Teaching assistants</span>' + taCards + '</div></div>';
  }

  // Lecture pages built from the standard template: outcome, before class, in class, problem set, resources, after class, assessment.
  var LECDATA = {
    1: {
      outcome: 'After this class you can write C programs that use loops and your own functions.',
      before: [
        'Revise from ICS: variables, data types, printf and scanf, if / else.',
        'Set up a C compiler (GCC) and a code editor. Make sure you can compile and run hello world.',
        'Warm-up: what does for (int i = 1; i <= 3; i++) printf("%d ", i); print? (Answer: 1 2 3)'
      ],
      steps: [
        { t: 'Review of ICS', d: 'Data types, operators, input and output, conditions. Quick check of what you remember.' },
        { t: 'Loops: for, while, do-while', d: 'Repeat a block of code. Sum of the numbers 1 to n:',
          code: ['#include <stdio.h>', '', 'int main(void) {', '    int n, sum = 0;', '    scanf("%d", &n);', '    for (int i = 1; i <= n; i++) {', '        sum += i;', '    }', '    printf("%d\\n", sum);', '    return 0;', '}'], out: 'Input 5, output 15' },
        { t: 'Basic function', d: 'A function has a return type, a name, parameters and a body. Define it once, call it many times:',
          code: ['int max(int a, int b) {', '    return a > b ? a : b;', '}', '', 'int main(void) {', '    printf("%d\\n", max(3, 8));', '    return 0;', '}'], out: 'Output 8' },
        { t: 'Exercise', d: 'Solve problems 1 to 3 from the problem set, in order.' }
      ],
      mistakes: [
        'Off-by-one: i < n and i <= n give different results.',
        'Forgetting & in scanf("%d", &n).',
        'Infinite loop: the loop variable never changes.'
      ],
      problems: [
        { level: 'Easy', when: 'In class', t: 'Print 1 to n', d: 'Read n and print the numbers 1 to n on one line.', ex: 'Input 5, output 1 2 3 4 5' },
        { level: 'Easy', when: 'In class', t: 'Sum of digits', d: 'Read a positive integer and print the sum of its digits.', ex: 'Input 482, output 14' },
        { level: 'Medium', when: 'In class', t: 'Prime check', d: 'Write a function int isPrime(int n) that returns 1 for a prime and 0 otherwise. Use it to print all primes up to n.', ex: 'Input 10, output 2 3 5 7' },
        { level: 'Medium', when: 'After class', t: 'Factorial', d: 'Write a function that returns n factorial using a loop. Read n and print the result.', ex: 'Input 5, output 120' },
        { level: 'Hard', when: 'After class', t: 'Fibonacci', d: 'Write a function that prints the first n Fibonacci numbers.', ex: 'Input 6, output 0 1 1 2 3 5' }
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
        'Attendance: counts toward the 10 attendance marks.',
        'Class performance: your work in class counts toward the 30 marks.',
        'Next class: Function, Loop.'
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
    return '<div class="card"><div class="card-h"><span class="card-title">' + title + '</span>' + (desc ? '<span class="card-desc">' + desc + '</span>' : '') + '</div><div class="stack" style="padding:12px 24px 20px;gap:10px">' +
      items.map(function (x) { return '<div class="prep"><i></i><span>' + esc(x) + '</span></div>'; }).join('') + '</div></div>';
  }
  function resourcesCard(list) {
    var rows = list.map(function (r) {
      var inner = '<span class="rt">' + esc(r.t) + '</span><span class="rd">' + esc(r.d) + '</span>';
      return r.href ? '<a class="res" href="' + esc(r.href) + '" target="_blank" rel="noopener">' + inner + '<span class="go">↗</span></a>' : '<div class="res off">' + inner + '<span class="soon">Soon</span></div>';
    }).join('');
    return '<div class="card"><div class="card-h"><span class="card-title">Resources</span><span class="card-desc">Links and files for this class.</span></div><div class="res-list">' + rows + '</div></div>';
  }
  function problemSetCard(n, d) {
    var rows = d.problems.map(function (x, i) {
      return '<tr><td class="c-n">' + (i + 1) + '</td><td class="c-t">' + esc(x.t) + '</td><td class="c-d">' + esc(x.d) + '</td><td class="c-ex">' + esc(x.ex) + '</td>' +
        '<td>' + badge(x.level, LEVEL_V[x.level]) + '</td><td class="c-w">' + esc(x.when) + '</td><td><button class="btn-out sm" data-act="copy:' + n + ':' + i + '">Copy</button></td></tr>';
    }).join('');
    return '<div class="card"><div class="card-h row"><div class="stack g4"><span class="card-title">Problem set</span><span class="card-desc">' + d.problems.length + ' problems. Share with classmates and the teaching team. <a class="ta-link" href="' + link('problem-sets') + '">All problem sets →</a></span></div>' +
      '<div class="row-between" style="gap:8px"><button class="btn-out" data-act="copyall:' + n + '">Copy all</button><button class="btn-out" data-act="dl:' + n + '">Download .txt</button><button class="btn-out" data-act="copylink:' + n + '">Copy link</button></div></div>' +
      '<div class="prob-wrap"><table class="prob-table"><thead><tr><th>#</th><th>Problem</th><th>Description</th><th>Example</th><th>Level</th><th>When</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div><span class="toast" id="toast" role="status"></span></div>';
  }
  function lectureTemplate(n, d) {
    var h = L[n - 1][0];
    var steps = d.steps.map(function (x, i) {
      return '<div class="step"><span class="step-n">' + (i + 1) + '</span><div class="stack g6" style="min-width:0"><span class="t">' + esc(x.t) + '</span><span class="d">' + esc(x.d) + '</span>' + (x.code ? codeBlock(x.code, x.out) : '') + '</div></div>';
    }).join('');
    return '<div class="stack g24"><div class="lec-head"><div class="stack g8" style="min-width:0"><div class="row-between" style="justify-content:flex-start;gap:10px"><span class="mono muted" style="font-size:12px">Lecture ' + pad(n) + ' of 12</span>' + statusBadge(n) + '</div>' +
      '<h1 class="lec-h1">' + h + '</h1></div>' +
      '<div class="row-between" style="gap:8px"><button class="nav-btn" style="opacity:' + (n > 1 ? 1 : .4) + '" data-act="lec:' + clamp(n - 1) + '">← ' + (n > 1 ? 'L' + pad(n - 1) : 'Start') + '</button><button class="nav-btn" style="opacity:' + (n < 12 ? 1 : .4) + '" data-act="lec:' + clamp(n + 1) + '">' + (n < 12 ? 'L' + pad(n + 1) : 'End') + ' →</button></div></div>' +
      '<div class="callout"><span class="k">Outcome</span><p>' + esc(d.outcome) + '</p></div>' +
      '<div class="lec-grid"><div class="lec-col">' +
      '<div class="card"><div class="card-h"><span class="card-title">In class</span><span class="card-desc">Follow the steps in order.</span></div><div class="steps">' + steps + '</div></div>' +
      problemSetCard(n, d) +
      listCard('Common mistakes', 'Watch for these.', d.mistakes) +
      '</div><div class="lec-col">' +
      listCard('Before class', 'About 5 minutes of work.', d.before) +
      resourcesCard(d.resources) +
      listCard('After class', '', d.after) +
      listCard('Assessment', '', d.assess) +
      '</div></div></div>';
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
    var n = state.lec, h = L[n - 1][0], items = L[n - 1][1], units = UNIT_OF[h] || [], u0 = units[0];
    var st = status(n)[0];
    var list;
    if (n === 1) {
      list = AGENDA.map(function (a) { return { t: a[0], desc: a[1], label: a[2] === '—' ? 'Overview' : a[2], v: a[2] === '—' ? 'secondary' : 'outline' }; });
    } else {
      list = units.map(function (u) { return { t: TOPICS[u][0], desc: 'Details to be announced.', label: TL.topic, v: 'outline' }; })
        .concat(items.map(function (it) { return { t: it[0].replace('Due · ', ''), desc: DESC[it[0]] || '', label: TL[it[1]], v: TV[it[1]] }; }));
    }
    var nextDue = n < 12 ? L[n][1].filter(function (it) { return /^(due|exam|ct)$/.test(it[1]); }).map(function (it) { return it[0].replace('Due · ', ''); }) : [];
    var prep = ['Details to be announced'];
    var log = state.logs[n] || {};
    var filled = LOG_FIELDS.filter(function (f) { return (log[f[0]] || '').trim(); }).length;
    var unit = u0 !== undefined ? 'Unit ' + (u0 + 1) + ' of 5 · ' + TOPICS[u0][0] : (n === 1 ? 'Review on ICS, Loop and Basic Function' : 'To be announced');
    var unitCard = '';
    if (u0 !== undefined) {
      var rows = '';
      for (var m = TOPICS[u0][2]; m <= TOPICS[u0][3]; m++) rows += '<button class="' + (m === n ? 'on' : '') + '" data-act="lec:' + m + '"><span class="n">' + pad(m) + '</span><span>' + L[m - 1][0] + '</span><span class="s">' + status(m)[0] + '</span></button>';
      unitCard = '<div class="card"><div class="card-h" style="padding:20px 20px 4px"><span class="card-title">' + TOPICS[u0][0] + '</span><span class="card-desc" style="font-size:13px">Lectures ' + pad(TOPICS[u0][2]) + '–' + pad(TOPICS[u0][3]) + '</span></div><div class="unit-b">' + rows + '</div></div>';
    }
    var fields = LOG_FIELDS.map(function (f) {
      return '<label><span>' + f[1] + '</span><textarea rows="3" data-field="' + f[0] + '" placeholder="' + esc(f[2]) + '">' + esc(log[f[0]] || '') + '</textarea></label>';
    }).join('');
    return '<div class="stack g24"><div class="lec-head"><div class="stack g8" style="min-width:0"><div class="row-between" style="justify-content:flex-start;gap:10px"><span class="mono muted" style="font-size:12px">Lecture ' + pad(n) + ' of 12</span>' + statusBadge(n) + '</div>' +
      '<h1 class="lec-h1">' + h + '</h1><p class="lede">' + unit + '</p></div>' +
      '<div class="row-between" style="gap:8px"><button class="nav-btn" style="opacity:' + (n > 1 ? 1 : .4) + '" data-act="lec:' + clamp(n - 1) + '">← ' + (n > 1 ? 'L' + pad(n - 1) : 'Start') + '</button><button class="nav-btn" style="opacity:' + (n < 12 ? 1 : .4) + '" data-act="lec:' + clamp(n + 1) + '">' + (n < 12 ? 'L' + pad(n + 1) : 'End') + ' →</button></div></div>' +
      '<div class="lec-cols"><div class="lec-main">' +
      '<div class="card"><div class="card-h"><span class="card-title">In this lecture</span><span class="card-desc">' + list.length + (list.length === 1 ? ' item' : ' items') + '</span></div><div class="card-b">' +
      list.map(function (x) { return '<div class="item-row">' + badge(x.label, x.v) + '<div class="stack g2" style="min-width:0"><span class="t">' + esc(x.t) + '</span><span class="d">' + esc(x.desc) + '</span></div></div>'; }).join('') + '</div></div>' +
      '<div class="card"><div class="card-h row"><div class="stack g4"><span class="card-title">Class log</span><span class="card-desc">2 marks per class · saved in this browser</span></div><span class="badge b-secondary" id="logcount">' + filled + ' / 3</span></div><div class="log-b">' + fields + '</div></div>' +
      '</div><div class="lec-aside">' +
      '<div class="card"><div class="card-h" style="padding:20px 20px 4px"><span class="card-title">Prepare</span></div><div class="stack" style="padding:12px 20px 20px;gap:10px">' + prep.map(function (p) { return '<div class="prep"><i></i><span>' + esc(p) + '</span></div>'; }).join('') + '</div></div>' +
      unitCard +
      '<div class="next-card"><span class="k">' + (n < 12 ? 'Next · Lecture ' + pad(n + 1) : 'End of course') + '</span><div class="v">' + (n < 12 ? L[n][0] : 'Course complete') + '</div><div class="badges">' + (n < 12 ? L[n][1].map(function (it) { return badge(it[0], TV[it[1]]); }).join('') : '') + '</div></div>' +
      '</div></div></div>';
  }

  function render() {
    var page = state.route === 'lecture' ? lecture() : state.route === 'teaching-team' ? staff() : state.route === 'schedule' ? schedule() : state.route === 'assessment' ? assessment() : overview();
    document.body.style.overflow = state.drawer ? 'hidden' : '';
    root.innerHTML = '<div class="app"><div class="scrim' + (state.drawer ? ' on' : '') + '" data-act="closeDrawer"></div>' + sidebar() + '<div class="col">' + header() + '<main' + (state.route === 'lecture' && LECDATA[state.lec] ? ' class="wide"' : '') + '>' + page + '</main>' +
      '<footer class="foot"><span>Structured Programming Language</span><span>Teaching | HHS</span></footer></div></div>';
    document.title = (state.lec ? 'Lecture ' + pad(state.lec) : state.route === 'overview' ? 'Overview' : state.route === 'teaching-team' ? 'Teaching Team' : state.route[0].toUpperCase() + state.route.slice(1)) + ' | SPL';
  }

  root.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el) return;
    var a = el.getAttribute('data-act').split(':'), k = a[0], v = a[1];
    if (k === 'tab') go(v);
    else if (k === 'lec') go('lecture', clamp(parseInt(v, 10)));
    else if (k === 'step') {
      var d = parseInt(v, 10);
      if (state.lec) go('lecture', clamp(state.lec + d)); else { state.sel = clamp(cur() + d); render(); }
    }
    else if (k === 'filter') { state.filter = v; render(); }
    else if (k === 'acc') { var i = parseInt(v, 10), p = state.open.indexOf(i); if (p > -1) state.open.splice(p, 1); else state.open.push(i); render(); }
    else if (k === 'toggleSide') {
      if (isMobile()) state.drawer = !state.drawer;
      else { state.sidebar = !state.sidebar; try { localStorage.setItem(SIDE_KEY, state.sidebar ? '1' : '0'); } catch (x) {} }
      render();
    }
    else if (k === 'closeDrawer') { state.drawer = false; render(); }
    else if (k === 'copy') copyText(problemText(LECDATA[v], parseInt(a[2], 10)), 'Problem copied');
    else if (k === 'copyall') copyText(allProblemsText(v), 'Problem set copied');
    else if (k === 'copylink') copyText(location.href.split('#')[0] + '#/lecture/' + v, 'Link copied');
    else if (k === 'dl') download('spl-lecture-' + pad(parseInt(v, 10)) + '-problem-set.txt', allProblemsText(v));
    else if (k === 'toggleLecs') { state.lecList = !state.lecList; render(); }
  });

  root.addEventListener('input', function (e) {
    var f = e.target.getAttribute && e.target.getAttribute('data-field');
    if (!f || !state.lec) return;
    var n = state.lec;
    state.logs[n] = state.logs[n] || {};
    state.logs[n][f] = e.target.value;
    try { localStorage.setItem(LOG_KEY, JSON.stringify(state.logs)); } catch (x) {}
    var c = LOG_FIELDS.filter(function (x) { return (state.logs[n][x[0]] || '').trim(); }).length;
    var el = document.getElementById('logcount');
    if (el) el.textContent = c + ' / 3';
  });

  window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && state.drawer) { state.drawer = false; render(); } });
  window.addEventListener('resize', function () { if (state.drawer && !isMobile()) { state.drawer = false; render(); } });
  window.addEventListener('popstate', function () { parseHash(); render(); });
  parseHash();
  render();
})();
