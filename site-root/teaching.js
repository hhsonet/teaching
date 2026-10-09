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
  var state = { q: '', filter: 'all' };
  var $list = document.getElementById('list'), $filters = document.getElementById('filters'), $q = document.getElementById('q');

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

  function render() {
    var shown = COURSES.filter(function (c) { return match(c) && (state.filter === 'all' || c.status === state.filter); });
    $list.innerHTML = shown.map(card).join('') ||
      '<div class="empty"><b>No courses match “' + esc(state.q) + '”</b><button type="button" id="clear">Clear search</button></div>';
    $filters.innerHTML = [['all', 'All'], ['current', 'Current'], ['past', 'Past']].map(function (f) {
      var n = COURSES.filter(function (c) { return (f[0] === 'all' || c.status === f[0]) && match(c); }).length;
      return '<button type="button" role="tab" data-f="' + f[0] + '" class="' + (state.filter === f[0] ? 'on' : '') + '">' + f[1] + '<span class="n">' + n + '</span></button>';
    }).join('');
  }

  $q.addEventListener('input', function () { state.q = $q.value; render(); });
  $filters.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-f]');
    if (b) { state.filter = b.getAttribute('data-f'); render(); }
  });
  $list.addEventListener('click', function (e) {
    if (e.target.id === 'clear') { state.q = ''; $q.value = ''; render(); }
  });
  render();
})();
