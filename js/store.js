/* ============================================================================
   Taqdeer House — STOREFRONT only (index.html)
   Loads js/common.js first. No admin code lives on this page.
   ========================================================================== */

const storeFilter = { category: 'All', search: '', best: false, flash: false, inStock: false };
let cart = [];
let checkoutItems = [];

async function loadAll() {
  try {
    await loadData();
    renderStorefront();
  } catch (err) {
    console.error(err);
    $('productGrid').innerHTML = '<p class="empty-note">ডাটা লোড হয়নি — ইন্টারনেট চেক করে পেজ রিফ্রেশ করুন। (' + esc(err.message) + ')</p>';
  }
}

/* ============================== Storefront ================================= */
function visibleProducts() {
  const f = storeFilter;
  return state.products.filter((p) => {
    if (!p.isActive) return false;
    if (f.category !== 'All' && p.category !== f.category) return false;
    if (f.best && !p.isBestSeller) return false;
    if (f.flash && !p.isFlashSale) return false;
    if (f.inStock && !(p.stock > 0)) return false;
    if (f.search && !(p.name + ' ' + p.category + ' ' + (p.description || '')).toLowerCase().includes(f.search)) return false;
    return true;
  });
}

function priceHtml(p) {
  if (p.price == null) return '<span class="price-enquiry">দাম জানতে WhatsApp করুন</span>';
  return '<span class="product-price">' + taka(p.price) +
    (p.oldPrice ? '<s>' + taka(p.oldPrice) + '</s>' : '') + '</span>';
}
function stockHtml(p) {
  if (p.price == null) return '';
  if (p.stock <= 0) return '<span class="stock-out">স্টক শেষ</span>';
  if (p.stock <= 5) return '<span class="stock-low">মাত্র ' + p.stock + ' টি আছে</span>';
  return '';
}

function productCard(p) {
  const thumb = p.imageUrl
    ? '<img src="' + esc(p.imageUrl) + '" alt="' + esc(p.name) + '">'
    : esc(initials(p.name));
  const badges = (p.isBestSeller ? '<span class="badge best">★ Best Seller</span>' : '') +
    (p.isFlashSale ? '<span class="badge flash">⚡ Flash Sale</span>' : '');
  return '<article class="product-card">' +
    '<div class="product-thumb">' + thumb + badges + '</div>' +
    '<div class="product-body">' +
      '<h3>' + esc(p.name) + '</h3>' +
      '<span class="product-cat">' + esc(p.category) + ' • Size: ' + esc((p.sizes || []).join(' - ')) + '</span>' +
      priceHtml(p) + stockHtml(p) +
      '<p class="product-desc">' + esc(p.description || '') + '</p>' +
      '<button class="btn btn-dark" onclick="openProduct(\'' + p.id + '\')">অর্ডার করুন</button>' +
    '</div></article>';
}

function renderStorefront() {
  // Category chips + sidebar
  const counts = {};
  state.products.forEach((p) => { if (p.isActive) counts[p.category] = (counts[p.category] || 0) + 1; });
  const cats = ['All', ...state.categories.map((c) => c.name)];
  $('categoryChips').innerHTML = cats.map((c) =>
    '<button class="chip' + (storeFilter.category === c ? ' active' : '') + '" onclick="setCategory(\'' + esc(c) + '\')">' +
    esc(c === 'All' ? 'সব প্রোডাক্ট' : c) + '</button>').join('');
  $('categoryList').innerHTML = cats.map((c) =>
    '<li><button class="' + (storeFilter.category === c ? 'active' : '') + '" onclick="setCategory(\'' + esc(c) + '\')">' +
    esc(c === 'All' ? 'সব প্রোডাক্ট' : c) + ' <span class="count">(' + (c === 'All' ? state.products.filter((p) => p.isActive).length : (counts[c] || 0)) + ')</span></button></li>').join('');

  // Grids
  const list = visibleProducts();
  $('gridTitle').textContent = storeFilter.category === 'All' ? 'ALL PRODUCTS' : storeFilter.category.toUpperCase();
  $('productCount').textContent = list.length + ' টি প্রোডাক্ট';
  $('productGrid').innerHTML = list.map(productCard).join('');
  $('gridEmpty').hidden = list.length > 0;

  const best = state.products.filter((p) => p.isActive && p.isBestSeller);
  $('bestGrid').innerHTML = best.length ? best.map(productCard).join('') : '<p class="empty-note">এখনো কোনো Best Selling প্রোডাক্ট নেই।</p>';
  const flash = state.products.filter((p) => p.isActive && p.isFlashSale);
  $('flashGrid').innerHTML = flash.length ? flash.map(productCard).join('') : '<p class="empty-note">এখনো কোনো Flash Sale প্রোডাক্ট নেই।</p>';

  // Announcement + header phone
  const ann = state.settings.announcement || '';
  $('announcement').hidden = !ann;
  $('announcement').textContent = ann;
  $('headerPhone').textContent = state.settings.whatsappNumber || WHATSAPP_DISPLAY;
  $('headerWhatsapp').href = 'https://wa.me/' + waNumber();

  renderCartCount();
}

