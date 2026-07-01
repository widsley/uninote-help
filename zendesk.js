// Zendesk Contact Form Modal - Uninote Help
//
// Comdesk Help の「お問い合わせ」モーダルを Uninote 用に移植したもの。
// 旧実装（Zendesk Web Widget Classic のフローティング「ヘルプ」ランチャー）は廃止し、
// ナビバー右上（Ask Assistant の隣）に「お問い合わせ」ボタンを表示してモーダルを開く。
//
// --- Uninote ブランド routing ---
//   ブランド subdomain : https://uninoteai.zendesk.com
//   ブランド ID        : 58172052091801
//
// Comdesk(comdesklead.zendesk.com) と Uninote(uninoteai.zendesk.com) は
// 「同一 Zendesk アカウントの別ブランド」。フォームとカスタムフィールドはアカウント共通のため、
// comdesk と同じフォーム(900000059466)・同じフィールドIDをそのまま利用する。
// 送信先を uninoteai.zendesk.com にすることで、チケットは自動的に Uninote ブランドになる。
//
// ※「担当者(assignee) を Uninote に固定」したい場合は、エンドユーザー向け Requests API
//   では assignee を直接指定できないため、Zendesk 側のトリガ
//   （ブランド = Uninote → Uninote グループ / 担当者へアサイン）で設定する。
//
// ※「該当箇所」フィールド(14843650824985)の選択肢はアカウント共通で、現状 comdesk の
//   アプリ画面が登録されている。Uninote 用の値を送るとバリデーションエラーになるため、
//   ここでは安全側として 'other' を送信し、選んだ Uninote 区分は本文末尾に記載する。
//   Uninote 専用の選択肢を該当フィールドに追加すれば、下の LOCATION_FIELD_VALUE を
//   location に変えて直接マッピングできる。
(function () {
  var style = document.createElement('style');
  style.textContent = [
    // ナビバー内（Ask Assistant の隣）に置く想定の通常スタイル。フローティングではない。
    '#zd-btn{display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 14px;background:#5B4CFF;color:#fff;border:none;border-radius:18px;font-size:14px;font-weight:600;font-family:system-ui,sans-serif;cursor:pointer;white-space:nowrap;transition:background .2s,opacity .18s}',
    '#zd-btn .zd-label{display:inline}',
    // 幅が狭いときはラベルを隠してアイコンのみ（Ask Assistant のように省スペース）。
    '@media (max-width:1180px){#zd-btn{padding:0 10px}#zd-btn .zd-label{display:none}}',
    // ナビバーに入れられない場合の保険：左下フローティング。
    '#zd-btn.zd-float{position:fixed;bottom:20px;left:20px;top:auto;right:auto;z-index:9998;border-radius:20px;padding:9px 14px;box-shadow:0 2px 8px rgba(91,76,255,.35)}',
    '#zd-btn:hover{background:#4A3DE0;transform:translateY(-1px)}',
    '#zd-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9999;align-items:center;justify-content:center;backdrop-filter:blur(2px)}',
    '#zd-overlay.open{display:flex}',
    '#zd-modal{background:#fff;border-radius:16px;padding:32px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.2);font-family:system-ui,sans-serif;position:relative;margin:16px}',
    '#zd-modal h2{margin:0 0 6px;font-size:20px;font-weight:700;color:#111}',
    '#zd-modal>p{margin:0 0 24px;font-size:14px;color:#666}',
    '#zd-close{position:absolute;top:16px;right:16px;background:none;border:none;cursor:pointer;color:#999;font-size:20px;line-height:1;padding:4px 8px;border-radius:6px}',
    '#zd-close:hover{background:#f5f5f5;color:#333}',
    '.zd-row{margin-bottom:16px}',
    '.zd-row label{display:block;font-size:13px;font-weight:600;color:#333;margin-bottom:6px}',
    '.zd-row input,.zd-row select,.zd-row textarea{width:100%;box-sizing:border-box;border:1.5px solid #e0e0e0;border-radius:8px;padding:10px 12px;font-size:14px;font-family:system-ui,sans-serif;color:#111;outline:none;transition:border .15s}',
    '.zd-row input:focus,.zd-row select:focus,.zd-row textarea:focus{border-color:#5B4CFF}',
    '.zd-row textarea{resize:vertical;min-height:100px}',
    '#zd-submit{width:100%;background:#5B4CFF;color:#fff;border:none;border-radius:10px;padding:13px;font-size:15px;font-weight:700;font-family:system-ui,sans-serif;cursor:pointer;margin-top:4px;transition:background .2s}',
    '#zd-submit:hover{background:#4A3DE0}',
    '#zd-submit:disabled{background:#bbb;cursor:not-allowed}',
    '#zd-sent{display:none;text-align:center;padding:16px 0}',
    '#zd-sent .zd-check{width:56px;height:56px;background:#ECEAFF;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px}',
    '#zd-sent h3{margin:0 0 8px;font-size:18px;color:#111}',
    '#zd-sent p{margin:0;color:#666;font-size:14px}',
    '#zd-error{display:none;background:#fff3f3;border:1px solid #ffcdd2;border-radius:8px;padding:10px 14px;margin-top:12px;font-size:13px;color:#c62828}',
  ].join('');
  document.head.appendChild(style);

  // 該当箇所の選択肢（Uninote の機能区分）
  var LOCATIONS = [
    ['ログイン・アカウント', 'account_login'],
    ['録画・ミーティング', 'recording_meeting'],
    ['カレンダー連携（Google / Microsoft）', 'calendar'],
    ['AI・フォーマット', 'ai_format'],
    ['Zoom 連携', 'zoom'],
    ['フォルダ・タグ管理', 'folder_tag'],
    ['プラン・請求', 'plan_billing'],
    ['その他', 'other'],
  ];

  var locationLabel = {};
  LOCATIONS.forEach(function (o) { locationLabel[o[1]] = o[0]; });

  var locationOptions = LOCATIONS.map(function (o) {
    return '<option value="' + o[1] + '">' + o[0] + '</option>';
  }).join('');

  var html = [
    '<button id="zd-btn" style="display:none" aria-label="お問い合わせ">',
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
      '<span class="zd-label">お問い合わせ</span>',
    '</button>',
    '<div id="zd-overlay">',
      '<div id="zd-modal">',
        '<button id="zd-close" aria-label="閉じる">&times;</button>',
        '<div id="zd-form-wrap">',
          '<h2>お問い合わせ</h2>',
          '<p>内容をお送りいただけると、サポートチームがご対応します。</p>',
          '<form id="zd-form" novalidate>',
            '<div class="zd-row"><label>お名前 <span style="color:#e53">※</span></label><input id="zd-name" type="text" placeholder="山田 太郎" required></div>',
            '<div class="zd-row"><label>メールアドレス <span style="color:#e53">※</span></label><input id="zd-email" type="email" placeholder="taro@example.com" required></div>',
            '<div class="zd-row"><label>テナント名（会社名） <span style="color:#e53">※</span></label><input id="zd-tenant" type="text" placeholder="株式会社○○" required></div>',
            '<div class="zd-row"><label>該当箇所 <span style="color:#e53">※</span></label>',
              '<select id="zd-location" required>',
                '<option value="">選択してください</option>',
                locationOptions,
              '</select>',
            '</div>',
            '<div class="zd-row"><label>件名 <span style="color:#e53">※</span></label><input id="zd-subject" type="text" placeholder="お問い合わせの件名" required></div>',
            '<div class="zd-row"><label>内容 <span style="color:#e53">※</span></label><textarea id="zd-body" placeholder="お問い合わせ内容をご記入ください" required></textarea></div>',
            '<div id="zd-error"></div>',
            '<button type="submit" id="zd-submit">送信する</button>',
          '</form>',
        '</div>',
        '<div id="zd-sent">',
          '<div class="zd-check"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5B4CFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>',
          '<h3>送信が完了しました！</h3>',
          '<p>内容を確認し、担当者からご連絡いたします。<br>しばらくお待ちください。</p>',
        '</div>',
      '</div>',
    '</div>'
  ].join('');

  function addUI() {
    if (document.getElementById('zd-btn')) return;
    if (!document.body) return;
    var div = document.createElement('div');
    div.innerHTML = html;
    while (div.firstChild) document.body.appendChild(div.firstChild);

    var overlay  = document.getElementById('zd-overlay');
    var formWrap = document.getElementById('zd-form-wrap');
    var sent     = document.getElementById('zd-sent');
    var form     = document.getElementById('zd-form');
    var errEl    = document.getElementById('zd-error');

    document.getElementById('zd-btn').addEventListener('click', function () {
      formWrap.style.display = '';
      sent.style.display = 'none';
      form.reset();
      errEl.style.display = 'none';
      overlay.classList.add('open');
    });
    document.getElementById('zd-close').addEventListener('click', function () { overlay.classList.remove('open'); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.classList.remove('open'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') overlay.classList.remove('open'); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name     = document.getElementById('zd-name').value.trim();
      var email    = document.getElementById('zd-email').value.trim();
      var tenant   = document.getElementById('zd-tenant').value.trim();
      var location = document.getElementById('zd-location').value;
      var subject  = document.getElementById('zd-subject').value.trim();
      var body     = document.getElementById('zd-body').value.trim();

      if (!name || !email || !tenant || !location || !subject || !body) {
        errEl.textContent = 'すべての必須項目を入力・選択してください。';
        errEl.style.display = 'block';
        return;
      }

      var submitBtn = document.getElementById('zd-submit');
      submitBtn.disabled = true;
      submitBtn.textContent = '送信中…';
      errEl.style.display = 'none';

      // 該当箇所フィールドは comdesk のアプリ画面が選択肢として登録されているため、
      // Uninote の値をそのまま送るとエラーになる。安全側として 'other' を送り、
      // 選んだ Uninote 区分は本文末尾に記載して情報を残す。
      // Uninote 専用の選択肢をフィールドに追加したら LOCATION_FIELD_VALUE を location に変更。
      var LOCATION_FIELD_VALUE = 'other';
      var composedBody = [
        body,
        '',
        '----',
        '該当箇所: ' + (locationLabel[location] || location),
      ].join('\n');

      // uninoteai.zendesk.com へ POST → ブランドは自動的に Uninote。
      // comdesk と同一フォーム(900000059466)・同一フィールドIDを利用（アカウント共通）。
      fetch('https://uninoteai.zendesk.com/api/v2/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request: {
            ticket_form_id: 900000059466,
            subject: subject,
            comment: { body: composedBody },
            requester: { name: name, email: email },
            custom_fields: [
              { id: 900011874466,   value: name },
              { id: 900012751123,   value: tenant },
              { id: 14843259561625, value: 'question' },
              { id: 14843373880729, value: 'add' },
              { id: 14843482847897, value: 'situation_check' },
              { id: 14843650824985, value: LOCATION_FIELD_VALUE }
            ]
          }
        })
      })
      .then(function (res) {
        if (!res.ok) return res.text().then(function (t) { throw new Error(t); });
        return res.json();
      })
      .then(function () {
        formWrap.style.display = 'none';
        sent.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = '送信する';
      })
      .catch(function (err) {
        console.error('Zendesk API error:', err.message);
        errEl.textContent = '送信に失敗しました。しばらくしてから再度お試しください。';
        errEl.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = '送信する';
      });
    });
  }


  // Delegate: any <a href="#contact"> opens the contact modal (replaces legacy Zendesk request form links)
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href$="#contact"]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href !== '#contact' && !/#contact$/.test(href)) return;
    e.preventDefault();
    var btn = document.getElementById('zd-btn');
    if (btn) btn.click();
  });

  if (document.body) addUI();
  setTimeout(addUI, 100);
  setTimeout(addUI, 600);
  setTimeout(addUI, 1500);

  // お問い合わせ を Ask Assistant の隣（ナビバー内）に配置する。フローティングではない。
  // チャットを開いてもナビバーに居続けるよう、React が外しても保持参照で貼り直す。
  var zdRef = null, settled = false, tries = 0;
  // 表示されている要素だけ返す（モバイルでは desktop 版が hidden、mobile 版が表示）。
  function vis(el) { return el && el.offsetParent !== null ? el : null; }
  function findAnchor() {
    return vis(document.getElementById('assistant-entry')) ||
           vis(document.getElementById('assistant-entry-mobile')) ||
           vis(document.querySelector('[data-component-name="theme-toggle"]')) ||
           vis(document.querySelector('[aria-label="Toggle dark mode"]'));
  }
  function ensureBtn() {
    if (!zdRef) zdRef = document.getElementById('zd-btn');
    if (!zdRef) return;
    var anchor = findAnchor(); // 見えている Ask Assistant（desktop/mobile）の隣に置く
    if (anchor && anchor.parentNode) {
      // 右隣に配置（検索ボックスは左隣に入るので奪い合わない）。
      if (anchor.nextElementSibling !== zdRef) {
        anchor.parentNode.insertBefore(zdRef, anchor.nextSibling);
      }
      zdRef.classList.remove('zd-float');
      zdRef.style.display = '';
      settled = true;
      return;
    }
    // 見える anchor が無い場合の保険：左下フローティングで表示（消えないように）。
    tries++;
    if (!settled && tries > 25) {
      if (!zdRef.isConnected) document.body.appendChild(zdRef);
      zdRef.classList.add('zd-float');
      zdRef.style.display = '';
    }
  }
  ensureBtn();
  if (window.MutationObserver && document.body) {
    new MutationObserver(ensureBtn).observe(document.body, { childList: true, subtree: true });
  }
  window.addEventListener('resize', ensureBtn); // ブレークポイント切替で anchor が変わるため
  setInterval(ensureBtn, 1500); // バックストップ
}());
