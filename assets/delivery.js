/* ==========================================================================
   Zugo Operator — Delivery role (delivery boy). Screens d-*, actions d.*
   one_place refs: apps/operator_app/lib/screens/delivery_queue_screen.dart,
   delivery_order_detail_screen.dart, widgets/delivery_status_helpers.dart
   Design: spec "Delivery Boy = Zero Thinking" — 56px big buttons (.btn.lg)
   instead of the 32px pills in the one_place build (design-system §3.7, §6.7).
   ========================================================================== */
(function () {
  'use strict';
  const Z = window.Z;
  const E = Z.esc;
  const TODAY = 'Today · Tue, 23 Sep 2026';
  const ticks = {};               // Zugo addition: local item-verify ticks, key "<orderId>:<lineIdx>"
  const notif = { neworder: true, assign: true, status: true, sound: true };

  Z.css('delivery', [
    '.d-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin:2px 0 12px}',
    '.d-head .t-heading{font-size:20px}',
    '.d-refresh{border:0;background:none;color:var(--brand-ink);font:inherit;font-size:12.5px;font-weight:600;cursor:pointer;padding:6px 4px}',
    '.d-chips{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;overflow:visible}',
    '.d-chips .chip{height:40px;justify-content:center;font-size:13px}',
    '.d-chips .chip.blue{font-weight:600}',
    '.d-card{background:var(--a-bg2);border-radius:var(--r-sm);padding:12px;cursor:pointer}',
    '.d-card + .d-card{margin-top:12px}',
    '.d-card .d-id{font-size:15px;font-weight:700;font-variant-numeric:tabular-nums}',
    '.d-card .d-tot{font-size:20px;font-weight:700;font-variant-numeric:tabular-nums}',
    '.d-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px 10px;font-size:12.5px;margin-top:10px}',
    '.d-grid .full{grid-column:1 / -1}',
    '.d-grid .clamp-2{line-height:1.45}',
    '.d-cod{color:var(--a-warning-ink);font-weight:600}',
    '.d-acts{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:12px}',
    '.d-acts .btn{height:56px;padding:0 6px;font-size:13px;flex-direction:column;gap:0;line-height:1.2}',
    '.d-acts .btn .em{font-size:18px}',
    '.d-off{border-radius:var(--r-md);padding:14px;background:#616161;color:#fff;display:flex;gap:12px;align-items:flex-start;margin-bottom:12px}',
    '.d-off .em{font-size:28px;line-height:1}',
    '.d-off b{display:block;font-size:15px}',
    '.d-off p{margin:2px 0 10px;font-size:12px;opacity:.92}',
    '.d-off .btn{background:#fff;color:#2e7d32;border-color:#fff}',
    '.d-sec{font-size:11.5px;font-weight:700;letter-spacing:.06em;color:var(--a-text2);text-transform:uppercase;display:flex;justify-content:space-between;align-items:center;margin:18px 0 8px}',
    '.d-sec .n{font-weight:500;letter-spacing:0;text-transform:none}',
    '.d-route .s-ic{font-size:17px}',
    '.d-route .s-k{font-size:10.5px;font-weight:700;letter-spacing:.06em;color:var(--a-text2)}',
    '.d-route .s-n{font-size:14.5px;font-weight:600;margin-top:1px}',
    '.d-route .s-a{font-size:12.5px;color:var(--a-text2);margin-top:2px}',
    '.d-route .stop-line{height:22px;margin:4px 0 4px 16px}',
    '.d-2btn{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}',
    '.d-2btn .btn{height:56px;font-size:14px}',
    '.d-note{background:#fff8e1;border:1px solid #ffd54f;border-radius:var(--r-sm);padding:10px 12px;font-size:13px;color:#5d4037;margin-top:12px}',
    '.d-grp{background:#fff3e0;color:#e65100;font-weight:700;font-size:12.5px;padding:8px 12px;display:flex;justify-content:space-between}',
    '.d-item{display:flex;gap:10px;align-items:center;padding:10px 12px;border-top:1px solid var(--a-divider);cursor:pointer}',
    '.d-item .grow{min-width:0}',
    '.d-item .n{font-size:13.5px;font-weight:600}',
    '.d-item .v{font-size:12px;color:var(--a-text2)}',
    '.d-item .lt{font-size:14px;font-weight:700;font-variant-numeric:tabular-nums}',
    '.d-item .check{width:26px;height:26px;border-radius:6px}',
    '.d-item .check.on{background:var(--a-success);border-color:var(--a-success)}',
    '.d-item.done .n{color:var(--a-text2)}',
    '.d-total{display:flex;justify-content:space-between;align-items:center;background:rgba(76,175,80,.12);color:#2e7d32;border-radius:var(--r-sm);padding:10px 12px;margin-top:8px}',
    '.d-total b{font-size:22px;font-variant-numeric:tabular-nums}',
    '.d-codbig{border:2px solid var(--a-warning);background:var(--a-warning-light);color:var(--a-warning-ink);border-radius:var(--r-md);padding:14px;display:flex;align-items:center;gap:12px;margin-top:12px}',
    '.d-codbig .em{font-size:32px}',
    '.d-codbig .v{font-size:24px;font-weight:800;line-height:1.1}',
    '.d-upd .cap{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}',
    '.d-upd .row .btn.lg{padding:0 12px}',
    '.d-upd .cancel{flex:0 0 104px}',
    '.d-srow{display:flex;align-items:center;gap:12px;padding:14px 4px;border-bottom:1px solid var(--a-divider);cursor:pointer;font-size:14.5px;font-weight:500;min-height:56px}',
    '.d-srow:last-child{border-bottom:0}',
    '.d-srow .dotc{width:14px;height:14px;border:0}',
    '.d-srow .ic{margin-left:auto;color:var(--a-hint)}',
    '.d-empty .em-i{background:none;font-size:48px;width:auto;height:auto;margin-bottom:4px}',
    '.d-ok{text-align:center}',
    '.d-ok .big{font-size:52px;line-height:1;margin-bottom:8px}',
    '.d-ok .amt{font-size:26px;font-weight:800;color:#2e7d32;margin:4px 0 2px}',
    '.d-hrow{display:flex;align-items:center;gap:10px;padding:11px 12px;border-bottom:1px solid var(--a-divider);font-size:13px}',
    '.d-hrow:last-child{border-bottom:0}',
    '.d-hrow .grow{min-width:0}',
    '.d-hrow .m{font-size:11.5px;color:var(--a-text2)}',
    '.d-hrow .a{font-weight:700;font-variant-numeric:tabular-nums}',
    '.d-hand{border:1.5px dashed var(--a-warning);background:var(--a-warning-light);color:var(--a-warning-ink);border-radius:var(--r-sm);padding:12px;display:flex;gap:10px;align-items:center;font-size:13px;margin-top:12px}',
    '.d-hand b{font-size:15px}',
    '.d-prof{display:flex;align-items:center;gap:12px;margin-bottom:12px}',
    '.d-kv{display:grid;grid-template-columns:auto 1fr;gap:10px 16px;font-size:13px}',
    '.d-kv dt{color:var(--a-text2)}',
    '.d-kv dd{margin:0;text-align:right;font-weight:500}',
    '.d-login .inp{height:48px}',
    '.d-demo{margin-top:16px}',
    /* styles.css: `.phone button{color:inherit}` outranks `.btn`, so primary buttons lose white text — re-assert for delivery screens + overlays */
    '.scr[data-screen^="d-"] .btn, .d-ok .btn, .sheet .btn{color:var(--on-brand)}',
    '.scr[data-screen^="d-"] .btn.outline, .scr[data-screen^="d-"] .btn.ghost, .scr[data-screen^="d-"] .btn.soft, .sheet .btn.outline{color:var(--brand-ink)}',
    '.scr[data-screen^="d-"] .btn.danger-outline{color:var(--a-error-ink)}',
    '.scr[data-screen^="d-"] .btn.neutral{color:var(--a-text)}',
    '.scr[data-screen^="d-"] .d-off .btn.outline{color:#2e7d32}',
    '.scr[data-screen="d-order"] .ab-titles{min-width:0;flex:1}',
    '.scr[data-screen="d-order"] .ab-sub{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.d-hrow .m{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.nowrap{white-space:nowrap}'
  ].join('\n'));

  /* ---------------- helpers ---------------- */
  function me() { return Z.staff(Z.S.me); }
  function isToday(o) { return !o.date || o.date.indexOf('Today') === 0; }
  function mine() { return Z.S.orders.filter(function (o) { return o.rider === Z.S.me && isToday(o); }); }
  function lists() {
    const m = mine();
    return {
      live: Z.deliveryQueue(),
      delivered: m.filter(function (o) { return o.status === 'delivered'; }),
      cancelled: m.filter(function (o) { return o.status === 'cancelled'; }),
      pool: Z.pool()
    };
  }
  function total(o) { return Z.orderTotals(o).total; }
  function products(o) { const n = o.items.length; return n + (n === 1 ? ' product' : ' products'); }
  function who(o) { return o.recipient || o.customer; }
  function methodShort(o) {
    const m = o.method || '';
    if (/GPS/.test(m)) return '📡 Current location (GPS)';
    if (/Pinned/.test(m)) return '📌 Pinned on map';
    if (/Google Maps/.test(m)) return '🔗 Google Maps link';
    return '🏠 ' + m;
  }
  function stLabel(st) { return (Z.STATUS[st] || { label: st }).label; }
  function mapsToast(lat, lng) {
    return 'Opens Google Maps: google.com/maps/dir/?api=1&amp;destination=' + lat + ',' + lng;
  }
  function empty(em, t, d, btn) {
    return '<div class="empty d-empty"><div class="em-i">' + em + '</div><div class="em-t">' + t + '</div>' +
      (d ? '<div class="em-d">' + d + '</div>' : '') + (btn || '') + '</div>';
  }

  /* ---------------- login ---------------- */
  Z.screen('delivery', {
    id: 'd-login', group: 'Access', title: 'Operator Login', route: '/login', sb: 'light', needsLogin: false,
    render: function () {
      const s = me();
      return '<div class="scroll d-login"><div class="auth-hero" style="padding:36px 8px 8px">' +
        '<img class="auth-logo-img" src="' + Z.IMG + 'zugo-icon.jpg" alt="Zugo">' +
        '<div class="t-heading" style="color:var(--brand-ink);font-size:24px">Operator Login</div>' +
        '<div class="t-cap" style="font-size:13px">Sign in to manage operations</div></div>' +
        '<div class="pad" style="padding:16px 8px">' +
        '<div class="field"><label class="lbl" for="d-em">Email</label><input id="d-em" class="inp" type="email" value="' + E(s.email) + '" placeholder="Email"></div>' +
        '<div class="field"><label class="lbl" for="d-pw">Password</label><input id="d-pw" class="inp" type="password" value="zugo1234" placeholder="Password"></div>' +
        '<button class="btn block lg" style="margin-top:20px" data-act="d.login">Login</button>' +
        '<div class="note info d-demo">' + Z.icon('info') + '<div><b>Demo:</b> same login screen as Admin. After sign-in the router reads <code>profiles.role</code>: <b>delivery_boy</b> → <code>/delivery</code> (My Deliveries), <b>admin</b> → <code>/admin-orders</code>. Customers are refused (“use the Zugo app”).</div></div>' +
        '</div></div>';
    },
    notes: {
      purpose: 'Single login for the Zugo Operator app. Role decides the landing screen; this view shows the delivery-boy path.',
      points: [
        'Heading “Operator Login”, subtitle “Sign in to manage operations”, fields Email / Password, full-width “Login”.',
        'Validation: “Email and password are required”.',
        'router.dart: logged in on /login → role == delivery_boy ? /delivery : /admin-orders. A delivery boy on any admin-only path is bounced to /delivery.',
        'Startup: checkSession → notification permission gate → upsert_device_token → load app_config → operator version gate.',
        'Zugo addition: 56px Login button (delivery-boy touch target).'
      ],
      data: ['supabase.auth.signInWithPassword', 'profiles.role (customer | admin | delivery_boy)', 'rpc upsert_device_token', 'app_config (operator_min_version)'],
      next: ['d-queue'],
      ref: 'apps/operator_app/lib/screens/login_screen.dart, router.dart'
    }
  });
  Z.on('d.login', function () {
    const em = document.getElementById('d-em'), pw = document.getElementById('d-pw');
    if (!em || !pw || !em.value.trim() || !pw.value) { Z.toast('Email and password are required'); return; }
    Z.S.loggedIn.delivery = true;
    Z.go('d-queue', {}, { root: true });
  });

  /* ---------------- queue ---------------- */
  function ownedCard(o) {
    const live = Z.ACTIVE.indexOf(o.status) >= 0;
    const s = Z.shop(o.shop);
    return '<div class="d-card" data-go="d-order" data-p=\'' + Z.json({ id: o.id }) + '\'>' +
      '<div class="row between top"><div><div class="d-id">#' + o.id + '</div><div class="t-cap">' + E(o.placedAgo || o.date || '') + '</div></div>' +
      '<div class="row" style="gap:10px">' + (live ? '<span data-act="d.status" data-id="' + o.id + '">' + Z.badge(o.status, true) + '</span>' : Z.badge(o.status)) +
      '<span class="d-tot">' + Z.money(total(o)) + '</span></div></div>' +
      '<div class="d-grid">' +
      '<div>👤 ' + E(who(o)) + '</div><div class="d-cod"' + (o.status === 'delivered' ? ' style="color:var(--a-success-ink)"' : '') + '>💵 COD · ' + (o.status === 'delivered' ? 'collected' : (o.status === 'cancelled' ? 'not collected' : 'pending')) + '</div>' +
      '<div>📦 ' + products(o) + '</div><div>📏 ' + o.km + ' km</div>' +
      '<div class="full">🏪 <b>' + E(s.name) + '</b> <span class="t-muted">· ' + E(s.address) + '</span></div>' +
      '<div class="full clamp-2">📍 ' + E(o.addr) + '</div>' +
      (o.notes ? '<div class="full t-muted">📝 ' + E(o.notes) + '</div>' : '') +
      (o.status === 'cancelled' && o.cancelReason ? '<div class="full t-err">✕ ' + E(o.cancelReason) + '</div>' : '') +
      '</div>' +
      (live ? '<div class="d-acts">' +
        '<button class="btn outline" data-act="d.call" data-ph="' + E(o.cphone) + '"><span class="em">📞</span>Call</button>' +
        '<button class="btn outline" data-act="d.nav" data-lat="' + o.lat + '" data-lng="' + o.lng + '"><span class="em">🗺️</span>Navigate</button>' +
        '<button class="btn outline" data-act="d.status" data-id="' + o.id + '"><span class="em">🔄</span>Status</button></div>' : '') +
      '</div>';
  }
  function poolCard(o) {
    const s = Z.shop(o.shop);
    return '<div class="d-card" data-go="d-order" data-p=\'' + Z.json({ id: o.id }) + '\'>' +
      '<div class="row between top"><div><div class="d-id">#' + o.id + '</div><div class="t-cap">' + E(o.placedAgo || '') + '</div></div>' +
      '<div class="row" style="gap:10px">' + Z.badge(o.status) + '<span class="d-tot">' + Z.money(total(o)) + '</span></div></div>' +
      '<div class="d-grid">' +
      '<div>👤 ' + E(who(o)) + '</div><div class="d-cod">💵 COD · pending</div>' +
      '<div>📦 ' + products(o) + '</div><div>📏 ' + o.km + ' km</div>' +
      '<div class="full">🏪 <b>' + E(s.name) + '</b> <span class="t-muted">· ' + E(s.address) + '</span></div>' +
      '<div class="full clamp-2">📍 ' + E(o.addr) + '</div></div>' +
      '<button class="btn block lg" style="margin-top:12px" data-act="d.claim" data-id="' + o.id + '" data-from="queue">Assign to me</button></div>';
  }

  Z.screen('delivery', {
    id: 'd-queue', group: 'Deliveries', title: 'My Deliveries', route: '/delivery', sb: 'light',
    render: function (p) {
      if (p.tab) { Z.S.dqTab = p.tab; delete p.tab; }
      const L = lists();
      const tab = Z.S.dqTab in L ? Z.S.dqTab : 'live';
      const chip = function (k, label) {
        return '<button class="chip' + (tab === k ? ' blue' : '') + '" data-act="d.tab" data-tab="' + k + '">' + label + ' (' + L[k].length + ')</button>';
      };
      const anyToday = L.live.length + L.delivered.length + L.cancelled.length;
      let body = '';
      const rows = L[tab];
      if (!Z.S.dutyOnline && !(tab === 'live' && !rows.length)) {
        body += '<div class="d-off"><span class="em">😴</span><div><b>You\'re offline</b><p>Admin can\'t assign you new orders. Toggle online to start receiving deliveries.</p>' +
          '<button class="btn sm outline" data-act="toggleDuty">Go online</button></div></div>';
      }
      if (rows.length) {
        body += rows.map(tab === 'pool' ? poolCard : ownedCard).join('');
      } else if (tab === 'live') {
        if (!Z.S.dutyOnline) body += empty('😴', 'You\'re offline', 'Admin can\'t assign you new orders. Toggle online to start receiving deliveries.', '<button class="btn lg" style="padding:0 28px" data-act="toggleDuty">Go online</button>');
        else if (!anyToday) body += empty('🛵', 'No deliveries today yet', 'New assignments will appear here automatically.');
        else body += empty('✅', 'Nothing live right now', L.pool.length ? L.pool.length + ' unassigned order' + (L.pool.length > 1 ? 's' : '') + ' waiting in the Unassigned tab.' : '');
      } else if (tab === 'delivered') body += empty('📦', 'No deliveries completed yet', '');
      else if (tab === 'cancelled') body += empty('🎯', 'Zero cancellations today', 'Clean record — keep it up.');
      else body += empty('🎯', 'No unassigned orders', 'All of today\'s orders have a delivery partner. New orders will appear here in real time.');
      return Z.opBar('delivery') +
        '<div class="scroll">' +
        '<div class="d-head"><div><div class="t-heading">My Deliveries</div><div class="t-cap">' + TODAY + '</div></div>' +
        '<button class="d-refresh" data-act="d.refresh">↻ Refresh</button></div>' +
        '<div class="chips d-chips">' + chip('live', 'Live') + chip('delivered', 'Delivered') + chip('cancelled', 'Cancelled') + chip('pool', 'Unassigned') + '</div>' +
        body + '</div>' + Z.bottomNav('delivery', 'd-queue');
    },
    notes: {
      purpose: 'Delivery boy home: today\'s own orders split by chips, plus the Unassigned pool the boy can self-claim.',
      points: [
        'Header “My Deliveries” + “Today · Tue, 23 Sep 2026” + “↻ Refresh”. Chips “Live (n) / Delivered (n) / Cancelled (n) / Unassigned (n)”.',
        'Owned card: #id, relative time, tappable status pill ▾ (opens “Update status” sheet with only the legal one-step moves), ₹total; 👤 name | 💵 COD · pending; 📦 N products | 📏 km; 📍 address (2 lines); 📝 note; action row 📞 Call · 🗺️ Navigate · 🔄 Status.',
        'Zugo addition: 🏪 pickup restaurant line on every card (food-only, one restaurant per order).',
        'Zugo addition: action row and “Assign to me” are 56px (spec “Zero Thinking” big buttons) instead of the 32px pills in the one_place build.',
        'Pool card (Unassigned): full-width “Assign to me” → assign_delivery_to_self; toast “Assigned — check the Live tab”. First boy wins (row lock); others get “Order already assigned”.',
        'Offline (top-bar toggle off): banner 😴 “You\'re offline — Admin can\'t assign you new orders…”. The boy still sees his live orders.',
        'Empty states are one_place copy: 🛵 No deliveries today yet · ✅ Nothing live right now · 📦 No deliveries completed yet · 🎯 Zero cancellations today · 🎯 No unassigned orders.',
        'Live updates: Supabase Realtime on orders (500 ms debounce) + 10 s poll. Zugo addition: FCM push “🛵 New delivery assigned” to the assigned boy.',
        'Grouping by delivery slot is dropped (Zugo has no slots).'
      ],
      data: ['rpc get_delivery_boy_queue() — today, all statuses, assigned to me', 'rpc get_unassigned_orders_for_delivery_boy() — today, placed, no boy', 'rpc assign_delivery_to_self(p_order_id)', 'rpc update_order_status(p_order_id, p_status, p_reason)', 'rpc set_delivery_boy_online(p_is_online)', 'realtime: orders'],
      next: ['d-order', 'd-history', 'd-profile'],
      ref: 'apps/operator_app/lib/screens/delivery_queue_screen.dart; widgets/delivery_status_helpers.dart'
    }
  });
  Z.on('d.tab', function (el) { Z.S.dqTab = el.getAttribute('data-tab'); Z.refresh(); });
  Z.on('d.refresh', function () { Z.refresh(); Z.toast('Queue refreshed'); });
  Z.on('d.call', function (el) {
    const ph = el.getAttribute('data-ph');
    Z.toast(ph ? 'Calling ' + E(ph) + '…' : 'No phone number on this order');
  });
  Z.on('d.nav', function (el) {
    const lat = el.getAttribute('data-lat'), lng = el.getAttribute('data-lng');
    Z.toast(lat && lng ? mapsToast(lat, lng) : 'No location on this order');
  });
  Z.on('d.claim', function (el) {
    const id = el.getAttribute('data-id');
    const o = Z.order(id);
    if (!o || o.status !== 'placed' || o.rider) { Z.toast('Order already assigned'); Z.refresh(); return; }
    Z.assign(id, Z.S.me, 'self');
    Z.refresh();
    Z.toast(el.getAttribute('data-from') === 'queue' ? 'Assigned — check the Live tab' : 'Assigned — managing this delivery now');
  });

  /* ---------------- status + cancel sheets ---------------- */
  function statusSheet(id) {
    const o = Z.order(id);
    if (!o) return;
    const nx = Z.nextForBoy(o.status);
    Z.sheet('Update status',
      '<div class="t-cap" style="margin-bottom:4px">#' + o.id + ' · Currently: <b>' + stLabel(o.status) + '</b></div>' +
      nx.map(function (st) {
        return '<div class="d-srow" data-act="d.set" data-id="' + id + '" data-st="' + st + '"><span class="dotc" style="background:' + Z.STATUS[st].dot + '"></span>' +
          (st === 'cancelled' ? '<span class="t-err">Cancelled</span>' : stLabel(st)) + Z.icon('chev') + '</div>';
      }).join('') +
      '<div class="hint" style="margin-top:8px">Delivery partners move one step at a time. Admin can skip steps.</div>');
  }
  function cancelSheet(id) {
    Z.sheet('Cancel order',
      '<div class="t-cap" style="margin-bottom:10px">Tell the customer why — this lands in the order timeline.</div>' +
      '<div class="field"><label class="lbl" for="d-reason">Reason</label>' +
      '<textarea id="d-reason" class="inp" style="height:88px;padding:10px 12px;resize:none" placeholder="e.g. Shop closed, item out of stock"></textarea></div>',
      '<div class="btn-row"><button class="btn outline lg" data-act="closeOv">Back</button><button class="btn lg danger" data-act="d.cancelGo" data-id="' + id + '">Cancel order</button></div>');
  }
  function apply(id, st, reason) {
    const o = Z.order(id);
    if (!o) return;
    if (o.rider !== Z.S.me) { Z.closeOv(); Z.toast('Order is not assigned to you'); return; }
    if (Z.nextForBoy(o.status).indexOf(st) < 0) { Z.closeOv(); Z.toast('Invalid status transition'); return; }
    Z.setStatus(id, st, reason || '', 'delivery');
    const onDetail = Z.cur.delivery.id === 'd-order';
    if (st === 'delivered') {
      Z.refresh();
      Z.dialog('<div class="d-ok"><div class="big">✅</div><div class="dialog-t">Delivered · #' + id + '</div>' +
        '<div class="t-cap">Collected cash</div><div class="amt">' + Z.money(total(o)) + '</div>' +
        '<div class="dialog-d">Keep this cash safe and hand it over to admin at the end of your shift.</div>' +
        '<button class="btn block lg success" data-go="d-queue" data-root>Back to deliveries</button></div>');
      return;
    }
    if (st === 'cancelled') {
      Z.closeOv();
      if (onDetail) Z.go('d-queue', {}, { root: true }); else Z.refresh();
      Z.toast('Order #' + id + ' cancelled');
      return;
    }
    Z.closeOv();
    Z.refresh();
    Z.toast(onDetail ? 'Status updated to ' + stLabel(st) : 'Status → ' + stLabel(st));
  }
  Z.on('d.status', function (el) {
    const id = el.getAttribute('data-id') || (Z.deliveryQueue()[0] || {}).id || 'ZG1056';
    statusSheet(id);
  });
  Z.on('d.set', function (el) {
    const id = el.getAttribute('data-id'), st = el.getAttribute('data-st');
    if (st === 'cancelled') cancelSheet(id); else apply(id, st);
  });
  Z.on('d.next', function (el) { apply(el.getAttribute('data-id'), el.getAttribute('data-st')); });
  Z.on('d.cancel', function (el) {
    const id = el.getAttribute('data-id') || (Z.deliveryQueue()[0] || {}).id || 'ZG1056';
    cancelSheet(id);
  });
  Z.on('d.cancelGo', function (el) {
    const r = document.getElementById('d-reason');
    const reason = r ? r.value.trim() : '';
    if (!reason) { Z.toast('Please enter a reason'); return; }
    apply(el.getAttribute('data-id'), 'cancelled', reason);
  });

  /* ---------------- order detail ---------------- */
  function routeCard(o) {
    const s = Z.shop(o.shop);
    return '<div class="card flat d-route">' +
      '<div class="stop"><div class="s-ic pick">🏪</div><div class="grow">' +
      '<div class="s-k">STOP 1 · PICKUP</div><div class="s-n">' + E(s.name) + '</div>' +
      '<div class="s-a">' + E(s.address) + ' · ' + E(s.phone) + '</div></div></div>' +
      '<div class="d-2btn"><button class="btn outline" data-act="d.call" data-ph="' + E(s.phone) + '">📞 Call shop</button>' +
      '<button class="btn outline" data-act="d.nav" data-lat="' + s.lat + '" data-lng="' + s.lng + '">🗺️ Navigate</button></div>' +
      '<div class="stop-line"></div>' +
      '<div class="stop"><div class="s-ic drop">📍</div><div class="grow">' +
      '<div class="s-k">STOP 2 · DROP · ' + o.km + ' km</div><div class="s-n">' + E(who(o)) + '</div>' +
      '<div class="s-a">' + E(o.addr) + '</div>' +
      '<div class="s-a">' + methodShort(o) + ' · <span class="nowrap">' + E(o.cphone) + '</span></div></div></div>' +
      '<div class="d-2btn"><button class="btn outline" data-act="d.call" data-ph="' + E(o.cphone) + '">📞 Call</button>' +
      '<button class="btn" data-act="d.nav" data-lat="' + o.lat + '" data-lng="' + o.lng + '">🗺️ Navigate</button></div>' +
      '</div>';
  }
  function itemsBlock(o, canTick) {
    const s = Z.shop(o.shop);
    let done = 0;
    const rows = o.items.map(function (l, i) {
      const it = Z.item(l.itemId);
      const on = !!ticks[o.id + ':' + i];
      if (on) done++;
      const vn = Z.varName(it, l.varId);
      const qtyTxt = vn ? E(vn) + ' × ' + l.qty : l.qty + ' × ' + Z.money(l.unit);
      return '<div class="d-item' + (on ? ' done' : '') + '"' + (canTick ? ' data-act="d.tick" data-k="' + o.id + ':' + i + '"' : '') + '>' +
        Z.img(it.e, (s.tint || 'warm') + ' s48') +
        '<div class="grow"><div class="n row" style="gap:6px">' + Z.veg(it.veg) + E(it.name) + '</div>' +
        '<div class="v">' + qtyTxt + (vn ? ' · ' + Z.money(l.unit) + ' each' : '') + '</div></div>' +
        '<div class="lt">' + Z.money(l.unit * l.qty) + '</div>' +
        (canTick ? '<span class="check' + (on ? ' on' : '') + '" aria-label="Verified"></span>' : '') + '</div>';
    }).join('');
    return '<div class="d-sec"><span>Items to pick up</span><span class="n">' + products(o) + (canTick ? ' · ' + done + '/' + o.items.length + ' checked' : '') + '</span></div>' +
      '<div class="list"><div class="d-grp"><span>🍱 ' + E(s.name) + ' (' + o.items.length + ')</span></div>' + rows + '</div>' +
      (canTick ? '<div class="hint" style="margin-top:6px">Tick each item at the counter before you leave the restaurant.</div>' : '');
  }
  function billBlock(o) {
    const t = Z.orderTotals(o);
    return '<div class="d-sec"><span>Bill</span></div><div class="bill">' +
      '<div class="bill-r"><span class="k">Subtotal</span><span>' + Z.money(t.sub) + '</span></div>' +
      '<div class="bill-r"><span class="k">Delivery fee · ' + o.km + ' km</span><span>' + Z.money(t.fee) + '</span></div>' +
      '<div class="d-total"><span class="b">Total</span><b>' + Z.money(t.total) + '</b></div>' +
      '<div class="t-cap" style="margin-top:8px">💵 Cash on Delivery · ' + (o.status === 'delivered' ? 'collected' : 'pending') + '</div></div>';
  }

  Z.screen('delivery', {
    id: 'd-order', group: 'Deliveries', title: 'Delivery order', route: '/delivery/order/:orderId', sb: 'light',
    defaults: function () { const q = Z.deliveryQueue(); return { id: q.length ? q[0].id : 'ZG1056' }; },
    render: function (p) {
      const id = p.id || (Z.deliveryQueue()[0] || {}).id || 'ZG1056';
      const o = Z.order(id);
      const owned = o && o.rider === Z.S.me;
      const isPool = o && !o.rider && o.status === 'placed';
      if (!o || (!owned && !isPool)) {
        return Z.appBar({ back: true, title: '#' + E(id) }) +
          '<div class="scroll">' + empty('🤔', 'Order not in your queue', 'It may have been reassigned or completed. Refresh the queue to check.',
            '<button class="btn lg" style="padding:0 28px" data-go="d-queue" data-root>Refresh queue</button>') + '</div>';
      }
      const live = owned && Z.ACTIVE.indexOf(o.status) >= 0;
      const pill = live ? '<span data-act="d.status" data-id="' + o.id + '">' + Z.badge(o.status, true) + '</span>' : Z.badge(o.status);
      let body = routeCard(o);
      if (o.notes) body += '<div class="d-note">📝 ' + E(o.notes) + '</div>';
      if (o.status === 'delivering' && owned) {
        body += '<div class="d-codbig"><span class="em">💵</span><div class="grow"><div class="t-cap" style="color:inherit">Cash on Delivery</div>' +
          '<div class="v">Collect ' + Z.money(total(o)) + ' cash</div><div style="font-size:12px">from ' + E(who(o)) + ' before marking Delivered</div></div></div>';
      }
      body += itemsBlock(o, live && (o.status === 'assigned' || o.status === 'checking'));
      body += billBlock(o);
      if (o.status === 'delivered') {
        body += '<div class="note ok" style="margin-top:12px">' + Z.icon('ok') + '<div><b>Delivered</b> · ' + Z.money(total(o)) + ' cash collected. Hand it over to admin at end of shift.</div></div>';
      } else if (o.status === 'cancelled') {
        body += '<div class="note err" style="margin-top:12px">' + Z.icon('cancel') + '<div><b>Cancelled</b>' + (o.cancelReason ? ' · ' + E(o.cancelReason) : '') + '</div></div>';
      }
      let foot = '';
      if (isPool) {
        foot = '<div class="sticky d-upd"><div class="d-sec" style="margin:0 0 4px">Claim this order</div>' +
          '<div class="t-cap" style="margin-bottom:8px">Once you assign, this delivery moves into your live queue.</div>' +
          '<button class="btn block lg" data-act="d.claim" data-id="' + o.id + '">Assign to me</button></div>';
      } else if (live) {
        const nx = Z.nextForBoy(o.status).filter(function (s) { return s !== 'cancelled'; })[0];
        const cls = nx === 'delivered' ? ' success' : '';
        foot = '<div class="sticky d-upd"><div class="cap"><span class="d-sec" style="margin:0">Update status</span>' +
          '<span class="t-cap">Currently: <b>' + stLabel(o.status) + '</b></span></div>' +
          '<div class="row"><button class="btn lg grow' + cls + '" data-act="d.next" data-id="' + o.id + '" data-st="' + nx + '">➡️ Mark ' + stLabel(nx) + '</button>' +
          '<button class="btn lg danger-outline cancel" data-act="d.cancel" data-id="' + o.id + '">✕ Cancel</button></div></div>';
      }
      return Z.appBar({ back: true, title: '#' + o.id, sub: E(Z.shop(o.shop).name) + ' · ' + E(o.placedAgo || o.date || ''), actions: '<div style="padding-right:12px">' + pill + '</div>' }) +
        '<div class="scroll">' + body + '</div>' + foot;
    },
    notes: {
      purpose: 'Everything the boy needs for one delivery: where to pick up, where to drop, what to check, how much cash to collect, and one big button for the next step.',
      points: [
        'App bar “#id” + status pill (tap ▾ opens “Update status”).',
        'Zugo addition: “Route” card — STOP 1 🏪 PICKUP (restaurant name, address, phone, 📞 Call shop, 🗺️ Navigate) → dashed line → STOP 2 📍 DROP (customer, address, how the location was given: GPS / map pin / Google Maps link, km, 📞 Call, 🗺️ Navigate).',
        'Navigate opens https://www.google.com/maps/dir/?api=1&destination=<lat>,<lng>&travelmode=driving externally (mockup shows a toast).',
        'Yellow note box “📝 <customer note>”. “ITEMS TO PICK UP” grouped under the restaurant header “🍱 <Restaurant> (N)”, each row thumb, name, size, “Half × 2” or “2 × ₹149”, line total.',
        'Zugo addition: tick boxes to verify each item at the counter (local only, not saved) while Assigned / Preparing.',
        'BILL: Subtotal, Delivery fee, Total in a green pill (read when collecting COD), “💵 Cash on Delivery · pending”.',
        'Zugo addition: big amber “Collect ₹X cash” card while Out for delivery (one_place has no explicit collect step; delivered = collected).',
        'UPDATE STATUS: “Currently: {label}”, full-width 56px “➡️ Mark {next}” + “✕ Cancel” (cancel sheet: “Cancel order”, hint “e.g. Shop closed, item out of stock”, [Back] [Cancel order]). One step at a time: Assigned → Preparing → Out for delivery → Delivered.',
        'After Delivered: success dialog “Delivered · Collected ₹X cash” → back to My Deliveries. After Cancelled: back to the queue.',
        'Pool order (placed, no boy): “CLAIM THIS ORDER” card with “Assign to me”.',
        'Not in queue (reassigned by admin / someone else claimed it): 🤔 “Order not in your queue” + “Refresh queue”.'
      ],
      data: ['orders (+ order_items, restaurants)', 'rpc update_order_status(p_order_id, p_status, p_reason) — boy: one step, must be assigned boy ("Order is not assigned to you")', 'rpc assign_delivery_to_self(p_order_id)', 'order_status_history (reason lands in customer timeline)'],
      next: ['d-queue'],
      ref: 'apps/operator_app/lib/screens/delivery_order_detail_screen.dart'
    }
  });
  Z.on('d.tick', function (el) {
    const k = el.getAttribute('data-k');
    ticks[k] = !ticks[k];
    Z.refresh();
  });

  /* ---------------- history (Zugo addition) ---------------- */
  // earlier today, already synced (display only). Sum 1,500 + ZG1054 340 = staff.cod 1,840; 8 + 1 = staff.today 9
  const EARLIER = [
    { id: 'ZG1053', shop: 's3', t: '6:20 PM', a: 184, km: 1.4 }, { id: 'ZG1052', shop: 's1', t: '5:42 PM', a: 176, km: 2.2 },
    { id: 'ZG1051', shop: 's2', t: '4:55 PM', a: 260, km: 2.8 }, { id: 'ZG1050', shop: 's3', t: '3:30 PM', a: 99, km: 0.9 },
    { id: 'ZG1048', shop: 's1', t: '2:12 PM', a: 238, km: 1.7 }, { id: 'ZG1047', shop: 's2', t: '1:26 PM', a: 149, km: 2.4 },
    { id: 'ZG1045', shop: 's1', t: '12:48 PM', a: 214, km: 1.9 }, { id: 'ZG1044', shop: 's3', t: '11:40 AM', a: 180, km: 1.1 }
  ];
  const WEEK = [
    { d: 'Mon, 22 Sep', n: 11, a: 2310, km: 21.4 }, { d: 'Sun, 21 Sep', n: 14, a: 3180, km: 27.9 }
  ];
  Z.screen('delivery', {
    id: 'd-history', group: 'Deliveries', title: 'History & COD', route: '/delivery/history', sb: 'light',
    render: function () {
      const done = mine().filter(function (o) { return o.status === 'delivered'; });
      const cod = done.reduce(function (a, o) { return a + total(o); }, 0) + EARLIER.reduce(function (a, x) { return a + x.a; }, 0);
      const km = done.reduce(function (a, o) { return a + o.km; }, 0) + EARLIER.reduce(function (a, x) { return a + x.km; }, 0);
      const n = done.length + EARLIER.length;
      const tile = function (em, l, v) { return '<div class="kpi"><div class="k-l">' + em + ' ' + l + '</div><div class="k-v">' + v + '</div></div>'; };
      const rows = done.map(function (o) {
        return '<div class="d-hrow" data-go="d-order" data-p=\'' + Z.json({ id: o.id }) + '\' style="cursor:pointer">' + Z.img(Z.shop(o.shop).e, Z.shop(o.shop).tint + ' s40') +
          '<div class="grow"><div class="b">#' + o.id + ' · ' + E(who(o)) + '</div><div class="m">' + E(Z.shop(o.shop).name) + ' · ' + o.km + ' km · ' + E((o.history[o.history.length - 1] || [])[1] || '') + '</div></div>' +
          '<div class="a">' + Z.money(total(o)) + '</div></div>';
      }).join('') + EARLIER.map(function (x) {
        const s = Z.shop(x.shop);
        return '<div class="d-hrow">' + Z.img(s.e, s.tint + ' s40') + '<div class="grow"><div class="b">#' + x.id + '</div><div class="m">' + E(s.name) + ' · ' + x.km + ' km · ' + x.t + '</div></div><div class="a">' + Z.money(x.a) + '</div></div>';
      }).join('');
      const week = WEEK.map(function (w) {
        return '<div class="d-hrow"><div class="grow"><div class="b">' + w.d + '</div><div class="m">' + w.n + ' deliveries · ' + w.km + ' km</div></div><div class="a">' + Z.money(w.a) + '</div></div>';
      }).join('');
      return Z.opBar('delivery') +
        '<div class="scroll">' +
        '<div class="d-head"><div><div class="t-heading">History</div><div class="t-cap">' + TODAY + '</div></div></div>' +
        '<div class="kpis">' + tile('🛵', 'Deliveries', n) + tile('💵', 'COD collected', Z.money(cod)) + tile('📏', 'Distance', (Math.round(km * 10) / 10) + ' km') + tile('⏱️', 'Avg time', '19 min') + '</div>' +
        '<div class="d-hand"><span style="font-size:24px">🤝</span><div>Hand over <b>' + Z.money(cod) + '</b> cash to admin at end of shift.<div class="t-cap" style="color:inherit">COD is counted as collected when an order is marked Delivered.</div></div></div>' +
        '<div class="d-sec"><span>Delivered today</span><span class="n">' + n + '</span></div><div class="list">' + rows + '</div>' +
        '<div class="d-sec"><span>Earlier this week</span></div><div class="list">' + week + '</div>' +
        '</div>' + Z.bottomNav('delivery', 'd-history');
    },
    notes: {
      purpose: 'Zugo addition: the boy\'s own day at a glance — deliveries, cash in hand, distance — so COD handover to admin at shift end is clear.',
      points: [
        'Zugo addition: one_place has no history or COD screen for boys (COD is implicit: delivered = collected, no reconciliation).',
        'Tiles: Deliveries, COD collected ₹, Distance km, Avg time (assigned → delivered).',
        'Handover note “Hand over ₹X cash to admin at end of shift”. Admin sees the same figure per boy in Staff / Reports.',
        'Lists delivered orders today (tap opens the order) and daily totals earlier this week.',
        'Replaces one_place\'s meat-only “🥩 Upcoming” tab in the bottom nav.'
      ],
      data: ['rpc get_delivery_boy_history(p_from, p_to) — new: delivered orders for auth.uid() with total, distance_km, assigned_at, delivered_at', 'order_status_history (assigned / delivered timestamps for avg time)'],
      next: ['d-order', 'd-queue', 'd-profile'],
      ref: 'none in one_place (Zugo addition); closest: admin get_admin_order_stats "COD collected"'
    }
  });

  /* ---------------- profile ---------------- */
  Z.screen('delivery', {
    id: 'd-profile', group: 'Account', title: 'Profile', route: '/profile', sb: 'light',
    render: function () {
      const s = me();
      const ini = s.name.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2);
      return Z.opBar('delivery') +
        '<div class="scroll">' +
        '<div class="t-heading" style="font-size:20px;margin:2px 0 12px">Profile</div>' +
        '<div class="d-prof"><span class="avatar s48">' + ini + '<span class="on-dot' + (Z.S.dutyOnline ? ' on' : '') + '"></span></span>' +
        '<div><div class="t-sub">' + E(s.name) + '</div><div class="t-cap">Delivery Boy · ' + (Z.S.dutyOnline ? '<span class="t-ok b">Online</span>' : 'Offline') + '</div></div></div>' +
        '<div class="card flat"><dl class="d-kv" style="margin:0">' +
        '<dt>Name</dt><dd>' + E(s.name) + '</dd>' +
        '<dt>Phone</dt><dd>' + E(s.phone) + '</dd>' +
        '<dt>Email</dt><dd>' + E(s.email) + '</dd>' +
        '<dt>Vehicle</dt><dd>' + E(s.vehicle || '—') + '</dd>' +
        '<dt>Role</dt><dd>Delivery Boy</dd></dl></div>' +
        '<div class="list" style="margin-top:12px">' +
        '<div class="li"><span class="li-ic" style="background:' + (Z.S.dutyOnline ? 'var(--a-success-light)' : '#f5f5f5') + '">' + (Z.S.dutyOnline ? '🟢' : '⚪') + '</span><div class="grow"><div class="li-t">Online status</div><div class="li-s">' + (Z.S.dutyOnline ? 'Admin can assign you new orders' : 'Admin can\'t assign you new orders') + '</div></div>' +
        '<button class="tg lg' + (Z.S.dutyOnline ? ' on' : '') + '" data-act="toggleDuty" aria-label="Online status"></button></div>' +
        '<div class="li" data-act="d.notif" style="cursor:pointer"><span class="li-ic">🔔</span><div class="grow"><div class="li-t">Notification settings</div><div class="li-s">New orders, assignments, sound</div></div>' + Z.icon('chev', 'chev') + '</div>' +
        '<div class="li" data-act="d.support" style="cursor:pointer"><span class="li-ic">📞</span><div class="grow"><div class="li-t">Call Zugo admin</div><div class="li-s">' + E(Z.D.config.support_phone) + '</div></div>' + Z.icon('chev', 'chev') + '</div>' +
        '</div>' +
        '<button class="btn block lg danger-outline" style="margin-top:20px" data-act="d.logout">Logout</button>' +
        '<div class="t-cap t-center" style="margin-top:12px">Zugo Operator · v1.0.0</div>' +
        '</div>' + Z.bottomNav('delivery', 'd-profile');
    },
    notes: {
      purpose: 'The boy\'s account details, online switch and logout.',
      points: [
        'one_place: “Profile” heading, flat card Name / Phone / Email / Role (“Delivery Boy”), “Logout” outline button with ConfirmDialog “Logout — Are you sure you want to logout?”.',
        'Zugo addition: Vehicle number, Online status row (same set_delivery_boy_online as the top-bar toggle), Notification settings, Call Zugo admin.',
        'Logout also deletes this device\'s FCM token so the boy stops getting order pushes.'
      ],
      data: ['profiles (full_name, phone, email, role, is_online, vehicle_no — new column)', 'rpc set_delivery_boy_online(p_is_online)', 'device_tokens (delete on logout)'],
      next: ['d-login', 'd-queue', 'd-history'],
      ref: 'apps/operator_app/lib/screens/profile_screen.dart; operator_shell.dart (logout confirm)'
    }
  });
  function notifBody() {
    const row = function (k, t, d) {
      return '<div class="li"><div class="grow"><div class="li-t">' + t + '</div><div class="li-s">' + d + '</div></div><button class="tg' + (notif[k] ? ' on' : '') + '" data-act="d.notifT" data-k="' + k + '" aria-label="' + t + '"></button></div>';
    };
    return '<div class="list">' + row('neworder', 'New order alerts', '🛒 New Order #… for the Unassigned pool') +
      row('assign', 'Assignment alerts', '🛵 New delivery assigned to you') +
      row('status', 'Order changes', 'Cancelled or reassigned by admin') +
      row('sound', 'Loud order sound', 'Plays even on silent mode') + '</div>' +
      '<div class="hint" style="margin-top:8px">Notification permission is required to use Zugo Operator.</div>';
  }
  Z.on('d.notif', function () { Z.sheet('Notification settings', notifBody()); });
  Z.on('d.notifT', function (el) {
    const k = el.getAttribute('data-k');
    notif[k] = !notif[k];
    Z.sheet('Notification settings', notifBody());
  });
  Z.on('d.support', function () { Z.toast('Calling ' + E(Z.D.config.support_phone) + '…'); });
  Z.on('d.logout', function () {
    Z.dialog('<div class="dialog-t">Logout</div><div class="dialog-d">Are you sure you want to logout?</div>' +
      '<div class="btn-row"><button class="btn neutral" data-act="closeOv">Cancel</button><button class="btn danger" data-act="d.logoutGo">Logout</button></div>');
  });
  Z.on('d.logoutGo', function () {
    Z.closeOv();
    Z.S.loggedIn.delivery = false;
    Z.go('d-login', {}, { root: true });
  });
})();
