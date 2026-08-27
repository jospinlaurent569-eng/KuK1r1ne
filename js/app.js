// ===== App : layout partagé, pages, i18n repaint =====

function navLinks() {
  const n = t('nav');
  return [
    ['index.html', n.home], ['shop.html', n.shop], ['livraison.html', n.delivery],
    ['blog.html', n.blog], ['about.html', n.about], ['faq.html', n.help],
  ];
}

function currentPage() {
  return location.pathname.split('/').pop() || 'index.html';
}

function renderHeader() {
  const el = document.getElementById('site-header');
  if (!el) return;
  const page = currentPage();
  el.innerHTML = `
    <div class="container header-inner">
      <a href="index.html" class="logo"><img class="logo-mark" src="assets/icons/brand/logo-icon.png" alt="Kukir1n" width="54" height="34" loading="eager" fetchpriority="high"><span class="logo-word">KUKIR1N<small>${t('common.brandLine')}</small></span></a>
      <nav class="main-nav">
        ${navLinks().map(([href, label]) => `<a href="${href}" class="${page === href ? 'active' : ''}">${label}</a>`).join('')}
      </nav>
      <div class="header-actions">
        <div class="lang-switch">
          <button class="icon-btn lang-current" aria-label="Langue / Language / Sprache"></button>
          <div class="lang-menu"></div>
        </div>
        <button class="icon-btn mode-toggle" aria-label="Mode sombre/clair"></button>
        <a class="icon-btn header-only-icon" href="wishlist.html" aria-label="Favoris">${icon('heart')}<span class="badge-count wishlist-badge" style="display:none">0</span></a>
        <button class="icon-btn cart-toggle header-only-icon" aria-label="Panier">${icon('cart')}<span class="badge-count cart-badge" style="display:none">0</span></button>
      </div>
      <button class="burger" aria-label="Menu"><span></span></button>
    </div>`;
  initModeToggle();
  initLangSwitch();
  initBurger();
}

function renderCartSidebarShell() {
  const el = document.getElementById('cart-root');
  if (!el) return;
  el.innerHTML = `
    <div class="cart-overlay"></div>
    <aside class="cart-sidebar">
      <div class="sheet-handle" aria-hidden="true"></div>
      <div class="cart-head"><h3>${t('cart.title')}</h3><button class="icon-btn cart-close" aria-label="Fermer">${icon('close')}</button></div>
      <div class="cart-progress"></div>
      <div class="cart-items"></div>
      <div class="cart-footer"></div>
    </aside>`;
  document.querySelector('.cart-toggle')?.addEventListener('click', openCart);
  document.querySelector('.cart-close')?.addEventListener('click', closeCart);
  document.querySelector('.cart-overlay')?.addEventListener('click', closeCart);
  enableSheetDrag(document.querySelector('.cart-sidebar'), '.sheet-handle', closeCart);
}

function renderMobileTabbar() {
  let el = document.getElementById('mobile-tabbar');
  if (!el) {
    el = document.createElement('nav');
    el.id = 'mobile-tabbar';
    el.className = 'mobile-tabbar';
    document.body.appendChild(el);
  }
  const page = currentPage();
  const n = t('nav');
  const tabs = [
    ['index.html', icon('bolt'), n.home],
    ['shop.html', icon('search'), n.shop],
    ['wishlist.html', icon('heart'), t('common.favorites') || 'Favoris'],
    ['cart', icon('cart'), t('cart.title')],
  ];
  el.innerHTML = tabs.map(([href, ic, label]) => {
    if (href === 'cart') {
      return `<button class="tabbar-item tabbar-cart" aria-label="${label}">${ic}<span class="badge-count cart-badge" style="display:none">0</span><small>${label}</small></button>`;
    }
    const badge = href === 'wishlist.html' ? `<span class="badge-count wishlist-badge" style="display:none">0</span>` : '';
    return `<a class="tabbar-item ${page === href ? 'active' : ''}" href="${href}">${ic}${badge}<small>${label}</small></a>`;
  }).join('');
  el.querySelector('.tabbar-cart')?.addEventListener('click', openCart);
}

function renderFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  const f = t('footer');
  el.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <a href="index.html" class="logo"><img class="logo-mark" src="assets/icons/brand/logo-icon.png" alt="Kukir1n" width="48" height="30" loading="lazy"><span class="logo-word">KUKIR1N</span></a>
          <p style="color:var(--ink-soft);font-size:13px;margin-top:10px;max-width:260px">${f.tagline}</p>
          <div class="social-row" style="margin-top:14px">
            <a class="icon-btn" href="#" aria-label="Instagram">${icon('instagram')}</a>
            <a class="icon-btn" href="#" aria-label="Facebook">${icon('facebook')}</a>
          </div>
        </div>
        <div>
          <h5>${f.shopTitle}</h5>
          <ul>
            <li><a href="shop.html?categorie=trottinette">${f.scooters}</a></li>
            <li><a href="shop.html?categorie=velo">${f.bikes}</a></li>
            <li><a href="shop.html?categorie=moto">${f.motos}</a></li>
            <li><a href="shop.html?categorie=piece">${f.parts}</a></li>
            <li><a href="shop.html?categorie=accessoire">${f.accessories}</a></li>
          </ul>
        </div>
        <div>
          <h5>${f.helpTitle}</h5>
          <ul>
            <li><a href="faq.html">${f.faq}</a></li>
            <li><a href="livraison.html">${f.delivery}</a></li>
            <li><a href="garantie.html">${f.warranty}</a></li>
            <li><a href="contact.html">${f.contact}</a></li>
          </ul>
        </div>
        <div>
          <h5>${f.legalTitle}</h5>
          <ul>
            <li><a href="cgv.html">${f.cgv}</a></li>
            <li><a href="rgpd.html">${f.rgpd}</a></li>
            <li><a href="about.html">${f.about}</a></li>
          </ul>
        </div>
        <div>
          <h5>${f.newsletterTitle}</h5>
          <p style="font-size:13px;color:var(--ink-soft)">${f.newsletterText}</p>
          <form class="newsletter-form" id="newsletter-form">
            <input type="email" placeholder="${f.newsletterPlaceholder}" required>
            <button class="btn btn-gold btn-sm" type="submit">OK</button>
          </form>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 Kukir1n. ${f.rights}</span>
        <span>${f.contactLine} <a href="mailto:${CONTACT_EMAIL}" style="color:inherit">${CONTACT_EMAIL}</a></span>
      </div>
    </div>
    <div id="cookie-banner" class="cookie-banner">
      <p>${t('cookie.text')}</p>
      <div class="cookie-actions">
        <button class="btn btn-gold btn-sm" data-cookie="accepted">${t('cookie.accept')}</button>
        <button class="btn btn-outline btn-sm" data-cookie="refused">${t('cookie.refuse')}</button>
      </div>
    </div>`;
  document.getElementById('newsletter-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = this.querySelector('input').value;
    if (email) { newsletterSignup(email); this.reset(); showToast(t('footer.newsletterOk'), 'mail'); }
  });
  initCookieBanner();
}

function typewriterEffect() {
  const el = document.querySelector('.typewriter');
  if (!el) return;
  const text = el.textContent;
  el.textContent = '';
  el.style.borderRight = '2px solid var(--gold)';
  let i = 0;
  const type = () => {
    if (i <= text.length) { el.textContent = text.slice(0, i); i++; setTimeout(type, 42); }
  };
  type();
}

// ===== Page d'accueil =====
function renderHomeContent() {
  const wrap = document.getElementById('home-hero');
  if (!wrap) return;
  const h = t('home');
  document.getElementById('hero-eyebrow').textContent = h.eyebrow;
  document.getElementById('hero-title-top').textContent = h.titleTop;
  document.getElementById('hero-title-bottom').textContent = h.titleBottom;
  document.getElementById('hero-sub').textContent = h.subtitle;
  const statModelsEl = document.getElementById('stat-models');
  if (statModelsEl) statModelsEl.textContent = String(PRODUITS.length);
  document.getElementById('stat-models').nextElementSibling.textContent = h.statModels;
  document.getElementById('stat-brands').nextElementSibling.textContent = h.statBrands;
  document.getElementById('stat-countries').nextElementSibling.textContent = h.statCountries;

  document.getElementById('best-eyebrow').textContent = h.bestEyebrow;
  document.getElementById('best-title').textContent = h.bestTitle;
  document.getElementById('best-viewall').textContent = h.allCatalog;

  document.getElementById('why-eyebrow').textContent = h.whyEyebrow;
  document.getElementById('why-title').textContent = h.whyTitle;
  const feats = [[h.f1t,h.f1d,'speed'],[h.f2t,h.f2d,'truck'],[h.f3t,h.f3d,'shield'],[h.f4t,h.f4d,'headset']];
  document.querySelectorAll('.feature-card').forEach((card, i) => {
    card.innerHTML = `${icon(feats[i][2])}<h4>${feats[i][0]}</h4><p>${feats[i][1]}</p>`;
  });

  document.getElementById('ship-eyebrow').textContent = h.shipEyebrow;
  document.getElementById('ship-title').textContent = h.shipTitle;
  document.getElementById('ship-cta').textContent = h.shipCta;

  document.getElementById('reviews-eyebrow').textContent = h.reviewsEyebrow;
  document.getElementById('reviews-title').textContent = h.reviewsTitle;

  if (!window.__heroTyped) { typewriterEffect(); window.__heroTyped = true; }
  initHomeFeatured();
  renderTestimonials();
  renderShippingBanner();
  renderPromoCarousel();
  initHeroBgCarousel();
}

// Carrousel plein cadre mettant en avant les points forts produit (page d'accueil)
const PROMO_IMAGES = [
  { file: 'assets/images/promo/highlight-specs.jpg', alt: 'Points forts techniques de la trottinette électrique' },
  { file: 'assets/images/promo/light-system.jpg', alt: 'Système d\'éclairage 6 points de la trottinette électrique' },
  { file: 'assets/images/promo/top-speed.jpg', alt: 'Trottinette électrique 45 km/h en usage urbain' },
];
function renderPromoCarousel() {
  const track = document.getElementById('promo-track');
  if (!track) return;
  const h = t('home');
  const slides = h.promoSlides || [];
  track.innerHTML = PROMO_IMAGES.map((img, i) => {
    const s = slides[i] || {};
    return `
    <a class="promo-slide" href="shop.html">
      <span class="promo-bg" style="background-image:url('${img.file}')" aria-hidden="true"></span>
      <img src="${img.file}" alt="${img.alt}" ${i === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} decoding="async">
      <div class="promo-caption">
        <span class="eyebrow">${s.eyebrow || ''}</span>
        <h3>${s.title || ''}</h3>
        <span class="btn btn-gold">${h.ctaShop}</span>
      </div>
    </a>`;
  }).join('');
  const root = track.closest('[data-carousel]');
  if (root) { initCarousel(root); initPromoAutoplay(root); }
}

function initPromoAutoplay(root) {
  if (root.dataset.autoplayInit === '1') return;
  root.dataset.autoplayInit = '1';
  const track = root.querySelector('.promo-track');
  const slideCount = track.children.length;
  if (slideCount < 2) return;
  let timer = null;
  const start = () => {
    stop();
    timer = setInterval(() => {
      const w = track.clientWidth;
      const atEnd = track.scrollLeft >= track.scrollWidth - w - 4;
      track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + w, behavior: 'smooth' });
    }, 5000);
  };
  const stop = () => { if (timer) clearInterval(timer); };
  ['pointerdown', 'touchstart', 'mouseenter'].forEach(ev => root.addEventListener(ev, stop, { passive: true }));
  ['pointerup', 'touchend', 'mouseleave'].forEach(ev => root.addEventListener(ev, start, { passive: true }));
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
  start();
}

// Fondu automatique entre les photos de fond du hero
function initHeroBgCarousel() {
  const root = document.getElementById('hero-bg-carousel');
  if (!root || root.dataset.init === '1') return;
  root.dataset.init = '1';
  const slides = [...root.querySelectorAll('.hero-bg-slide')];
  if (slides.length < 2) return;
  let idx = 0;
  setInterval(() => {
    slides[idx].classList.remove('active');
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add('active');
  }, 5000);
}

// Bannière carrousel "livraison" (image + points clés)
function renderShippingBanner() {
  const track = document.getElementById('shipbanner-track');
  if (!track) return;
  const h = t('home');
  const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  set('shipbanner-eyebrow', h.shipBannerEyebrow);
  set('shipbanner-title', h.shipBannerTitle);

  const imgSlide = `
    <div class="trust-slide-img">
      <img src="assets/images/trust/livraison-europe-banniere.jpg" alt="${h.shipBannerTitle}" loading="lazy">
      <span class="trust-badge">${icon('truck')} ${h.shipBannerTitle}</span>
    </div>`;
  const cardSlides = (h.shipBannerSlides || []).map(s => `
    <div class="trust-slide">
      ${icon(s.icon)}
      <h4>${s.title}</h4>
      <p>${s.text}</p>
    </div>`).join('');

  track.innerHTML = imgSlide + cardSlides;
  const root = track.closest('[data-carousel]');
  if (root) initCarousel(root);
}

// Avis clients agrégés depuis le catalogue, en carrousel
function renderTestimonials() {
  const track = document.getElementById('testi-track');
  if (!track) return;
  const pool = [];
  PRODUITS.forEach(p => p.avis.forEach(a => { if (a.note >= 4 && a.commentaire.length > 25) pool.push({ ...a, produit: `${p.marque} ${p.modele}` }); }));
  pool.sort((a, b) => (b.photo ? 1 : 0) - (a.photo ? 1 : 0));
  const picked = pool.slice(0, 10);
  track.innerHTML = picked.map(a => `
    <div class="testi-card">
      ${a.photo ? `<img src="${a.photo}" alt="Photo client - ${a.client}" loading="lazy" class="testi-photo" onclick="openLightbox('${a.photo}')">` : `<span class="testi-quote">${icon('quote')}</span>`}
      <p>${a.commentaire}</p>
      <div class="testi-foot">
        <div><div class="testi-name">${a.client}</div><div class="testi-product">${a.produit}</div></div>
        ${starsMarkup(a.note)}
      </div>
    </div>`).join('');
  const root = track.closest('[data-carousel]');
  if (root) initCarousel(root);
}

// ===== Fiche produit (avec carrousel d'images) =====
let pdGalleryIndex = 0;
function renderProductDetailPage() {
  const wrap = document.getElementById('product-detail');
  if (!wrap) return;
  const id = Number(getQueryParam('id'));
  const p = findProduct(id);
  const pr = t('product');
  if (!p) { wrap.innerHTML = `<p>${pr.notFound}</p>`; return; }
  trackRecentlyViewed(id);
  pdGalleryIndex = 0;

  document.title = `${p.marque} ${p.modele} | Kukir1n`;
  const bcHome = document.getElementById('bc-home'); if (bcHome) bcHome.textContent = pr.home;
  const bcShop = document.getElementById('bc-shop'); if (bcShop) bcShop.textContent = pr.shop;
  const bcName = document.getElementById('bc-name'); if (bcName) bcName.textContent = p.modele;

  const discount = Math.round((1 - p.prix_remise / p.prix_original) * 100);
  const fav = getWishlist().includes(id) ? 'active' : '';
  const viewers = 3 + (id % 14);
  const images = (p.images && p.images.length ? p.images : [null]);

  const slidesHTML = images.map((img, i) => `
    <div class="slide">
      ${img ? `<img src="${productImageSrc(p, i)}" alt="${p.marque} ${p.modele}" ${i===0?'loading="eager" fetchpriority="high"':'loading="lazy"'} decoding="async" data-fallback-icon="${p.categorie}" onerror="luxeImgFallback(this)">` : `<span class="ph-fallback">${icon(CATEGORY_ICON[p.categorie])}</span>`}
    </div>`).join('');
  const thumbsHTML = images.map((img, i) => `
    <button class="${i===0?'active':''}" data-slide="${i}">
      ${img ? `<img src="${productImageSrc(p, i)}" alt="" loading="lazy" decoding="async" data-fallback-icon="${p.categorie}" onerror="luxeImgFallback(this)">` : `<span class="ph-fallback">${icon(CATEGORY_ICON[p.categorie])}</span>`}
    </button>`).join('');

  wrap.innerHTML = `
    <div class="pd-grid">
      <div>
        <div class="pd-gallery" data-carousel>
          <div class="pd-gallery-track carousel-track" id="pd-track">${slidesHTML}</div>
          ${images.length > 1 ? `<div class="pd-gallery-arrows">
            <button class="carousel-btn" data-car-prev aria-label="Précédent">${icon('chevronLeft')}</button>
            <button class="carousel-btn" data-car-next aria-label="Suivant">${icon('chevronRight')}</button>
          </div>` : ''}
        </div>
        ${images.length > 1 ? `<div class="pd-thumbs" id="pd-thumbs">${thumbsHTML}</div>` : ''}
      </div>
      <div class="pd-info">
        <div class="p-brand">${p.marque} | ${p.gamme}</div>
        <h1>${p.modele}</h1>
        <div class="viewers-badge"><span class="dot"></span>${pr.peopleViewing(viewers)}</div>
        <div class="p-stars">${starsMarkup(p.note)}<small>${p.note} ${pr.outOf5} | ${p.avis.length} ${t('common.reviews')}</small></div>
        <div class="pd-price-row">
          ${discount > 0 ? `<span class="price-old" style="font-size:16px">${formatPriceShort(p.prix_original)}</span>` : ''}
          <span class="price-new">${formatPrice(p.prix_remise)}</span>
          ${discount > 0 ? `<span class="p-badge" style="position:static">-${discount}%</span>` : ''}
        </div>
        <div class="stock-row ${p.precommande ? 'low' : (p.stock < 6 ? 'low' : '')}">${p.precommande ? `${icon('alert')} PRÉCOMMANDE, expédition à partir du ${p.date_expedition}` : `${icon(p.stock < 6 ? 'alert' : 'check')} ${p.stock < 6 ? pr.lowStock(p.stock) : pr.stockOk(p.stock)}`}</div>
        <p style="color:var(--ink-soft)">${p.description}</p>
        <div style="display:flex;align-items:center;gap:14px;margin:var(--space-3) 0">
          <div class="qty-selector">
            <button id="qty-minus">−</button><input type="text" id="qty-val" readonly value="1"><button id="qty-plus">+</button>
          </div>
          <button class="p-fav ${fav}" data-id="${p.id}" onclick="toggleWishlist(${p.id})" style="position:static">${icon('heart')}</button>
        </div>
        <div class="pd-actions">
          <button class="btn btn-gold" id="add-to-cart-btn" style="flex:1.4">${pr.addToCart}</button>
        </div>
        <button class="btn btn-outline btn-block" onclick="toggleCompareSlot(${p.id}); showToast('${pr.addedCompare}','compare')">${icon('compare')} ${pr.addCompare}</button>

        <div class="pd-tabs">
          <button class="active" data-tab="specs">${pr.tabSpecs}</button>
          ${p.video ? `<button data-tab="video">${pr.tabVideo}</button>` : ''}
          <button data-tab="reviews">${pr.tabReviews} (${p.avis.length})</button>
          <button data-tab="shipping">${pr.tabShipping}</button>
        </div>
        <div class="tab-panel active" data-panel="specs">
          <table class="spec-table">${Object.entries(p.caracteristiques).map(([k,v]) => `<tr><td>${pr.specLabels[k] || k.replace(/_/g,' ')}</td><td>${v}</td></tr>`).join('')}</table>
        </div>
        ${p.video ? `<div class="tab-panel" data-panel="video">
          <div class="pd-video-wrap">
            <iframe src="https://www.youtube-nocookie.com/embed/${p.video}" title="${p.marque} ${p.modele} - ${pr.tabVideo}" loading="lazy" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
          </div>
        </div>` : ''}
        <div class="tab-panel" data-panel="reviews">
          ${p.avis.map(a => `<div class="review-item"><div class="review-head"><b>${a.client}</b><span>${starsMarkup(a.note)}</span></div><p style="font-size:13px;color:var(--ink-soft);margin:0 0 ${a.photo ? '8px' : '0'} 0">${a.commentaire}</p>${a.photo ? `<img src="${a.photo}" alt="Photo client - ${a.client}" loading="lazy" class="review-photo" onclick="openLightbox('${a.photo}')">` : ''}</div>`).join('')}
        </div>
        <div class="tab-panel" data-panel="shipping">
          <p style="color:var(--ink-soft);font-size:13px">${pr.shippingText}</p>
        </div>
      </div>
    </div>

    <section class="section" style="padding-top:var(--space-5)">
      <div class="section-head"><div><span class="eyebrow">${pr.similarEyebrow}</span><h2>${pr.similarTitle}</h2></div></div>
      <div class="product-grid" id="similar-grid"></div>
    </section>
  `;

  document.getElementById('qty-minus').addEventListener('click', () => {
    const el = document.getElementById('qty-val'); el.value = Math.max(1, Number(el.value) - 1);
  });
  document.getElementById('qty-plus').addEventListener('click', () => {
    const el = document.getElementById('qty-val'); el.value = Math.min(p.stock, Number(el.value) + 1);
  });
  document.getElementById('add-to-cart-btn').addEventListener('click', () => {
    addToCart(p.id, Number(document.getElementById('qty-val').value));
  });
  wrap.querySelectorAll('.pd-tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      wrap.querySelectorAll('.pd-tabs button').forEach(b => b.classList.remove('active'));
      wrap.querySelectorAll('.tab-panel').forEach(pnl => pnl.classList.remove('active'));
      btn.classList.add('active');
      wrap.querySelector(`[data-panel="${btn.dataset.tab}"]`).classList.add('active');
    });
  });

  // Carrousel galerie + miniatures synchronisées
  const galleryRoot = wrap.querySelector('.pd-gallery');
  const pdTrack = document.getElementById('pd-track');
  const pdThumbs = document.getElementById('pd-thumbs');
  if (galleryRoot && images.length > 1) {
    initCarousel(galleryRoot);
    pdThumbs?.querySelectorAll('button').forEach(th => {
      th.addEventListener('click', () => {
        const i = Number(th.dataset.slide);
        pdTrack.scrollTo({ left: pdTrack.clientWidth * i, behavior: 'smooth' });
      });
    });
    pdTrack.addEventListener('scroll', debounce(() => {
      const i = Math.round(pdTrack.scrollLeft / pdTrack.clientWidth);
      pdThumbs?.querySelectorAll('button').forEach((th, idx) => th.classList.toggle('active', idx === i));
    }, 80));
  }

  const similar = PRODUITS.filter(x => x.categorie === p.categorie && x.id !== p.id).slice(0, 3);
  renderSkeletonGrid('similar-grid', similar.length || 3);
  setTimeout(() => renderGrid(similar, 'similar-grid'), 200);
}

// ===== Historique "récemment consultés" =====
function renderRecentlyViewedSection() {
  const el = document.getElementById('recent-grid');
  if (!el) return;
  const pr = t('product');
  const eyebrowEl = document.getElementById('recent-eyebrow'); if (eyebrowEl) eyebrowEl.textContent = pr.recentEyebrow;
  const titleEl = document.getElementById('recent-title'); if (titleEl) titleEl.textContent = pr.recentTitle;
  const items = getRecentlyViewed().filter(p => p.id !== Number(getQueryParam('id')));
  const section = document.getElementById('recent-section');
  if (!items.length) { if (section) section.style.display = 'none'; return; }
  if (section) section.style.display = '';
  renderSkeletonGrid('recent-grid', Math.min(4, items.length));
  setTimeout(() => renderGrid(items.slice(0,4), 'recent-grid'), 200);
}

// ===== FAQ =====
function renderFaqPage() {
  const wrap = document.getElementById('faq-list');
  if (!wrap) return;
  const f = t('faq');
  document.getElementById('faq-eyebrow').textContent = f.eyebrow;
  document.getElementById('faq-title').textContent = f.title;
  wrap.innerHTML = f.items.map((item, i) => `
    <div class="accordion-item ${i===0?'open':''}">
      <div class="accordion-head"><span>${item.q}</span>${icon('chevronDown')}</div>
      <div class="accordion-body"><p>${item.a}</p></div>
    </div>`).join('');
  wrap.querySelectorAll('.accordion-item').forEach(item => {
    item.querySelector('.accordion-head')?.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      wrap.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

// ===== Blog =====
function renderBlogListPage() {
  const wrap = document.getElementById('blog-list');
  if (!wrap) return;
  const b = t('blog');
  document.getElementById('blog-eyebrow').textContent = b.eyebrow;
  document.getElementById('blog-title').textContent = b.title;
  const iconBySlug = {
    'securite-route': 'shield',
    'entretien-batterie': 'battery',
    'choisir-son-modele': 'compare',
    'reglementation': 'globe'
  };
  const fallbackIcons = ['shield','battery','compare','globe','wrench','truck'];
  wrap.innerHTML = b.list.map((a, i) => `
    <a href="blog-article.html?slug=${a.slug}" class="blog-card">
      <div class="thumb">${icon(iconBySlug[a.slug] || fallbackIcons[i % fallbackIcons.length])}</div>
      <div class="content"><span class="p-brand">${a.cat}</span><h3>${a.title}</h3><p>${a.excerpt}</p></div>
    </a>`).join('');
}

function renderBlogArticlePage() {
  const wrap = document.getElementById('art-body');
  if (!wrap) return;
  const b = t('blog');
  const slug = getQueryParam('slug');
  const art = b.articles[slug] || Object.values(b.articles)[0];
  document.getElementById('art-cat').textContent = art.cat;
  document.getElementById('art-title').textContent = art.title;
  document.title = art.title + ' | Kukir1n';
  wrap.innerHTML = art.body;
  const backEl = document.getElementById('art-back');
  if (backEl) backEl.innerHTML = `${icon('arrowLeft')} ${t('common.backToBlog')}`;
}

// ===== Contact =====
function renderContactChrome() {
  const wrap = document.getElementById('contact-form');
  if (!wrap) return;
  const c = t('contact');
  const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  set('contact-eyebrow', c.eyebrow); set('contact-title', c.title);
  set('lbl-c-nom', c.name + ' *'); set('lbl-c-email', c.email + ' *'); set('lbl-c-message', c.message + ' *');
  const submitBtn = document.getElementById('contact-submit'); if (submitBtn) submitBtn.textContent = c.send;
  set('contact-coords-title', c.coords);
  const hoursEl = document.getElementById('contact-hours'); if (hoursEl) hoursEl.innerHTML = `${icon('clock')} ${c.hours}`;
  const showroomEl = document.getElementById('contact-showroom'); if (showroomEl) showroomEl.innerHTML = `${icon('mappin')} ${c.showroom}`;
  const emailEl = document.getElementById('contact-email-label'); if (emailEl) emailEl.innerHTML = `${icon('mail')} Email : <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>`;
}
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form || form.dataset.bound) return;
  form.dataset.bound = '1';
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form).entries());
    const c = t('contact');
    if (!d.nom || !d.email || !d.message) { showToast(c.errForm, 'alert'); return; }
    contactFormMail(d.nom, d.email, d.message);
    form.reset();
    showToast(c.successToast, 'check');
  });
}

// ===== About =====
function renderAboutPage() {
  const wrap = document.getElementById('about-body');
  if (!wrap) return;
  const a = t('about');
  document.getElementById('about-eyebrow').textContent = a.eyebrow;
  document.getElementById('about-title').textContent = a.title;
  wrap.innerHTML = `
    <p>${a.p1}</p>
    <h2>${a.missionTitle}</h2><p>${a.missionText}</p>
    <h2>${a.valuesTitle}</h2>
    <ul>${a.values.map(v => `<li>${v}</li>`).join('')}</ul>
    <h2>${a.teamTitle}</h2>`;
  const teamWrap = document.getElementById('team-grid');
  const teamIcons = ['user','truck','headset','wrench'];
  if (teamWrap) teamWrap.innerHTML = a.team.map((m,i) => `
    <div class="team-card"><div class="team-avatar">${icon(teamIcons[i % teamIcons.length])}</div><h4>${m.role}</h4><p style="font-size:13px;color:var(--ink-soft)">${m.d}</p></div>`).join('');
}

// ===== CGV / RGPD =====
function renderLegalPage(key, eyebrowId, titleId, bodyId) {
  const wrap = document.getElementById(bodyId);
  if (!wrap) return;
  const l = t(key);
  document.getElementById(eyebrowId).textContent = l.eyebrow;
  document.getElementById(titleId).textContent = l.title;
  wrap.innerHTML = l.sections.map(s => `<h2>${s.h}</h2><p>${s.p}</p>`).join('');
}

// ===== Garantie =====
function renderGarantiePage() {
  const wrap = document.getElementById('garantie-cards');
  if (!wrap) return;
  const g = t('garantie');
  document.getElementById('garantie-eyebrow').textContent = g.eyebrow;
  document.getElementById('garantie-title').textContent = g.title;
  wrap.innerHTML = g.cards.map(c => `<div class="glass-card feature-card">${icon(c.ic)}<h4>${c.h}</h4><p>${c.p}</p></div>`).join('');
  document.getElementById('garantie-how-title').textContent = g.howTitle;
  document.getElementById('garantie-how-text').textContent = g.howText;
  document.getElementById('garantie-sav-title').textContent = g.savTitle;
  document.getElementById('garantie-sav-text').textContent = g.savText;
  const savBtn = document.getElementById('garantie-sav-btn');
  if (savBtn) { savBtn.innerHTML = `${icon('mail')} ${g.savCta}`; savBtn.href = `mailto:${CONTACT_EMAIL}`; }
}

// ===== Livraison (texte statique, hors carte/simulateur) =====
function renderDeliveryStaticText() {
  const wrap = document.getElementById('delivery-hero');
  if (!wrap) return;
  const d = t('delivery');
  document.getElementById('delivery-eyebrow').textContent = d.eyebrow;
  document.getElementById('delivery-title').textContent = d.title;
  document.getElementById('delivery-sub').textContent = d.sub;
  document.getElementById('legend-1').textContent = d.legend1;
  document.getElementById('legend-2').textContent = d.legend2;
  document.getElementById('legend-3').textContent = d.legend3;
  document.getElementById('sim-title').textContent = d.simTitle;
  document.getElementById('lbl-sim-country').textContent = d.country;
  document.getElementById('lbl-sim-zip').textContent = d.zip;
  document.getElementById('sim-cp').placeholder = 'ex: 75001';
  document.getElementById('sim-btn').textContent = d.estimate;
  document.getElementById('all-countries-title').textContent = d.allCountries;
  document.getElementById('th-country').textContent = d.country2;
  document.getElementById('th-delay').textContent = d.delay;
  document.getElementById('th-fees').textContent = d.fees;
  if (window.__deliveryRefresh) window.__deliveryRefresh();
}

// ===== Confirmation =====
let confettiDone = false;
function renderConfirmationPage() {
  const titleWrap = document.getElementById('confirm-title-wrap');
  if (!titleWrap) return;
  const c = t('confirmation');
  document.getElementById('confirm-thanks').textContent = c.thanks;
  document.getElementById('confirm-title').textContent = c.title;
  document.getElementById('confirm-sub').textContent = c.sub;
  document.getElementById('confirm-continue').textContent = c.continueShopping;
  document.getElementById('confirm-home').textContent = c.backHome;

  const wrap = document.getElementById('confirm-details');
  const order = JSON.parse(sessionStorage.getItem('luxe_last_order') || 'null');
  if (wrap && order) {
    wrap.innerHTML = `
      ${order.suivi ? `
      <div class="glass-card" style="text-align:center;margin-top:var(--space-4);border:1px solid var(--gold, #9c7a3c)">
        <div style="font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-soft)">${c.trackingCode}</div>
        <div style="font-size:26px;font-weight:800;letter-spacing:.04em;margin:6px 0">${order.suivi}</div>
        <div style="font-size:13px;color:var(--ink-soft)">${c.trackingNote}</div>
      </div>` : ''}
      <div class="glass-card" style="text-align:left;margin-top:var(--space-4)">
        <div class="summary-line"><span>${c.client}</span><span>${order.nom} ${order.prenom}</span></div>
        <div class="summary-line"><span>${c.delivery}</span><span>${order.pays} | ${order.delai}</span></div>
        <div class="summary-line" style="font-weight:800;border-bottom:none"><span>${c.total}</span><span>${formatPrice(order.total)}</span></div>
      </div>`;
  }
  if (!confettiDone) {
    confettiDone = true;
    const colors = ['#9c7a3c', '#b6934f', '#14151a'];
    for (let i = 0; i < 40; i++) {
      const el = document.createElement('div');
      el.className = 'confetti';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.width = el.style.height = (4 + Math.random() * 5) + 'px';
      el.style.background = colors[i % colors.length];
      el.style.borderRadius = Math.random() > .5 ? '50%' : '2px';
      el.style.animationDuration = (2 + Math.random() * 2) + 's';
      el.style.animationDelay = (Math.random() * 0.6) + 's';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 5000);
    }
  }
}

// ===== Compare page =====
function renderComparePage() {
  const wrap = document.getElementById('compare-wrap');
  if (!wrap) return;
  const c = t('compare');
  document.getElementById('compare-eyebrow').textContent = c.eyebrow;
  document.getElementById('compare-title').textContent = c.title;
  const backBtn = document.getElementById('compare-back');
  if (backBtn) backBtn.innerHTML = `${icon('arrowLeft')} ${t('common.backToShop')}`;
  const ids = (getQueryParam('ids') || '').split(',').map(Number).filter(Boolean);
  const products = ids.map(findProduct).filter(Boolean);
  if (products.length < 2) { wrap.innerHTML = `<p>${c.empty}</p>`; return; }
  const allKeys = [...new Set(products.flatMap(p => Object.keys(p.caracteristiques)))];
  const pr = t('product');
  wrap.innerHTML = `
    <table class="compare-table">
      <tr><th>${c.rowProduct}</th>${products.map(p => `<th>${p.marque} ${p.modele}</th>`).join('')}</tr>
      <tr><td>${c.rowPrice}</td>${products.map(p => `<td>${formatPrice(p.prix_remise)}</td>`).join('')}</tr>
      <tr><td>${c.rowNote}</td>${products.map(p => `<td>${p.note} / 5</td>`).join('')}</tr>
      ${allKeys.map(k => `<tr><td>${pr.specLabels[k] || k.replace(/_/g,' ')}</td>${products.map(p => `<td>${p.caracteristiques[k] || '—'}</td>`).join('')}</tr>`).join('')}
    </table>`;
}

// ===== Wishlist page =====
function renderWishlistPage() {
  const el = document.getElementById('wishlist-grid');
  if (!el) return;
  const w = t('wishlist');
  document.getElementById('wishlist-eyebrow').textContent = w.eyebrow;
  document.getElementById('wishlist-title').textContent = w.title;
  const backBtn = document.getElementById('wishlist-back');
  if (backBtn) backBtn.innerHTML = `${icon('arrowLeft')} ${t('common.backToShop')}`;
  const items = getWishlist().map(findProduct).filter(Boolean);
  if (!items.length) { el.innerHTML = `<div class="empty-state">${icon('heart')}<p>${w.empty}</p><a class="btn btn-gold" href="shop.html">${t('common.discoverShop')}</a></div>`; return; }
  renderGrid(items, 'wishlist-grid');
}

// ===== Master render =====
function renderApp() {
  document.documentElement.lang = currentLang;
  renderHeader();
  renderCartSidebarShell();
  renderFooter();
  renderMobileTabbar();
  updateCartBadge();
  updateWishlistBadge();
  renderCartSidebar();
  renderCompareBar();

  renderHomeContent();
  if (document.getElementById('product-grid') && typeof shopState !== 'undefined') { renderShopChrome(); renderShop(); }
  renderProductDetailPage();
  renderRecentlyViewedSection();
  renderComparePage();
  renderWishlistPage();
  renderConfirmationPage();
  renderDeliveryStaticText();
  renderBlogListPage();
  renderBlogArticlePage();
  renderFaqPage();
  renderContactChrome();
  initContactForm();
  renderAboutPage();
  renderLegalPage('cgv', 'cgv-eyebrow', 'cgv-title', 'cgv-body');
  renderLegalPage('rgpd', 'rgpd-eyebrow', 'rgpd-title', 'rgpd-body');
  renderGarantiePage();
  if (document.getElementById('checkout-form')) { renderCheckoutChrome(); renderOrderSummary(); renderTrustCarousel(); }

  const pageKey = document.body.dataset.page;
  if (pageKey) document.title = (t('meta.' + pageKey) || 'Kukir1n') + ' | Kukir1n';

  initAllCarousels();
}

document.addEventListener('DOMContentLoaded', renderApp);
