// ===== Utils =====
const WHATSAPP_NUMBER = "491787478161"; // +49 178 7478161 | utilisé uniquement pour l'envoi des commandes
const CONTACT_EMAIL = "contact@luxeshopmanager.com"; // À remplacer par votre adresse réelle

function formatPrice(n) {
  const locale = currentLang === 'de' ? 'de-DE' : (currentLang === 'en' ? 'en-GB' : 'fr-FR');
  const taxSuffix = currentLang === 'de' ? ' € (inkl. MwSt.)' : (currentLang === 'en' ? ' € (incl. VAT)' : ' € TTC');
  return n.toLocaleString(locale) + taxSuffix;
}

// Génère un code de suivi de commande unique côté client.
// Format : KUK-AAMMJJ-XXXX (date du jour + 4 caractères aléatoires alphanumériques),
// combinant l'horodatage et un tirage aléatoire pour garantir un code différent à chaque commande.
function generateTrackingCode() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const datePart = `${String(now.getFullYear()).slice(2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sans caractères ambigus (0/O, 1/I)
  let rand = '';
  for (let i = 0; i < 4; i++) rand += chars[Math.floor(Math.random() * chars.length)];
  return `KUK-${datePart}-${rand}`;
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function starsMarkup(note) {
  const pct = Math.max(0, Math.min(100, (note / 5) * 100));
  const five = Array.from({ length: 5 }).map(() => icon('star')).join('');
  return `<span class="stars">${five}<span class="fill" style="width:${pct}%">${five}</span></span>`;
}

function slugBrand(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function findProduct(id) {
  return PRODUITS.find(p => p.id === Number(id));
}

// Résout l'image d'un produit vers assets/images/produits/, avec repli élégant en icône
function productImageSrc(p, index = 0) {
  const file = p.images && p.images[index];
  if (!file) return null;
  return /^https?:\/\//i.test(file) ? file : `assets/images/produits/${file}`;
}

// Essaie plusieurs extensions courantes pour un même fichier produit (utile pour le dossier
// par produit : le client peut déposer sa photo en .jpg, .jpeg, .png ou .webp sans toucher au code).
const IMG_FALLBACK_EXTS = ['jpg', 'jpeg', 'png', 'webp'];
function nextImageExt(img) {
  const tried = (img.dataset.triedExts || '').split(',').filter(Boolean);
  const current = img.dataset.currentExt;
  if (current) tried.push(current);
  const next = IMG_FALLBACK_EXTS.find(e => !tried.includes(e));
  if (!next) return null;
  img.dataset.triedExts = tried.join(',');
  img.dataset.currentExt = next;
  return img.dataset.basePath + '.' + next;
}

function productMediaTag(p, index = 0, className = '') {
  const file = p.images && p.images[index];
  const fallbackIcon = CATEGORY_ICON[p.categorie] || 'bolt';
  if (!file) return `<span class="ph ${className}">${icon(fallbackIcon)}</span>`;
  const isRemote = /^https?:\/\//i.test(file);
  const src = productImageSrc(p, index);
  if (isRemote) {
    return `<img src="${src}" alt="${p.marque} ${p.modele}" loading="lazy" class="img-lazy ${className}" data-fallback-icon="${p.categorie}" onload="this.classList.add('img-loaded')" onerror="luxeImgFallback(this)"><span class="img-skel skel" aria-hidden="true"></span>`;
  }
  // Chemin local : on tente en cascade .jpg/.jpeg/.png/.webp si l'extension déclarée dans
  // data.js ne correspond pas au fichier réellement déposé par le client dans son dossier produit.
  const basePath = src.replace(/\.[a-z0-9]+$/i, '');
  const declaredExt = (src.match(/\.([a-z0-9]+)$/i) || [,'jpg'])[1].toLowerCase();
  return `<img src="${src}" alt="${p.marque} ${p.modele}" loading="lazy" class="img-lazy ${className}" data-fallback-icon="${p.categorie}" data-base-path="${basePath}" data-current-ext="${declaredExt}" onload="this.classList.add('img-loaded')" onerror="luxeImgFallback(this)"><span class="img-skel skel" aria-hidden="true"></span>`;
}

// Lightbox simple pour agrandir une photo (avis clients, etc.)
function openLightbox(src) {
  let box = document.querySelector('.lightbox-overlay');
  if (!box) {
    box = document.createElement('div');
    box.className = 'lightbox-overlay';
    box.innerHTML = `<img alt="Photo agrandie"><button class="lightbox-close" aria-label="Fermer">${icon('close')}</button>`;
    box.addEventListener('click', (e) => { if (e.target !== box.querySelector('img')) box.classList.remove('open'); });
    document.body.appendChild(box);
  }
  box.querySelector('img').src = src;
  box.classList.add('open');
}

function luxeImgFallback(img) {
  // Cascade d'extensions pour les images produits locales (dossier par produit)
  if (img.dataset.basePath) {
    const next = nextImageExt(img);
    if (next) { img.src = next; return; }
  }
  const span = document.createElement('span');
  span.className = 'ph ' + img.className.replace('img-lazy', '').trim();
  span.innerHTML = icon(CATEGORY_ICON[img.dataset.fallbackIcon] || 'bolt');
  img.nextElementSibling?.classList.contains('img-skel') && img.nextElementSibling.remove();
  img.replaceWith(span);
}

function showToast(message, iconName = 'check') {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `${icon(iconName)}<span>${message}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('out');
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

