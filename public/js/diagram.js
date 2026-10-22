(() => {
'use strict';
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
      document.querySelector('#source-description').textContent = button.dataset.description || descriptions[button.dataset.source];
      incoming.querySelector('.route-status').textContent = button.textContent;
      incoming.querySelectorAll('[data-route]').forEach(route => route.classList.toggle('selected', route.dataset.route === button.dataset.source));
    });
  });

})();
