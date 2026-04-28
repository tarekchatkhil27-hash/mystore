/**
 * ============================================================
 * cart.js — Shopping Cart Logic
 * Smart Supper Shop | স্মার্ট সুপার শপ
 * ============================================================
 * Depends on: supabase.js, i18n.js, utils.js
 * Cart data stored in localStorage key: 'cart'
 * Each item shape:
 *   {
 *     id:        string  (product UUID from Supabase),
 *     name_en:   string,
 *     name_bn:   string,
 *     price:     number,
 *     image_url: string,
 *     quantity:  number,
 *     unit_en:   string,
 *     unit_bn:   string
 *   }
 * ============================================================
 */

// ─────────────────────────────────────────────
// CART BADGE BOUNCE — injected once
// ─────────────────────────────────────────────
(function injectCartStyles() {
  if (document.getElementById('cart-styles')) return;
  const style = document.createElement('style');
  style.id = 'cart-styles';
  style.textContent = `
    @keyframes cartBounce {
      0%   { transform: scale(1); }
      30%  { transform: scale(1.45); }
      60%  { transform: scale(0.88); }
      80%  { transform: scale(1.12); }
      100% { transform: scale(1); }
    }
    .cart-badge-bounce {
      animation: cartBounce 0.5s ease forwards;
    }
    .cart-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 18px;
      height: 18px;
      padding: 0 5px;
      border-radius: 999px;
      background: #EF4444;
      color: #fff;
      font-size: 0.68rem;
      font-weight: 700;
      line-height: 1;
      position: absolute;
      top: -6px;
      right: -6px;
    }
    .cart-badge[data-count="0"] {
      display: none;
    }
  `;
  document.head.appendChild(style);
})();

const CART_KEY = 'cart';

// ─────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────
function _readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function _writeCart(cartArray) {
  localStorage.setItem(CART_KEY, JSON.stringify(cartArray));
}

function _bounceBadge() {
  document.querySelectorAll('.cart-badge').forEach(function (badge) {
    badge.classList.remove('cart-badge-bounce');
    // Force reflow so animation replays
    void badge.offsetWidth;
    badge.classList.add('cart-badge-bounce');
    badge.addEventListener('animationend', function () {
      badge.classList.remove('cart-badge-bounce');
    }, { once: true });
  });
}

// ─────────────────────────────────────────────
// renderCartBadge()
// Updates every .cart-badge element on the page
// ─────────────────────────────────────────────
function renderCartBadge() {
  const count = getCartCount();
  document.querySelectorAll('.cart-badge').forEach(function (badge) {
    badge.textContent = count > 99 ? '99+' : count;
    badge.setAttribute('data-count', count);
    badge.style.display = count === 0 ? 'none' : 'inline-flex';
  });
}

// ─────────────────────────────────────────────
// getCart()
// Returns the full cart array
// ─────────────────────────────────────────────
function getCart() {
  return _readCart();
}

// ─────────────────────────────────────────────
// getCartCount()
// Total number of individual items (sum of quantities)
// ─────────────────────────────────────────────
function getCartCount() {
  return _readCart().reduce(function (sum, item) {
    return sum + (item.quantity || 0);
  }, 0);
}

// ─────────────────────────────────────────────
// getCartTotal()
// Total monetary value of all cart items
// ─────────────────────────────────────────────
function getCartTotal() {
  return _readCart().reduce(function (sum, item) {
    return sum + ((item.price || 0) * (item.quantity || 0));
  }, 0);
}

// ─────────────────────────────────────────────
// addToCart(product)
// Adds a product or increments quantity if already in cart
// product must have: id, name_en, name_bn, price,
//                    image_url, unit_en, unit_bn
// ─────────────────────────────────────────────
function addToCart(product) {
  if (!product || !product.id) {
    console.warn('cart.addToCart: invalid product', product);
    return;
  }

  const cart = _readCart();
  const existing = cart.find(function (item) { return item.id === product.id; });

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id:        product.id,
      name_en:   product.name_en   || '',
      name_bn:   product.name_bn   || '',
      price:     parseFloat(product.price) || 0,
      image_url: product.image_url || '',
      quantity:  1,
      unit_en:   product.unit_en   || 'piece',
      unit_bn:   product.unit_bn   || 'পিস'
    });
  }

  _writeCart(cart);

  // Toast notification
  const msg = (window.i18n && window.i18n.t)
    ? window.i18n.t('added_to_cart')
    : 'Added to cart!';
  if (window.utils && window.utils.showToast) {
    window.utils.showToast(msg, 'success');
  }

  // Haptic feedback
  if (window.utils && window.utils.triggerHaptic) {
    window.utils.triggerHaptic();
  }

  // Bounce the badge
  renderCartBadge();
  _bounceBadge();
}

