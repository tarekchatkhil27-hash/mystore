/* ============================================================
   admin.js — Smart Supper Shop Admin Dashboard Logic
============================================================ */

const SUPABASE_URL  = 'https://pqybuwpeillfpvzihzkv.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxeWJ1d3BlaWxsZnB2emloemt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwOTEyMzcsImV4cCI6MjA5MjY2NzIzN30.kIqc0qq6voKqZZEEIq6JIqh1XChL0mZ4ZYBwbl2INiU';
const CLD_CLOUD     = 'diyuesdco';
const CLD_PRESET    = 'ecommerce_products';
const WA_NUMBER     = '8801745062751';

let _sb = null;
let _adminEmail = '';
let _currentSection = 'dashboard';
let _editProductId = null;
let _editCategoryId = null;
let _confirmCallback = null;
let _allCategories = [];
let _allProducts = [];
let _orderFilter = 'all';
let _discTab = 'list';
let _productSearch = '';

/* ── Supabase init ─────────────────────────────────────── */
function getSB() {
  if (!_sb) _sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
  return _sb;
}

/* ── Toast ─────────────────────────────────────────────── */
function toast(msg, type) {
  type = type || 'info';
  var c = document.getElementById('toast-container');
  var el = document.createElement('div');
  el.className = 'toast ' + type;
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(function() {
    el.classList.add('hide');
    setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 350);
  }, 3000);
}

/* ── Confirm dialog ────────────────────────────────────── */
function confirm(title, msg, cb) {
  document.getElementById('confirm-title').textContent = title;
  document.getElementById('confirm-msg').textContent   = msg;
  document.getElementById('confirm-overlay').classList.add('open');
  _confirmCallback = cb;
}
function confirmOK() {
  document.getElementById('confirm-overlay').classList.remove('open');
  if (_confirmCallback) { _confirmCallback(); _confirmCallback = null; }
}
function confirmCancel() {
  document.getElementById('confirm-overlay').classList.remove('open');
  _confirmCallback = null;
}

/* ── Modal ─────────────────────────────────────────────── */
function openModal(title) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
  _editProductId = null;
  _editCategoryId = null;
  document.getElementById('modal-body').innerHTML = '';
}

/* ── Section navigation ─────────────────────────────────── */
function showSection(name) {
  _currentSection = name;
  document.querySelectorAll('.section').forEach(function(s) { s.classList.remove('active'); });
  var sec = document.getElementById('sec-' + name);
  if (sec) sec.classList.add('active');

  document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
  document.querySelectorAll('[data-section="' + name + '"]').forEach(function(n) { n.classList.add('active'); });

  window.location.hash = name;
  closeSidebar();

  var loaders = {
    dashboard:  loadDashboard,
    products:   loadProducts,
    categories: loadCategories,
    discounts:  loadDiscounts,
    orders:     loadOrders,
    messages:   loadMessages
  };
  if (loaders[name]) loaders[name]();
}

/* ── Sidebar (mobile) ──────────────────────────────────── */
function toggleSidebar() {
  var sb = document.getElementById('sidebar');
  var ov = document.getElementById('sidebar-overlay');
  sb.classList.toggle('mobile-open');
  ov.classList.toggle('show');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('mobile-open');
  document.getElementById('sidebar-overlay').classList.remove('show');
}

/* ── Logout ─────────────────────────────────────────────── */
async function logout() {
  await getSB().auth.signOut();
  window.location.replace('admin-login.html');
}

/* ============================================================
   DASHBOARD
============================================================ */
async function loadDashboard() {
  var sb = getSB();
  try {
    var [ordersRes, productsRes, msgsRes] = await Promise.all([
      sb.from('orders').select('id, total, status, created_at, order_number, customer_name', { count: 'exact' }),
      sb.from('products').select('id, stock', { count: 'exact' }),
      sb.from('contact_messages').select('id, is_read', { count: 'exact' })
    ]);

    var orders   = ordersRes.data   || [];
    var products = productsRes.data || [];
    var msgs     = msgsRes.data     || [];

    var totalSales = orders.reduce(function(s, o) { return s + (parseFloat(o.total) || 0); }, 0);
    var unreadMsgs = msgs.filter(function(m) { return !m.is_read; }).length;
    var lowStock   = products.filter(function(p) { return p.stock !== null && p.stock < 5; });

    document.getElementById('stat-sales').textContent    = '৳' + totalSales.toLocaleString();
    document.getElementById('stat-orders').textContent   = orders.length;
    document.getElementById('stat-products').textContent = products.length;
    document.getElementById('stat-messages').textContent = unreadMsgs;

    /* Recent orders */
    var recent = orders.slice().sort(function(a, b) {
      return new Date(b.created_at) - new Date(a.created_at);
    }).slice(0, 10);
    var tbody = document.getElementById('recent-orders-body');
    tbody.innerHTML = recent.map(function(o) {
      return '<tr>' +
        '<td>' + (o.order_number || o.id.slice(0,8)) + '</td>' +
        '<td>' + (o.customer_name || '—') + '</td>' +
        '<td>৳' + parseFloat(o.total).toLocaleString() + '</td>' +
        '<td><span class="badge badge-' + o.status + '">' + o.status + '</span></td>' +
        '<td>' + fmtDate(o.created_at) + '</td>' +
      '</tr>';
    }).join('');

    /* Low stock alerts */
    var alertWrap = document.getElementById('low-stock-alerts');
    if (lowStock.length === 0) {
      alertWrap.innerHTML = '<p style="font-size:.82rem;color:var(--muted)">No low stock items.</p>';
    } else {
      alertWrap.innerHTML = lowStock.slice(0, 5).map(function(p) {
        var prod = _allProducts.find(function(x) { return x.id === p.id; });
        var name = prod ? prod.name_en : p.id.slice(0,8);
        return '<div class="alert-card">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' +
          '<span>' + name + ' — only <strong>' + p.stock + '</strong> left</span>' +
        '</div>';
      }).join('');
    }
  } catch(e) { console.error('loadDashboard:', e); }
}