function setCategory(c) {
  storeFilter.category = c;
  renderStorefront();
  document.getElementById('allProductsSection').scrollIntoView({ behavior: 'smooth' });
}
function applySearch() {
  storeFilter.search = $('searchInput').value.trim().toLowerCase();
  renderStorefront();
}

/* ============================== Product detail / cart ====================== */
let detailSel = { productId: null, color: null, size: null, qty: 1 };

function openProduct(id) {
  const p = state.products.find((x) => x.id === id);
  if (!p) return;
  detailSel = { productId: id, color: (p.colors && p.colors[0]) || null, size: (p.sizes && p.sizes[0]) || null, qty: 1 };
  renderDetail(p);
  openModal('productModal');
}
function renderDetail(p) {
  const colorRow = (p.colors && p.colors.length)
    ? '<p><strong>কালার:</strong></p><div class="option-row">' + p.colors.map((c) =>
        '<button class="option' + (detailSel.color === c ? ' selected' : '') + '" onclick="pickColor(\'' + esc(c) + '\')">' + esc(c) + '</button>').join('') + '</div>'
    : '';
  const sizeRow = '<p><strong>সাইজ:</strong></p><div class="option-row">' + (p.sizes || []).map((s) =>
      '<button class="option' + (detailSel.size === s ? ' selected' : '') + '" onclick="pickSize(\'' + esc(s) + '\')">' + esc(s) + '</button>').join('') + '</div>';
  const canOrder = p.price != null && p.stock > 0;
  const orderBtn = p.price == null
    ? '<a class="wa-btn" href="https://wa.me/' + waNumber() + '?text=' + encodeURIComponent('Assalamu Alaikum! "' + p.name + '" — দাম কত?') + '" target="_blank" rel="noopener">💬 WhatsApp এ দাম জানুন</a>'
    : canOrder
      ? '<button class="btn btn-orange btn-lg btn-block" onclick="buyNow()">অর্ডার করুন</button>'
      : '<button class="btn btn-orange btn-lg btn-block" disabled>স্টক শেষ</button>';
  $('productModalBody').innerHTML =
    '<h3>' + esc(p.name) + '</h3>' +
    '<p class="product-cat">' + esc(p.category) + '</p>' +
    priceHtml(p) + ' ' + stockHtml(p) +
    '<p>' + esc(p.description || '') + '</p>' +
    colorRow + sizeRow +
    '<div class="qty-row"><strong>পরিমাণ:</strong>' +
      '<button onclick="changeQty(-1)">−</button><strong id="detailQty">' + detailSel.qty + '</strong>' +
      '<button onclick="changeQty(1)">＋</button></div>' +
    orderBtn +
    (p.price != null ? '<button class="btn btn-ghost btn-block" style="margin-top:8px" onclick="addToCart()">🛒 কার্টে যোগ করুন</button>' : '');
}
function pickColor(c) { detailSel.color = c; renderDetail(state.products.find((x) => x.id === detailSel.productId)); }
function pickSize(s) { detailSel.size = s; renderDetail(state.products.find((x) => x.id === detailSel.productId)); }
function changeQty(d) {
  const p = state.products.find((x) => x.id === detailSel.productId);
  detailSel.qty = Math.max(1, Math.min(p && p.stock > 0 ? p.stock : 99, detailSel.qty + d));
  $('detailQty').textContent = detailSel.qty;
}
function cartItem(productId, color, size, qty) {
  return { productId, color: color || null, size: size || null, qty };
}
function addToCart() {
  cart.push(cartItem(detailSel.productId, detailSel.color, detailSel.size, detailSel.qty));
  renderCartCount();
  closeModal('productModal');
  openModal('cartDrawer');
  renderCart();
}
function buyNow() {
  checkoutItems = [cartItem(detailSel.productId, detailSel.color, detailSel.size, detailSel.qty)];
  closeModal('productModal');
  openCheckout();
}
function renderCartCount() {
  $('cartCount').textContent = cart.reduce((n, i) => n + i.qty, 0);
}
function renderCart() {
  if (!cart.length) {
    $('cartItems').innerHTML = '<p class="empty-note">কার্ট খালি।</p>';
    $('cartTotal').innerHTML = '';
    return;
  }
  let total = 0, priced = true;
  $('cartItems').innerHTML = cart.map((item, idx) => {
    const p = state.products.find((x) => x.id === item.productId);
    if (!p) return '';
    if (p.price == null) priced = false; else total += p.price * item.qty;
    return '<div class="order-line"><span>' + esc(p.name) +
      (item.color ? ' (' + esc(item.color) + ')' : '') + (item.size ? ', Size: ' + esc(item.size) : '') +
      ' × ' + item.qty + '</span><span>' + (p.price == null ? 'দাম WhatsApp এ' : taka(p.price * item.qty)) +
      ' <button class="btn btn-sm btn-ghost" onclick="removeCart(' + idx + ')">✕</button></span></div>';
  }).join('');
  $('cartTotal').innerHTML = '<div class="order-total"><span>মোট</span><span>' +
    (priced ? taka(total) + ' (+ ডেলিভারি)' : 'WhatsApp এ কনফার্ম করা হবে') + '</span></div>';
}
function removeCart(idx) { cart.splice(idx, 1); renderCart(); renderCartCount(); }

