(() => {
  'use strict';
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  const language = document.querySelector('.language');
  const setMenu = open => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    if (open) language.open = false;
    setMenu(open);
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (toggle.getAttribute('aria-expanded') === 'true') {setMenu(false); toggle.focus();}
    if (language.open) {language.open = false; language.querySelector('summary').focus();}
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.header') && toggle.getAttribute('aria-expanded') === 'true') setMenu(false);
    if (!language.contains(event.target)) language.open = false;
  });
  matchMedia('(min-width: 761px)').addEventListener('change', event => {if (event.matches) setMenu(false);});
  const descriptions = {
    supplier: 'Supplier feeds bring product details, pricing and catalogue data into a consistent operating layer.',
    api: 'Product APIs connect external product information with the framework’s catalogue and deployment workflows.',
    catalogue: 'Affiliate catalogues become organised product records, ready to support different commerce experiences.'
  };
  const incoming = document.querySelector('.incoming');
  const drawConnections = () => {
    if (innerWidth <= 760) return;
    const box = incoming.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const target = document.querySelector('.engine').getBoundingClientRect();
    const endY = target.top + target.height / 2 - box.top;
    incoming.querySelector('svg').setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    document.querySelectorAll('[data-source]').forEach(button => {
      const rect = button.getBoundingClientRect();
      const y = rect.top + rect.height / 2 - box.top;
      incoming.querySelector(`[data-route="${button.dataset.source}"]`).setAttribute('d',
        `M0 ${y} C${box.width * .55} ${y} ${box.width * .45} ${endY} ${box.width} ${endY}`);
    });
  };
  document.fonts.ready.then(drawConnections);
  new ResizeObserver(drawConnections).observe(document.querySelector('.network'));
  document.querySelectorAll('[data-source]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-source]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      document.querySelector('#source-description').textContent = descriptions[button.dataset.source];
      incoming.querySelector('.route-status').textContent = 'Via ' + button.textContent.toLowerCase();
      incoming.querySelectorAll('[data-route]').forEach(route => route.classList.toggle('selected', route.dataset.route === button.dataset.source));
    });
  });
  const cookieNote = document.querySelector('.cookie-note');
  let saved;
  try {saved = localStorage.getItem('cookie-consent');} catch {}
  if (!['accepted','rejected'].includes(saved)) cookieNote.hidden = false;
  document.querySelectorAll('[data-consent]').forEach(button => button.addEventListener('click', () => {
    try {localStorage.setItem('cookie-consent', button.dataset.consent);} catch {}
    cookieNote.hidden = true;
  }));
})();
