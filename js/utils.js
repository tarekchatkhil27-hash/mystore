/**
 * ============================================================
 * utils.js — Shared Helper Functions
 * Smart Supper Shop | স্মার্ট সুপার শপ
 * ============================================================
 * Depends on: i18n.js (must be loaded before this file)
 * ============================================================
 */

// ─────────────────────────────────────────────
// TOAST STYLES — injected once into <head>
// ─────────────────────────────────────────────
(function injectToastStyles() {
  if (document.getElementById('utils-toast-styles')) return;
  const style = document.createElement('style');
  style.id = 'utils-toast-styles';
  style.textContent = `
    #toast-container {
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 99999;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      pointer-events: none;
      width: 90%;
      max-width: 360px;
    }
    .toast-msg {
      font-family: var(--font-body, 'Tiro Bangla', serif);
      font-size: 0.92rem;
      line-height: 1.5;
      padding: 12px 20px;
      border-radius: 12px;
      color: #fff;
      box-shadow: 0 4px 20px rgba(0,0,0,0.18);
      opacity: 0;
      transform: translateY(-12px);
      animation: toastIn 0.3s ease forwards;
      pointer-events: auto;
      text-align: center;
      max-width: 100%;
      word-break: break-word;
    }
    .toast-msg.toast-success { background: #10B981; }
    .toast-msg.toast-error   { background: #EF4444; }
    .toast-msg.toast-info    { background: #4F46E5; }
    .toast-msg.toast-hide {
      animation: toastOut 0.3s ease forwards;
    }
    @keyframes toastIn {
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes toastOut {
      to { opacity: 0; transform: translateY(-10px); }
    }
  `;
  document.head.appendChild(style);
})();

// Create toast container once
function getToastContainer() {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

// ─────────────────────────────────────────────
// formatPrice(amount)
// Returns "৳1,200" formatted with Taka symbol
// ─────────────────────────────────────────────
function formatPrice(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '৳0';
  const num = parseFloat(amount);
  return '৳' + num.toLocaleString('en-BD', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

// ─────────────────────────────────────────────
// formatDate(dateString)
// Returns "25 Apr 2025"
// ─────────────────────────────────────────────
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  const months = ['Jan','Feb','Mar','Apr','May','Jun',
                  'Jul','Aug','Sep','Oct','Nov','Dec'];
  return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
}

// ─────────────────────────────────────────────
// showToast(message, type)
// type: 'success' | 'error' | 'info'
// Works with both Bangla and English text
// ─────────────────────────────────────────────
function showToast(message, type) {
  type = type || 'info';
  const container = getToastContainer();

  const toast = document.createElement('div');
  toast.className = 'toast-msg toast-' + type;

  // Apply correct font based on active language
  const lang = getLang();
  toast.style.fontFamily = lang === 'bn'
    ? "'Tiro Bangla', serif"
    : "'Times New Roman', Times, serif";

  toast.textContent = message;
  container.appendChild(toast);

  // Auto-remove after 3 seconds
  setTimeout(function () {
    toast.classList.add('toast-hide');
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 350);
  }, 3000);
}

// ─────────────────────────────────────────────
// generateSlug(text)
// Converts text to URL-friendly slug
// ─────────────────────────────────────────────
function generateSlug(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')   // spaces and non-word chars → dash
    .replace(/^-+|-+$/g, '');    // strip leading/trailing dashes
}

// ─────────────────────────────────────────────
// debounce(func, wait)
// Delays function execution until user stops typing
// Usage: const debouncedSearch = debounce(search, 300);
// ─────────────────────────────────────────────
function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      func.apply(context, args);
    }, wait || 300);
  };
}

// ─────────────────────────────────────────────
// triggerHaptic()
// Short vibration feedback on mobile
// ─────────────────────────────────────────────
function triggerHaptic() {
  if (navigator && navigator.vibrate) {
    navigator.vibrate(30);
  }
}

// ─────────────────────────────────────────────
// getLang()
// Returns current language: 'bn' or 'en'
// ─────────────────────────────────────────────
function getLang() {
  return localStorage.getItem('lang') || 'bn';
}

// ─────────────────────────────────────────────
// getProductName(product)
// Returns Bangla name if lang=bn and it exists,
// otherwise returns English name
// ─────────────────────────────────────────────
function getProductName(product) {
  if (!product) return '';
  const lang = getLang();
  if (lang === 'bn' && product.name_bn && product.name_bn.trim() !== '') {
    return product.name_bn;
  }
  return product.name_en || '';
}

// ─────────────────────────────────────────────
// getCategoryName(category)
// Same bilingual logic for categories
// ─────────────────────────────────────────────
function getCategoryName(category) {
  if (!category) return '';
  const lang = getLang();
  if (lang === 'bn' && category.name_bn && category.name_bn.trim() !== '') {
    return category.name_bn;
  }
  return category.name_en || '';
}

// ─────────────────────────────────────────────
// getProductDescription(product)
// Same bilingual logic for descriptions
// ─────────────────────────────────────────────
function getProductDescription(product) {
  if (!product) return '';
  const lang = getLang();
  if (lang === 'bn' && product.description_bn && product.description_bn.trim() !== '') {
    return product.description_bn;
  }
  return product.description_en || '';
}

// ─────────────────────────────────────────────
// Re-apply font to toasts when language changes
// ─────────────────────────────────────────────
window.addEventListener('languageChanged', function () {
  // Future toasts will pick up new lang from getLang() automatically
});

// ─────────────────────────────────────────────
// EXPORT to window.utils
// ─────────────────────────────────────────────
window.utils = {
  formatPrice:            formatPrice,
  formatDate:             formatDate,
  showToast:              showToast,
  generateSlug:           generateSlug,
  debounce:               debounce,
  triggerHaptic:          triggerHaptic,
  getLang:                getLang,
  getProductName:         getProductName,
  getCategoryName:        getCategoryName,
  getProductDescription:  getProductDescription
};
