(function () {
  var COURSES = [
    {
      title: 'Advanced Artificial Intelligence', href: 'advanced-ai/', status: 'current',
      meta: 'Dept. of CSE',
      desc: 'Modern deep learning through lectures, paper reading and a term project.',
      topics: ['GAN', 'Transformers', 'Diffusion', 'RAG', 'LLMs'],
      facts: [['Lectures', '14'], ['Assessment', '100 marks'], ['Book', 'Understanding Deep Learning'], ['Project', '25 marks']],
      teacher: 'Dr. Abu Shafin Mohammad Mahdee Jamee', initials: 'ASMMJ',
      teacherRole: 'Assistant Professor, Dept. of CSE & Director, CAIR'
    },
    {
      title: 'Structured Programming Language', href: '', status: 'current',
      meta: 'Dept. of CSE · Laboratory',
      desc: 'Hands-on lab sessions in structured programming: writing, testing and debugging programs step by step.',
      topics: ['Loops', 'Functions', 'Arrays', 'Pointers', 'Recursion'],
      facts: [['Lectures', 'TBA'], ['Assessment', 'TBA'], ['Book', 'TBA'], ['Format', 'Laboratory']],
      teacher: 'Hamudi Hasan Sonet', initials: 'HHS',
      teacherRole: 'Part-time Faculty, Dept. of CSE'
    },
    {
      title: 'Introduction to Computer Systems', href: '', status: 'current',
      meta: 'Dept. of CSE',
      desc: 'A first course in programming with C — from writing your first program up to loops.',
      topics: ['C basics', 'Data types', 'Operators', 'Input / output', 'Conditionals', 'Loops'],
      facts: [['Lectures', 'TBA'], ['Assessment', 'TBA'], ['Book', 'TBA'], ['Format', 'Theory']],
      teacher: 'Hamudi Hasan Sonet', initials: 'HHS',
      teacherRole: 'Part-time Faculty, Dept. of CSE'
    }
  ];
  var LABEL = { current: 'Current', past: 'Past' };
  var state = { q: '', filter: 'all', side: window.innerWidth >= 900 };
  try { var sv = localStorage.getItem('teaching-side'); if (sv !== null) state.side = sv === '1'; } catch (e) {}
  var $list = document.getElementById('list'), $filters = document.getElementById('filters'), $q = document.getElementById('q'), $side = document.getElementById('side');

  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var match = function (c) {
    var q = state.q.trim().toLowerCase();
    return !q || [c.title, c.desc].concat(c.topics).join(' ').toLowerCase().indexOf(q) > -1;
  };

  function card(c) {
    var live = !!c.href;
    var inner =
      '<div class="col"><div class="row"><span class="badge b-' + c.status + '">' + LABEL[c.status] + '</span><span class="meta">' + esc(c.meta) + '</span></div>' +
      '<span class="title">' + esc(c.title) + '</span><span class="desc">' + esc(c.desc) + '</span>' +
      (c.topics.length ? '<div class="chips">' + c.topics.map(function (t) { return '<span class="chip">' + esc(t) + '</span>'; }).join('') + '</div>' : '') + '</div>' +
      '<div class="col right"><div class="facts">' + c.facts.map(function (f) { return '<div class="fact"><span class="k">' + esc(f[0]) + '</span><span class="v">' + esc(f[1]) + '</span></div>'; }).join('') + '</div>' +
      '<div class="who"><div class="who-l"><div class="av">' + esc(c.initials) + '</div><div class="who-t"><span class="lbl">Course teacher</span><span class="nm">' + esc(c.teacher) + '</span><span class="rl">' + esc(c.teacherRole) + '</span></div></div>' +
      '<span class="cta ' + (live ? 'on' : 'off') + '">' + (live ? 'Open course →' : 'Page coming soon') + '</span></div></div>';
    return live ? '<a class="course live" href="' + esc(c.href) + '">' + inner + '</a>' : '<div class="course">' + inner + '</div>';
  }

  function sidebar() {
    var count = function (f) { return COURSES.filter(function (c) { return f === 'all' || c.status === f; }).length; };
    var courses = COURSES.map(function (c) {
      var dot = '<span class="s-dot' + (c.status === 'current' ? '' : ' off') + '"></span>';
      return c.href
        ? '<a class="s-item" href="' + esc(c.href) + '">' + dot + '<span class="t">' + esc(c.title) + '</span><span class="h">↗</span></a>'
        : '<span class="s-item soon" title="Page coming soon">' + dot + '<span class="t">' + esc(c.title) + '</span><span class="h">soon</span></span>';
    }).join('');
    var browse = [['all', 'All courses'], ['current', 'Current'], ['past', 'Past']].map(function (f) {
      return '<button type="button" class="s-item' + (state.filter === f[0] ? ' on' : '') + '" data-f="' + f[0] + '"><span class="t">' + f[1] + '</span><span class="h">' + count(f[0]) + '</span></button>';
    }).join('');
    $side.hidden = !state.side;
    $side.innerHTML =
      '<div class="s-brand"><div class="logo">T</div><div class="t"><b>Teaching</b><span>United International University</span></div></div>' +
      '<div class="s-sec"><div class="s-label">Browse</div>' + browse + '</div>' +
      '<div class="s-sec"><div class="s-label">Courses</div>' + courses + '</div>' +
      '<div class="s-sec"><div class="s-label">Links</div><a class="s-item" href="https://github.com/hhsonet/teaching"><span class="t">GitHub</span><span class="h">↗</span></a>' +
      '<a class="s-item" href="https://udlbook.github.io/udlbook/"><span class="t">UDL book</span><span class="h">↗</span></a></div>' +
      '<div class="s-who"><div class="av">HHS</div><div class="t"><b>Hamudi Hasan Sonet</b><span>Part-time Faculty, Dept. of CSE</span></div></div>';
  }

  function render() {
    sidebar();
    var shown = COURSES.filter(function (c) { return match(c) && (state.filter === 'all' || c.status === state.filter); });
    $list.innerHTML = shown.map(card).join('') ||
      '<div class="empty"><b>No courses match “' + esc(state.q) + '”</b><button type="button" id="clear">Clear search</button></div>';
    $filters.innerHTML = [['all', 'All'], ['current', 'Current'], ['past', 'Past']].map(function (f) {
      var n = COURSES.filter(function (c) { return (f[0] === 'all' || c.status === f[0]) && match(c); }).length;
      return '<button type="button" role="tab" data-f="' + f[0] + '" class="' + (state.filter === f[0] ? 'on' : '') + '">' + f[1] + '<span class="n">' + n + '</span></button>';
    }).join('');
  }

  $q.addEventListener('input', function () { state.q = $q.value; render(); });
  var pick = function (e) {
    var b = e.target.closest('button[data-f]');
    if (b) { state.filter = b.getAttribute('data-f'); render(); }
  };
  $filters.addEventListener('click', pick);
  $side.addEventListener('click', pick);
  document.getElementById('toggle').addEventListener('click', function () {
    state.side = !state.side;
    try { localStorage.setItem('teaching-side', state.side ? '1' : '0'); } catch (e) {}
    render();
  });
  $list.addEventListener('click', function (e) {
    if (e.target.id === 'clear') { state.q = ''; $q.value = ''; render(); }
  });
  render();
})();