/* ============================== Checkout → WhatsApp ======================== */
function paymentOptions() {
  const s = state.settings, opts = [];
  if (s.codEnabled) opts.push({ value: 'Cash on Delivery', label: 'Cash on Delivery (COD)' });
  if (s.bkashEnabled) opts.push({ value: 'bKash' + (s.bkashNumber ? ' (' + s.bkashNumber + ')' : ''), label: 'bKash' + (s.bkashNumber ? ' — ' + s.bkashNumber : '') });
  if (s.nagadEnabled) opts.push({ value: 'Nagad' + (s.nagadNumber ? ' (' + s.nagadNumber + ')' : ''), label: 'Nagad' + (s.nagadNumber ? ' — ' + s.nagadNumber : '') });
  if (s.rocketEnabled) opts.push({ value: 'Rocket' + (s.rocketNumber ? ' (' + s.rocketNumber + ')' : ''), label: 'Rocket' + (s.rocketNumber ? ' — ' + s.rocketNumber : '') });
  return opts;
}

function checkoutTotals() {
  let subtotal = 0, priced = true;
  checkoutItems.forEach((item) => {
    const p = state.products.find((x) => x.id === item.productId);
    if (!p || p.price == null) priced = false; else subtotal += p.price * item.qty;
  });
  const area = $('coArea').value;
  const charge = area === 'inside' ? Number(state.settings.deliveryInsideDhaka || 0) : Number(state.settings.deliveryOutsideDhaka || 0);
  return { subtotal, charge, priced, total: priced ? subtotal + charge : null };
}

