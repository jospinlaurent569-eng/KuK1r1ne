// ===== Checkout =====
const PROMO_CODES = { 'LUXE10': 0.10, 'BIENVENUE5': 0.05, 'LUXE218': 0.218 };

function validateField(input) {
  if (input.type === 'checkbox') {
    const errorEl = document.getElementById('cgv-error');
    const c = t('checkout');
    const msg = (input.required && !input.checked) ? c.errCgv : '';
    if (errorEl) errorEl.textContent = msg;
    return !msg;
  }
  const wrap = input.closest('.form-field');
  if (!wrap) return true;
  const errorEl = wrap.querySelector('.field-error');
  const c = t('checkout');
  let msg = '';
  const val = input.value.trim();

  if (input.required && !val) msg = c.errRequired;
  else if (input.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) msg = c.errEmail;
  else if (input.name === 'telephone' && val && !/^\+?[0-9\s]{8,16}$/.test(val)) msg = c.errPhone;
  else if (input.name === 'codePostal' && val && !/^[0-9A-Za-z\- ]{3,10}$/.test(val)) msg = c.errZip;

  wrap.classList.toggle('invalid', !!msg);
  if (errorEl) errorEl.textContent = msg;
  return !msg;
}

function renderCheckoutChrome() {
  const c = t('checkout');
  const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  set('checkout-eyebrow', c.eyebrow); set('checkout-title', c.title); set('checkout-section-title', c.sectionTitle);
  const backBtn = document.getElementById('checkout-back');
  if (backBtn) backBtn.innerHTML = `${icon('arrowLeft')} ${t('cart.viewCatalog')}`;
  set('lbl-nom', c.name + ' *'); set('lbl-prenom', c.firstname + ' *'); set('lbl-email', c.email + ' *');
  set('lbl-telephone', c.phone + ' *'); set('lbl-adresse', c.address + ' *'); set('lbl-cp', c.zip + ' *');
  set('lbl-ville', c.city + ' *'); set('lbl-pays', c.country + ' *');
  const cgvRow = document.getElementById('cgv-row');
  if (cgvRow) cgvRow.innerHTML = `<input type="checkbox" name="cgv" required> ${c.cgvPre} <a href="cgv.html" target="_blank">${c.cgvLink}</a> ${c.cgvAnd} <a href="rgpd.html" target="_blank">${c.rgpdLink}</a>`;
  const submitBtn = document.getElementById('checkout-submit');
  if (submitBtn) submitBtn.innerHTML = `${icon('whatsapp')} ${c.submit}`;
  set('summary-title', c.summaryTitle);
  const promoInput = document.getElementById('promo-code');
  if (promoInput) promoInput.placeholder = c.promoPlaceholder;
  const applyBtn = document.getElementById('apply-promo');
  if (applyBtn) applyBtn.textContent = t('common.apply');
  set('checkout-note', c.note);
  set('gallery-eyebrow', c.galleryEyebrow); set('gallery-title', c.galleryTitle); set('gallery-sub', c.gallerySub);
}

