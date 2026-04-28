/* checkout.js — Smart Supper Shop */
const WA = '8801745062751';
const FREE_DEL = 500;
const DEL_FEE  = 60;

let _step = 1;
let _disc = null;
let _info = {};

const t  = (k, v) => window.i18n  ? window.i18n.t(k, v)        : k;
const fp = (a)    => window.utils ? window.utils.formatPrice(a) : '৳' + a;
const gl = ()     => window.utils ? window.utils.getLang()       : 'bn';

function iname(item) {
  const l = gl();
  return (l === 'bn' && item.name_bn && item.name_bn.trim())
    ? item.name_bn
    : item.name_en || '';
}

/* ── Stepper ─────────────────────────────────────────────── */
function setStep(n) {
  _step = n;
  [1, 2, 3].forEach(i => {
    const el = document.getElementById('si' + i);
    el.classList.remove('active', 'done');
    if (i < n)  el.classList.add('done');
    if (i === n) el.classList.add('active');
    document.getElementById('sc' + i).textContent = i < n ? '✓' : i;
  });
  document.getElementById('ln12').classList.toggle('done', n > 1);
  document.getElementById('ln23').classList.toggle('done', n > 2);
  document.getElementById('s1').style.display  = n === 1 ? 'block' : 'none';
  document.getElementById('s2').style.display  = n === 2 ? 'block' : 'none';
  document.getElementById('nb').style.display  = n === 1 ? 'block' : 'none';
  document.getElementById('pb').style.display  = n === 2 ? 'flex'  : 'none';
  document.getElementById('back-btn').onclick   = n === 1
    ? function() { history.back(); }
    : function() { setStep(1); };
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Validation ──────────────────────────────────────────── */
function validate() {
  var ok = true;
  var fields = [
    { id: 'fn', err: 'en' },
    { id: 'fp', err: 'ep' },
    { id: 'fa', err: 'ea' },
    { id: 'fc', err: 'ec' }
  ];
  fields.forEach(function(f) {
    var el = document.getElementById(f.id);
    var er = document.getElementById(f.err);
    if (!el.value.trim()) {
      el.classList.add('err');
      er.classList.add('show');
      ok = false;
    } else {
      el.classList.remove('err');
      er.classList.remove('show');
    }
  });
  var phone = document.getElementById('fp').value.replace(/\D/g, '');
  if (phone.length < 10) {
    document.getElementById('fp').classList.add('err');
    document.getElementById('ep').classList.add('show');
    ok = false;
  }
  return ok;
}

/* ── Go to review ────────────────────────────────────────── */
function goReview() {
  if (!validate()) {
    var e = document.querySelector('.fi.err');
    if (e) e.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  _info = {
    name:    document.getElementById('fn').value.trim(),
    phone:   document.getElementById('fp').value.trim(),
    email:   document.getElementById('fe').value.trim(),
    address: document.getElementById('fa').value.trim(),
    city:    document.getElementById('fc').value.trim(),
    notes:   document.getElementById('fno').value.trim()
  };
  renderReview();
  setStep(2);
}

/* ── Totals ──────────────────────────────────────────────── */
function calcTotals() {
  var sub  = window.cart ? window.cart.getCartTotal() : 0;
  var da   = _disc ? _disc.discountAmount : 0;
  var af   = Math.max(0, sub - da);
  var dl   = af >= FREE_DEL ? 0 : DEL_FEE;
  return { sub: sub, da: da, dl: dl, total: af + dl };
}

/* ── Render review ───────────────────────────────────────── */
function renderReview() {
  var cart   = window.cart ? window.cart.getCart() : [];
  var tots   = calcTotals();

  /* Info summary */
  var rows = [
    { l: t('full_name'),        v: _info.name    },
    { l: t('phone_number'),     v: _info.phone   },
    { l: t('delivery_address'), v: _info.address },
    { l: t('city'),             v: _info.city    }
  ];
  if (_info.email) rows.push({ l: t('email_optional'), v: _info.email });
  if (_info.notes) rows.push({ l: t('order_notes'),    v: _info.notes });

  document.getElementById('rv-info').innerHTML =
    '<div class="fct">👤 Personal Info</div>' +
    rows.map(function(r) {
      return '<div class="ir"><span class="il">' + r.l +
             '</span><span class="iv">' + r.v + '</span></div>';
    }).join('');

  /* Items */
  document.getElementById('rv-items').innerHTML = cart.map(function(item) {
    return '<div class="ri">' +
      '<img src="' + (item.image_url || 'assets/placeholder.jpg') +
      '" alt="' + iname(item) + '" loading="lazy"/>' +
      '<div class="rin">' +
        '<div class="rin-name">' + iname(item) + '</div>' +
        '<div class="rin-sub">'  + fp(item.price) + ' × ' + item.quantity + '</div>' +
      '</div>' +
      '<div class="rin-price">' + fp(item.price * item.quantity) + '</div>' +
    '</div>';
  }).join('');

  /* Summary */
  document.getElementById('rs').textContent = fp(tots.sub);

  var dr = document.getElementById('rd');
  if (tots.da > 0) {
    dr.style.display = 'flex';
    document.getElementById('rd-v').textContent = '−' + fp(tots.da);
  } else {
    dr.style.display = 'none';
  }

  var dlEl = document.getElementById('rdl');
  if (tots.dl === 0) {
    dlEl.textContent = t('free');
    dlEl.className   = 'val free';
  } else {
    dlEl.textContent = fp(tots.dl);
    dlEl.className   = 'val';
  }
  document.getElementById('rt').textContent = fp(tots.total);
}

/* ── WhatsApp message ────────────────────────────────────── */
function buildWA(orderNumber, cart, tots) {
  var lines = cart.map(function(item) {
    var nameBn = item.name_bn || item.name_en;
    var nameEn = item.name_en;
    return '  - ' + nameBn + ' / ' + nameEn +
           ' x ' + item.quantity +
           ' = ' + fp(item.price * item.quantity);
  }).join('\n');

  var msg = '🛒 নতুন অর্ডার / New Order\n';
  msg += '────────────────\n';
  msg += 'নাম / Name: '    + _info.name    + '\n';
  msg += 'ফোন / Phone: '   + _info.phone   + '\n';
  msg += 'ঠিকানা / Address: ' + _info.address + ', ' + _info.city + '\n';
  if (_info.notes) msg += 'নোট / Notes: ' + _info.notes + '\n';
  msg += '────────────────\n';
  msg += 'পণ্য / Items:\n' + lines + '\n';
  msg += '────────────────\n';
  msg += 'পণ্যমূল্য / Subtotal: ' + fp(tots.sub) + '\n';
  if (tots.da > 0) msg += 'ছাড় / Discount: −' + fp(tots.da) + '\n';
  msg += 'ডেলিভারি / Delivery: ' + (tots.dl === 0 ? 'বিনামূল্যে / Free' : fp(tots.dl)) + '\n';
  msg += 'মোট / Total: ' + fp(tots.total) + '\n';
  msg += 'অর্ডার নং / Order No: ' + orderNumber + '\n';
  msg += '────────────────\n';
  msg += 'স্মার্ট সুপার শপ | Smart Supper Shop';
  return msg;
}

/* ── Place order ─────────────────────────────────────────── */
async function placeOrder() {
  var btn  = document.getElementById('pb');
  var lblEl = document.getElementById('pb-lbl');
  var spinEl = document.getElementById('pb-spin');

  btn.disabled       = true;
  lblEl.style.display  = 'none';
  spinEl.style.display = 'block';

  var cart = window.cart ? window.cart.getCart() : [];
  if (!cart.length) {
    if (window.utils) window.utils.showToast(
      gl() === 'bn' ? 'কার্ট খালি' : 'Cart is empty', 'error'
    );
    btn.disabled        = false;
    lblEl.style.display  = 'flex';
    spinEl.style.display = 'none';
    return;
  }

  var tots = calcTotals();

  if (!window.supabase) {
    await new Promise(function(r) {
      window.addEventListener('supabaseReady', r, { once: true });
    });
  }

  try {
    var res = await window.supabase
      .from('orders')
      .insert({
        customer_name:   _info.name,
        customer_phone:  _info.phone,
        customer_email:  _info.email  || null,
        address:         _info.address,
        city:            _info.city,
        notes:           _info.notes  || null,
        subtotal:        tots.sub,
        discount_amount: tots.da,
        total:           tots.total,
        discount_id:     _disc ? _disc.discountId : null,
        status:          'pending',
        payment_method:  'whatsapp'
      })
      .select()
      .single();

    if (res.error) throw res.error;

    var lang  = gl();
    var items = cart.map(function(item) {
      return {
        order_id:      res.data.id,
        product_id:    item.id,
        product_name:  (lang === 'bn' && item.name_bn) ? item.name_bn : item.name_en,
        product_image: item.image_url || null,
        unit_price:    item.price,
        quantity:      item.quantity,
        total_price:   item.price * item.quantity
      };
    });

    var iRes = await window.supabase.from('order_items').insert(items);
    if (iRes.error) throw iRes.error;

    var waMsg = buildWA(res.data.order_number, cart, tots);
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(waMsg), '_blank');
    window.location.href = 'order-success.html?id=' + res.data.id +
                           '&order=' + encodeURIComponent(res.data.order_number);

  } catch (err) {
    console.error('placeOrder:', err);
    btn.disabled        = false;
    lblEl.style.display  = 'flex';
    spinEl.style.display = 'none';
    if (window.utils) window.utils.showToast(
      gl() === 'bn'
        ? 'অর্ডার দেওয়া যায়নি। আবার চেষ্টা করুন।'
        : 'Failed to place order. Please try again.',
      'error'
    );
  }
}

/* ── Language changed ────────────────────────────────────── */
window.addEventListener('languageChanged', function() {
  if (_step === 2) renderReview();
});

/* ── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  var lang = localStorage.getItem('lang') || 'bn';
  if (window.i18n) window.i18n.setLanguage(lang);

  var c = window.cart ? window.cart.getCart() : [];
  if (!c.length) { window.location.href = 'cart.html'; return; }

  /* FIX 3: Update cart badge */
  if (window.cart) window.cart.renderCartBadge();

  try {
    var sd = sessionStorage.getItem('applied_discount');
    if (sd) _disc = JSON.parse(sd);
  } catch (e) {}

  /* Clear error on input */
  var map = { fn: 'en', fp: 'ep', fa: 'ea', fc: 'ec' };
  Object.keys(map).forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', function() {
      this.classList.remove('err');
      var er = document.getElementById(map[id]);
      if (er) er.classList.remove('show');
    });
  });

  setStep(1);
});
