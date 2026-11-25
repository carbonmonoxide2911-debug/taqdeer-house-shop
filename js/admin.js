/* ============================================================================
   Taqdeer House — ADMIN PANEL only (admin.html)
   Loads js/common.js first. No storefront code lives on this page.
   Protected by a PIN: initial PIN is 1234, stored in Firebase settings as
   adminPin (changeable from Payment tab). The PIN is never displayed.
   Unlock lasts for this browser session only (sessionStorage).
   ========================================================================== */

const UNLOCK_KEY = 'th_admin_unlocked';
let unlocked = false;

/* ============================== PIN gate =================================== */
async function tryUnlock(pin) {
  const msg = $('pinError');
  msg.textContent = 'যাচাই হচ্ছে...';
  try {
    // Always read the PIN fresh from Firebase so a changed PIN takes effect.
    const settings = await fbGet('/settings');
    const storedPin = String((settings && settings.adminPin) || DEFAULT_ADMIN_PIN);
    if (pin === storedPin) {
      sessionStorage.setItem(UNLOCK_KEY, '1');
      unlocked = true;
      $('pinGate').hidden = true;
      $('adminContent').hidden = false;
      msg.textContent = '';
      $('pinInput').value = '';
      await loadAll();
    } else {
      msg.textContent = '❌ ভুল PIN — আবার চেষ্টা করুন।';
      $('pinInput').value = '';
      $('pinInput').focus();
    }
  } catch (err) {
    msg.textContent = 'যাচাই হয়নি — ইন্টারনেট চেক করে আবার চেষ্টা করুন। (' + err.message + ')';
  }
}

function lockAdmin() {
  sessionStorage.removeItem(UNLOCK_KEY);
  unlocked = false;
  $('adminContent').hidden = true;
  $('pinGate').hidden = false;
  $('pinInput').value = '';
  $('pinError').textContent = '';
  $('pinInput').focus();
}

$('pinForm').addEventListener('submit', (ev) => {
  ev.preventDefault();
  const pin = $('pinInput').value.trim();
  if (!pin) { $('pinError').textContent = 'PIN দিন।'; return; }
  tryUnlock(pin);
});
$('lockBtn').addEventListener('click', lockAdmin);

/* ============================== Loading ==================================== */
async function loadAll() {
  try {
    await loadData();
    renderAdmin();
  } catch (err) {
    console.error(err);
    $('adminProductRows').innerHTML = '<tr><td colspan="7" class="empty-note">ডাটা লোড হয়নি — ইন্টারনেট চেক করে পেজ রিফ্রেশ করুন। (' + esc(err.message) + ')</td></tr>';
  }
}

/* ============================== Admin ====================================== */
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

/* ---- Admin PIN change (Payment tab) ---- */
async function changePin(ev) {
  ev.preventDefault();
  const msg = $('pinChangeMsg');
  const current = $('pinCurrent').value.trim();
  const next = $('pinNew').value.trim();
  const confirm = $('pinConfirm').value.trim();
  if (!current || !next || !confirm) { msg.className = 'form-msg'; msg.textContent = 'সবগুলো ঘর পূরণ করুন।'; return; }
  if (next !== confirm) { msg.className = 'form-msg'; msg.textContent = 'নতুন PIN দুইবার একই হয়নি — আবার লিখুন।'; return; }
  if (!/^\d{4,6}$/.test(next)) { msg.className = 'form-msg'; msg.textContent = 'নতুন PIN ৪ থেকে ৬ সংখ্যার হতে হবে।'; return; }
  msg.textContent = 'সেভ হচ্ছে...';
  try {
    // Verify the current PIN against a fresh read from Firebase.
    const settings = await fbGet('/settings');
    const storedPin = String((settings && settings.adminPin) || DEFAULT_ADMIN_PIN);
    if (current !== storedPin) {
      msg.className = 'form-msg';
      msg.textContent = '❌ বর্তমান PIN ভুল — PIN বদলায়নি।';
      return;
    }
    await fbPatch('/settings', { adminPin: next });
    // Keep the in-memory settings in sync (PIN itself is never displayed).
    state.settings.adminPin = next;
    $('pinCurrent').value = ''; $('pinNew').value = ''; $('pinConfirm').value = '';
    msg.className = 'form-msg ok';
    msg.textContent = '✅ Admin PIN বদলে গেছে! পরের বার নতুন PIN দিয়ে ঢুকতে হবে।';
  } catch (err) {
    msg.className = 'form-msg';
    msg.textContent = 'সেভ হয়নি — ' + err.message;
  }
}

/* ============================== Tabs / init ================================ */
document.querySelectorAll('.admin-tabs .tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.admin-tabs .tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach((p) => { p.hidden = true; });
    $('tab-' + tab.getAttribute('data-tab')).hidden = false;
  });
});

$('paymentForm').addEventListener('submit', saveSettings);
$('pinChangeForm').addEventListener('submit', changePin);
$('editForm').addEventListener('submit', saveProduct);
$('newProductBtn').addEventListener('click', () => openEdit(null));
$('adminSearch').addEventListener('input', renderAdminProducts);
$('addCategoryBtn').addEventListener('click', addCategory);

// Init: if this browser session already unlocked, skip the PIN screen.
if (sessionStorage.getItem(UNLOCK_KEY) === '1') {
  unlocked = true;
  $('pinGate').hidden = true;
  $('adminContent').hidden = false;
  loadAll();
} else {
  $('pinInput').focus();
}
setInterval(() => { if (unlocked) loadAll(); }, 5000); // live refresh every 5 seconds, only while unlocked
