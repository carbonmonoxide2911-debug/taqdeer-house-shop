/* ============================================================================
   Taqdeer House — standalone shop (GitHub Pages ready)
   Data lives in Firebase Realtime Database, accessed ONLY through its public
   REST API (no apiKey / secret is embedded anywhere).
   WhatsApp orders go to 01690090084 -> wa.me/8801690090084
   ========================================================================== */

const FIREBASE_BASE = 'https://taqdeer-house-default-rtdb.firebaseio.com';
const WHATSAPP_DISPLAY = '01690090084';          // shown to users
const WHATSAPP_INTL = '8801690090084';           // wa.me number (880 + 1690090084)

/* ---------- Seed data (used ONLY if Firebase is empty on first load) ----------
   Prices are intentionally null — the owner never published prices.
   Nothing here invents a price or a stock count. ---------------------------- */
const SEED_SETTINGS = {
  announcement: '', codEnabled: true, bkashEnabled: false, bkashNumber: '',
  nagadEnabled: false, nagadNumber: '', rocketEnabled: false, rocketNumber: '',
  deliveryInsideDhaka: 60, deliveryOutsideDhaka: 120,
  whatsappNumber: WHATSAPP_DISPLAY
};
const SEED_CATEGORIES = [
  { id: 'c1', name: 'Ladies Jacket', sortOrder: 0 },
  { id: 'c2', name: 'Winter Collection', sortOrder: 1 },
  { id: 'c3', name: "Men's Winter Collection", sortOrder: 2 },
  { id: 'c4', name: 'Ladies Hoodie', sortOrder: 3 }
];
const SEED_PRODUCTS = [
  { id: 'p01', name: 'Ladies Stylish Denim Jacket', category: 'Ladies Jacket',
    colors: ['Blue/White', 'Pink/White'], sizes: ['M', 'L', 'XL'],
    price: null, oldPrice: null, stock: 0, isActive: true, isBestSeller: true, isFlashSale: false, imageUrl: null,
    description: 'Two colours: Blue/White and Pink/White. Upper: Denim (10 oz), Bottom: Blazer cotton (320 GSM). Size chart — M: Chest 36, Length 23 · L: Chest 38, Length 24 · XL: Chest 40, Length 25.' },
  { id: 'p02', name: "Men's White Long-Sleeve Polo", category: 'Winter Collection',
    colors: [], sizes: ['M', 'L', 'XL', 'XXL'],
    price: null, oldPrice: null, stock: 0, isActive: true, isBestSeller: false, isFlashSale: false, imageUrl: null,
    description: 'White long-sleeve polo with black trim. Winter Collection 2026-27.' },
  { id: 'p03', name: "Men's Navy 'Simple Things' Sweatshirt", category: 'Winter Collection',
    colors: [], sizes: ['M', 'L', 'XL', 'XXL'],
    price: null, oldPrice: null, stock: 0, isActive: true, isBestSeller: false, isFlashSale: false, imageUrl: null,
    description: "Navy sweatshirt with 'Simple things' print. Winter Collection 2026-27." },
  { id: 'p04', name: 'Men\'s Black Half-Zip Hoodie', category: 'Winter Collection',
    colors: [], sizes: ['M', 'L', 'XL', 'XXL'],
    price: null, oldPrice: null, stock: 0, isActive: true, isBestSeller: false, isFlashSale: false, imageUrl: null,
    description: 'Black half-zip hoodie. Winter Collection 2026-27.' },
  { id: 'p05', name: 'Jeep Spirit Mountain-Print Hoodie (Beige/Black)', category: 'Winter Collection',
    colors: [], sizes: ['M', 'L', 'XL', 'XXL'],
    price: null, oldPrice: null, stock: 0, isActive: true, isBestSeller: false, isFlashSale: false, imageUrl: null,
    description: 'Beige/black Jeep Spirit hoodie with mountain print. Winter Collection 2026-27.' },
  { id: 'p06', name: "Men's Light Blue Denim Shirt", category: "Men's Winter Collection",
    colors: [], sizes: ['M', 'L', 'XL', 'XXL'],
    price: null, oldPrice: null, stock: 0, isActive: true, isBestSeller: false, isFlashSale: false, imageUrl: null,
    description: "Light blue denim shirt. Men's Winter Collection 2026-27." },
  { id: 'p07', name: 'EIIA Hoodie — Pursue Quality Life', category: "Men's Winter Collection",
    colors: [], sizes: ['M', 'L', 'XL', 'XXL'],
    price: null, oldPrice: null, stock: 0, isActive: true, isBestSeller: false, isFlashSale: false, imageUrl: null,
    description: "White/black/grey EIIA hoodie with 'PURSUE QUALITY LIFE' print. Men's Winter Collection 2026-27." },
  { id: 'p08', name: 'Jeep Spirit Hoodie (Beige)', category: "Men's Winter Collection",
    colors: [], sizes: ['M', 'L', 'XL', 'XXL'],
    price: null, oldPrice: null, stock: 0, isActive: true, isBestSeller: false, isFlashSale: false, imageUrl: null,
    description: 'Beige Jeep Spirit mountain-print hoodie. Men\'s Winter Collection 2026-27.' },
  { id: 'p09', name: 'Jeep Spirit Hoodie (Cream)', category: "Men's Winter Collection",
    colors: [], sizes: ['M', 'L', 'XL', 'XXL'],
    price: null, oldPrice: null, stock: 0, isActive: true, isBestSeller: false, isFlashSale: false, imageUrl: null,
    description: 'Cream Jeep Spirit hoodie, same mountain design in a lighter colour. Men\'s Winter Collection 2026-27.' },
  { id: 'p10', name: 'Ladies Pink-White Zip-Up Hooded Jacket', category: 'Ladies Hoodie',
    colors: [], sizes: ['M', 'L', 'XL'],
    price: null, oldPrice: null, stock: 0, isActive: true, isBestSeller: false, isFlashSale: false, imageUrl: null,
    description: 'Pink-white zip-up hooded jacket. Ladies Hoodie Collection.' },
  { id: 'p11', name: 'Hello Kitty Pullover Hoodie (Black)', category: 'Ladies Hoodie',
    colors: [], sizes: ['M', 'L', 'XL'],
    price: null, oldPrice: null, stock: 0, isActive: true, isBestSeller: false, isFlashSale: false, imageUrl: null,
    description: 'Black pullover hoodie with Hello Kitty print and brown bow drawstring. Ladies Hoodie Collection.' },
  { id: 'p12', name: 'Hello Kitty Zip-Up Hoodie (Black)', category: 'Ladies Hoodie',
    colors: [], sizes: ['M', 'L', 'XL'],
    price: null, oldPrice: null, stock: 0, isActive: true, isBestSeller: false, isFlashSale: false, imageUrl: null,
    description: 'Black Hello Kitty zip-up hoodie. Ladies Hoodie Collection.' },
  { id: 'p13', name: 'BOWKNOT GANGSTER Hoodie (Pink)', category: 'Ladies Hoodie',
    colors: [], sizes: ['M', 'L', 'XL'],
    price: null, oldPrice: null, stock: 0, isActive: true, isBestSeller: false, isFlashSale: false, imageUrl: null,
    description: 'Pink hoodie with BOWKNOT GANGSTER dollar-bow print. Ladies Hoodie Collection.' },
  { id: 'p14', name: 'Ladies Varsity Jacket (Black-White)', category: 'Ladies Hoodie',
    colors: [], sizes: ['M', 'L', 'XL'],
    price: null, oldPrice: null, stock: 0, isActive: true, isBestSeller: false, isFlashSale: false, imageUrl: null,
    description: 'Black-white varsity jacket. Ladies Hoodie Collection.' }
];

