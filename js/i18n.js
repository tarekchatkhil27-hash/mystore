/**
 * ============================================================
 * i18n.js — Bilingual Language System
 * Smart Supper Shop | স্মার্ট সুপার শপ
 * Languages: English (en) | Bangla (bn)
 * Fonts: Times New Roman (en) | Tiro Bangla (bn)
 *
 * FIX: All variables use var (not const/let) to prevent
 * "already declared" errors when multiple scripts run
 * on the same page.
 * ============================================================
 */

/* global translations object */
var translations = {

  /* ── ENGLISH ─────────────────────────────────────────── */
  en: {
    /* Navigation */
    nav_home:           'Home',
    nav_shop:           'Shop',
    nav_cart:           'Cart',
    nav_contact:        'Contact',
    nav_about:          'About Us',
    lang_toggle:        'বাংলা',

    /* Homepage */
    hero_title:         'Fresh Finds, Great Prices',
    hero_subtitle:      'Quality products delivered to your door',
    hero_cta:           'Shop Now',
    hot_deals:          '🔥 Hot Deals',
    featured_products:  '✨ Featured Products',
    recently_viewed:    '👀 Recently Viewed',
    view_all:           'View All',
    free_delivery_banner: '🚚 Free delivery on orders above ৳500',
    store_name:         'Smart Supper Shop',

    /* Shop / Products */
    add_to_cart:        'Add to Cart',
    added_to_cart:      '✓ Added!',
    out_of_stock:       'Out of Stock',
    low_stock:          'Only {n} left!',
    sale_badge:         'SALE',
    new_badge:          'NEW',
    filter_sort:        'Filter & Sort',
    sort_price_low:     'Price: Low to High',
    sort_price_high:    'Price: High to Low',
    sort_newest:        'Newest First',
    discount_only:      'Discounted Items Only',
    no_products:        'No products found 😕',
    load_more:          'Load More',
    all_categories:     'All',
    search_placeholder: 'Search products...',

    /* Product detail */
    in_stock:           'In Stock',
    description:        'Description',
    delivery_info:      'Delivery Info',
    return_policy:      'Return Policy',
    quantity:           'Quantity',
    you_save:           'You save ৳{n}',
    special_offer:      '🎉 Special Offer Applied!',
    you_may_also_like:  'You May Also Like',
    copy_code:          'Copy Code',
    code_copied:        'Copied!',
    delivery_info_text: 'We deliver within 1–3 business days. ' +
                        'Free delivery on orders above ৳500. ' +
                        'Delivery charge ৳60 for orders below ৳500.',
    return_policy_text: 'Items can be returned within 3 days of delivery ' +
                        'if unused and in original condition. ' +
                        'Contact us via WhatsApp to initiate a return.',

    /* Cart */
    my_cart:            'My Cart',
    cart_empty:         'Your cart is empty 🛒',
    start_shopping:     'Start Shopping',
    coupon_placeholder: 'Enter coupon code',
    apply_coupon:       'Apply',
    coupon_success:     '✓ Coupon applied! You save ৳{n}',
    coupon_error:       'Invalid or expired coupon',
    subtotal:           'Subtotal',
    discount:           'Discount',
    delivery_fee:       'Delivery Fee',
    free:               'Free',
    total:              'Total',
    proceed_checkout:   'Proceed to Checkout',
    remove:             'Remove',

    /* Checkout */
    checkout:           'Checkout',
    your_info:          'Your Info',
    review_order:       'Review Order',
    done:               'Done',
    full_name:          'Full Name',
    phone_number:       'Phone Number',
    email_optional:     'Email (Optional)',
    delivery_address:   'Delivery Address',
    city:               'City / Area',
    order_notes:        'Order Notes (Optional)',
    next_review:        'Next: Review Order →',
    place_order:        'Place Order',
    whatsapp_confirm:   'We will confirm your order via WhatsApp',
    required_field:     'This field is required',

    /* Order success */
    order_placed:       'Order Placed! 🎉',
    order_number:       'Order Number',
    track_whatsapp:     'Track on WhatsApp',
    continue_shopping:  'Continue Shopping',
    thank_you:          'Thank you for your order!',

    /* About */
    about_us:           'About Us',
    our_story:          'Our Story',
    fast_delivery:      'Fast Delivery',
    quality_products:   'Quality Products',
    trusted_service:    'Trusted Service',
    happy_customers:    'Happy Customers',
    shop_now_cta:       'Start Shopping',
    about_story_p1:     'Smart Supper Shop was founded with a simple mission — ' +
                        'to bring fresh, quality products to every home at the best ' +
                        'possible prices. From groceries to textiles, we carefully ' +
                        'select every item we sell.',
    about_story_p2:     'We believe shopping should be easy, affordable, and ' +
                        'trustworthy. With fast delivery and friendly service, ' +
                        'we are your neighbourhood store — just online.',

    /* Contact */
    contact_us:         'Contact Us',
    chat_whatsapp:      'Chat with us on WhatsApp',
    send_message:       'Send Message',
    message_sent:       'Message sent! We will reply soon ✓',
    business_hours:     'Business Hours',
    business_hours_val: 'Sat – Thu: 9:00 AM – 9:00 PM',
    subject:            'Subject',
    message:            'Message',
    your_name:          'Your Name',
    your_email:         'Your Email (Optional)',
    your_phone:         'Your Phone',

    /* General */
    loading:            'Loading...',
    error_loading:      'Something went wrong. Please try again.',
    items:              'items',
    item:               'item',
    close:              'Close',
    save:               'Save',
    cancel:             'Cancel',
    delete:             'Delete',
    edit:               'Edit',
    search:             'Search',
    back:               'Back'
  },

  /* ── BANGLA ──────────────────────────────────────────── */
  bn: {
    /* Navigation */
    nav_home:           'হোম',
    nav_shop:           'শপ',
    nav_cart:           'কার্ট',
    nav_contact:        'যোগাযোগ',
    nav_about:          'আমাদের সম্পর্কে',
    lang_toggle:        'EN',

    /* Homepage */
    hero_title:         'সেরা পণ্য, সেরা দাম',
    hero_subtitle:      'মানসম্পন্ন পণ্য আপনার দোরগোড়ায়',
    hero_cta:           'এখনই কিনুন',
    hot_deals:          '🔥 গরম অফার',
    featured_products:  '✨ বিশেষ পণ্য',
    recently_viewed:    '👀 সম্প্রতি দেখা',
    view_all:           'সব দেখুন',
    free_delivery_banner: '🚚 ৳৫০০ এর উপরে অর্ডারে বিনামূল্যে ডেলিভারি',
    store_name:         'স্মার্ট সুপার শপ',

    /* Shop / Products */
    add_to_cart:        'কার্টে যোগ করুন',
    added_to_cart:      '✓ যোগ হয়েছে!',
    out_of_stock:       'স্টক নেই',
    low_stock:          'মাত্র {n}টি বাকি!',
    sale_badge:         'সেল',
    new_badge:          'নতুন',
    filter_sort:        'ফিল্টার ও সাজান',
    sort_price_low:     'দাম: কম থেকে বেশি',
    sort_price_high:    'দাম: বেশি থেকে কম',
    sort_newest:        'নতুন আগে',
    discount_only:      'শুধু ছাড়ের পণ্য',
    no_products:        'কোনো পণ্য পাওয়া যায়নি 😕',
    load_more:          'আরও দেখুন',
    all_categories:     'সব',
    search_placeholder: 'পণ্য খুঁজুন...',

    /* Product detail */
    in_stock:           'স্টকে আছে',
    description:        'বিবরণ',
    delivery_info:      'ডেলিভারি তথ্য',
    return_policy:      'ফেরত নীতি',
    quantity:           'পরিমাণ',
    you_save:           'আপনি ৳{n} সাশ্রয় করছেন',
    special_offer:      '🎉 বিশেষ অফার প্রযোজ্য!',
    you_may_also_like:  'আপনার পছন্দ হতে পারে',
    copy_code:          'কোড কপি করুন',
    code_copied:        'কপি হয়েছে!',
    delivery_info_text: 'আমরা ১–৩ কার্যদিবসের মধ্যে ডেলিভারি দিই। ' +
                        '৳৫০০ এর উপরে অর্ডারে বিনামূল্যে ডেলিভারি। ' +
                        '৳৫০০ এর নিচে ডেলিভারি চার্জ ৳৬০।',
    return_policy_text: 'ডেলিভারির ৩ দিনের মধ্যে অব্যবহৃত ও অক্ষত অবস্থায় ' +
                        'পণ্য ফেরত দেওয়া যাবে। ' +
                        'ফেরতের জন্য হোয়াটসঅ্যাপে যোগাযোগ করুন।',

    /* Cart */
    my_cart:            'আমার কার্ট',
    cart_empty:         'আপনার কার্ট খালি 🛒',
    start_shopping:     'কেনাকাটা শুরু করুন',
    coupon_placeholder: 'কুপন কোড লিখুন',
    apply_coupon:       'প্রয়োগ করুন',
    coupon_success:     '✓ কুপন প্রয়োগ হয়েছে! আপনি ৳{n} বাঁচাচ্ছেন',
    coupon_error:       'অবৈধ বা মেয়াদ উত্তীর্ণ কুপন',
    subtotal:           'মোট পণ্যমূল্য',
    discount:           'ছাড়',
    delivery_fee:       'ডেলিভারি চার্জ',
    free:               'বিনামূল্যে',
    total:              'মোট',
    proceed_checkout:   'চেকআউটে যান',
    remove:             'সরিয়ে দিন',

    /* Checkout */
    checkout:           'চেকআউট',
    your_info:          'আপনার তথ্য',
    review_order:       'অর্ডার পর্যালোচনা',
    done:               'সম্পন্ন',
    full_name:          'পুরো নাম',
    phone_number:       'ফোন নম্বর',
    email_optional:     'ইমেইল (ঐচ্ছিক)',
    delivery_address:   'ডেলিভারি ঠিকানা',
    city:               'শহর / এলাকা',
    order_notes:        'অর্ডার নোট (ঐচ্ছিক)',
    next_review:        'পরবর্তী: অর্ডার পর্যালোচনা →',
    place_order:        'অর্ডার করুন',
    whatsapp_confirm:   'আমরা হোয়াটসঅ্যাপে আপনার অর্ডার নিশ্চিত করব',
    required_field:     'এই ঘরটি পূরণ করা আবশ্যক',

    /* Order success */
    order_placed:       'অর্ডার সম্পন্ন! 🎉',
    order_number:       'অর্ডার নম্বর',
    track_whatsapp:     'হোয়াটসঅ্যাপে ট্র্যাক করুন',
    continue_shopping:  'কেনাকাটা চালিয়ে যান',
    thank_you:          'আপনার অর্ডারের জন্য ধন্যবাদ!',

    /* About */
    about_us:           'আমাদের সম্পর্কে',
    our_story:          'আমাদের গল্প',
    fast_delivery:      'দ্রুত ডেলিভারি',
    quality_products:   'মানসম্পন্ন পণ্য',
    trusted_service:    'বিশ্বস্ত সেবা',
    happy_customers:    'সন্তুষ্ট গ্রাহক',
    shop_now_cta:       'কেনাকাটা শুরু করুন',
    about_story_p1:     'স্মার্ট সুপার শপ একটি সহজ লক্ষ্য নিয়ে যাত্রা শুরু করেছে — ' +
                        'সেরা দামে তাজা ও মানসম্পন্ন পণ্য প্রতিটি ঘরে পৌঁছে দেওয়া। ' +
                        'মুদিখানা থেকে বস্ত্র, আমরা প্রতিটি পণ্য সযত্নে বাছাই করি।',
    about_story_p2:     'আমরা বিশ্বাস করি কেনাকাটা হওয়া উচিত সহজ, সাশ্রয়ী এবং বিশ্বস্ত। ' +
                        'দ্রুত ডেলিভারি ও বন্ধুত্বপূর্ণ সেবায় আমরা আপনার পাড়ার দোকান ' +
                        '— শুধু অনলাইনে।',

    /* Contact */
    contact_us:         'আমাদের সাথে যোগাযোগ করুন',
    chat_whatsapp:      'হোয়াটসঅ্যাপে আমাদের সাথে কথা বলুন',
    send_message:       'বার্তা পাঠান',
    message_sent:       'বার্তা পাঠানো হয়েছে! আমরা শীঘ্রই উত্তর দেব ✓',
    business_hours:     'ব্যবসার সময়',
    business_hours_val: 'শনি – বৃহঃ: সকাল ৯টা – রাত ৯টা',
    subject:            'বিষয়',
    message:            'বার্তা',
    your_name:          'আপনার নাম',
    your_email:         'আপনার ইমেইল (ঐচ্ছিক)',
    your_phone:         'আপনার ফোন নম্বর',

    /* General */
    loading:            'লোড হচ্ছে...',
    error_loading:      'কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন।',
    items:              'টি পণ্য',
    item:               'টি পণ্য',
    close:              'বন্ধ করুন',
    save:               'সংরক্ষণ করুন',
    cancel:             'বাতিল করুন',
    delete:             'মুছুন',
    edit:               'সম্পাদনা করুন',
    search:             'খুঁজুন',
    back:               'পেছনে'
  }
};

