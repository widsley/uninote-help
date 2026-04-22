/**
 * Uninote Help - Locale Auto Redirect
 *
 * 仕様:
 * - ルート "/" や言語プレフィックスなしのパスにアクセスしたとき、
 *   適切な言語 (/ja または /en) に自動リダイレクトする。
 * - 優先順位: Cookie(前回の選択) > ブラウザ言語 > タイムゾーン > デフォルト(en)
 * - 既に /ja/* や /en/* にいる場合、その言語を Cookie に保存して以後はそれを優先。
 *   → ヘッダーの言語スイッチャーで切り替えたら自動的に記憶される。
 * - クエリ ?lang=ja|en が付いていれば最優先(テスト用)。
 */
(function () {
  'use strict';

  var SUPPORTED = ['ja', 'en'];
  var DEFAULT_LANG = 'en';
  var COOKIE_NAME = 'uninote_help_lang';
  var COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1年

  // --- Cookie ヘルパー ---
  function getCookie(name) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  }
  function setCookie(name, value) {
    document.cookie =
      name + '=' + encodeURIComponent(value) +
      ';path=/;max-age=' + COOKIE_MAX_AGE + ';SameSite=Lax';
  }

  // --- 現在のパスの先頭セグメントから言語を検出 ---
  function langFromPath() {
    var seg = (window.location.pathname.split('/')[1] || '').toLowerCase();
    return SUPPORTED.indexOf(seg) !== -1 ? seg : null;
  }

  // --- ブラウザ言語 ---
  function langFromBrowser() {
    var list = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < list.length; i++) {
      var code = (list[i] || '').toLowerCase().split('-')[0];
      if (SUPPORTED.indexOf(code) !== -1) return code;
    }
    return null;
  }

  // --- タイムゾーン（Asia/Tokyo のみ日本扱い）---
  function langFromTimezone() {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz === 'Asia/Tokyo') return 'ja';
    } catch (e) {}
    return null;
  }

  // --- クエリパラメータ ?lang= ---
  function langFromQuery() {
    var params = new URLSearchParams(window.location.search);
    var q = (params.get('lang') || '').toLowerCase();
    return SUPPORTED.indexOf(q) !== -1 ? q : null;
  }

  var currentLang = langFromPath();

  // ── ケース1: 既に /ja/* や /en/* にいる ──
  // ユーザーがヘッダーで選んだ結果とみなし、Cookie を更新して終了。
  if (currentLang) {
    if (getCookie(COOKIE_NAME) !== currentLang) {
      setCookie(COOKIE_NAME, currentLang);
    }
    return;
  }

  // ── ケース2: 言語プレフィックスなし("/" など) ──
  // 優先順位に従って振り分け先を決定。
  var queryLang = langFromQuery();
  var savedLang = getCookie(COOKIE_NAME);
  if (savedLang && SUPPORTED.indexOf(savedLang) === -1) savedLang = null;

  var target =
    queryLang ||
    savedLang ||
    langFromBrowser() ||
    langFromTimezone() ||
    DEFAULT_LANG;

  var path = window.location.pathname;
  var search = window.location.search;
  var hash = window.location.hash;

  // "/"          → "/ja" or "/en"
  // "/something" → "/ja/something" or "/en/something"
  var newPath = (path === '/' || path === '')
    ? '/' + target
    : '/' + target + path;

  // 無限ループ防止（念のため）
  if (newPath !== path) {
    window.location.replace(newPath + search + hash);
  }
})();
