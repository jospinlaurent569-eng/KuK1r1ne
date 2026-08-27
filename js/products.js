// ===== Rendu produits, filtres, tri, recherche, pagination =====

function productCardHTML(p, listView = false) {
  const fav = getWishlist().includes(p.id) ? 'active' : '';
  const discount = Math.round((1 - p.prix_remise / p.prix_original) * 100);
  return `
  <article class="p-card" data-id="${p.id}">
    <div class="p-media">
      ${p.precommande ? `<span class="p-badge">Précommande</span>` : (discount > 0 ? `<span class="p-badge">-${discount}%</span>` : '')}
      <button class="p-fav ${fav}" data-id="${p.id}" onclick="toggleWishlist(${p.id})" aria-label="Favoris">${icon('heart')}</button>
      <a href="product.html?id=${p.id}">${productMediaTag(p, 0)}</a>
    </div>
    <div class="p-body">
      <div class="p-brand">${p.marque}</div>
      <a href="product.html?id=${p.id}"><h3 class="p-name">${p.modele}</h3></a>
      <div class="p-stars">${starsMarkup(p.note)}<small>${p.note} (${p.avis.length})</small></div>
      <div class="p-price">${discount > 0 ? `<span class="price-old">${formatPriceShort(p.prix_original)}</span>` : ''}<span class="price-new">${formatPrice(p.prix_remise)}</span></div>
      ${listView ? `<p style="font-size:13px;color:var(--ink-soft);margin:8px 0 0;max-width:480px">${p.description.slice(0,120)}...</p>` : ''}
      <div class="p-actions">
        <button class="btn btn-outline btn-sm" onclick="toggleCompareSlot(${p.id})">${t('common.compare')}</button>
        <button class="btn btn-gold btn-sm" onclick="addToCart(${p.id})">${t('common.addToCart')}</button>
      </div>
    </div>
  </article>`;
}

// ===== Squelettes de chargement (skeleton screens) =====
function skeletonCardHTML(listView = false) {
  return `
  <article class="p-card skel-card">
    <div class="p-media"><span class="skel"></span></div>
    <div class="p-body">
      <span class="skel skel-line w40"></span>
      <span class="skel skel-line w80"></span>
      <span class="skel skel-line w55"></span>
      <span class="skel skel-line w30"></span>
    </div>
  </article>`;
}
function renderSkeletonGrid(containerId, count = 6, listView = false) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.classList.toggle('list-view', listView);
  el.innerHTML = Array.from({ length: count }).map(() => skeletonCardHTML(listView)).join('');
}

function renderGrid(list, containerId, listView = false) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.classList.toggle('list-view', listView);
  el.innerHTML = list.map(p => productCardHTML(p, listView)).join('') || `<p style="color:var(--ink-soft)">${t('shop.noResults')}</p>`;
  initScrollReveal(`#${containerId} .p-card`);
}

// ===== Page Shop =====
let shopState = { search: '', marque: '', categorie: '', sort: 'popularite', page: 1, perPage: 12, view: localStorage.getItem('luxe_view') || 'grid' };

function applyFilters() {
  let list = [...PRODUITS];
  if (shopState.search) {
    const q = shopState.search.toLowerCase();
    list = list.filter(p => (p.marque + ' ' + p.modele).toLowerCase().includes(q));
  }
  if (shopState.marque) list = list.filter(p => p.marque === shopState.marque);
  if (shopState.categorie) list = list.filter(p => p.categorie === shopState.categorie);

  switch (shopState.sort) {
    case 'prix_asc': list.sort((a,b) => a.prix_remise - b.prix_remise); break;
    case 'prix_desc': list.sort((a,b) => b.prix_remise - a.prix_remise); break;
    case 'note': list.sort((a,b) => b.note - a.note); break;
    default: list.sort((a,b) => b.popularite - a.popularite);
  }
  return list;
}

function renderShop() {
  const all = applyFilters();
  const visible = all.slice(0, shopState.page * shopState.perPage);
  const commit = () => {
    renderGrid(visible, 'product-grid', shopState.view === 'list');
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) loadMoreBtn.style.display = visible.length < all.length ? 'inline-flex' : 'none';
    const countEl = document.getElementById('result-count');
    if (countEl) countEl.textContent = t('shop.resultCount')(all.length);
  };
  if (shopFirstLoad) {
    renderSkeletonGrid('product-grid', Math.min(shopState.perPage, visible.length || shopState.perPage), shopState.view === 'list');
    clearTimeout(shopRenderTimer);
    shopRenderTimer = setTimeout(() => { shopFirstLoad = false; commit(); }, 280);
    return;
  }
  commit();
}