/* ============================================================
   FONT LOADER — injects Tiro Bangla from Google Fonts once
============================================================ */
(function loadFonts() {
  var fontId = 'i18n-google-fonts';
  if (document.getElementById(fontId)) return;
  var link    = document.createElement('link');
  link.id     = fontId;
  link.rel    = 'stylesheet';
  link.href   =
    'https://fonts.googleapis.com/css2?family=Tiro+Bangla:ital@0;1&display=swap';
  document.head.appendChild(link);
}());

/* ============================================================
   setLanguage(lang)
   Saves choice, updates DOM classes, swaps font, re-renders
   all data-i18n / data-i18n-placeholder elements, fires event.
============================================================ */
function setLanguage(lang) {
  if (lang !== 'en' && lang !== 'bn') lang = 'bn';

  /* 1. Persist */
  localStorage.setItem('lang', lang);

  /* 2. HTML element class + lang attribute */
  var html = document.documentElement;
  html.classList.remove('lang-en', 'lang-bn');
  html.classList.add('lang-' + lang);
  html.setAttribute('lang', lang === 'bn' ? 'bn' : 'en');

  /* 3. Switch font CSS variable — ONE declaration, no duplicate */
  var fontFamily = lang === 'bn'
    ? "'Tiro Bangla', serif"
    : "'Times New Roman', Times, serif";
  html.style.setProperty('--font-body', fontFamily);

  /* 4. Re-render text content for all data-i18n elements */
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var key       = el.getAttribute('data-i18n');
    var vars      = {};
    var nVal      = el.getAttribute('data-i18n-n');
    if (nVal !== null) vars.n = nVal;
    var translated = t(key, vars, lang);
    if (translated) el.textContent = translated;
  });

  /* 5. Re-render placeholders */
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
    var key        = el.getAttribute('data-i18n-placeholder');
    var translated = t(key, {}, lang);
    if (translated) el.placeholder = translated;
  });

  /* 6. Re-render title attributes */
  document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
    var key        = el.getAttribute('data-i18n-title');
    var translated = t(key, {}, lang);
    if (translated) el.title = translated;
  });

  /* 7. Fire event so other scripts can react */
  window.dispatchEvent(
    new CustomEvent('languageChanged', { detail: { lang: lang } })
  );
}

