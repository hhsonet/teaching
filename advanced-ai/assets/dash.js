// Course dashboard. Vanilla port of the "Advanced AI Course v6" design.
(function () {
  var root = document.getElementById('app');
  var BASE = root.dataset.base || '';
  var CURRENT = Math.min(14, Math.max(1, parseInt(root.dataset.current, 10) || 1));
  var GITHUB = root.dataset.github || '#';
  var TEACHING = BASE.replace(/\/[^\/]*$/, '/') || '/';

  var TV = { due: 'default', exam: 'destructive', project: 'outline', survey: 'outline', review: 'secondary', log: 'secondary', admin: 'secondary' };
  var L = [
    ['First class', [['Level survey', 'admin'], ['Course overview', 'admin'], ['Project & survey overview', 'admin']]],
    ['GAN', [['Project selection', 'project']]],
    ['GAN', [['Survey start', 'survey'], ['BD search', 'survey']]],
    ['Attention', [['Due · GAN review', 'due']]],
    ['Transformer', [['GAN review', 'review'], ['Define problem statement', 'project']]],
    ['Review', [['Due · Transformer', 'due'], ['Finalize problem statement', 'project'], ['Class log review', 'log']]],
    ['Midterm', [['Midterm exam', 'exam'], ['Due · BD survey', 'due']]],
    ['Diffusion', [['Transformer review', 'review'], ['BD survey presentation', 'survey']]],
    ['RAG', [['Due · Diffusion (TBC)', 'due'], ['Project progress review', 'project']]],
    ['RAG', [['Diffusion review', 'review']]],
    ['LLM + RAG', [['Due · RAG', 'due']]],
    ['Review', [['LLM review', 'review'], ['RAG review', 'review'], ['Due · Project', 'due']]],
    ['Review', [['Class log review', 'log']]],
    ['Final', [['Final exam', 'exam']]]
  ];
  var TOPICS = [['GAN', 2, 5], ['Attention & Transformers', 4, 8], ['Diffusion models', 8, 10], ['Retrieval-augmented generation', 9, 12], ['Large language models', 11, 12]];
  var UNIT_OF = { GAN: 0, Attention: 1, Transformer: 1, Diffusion: 2, RAG: 3, 'LLM + RAG': 4 };
  var PARTS = [
    ['Class log', 25, 'One entry per class', ['2 marks per class for 12 classes, plus 1 (2 × 12 + 1)', 'Record what you learned, what to do and what to ask', 'Reviewed in lectures 6 and 13']],
    ['Project', 25, 'Proposal 5 · Problem statement 10 · Implementation 10', ['Problem statement: what is the problem, and how will it be solved?', 'Ground it in 20–30 papers from venues like CVPR and EMNLP, 2025–2026', 'Based on class topics; prefer well-cited work or strong institutions', 'Ideas outside the syllabus are welcome', 'Selection L02 · Definition L05 · Final L06 · Progress L09 · Submit L12']],
    ['Paper survey', 10, 'Your own 15-minute video survey', ['Cover recent, impactful work in your field', 'Class presentation must be a video', 'Starts in week 4; week pairings 4+5, 5+6, 7+8, 9+10, 11+12']],
    ['Other team review', 10, 'Two reviews, 5 + 5', ['30-minute video', 'Starts around week 5 (TBC)']],
    ['BD / Top-50 activity', 5, 'Map the researchers in your field', ['Find the people in BD doing the best work in this field, and what they work on', 'Top-50 universities, split across 5 groups', 'Find BD students in these labs and how their profiles looked at admission', 'Find where they usually publish']],
    ['Midterm', 10, 'Lecture 7 · based on papers', ['Based on papers, including the paper your project selected']],
    ['Final', 15, 'Lecture 14 · based on other projects', ['Based on other teams’ projects', 'Report swap']]
  ];
  var WHEN = ['Every class', 'L02 – L12', 'From week 4', 'From week 5 (TBC)', 'Due L07', 'L07', 'L14'];
  var AGENDA = [
    ['Survey / exam', 'Level detection', '30–40 min'], ['Lecture plan & next chapter printout', '', '—'], ['Course overview', '', '20 min'],
    ['Break', '', '10 min'], ['Review of survey', '', '5 min'], ['Project & paper survey overview', '', '15 min'],
    ['How to read a paper', 'Walked through on a real paper', '—'], ['Code evaluation criteria', 'Debug and modify', '—']
  ];
  var TL = { topic: 'Lecture', due: 'Due', review: 'Review', project: 'Project', survey: 'BD survey', exam: 'Exam', log: 'Class log', admin: 'Overview' };
  var DESC = {
    'Project selection': 'Pick a project area grounded in class topics. Ideas beyond the syllabus are welcome.',
    'Survey start': 'Begin collecting recent, impactful papers in your field.',
    'BD search': 'Find the BD researchers doing the best work in this field, and where they publish.',
    'Due · GAN review': 'Submit your GAN review.',
    'Define problem statement': 'What is the problem, and how will it be solved? Worth 10 project marks.',
    'Finalize problem statement': 'Lock the problem statement before the midterm.',
    'Class log review': 'Bring your class log — 2 marks per class.',
    'Midterm exam': '10 marks. Based on papers, including your project’s selected paper.',
    'Due · BD survey': 'BD / Top-50 university activity · 5 marks.',
    'BD survey presentation': 'Present your BD / Top-50 findings.',
    'Due · Diffusion (TBC)': 'Submission date to be confirmed.',
    'Project progress review': 'Implementation check-in. Implementation is worth 10 marks.',
    'Due · Project': 'Final project submission · 25 marks total.',
    'Final exam': '15 marks. Based on other teams’ projects, with a report swap.'
  };
  var MILESTONES = [[2, 'Project selection', 'Pick a project area grounded in class topics.'], [5, 'Define problem statement', 'What is the problem, and how will it be solved?'], [6, 'Finalize problem statement', 'Lock the problem statement before the midterm.'], [9, 'Progress review', 'Implementation check-in.'], [12, 'Final submission', 'Submit the project · 25 marks total.']];
  // Per-lecture materials. Paste links here: slides (PDF / Google Slides), notes, and papers [title, url].
  var MATERIALS = {
    1: { slides: '', notes: '', papers: [] }
  };
  // Paper survey list. status: 'available' | 'taken'
  var SURVEY_PAPERS = [
    ['Generative Adversarial Nets', 'Goodfellow et al.', 'GAN', 'NeurIPS 2014', 'https://arxiv.org/abs/1406.2661', 'available'],
    ['A Style-Based Generator Architecture for GANs', 'Karras et al.', 'GAN', 'CVPR 2019', 'https://arxiv.org/abs/1812.04948', 'available'],
    ['Unpaired Image-to-Image Translation (CycleGAN)', 'Zhu et al.', 'GAN', 'ICCV 2017', 'https://arxiv.org/abs/1703.10593', 'available'],
    ['Attention Is All You Need', 'Vaswani et al.', 'Transformers', 'NeurIPS 2017', 'https://arxiv.org/abs/1706.03762', 'available'],
    ['An Image is Worth 16x16 Words (ViT)', 'Dosovitskiy et al.', 'Transformers', 'ICLR 2021', 'https://arxiv.org/abs/2010.11929', 'available'],
    ['BERT: Pre-training of Deep Bidirectional Transformers', 'Devlin et al.', 'Transformers', 'NAACL 2019', 'https://arxiv.org/abs/1810.04805', 'available'],
    ['Denoising Diffusion Probabilistic Models', 'Ho et al.', 'Diffusion', 'NeurIPS 2020', 'https://arxiv.org/abs/2006.11239', 'available'],
    ['High-Resolution Image Synthesis with Latent Diffusion Models', 'Rombach et al.', 'Diffusion', 'CVPR 2022', 'https://arxiv.org/abs/2112.10752', 'available'],
    ['Scalable Diffusion Models with Transformers (DiT)', 'Peebles & Xie', 'Diffusion', 'ICCV 2023', 'https://arxiv.org/abs/2212.09748', 'available'],
    ['Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks', 'Lewis et al.', 'RAG', 'NeurIPS 2020', 'https://arxiv.org/abs/2005.11401', 'available'],
    ['Improving Language Models by Retrieving from Trillions of Tokens (RETRO)', 'Borgeaud et al.', 'RAG', 'ICML 2022', 'https://arxiv.org/abs/2112.04426', 'available'],
    ['Self-RAG: Learning to Retrieve, Generate, and Critique', 'Asai et al.', 'RAG', 'ICLR 2024', 'https://arxiv.org/abs/2310.11511', 'available'],
    ['Language Models are Few-Shot Learners (GPT-3)', 'Brown et al.', 'LLMs', 'NeurIPS 2020', 'https://arxiv.org/abs/2005.14165', 'available'],
    ['Training Language Models to Follow Instructions (InstructGPT)', 'Ouyang et al.', 'LLMs', 'NeurIPS 2022', 'https://arxiv.org/abs/2203.02155', 'available'],
    ['LLaMA: Open and Efficient Foundation Language Models', 'Touvron et al.', 'LLMs', 'arXiv 2023', 'https://arxiv.org/abs/2302.13971', 'available']
  ];
  var PUB_TABS = ['All', 'GAN', 'Transformers', 'Diffusion', 'RAG', 'LLMs'];

  var FACULTY = [
    { initials: 'MJ', name: 'Dr. Abu Shafin Mohammad Mahdee Jameel', title: 'Assistant Professor, Dept. of CSE & Director, CAIR', email: 'mahdee@cse.uiu.ac.bd' }
  ];
  // Teaching assistants. linkedin: profile URL; name links to it when set.
  var ASSISTANTS = [
    { name: 'Proshanta Kumer Das', designation: 'Machine Learning Engineer, Softwrd Limited', email: 'Proshantakumer0000@gmail.com', linkedin: '' },
    { name: 'Hamudi Hasan Sonet', designation: 'Senior Programmer, United International University', email: 'hhsonet@gmail.com', linkedin: '' }
  ];

  // page key -> hash slug / label
  var PAGES = {
    home: ['home', 'Home'], info: ['assessment', 'Assessment'], lectures: ['lectures', 'Lectures'], materials: ['materials', 'Materials'],
    team: ['teaching-team', 'Teaching Team'], project: ['project', 'Project'], survey: ['paper-survey', 'Paper survey'],
    reading: ['reading-list', 'Reading list'], pubs: ['publications', 'Publications']
  };
  var ALIAS = { overview: 'home', schedule: 'lectures', assessment: 'info', staff: 'team', faculty: 'team', 'teaching-team': 'team', 'paper-survey': 'survey', 'reading-list': 'reading', publications: 'pubs' };

  var ICON = {
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
    info: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>',
    lectures: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>',
    materials: '<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>',
    team: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>'
  };
  var icon = function (k) { return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICON[k] + '</svg>'; };

  var SIDE_KEY = 'aai-v6-sidebar';
  var state = { page: 'home', lec: null, open: [1], filter: 'all', spTab: 'All', pubTab: 'All', sidebar: true, drawer: false, lecList: true };
  try { if (localStorage.getItem(SIDE_KEY) === '0') state.sidebar = false; } catch (e) {}

  var isMobile = function () { return window.matchMedia('(max-width: 899px)').matches; };
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var clamp = function (n) { return Math.min(14, Math.max(1, n)); };
  var badge = function (t, v) { return '<span class="bd bd-' + v + '">' + esc(t) + '</span>'; };
  var link = function (path) { return BASE + '/' + path + '/'; };
  var status = function (n) { return n < CURRENT ? ['Done', 'secondary'] : n === CURRENT ? ['This week', 'default'] : ['Upcoming', 'outline']; };
  var isDl = function (items) { return items.some(function (it) { return it[1] === 'due' || it[1] === 'exam'; }); };
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
    var sub = function (k) { return '<button class="reset link-item' + (state.page === k ? ' on' : '') + '" data-act="go:' + k + '">' + PAGES[k][1] + '</button>'; };
    return '<aside class="side' + (state.drawer ? ' open' : '') + (state.sidebar ? '' : ' hidden') + '" id="side">' +
      '<button class="reset brand" data-act="go:home"><span class="logo">AI</span><span class="stack g2" style="min-width:0"><span class="t1">Advanced AI</span><span class="t2">14 lectures · 100 marks</span></span></button>' +
      '<div class="stack g2"><div class="sec-label">Course</div>' + nav + '</div>' +
      '<div class="stack g2"><button class="reset sec-label sec-toggle" data-act="toggleLecs"><span>Lectures</span><span class="chev" style="transform:' + (state.lecList ? 'rotate(180deg)' : 'none') + '">⌄</span></button>' + lecs + '</div>' +
      '<div class="stack g2"><div class="sec-label">Assignments</div>' + sub('project') + sub('survey') +
      '<a class="link-item" href="' + link('team-review') + '"><span>Other team review</span></a><a class="link-item" href="' + link('bd-top50') + '"><span>BD / Top-50 activity</span></a></div>' +
      '<div class="stack g2"><div class="sec-label">Resources</div>' + sub('reading') + sub('pubs') +
      '<a class="link-item" href="' + link('announcements') + '"><span>Announcements</span></a><a class="link-item" href="https://udlbook.github.io/udlbook/"><span>UDL book</span><span class="arr">↗</span></a></div>' +
      '<button class="reset who" data-act="go:team"><span class="avatar">MJ</span><span class="stack g2" style="min-width:0"><span class="n1">Dr. A. S. M. Mahdee Jameel</span><span class="n2">Course teacher</span></span></button>' +
      '</aside>';
  }
  function header() {
    var crumb = state.page === 'lecture' ? 'Lecture ' + pad(state.lec) : PAGES[state.page][1];
    var title = state.sidebar ? 'Close sidebar' : 'Open sidebar';
    return '<header class="top"><div class="crumbs">' +
      '<button class="reset icon-btn" data-act="toggleSide" title="' + title + '" aria-label="' + title + '" aria-expanded="' + (isMobile() ? state.drawer : state.sidebar) + '" aria-controls="side"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg></button>' +
      '<span class="vr"></span><a href="' + TEACHING + '">Teaching</a><span class="sep">/</span>' +
      '<button class="reset" data-act="go:home" style="white-space:nowrap">Advanced AI</button><span class="sep">/</span><span class="here">' + crumb + '</span></div>' +
      '<a class="btn btn-dark" href="' + GITHUB + '">GitHub</a></header>';
  }

  // ---- pages ----
  function home() {
    var c = CURRENT, h = L[c - 1], u = UNIT_OF[h[0]];
    var curUnit = u !== undefined ? 'Unit ' + (u + 1) + ' of 5 · ' + TOPICS[u][0] : c === 1 ? 'Course overview' : 'Review session';
    var deadlines = [];
    L.forEach(function (l, i) { l[1].forEach(function (it) { if ((it[1] === 'due' || it[1] === 'exam') && i + 1 >= c) deadlines.push({ t: it[0].replace('Due · ', ''), n: pad(i + 1), ex: it[1] === 'exam', due: it[1] === 'due' }); }); });
    var nd = deadlines[0] ? { n: deadlines[0].n, label: (deadlines[0].ex ? '' : 'Due · ') + deadlines[0].t } : { n: '—', label: 'No deadlines left' };
    var upcoming = L.slice(c - 1, c + 2).map(function (l, i) {
      var n = c + i;
      return '<button class="reset up-row" data-act="lec:' + n + '"><span class="chip' + (n === c ? ' cur' : '') + '">' + pad(n) + '</span><span class="stack g6" style="flex:1;min-width:0"><span class="up-head">' + l[0] + (n === c ? '<span class="tag-now">This week</span>' : '') + '</span>' +
        '<span class="badges">' + l[1].map(function (it) { return badge(it[0], TV[it[1]]); }).join('') + '</span></span></button>';
    }).join('');
    var dls = deadlines.slice(0, 4).map(function (d) { return '<div class="dl-row"><span class="row g10" style="min-width:0"><span class="dot' + (d.ex ? ' ex' : '') + '"></span><span>' + esc(d.t) + '</span></span><span class="mono muted" style="flex:none;font-size:12px;font-weight:500">Lecture ' + d.n + '</span></div>'; }).join('');
    return '<div class="stack g40">' +
      '<section class="hero"><div class="hero-in"><span class="pill"><i></i>Dept. of CSE · United International University</span><h1>Advanced Artificial Intelligence</h1>' +
      '<p>This course covers modern deep learning through lectures, paper reading and a term project. We start with generative adversarial networks, move through attention and Transformers, diffusion models and retrieval-augmented generation, and end with large language models. Alongside the lectures you will survey recent papers in your field, define and build a research project grounded in 20–30 recent papers, and review other teams’ work.</p>' +
      '<div class="row wrap g8"><button class="reset btn btn-dark btn-lg" data-act="lec:' + c + '">Continue · Lecture ' + pad(c) + ' <span style="opacity:.6">→</span></button><button class="reset btn btn-out btn-lg" data-act="go:lectures">View schedule</button></div></div>' +
      '<div class="hero-stats"><div><span class="k">Progress</span><span class="big">' + pad(c) + '<span class="of"> / 14</span></span><span class="bar"><i style="width:' + (c / 14 * 100) + '%"></i></span></div>' +
      '<div><span class="k">This week</span><span class="big">' + h[0] + '</span><span class="k" style="font-weight:400">' + curUnit + '</span></div>' +
      '<div><span class="k">Next deadline</span><span class="big">Lecture ' + nd.n + '</span><span class="k" style="font-weight:400">' + esc(nd.label) + '</span></div>' +
      '<div><span class="k">Assessment</span><span class="big">100<span class="of"> marks</span></span><span class="k" style="font-weight:400">7 parts · midterm L07 · final L14</span></div></div></section>' +

      '<section class="stack g16"><h2 class="h2">General information</h2><div class="grid2">' +
      '<div class="card person-card"><span class="k">Course teacher</span><div class="row g16" style="gap:14px"><span class="av" style="width:44px;height:44px;font-size:14px">MJ</span><span class="stack g3" style="min-width:0"><span style="font-size:15px;font-weight:600;line-height:1.3;text-wrap:pretty">Dr. Abu Shafin Mohammad Mahdee Jameel</span><span class="muted" style="font-size:13px;line-height:1.4">Assistant Professor, Dept. of CSE &amp; Director, CAIR</span></span></div>' +
      '<div class="row wrap g8" style="margin-top:auto"><a class="btn btn-dark noul" href="mailto:mahdee@cse.uiu.ac.bd"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex:none"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-10 5L2 7"></path></svg>mahdee@cse.uiu.ac.bd</a><button class="reset btn btn-out" data-act="go:team">Teaching team</button></div></div>' +
      '<div class="card person-card"><span class="k">Main book</span><div class="row" style="gap:14px"><span class="book">UDL</span><span class="stack g3" style="min-width:0"><span style="font-size:15px;font-weight:600;line-height:1.3">Understanding Deep Learning</span><span class="muted" style="font-size:13px">Simon J. D. Prince · free online</span></span></div>' +
      '<div class="row wrap g8" style="margin-top:auto"><a class="btn btn-out noul" href="https://udlbook.github.io/udlbook/">Read the book <span style="color:#a1a1aa">↗</span></a><span class="btn" style="background:#f4f4f5;color:#3f3f46;font-weight:400">Bring the printout each class</span></div></div></div>' +
      '<div class="card hid"><div class="between" style="padding:14px 20px;border-bottom:1px solid #e4e4e7"><span style="font-size:14px;font-weight:600">Key dates</span><span class="mono muted" style="font-size:12px">14 lectures · 5 units</span></div>' +
      '<div class="dates"><button class="reset" data-act="lec:7"><span class="k">Midterm</span><span class="big">Lecture 07</span><span class="k" style="font-weight:400">10 marks · based on papers</span></button>' +
      '<button class="reset" data-act="lec:12"><span class="k">Project due</span><span class="big">Lecture 12</span><span class="k" style="font-weight:400">25 marks</span></button>' +
      '<button class="reset" data-act="lec:14"><span class="k">Final</span><span class="big">Lecture 14</span><span class="k" style="font-weight:400">15 marks · other teams’ projects</span></button></div></div>' +
      '<div class="stack g10"><span class="k">Quick links</span><div class="quick">' + goBtn('project', 'Project') + goBtn('survey', 'Paper survey') +
      arrowLink(link('team-review'), 'Other team review', true) + arrowLink(link('bd-top50'), 'BD / Top-50 activity', true) + goBtn('reading', 'Reading list') + goBtn('pubs', 'Publications') +
      arrowLink(link('announcements'), 'Announcements', true) + arrowLink(GITHUB, 'GitHub repository', true) + '</div></div></section>' +

      '<div class="grid2 w"><section class="stack g16" style="min-width:0"><div class="between" style="align-items:baseline"><h2 class="h2">Upcoming lectures</h2><button class="reset link-more" data-act="go:lectures">All 14 →</button></div><div class="card hid up-list">' + upcoming + '</div></section>' +
      '<section class="stack g16" style="min-width:0"><div class="between" style="align-items:baseline"><h2 class="h2">Upcoming deadlines</h2><button class="reset link-more" data-act="go:info">Assessment →</button></div><div class="card hid dl-list">' + (dls || '<div class="dl-row"><span class="muted">No deadlines left</span></div>') + '</div></section></div></div>';
  }

  function info() {
    var anyOpen = state.open.length > 0;
    var rows = PARTS.map(function (p, i) {
      var open = state.open.indexOf(i) > -1;
      return '<div class="part' + (open ? ' open' : '') + '"><div class="trow cols-as" data-act="acc:' + i + '"><span style="font-weight:500">' + p[0] + '</span>' +
        '<span class="marks"><b>' + p[1] + '</b><span class="bar"><i style="width:' + (p[1] * 4) + '%"></i></span></span><span style="color:#52525b;line-height:1.45">' + esc(p[2]) + '</span><span class="when">' + WHEN[i] + '</span>' +
        '<span class="chev muted" style="text-align:center;transform:' + (open ? 'rotate(180deg)' : 'none') + '">⌄</span></div>' +
        (open ? '<div class="part-d cols-as"><span></span><ul>' + p[3].map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul></div>' : '') + '</div>';
    }).join('');
    return '<div class="stack g32"><div class="stack g8"><h1 class="h1">Assessment</h1><p class="sub">How the course is assessed — 100 marks across seven parts.</p></div>' +
      '<div class="card sx"><div class="tbl"><div class="thead cols-as"><span>Component</span><span>Marks</span><span>Breakdown</span><span>When</span><span></span></div>' + rows +
      '<div class="trow total cols-as" style="border-bottom:0"><span>Total</span><span class="mono">100</span><span style="font-weight:400;color:#71717a">7 components</span><span></span><span></span></div></div></div>' +
      '<section class="soft" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px 24px"><div class="stack g4"><span style="font-size:14px;font-weight:500">Book printout</span><span class="muted" style="font-size:13px">Bring the chapter for the next class.</span></div>' +
      '<div class="stack g4"><span style="font-size:14px;font-weight:500">Special notes</span><span class="muted" style="font-size:13px">Things to do and questions to ask.</span></div>' +
      '<div class="stack g4"><span style="font-size:14px;font-weight:500">Class log</span><span class="muted" style="font-size:13px">What you learned · 2 marks per class.</span></div></section></div>';
  }

  function lectures() {
    var rows = L.map(function (l, i) {
      var n = i + 1, st = status(n);
      return '<div class="trow cols-lec clickable' + (state.filter === 'deadlines' && !isDl(l[1]) ? ' dim' : '') + '" style="' + (n === CURRENT ? 'background:#fafafa' : '') + '" data-act="lec:' + n + '"><span class="num">' + pad(n) + '</span><span style="font-weight:500">' + l[0] + '</span>' +
        '<div class="badges">' + l[1].map(function (it) { return badge(it[0], TV[it[1]]); }).join('') + '</div><span class="jstart">' + badge(st[0], st[1]) + '</span></div>';
    }).join('');
    var f = [['all', 'All'], ['deadlines', 'Deadlines']].map(function (x) { return '<button class="reset' + (state.filter === x[0] ? ' on' : '') + '" data-act="filter:' + x[0] + '">' + x[1] + '</button>'; }).join('');
    return '<div class="stack g24"><div class="between wrap" style="align-items:flex-end;gap:16px"><div class="stack g8"><h1 class="h1">Lectures</h1><p class="sub">14 lectures. Click one to open its page.</p></div><div class="seg">' + f + '</div></div>' +
      '<div class="card sx"><div style="min-width:600px"><div class="thead cols-lec"><span>#</span><span>Topic</span><span>Activities</span><span>Status</span></div>' + rows + '</div></div></div>';
  }

  function lecture() {
    var n = state.lec, h = L[n - 1][0], items = L[n - 1][1], u = UNIT_OF[h], st = status(n);
    var list = n === 1
      ? AGENDA.map(function (a) { return { t: a[0], desc: a[1], label: a[2] === '—' ? 'Overview' : a[2], v: a[2] === '—' ? 'secondary' : 'outline' }; })
      : (u !== undefined ? [{ t: TOPICS[u][0], desc: u === 0 ? 'Book: Understanding Deep Learning, chapter 15.' : 'Readings on the course reading list.', label: TL.topic, v: 'outline' }] : [])
        .concat(items.map(function (it) { return { t: it[0].replace('Due · ', ''), desc: DESC[it[0]] || '', label: TL[it[1]], v: TV[it[1]] }; }));
    var nextDue = n < 14 ? L[n][1].filter(function (it) { return it[1] === 'due' || it[1] === 'exam'; }).map(function (it) { return it[0].replace('Due · ', ''); }) : [];
    var prep = n === 1 ? ['Print 20–25 papers', 'Expect a 30–40 minute level survey', 'Bring something to take notes']
      : ['Bring the book printout for this class', 'Notes: things to do and questions to ask'].concat(nextDue.length ? ['Due next lecture: ' + nextDue.join(', ')] : []);
    var unit = u !== undefined ? 'Unit ' + (u + 1) + ' of 5 · ' + TOPICS[u][0] : n === 1 ? 'Level survey, course overview and how this course works' : h === 'Review' ? 'Review session' : 'Assessment';
    var m = MATERIALS[n] || {};
    var mat = function (tag, t, href, sub) { return '<a class="mat' + (href ? '' : ' off') + '" ' + (href ? 'href="' + esc(href) + '"' : '') + '><span class="tag">' + tag + '</span><span class="stack g2" style="flex:1;min-width:0"><span class="t">' + esc(t) + '</span><span class="s">' + (href ? sub : 'Not posted yet') + '</span></span><span class="go">' + (href ? '↗' : '') + '</span></a>'; };
    var papers = (m.papers || []).map(function (p) { return mat('PDF', p[0], p[1], 'Paper'); });
    var mats = [mat('PPT', 'Slides', m.slides, 'Lecture ' + pad(n)), mat('TXT', 'Class notes', m.notes, 'Lecture ' + pad(n))].concat(papers.length ? papers : [mat('PDF', 'Papers', '', '')]);
    var posted = (m.slides ? 1 : 0) + (m.notes ? 1 : 0) + papers.length;
    return '<div class="stack g32"><div class="stack g12"><button class="reset back" data-act="go:lectures">← All lectures</button>' +
      '<div class="row g10"><span class="eyebrow">Lecture ' + pad(n) + ' of 14</span>' + badge(st[0], st[1]) + '</div><h1 class="h1">' + h + '</h1><p class="sub">' + unit + '</p></div>' +
      '<section class="stack g12"><h2 class="h2">In this lecture</h2><div class="card hid">' + list.map(function (x) { return '<div class="item-row">' + badge(x.label, x.v) + '<div class="stack g3" style="min-width:0"><span class="t">' + esc(x.t) + '</span><span class="d">' + esc(x.desc) + '</span></div></div>'; }).join('') + '</div></section>' +
      '<section class="stack g12"><div class="between" style="align-items:baseline"><h2 class="h2">Materials</h2><span class="muted" style="font-size:13px">' + (posted ? posted + ' posted' : 'Nothing posted yet') + '</span></div><div class="mats">' + mats.join('') + '</div></section>' +
      '<section class="stack g12"><h2 class="h2">Prepare</h2><ul class="bullets">' + prep.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul></section>' +
      '<div class="pn"><button class="reset" style="opacity:' + (n > 1 ? 1 : .35) + '" data-act="lec:' + clamp(n - 1) + '"><span class="l1">← Previous</span><span class="l2">' + (n > 1 ? pad(n - 1) + ' · ' + L[n - 2][0] : 'Start') + '</span></button>' +
      '<button class="reset r" style="opacity:' + (n < 14 ? 1 : .35) + '" data-act="lec:' + clamp(n + 1) + '"><span class="l1">Next →</span><span class="l2">' + (n < 14 ? pad(n + 1) + ' · ' + L[n][0] : 'End') + '</span></button></div></div>';
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
    return '<div class="stack g32"><div class="between wrap" style="align-items:flex-end;gap:16px"><div class="stack g8"><h1 class="h1">Materials</h1><p class="sub">Slides, class notes and papers for every lecture.</p></div><span class="pill-count">' + (posted ? posted + ' files posted' : 'Nothing posted yet') + '</span></div>' +
      '<div class="card sx"><div class="tbl"><div class="thead cols-mat"><span>#</span><span>Topic</span><span>Slides</span><span>Notes</span><span>Papers</span></div>' + rows + '</div></div></div>';
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
      '<section class="stack g16"><h2 class="h2">Teaching assistants</h2><div class="card ta-wrap"><table class="ta-table"><thead><tr><th>Name</th><th>Designation</th><th>Email</th></tr></thead><tbody>' + ta + '</tbody></table></div></section></div>';
  }

  function stat(k, v, s) { return '<div><span class="k">' + k + '</span><span class="big">' + v + '</span><span class="k" style="font-weight:400">' + s + '</span></div>'; }
  function project() {
    var ms = MILESTONES.map(function (m) {
      var st = status(m[0]), done = m[0] < CURRENT, now = m[0] === CURRENT;
      return '<button class="reset ms' + (done ? ' done' : '') + '" data-act="lec:' + m[0] + '"><span class="stack" style="align-items:center"><span class="pin' + (done || now ? ' on' : '') + '"></span></span><span class="stack g3" style="min-width:0"><span class="t">' + m[1] + '</span><span class="d">' + m[2] + '</span></span>' +
        '<span class="row g8">' + badge(st[0], st[1]) + '<span class="ln">L' + pad(m[0]) + '</span></span></button>';
    }).join('');
    return '<div class="stack g36"><div class="stack g10"><span class="eyebrow">Assignment · 25 marks</span><h1 class="h1">Project</h1><p class="lede">A term research project in one of the class topics, grounded in recent papers and built over the semester.</p></div>' +
      '<div class="stats">' + stat('Proposal', '5', 'marks') + stat('Problem statement', '10', 'marks') + stat('Implementation', '10', 'marks') + stat('Submission', 'L12', 'Lecture 12') + '</div>' +
      '<section class="stack g16"><h2 class="h2">Milestones</h2><div class="card" style="padding:8px 22px">' + ms + '</div></section>' +
      '<section class="stack g16"><h2 class="h2">Requirements</h2><ul class="bullets" style="gap:8px"><li>Problem statement: what is the problem, and how will it be solved?</li><li>Ground it in 20–30 papers from venues like CVPR and EMNLP, 2025–2026.</li><li>Base it on class topics; prefer well-cited work or papers from strong institutions.</li><li>Ideas outside the syllabus are welcome.</li></ul></section>' +
      '<section class="soft between wrap" style="gap:16px"><div class="stack g4"><span style="font-size:14px;font-weight:500">Start with the reading list</span><span class="muted" style="font-size:13px">Curated papers by topic, links only.</span></div><button class="reset btn btn-dark" data-act="go:reading">Reading list →</button></section></div>';
  }

  function survey() {
    var tab = state.spTab;
    var rows = SURVEY_PAPERS.filter(function (p) { return tab === 'All' || p[2] === tab; }).map(function (p) {
      var taken = p[5] === 'taken';
      return '<div class="trow cols-sp"><span class="stack g2" style="min-width:0"><a class="sp-p" href="' + esc(p[4]) + '">' + esc(p[0]) + ' <span style="color:#a1a1aa;text-decoration:none">↗</span></a><span class="muted" style="font-size:12px">' + esc(p[1]) + ' · <span class="mono">' + esc(p[3]) + '</span></span></span>' +
        '<span class="tp">' + esc(p[2]) + '</span><span class="st' + (taken ? ' taken' : '') + '"><i></i>' + (taken ? 'Taken' : 'Available') + '</span></div>';
    }).join('');
    var avail = SURVEY_PAPERS.filter(function (p) { return p[5] !== 'taken'; }).length;
    var tabs = PUB_TABS.map(function (l) { return '<button class="reset' + (tab === l ? ' on' : '') + '" data-act="sp:' + l + '">' + l + '</button>'; }).join('');
    var pairs = ['Weeks 4 + 5', 'Weeks 5 + 6', 'Weeks 7 + 8', 'Weeks 9 + 10', 'Weeks 11 + 12'].map(function (w) { return '<span class="chip-lg">' + w + '</span>'; }).join('');
    return '<div class="stack g36"><div class="stack g10"><span class="eyebrow">Assignment · 10 marks</span><h1 class="h1">Paper survey</h1><p class="lede">Your own survey of recent, impactful work in your field, presented to the class as a 15-minute video.</p></div>' +
      '<div class="stats">' + stat('Marks', '10', 'of 100') + stat('Format', '15 min', 'video') + stat('Starts', 'Week 4', 'field dependent') + stat('Rubric', 'TBA', 'to be added') + '</div>' +
      '<section class="stack g16"><h2 class="h2">Requirements</h2><ul class="bullets" style="gap:8px"><li>Make your own survey as a 15-minute video.</li><li>Cover recent, impactful works.</li><li>The class presentation must be a video.</li><li>Field dependent. Starts from week 4.</li></ul></section>' +
      '<section class="stack g16"><div class="row g10"><h2 class="h2">Week pairings</h2><span class="bd" style="border-color:#e4e4e7;color:#71717a">To be confirmed</span></div><div class="row wrap g8">' + pairs + '</div></section>' +
      '<section class="stack g16"><div class="between wrap"><div class="stack g4"><h2 class="h2">Available papers</h2><span class="muted" style="font-size:13px">' + avail + ' of ' + SURVEY_PAPERS.length + ' available</span></div><div class="seg sm">' + tabs + '</div></div>' +
      '<div class="card sx"><div style="min-width:420px"><div class="thead cols-sp"><span>Paper</span><span>Topic</span><span>Status</span></div>' + rows + '</div></div>' +
      '<span class="muted" style="font-size:12px">Pick one per team and tell the course teacher; taken papers are marked here.</span></section>' +
      '<section class="card between wrap" style="padding:20px 24px;gap:16px"><div class="stack g4"><span style="font-size:15px;font-weight:600">How to read a paper</span><span class="muted" style="font-size:13px">Covered in the first class, walked through on a real paper.</span></div><button class="reset btn btn-out" data-act="lec:1">Lecture 01 →</button></section></div>';
  }

  function reading() {
    var topics = TOPICS.map(function (t, i) {
      return '<div class="topic-row"><div class="row" style="gap:14px;min-width:0"><span class="mono" style="flex:none;font-size:12px;font-weight:500;color:#a1a1aa">' + pad(i + 1) + '</span><span class="stack g3"><span style="font-size:15px;font-weight:500">' + t[0] + '</span><span class="mono muted" style="font-size:12px">Lectures ' + pad(t[1]) + '–' + pad(t[2]) + '</span></span></div><span class="todo">Papers to be added</span></div>';
    }).join('');
    return '<div class="stack g36"><div class="stack g10"><span class="eyebrow">Resources</span><h1 class="h1">Reading list</h1><p class="lede">Curated papers, links only. Target 20–30 papers from CVPR and EMNLP, 2025–2026, matching class topics.</p></div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr));gap:12px">' +
      '<div class="card read-card"><b>Links only</b><span>Do not commit paper PDFs (copyright).</span></div>' +
      '<div class="card read-card"><b>Sources</b><span class="row wrap g6"><a href="https://arxiv.org/">arXiv</a><span class="dash">·</span><a href="https://aclanthology.org/">ACL Anthology</a><span class="dash">·</span><a href="https://openaccess.thecvf.com/">CVF Open Access</a></span></div>' +
      '<div class="card read-card"><b>Venues</b><span>CVPR, EMNLP · 2025–2026</span></div></div>' +
      '<section class="stack g16"><h2 class="h2">By topic</h2><div class="card hid">' + topics + '</div></section></div>';
  }

  function pubs() {
    var tabs = PUB_TABS.map(function (l) { return '<button class="reset' + (state.pubTab === l ? ' on' : '') + '" data-act="pub:' + l + '">' + l + '</button>'; }).join('');
    return '<div class="stack g32"><div class="stack g10"><span class="eyebrow">From this course</span><h1 class="h1">Publications</h1><p class="lede">Research published by students from this course — work that started as a course project or paper survey and went on to a conference or journal.</p></div>' +
      '<div class="between wrap"><div class="seg">' + tabs + '</div><a class="btn btn-out noul" href="' + GITHUB + '">Submit a publication <span style="color:#a1a1aa">↗</span></a></div>' +
      '<div class="empty"><span class="ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg></span>' +
      '<span style="font-size:15px;font-weight:500">No publications yet' + (state.pubTab !== 'All' ? ' in ' + state.pubTab : '') + '</span><span class="muted" style="font-size:13px;max-width:30em">Student papers from this course will appear here with title, authors, venue and year.</span></div></div>';
  }

  var VIEW = { home: home, info: info, lectures: lectures, lecture: lecture, materials: materials, team: team, project: project, survey: survey, reading: reading, pubs: pubs };

  function render() {
    document.body.style.overflow = state.drawer ? 'hidden' : '';
    root.innerHTML = '<div class="shell"><div class="scrim' + (state.drawer ? ' on' : '') + '" data-act="closeDrawer"></div>' + sidebar() +
      '<div class="frame">' + header() + '<main>' + VIEW[state.page]() + '</main>' +
      '<footer class="foot"><div><span>Advanced Artificial Intelligence · United International University</span><span>Content CC BY 4.0 · Code MIT</span></div></footer></div></div>';
    document.title = (state.page === 'lecture' ? 'Lecture ' + pad(state.lec) : PAGES[state.page][1]) + ' | Advanced AI';
  }

  root.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el) return;
    var a = el.getAttribute('data-act'), i = a.indexOf(':'), k = i < 0 ? a : a.slice(0, i), v = i < 0 ? '' : a.slice(i + 1);
    if (k === 'go') go(v);
    else if (k === 'lec') go('lecture', clamp(parseInt(v, 10)));
    else if (k === 'filter') { state.filter = v; render(); }
    else if (k === 'sp') { state.spTab = v; render(); }
    else if (k === 'pub') { state.pubTab = v; render(); }
    else if (k === 'acc') { var n = parseInt(v, 10), p = state.open.indexOf(n); if (p > -1) state.open.splice(p, 1); else state.open.push(n); render(); }
    else if (k === 'toggleSide') {
      if (isMobile()) state.drawer = !state.drawer;
      else { state.sidebar = !state.sidebar; try { localStorage.setItem(SIDE_KEY, state.sidebar ? '1' : '0'); } catch (x) {} }
      render();
    }
    else if (k === 'closeDrawer') { state.drawer = false; render(); }
    else if (k === 'toggleLecs') { state.lecList = !state.lecList; render(); }
  });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && state.drawer) { state.drawer = false; render(); } });
  window.addEventListener('resize', function () { if (state.drawer && !isMobile()) { state.drawer = false; render(); } });
  window.addEventListener('popstate', function () { parseHash(); render(); });
  parseHash();
  render();
})();