// Galerie photo + lightbox (page checkout) — namespace dédié pour ne jamais interférer
// avec le composant .lightbox-overlay utilisé ailleurs sur le site (photos avis clients).
function initPhotoGallery() {
  const items = [...document.querySelectorAll('.gallery-grid-item')];
  if (!items.length) return;
  const lightbox = document.getElementById('checkout-gallery-lightbox');
  const img = document.getElementById('cgl-img');
  const closeBtn = document.getElementById('cgl-close');
  const prevBtn = document.getElementById('cgl-prev');
  const nextBtn = document.getElementById('cgl-next');
  if (!lightbox || !img) return;
  prevBtn.innerHTML = icon('chevronLeft');
  nextBtn.innerHTML = icon('chevronRight');

  let idx = 0;
  const open = i => {
    idx = (i + items.length) % items.length;
    img.src = items[idx].dataset.full;
    img.alt = items[idx].querySelector('img')?.alt || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  items.forEach((el, i) => el.addEventListener('click', () => open(i)));
  closeBtn?.addEventListener('click', close);
  prevBtn?.addEventListener('click', () => open(idx - 1));
  nextBtn?.addEventListener('click', () => open(idx + 1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') open(idx - 1);
    if (e.key === 'ArrowRight') open(idx + 1);
  });
}

// Carrousel de réassurance (origine Chine, usines partenaires, pièces & garantie)
function renderTrustCarousel() {
  const track = document.getElementById('trust-track');
  if (!track) return;
  const c = t('checkout');
  const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  set('trust-eyebrow', c.trustEyebrow);
  set('trust-title', c.trustTitle);
  set('trust-sub', c.trustSub);

  const imgSlide = `
    <div class="trust-slide-img">
      <img src="assets/images/trust/import-chine-europe.jpg" alt="${c.trustTitle}" loading="lazy">
      <span class="trust-badge">${icon('truck')} Import Chine → Europe</span>
    </div>`;
  const cardSlides = (c.trustSlides || []).map(s => `
    <div class="trust-slide">
      ${icon(s.icon)}
      <h4>${s.title}</h4>
      <p>${s.text}</p>
    </div>`).join('');

  track.innerHTML = imgSlide + cardSlides;
  const root = track.closest('[data-carousel]');
  if (root) { root.dataset.carInit = ''; initCarousel(root); }
}

function initCheckoutForm() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  renderCheckoutChrome();
  initPhotoGallery();

  const paysSel = form.querySelector('[name="pays"]');
  if (paysSel) {
    const current = paysSel.value;
    paysSel.innerHTML = Object.keys(LIVRAISONS).map(p => `<option value="${p}">${p}</option>`).join('');
    if (current) paysSel.value = current;
  }

  form.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
  });

  renderOrderSummary();

  paysSel?.addEventListener('change', renderOrderSummary);

  document.getElementById('apply-promo')?.addEventListener('click', () => {
    const codeInput = document.getElementById('promo-code');
    const code = codeInput.value.trim().toUpperCase();
    const c = t('checkout');
    if (PROMO_CODES[code]) {
      sessionStorage.setItem('luxe_promo', code);
      showToast(c.promoOk(code) + ` : -${PROMO_CODES[code]*100}%`, 'check');
    } else {
      showToast(c.promoBad, 'alert');
      sessionStorage.removeItem('luxe_promo');
    }
    renderOrderSummary();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const c = t('checkout');
    const inputs = [...form.querySelectorAll('input[required], select[required]')];
    const valid = inputs.map(validateField).every(Boolean);
    if (!valid) { showToast(c.errForm, 'alert'); return; }
    if (cartDetailed().length === 0) { showToast(c.errEmptyCart, 'alert'); return; }

    const data = Object.fromEntries(new FormData(form).entries());
    const pays = data.pays || 'France';
    const livraison = LIVRAISONS[pays] || { delai: '3-5 jours', prix: 15 };
    const sousTotal = cartSubtotal();
    const promo = sessionStorage.getItem('luxe_promo');
    const remise = promo && PROMO_CODES[promo] ? sousTotal * PROMO_CODES[promo] : 0;
    const fraisLivraison = sousTotal >= FREE_SHIP_THRESHOLD ? 0 : livraison.prix;
    const total = Math.round((sousTotal - remise + fraisLivraison) * 100) / 100;

    const commande = {
      nom: data.nom, prenom: data.prenom, email: data.email, telephone: data.telephone,
      adresse: data.adresse, codePostal: data.codePostal, ville: data.ville, pays,
      panier: cartDetailed(), sousTotal, remise, fraisLivraison, delai: livraison.delai,
      codePromo: promo || '', total, suivi: generateTrackingCode()
    };

    sessionStorage.setItem('luxe_last_order', JSON.stringify(commande));
    envoyerCommandeWhatsApp(commande);
    clearCart();
    sessionStorage.removeItem('luxe_promo');
    window.location.href = 'confirmation.html';
  });
}

function renderOrderSummary() {
  const wrap = document.getElementById('order-summary-lines');
  if (!wrap) return;
  const c = t('checkout');
  const items = cartDetailed();
  const sousTotal = cartSubtotal();
  const paysSel = document.querySelector('[name="pays"]');
  const pays = paysSel ? paysSel.value : 'France';
  const livraison = LIVRAISONS[pays] || { delai: '3-5 jours', prix: 15 };
  const fraisLivraison = sousTotal >= FREE_SHIP_THRESHOLD ? 0 : livraison.prix;
  const promo = sessionStorage.getItem('luxe_promo');
  const remise = promo && PROMO_CODES[promo] ? sousTotal * PROMO_CODES[promo] : 0;
  const total = sousTotal - remise + fraisLivraison;

  wrap.innerHTML = items.map(i => `
    <div class="summary-line"><span>${i.produit.marque} ${i.produit.modele} ×${i.qty}</span><span>${formatPrice(i.total)}</span></div>
  `).join('') + `
    <div class="summary-line"><span>${c.subtotal}</span><span>${formatPrice(sousTotal)}</span></div>
    ${remise > 0 ? `<div class="summary-line"><span>${c.discount} (${promo})</span><span>-${formatPrice(remise)}</span></div>` : ''}
    <div class="summary-line"><span>${c.shippingRow(pays, livraison.delai)}</span><span>${fraisLivraison === 0 ? c.free : formatPrice(fraisLivraison)}</span></div>
    <div class="summary-line" style="font-weight:800;font-size:16px;border-bottom:none"><span>${c.total}</span><span>${formatPrice(Math.round(total*100)/100)}</span></div>
  `;
}

document.addEventListener('DOMContentLoaded', initCheckoutForm);
