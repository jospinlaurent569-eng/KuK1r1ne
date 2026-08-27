// ===== Panier (localStorage) =====
const CART_KEY = 'luxe_cart';
const WISHLIST_KEY = 'luxe_wishlist';
const FREE_SHIP_THRESHOLD = 500;

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}
function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) existing.qty += qty;
  else cart.push({ id: productId, qty });
  saveCart(cart);
  renderCartSidebar();
  const p = findProduct(productId);
  showToast(`${p ? p.marque + ' ' + p.modele : 'Produit'} | ${t('cart.title')}`, 'cart');
}
function updateCartQty(productId, qty) {
  let cart = getCart();
  if (qty <= 0) { cart = cart.filter(i => i.id !== productId); }
  else { const it = cart.find(i => i.id === productId); if (it) it.qty = qty; }
  saveCart(cart);
  renderCartSidebar();
}
function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
  renderCartSidebar();
}
function cartCount() {
  return getCart().reduce((s, i) => s + i.qty, 0);
}
function cartDetailed() {
  return getCart().map(i => {
    const p = findProduct(i.id);
    return p ? { ...i, produit: p, total: p.prix_remise * i.qty } : null;
  }).filter(Boolean);
}
function cartSubtotal() {
  return cartDetailed().reduce((s, i) => s + i.total, 0);
}
function clearCart() { saveCart([]); }

function updateCartBadge() {
  document.querySelectorAll('.cart-badge').forEach(b => {
    const c = cartCount();
    b.textContent = c;
    b.style.display = c > 0 ? 'flex' : 'none';
  });
}

// Wishlist
function getWishlist() { return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]'); }
function toggleWishlist(id) {
  let list = getWishlist();
  if (list.includes(id)) list = list.filter(x => x !== id);
  else list.push(id);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  document.querySelectorAll(`.p-fav[data-id="${id}"]`).forEach(f => f.classList.toggle('active'));
  updateWishlistBadge();
}
function updateWishlistBadge() {
  document.querySelectorAll('.wishlist-badge').forEach(b => {
    const c = getWishlist().length;
    b.textContent = c;
    b.style.display = c > 0 ? 'flex' : 'none';
  });
}

// Render sidebar
function renderCartSidebar() {
  const itemsWrap = document.querySelector('.cart-items');
  const footer = document.querySelector('.cart-footer');
  const progressWrap = document.querySelector('.cart-progress');
  const titleEl = document.querySelector('.cart-head h3');
  if (titleEl) titleEl.textContent = t('cart.title');
  if (!itemsWrap) return;
  const items = cartDetailed();
  const c = t('cart');

  if (items.length === 0) {
    itemsWrap.innerHTML = `<div class="empty-state">${icon('cart')}<p>${c.empty}</p><a class="btn btn-outline btn-sm" href="shop.html">${c.viewCatalog}</a></div>`;
    if (footer) footer.style.display = 'none';
    if (progressWrap) progressWrap.style.display = 'none';
    return;
  }
  if (footer) footer.style.display = 'block';
  if (progressWrap) progressWrap.style.display = 'block';

  itemsWrap.innerHTML = items.map(i => `
    <div class="cart-item">
      <div class="thumb">${productMediaTag(i.produit, 0)}</div>
      <div class="info">
        <b>${i.produit.marque} ${i.produit.modele}</b>
        <small>${formatPrice(i.produit.prix_remise)} ${c.perUnit}</small>
        <div class="qty-selector">
          <button onclick="updateCartQty(${i.id}, ${i.qty - 1})">−</button>
          <input type="text" readonly value="${i.qty}">
          <button onclick="updateCartQty(${i.id}, ${i.qty + 1})">+</button>
        </div>
      </div>
      <div class="cart-item-price">
        <b style="font-size:13px">${formatPrice(i.total)}</b>
        <br><a class="remove-item" onclick="removeFromCart(${i.id})">${c.remove}</a>
      </div>
    </div>
  `).join('');

  const subtotal = cartSubtotal();
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100);
  if (progressWrap) {
    progressWrap.innerHTML = remaining > 0
      ? `${c.remaining(formatPrice(remaining))}<div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>`
      : `${icon('check')} ${c.unlocked}<div class="progress-track"><div class="progress-fill" style="width:100%"></div></div>`;
  }
  if (footer) {
    footer.innerHTML = `
      <div class="cart-total-row"><span>${c.subtotal}</span><span>${formatPrice(subtotal)}</span></div>
      <a href="checkout.html" class="btn btn-gold btn-block btn-checkout-cta"><span>${c.checkout}</span>${icon('arrowRight')}</a>
      <a href="shop.html" class="btn btn-ghost btn-block">${c.continueShopping}</a>
    `;
  }
}

function openCart() {
  document.querySelector('.cart-sidebar')?.classList.add('open');
  document.querySelector('.cart-overlay')?.classList.add('open');
}
function closeCart() {
  document.querySelector('.cart-sidebar')?.classList.remove('open');
  document.querySelector('.cart-overlay')?.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  updateWishlistBadge();
  renderCartSidebar();
  document.querySelector('.cart-toggle')?.addEventListener('click', openCart);
  document.querySelector('.cart-close')?.addEventListener('click', closeCart);
  document.querySelector('.cart-overlay')?.addEventListener('click', closeCart);
});