function debounce(fn, delay = 250) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

// Loader hide
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) setTimeout(() => loader.classList.add('hidden'), 300);
});

// Bottom sheet : glisser vers le bas pour fermer (tactile, façon app native)
function enableSheetDrag(sheetEl, handleSelector, closeFn) {
  if (!sheetEl) return;
  const handle = sheetEl.querySelector(handleSelector) || sheetEl;
  let startY = 0, currentY = 0, dragging = false;

  const onStart = (e) => {
    if (window.innerWidth > 860) return;
    dragging = true;
    startY = (e.touches ? e.touches[0].clientY : e.clientY);
    sheetEl.style.transition = 'none';
  };
  const onMove = (e) => {
    if (!dragging) return;
    currentY = (e.touches ? e.touches[0].clientY : e.clientY) - startY;
    if (currentY < 0) currentY = 0;
    sheetEl.style.transform = `translateY(${currentY}px)`;
  };
  const onEnd = () => {
    if (!dragging) return;
    dragging = false;
    sheetEl.style.transition = '';
    sheetEl.style.transform = '';
    if (currentY > 90) closeFn();
    currentY = 0;
  };
  handle.addEventListener('touchstart', onStart, { passive: true });
  handle.addEventListener('mousedown', onStart);
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchend', onEnd);
  window.addEventListener('mouseup', onEnd);
}

// Scroll reveal for product/feature cards
function initScrollReveal(selector = '.p-card') {
  const items = document.querySelectorAll(selector);
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('in-view'), (i % 12) * 50);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  items.forEach(el => obs.observe(el));
}

// Dark/light mode toggle (persisted) | le clair est le thème par défaut
function initModeToggle() {
  const btn = document.querySelector('.mode-toggle');
  const saved = localStorage.getItem('luxe_theme');
  if (saved === 'dark') document.body.classList.add('dark-mode');
  const paint = () => { if (btn) btn.innerHTML = icon(document.body.classList.contains('dark-mode') ? 'sun' : 'moon'); };
  paint();
  if (btn) {
    btn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('luxe_theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
      paint();
    });
  }
}

// Sélecteur de langue FR / EN / DE
const LANG_LABELS = { fr: 'Français', en: 'English', de: 'Deutsch' };
const LANG_FLAGS = { fr: '🇫🇷', en: '🇬🇧', de: '🇩🇪' };
function initLangSwitch() {
  const root = document.querySelector('.lang-switch');
  if (!root) return;
  const btn = root.querySelector('.lang-current');
  const menu = root.querySelector('.lang-menu');
  if (btn) btn.innerHTML = `${icon('globe')}<span>${currentLang}</span>`;
  if (menu) {
    menu.innerHTML = Object.keys(LANG_LABELS).map(l =>
      `<button data-lang="${l}" class="${l === currentLang ? 'active' : ''}"><span class="flag">${LANG_FLAGS[l]}</span>${LANG_LABELS[l]}</button>`
    ).join('');
    menu.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { setLang(b.dataset.lang); root.classList.remove('open'); }));
  }
  btn?.addEventListener('click', (e) => { e.stopPropagation(); root.classList.toggle('open'); });
  document.addEventListener('click', () => root.classList.remove('open'));
}

// Mobile nav burger
function initBurger() {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.main-nav');
  if (!burger || !nav) return;
  burger.innerHTML = '<span></span>';
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('mobile-open');
    if (open) {
      nav.style.cssText = 'display:flex;flex-direction:column;position:fixed;top:72px;left:0;right:0;background:var(--bg);padding:24px;border-bottom:1px solid var(--line);gap:20px;z-index:400;box-shadow:var(--shadow-pop);';
    } else {
      nav.style.cssText = '';
    }
  });
}

// Cookie / RGPD banner
function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;
  if (!localStorage.getItem('luxe_cookie_consent')) {
    setTimeout(() => banner.classList.add('show'), 900);
  }
  banner.querySelectorAll('[data-cookie]').forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.setItem('luxe_cookie_consent', btn.dataset.cookie);
      banner.classList.remove('show');
    });
  });
}

// Recently viewed
function trackRecentlyViewed(id) {
  let list = JSON.parse(localStorage.getItem('luxe_recent') || '[]');
  list = list.filter(x => x !== id);
  list.unshift(id);
  list = list.slice(0, 8);
  localStorage.setItem('luxe_recent', JSON.stringify(list));
}
function getRecentlyViewed() {
  return JSON.parse(localStorage.getItem('luxe_recent') || '[]').map(findProduct).filter(Boolean);
}

document.addEventListener('DOMContentLoaded', () => {
  initModeToggle();
  initBurger();
  initCookieBanner();
});
