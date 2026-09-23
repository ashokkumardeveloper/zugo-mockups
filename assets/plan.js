/* ==========================================================================
   Zugo mockups — Project plan page (viewer page, not a phone screen).
   Summarises docs/zugo-project-plan.md. Keep copy in sync with that file.
   ========================================================================== */
(function () {
  'use strict';
  const Z = window.Z;
  const esc = Z.esc;

  Z.css('plan', [
    '.p-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}',
    '.p-meta .v-tag{font-size:11.5px;padding:3px 9px}',
    '.p-note{display:flex;gap:10px;align-items:flex-start;font-size:13px;color:var(--v-muted);background:var(--v-surface-2);border:1px solid var(--v-line);border-radius:8px;padding:10px 12px;margin-top:16px}',
    '.p-note code{font-family:var(--mono);font-size:12px;color:var(--v-ink)}',
    '.p-note b{color:var(--v-ink)}',
    '.p-dec{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px}',
    '.p-card{background:var(--v-surface);border:1px solid var(--v-line);border-radius:10px;padding:14px 16px}',
    '.p-card h3{margin:0 0 4px!important;font-size:13.5px!important}',
    '.p-card p{margin:0;font-size:12.5px;color:var(--v-muted)}',
    '.p-k{font-size:10.5px;font-weight:600;letter-spacing:.07em;text-transform:uppercase;color:var(--v-accent);margin-bottom:6px}',
    '.p-cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}',
    '.p-cols ul{margin:0;padding-left:18px;font-size:13px}',
    '.p-cols li{margin-bottom:5px}',
    '.p-out li{color:var(--v-muted)}',
    '.p-chain{display:flex;flex-wrap:wrap;align-items:center;gap:6px;font-size:12.5px;margin:4px 0 8px}',
    '.p-chain span{background:var(--v-surface);border:1px solid var(--v-line);border-radius:6px;padding:5px 9px;font-family:var(--mono);font-size:11.5px}',
    '.p-chain i{font-style:normal;color:var(--v-faint)}',
    '.p-mono{font-family:var(--mono);font-size:12px;white-space:nowrap}',
    '.p-dim{color:var(--v-muted);font-size:12.5px}',
    '.p-new{display:inline-block;font-size:10px;font-weight:700;letter-spacing:.04em;padding:1px 6px;border-radius:4px;background:var(--v-accent-soft);color:var(--v-accent);margin-left:6px;vertical-align:1px}',
    '.p-days{font-variant-numeric:tabular-nums;font-weight:600;text-align:right;white-space:nowrap}',
    '.p-bar{position:relative;height:8px;min-width:120px;background:var(--v-surface-2);border:1px solid var(--v-line);border-radius:4px;overflow:hidden}',
    '.p-bar b{position:absolute;top:0;bottom:0;background:var(--v-accent);border-radius:3px}',
    '.p-range{font-size:11px;color:var(--v-faint);font-variant-numeric:tabular-nums;margin-top:4px;white-space:nowrap}',
    '.p-total td{font-weight:600;background:var(--v-surface-2)}',
    '.p-checks{list-style:none;padding-left:0!important;margin:0;font-size:13px}',
    '.p-checks li{position:relative;padding-left:24px;margin-bottom:7px}',
    '.p-checks li::before{content:"";position:absolute;left:0;top:3px;width:13px;height:13px;border:1.5px solid var(--v-faint);border-radius:3px}',
    '.p-apps{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;align-items:start}',
    '.p-apps .v-panel{padding:0;overflow:hidden}',
    '.p-apps .p-apphead{padding:12px 14px;border-bottom:1px solid var(--v-line);display:flex;justify-content:space-between;align-items:baseline;gap:8px}',
    '.p-apps .p-apphead b{font-size:14px}',
    '.p-apps .v-table td{padding:6px 12px}',
    '.p-link{background:none;border:0;padding:0;font:inherit;color:var(--v-accent);cursor:pointer;text-align:left}',
    '.p-link:hover{text-decoration:underline}',
    '.p-sec{font-size:12.5px}',
    '.p-sec td:first-child{font-weight:600;white-space:nowrap}',
    '.p-dec>*,.p-cols>*,.p-apps>*,#page-plan .v-grid-2>*,#page-plan .v-grid-3>*{min-width:0}',
    '#page-plan{overflow-wrap:anywhere}',
    '@media (max-width:640px){.p-hide-sm{display:none}.v-doc h1{font-size:22px}}'
  ].join('\n'));

  /* ---------------- content (mirrors docs/zugo-project-plan.md) ---------------- */
  const DECISIONS = [
    { k: 'Scope', t: 'One client, two apps', d: 'Zugo (customer) and Zugo Operator share one Supabase backend. No white-label, no flavors, no client config files.' },
    { k: 'MVP', t: 'Admin accepts and delivers', d: 'No delivery-boy role in v1. ✅ Accept self-assigns the order to the admin, who marks Preparing → Out for delivery → Delivered. Delivery boys are Phase 2 behind feature_delivery_role, with no schema change.' },
    { k: 'Repo', t: 'Modular: core + one package per vertical', d: 'packages/core (shared cart, checkout, orders, design system, module registry) + packages/food. Grocery and meat plug in later as packages/grocery and packages/meat.' },
    { k: 'Growth', t: 'service_type on every order line', d: 'cart_items, orders and order_items carry service_type and generic snapshots, and the apps build tabs and routes from a ServiceModule registry. A new vertical is an addition, not a rewrite.' },
    { k: 'Architecture', t: 'one_place pattern, no codegen', d: 'Screen → StateNotifier → IRepository → Supabase repository → Result<T, AppError>. Riverpod 2.6 and go_router 14.' },
    { k: 'Backend', t: '11 new migrations, not 188', d: 'A food-only rewrite that ports the working one_place RPCs with a stricter security baseline. Business rules live in Postgres RPCs.' },
    { k: 'Checkout', t: 'Location without a saved address', d: 'GPS, a map pin, a pasted Google Maps link (resolved server-side) or a saved address. place_order takes the coordinates directly.' },
    { k: 'Prices', t: 'Live recheck everywhere', d: 'place_order raises PRICE_CHANGED when the subtotal no longer matches. Order again shows old and new prices before anything is added to the cart.' },
    { k: 'Payments', t: 'Cash on delivery in v1', d: 'Razorpay is left out. The payment_method enum and the normal_online_enabled key stay, so online payment can be added later as a toggle.' },
    { k: 'Images', t: 'Supabase Storage, not R2', d: 'One vendor fewer for the client to own. The catalog bucket is public-read and only admins can write.' },
    { k: 'Push', t: 'One Firebase project, all statuses', d: 'fcm-order-notify covers every status change, sends to customers too, and includes deep-link data. Its secrets are read from Vault, not written into SQL.' }
  ];

  const IN_SCOPE = [
    'Customer: browse shops and dishes, veg filter, search, variations, cart (one shop per order)',
    'Checkout: GPS, map pin, Maps link or saved address, plus address line, landmark and notes. COD only.',
    'Order tracking timeline (Realtime), status pushes, history, PDF receipt, cancel while placed',
    'Order again with a live price recheck ("Prices updated" review)',
    'Customer: floating mini cart bar above the bottom nav whenever the cart has items',
    'Admin: orders board with quick 📞 Call / 🗺️ Navigate / ✅ Accept, status moves, shops and dishes with images and variations',
    'Admin: reports (trend, top shops and dishes, COD), admin staff add and deactivate, settings, broadcast'
  ];
  const OUT_SCOPE = [
    'Delivery-boy role, assignment and pool (Phase 2)',
    'Grocery and meat modules (Phase 3 and 4; structure ready). Medicine not planned',
    'Pre-booking, delivery slots, scheduled orders',
    'Razorpay online payments in v1 (added later as a toggle)',
    'Tamil / Malayalam language gate and translations',
    'Telegram alerts, white-label tooling, customer web app'
  ];

  const TREE = [
    'zugo/',
    '├── pubspec.yaml                 # workspace root + melos scripts (analyze, test, format)',
    '├── README.md                    # quick start + links to docs/',
    '├── env/zugo.example.json        # committed; env/zugo.json is git-ignored',
    '├── apps/',
    '│   ├── zugo/                    # customer app  "Zugo"          in.zugo.app',
    '│   └── zugo_operator/           # "Zugo Operator" (admin; delivery role in Phase 2) in.zugo.operator',
    '├── packages/food/               # food module: restaurants, menu items, FoodModule',
    '├── packages/grocery/  meat/     # later modules, same ServiceModule contract',
    '├── packages/core/lib/',
    '│   ├── modules/                 # ServiceModule + registry (enabled_services)',
    '│   ├── config/                  # SupabaseConfig (no defaults, fail fast), AppInfo',
    '│   ├── models/                  # Result, enums, ServiceType, order, order_item, cart …',
    '│   ├── repositories/interfaces/ # I*Repository (one folder, not two)',
    '│   ├── repositories/supabase/   # implementations, never throw',
    '│   ├── controllers/             # StateNotifiers',
    '│   ├── providers/  services/    # push, location, maps link, storage, image compress',
    '│   ├── ui/theme/  ui/components/  ui/screens/map_picker_screen.dart',
    '│   └── utils/                   # money, delivery_pricing, error humanizer, support_contact',
    '├── supabase/',
    '│   ├── config.toml  seed.sql (dev only)  tests/ (pgTAP)',
    '│   ├── migrations/0001_core_schema.sql … 0011_security_hardening.sql',
    '│   └── functions/ create-user · fcm-order-notify · fcm-broadcast · resolve-maps-url · compute-distance?',
    '├── docs/ zugo-project-plan.md · runbook.md · handover-checklist.md',
    '├── mockups/                     # this page',
    '└── .github/workflows/ci.yml     # melos analyze + melos test'
  ].join('\n');

  const MIGRATIONS = [
    ['0001_core_schema', 'Enums, profiles + role-escalation guard, is_admin(), addresses, app_config defaults', '00001, 00016–00018', false],
    ['0002_catalog', 'Restaurants (+ opening hours), menu items, variations, browse and admin RPCs (create_restaurant with an admin check), catalog bucket', '00006, 00007, 00085, 00086, 00088–00090, 00100, 00101, 00106, 00109, 00110, 00112, 00113, 00118', false],
    ['0003_cart', 'cart_items, add_to_cart on auth.uid(), one shop per cart, get_cart_items with live prices', '00005, 00008, 00015, 00091, 00126', false],
    ['0004_orders_state_machine', 'orders, order_items, status history, Realtime, update_order_status, assign / self-assign, customer-safe history, delivery-boy RLS fix', '00019, 00026, 00028, 00029, 00050, 00053, 00061, 00115, 00128', false],
    ['0005_place_order', 'place_order with coordinates, p_expected_subtotal → PRICE_CHANGED, IST hours check, fee, GST, distance_cache', '00020–00022, 00048, 00062, 00116, 00165, 00179–00182, 00186', false],
    ['0006_admin_rpcs', 'get_admin_orders, stats, assignable boys, admin_set_staff_active', '00027, 00035, 00053, 00093, 00094, 00187, 00188', false],
    ['0007_delivery_rpcs (Phase 2)', 'Queue, unassigned pool, online toggle, delivery history with COD total', '00036–00044, 00050, 00119', false],
    ['0008_reorder_preview', 'reorder_preview + reorder_to_cart (ok · price_up · price_down · item_unavailable · variation_removed · restaurant_closed · item_deleted)', 'new (replaces grocery-only 00025)', true],
    ['0009_reports', 'get_admin_reports: daily trend, by shop, top dishes, per boy, AOV, cancel rate', 'new', true],
    ['0010_notifications_triggers', 'device_tokens, upsert_device_token, trigger → fcm-order-notify with URL and secret from Vault', '00031, 00176', false],
    ['0011_security_hardening', 'Revoke anon on write RPCs, pinned search_path, column grants, bucket limits, db lint clean', 'review findings', true]
  ];

  const FUNCTIONS = [
    ['create-user', 'port', 'Admin creates delivery boys and admins; set_active bans or unbans the account'],
    ['fcm-order-notify', 'port + extend', 'Every status goes to the right people (customer, assigned boy, admins) with data {order_id, route}'],
    ['fcm-broadcast', 'port', 'Admin broadcast by role'],
    ['resolve-maps-url', 'new', 'Expands maps.app.goo.gl links server-side and extracts @lat,lng / q= / !3d!4d'],
    ['compute-distance', 'optional', 'Ola Maps road km with a Haversine fallback, cache key computed on the server']
  ];

  const SECURITY = [
    ['Secrets', 'Server keys never in SQL or git', 'Supabase Vault, edge function secrets, git-ignored env file'],
    ['Roles', 'Only admins can change roles or staff status', 'BEFORE UPDATE guard and column grants on profiles'],
    ['Admin RPCs', 'Every admin function checks the caller', 'is_admin() in every admin RPC, covered by pgTAP tests'],
    ['Cart', 'Customers can only touch their own cart', 'RPCs use auth.uid(); no user id parameter'],
    ['Order visibility', 'Staff see only the orders they need', 'RLS per role, tested with pgTAP'],
    ['Image writes', 'Only admins upload catalog images', 'Storage bucket policies'],
    ['Delivery fee', 'Fee cannot be changed by the app', 'Distance and fee computed on the server'],
    ['Backend config', 'No built-in backend fallback', 'The app fails fast without env/zugo.json']
  ];

  const ROADMAP = [
    ['M0', 'Repo + Supabase setup', 3, 'Workspace and CI green; Supabase + Firebase projects; env files', 'Both empty apps launch with --dart-define-from-file; db reset works'],
    ['M1', 'Design system + auth', 6, 'core/ui theme and components, Result/AppError, login and register, role router, gates, ServiceModule registry with FoodModule', 'Customer and admin land in their shells; components match the mockups'],
    ['M2', 'Admin catalog', 6, '0002; shops (map pin, hours, image), dishes with variations, availability', '3 shops and 20 dishes created on a phone; customer write blocked (pgTAP)'],
    ['M3', 'Customer browse + cart', 7, 'Home, Dishes, search, menu, dish detail, cart (0003)', 'Live prices shown; replace-cart dialog; unavailable banner'],
    ['M4', 'Checkout + location + place_order', 8, '0004, 0005; GPS, map pin, Maps link and saved address; bill; error copy', 'All four methods place COD orders; closed, out-of-area, minimum and price-change errors rejected correctly'],
    ['M5', 'Operator orders (admin delivers)', 5, '0006; board with Call / Navigate / Accept, accept = self-assign, status moves, cancel', 'One order goes from placed to delivered with one customer and one admin phone'],
    ['M6', 'Notifications + tracking', 5, '0010; pushes for every status with deep links; Realtime timeline; broadcast', 'Push arrives within about 5 s; tap opens the right screen from a cold start'],
    ['M7', 'Reorder + reports + staff', 6, '0008, 0009; Prices updated sheet; reports; staff deactivation; settings', 'Reorder diffs correct; report totals match SQL; deactivated admin locked out'],
    ['M8', 'QA / UAT', 7, '0011 hardening, pgTAP suite, device testing, UAT rounds, fixes', 'No P1 or P2 bugs open; client UAT sign-off; security list verified'],
    ['M9', 'Store release + handover', 4, 'Signed AABs (IPA if iOS), listings, data safety, runbook, account transfer', 'Live on Play under the client\'s account; client rebuilds from the runbook']
  ];

  const HANDOVER = [
    { h: 'Accounts in the client\'s name', items: [
      'GitHub org: repo created there or transferred; branch protection on main',
      'Supabase project in the client org (Pro plan for production)',
      'Firebase / Google Cloud project "zugo" (+ APNs key if iOS)',
      'Google Play Console account, Play App Signing on',
      'Apple Developer account (only if iOS ships)'
    ] },
    { h: 'Secrets (password-manager share, never git)', items: [
      'Upload keystore .jks + key.properties (two offline copies)',
      'env/zugo.json (and staging)',
      'supabase/.env: FCM service account, hook secret, Ola key',
      'First admin login, password changed on first use'
    ] },
    { h: 'Docs and support', items: [
      'README + docs/runbook.md: local setup, supabase db push, functions deploy',
      'flutter build appbundle / ipa --dart-define-from-file=../../env/zugo.json',
      'Backup and restore: PITR, weekly db dump, restore drill',
      'Recorded handover session; 30-day support window (confirm)'
    ] }
  ];

  const QUESTIONS = [
    ['Delivery distance', 'Fee from shop to customer; service area checked from the hub', 'Hub-only or road km (Ola cost)'],
    ['One restaurant per order', 'Yes, with a replace-cart dialog', 'Multi-pickup: +5–8 days'],
    ['Online payments', 'COD only', 'Razorpay: +6–8 days'],
    ['Languages', 'English only', 'Malayalam: +5 days'],
    ['iOS release', 'Android first', '+3–4 days, plus an Apple account'],
    ['Maps API costs', 'OSM tiles, links resolved server-side, no Google key', 'Paid tiles at scale; Ola is billed per call'],
    ['Package ids', 'in.zugo.app / in.zugo.operator', 'Must be final before the first upload']
  ];

  /* ---------------- builders ---------------- */
  function table(head, rows, cls) {
    return '<div class="v-scroll"><table class="v-table' + (cls ? ' ' + cls : '') + '"><thead><tr>' +
      head.map(function (h) { return '<th' + (h.c ? ' class="' + h.c + '"' : '') + '>' + h.t + '</th>'; }).join('') +
      '</tr></thead><tbody>' + rows.join('') + '</tbody></table></div>';
  }

  function screensHtml() {
    const apps = [
      { id: 'customer', name: 'Zugo', role: 'Customer' },
      { id: 'admin', name: 'Zugo Operator', role: 'Admin' },
      { id: 'delivery', name: 'Zugo Operator', role: 'Delivery · Phase 2' }
    ];
    const total = apps.reduce(function (a, x) { return a + ((Z.APPS[x.id] && Z.APPS[x.id].screens.length) || 0); }, 0);
    if (!total) return '<p class="p-dim">Screens load from the app modules.</p>';
    return '<div class="p-apps">' + apps.map(function (a) {
      const list = (Z.APPS[a.id] && Z.APPS[a.id].screens) || [];
      return '<div class="v-panel"><div class="p-apphead"><b>' + esc(a.name) + ' · ' + esc(a.role) + '</b><span class="p-dim">' + list.length + ' screens</span></div>' +
        '<div class="v-scroll"><table class="v-table"><tbody>' + list.map(function (s) {
          return '<tr><td class="p-mono">' + esc(s.id) + '</td><td><button class="p-link" data-jump="' + esc(s.id) + '">' + esc(s.title) + '</button></td><td class="p-mono p-dim">' + esc(s.route || '') + '</td></tr>';
        }).join('') + '</tbody></table></div></div>';
    }).join('') + '</div>';
  }

  function roadmapHtml() {
    const total = ROADMAP.reduce(function (a, r) { return a + r[2]; }, 0);
    let start = 0;
    const rows = ROADMAP.map(function (r) {
      const left = start / total * 100, w = r[2] / total * 100;
      const from = start + 1, to = start + r[2];
      start += r[2];
      return '<tr><td class="p-mono"><b>' + r[0] + '</b></td><td><b>' + esc(r[1]) + '</b><div class="p-dim">' + esc(r[3]) + '</div></td>' +
        '<td class="p-days">' + r[2] + '</td>' +
        '<td class="p-hide-sm"><div class="p-bar" role="img" aria-label="Days ' + from + ' to ' + to + '"><b style="left:' + left + '%;width:' + w + '%"></b></div><div class="p-range">day ' + from + '–' + to + '</div></td>' +
        '<td class="p-dim">' + esc(r[4]) + '</td></tr>';
    });
    rows.push('<tr class="p-total"><td></td><td>Total, one developer</td><td class="p-days">' + total + '</td><td class="p-hide-sm p-dim">≈ ' + Math.round(total / 5) + ' weeks</td><td class="p-dim">Plus client review time. Demos after M2, M4, M5 and M7.</td></tr>');
    rows.push('<tr><td class="p-mono">P2</td><td><b>Delivery-boy role</b><div class="p-dim">Delivery screens, assign sheet, pool, online toggle, per-boy reports</div></td><td class="p-days">8–10</td><td class="p-hide-sm p-dim">after MVP</td><td class="p-dim">Turn on feature_delivery_role</td></tr>');
    rows.push('<tr><td class="p-mono">P3</td><td><b>Grocery module</b><div class="p-dim">packages/grocery, products, variations, stock</div></td><td class="p-days">12–15</td><td class="p-hide-sm p-dim">later</td><td class="p-dim">enabled_services += grocery</td></tr>');
    rows.push('<tr><td class="p-mono">P4</td><td><b>Meat module</b><div class="p-dim">packages/meat, parts, optional slots</div></td><td class="p-days">10–12</td><td class="p-hide-sm p-dim">later</td><td class="p-dim">enabled_services += meat</td></tr>');
    return table([{ t: 'M' }, { t: 'Milestone and deliverables' }, { t: 'Days', c: 'p-days' }, { t: 'Timeline', c: 'p-hide-sm' }, { t: 'Exit criteria' }], rows);
  }

  Z.pages.plan = function () {
    const el = document.getElementById('page-plan');
    if (!el) return;
    const totalDays = ROADMAP.reduce(function (a, r) { return a + r[2]; }, 0);

    let h = '<div class="v-doc-head"><h1>Zugo project plan</h1>' +
      '<p class="v-lede">How Zugo gets built and handed over: a food-delivery project for one client, built on the one_place design and Supabase workflow with everything except food removed. Zugo receives the full source in its own GitHub repo, along with the backend, the store accounts and a runbook.</p>' +
      '<div class="p-meta"><span class="v-tag">2 apps · 3 roles</span><span class="v-tag">Flutter + Supabase</span><span class="v-tag">COD in v1</span><span class="v-tag">≈ ' + totalDays + ' working days</span><span class="v-tag">Android first</span></div></div>';

    h += '<h2>Key decisions</h2><div class="p-dec">' + DECISIONS.map(function (d) {
      return '<div class="p-card"><div class="p-k">' + esc(d.k) + '</div><h3>' + esc(d.t) + '</h3><p>' + esc(d.d) + '</p></div>';
    }).join('') + '</div>';

    h += '<h2>Scope</h2><div class="p-cols"><div class="v-panel"><h3 style="margin-top:0">In v1</h3><ul>' +
      IN_SCOPE.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="v-panel p-out"><h3 style="margin-top:0">Out of scope</h3><ul>' +
      OUT_SCOPE.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div></div>';

    h += '<h2>Repository</h2><p>The current <code>zugo</code> folder is a stock <code>flutter create</code> app. Its root <code>lib/</code>, <code>android/</code>, <code>ios/</code> and <code>web/</code> are removed, and the two apps are created under <code>apps/</code> with their final package ids from day one.</p>' +
      '<pre class="v-pre">' + esc(TREE) + '</pre>' +
      '<div class="p-chain"><span>Screen</span><i>→</i><span>Controller (StateNotifier)</span><i>→</i><span>IRepository</span><i>→</i><span>Repository</span><i>→</i><span>Result&lt;T, AppError&gt;</span></div>' +
      '<p class="p-dim">flutter_riverpod 2.6 · go_router 14 · supabase_flutter 2.x · firebase_messaging 15 · geolocator 13 · flutter_map 7 (OSM) · google_fonts Poppins · image_picker + flutter_image_compress · url_launcher · pdf/printing. No code generation.</p>';

    h += '<h2>Supabase migrations</h2><p>New Zugo files, each porting the listed one_place migrations and dropping grocery, meat, slots, translations and Razorpay.</p>' +
      table([{ t: '#' }, { t: 'Migration' }, { t: 'Contents' }, { t: 'Ports from one_place' }], MIGRATIONS.map(function (m, i) {
        return '<tr><td class="p-mono p-dim">' + (i + 1) + '</td><td class="p-mono">' + esc(m[0]) + (m[3] ? '<span class="p-new">NEW</span>' : '') + '</td><td>' + esc(m[1]) + '</td><td class="p-dim">' + esc(m[2]) + '</td></tr>';
      }));

    h += '<div class="v-grid-2" style="margin-top:16px"><div><h3>Edge functions</h3>' +
      table([{ t: 'Function' }, { t: '' }, { t: 'Role' }], FUNCTIONS.map(function (f) {
        return '<tr><td class="p-mono">' + esc(f[0]) + '</td><td><span class="v-tag">' + esc(f[1]) + '</span></td><td class="p-dim">' + esc(f[2]) + '</td></tr>';
      })) + '<p class="p-dim">Images: the Supabase Storage bucket <code>catalog</code> (public read, admin-only writes, 2 MB, jpeg/png/webp). No R2.</p></div>' +
      '<div><h3>one_place problems not to copy</h3>' +
      table([{ t: 'Area' }, { t: 'Rule' }, { t: 'How' }], SECURITY.map(function (s) {
        return '<tr><td>' + esc(s[0]) + '</td><td class="p-dim">' + esc(s[1]) + '</td><td>' + esc(s[2]) + '</td></tr>';
      }), 'p-sec') + '</div></div>';

    h += '<h2>Configuration</h2><div class="v-grid-3">' +
      '<div class="v-panel"><h3 style="margin-top:0">Build time</h3><p class="p-dim"><code>--dart-define-from-file=../../env/zugo.json</code> with SUPABASE_URL and SUPABASE_ANON_KEY. There are no production defaults: <code>SupabaseConfig.assertConfigured()</code> fails fast.</p></div>' +
      '<div class="v-panel"><h3 style="margin-top:0">Server secrets</h3><p class="p-dim">Edge secrets FCM_SERVICE_ACCOUNT, ORDER_HOOK_SECRET and OLA_MAPS_API_KEY (optional). Vault holds functions_base_url and order_hook_secret for the trigger.</p></div>' +
      '<div class="v-panel"><h3 style="margin-top:0">Runtime (app_config)</h3><p class="p-dim">Hours and pause, service area, the normal_* fee tiers, minimum cart, platform fee, GST, support numbers, high-traffic text, version gate, banners. Admins edit these in Settings.</p></div></div>';

    h += '<h2>Screen inventory</h2><p>Mockup ids with the go_router paths to build. Click a title to open that screen.</p>' + screensHtml();

    h += '<h2>Roadmap</h2>' + roadmapHtml();

    h += '<h2>Handover checklist</h2><div class="v-grid-3">' + HANDOVER.map(function (g) {
      return '<div class="v-panel"><h3 style="margin-top:0">' + esc(g.h) + '</h3><ul class="p-checks">' + g.items.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>';
    }).join('') + '</div>';

    h += '<h2>Open questions for the client</h2>' +
      table([{ t: 'Question' }, { t: 'Default in the plan' }, { t: 'If changed' }], QUESTIONS.map(function (q) {
        return '<tr><td><b>' + esc(q[0]) + '</b></td><td>' + esc(q[1]) + '</td><td class="p-dim">' + esc(q[2]) + '</td></tr>';
      }));

    h += '<div class="p-note"><span aria-hidden="true">📄</span><div><b>Full plan:</b> <code>docs/zugo-project-plan.md</code>. It has the complete RPC catalogue, RLS table, app identity, runbook commands and risk list.</div></div>';

    el.innerHTML = h;
  };
})();