function openCheckout() {
  if (!checkoutItems.length) return;
  const opts = paymentOptions();
  $('coPayment').innerHTML = opts.map((o) => '<option value="' + esc(o.value) + '">' + esc(o.label) + '</option>').join('');
  $('checkoutMsg').textContent = '';
  renderCheckoutSummary();
  openModal('checkoutModal');
}
function renderCheckoutSummary() {
  const t = checkoutTotals();
  $('checkoutSummary').innerHTML = checkoutItems.map((item) => {
    const p = state.products.find((x) => x.id === item.productId);
    if (!p) return '';
    return '<div class="order-line"><span>' + esc(p.name) +
      (item.color ? ' (' + esc(item.color) + ')' : '') + (item.size ? ', Size: ' + esc(item.size) : '') +
      ' × ' + item.qty + '</span><span>' + (p.price == null ? 'দাম WhatsApp এ' : taka(p.price * item.qty)) + '</span></div>';
  }).join('') +
  '<div class="order-line"><span>ডেলিভারি চার্জ</span><span>' + taka(t.charge) + '</span></div>' +
  '<div class="order-total"><span>মোট</span><span>' + (t.priced ? taka(t.total) : 'WhatsApp এ কনফার্ম করা হবে') + '</span></div>';
}

async function submitOrder(ev) {
  ev.preventDefault();
  const msg = $('checkoutMsg');
  const name = $('coName').value.trim(), phone = $('coPhone').value.trim(), address = $('coAddress').value.trim();
  if (!name || !phone || !address) { msg.textContent = 'নাম, মোবাইল ও ঠিকানা — সবগুলো পূরণ করুন।'; return; }
  if (!/^01[3-9][0-9]{8}$/.test(phone)) { msg.textContent = 'সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)।'; return; }
  const t = checkoutTotals();
  // Fallback: if the payment select has no selection, use the first enabled method
  const enabledPayments = paymentOptions();
  const payment = $('coPayment').value || (enabledPayments[0] && enabledPayments[0].value) || 'Cash on Delivery';
  const items = checkoutItems.map((item) => {
    const p = state.products.find((x) => x.id === item.productId);
    return { productId: item.productId, name: p.name, color: item.color, size: item.size, qty: item.qty, price: p.price };
  });
  const order = {
    orderId: genOrderId(),
    customer: { name, phone, address },
    deliveryArea: $('coArea').value,
    deliveryCharge: t.charge,
    payment,
    items, subtotal: t.priced ? t.subtotal : null, total: t.total, priced: t.priced,
    status: 'Pending', createdAt: Date.now()
  };
  msg.textContent = 'অর্ডার পাঠানো হচ্ছে...';
  try {
    const saved = await fbPost('/orders', order);
    order.id = saved.name;
    // Stock decrement — only when the price is set (priced orders)
    if (t.priced) {
      for (const item of checkoutItems) {
        const p = state.products.find((x) => x.id === item.productId);
        if (p) await fbPatch('/products/' + p.id, { stock: Math.max(0, (p.stock || 0) - item.qty) });
      }
    }
    cart = [];
    renderCartCount();
    closeModal('checkoutModal');
    showConfirmation(order);
    loadAll(); // refresh stock
  } catch (err) {
    msg.textContent = 'অর্ডার সেভ হয়নি — ইন্টারনেট চেক করে আবার চেষ্টা করুন। (' + err.message + ')';
  }
}

function showConfirmation(order) {
  const text = formatOrderText(order);
  const url = 'https://wa.me/' + waNumber() + '?text=' + encodeURIComponent(text);
  $('confirmBody').innerHTML =
    '<h3>✅ অর্ডারটি সেভ হয়েছে!</h3>' +
    '<p>অর্ডার আইডি: <strong>' + esc(order.orderId) + '</strong></p>' +
    '<pre style="white-space:pre-wrap;background:#f3f4f6;padding:12px;border-radius:8px;font-size:14px;">' + esc(text) + '</pre>' +
    '<a class="wa-btn" href="' + url + '" target="_blank" rel="noopener">💬 WhatsApp এ অর্ডার পাঠান (' + esc(state.settings.whatsappNumber || WHATSAPP_DISPLAY) + ')</a>' +
    '<p class="muted" style="margin-top:10px">WhatsApp বাটনে চাপ দিলে উপরের লেখাটি তৈরি অবস্থায় খুলবে — শুধু Send চাপলেই হবে।</p>' +
    '<button class="btn btn-ghost btn-block" onclick="closeModal(\'confirmModal\')">বন্ধ করুন</button>';
  openModal('confirmModal');
}

