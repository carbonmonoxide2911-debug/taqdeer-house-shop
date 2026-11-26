/* ============================================================================
   Taqdeer House — shared code for the shop (index.html) and admin (admin.html)
   Data lives in Firebase Realtime Database, accessed ONLY through its public
   REST API (no apiKey / secret is embedded anywhere).
   WhatsApp orders go to 01690090084 -> wa.me/8801690090084
   ========================================================================== */

const FIREBASE_BASE = 'https://taqdeer-house-default-rtdb.firebaseio.com';
const WHATSAPP_DISPLAY = '01690090084';          // shown to users
const WHATSAPP_INTL = '8801690090084';           // wa.me number (880 + 1690090084)
const DEFAULT_ADMIN_PIN = '1234';                // initial admin PIN (changeable in admin)

/* ---------- Seed data (used ONLY if Firebase is empty on first load) ----------
   Prices are intentionally null — the owner never published prices.
   Nothing here invents a price or a stock count. ---------------------------- */
const SEED_SETTINGS = {
  announcement: '', codEnabled: true, bkashEnabled: false, bkashNumber: '',
  nagadEnabled: false, nagadNumber: '', rocketEnabled: false, rocketNumber: '',
  deliveryInsideDhaka: 80, deliveryOutsideDhaka: 150,
  whatsappNumber: WHATSAPP_DISPLAY,
  adminPin: DEFAULT_ADMIN_PIN
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
  seeded: false
};
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const taka = (n) => '৳' + Number(n || 0).toLocaleString('en-US');
const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const genOrderId = () => 'TH-' + Math.random().toString(36).slice(2, 8).toUpperCase();
const waNumber = () => (state.settings.whatsappNumber || WHATSAPP_DISPLAY).replace(/[^0-9]/g, '').replace(/^0/, '880');
const toObjArray = (obj) => obj ? Object.entries(obj).map(([id, v]) => ({ ...v, id })) : [];
/* The admin PIN lives in Firebase settings as adminPin. When it is missing
   (older data), the initial PIN 1234 applies. The PIN is never displayed. */
const currentAdminPin = () => String(state.settings.adminPin || DEFAULT_ADMIN_PIN);

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

/* Fetch everything from Firebase into `state`. Throws on network/rules error. */
async function loadData() {
  if (!state.seeded) { await seedIfEmpty(); state.seeded = true; }
  const [products, categories, settings, orders] = await Promise.all([
    fbGet('/products'), fbGet('/categories'), fbGet('/settings'), fbGet('/orders')
  ]);
  state.products = toObjArray(products).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  state.categories = toObjArray(categories).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  state.settings = { ...SEED_SETTINGS, ...(settings || {}) };
  state.orders = toObjArray(orders).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

/* ============================== WhatsApp order text ======================== */
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

/* ============================== Pagination (shared) ======================== */
function pageWindow(current, total) {
  // Compact page list: all pages when few, otherwise 1 … c-1 c c+1 … last
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  if (current > 3) pages.push('…');
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p);
  if (current < total - 2) pages.push('…');
  pages.push(total);
  return pages;
}
function paginationHtml(current, total, totalItems, goFn) {
  if (total <= 1) return '<span class="muted">মোট ' + totalItems + ' টি প্রোডাক্ট</span>';
  return '<button class="page-btn" ' + (current <= 1 ? 'disabled' : '') + ' onclick="' + goFn + '(' + (current - 1) + ')">← আগের</button>' +
    pageWindow(current, total).map((p) => p === '…'
      ? '<span class="page-dots">…</span>'
      : '<button class="page-btn' + (p === current ? ' active' : '') + '" onclick="' + goFn + '(' + p + ')">' + p + '</button>').join('') +
    '<button class="page-btn" ' + (current >= total ? 'disabled' : '') + ' onclick="' + goFn + '(' + (current + 1) + ')">পরের →</button>' +
    '<span class="muted">পৃষ্ঠা ' + current + ' / ' + total + ' • মোট ' + totalItems + ' টি</span>';
}

/* ============================== Modals ===================================== */
function openModal(id) { $(id).hidden = false; }
function closeModal(id) { $(id).hidden = true; }
document.addEventListener('click', (ev) => {
  if (ev.target.classList && ev.target.classList.contains('modal')) ev.target.hidden = true;
  const closer = ev.target.closest('[data-close]');
  if (closer) closeModal(closer.getAttribute('data-close'));
});
document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') document.querySelectorAll('.modal, .drawer').forEach((m) => { m.hidden = true; }); });