function renderShopChrome() {
  const marqueSel = document.getElementById('filter-marque');
  const catSel = document.getElementById('filter-categorie');
  const sortSel = document.getElementById('filter-sort');
  const searchInput = document.getElementById('search-input');
  const s = t('shop');

  if (document.getElementById('shop-eyebrow')) document.getElementById('shop-eyebrow').textContent = s.eyebrow;
  if (document.getElementById('shop-title')) document.getElementById('shop-title').textContent = s.title;
  if (searchInput) searchInput.placeholder = s.searchPlaceholder;
  if (loadMoreEl()) loadMoreEl().textContent = s.loadMore;
  const filterTriggerLabel = document.getElementById('filter-trigger-label');
  if (filterTriggerLabel) filterTriggerLabel.textContent = s.filterTriggerLabel;
  const filtersSheetTitle = document.getElementById('filters-sheet-title');
  if (filtersSheetTitle) filtersSheetTitle.textContent = s.filtersSheetTitle;
  const filtersSheetApply = document.getElementById('filters-sheet-apply');
  if (filtersSheetApply) filtersSheetApply.textContent = s.filtersApply;

  document.querySelectorAll('.chip[data-cat]').forEach(chip => {
    const key = { '': 'catAll', moto: 'catMoto', trottinette: 'catTrott', velo: 'catVelo', piece: 'catPiece', accessoire: 'catAcc' }[chip.dataset.cat];
    const ic = CATEGORY_ICON[chip.dataset.cat];
    chip.innerHTML = (ic ? icon(ic) : '') + `<span>${s[key]}</span>`;
  });

  if (marqueSel) marqueSel.innerHTML = `<option value="">${s.allBrands}</option>` + MARQUES.map(m => `<option value="${m}">${m}</option>`).join('');
  if (catSel) {
    catSel.innerHTML = `<option value="">${s.allCats}</option>
      <option value="moto">${s.catMoto}</option><option value="trottinette">${s.catTrott}</option>
      <option value="velo">${s.catVelo}</option><option value="piece">${s.catPiece}</option>
      <option value="accessoire">${s.catAcc}</option>`;
  }
  if (sortSel) {
    sortSel.innerHTML = `<option value="popularite">${s.sortPop}</option><option value="prix_asc">${s.sortPriceAsc}</option>
      <option value="prix_desc">${s.sortPriceDesc}</option><option value="note">${s.sortNote}</option>`;
  }
  const compareLabel = document.getElementById('compare-bar-label');
  if (compareLabel) compareLabel.textContent = s.compareBarLabel;
  const compareGo = document.getElementById('compare-go');
  if (compareGo) compareGo.textContent = s.compareGo;

  const gridBtn = document.querySelector('.view-toggle button[data-view="grid"]');
  const listBtn = document.querySelector('.view-toggle button[data-view="list"]');
  if (gridBtn) { gridBtn.innerHTML = icon('grid'); gridBtn.setAttribute('aria-label', s.gridView); }
  if (listBtn) { listBtn.innerHTML = icon('list'); listBtn.setAttribute('aria-label', s.listView); }

  // restore state values into rebuilt selects
  if (marqueSel) marqueSel.value = shopState.marque;
  if (catSel) catSel.value = shopState.categorie;
  if (sortSel) sortSel.value = shopState.sort;
  document.querySelectorAll('.chip[data-cat]').forEach(c => c.classList.toggle('active', c.dataset.cat === shopState.categorie));
}
function loadMoreEl() { return document.getElementById('load-more'); }

let shopFirstLoad = true;
let shopRenderTimer = null;