// ─────────────────────────────────────────────
// removeFromCart(productId)
// Removes a product entirely from the cart
// ─────────────────────────────────────────────
function removeFromCart(productId) {
  const cart = _readCart().filter(function (item) {
    return item.id !== productId;
  });
  _writeCart(cart);
  renderCartBadge();

  // Optional toast
  if (window.utils && window.utils.showToast) {
    const msg = (window.i18n && window.i18n.t)
      ? window.i18n.t('remove')
      : 'Removed';
    window.utils.showToast(msg, 'info');
  }
}

// ─────────────────────────────────────────────
// updateQuantity(productId, qty)
// Sets quantity. Removes item if qty <= 0
// ─────────────────────────────────────────────
function updateQuantity(productId, qty) {
  qty = parseInt(qty, 10);
  if (isNaN(qty) || qty <= 0) {
    removeFromCart(productId);
    return;
  }
  const cart = _readCart().map(function (item) {
    if (item.id === productId) {
      item.quantity = qty;
    }
    return item;
  });
  _writeCart(cart);
  renderCartBadge();
}

// ─────────────────────────────────────────────
// clearCart()
// Empties the entire cart
// ─────────────────────────────────────────────
function clearCart() {
  _writeCart([]);
  renderCartBadge();
}

// ─────────────────────────────────────────────
// applyDiscount(code)
// Validates a coupon code against Supabase
// Returns: { valid, discountAmount, discountId, discountType, discountValue, message }
//
// Waits for Supabase to be ready before querying.
// ─────────────────────────────────────────────
async function applyDiscount(code) {
  if (!code || code.trim() === '') {
    return {
      valid: false,
      discountAmount: 0,
      discountId: null,
      message: (window.i18n && window.i18n.t)
        ? window.i18n.t('coupon_error')
        : 'Invalid coupon code'
    };
  }

  // Wait for Supabase client if not yet ready
  if (!window.supabase) {
    await new Promise(function (resolve) {
      window.addEventListener('supabaseReady', resolve, { once: true });
    });
  }

  try {
    const { data, error } = await window.supabase
      .from('discounts')
      .select('*')
      .eq('code', code.trim().toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return {
        valid: false,
        discountAmount: 0,
        discountId: null,
        message: (window.i18n && window.i18n.t)
          ? window.i18n.t('coupon_error')
          : 'Invalid or expired coupon'
      };
    }

    // Check expiry
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return {
        valid: false,
        discountAmount: 0,
        discountId: null,
        message: (window.i18n && window.i18n.t)
          ? window.i18n.t('coupon_error')
          : 'This coupon has expired'
      };
    }

    // Check max uses
    if (data.max_uses && data.uses_count >= data.max_uses) {
      return {
        valid: false,
        discountAmount: 0,
        discountId: null,
        message: (window.i18n && window.i18n.t)
          ? window.i18n.t('coupon_error')
          : 'This coupon has reached its usage limit'
      };
    }

    // Check minimum order amount
    const cartTotal = getCartTotal();
    if (data.min_order_amount && cartTotal < parseFloat(data.min_order_amount)) {
      return {
        valid: false,
        discountAmount: 0,
        discountId: null,
        message: (window.i18n && window.i18n.t)
          ? `Minimum order ৳${data.min_order_amount} required`
          : `Minimum order ৳${data.min_order_amount} required`
      };
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (data.type === 'percent') {
      discountAmount = Math.round((cartTotal * parseFloat(data.value)) / 100);
    } else if (data.type === 'flat') {
      discountAmount = Math.min(parseFloat(data.value), cartTotal);
    }

    const successMsg = (window.i18n && window.i18n.t)
      ? window.i18n.t('coupon_success', { n: discountAmount })
      : `Coupon applied! You save ৳${discountAmount}`;

    return {
      valid:         true,
      discountAmount: discountAmount,
      discountId:    data.id,
      discountType:  data.type,
      discountValue: data.value,
      appliesTo:     data.applies_to,
      message:       successMsg
    };

  } catch (err) {
    console.error('cart.applyDiscount error:', err);
    return {
      valid: false,
      discountAmount: 0,
      discountId: null,
      message: (window.i18n && window.i18n.t)
        ? window.i18n.t('error_loading')
        : 'Something went wrong. Please try again.'
    };
  }
}

// ─────────────────────────────────────────────
// Listen for languageChanged
// Re-renders cart badge text (count stays same,
// but other pages may re-render product names)
// ─────────────────────────────────────────────
window.addEventListener('languageChanged', function () {
  renderCartBadge();
});

// ─────────────────────────────────────────────
// Run renderCartBadge on page load
// ─────────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderCartBadge);
} else {
  renderCartBadge();
}

// ─────────────────────────────────────────────
// EXPORT to window.cart
// ─────────────────────────────────────────────
window.cart = {
  addToCart:      addToCart,
  removeFromCart: removeFromCart,
  updateQuantity: updateQuantity,
  getCart:        getCart,
  clearCart:      clearCart,
  getCartCount:   getCartCount,
  getCartTotal:   getCartTotal,
  applyDiscount:  applyDiscount,
  renderCartBadge: renderCartBadge
};