/* ============================================================
   toggleLanguage()
   Flips between bn and en
============================================================ */
function toggleLanguage() {
  var current = localStorage.getItem('lang') || 'bn';
  setLanguage(current === 'bn' ? 'en' : 'bn');
}

/* ============================================================
   t(key, vars, forceLang)
   Returns translated string. Replaces {n} with vars.n.
   Falls back to English if Bangla key is missing.
============================================================ */
function t(key, vars, forceLang) {
  var lang = forceLang || localStorage.getItem('lang') || 'bn';
  var str  = (translations[lang] && translations[lang][key])
    ? translations[lang][key]
    : (translations['en'][key] || key);

  if (vars && typeof vars === 'object') {
    Object.keys(vars).forEach(function (k) {
      str = str.replace(
        new RegExp('\\{' + k + '\\}', 'g'),
        vars[k]
      );
    });
  }
  return str;
}

/* ============================================================
   getLang()
   Returns current language code: 'bn' or 'en'
============================================================ */
function getLang() {
  return localStorage.getItem('lang') || 'bn';
}

/* ============================================================
   AUTO-INIT on every page load
   Reads saved language from localStorage (defaults to bn)
   and applies it immediately.
============================================================ */
(function init() {
  var saved = localStorage.getItem('lang') || 'bn';
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setLanguage(saved);
    });
  } else {
    setLanguage(saved);
  }
}());

/* ============================================================
   EXPORT to window.i18n
============================================================ */
window.i18n = {
  setLanguage:    setLanguage,
  toggleLanguage: toggleLanguage,
  t:              t,
  getLang:        getLang,
  translations:   translations
};

