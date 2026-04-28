/**
 * ============================================================
 * supabase.js — Supabase Client Initialization
 * Smart Supper Shop | স্মার্ট সুপার শপ
 * ============================================================
 * IMPORTANT: This file must be loaded BEFORE i18n.js, utils.js,
 * and cart.js on every page.
 * ============================================================
 */

// Load Supabase from CDN
(function loadSupabaseSDK() {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  script.onload = function () {
    const SUPABASE_URL  = 'https://pqybuwpeillfpvzihzkv.supabase.co';
    const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxeWJ1d3BlaWxsZnB2emloemt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwOTEyMzcsImV4cCI6MjA5MjY2NzIzN30.kIqc0qq6voKqZZEEIq6JIqh1XChL0mZ4ZYBwbl2INiU';

    // Create and export the Supabase client globally
    window.supabase = window.supabase || supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

    // Signal that Supabase is ready
    window.dispatchEvent(new CustomEvent('supabaseReady'));
  };
  script.onerror = function () {
    console.error('Failed to load Supabase SDK. Check your internet connection.');
  };
  document.head.appendChild(script);
})();
