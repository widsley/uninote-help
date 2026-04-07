(function (d, script) {
  script = d.createElement('script');
  script.async = false;
  script.onload = function () {
    Plain.init({
      appId: 'liveChatApp_01KNKPP39TZEA8FTJNB9GQWCHA',
      hideLauncher: true,
    });

    var style = document.createElement('style');
    style.textContent = '#plain-contact-btn{position:fixed;bottom:24px;right:24px;z-index:9999;background:#6E42EC;color:#fff;border:none;border-radius:24px;padding:12px 20px;font-size:14px;font-weight:600;font-family:system-ui,sans-serif;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.18);display:flex;align-items:center;gap:8px;transition:background .2s,transform .1s}#plain-contact-btn:hover{background:#5a32d4;transform:scale(1.04)}';
    document.head.appendChild(style);

    var btn = document.createElement('button');
    btn.id = 'plain-contact-btn';
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>お問い合わせ';
    btn.onclick = function () { Plain.open(); };
    document.body.appendChild(btn);
  };
  script.src = 'https://chat.cdn-plain.com/index.js';
  d.getElementsByTagName('head')[0].appendChild(script);
}(document));