function initShopPage() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  renderShopChrome();

  const marqueSel = document.getElementById('filter-marque');
  const catSel = document.getElementById('filter-categorie');
  const sortSel = document.getElementById('filter-sort');
  const searchInput = document.getElementById('search-input');

  const preCat = getQueryParam('categorie');
  if (preCat) { shopState.categorie = preCat; if (catSel) catSel.value = preCat; }
  const preSearch = getQueryParam('q');
  if (preSearch) { shopState.search = preSearch; if (searchInput) searchInput.value = preSearch; }

  marqueSel?.addEventListener('change', e => { shopState.marque = e.target.value; shopState.page = 1; renderShop(); });
  catSel?.addEventListener('change', e => { shopState.categorie = e.target.value; shopState.page = 1; renderShop(); });
  sortSel?.addEventListener('change', e => { shopState.sort = e.target.value; renderShop(); });
  searchInput?.addEventListener('input', debounce(e => { shopState.search = e.target.value; shopState.page = 1; renderShop(); }, 200));

  document.querySelectorAll('.chip[data-cat]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip[data-cat]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      shopState.categorie = chip.dataset.cat;
      if (catSel) catSel.value = chip.dataset.cat;
      shopState.page = 1;
      renderShop();
    });
  });

  document.getElementById('load-more')?.addEventListener('click', () => { shopState.page++; renderShop(); });

  document.querySelectorAll('.view-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-toggle button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      shopState.view = btn.dataset.view;
      localStorage.setItem('luxe_view', shopState.view);
      renderShop();
    });
  });
  document.querySelector(`.view-toggle button[data-view="${shopState.view}"]`)?.classList.add('active');

  // Tiroir "bottom sheet" filtres & tri (mobile)
  const filtersBar = document.getElementById('filters-bar');
  const filtersOverlay = document.getElementById('filters-overlay');
  const openFiltersBtn = document.getElementById('open-filters-mobile');
  const closeFiltersBtn = document.getElementById('filters-sheet-close');
  const applyFiltersBtn = document.getElementById('filters-sheet-apply');
  if (closeFiltersBtn) closeFiltersBtn.innerHTML = icon('close');
  const openFiltersSheet = () => { filtersBar?.classList.add('open'); filtersOverlay?.classList.add('open'); };
  const closeFiltersSheet = () => { filtersBar?.classList.remove('open'); filtersOverlay?.classList.remove('open'); };
  openFiltersBtn?.addEventListener('click', openFiltersSheet);
  closeFiltersBtn?.addEventListener('click', closeFiltersSheet);
  filtersOverlay?.addEventListener('click', closeFiltersSheet);
  applyFiltersBtn?.addEventListener('click', closeFiltersSheet);
  enableSheetDrag(filtersBar, '.sheet-handle', closeFiltersSheet);

  renderShop();
}

// ===== Home featured (carrousel horizontal) =====
function initHomeFeatured() {
  const el = document.getElementById('featured-grid');
  if (!el) return;
  const featured = PRODUITS.filter(p => p.featured).slice(0, 8);
  const list = featured.length ? featured : PRODUITS.slice(0,8);
  el.innerHTML = Array.from({ length: Math.min(6, list.length) }).map(() => skeletonCardHTML()).join('');
  setTimeout(() => {
    el.innerHTML = list.map(p => productCardHTML(p)).join('');
    initScrollReveal('#featured-grid .p-card');
    const root = el.closest('[data-carousel]');
    if (root) initCarousel(root);
  }, 220);
}

// ===== Comparateur =====
function getCompare() { return JSON.parse(sessionStorage.getItem('luxe_compare') || '[]'); }
function toggleCompareSlot(id) {
  let list = getCompare();
  if (list.includes(id)) list = list.filter(x => x !== id);
  else { if (list.length >= 3) { showToast(t('compare.max3'), 'alert'); return; } list.push(id); }
  sessionStorage.setItem('luxe_compare', JSON.stringify(list));
  renderCompareBar();
}
function renderCompareBar() {
  const bar = document.getElementById('compare-bar');
  if (!bar) return;
  const list = getCompare();
  bar.classList.toggle('open', list.length > 0);
  const slots = document.getElementById('compare-slots');
  slots.innerHTML = list.map(id => {
    const p = findProduct(id);
    return `<div class="compare-slot">${icon(CATEGORY_ICON[p.categorie])}<span class="x" onclick="toggleCompareSlot(${id})">×</span></div>`;
  }).join('') + Array.from({length: 3 - list.length}).map(() => `<div class="compare-slot">+</div>`).join('');
  const btn = document.getElementById('compare-go');
  if (btn) btn.disabled = list.length < 2;
}
function goCompare() {
  const list = getCompare();
  if (list.length < 2) return;
  window.location.href = 'compare.html?ids=' + list.join(',');
}

document.addEventListener('DOMContentLoaded', () => {
  initShopPage(); // liaison des filtres (une seule fois) ; renderApp() dans app.js repeint le contenu traduit
});
