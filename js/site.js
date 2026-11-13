// Shubham Tomar portfolio: single-page behaviour. No dependencies.
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Only allow http(s) links from the JSON data files.
  function safeUrl(url) {
    return /^https?:\/\//i.test(url || '') ? url : null;
  }

  /* Theme toggle */
  var themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* Mobile menu */
  var menuToggle = document.getElementById('menu-toggle');
  var navLinks = document.getElementById('nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* Typed prompt in the hero */
  var typed = document.getElementById('typed');
  if (typed && !reduceMotion) {
    var text = typed.dataset.text || typed.textContent;
    var i = 0;
    typed.textContent = '';
    (function tick() {
      typed.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(tick, 110);
    })();
  }

  /* Scroll reveal */
  var revealObserver = null;
  if ('IntersectionObserver' in window && !reduceMotion) {
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  }
  function watch(el) {
    if (revealObserver) revealObserver.observe(el);
    else el.classList.add('in');
  }
  document.querySelectorAll('.reveal').forEach(watch);

  /* Highlight the nav link for the section in view */
  var links = {};
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    links[a.getAttribute('href').slice(1)] = a;
  });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        Object.keys(links).forEach(function (id) {
          links[id].classList.toggle('active', id === entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });
  }

  /* Projects */
  var projectList = document.getElementById('project-list');
  if (projectList) {
    fetch('data/projects.json')
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (projects) {
        projectList.innerHTML = projects.map(function (p) {
          var github = safeUrl(p.githubUrl);
          var demo = safeUrl(p.demoUrl);
          var linkHtml =
            (github ? '<a href="' + escapeHtml(github) + '" target="_blank" rel="noopener noreferrer">code ↗</a>' : '') +
            (demo ? '<a href="' + escapeHtml(demo) + '" target="_blank" rel="noopener noreferrer">live ↗</a>' : '');
          var tech = (p.technologies || []).map(function (t) {
            return '<span>' + escapeHtml(t) + '</span>';
          }).join('');
          return '<article class="card project reveal">' +
            '<div class="project-top"><span class="project-cat">' + escapeHtml(p.category) + '</span>' +
            '<span class="project-links">' + linkHtml + '</span></div>' +
            '<h3>' + escapeHtml(p.title) + '</h3>' +
            '<p class="desc">' + escapeHtml(p.description) + '</p>' +
            '<p class="chips">' + tech + '</p>' +
            '</article>';
        }).join('');
        projectList.querySelectorAll('.reveal').forEach(watch);
      })
      .catch(function () {
        projectList.innerHTML = '<p class="loading">Could not load projects. See <a href="https://github.com/shubham-tomar" target="_blank" rel="noopener noreferrer">GitHub</a>.</p>';
      });
  }

  /* Writing */
  var postList = document.getElementById('post-list');
  if (postList) {
    fetch('data/blogList.json')
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (posts) {
        posts.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
        postList.innerHTML = posts.map(function (p) {
          var url = safeUrl(p.mediumUrl);
          if (!url) return '';
          var d = new Date(p.date);
          var date = isNaN(d) ? p.date : d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          return '<li class="post reveal"><a href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer">' +
            '<span class="post-date">' + escapeHtml(date) + '</span>' +
            '<span class="post-title">' + escapeHtml(p.title) + '</span>' +
            '<span class="post-cat">' + escapeHtml(p.category) + '</span>' +
            '</a></li>';
        }).join('');
        postList.querySelectorAll('.reveal').forEach(watch);
      })
      .catch(function () {
        postList.innerHTML = '<li class="loading">Could not load posts. Read them on <a href="https://medium.com/@shubham-tomar/" target="_blank" rel="noopener noreferrer">Medium</a>.</li>';
      });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