/* ============================== Firebase REST ============================== */
async function fb(path, method = 'GET', body) {
  const res = await fetch(FIREBASE_BASE + path + '.json', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  if (!res.ok) throw new Error('Firebase request failed (' + res.status + ') — internet / rules check korun.');
  return res.json();
}
const fbGet = (p) => fb(p, 'GET');
const fbPut = (p, v) => fb(p, 'PUT', v);
const fbPatch = (p, v) => fb(p, 'PATCH', v);
const fbPost = (p, v) => fb(p, 'POST', v);
const fbDelete = (p) => fb(p, 'DELETE');

/* ============================== State ====================================== */
const state = {
  products: [], categories: [], settings: { ...SEED_SETTINGS }, orders: [],
  filter: { category: 'All', search: '', best: false, flash: false, inStock: false },
  cart: [], checkoutItems: [], seeded: false
};
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const taka = (n) => '৳' + Number(n || 0).toLocaleString('en-US');
const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const genOrderId = () => 'TH-' + Math.random().toString(36).slice(2, 8).toUpperCase();
const waNumber = () => (state.settings.whatsappNumber || WHATSAPP_DISPLAY).replace(/[^0-9]/g, '').replace(/^0/, '880');
const toObjArray = (obj) => obj ? Object.entries(obj).map(([id, v]) => ({ ...v, id })) : [];

/* ============================== Loading ==================================== */
async function seedIfEmpty() {
  const [products, categories, settings] = await Promise.all([
    fbGet('/products'), fbGet('/categories'), fbGet('/settings')
  ]);
  if (!products || Object.keys(products).length === 0) {
    const obj = {}; SEED_PRODUCTS.forEach((p) => { obj[p.id] = { ...p }; delete obj[p.id].id; });
    await fbPut('/products', obj);
  }
  if (!categories || Object.keys(categories).length === 0) {
    const obj = {}; SEED_CATEGORIES.forEach((c) => { obj[c.id] = { name: c.name, sortOrder: c.sortOrder, createdAt: Date.now() }; });
    await fbPut('/categories', obj);
  }
  if (!settings) await fbPut('/settings', SEED_SETTINGS);
}

async function loadAll() {
  try {
    if (!state.seeded) { await seedIfEmpty(); state.seeded = true; }
    const [products, categories, settings, orders] = await Promise.all([
      fbGet('/products'), fbGet('/categories'), fbGet('/settings'), fbGet('/orders')
    ]);
    state.products = toObjArray(products).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    state.categories = toObjArray(categories).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    state.settings = { ...SEED_SETTINGS, ...(settings || {}) };
    state.orders = toObjArray(orders).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    renderAll();
  } catch (err) {
    console.error(err);
    $('productGrid').innerHTML = '<p class="empty-note">ডাটা লোড হয়নি — ইন্টারনেট চেক করে পেজ রিফ্রেশ করুন। (' + esc(err.message) + ')</p>';
  }
}

/* ============================== Storefront ================================= */
function visibleProducts() {
  const f = state.filter;
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
    '<button class="chip' + (state.filter.category === c ? ' active' : '') + '" onclick="setCategory(\'' + esc(c) + '\')">' +
    esc(c === 'All' ? 'সব প্রোডাক্ট' : c) + '</button>').join('');
  $('categoryList').innerHTML = cats.map((c) =>
    '<li><button class="' + (state.filter.category === c ? 'active' : '') + '" onclick="setCategory(\'' + esc(c) + '\')">' +
    esc(c === 'All' ? 'সব প্রোডাক্ট' : c) + ' <span class="count">(' + (c === 'All' ? state.products.filter((p) => p.isActive).length : (counts[c] || 0)) + ')</span></button></li>').join('');

  // Grids
  const list = visibleProducts();
  $('gridTitle').textContent = state.filter.category === 'All' ? 'ALL PRODUCTS' : state.filter.category.toUpperCase();
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
  state.filter.category = c;
  renderStorefront();
  document.getElementById('allProductsSection').scrollIntoView({ behavior: 'smooth' });
}
function applySearch() {
  state.filter.search = $('searchInput').value.trim().toLowerCase();
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
  state.cart.push(cartItem(detailSel.productId, detailSel.color, detailSel.size, detailSel.qty));
  renderCartCount();
  closeModal('productModal');
  openModal('cartDrawer');
  renderCart();
}
function buyNow() {
  state.checkoutItems = [cartItem(detailSel.productId, detailSel.color, detailSel.size, detailSel.qty)];
  closeModal('productModal');
  openCheckout();
}
function renderCartCount() {
  $('cartCount').textContent = state.cart.reduce((n, i) => n + i.qty, 0);
}
function renderCart() {
  if (!state.cart.length) {
    $('cartItems').innerHTML = '<p class="empty-note">কার্ট খালি।</p>';
    $('cartTotal').innerHTML = '';
    return;
  }
  let total = 0, priced = true;
  $('cartItems').innerHTML = state.cart.map((item, idx) => {
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
function removeCart(idx) { state.cart.splice(idx, 1); renderCart(); renderCartCount(); }

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
  state.checkoutItems.forEach((item) => {
    const p = state.products.find((x) => x.id === item.productId);
    if (!p || p.price == null) priced = false; else subtotal += p.price * item.qty;
  });
  const area = $('coArea').value;
  const charge = area === 'inside' ? Number(state.settings.deliveryInsideDhaka || 0) : Number(state.settings.deliveryOutsideDhaka || 0);
  return { subtotal, charge, priced, total: priced ? subtotal + charge : null };
}

function openCheckout() {
  if (!state.checkoutItems.length) return;
  const opts = paymentOptions();
  $('coPayment').innerHTML = opts.map((o) => '<option value="' + esc(o.value) + '">' + esc(o.label) + '</option>').join('');
  $('checkoutMsg').textContent = '';
  renderCheckoutSummary();
  openModal('checkoutModal');
}
function renderCheckoutSummary() {
  const t = checkoutTotals();
  $('checkoutSummary').innerHTML = state.checkoutItems.map((item) => {
    const p = state.products.find((x) => x.id === item.productId);
    if (!p) return '';
    return '<div class="order-line"><span>' + esc(p.name) +
      (item.color ? ' (' + esc(item.color) + ')' : '') + (item.size ? ', Size: ' + esc(item.size) : '') +
      ' × ' + item.qty + '</span><span>' + (p.price == null ? 'দাম WhatsApp এ' : taka(p.price * item.qty)) + '</span></div>';
  }).join('') +
  '<div class="order-line"><span>ডেলিভারি চার্জ</span><span>' + taka(t.charge) + '</span></div>' +
  '<div class="order-total"><span>মোট</span><span>' + (t.priced ? taka(t.total) : 'WhatsApp এ কনফার্ম করা হবে') + '</span></div>';
}

function formatOrderText(o) {
  const lines = [
    'New Order — Taqdeer House',
    'Order ID: ' + o.orderId,
    'Name: ' + o.customer.name,
    'Phone: ' + o.customer.phone,
    'Address: ' + o.customer.address,
    'Delivery: ' + (o.deliveryArea === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka') + ' (' + taka(o.deliveryCharge) + ')',
    'Payment: ' + o.payment,
    ''
  ];
  o.items.forEach((item, i) => {
    lines.push((i + 1) + '. ' + item.name +
      (item.color ? ' (Colour: ' + item.color : '') +
      (item.size ? (item.color ? ', ' : ' (') + 'Size: ' + item.size : '') +
      (item.color || item.size ? ')' : '') +
      ' × ' + item.qty +
      (item.price != null ? ' — ' + taka(item.price * item.qty) : ' — Price to be confirmed'));
  });
  lines.push('');
  if (o.priced) {
    lines.push('Product Price: ' + taka(o.subtotal));
    lines.push('Delivery Charge: ' + taka(o.deliveryCharge));
    lines.push('Total: ' + taka(o.total));
  } else {
    lines.push('Product Price: WhatsApp এ কনফার্ম করা হবে');
    lines.push('Delivery Charge: ' + taka(o.deliveryCharge));
    lines.push('Total: WhatsApp এ কনফার্ম করা হবে');
  }
  return lines.join('\n');
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
  const items = state.checkoutItems.map((item) => {
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
      for (const item of state.checkoutItems) {
        const p = state.products.find((x) => x.id === item.productId);
        if (p) await fbPatch('/products/' + p.id, { stock: Math.max(0, (p.stock || 0) - item.qty) });
      }
    }
    state.cart = [];
    renderCartCount();
    closeModal('checkoutModal');
    showConfirmation(order);
    loadAll(); // refresh stock / orders
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

/* ============================== Admin ====================================== */
function showAdmin() {
  $('storefrontView').hidden = true;
  $('adminView').hidden = false;
  location.hash = 'admin';
  renderAdmin();
  window.scrollTo(0, 0);
}
function showStorefront() {
  $('adminView').hidden = true;
  $('storefrontView').hidden = false;
  location.hash = '';
  renderStorefront();
  window.scrollTo(0, 0);
}

function renderAdmin() {
  const noPrice = state.products.filter((p) => p.price == null);
  $('statProducts').textContent = state.products.length;
  $('statOrders').textContent = state.orders.length;
  $('statSales').textContent = taka(state.orders.filter((o) => o.priced && o.status !== 'Cancelled')
    .reduce((n, o) => n + (o.total || 0), 0));
  $('statNoPrice').textContent = noPrice.length;
  $('noPriceNote').hidden = !noPrice.length;
  if (noPrice.length) {
    $('noPriceNote').textContent = noPrice.length + ' টা প্রোডাক্টের দাম এখনো সেট হয়নি — Edit করে দাম আর স্টক বসিয়ে দিন, তাহলেই কাস্টমার অর্ডার করতে পারবে। ততক্ষণ প্রোডাক্টে WhatsApp এ দাম জানার বাটন দেখাবে।';
  }
  renderAdminProducts();
  renderAdminCategories();
  renderAdminOrders();
  fillPaymentForm();
}

function renderAdminProducts() {
  const q = ($('adminSearch').value || '').toLowerCase();
  const rows = state.products.filter((p) => !q || p.name.toLowerCase().includes(q));
  $('adminProductRows').innerHTML = rows.map((p) =>
    '<tr><td><strong>' + esc(p.name) + '</strong><br><span class="muted">' + esc(p.category) + '</span></td>' +
    '<td>' + esc(p.category) + '</td>' +
    '<td><input type="number" min="0" value="' + (p.price ?? '') + '" placeholder="—" onchange="quickPrice(\'' + p.id + '\', this.value)"></td>' +
    '<td><input type="number" min="0" value="' + (p.stock ?? 0) + '" onchange="quickStock(\'' + p.id + '\', this.value)"></td>' +
    '<td>' + esc((p.sizes || []).join(', ')) + '</td>' +
    '<td>' + (p.isActive ? '<span style="color:green">● Live</span>' : '<span style="color:#999">○ Hidden</span>') + '</td>' +
    '<td><div class="row-actions">' +
      '<button class="btn btn-sm btn-ghost" onclick="openEdit(\'' + p.id + '\')">✏️ Edit</button>' +
      '<button class="btn btn-sm btn-danger" onclick="deleteProduct(\'' + p.id + '\', \'' + esc(p.name.replace(/'/g, '')) + '\')">🗑️</button>' +
    '</div></td></tr>').join('') ||
    '<tr><td colspan="7" class="empty-note">কোনো প্রোডাক্ট পাওয়া যায়নি।</td></tr>';
}

async function quickPrice(id, v) {
  try { await fbPatch('/products/' + id, { price: v === '' ? null : Number(v) }); loadAll(); }
  catch (err) { alert('সেভ হয়নি — ' + err.message); loadAll(); }
}
async function quickStock(id, v) {
  try { await fbPatch('/products/' + id, { stock: Number(v) || 0 }); loadAll(); }
  catch (err) { alert('সেভ হয়নি — ' + err.message); loadAll(); }
}

function openEdit(id) {
  const p = id ? state.products.find((x) => x.id === id) : null;
  $('editTitle').textContent = p ? 'প্রোডাক্ট এডিট করুন' : 'নতুন প্রোডাক্ট যোগ করুন';
  $('editId').value = p ? p.id : '';
  $('editImage').value = (p && p.imageUrl) || '';
  $('editName').value = (p && p.name) || '';
  $('editCategory').innerHTML = state.categories.map((c) =>
    '<option' + (p && p.category === c.name ? ' selected' : '') + '>' + esc(c.name) + '</option>').join('');
  $('editPrice').value = p && p.price != null ? p.price : '';
  $('editOldPrice').value = p && p.oldPrice != null ? p.oldPrice : '';
  $('editStock').value = p ? (p.stock || 0) : 0;
  $('editColors').value = p ? (p.colors || []).join(', ') : '';
  $('editSizes').value = p ? (p.sizes || []).join(', ') : 'M, L, XL';
  $('editDesc').value = (p && p.description) || '';
  $('editBest').checked = !!(p && p.isBestSeller);
  $('editFlash').checked = !!(p && p.isFlashSale);
  $('editActive').checked = !p || p.isActive !== false;
  $('editMsg').textContent = '';
  openModal('editModal');
}

async function saveProduct(ev) {
  ev.preventDefault();
  const msg = $('editMsg');
  const splitList = (v) => v.split(',').map((s) => s.trim()).filter(Boolean);
  const data = {
    name: $('editName').value.trim(),
    category: $('editCategory').value,
    imageUrl: $('editImage').value.trim() || null,
    price: $('editPrice').value === '' ? null : Number($('editPrice').value),
    oldPrice: $('editOldPrice').value === '' ? null : Number($('editOldPrice').value),
    stock: Number($('editStock').value) || 0,
    colors: splitList($('editColors').value),
    sizes: splitList($('editSizes').value),
    description: $('editDesc').value.trim(),
    isBestSeller: $('editBest').checked,
    isFlashSale: $('editFlash').checked,
    isActive: $('editActive').checked
  };
  if (!data.name) { msg.textContent = 'প্রোডাক্টের নাম দিন।'; return; }
  msg.textContent = 'সেভ হচ্ছে...';
  try {
    const id = $('editId').value;
    if (id) {
      await fbPatch('/products/' + id, data);
    } else {
      data.createdAt = Date.now();
      await fbPost('/products', data);
    }
    msg.textContent = '';
    msg.className = 'form-msg ok';
    msg.textContent = '✅ সেভ হয়েছে!';
    closeModal('editModal');
    loadAll();
  } catch (err) {
    msg.className = 'form-msg';
    msg.textContent = 'সেভ হয়নি — ' + err.message;
  }
}

async function deleteProduct(id, name) {
  if (!confirm('"' + name + '" — প্রোডাক্টটি ডিলিট করবেন?')) return;
  try { await fbDelete('/products/' + id); loadAll(); }
  catch (err) { alert('ডিলিট হয়নি — ' + err.message); }
}

/* ---- Categories ---- */
function renderAdminCategories() {
  $('adminCategoryList').innerHTML = state.categories.map((c) => {
    const used = state.products.filter((p) => p.category === c.name).length;
    return '<li><strong>' + esc(c.name) + '</strong><span class="muted">' + used + ' টি প্রোডাক্ট</span>' +
      '<button class="btn btn-sm btn-ghost" onclick="renameCategory(\'' + c.id + '\', \'' + esc(c.name.replace(/'/g, '')) + '\')">✏️ Rename</button>' +
      '<button class="btn btn-sm btn-danger" onclick="deleteCategory(\'' + c.id + '\', \'' + esc(c.name.replace(/'/g, '')) + '\')">🗑️ Delete</button></li>';
  }).join('') || '<li class="empty-note">কোনো ক্যাটাগরি নেই।</li>';
}
async function addCategory() {
  const name = $('newCategoryName').value.trim();
  if (!name) return;
  try {
    await fbPost('/categories', { name, sortOrder: state.categories.length, createdAt: Date.now() });
    $('newCategoryName').value = '';
    loadAll();
  } catch (err) { alert('ক্যাটাগরি যোগ হয়নি — ' + err.message); }
}
async function renameCategory(id, oldName) {
  const name = prompt('নতুন নাম দিন:', oldName);
  if (!name || name.trim() === oldName) return;
  const newName = name.trim();
  try {
    await fbPatch('/categories/' + id, { name: newName });
    for (const p of state.products.filter((x) => x.category === oldName)) {
      await fbPatch('/products/' + p.id, { category: newName });
    }
    loadAll();
  } catch (err) { alert('Rename হয়নি — ' + err.message); }
}
async function deleteCategory(id, name) {
  const used = state.products.filter((p) => p.category === name).length;
  if (used > 0) {
    alert('এই ক্যাটাগরিতে ' + used + ' টি প্রোডাক্ট আছে — আগে প্রোডাক্টগুলোর ক্যাটাগরি বদলে নিন বা ডিলিট করুন।');
    return;
  }
  if (!confirm('"' + name + '" ক্যাটাগরিটি ডিলিট করবেন?')) return;
  try { await fbDelete('/categories/' + id); loadAll(); }
  catch (err) { alert('ডিলিট হয়নি — ' + err.message); }
}

/* ---- Orders ---- */
function renderAdminOrders() {
  $('ordersEmpty').hidden = state.orders.length > 0;
  $('adminOrderList').innerHTML = state.orders.map((o) => {
    const text = formatOrderText(o);
    const url = 'https://wa.me/' + waNumber() + '?text=' + encodeURIComponent(text);
    return '<div class="order-card"><header><span>' + esc(o.orderId) + ' • ' + esc(o.customer.name) + ' (' + esc(o.customer.phone) + ')</span>' +
      '<select onchange="changeOrderStatus(\'' + o.id + '\', this.value)">' +
      ['Pending', 'Confirmed', 'Delivered', 'Cancelled'].map((s) =>
        '<option' + (o.status === s ? ' selected' : '') + '>' + s + '</option>').join('') +
      '</select></header>' +
      '<p>' + esc(o.customer.address) + ' • ' + esc(o.deliveryArea === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka') + ' • ' + esc(o.payment) + '</p>' +
      '<p>' + o.items.map((i) => esc(i.name) + (i.color ? ' (' + esc(i.color) + ')' : '') + (i.size ? ', ' + esc(i.size) : '') + ' × ' + i.qty).join('<br>') + '</p>' +
      '<p><strong>' + (o.priced ? 'মোট: ' + taka(o.total) : 'মোট: WhatsApp এ কনফার্ম করা হবে') + '</strong> • ' +
      new Date(o.createdAt).toLocaleString('en-GB') + '</p>' +
      '<a class="btn btn-sm" style="background:#25d366;color:#fff" href="' + url + '" target="_blank" rel="noopener">💬 WhatsApp এ পাঠান</a></div>';
  }).join('');
}
async function changeOrderStatus(id, status) {
  const order = state.orders.find((o) => o.id === id);
  try {
    // Cancelling restores stock; un-cancelling deducts it again (priced orders only)
    if (order && order.priced) {
      if (status === 'Cancelled' && order.status !== 'Cancelled') {
        for (const item of order.items) {
          const p = state.products.find((x) => x.id === item.productId);
          if (p) await fbPatch('/products/' + p.id, { stock: (p.stock || 0) + item.qty });
        }
      } else if (order.status === 'Cancelled' && status !== 'Cancelled') {
        for (const item of order.items) {
          const p = state.products.find((x) => x.id === item.productId);
          if (p) await fbPatch('/products/' + p.id, { stock: Math.max(0, (p.stock || 0) - item.qty) });
        }
      }
    }
    await fbPatch('/orders/' + id, { status });
    loadAll();
  } catch (err) { alert('স্ট্যাটাস বদলায়নি — ' + err.message); loadAll(); }
}

/* ---- Payment settings ---- */
function fillPaymentForm() {
  const s = state.settings;
  $('codEnabled').checked = !!s.codEnabled;
  $('bkashEnabled').checked = !!s.bkashEnabled;
  $('bkashNumber').value = s.bkashNumber || '';
  $('nagadEnabled').checked = !!s.nagadEnabled;
  $('nagadNumber').value = s.nagadNumber || '';
  $('rocketEnabled').checked = !!s.rocketEnabled;
  $('rocketNumber').value = s.rocketNumber || '';
  $('deliveryInside').value = s.deliveryInsideDhaka ?? 60;
  $('deliveryOutside').value = s.deliveryOutsideDhaka ?? 120;
  $('whatsappNumber').value = s.whatsappNumber || WHATSAPP_DISPLAY;
  $('announcementText').value = s.announcement || '';
}
async function saveSettings(ev) {
  ev.preventDefault();
  const msg = $('paymentMsg');
  const data = {
    ...state.settings,
    codEnabled: $('codEnabled').checked,
    bkashEnabled: $('bkashEnabled').checked,
    bkashNumber: $('bkashNumber').value.trim(),
    nagadEnabled: $('nagadEnabled').checked,
    nagadNumber: $('nagadNumber').value.trim(),
    rocketEnabled: $('rocketEnabled').checked,
    rocketNumber: $('rocketNumber').value.trim(),
    deliveryInsideDhaka: Number($('deliveryInside').value) || 0,
    deliveryOutsideDhaka: Number($('deliveryOutside').value) || 0,
    whatsappNumber: $('whatsappNumber').value.trim() || WHATSAPP_DISPLAY,
    announcement: $('announcementText').value.trim()
  };
  msg.textContent = 'সেভ হচ্ছে...';
  try {
    await fbPut('/settings', data);
    msg.className = 'form-msg ok';
    msg.textContent = '✅ পেমেন্ট সেটিংস সেভ হয়েছে!';
    loadAll();
  } catch (err) {
    msg.className = 'form-msg';
    msg.textContent = 'সেভ হয়নি — ' + err.message;
  }
}

/* ============================== Modals / nav / init ======================== */
function openModal(id) { $(id).hidden = false; }
function closeModal(id) { $(id).hidden = true; }
document.addEventListener('click', (ev) => {
  if (ev.target.classList && ev.target.classList.contains('modal')) ev.target.hidden = true;
  const closer = ev.target.closest('[data-close]');
  if (closer) closeModal(closer.getAttribute('data-close'));
});
document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') document.querySelectorAll('.modal, .drawer').forEach((m) => { m.hidden = true; }); });

function renderAll() {
  renderStorefront();
  if (!$('adminView').hidden) renderAdmin();
}

document.querySelectorAll('[data-nav]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const nav = btn.getAttribute('data-nav');
    showStorefront();
    if (nav === 'bestselling') { state.filter.best = true; state.filter.flash = false; renderStorefront(); document.getElementById('bestSection').scrollIntoView({ behavior: 'smooth' }); }
    else if (nav === 'flashsale') { state.filter.flash = true; state.filter.best = false; renderStorefront(); document.getElementById('flashSection').scrollIntoView({ behavior: 'smooth' }); }
    else if (nav === 'categories') { document.getElementById('categoriesSection').scrollIntoView({ behavior: 'smooth' }); }
    else if (nav === 'shop') { state.filter.best = false; state.filter.flash = false; renderStorefront(); document.getElementById('allProductsSection').scrollIntoView({ behavior: 'smooth' }); }
    else { state.filter.best = false; state.filter.flash = false; state.filter.category = 'All'; renderStorefront(); window.scrollTo(0, 0); }
  });
});

$('searchBtn').addEventListener('click', applySearch);
$('searchInput').addEventListener('input', applySearch);
$('filterBest').addEventListener('change', (e) => { state.filter.best = e.target.checked; renderStorefront(); });
$('filterFlash').addEventListener('change', (e) => { state.filter.flash = e.target.checked; renderStorefront(); });
$('filterInStock').addEventListener('change', (e) => { state.filter.inStock = e.target.checked; renderStorefront(); });

$('cartBtn').addEventListener('click', () => { renderCart(); openModal('cartDrawer'); });
$('cartCheckoutBtn').addEventListener('click', () => {
  if (!state.cart.length) return;
  state.checkoutItems = state.cart.map((i) => ({ ...i }));
  closeModal('cartDrawer');
  openCheckout();
});
$('trackOrderBtn').addEventListener('click', () => openModal('trackModal'));
$('trackSearchBtn').addEventListener('click', trackOrder);
$('adminBtn').addEventListener('click', showAdmin);
$('viewStoreBtn').addEventListener('click', showStorefront);

$('checkoutForm').addEventListener('submit', submitOrder);
$('coArea').addEventListener('change', renderCheckoutSummary);
$('paymentForm').addEventListener('submit', saveSettings);
$('editForm').addEventListener('submit', saveProduct);
$('newProductBtn').addEventListener('click', () => openEdit(null));
$('adminSearch').addEventListener('input', renderAdminProducts);
$('addCategoryBtn').addEventListener('click', addCategory);

document.querySelectorAll('.admin-tabs .tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.admin-tabs .tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach((p) => { p.hidden = true; });
    $('tab-' + tab.getAttribute('data-tab')).hidden = false;
  });
});

// Init: open admin directly with #admin
if (location.hash === '#admin') showAdmin();
loadAll();
setInterval(loadAll, 5000); // live refresh every 5 seconds
