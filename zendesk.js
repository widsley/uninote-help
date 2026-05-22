/*
 * Zendesk Web Widget loader for Uninote Help Center
 * ---------------------------------------------------
 * This script replaces the previous Plain widget integration.
 *
 * Uninote brand routing:
 *   Brand subdomain : https://uninoteai.zendesk.com
 *   Brand ID        : 58172052091801
 *
 * comdesk のサポートとは Zendesk 上でブランド分離されているため、
 * このスクリプト経由で送られた問い合わせは Uninote サポートチームのみが受信します。
 *
 * --- 仕組み ---
 * 1. Zendesk Web Widget (Classic) のスニペットを <head> に挿入。
 * 2. ロード後、brand を Uninote(58172052091801) に固定し再アサート。
 * 3. ロケール (ja / en) は Mintlify の URL から推定し widget locale に渡す。
 *
 * --- ZENDESK_WIDGET_KEY について ---
 * これは Zendesk が公開している Widget Key (UUID) であり、
 * ヘルプセンターを開いた誰でも DevTools で見える「公開情報」です。
 * 秘密情報ではないため commit して構いません。
 * ただし comdesk ブランドの Key と取り違えると問い合わせが流れる先が変わるため、
 * 必ず Uninote 用の Key (`efaa69d0-...`) を使うこと。
 */
(function () {
  "use strict";

  var ZENDESK_BRAND_URL  = "https://uninoteai.zendesk.com";
  var ZENDESK_BRAND_ID   = 58172052091801;
  var ZENDESK_WIDGET_KEY = "efaa69d0-0a1a-4e7a-9aeb-b97d9fe40cc9";

  if (window.__uninoteZendeskLoaded) { return; }
  window.__uninoteZendeskLoaded = true;

  function detectLocale() {
    try {
      var path = window.location.pathname || "";
      if (path.indexOf("/en") === 0) { return "en"; }
      return "ja";
    } catch (e) {
      return "ja";
    }
  }
  var locale = detectLocale();

  window.zESettings = {
    webWidget: {
      brand: ZENDESK_BRAND_ID,
      color: { theme: "#5B4CFF" },
      helpCenter:  { originalArticleButton: false, suppress: false },
      contactForm: { suppress: false, attachments: true },
      contactOptions: { enabled: false },
      offset: { horizontal: "16px", vertical: "16px" }
    }
  };

  function injectZendesk() {
    if (document.getElementById("ze-snippet")) { return; }
    var s = document.createElement("script");
    s.id    = "ze-snippet";
    s.async = true;
    s.src   = "https://static.zdassets.com/ekr/snippet.js?key=" +
              encodeURIComponent(ZENDESK_WIDGET_KEY);
    s.onload = function () {
      if (typeof window.zE !== "function") { return; }
      try {
        window.zE("webWidget", "setLocale", locale);
        window.zE("webWidget:on", "open", function () {
          window.zE("webWidget", "updateSettings", {
            webWidget: { brand: ZENDESK_BRAND_ID }
          });
        });
      } catch (err) {
        if (window.console) {
          console.warn("[uninote/zendesk.js] widget post-init failed:", err);
        }
      }
    };
    (document.head || document.documentElement).appendChild(s);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectZendesk, { once: true });
  } else {
    injectZendesk();
  }

  window.UninoteSupport = {
    brandUrl:    ZENDESK_BRAND_URL,
    brandId:     ZENDESK_BRAND_ID,
    helpCenter:  ZENDESK_BRAND_URL + "/hc/" + locale,
    newRequest:  ZENDESK_BRAND_URL + "/hc/" + locale + "/requests/new"
  };
})();
