// ===== Carrousel horizontal générique (scroll-snap + boutons + dots) =====
function initCarousel(root) {
  const track = root.querySelector('.carousel-track');
  if (!track) return;
  if (root.dataset.carInit === '1') return; // déjà initialisé : le nœud track persiste, les écouteurs restent valides
  root.dataset.carInit = '1';
  const prev = root.querySelector('[data-car-prev]');
  const next = root.querySelector('[data-car-next]');
  const dotsWrap = root.querySelector('.carousel-dots');
  const items = [...track.children];

  function step() {
    const item = track.children[0];
    return item ? item.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 24) : 300;
  }
  function updateButtons() {
    if (prev) prev.disabled = track.scrollLeft <= 4;
    if (next) next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
    if (dotsWrap) {
      const idx = Math.round(track.scrollLeft / step());
      [...dotsWrap.children].forEach((d, i) => d.classList.toggle('active', i === idx));
    }
  }
  prev?.addEventListener('click', () => track.scrollBy({ left: -step() * (root.dataset.scrollBy ? Number(root.dataset.scrollBy) : 1), behavior: 'smooth' }));
  next?.addEventListener('click', () => track.scrollBy({ left: step() * (root.dataset.scrollBy ? Number(root.dataset.scrollBy) : 1), behavior: 'smooth' }));
  track.addEventListener('scroll', debounce(updateButtons, 80));

  if (dotsWrap) {
    dotsWrap.innerHTML = items.map((_, i) => `<span ${i === 0 ? 'class="active"' : ''}></span>`).join('');
    [...dotsWrap.children].forEach((dot, i) => dot.addEventListener('click', () => track.scrollTo({ left: i * step(), behavior: 'smooth' })));
  }
  updateButtons();
  window.addEventListener('resize', debounce(updateButtons, 150));
}

function initAllCarousels() {
  document.querySelectorAll('[data-car-prev]').forEach(b => { if (!b.innerHTML.trim()) b.innerHTML = icon('chevronLeft'); });
  document.querySelectorAll('[data-car-next]').forEach(b => { if (!b.innerHTML.trim()) b.innerHTML = icon('chevronRight'); });
  document.querySelectorAll('[data-carousel]').forEach(initCarousel);
}