/* ============================================================
   PRODUCTS
============================================================ */
async function loadProducts() {
  var sb = getSB();
  var wrap = document.getElementById('products-list');
  wrap.innerHTML = '<div style="padding:20px;text-align:center"><div class="spin spin-dark"></div></div>';
  try {
    var [pRes, cRes] = await Promise.all([
      sb.from('products').select('*, categories(name_en)').order('created_at', { ascending: false }),
      sb.from('categories').select('*')
    ]);
    _allProducts   = pRes.data  || [];
    _allCategories = cRes.data  || [];
    renderProducts();
  } catch(e) { wrap.innerHTML = '<p style="padding:20px;color:var(--accent)">Failed to load products.</p>'; }
}

function renderProducts() {
  var wrap = document.getElementById('products-list');
  var q    = _productSearch.toLowerCase();
  var list = _allProducts.filter(function(p) {
    return !q || (p.name_en || '').toLowerCase().includes(q) || (p.name_bn || '').includes(q);
  });
  if (list.length === 0) {
    wrap.innerHTML = '<div class="empty-state"><div class="emoji">📦</div><p>No products found.</p></div>';
    return;
  }
  wrap.innerHTML = list.map(function(p) {
    var cat = p.categories ? p.categories.name_en : '—';
    var stockClass = p.stock === 0 ? 'out' : (p.stock < 5 ? 'low' : '');
    return '<div class="product-row">' +
      '<img class="prod-thumb" src="' + (p.image_url || 'assets/placeholder.jpg') + '" alt="' + (p.name_en||'') + '" loading="lazy"/>' +
      '<div class="prod-info">' +
        '<div class="prod-name">' + (p.name_en || '—') + '</div>' +
        '<div class="prod-meta">' + cat + ' · ' + (p.name_bn || '') + '</div>' +
      '</div>' +
      '<div class="prod-price">৳' + parseFloat(p.price||0).toLocaleString() + '</div>' +
      '<div class="prod-stock ' + stockClass + '">' + (p.stock !== null ? p.stock : '∞') + '</div>' +
      '<label class="toggle" title="Active">' +
        '<input type="checkbox" ' + (p.is_active ? 'checked' : '') + ' onchange="toggleProductActive(\'' + p.id + '\', this.checked)"/>' +
        '<div class="toggle-track"></div><div class="toggle-knob"></div>' +
      '</label>' +
      '<div class="prod-actions">' +
        '<button class="btn btn-ghost btn-icon btn-sm" onclick="openEditProduct(\'' + p.id + '\')" title="Edit">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
        '</button>' +
        '<button class="btn btn-danger btn-icon btn-sm" onclick="deleteProduct(\'' + p.id + '\')" title="Delete">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>' +
        '</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

function productModalHTML(p) {
  var cats = _allCategories.map(function(c) {
    return '<option value="' + c.id + '" ' + (p && p.category_id === c.id ? 'selected' : '') + '>' + c.name_en + '</option>';
  }).join('');
  return '' +
    '<div class="form-row">' +
      '<div class="fg"><label class="fl">Name (English) *</label><input id="pm-name-en" class="fi" value="' + (p ? (p.name_en||'') : '') + '" placeholder="Product name"/></div>' +
      '<div class="fg"><label class="fl">বাংলা নাম (Bangla Name)</label><input id="pm-name-bn" class="fi" value="' + (p ? (p.name_bn||'') : '') + '" placeholder="পণ্যের নাম"/></div>' +
    '</div>' +
    '<div class="fg"><label class="fl">Description (English)</label><textarea id="pm-desc-en" class="fi">' + (p ? (p.description_en||'') : '') + '</textarea></div>' +
    '<div class="fg"><label class="fl">Bangla Description (বাংলা বিবরণ)</label><textarea id="pm-desc-bn" class="fi">' + (p ? (p.description_bn||'') : '') + '</textarea></div>' +
    '<div class="form-row">' +
      '<div class="fg"><label class="fl">Price (৳) *</label><input id="pm-price" class="fi" type="number" min="0" value="' + (p ? (p.price||'') : '') + '" placeholder="0"/></div>' +
      '<div class="fg"><label class="fl">Compare-at Price (৳)</label><input id="pm-compare" class="fi" type="number" min="0" value="' + (p ? (p.compare_at_price||'') : '') + '" placeholder="0"/></div>' +
    '</div>' +
    '<div class="form-row">' +
      '<div class="fg"><label class="fl">Stock Qty</label><input id="pm-stock" class="fi" type="number" min="0" value="' + (p ? (p.stock !== null ? p.stock : '') : '') + '" placeholder="0"/></div>' +
      '<div class="fg"><label class="fl">Category</label><select id="pm-cat" class="fi"><option value="">-- Select --</option>' + cats + '</select></div>' +
    '</div>' +
    '<div class="form-row">' +
      '<div class="fg"><label class="fl">Unit (English)</label><input id="pm-unit-en" class="fi" value="' + (p ? (p.unit_en||'piece') : 'piece') + '"/></div>' +
      '<div class="fg"><label class="fl">Unit (বাংলা)</label><input id="pm-unit-bn" class="fi" value="' + (p ? (p.unit_bn||'পিস') : 'পিস') + '"/></div>' +
    '</div>' +
    '<div class="form-row">' +
      '<div class="fg" style="display:flex;align-items:center;gap:10px;padding-top:20px">' +
        '<label class="toggle"><input type="checkbox" id="pm-featured" ' + (p && p.is_featured ? 'checked' : '') + '/><div class="toggle-track"></div><div class="toggle-knob"></div></label>' +
        '<label class="fl" style="margin:0">Featured</label>' +
      '</div>' +
      '<div class="fg" style="display:flex;align-items:center;gap:10px;padding-top:20px">' +
        '<label class="toggle"><input type="checkbox" id="pm-active" ' + (!p || p.is_active ? 'checked' : '') + '/><div class="toggle-track"></div><div class="toggle-knob"></div></label>' +
        '<label class="fl" style="margin:0">Active</label>' +
      '</div>' +
    '</div>' +
    '<div class="fg"><label class="fl">Product Image</label>' +
      '<div class="upload-zone" onclick="document.getElementById(\'pm-img-input\').click()">' +
        '<input type="file" id="pm-img-input" accept="image/*" onchange="handleProductImageUpload(this)"/>' +
        (p && p.image_url ? '<img id="pm-img-preview" class="upload-preview" src="' + p.image_url + '" alt="preview"/>' : '<img id="pm-img-preview" class="upload-preview" style="display:none"/>' ) +
        '<p class="upload-label">📷 Tap to upload image</p>' +
        '<div class="progress-bar-wrap" id="pm-progress-wrap"><div class="progress-bar" id="pm-progress"></div></div>' +
      '</div>' +
      '<input type="hidden" id="pm-img-url" value="' + (p ? (p.image_url||'') : '') + '"/>' +
    '</div>';
}

function openAddProduct() {
  _editProductId = null;
  openModal('Add Product');
  document.getElementById('modal-body').innerHTML = productModalHTML(null);
  document.getElementById('modal-footer').innerHTML =
    '<button class="btn btn-ghost" onclick="closeModal()">Cancel</button>' +
    '<button class="btn btn-primary" onclick="saveProduct()">Save Product</button>';
}

function openEditProduct(id) {
  var p = _allProducts.find(function(x) { return x.id === id; });
  if (!p) return;
  _editProductId = id;
  openModal('Edit Product');
  document.getElementById('modal-body').innerHTML = productModalHTML(p);
  document.getElementById('modal-footer').innerHTML =
    '<button class="btn btn-ghost" onclick="closeModal()">Cancel</button>' +
    '<button class="btn btn-primary" onclick="saveProduct()">Update Product</button>';
}

async function handleProductImageUpload(input) {
  var file = input.files[0];
  if (!file) return;
  var wrap = document.getElementById('pm-progress-wrap');
  var bar  = document.getElementById('pm-progress');
  var prev = document.getElementById('pm-img-preview');
  wrap.style.display = 'block';
  bar.style.width    = '0%';
  try {
    var url = await uploadToCloudinary(file, function(pct) { bar.style.width = pct + '%'; });
    document.getElementById('pm-img-url').value = url;
    prev.src = url; prev.style.display = 'block';
    bar.style.width = '100%';
    setTimeout(function() { wrap.style.display = 'none'; }, 800);
    toast('Image uploaded!', 'success');
  } catch(e) {
    toast('Image upload failed.', 'error');
    wrap.style.display = 'none';
  }
}

async function uploadToCloudinary(file, onProgress) {
  return new Promise(function(resolve, reject) {
    var fd  = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', CLD_PRESET);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.cloudinary.com/v1_1/' + CLD_CLOUD + '/image/upload');
    xhr.upload.onprogress = function(e) {
      if (e.lengthComputable && onProgress) onProgress(Math.round(e.loaded / e.total * 95));
    };
    xhr.onload = function() {
      var r = JSON.parse(xhr.responseText);
      if (r.secure_url) resolve(r.secure_url);
      else reject(new Error('Upload failed'));
    };
    xhr.onerror = function() { reject(new Error('Network error')); };
    xhr.send(fd);
  });
}

async function saveProduct() {
  var nameEn = (document.getElementById('pm-name-en').value || '').trim();
  var price  = parseFloat(document.getElementById('pm-price').value);
  if (!nameEn) { toast('Product name (English) is required.', 'error'); return; }
  if (isNaN(price) || price < 0) { toast('Valid price is required.', 'error'); return; }

  var payload = {
    name_en:         nameEn,
    name_bn:         document.getElementById('pm-name-bn').value.trim() || null,
    description_en:  document.getElementById('pm-desc-en').value.trim() || null,
    description_bn:  document.getElementById('pm-desc-bn').value.trim() || null,
    price:           price,
    compare_at_price:parseFloat(document.getElementById('pm-compare').value) || null,
    stock:           parseInt(document.getElementById('pm-stock').value) || 0,
    category_id:     document.getElementById('pm-cat').value || null,
    unit_en:         document.getElementById('pm-unit-en').value.trim() || 'piece',
    unit_bn:         document.getElementById('pm-unit-bn').value.trim() || 'পিস',
    is_featured:     document.getElementById('pm-featured').checked,
    is_active:       document.getElementById('pm-active').checked,
    image_url:       document.getElementById('pm-img-url').value || null,
    updated_at:      new Date().toISOString()
  };

  var sb  = getSB();
  var res = _editProductId
    ? await sb.from('products').update(payload).eq('id', _editProductId)
    : await sb.from('products').insert(payload);

  if (res.error) { toast('Save failed: ' + res.error.message, 'error'); return; }
  toast(_editProductId ? 'Product updated!' : 'Product added!', 'success');
  closeModal();
  loadProducts();
}

async function toggleProductActive(id, active) {
  var res = await getSB().from('products').update({ is_active: active }).eq('id', id);
  if (res.error) toast('Update failed.', 'error');
  else toast(active ? 'Product activated.' : 'Product deactivated.', 'info');
}

function deleteProduct(id) {
  confirm('Delete Product', 'This cannot be undone. Delete this product?', async function() {
    var res = await getSB().from('products').delete().eq('id', id);
    if (res.error) toast('Delete failed.', 'error');
    else { toast('Product deleted.', 'success'); loadProducts(); }
  });
}

/* ============================================================
   CATEGORIES
============================================================ */
async function loadCategories() {
  var sb   = getSB();
  var wrap = document.getElementById('categories-grid');
  wrap.innerHTML = '<div style="padding:20px;text-align:center"><div class="spin spin-dark"></div></div>';
  try {
    var [cRes, pRes] = await Promise.all([
      sb.from('categories').select('*').order('sort_order'),
      sb.from('products').select('id, category_id')
    ]);
    _allCategories = cRes.data || [];
    var countMap = {};
    (pRes.data || []).forEach(function(p) {
      if (p.category_id) countMap[p.category_id] = (countMap[p.category_id] || 0) + 1;
    });
    wrap.innerHTML = _allCategories.map(function(c) {
      return '<div class="cat-card">' +
        '<img class="cat-img" src="' + (c.image_url || 'assets/placeholder.jpg') + '" alt="' + c.name_en + '" loading="lazy"/>' +
        '<div class="cat-name-en">' + c.name_en + '</div>' +
        '<div class="cat-name-bn">' + (c.name_bn || '') + '</div>' +
        '<div class="cat-count">' + (countMap[c.id] || 0) + ' products</div>' +
        '<div class="cat-actions">' +
          '<button class="btn btn-ghost btn-sm" onclick="openEditCategory(\'' + c.id + '\')">Edit</button>' +
          '<button class="btn btn-danger btn-sm" onclick="deleteCategory(\'' + c.id + '\')">Delete</button>' +
        '</div>' +
      '</div>';
    }).join('');
    if (_allCategories.length === 0) wrap.innerHTML = '<div class="empty-state"><div class="emoji">🏷️</div><p>No categories yet.</p></div>';
  } catch(e) { wrap.innerHTML = '<p style="padding:20px;color:var(--accent)">Failed to load categories.</p>'; }
}

function categoryModalHTML(c) {
  return '<div class="form-row">' +
      '<div class="fg"><label class="fl">Name (English) *</label><input id="cm-name-en" class="fi" value="' + (c ? (c.name_en||'') : '') + '" placeholder="Category name"/></div>' +
      '<div class="fg"><label class="fl">Bangla Name (বাংলা নাম)</label><input id="cm-name-bn" class="fi" value="' + (c ? (c.name_bn||'') : '') + '" placeholder="বিভাগের নাম"/></div>' +
    '</div>' +
    '<div class="fg"><label class="fl">Description (English)</label><textarea id="cm-desc-en" class="fi">' + (c ? (c.description_en||'') : '') + '</textarea></div>' +
    '<div class="fg"><label class="fl">Bangla Description</label><textarea id="cm-desc-bn" class="fi">' + (c ? (c.description_bn||'') : '') + '</textarea></div>' +
    '<div class="fg"><label class="fl">Category Image</label>' +
      '<div class="upload-zone" onclick="document.getElementById(\'cm-img-input\').click()">' +
        '<input type="file" id="cm-img-input" accept="image/*" onchange="handleCatImageUpload(this)"/>' +
        (c && c.image_url ? '<img id="cm-img-preview" class="upload-preview" src="' + c.image_url + '" alt="preview"/>' : '<img id="cm-img-preview" class="upload-preview" style="display:none"/>') +
        '<p class="upload-label">📷 Tap to upload image</p>' +
        '<div class="progress-bar-wrap" id="cm-progress-wrap"><div class="progress-bar" id="cm-progress"></div></div>' +
      '</div>' +
      '<input type="hidden" id="cm-img-url" value="' + (c ? (c.image_url||'') : '') + '"/>' +
    '</div>';
}

function openAddCategory() {
  _editCategoryId = null;
  openModal('Add Category');
  document.getElementById('modal-body').innerHTML = categoryModalHTML(null);
  document.getElementById('modal-footer').innerHTML =
    '<button class="btn btn-ghost" onclick="closeModal()">Cancel</button>' +
    '<button class="btn btn-primary" onclick="saveCategory()">Save Category</button>';
}

function openEditCategory(id) {
  var c = _allCategories.find(function(x) { return x.id === id; });
  if (!c) return;
  _editCategoryId = id;
  openModal('Edit Category');
  document.getElementById('modal-body').innerHTML = categoryModalHTML(c);
  document.getElementById('modal-footer').innerHTML =
    '<button class="btn btn-ghost" onclick="closeModal()">Cancel</button>' +
    '<button class="btn btn-primary" onclick="saveCategory()">Update Category</button>';
}

async function handleCatImageUpload(input) {
  var file = input.files[0]; if (!file) return;
  var wrap = document.getElementById('cm-progress-wrap');
  var bar  = document.getElementById('cm-progress');
  var prev = document.getElementById('cm-img-preview');
  wrap.style.display = 'block'; bar.style.width = '0%';
  try {
    var url = await uploadToCloudinary(file, function(pct) { bar.style.width = pct + '%'; });
    document.getElementById('cm-img-url').value = url;
    prev.src = url; prev.style.display = 'block';
    bar.style.width = '100%';
    setTimeout(function() { wrap.style.display = 'none'; }, 800);
    toast('Image uploaded!', 'success');
  } catch(e) { toast('Upload failed.', 'error'); wrap.style.display = 'none'; }
}

function slugify(text) {
  return text.toString().toLowerCase().trim().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');
}

async function saveCategory() {
  var nameEn = (document.getElementById('cm-name-en').value || '').trim();
  if (!nameEn) { toast('Category name (English) is required.', 'error'); return; }
  var payload = {
    name_en: nameEn,
    name_bn: document.getElementById('cm-name-bn').value.trim() || null,
    description_en: document.getElementById('cm-desc-en').value.trim() || null,
    description_bn: document.getElementById('cm-desc-bn').value.trim() || null,
    image_url: document.getElementById('cm-img-url').value || null,
    slug: _editCategoryId ? undefined : slugify(nameEn)
  };
  if (_editCategoryId) delete payload.slug;

  var sb  = getSB();
  var res = _editCategoryId
    ? await sb.from('categories').update(payload).eq('id', _editCategoryId)
    : await sb.from('categories').insert(payload);

  if (res.error) { toast('Save failed: ' + res.error.message, 'error'); return; }
  toast(_editCategoryId ? 'Category updated!' : 'Category added!', 'success');
  closeModal(); loadCategories();
}

function deleteCategory(id) {
  confirm('Delete Category', 'Delete this category? Products in it will become uncategorised.', async function() {
    var res = await getSB().from('categories').delete().eq('id', id);
    if (res.error) toast('Delete failed.', 'error');
    else { toast('Category deleted.', 'success'); loadCategories(); }
  });
}

/* ============================================================
   DISCOUNTS
============================================================ */
async function loadDiscounts() {
  if (_discTab === 'list') await loadDiscountList();
}

async function loadDiscountList() {
  var sb   = getSB();
  var tbody = document.getElementById('discounts-tbody');
  tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px"><div class="spin spin-dark"></div></td></tr>';
  try {
    var res = await sb.from('discounts').select('*').order('created_at', { ascending: false });
    var list = res.data || [];
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state"><div class="emoji">🎁</div><p>No discounts yet.</p></div></td></tr>';
      return;
    }
    tbody.innerHTML = list.map(function(d) {
      var val    = d.type === 'percent' ? d.value + '%' : '৳' + d.value;
      var expiry = d.expires_at ? fmtDate(d.expires_at) : '—';
      var status = d.is_active ? '<span class="badge badge-active">Active</span>' : '<span class="badge badge-inactive">Off</span>';
      return '<tr>' +
        '<td>' + (d.name||'—') + '</td>' +
        '<td><code>' + (d.code||'—') + '</code></td>' +
        '<td>' + (d.type==='percent'?'% Off':'৳ Off') + '</td>' +
        '<td>' + val + '</td>' +
        '<td>' + d.applies_to + '</td>' +
        '<td>' + expiry + '</td>' +
        '<td>' + status + '</td>' +
        '<td>' +
          '<button class="btn btn-danger btn-sm" onclick="deleteDiscount(\'' + d.id + '\')">Delete</button>' +
        '</td>' +
      '</tr>';
    }).join('');
  } catch(e) { tbody.innerHTML = '<tr><td colspan="7" style="color:var(--accent);padding:12px">Failed to load.</td></tr>'; }
}

function switchDiscTab(tab) {
  _discTab = tab;
  document.querySelectorAll('.disc-tab').forEach(function(t) { t.classList.remove('active'); });
  document.querySelector('[data-disc-tab="' + tab + '"]').classList.add('active');
  document.getElementById('disc-list-section').style.display = tab === 'list' ? 'block' : 'none';
  document.getElementById('disc-add-section').style.display  = tab === 'add'  ? 'block' : 'none';
  if (tab === 'list') loadDiscountList();
  else populateDiscountDropdowns();
}

async function populateDiscountDropdowns() {
  var sb = getSB();
  if (_allCategories.length === 0) {
    var r = await sb.from('categories').select('*');
    _allCategories = r.data || [];
  }
  if (_allProducts.length === 0) {
    var r2 = await sb.from('products').select('id, name_en').eq('is_active', true);
    _allProducts = r2.data || [];
  }
  var pSel = document.getElementById('disc-product-sel');
  var cSel = document.getElementById('disc-cat-sel');
  if (pSel) pSel.innerHTML = '<option value="">-- Select Product --</option>' + _allProducts.map(function(p) { return '<option value="' + p.id + '">' + p.name_en + '</option>'; }).join('');
  if (cSel) cSel.innerHTML = '<option value="">-- Select Category --</option>' + _allCategories.map(function(c) { return '<option value="' + c.id + '">' + c.name_en + '</option>'; }).join('');
}

function onDiscAppliesChange(val) {
  document.getElementById('disc-product-wrap').style.display  = val === 'product'  ? 'block' : 'none';
  document.getElementById('disc-category-wrap').style.display = val === 'category' ? 'block' : 'none';
}

async function saveDiscount() {
  var name  = (document.getElementById('disc-name').value || '').trim();
  var value = parseFloat(document.getElementById('disc-value').value);
  if (!name)        { toast('Discount name is required.', 'error'); return; }
  if (isNaN(value)) { toast('Discount value is required.', 'error'); return; }

  var appliesTo  = document.getElementById('disc-applies').value;
  var expiry     = document.getElementById('disc-expiry').value;
  var minOrder   = parseFloat(document.getElementById('disc-min-order').value) || 0;
  var payload = {
    name:             name,
    code:             (document.getElementById('disc-code').value || '').trim().toUpperCase() || null,
    type:             document.getElementById('disc-type').value,
    value:            value,
    applies_to:       appliesTo,
    product_id:       appliesTo === 'product'  ? (document.getElementById('disc-product-sel').value || null) : null,
    category_id:      appliesTo === 'category' ? (document.getElementById('disc-cat-sel').value    || null) : null,
    min_order_amount: minOrder,
    expires_at:       expiry ? new Date(expiry).toISOString() : null,
    is_active:        document.getElementById('disc-active').checked
  };

  var res = await getSB().from('discounts').insert(payload);
  if (res.error) { toast('Save failed: ' + res.error.message, 'error'); return; }
  toast('Discount created!', 'success');
  document.getElementById('disc-name').value = '';
  document.getElementById('disc-code').value = '';
  document.getElementById('disc-value').value = '';
  switchDiscTab('list');
}

function deleteDiscount(id) {
  confirm('Delete Discount', 'Delete this discount?', async function() {
    var res = await getSB().from('discounts').delete().eq('id', id);
    if (res.error) toast('Delete failed.', 'error');
    else { toast('Discount deleted.', 'success'); loadDiscountList(); }
  });
}

/* ============================================================
   ORDERS
============================================================ */
async function loadOrders() {
  var sb    = getSB();
  var tbody = document.getElementById('orders-tbody');
  tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px"><div class="spin spin-dark"></div></td></tr>';
  try {
    var query = sb.from('orders').select('*').order('created_at', { ascending: false });
    if (_orderFilter !== 'all') query = query.eq('status', _orderFilter);
    var res   = await query.limit(100);
    var orders = res.data || [];

    if (orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state"><div class="emoji">📋</div><p>No orders found.</p></div></td></tr>';
      return;
    }

    tbody.innerHTML = orders.map(function(o) {
      return '<tr class="order-row" onclick="toggleOrderExpand(\'' + o.id + '\')">' +
          '<td>' + (o.order_number || o.id.slice(0,8)) + '</td>' +
          '<td>' + (o.customer_name||'—') + '<br><small style="color:var(--muted)">' + (o.customer_phone||'') + '</small></td>' +
          '<td>৳' + parseFloat(o.total).toLocaleString() + '</td>' +
          '<td><span class="badge badge-' + o.status + '">' + o.status + '</span></td>' +
          '<td>' + fmtDate(o.created_at) + '</td>' +
          '<td onclick="event.stopPropagation()">' +
            '<select class="fi" style="height:30px;font-size:.75rem;padding:0 6px" onchange="updateOrderStatus(\'' + o.id + '\', this.value)">' +
              ['pending','confirmed','processing','shipped','delivered','cancelled'].map(function(s) {
                return '<option value="' + s + '" ' + (o.status===s?'selected':'') + '>' + s + '</option>';
              }).join('') +
            '</select>' +
          '</td>' +
          '<td onclick="event.stopPropagation()">' +
            '<button class="btn btn-success btn-sm" onclick="sendWAUpdate(\'' + (o.order_number||o.id.slice(0,8)) + '\', \'' + o.status + '\')">WA</button>' +
          '</td>' +
        '</tr>' +
        '<tr class="order-expand" id="expand-' + o.id + '">' +
          '<td colspan="7"><div id="expand-body-' + o.id + '"></div></td>' +
        '</tr>';
    }).join('');
  } catch(e) { tbody.innerHTML = '<tr><td colspan="7" style="color:var(--accent);padding:12px">Failed to load orders.</td></tr>'; }
}

async function toggleOrderExpand(id) {
  var row  = document.getElementById('expand-' + id);
  var body = document.getElementById('expand-body-' + id);
  if (row.classList.contains('open')) { row.classList.remove('open'); return; }
  row.classList.add('open');
  if (body.innerHTML) return;
  body.innerHTML = '<div class="spin spin-dark" style="margin:12px"></div>';
  try {
    var [oRes, iRes] = await Promise.all([
      getSB().from('orders').select('*').eq('id', id).single(),
      getSB().from('order_items').select('*').eq('order_id', id)
    ]);
    var o     = oRes.data;
    var items = iRes.data || [];
    body.innerHTML =
      '<div class="order-detail-grid">' +
        '<div><strong>Customer Info</strong><br/>' +
          '<small>Name: ' + (o.customer_name||'—') + '</small><br/>' +
          '<small>Phone: ' + (o.customer_phone||'—') + '</small><br/>' +
          '<small>Email: ' + (o.customer_email||'—') + '</small><br/>' +
          '<small>Address: ' + (o.address||'—') + ', ' + (o.city||'') + '</small>' +
          (o.notes ? '<br/><small>Notes: ' + o.notes + '</small>' : '') +
        '</div>' +
        '<div><strong>Order Summary</strong><br/>' +
          '<small>Subtotal: ৳' + parseFloat(o.subtotal||0).toLocaleString() + '</small><br/>' +
          (o.discount_amount > 0 ? '<small>Discount: −৳' + parseFloat(o.discount_amount).toLocaleString() + '</small><br/>' : '') +
          '<small>Total: ৳' + parseFloat(o.total).toLocaleString() + '</small>' +
        '</div>' +
      '</div>' +
      '<div class="order-items-list" style="margin-top:10px"><strong>Items:</strong>' +
        items.map(function(i) {
          return '<div class="order-item-row"><span>' + (i.product_name||'—') + ' × ' + i.quantity + '</span><span>৳' + parseFloat(i.total_price).toLocaleString() + '</span></div>';
        }).join('') +
      '</div>';
  } catch(e) { body.innerHTML = '<p style="color:var(--accent);font-size:.8rem;padding:8px">Failed to load details.</p>'; }
}

async function updateOrderStatus(id, status) {
  var res = await getSB().from('orders').update({ status: status, updated_at: new Date().toISOString() }).eq('id', id);
  if (res.error) toast('Update failed.', 'error');
  else toast('Order status updated to ' + status, 'success');
}

function sendWAUpdate(orderNumber, status) {
  var msg = 'আপনার অর্ডার ' + orderNumber + ' এখন ' + status + ' / Your order ' + orderNumber + ' is now ' + status;
  window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank');
}

function setOrderFilter(f) {
  _orderFilter = f;
  document.querySelectorAll('.filter-tab').forEach(function(t) { t.classList.remove('active'); });
  document.querySelector('[data-filter="' + f + '"]').classList.add('active');
  loadOrders();
}

/* ============================================================
   MESSAGES
============================================================ */
async function loadMessages() {
  var sb   = getSB();
  var wrap = document.getElementById('messages-list');
  wrap.innerHTML = '<div style="padding:20px;text-align:center"><div class="spin spin-dark"></div></div>';
  try {
    var res  = await sb.from('contact_messages').select('*').order('created_at', { ascending: false });
    var msgs = res.data || [];
    if (msgs.length === 0) {
      wrap.innerHTML = '<div class="empty-state"><div class="emoji">📬</div><p>No messages yet.</p></div>';
      return;
    }
    wrap.innerHTML = msgs.map(function(m) {
      return '<div class="msg-row ' + (m.is_read ? '' : 'unread') + '" id="msg-' + m.id + '" onclick="toggleMsg(\'' + m.id + '\')">' +
          '<div class="msg-header">' +
            '<span class="msg-name">' + (m.name||'—') + '</span>' +
            '<span class="badge ' + (m.is_read ? 'badge-read' : 'badge-unread') + '">' + (m.is_read ? 'Read' : 'New') + '</span>' +
            '<span class="msg-date">' + fmtDate(m.created_at) + '</span>' +
          '</div>' +
          '<div class="msg-preview">' + (m.message||'').slice(0,80) + '…</div>' +
        '</div>' +
        '<div class="msg-full" id="msgbody-' + m.id + '">' +
          (m.email ? '<p><strong>Email:</strong> ' + m.email + '</p>' : '') +
          (m.phone ? '<p><strong>Phone:</strong> ' + m.phone + '</p>' : '') +
          (m.subject ? '<p><strong>Subject:</strong> ' + m.subject + '</p>' : '') +
          '<p style="margin-top:8px">' + (m.message||'').replace(/\n/g,'<br/>') + '</p>' +
          '<div class="msg-actions">' +
            (m.is_read ? '' : '<button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();markRead(\'' + m.id + '\')">Mark Read</button>') +
            '<button class="btn btn-danger btn-sm" onclick="event.stopPropagation();deleteMsg(\'' + m.id + '\')">Delete</button>' +
          '</div>' +
        '</div>';
    }).join('');
  } catch(e) { wrap.innerHTML = '<p style="padding:16px;color:var(--accent)">Failed to load messages.</p>'; }
}

function toggleMsg(id) {
  var body = document.getElementById('msgbody-' + id);
  body.classList.toggle('open');
}

async function markRead(id) {
  var res = await getSB().from('contact_messages').update({ is_read: true }).eq('id', id);
  if (res.error) toast('Failed.', 'error');
  else { toast('Marked as read.', 'success'); loadMessages(); }
}

function deleteMsg(id) {
  confirm('Delete Message', 'Delete this message?', async function() {
    var res = await getSB().from('contact_messages').delete().eq('id', id);
    if (res.error) toast('Delete failed.', 'error');
    else { toast('Message deleted.', 'success'); loadMessages(); }
  });
}

/* ── Helpers ────────────────────────────────────────────── */
function fmtDate(d) {
  if (!d) return '—';
  var dt = new Date(d);
  return dt.getDate() + ' ' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][dt.getMonth()] + ' ' + dt.getFullYear();
}

/* ── Init ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async function() {
  var sb  = getSB();
  var res = await sb.auth.getSession();
  if (!res.data || !res.data.session) {
    window.location.replace('admin-login.html'); return;
  }
  _adminEmail = res.data.session.user.email;
  document.getElementById('admin-email').textContent = _adminEmail;

  var hash = (window.location.hash || '#dashboard').replace('#','');
  var valid = ['dashboard','products','categories','discounts','orders','messages'];
  showSection(valid.includes(hash) ? hash : 'dashboard');
});
