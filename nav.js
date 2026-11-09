/* Bump to Baby Doula: navigation enhancements (Services dropdown, mobile submenu).
   All destinations are real <a href> links in the HTML, so this file only adds behavior. */
(function () {
  var dd = document.querySelector('.has-dd');
  var page = (location.pathname.split('/').pop() || 'index.html');

  // Highlight "Services" while on any service page
  var servicePages = [];
  document.querySelectorAll('.dd-menu a').forEach(function (a) { servicePages.push(a.getAttribute('href')); });
  if (servicePages.indexOf(page) > -1) {
    document.querySelectorAll('.dd-link, .mob-svc-row > a').forEach(function (a) { a.classList.add('active'); });
  }
  document.querySelectorAll('.dd-menu a, .mob-svc-list a').forEach(function (a) {
    if (a.getAttribute('href') === page) a.setAttribute('aria-current', 'page');
  });

  // Desktop dropdown
  if (dd) {
    var toggle = dd.querySelector('.dd-toggle');
    var menu = dd.querySelector('.dd-menu');
    var links = Array.prototype.slice.call(menu.querySelectorAll('a'));

    function setOpen(open) {
      if (open) dd.classList.remove('dd-suppress');
      dd.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    toggle.addEventListener('click', function () { setOpen(!dd.classList.contains('open')); });
    toggle.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); links[0].focus(); }
    });
    menu.addEventListener('keydown', function (e) {
      var i = links.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); links[(i + 1) % links.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); links[(i - 1 + links.length) % links.length].focus(); }
      else if (e.key === 'Home') { e.preventDefault(); links[0].focus(); }
      else if (e.key === 'End') { e.preventDefault(); links[links.length - 1].focus(); }
    });
    dd.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && (dd.classList.contains('open') || dd.matches(':hover'))) {
        setOpen(false);
        dd.classList.add('dd-suppress');
        toggle.focus();
      }
    });
    dd.addEventListener('mouseleave', function () { dd.classList.remove('dd-suppress'); });
    dd.addEventListener('focusout', function (e) {
      if (!dd.contains(e.relatedTarget)) setOpen(false);
    });
    document.addEventListener('click', function (e) { if (!dd.contains(e.target)) setOpen(false); });
  }

  // Mobile submenu
  var mt = document.querySelector('.mob-svc-toggle');
  var ml = document.getElementById('mob-svc-list');
  if (mt && ml) {
    mt.addEventListener('click', function () {
      var open = mt.getAttribute('aria-expanded') !== 'true';
      mt.setAttribute('aria-expanded', open ? 'true' : 'false');
      ml.hidden = !open;
    });
  }

  // Hamburger state for assistive tech
  var burger = document.querySelector('.hamburger');
  var mob = document.getElementById('mob');
  if (burger && mob) {
    new MutationObserver(function () {
      burger.setAttribute('aria-expanded', mob.classList.contains('open') ? 'true' : 'false');
    }).observe(mob, { attributes: true, attributeFilter: ['class'] });
  }
})();