/* ============================== Track order ================================ */
async function trackOrder() {
  const phone = $('trackPhone').value.trim();
  const box = $('trackResults');
  if (!phone) { box.innerHTML = '<p class="form-msg">মোবাইল নম্বর দিন।</p>'; return; }
  box.innerHTML = '<p class="muted">খুঁজছি...</p>';
  try {
    const orders = toObjArray(await fbGet('/orders'));
    const mine = orders.filter((o) => o.customer && o.customer.phone === phone)
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    if (!mine.length) { box.innerHTML = '<p class="empty-note">এই নম্বরে কোনো অর্ডার পাওয়া যায়নি।</p>'; return; }
    box.innerHTML = mine.map((o) =>
      '<div class="order-card"><header><span>' + esc(o.orderId) + '</span><span>' + esc(o.status || 'Pending') + '</span></header>' +
      '<p>' + o.items.map((i) => esc(i.name) + ' × ' + i.qty).join(', ') + '</p>' +
      '<p class="muted">' + (o.priced ? 'মোট: ' + taka(o.total) : 'মোট: WhatsApp এ কনফার্ম করা হবে') + ' • ' + esc(o.payment) + '</p></div>').join('');
  } catch (err) {
    box.innerHTML = '<p class="form-msg">লোড হয়নি — ' + esc(err.message) + '</p>';
  }
}

/* ============================== Nav / init ================================ */
document.querySelectorAll('[data-nav]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const nav = btn.getAttribute('data-nav');
    if (nav === 'bestselling') { storeFilter.best = true; storeFilter.flash = false; renderStorefront(); document.getElementById('bestSection').scrollIntoView({ behavior: 'smooth' }); }
    else if (nav === 'flashsale') { storeFilter.flash = true; storeFilter.best = false; renderStorefront(); document.getElementById('flashSection').scrollIntoView({ behavior: 'smooth' }); }
    else if (nav === 'categories') { document.getElementById('categoriesSection').scrollIntoView({ behavior: 'smooth' }); }
    else if (nav === 'shop') { storeFilter.best = false; storeFilter.flash = false; renderStorefront(); document.getElementById('allProductsSection').scrollIntoView({ behavior: 'smooth' }); }
    else { storeFilter.best = false; storeFilter.flash = false; storeFilter.category = 'All'; renderStorefront(); window.scrollTo(0, 0); }
  });
});

$('searchBtn').addEventListener('click', applySearch);
$('searchInput').addEventListener('input', applySearch);
$('filterBest').addEventListener('change', (e) => { storeFilter.best = e.target.checked; renderStorefront(); });
$('filterFlash').addEventListener('change', (e) => { storeFilter.flash = e.target.checked; renderStorefront(); });
$('filterInStock').addEventListener('change', (e) => { storeFilter.inStock = e.target.checked; renderStorefront(); });

$('cartBtn').addEventListener('click', () => { renderCart(); openModal('cartDrawer'); });
$('cartCheckoutBtn').addEventListener('click', () => {
  if (!cart.length) return;
  checkoutItems = cart.map((i) => ({ ...i }));
  closeModal('cartDrawer');
  openCheckout();
});
$('trackOrderBtn').addEventListener('click', () => openModal('trackModal'));
$('trackSearchBtn').addEventListener('click', trackOrder);

$('checkoutForm').addEventListener('submit', submitOrder);
$('coArea').addEventListener('change', renderCheckoutSummary);

loadAll();
setInterval(loadAll, 5000); // live refresh every 5 seconds
