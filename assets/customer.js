/* ==========================================================================
   Zugo customer app (screens c-*, actions c.*)
   Follows one_place apps/customer_app (food flow only), with Zugo additions
   marked "Zugo addition:" in each screen's notes.
   ========================================================================== */
(function () {
  'use strict';
  const Z = window.Z;
  const OP = 'one_place/apps/customer_app/lib/screens/';

  /* ---------------- module-local UI state (kept inside Z.S so "Reset all" clears it) ---------------- */
  function X() {
    if (!Z.S.cx) {
      Z.S.cx = {
        notifDone: false, notifOn: true,
        dishVeg: 'all', menuVeg: 'all',
        recents: ['biryani', 'dosa', 'burger lab'],
        sel: {},            // itemId -> selected variation on item detail
        bd: false,          // cart breakdown open
        gpsAt: '9.99890, 76.29660', mapPicked: false, mapFrom: 'checkout',
        af: null,           // address form draft
        fbImg: false,
        hidden: {}          // orders the customer deleted from history
      };
    }
    return Z.S.cx;
  }

  /* ---------------- helpers ---------------- */
  const esc = Z.esc;
  function goA(id, p, extra) { return ' data-go="' + id + '"' + (p ? ' data-p="' + Z.json(p) + '"' : '') + (extra || ''); }
  function priceLabel(it) {
    if (it.vars) {
      const ps = it.vars.map(function (v) { return v.price; });
      const lo = Math.min.apply(null, ps), hi = Math.max.apply(null, ps);
      return lo === hi ? Z.money(lo) : Z.money(lo) + ' – ' + Z.money(hi);
    }
    return it.price != null ? Z.money(it.price) : 'See menu';
  }
  function shopItems(sid) { return Z.D.items.filter(function (i) { return i.shop === sid; }); }
  function visibleShops() {
    return Z.D.shops.filter(function (s) { return s.active; }).slice().sort(function (a, b) { return (b.open ? 1 : 0) - (a.open ? 1 : 0); });
  }
  function vegFilter(list, mode) {
    return list.filter(function (i) { return mode === 'all' || (mode === 'veg' ? i.veg : !i.veg); });
  }
  function vegStrip(key, mode) {
    return '<div class="chips">' +
      '<button class="chip' + (mode === 'all' ? ' blue' : '') + '" data-act="c.veg" data-k="' + key + '" data-v="all">All</button>' +
      '<button class="chip' + (mode === 'veg' ? ' veg-on' : '') + '" data-act="c.veg" data-k="' + key + '" data-v="veg">' + Z.veg(true) + 'Veg</button>' +
      '<button class="chip' + (mode === 'non' ? ' non-on' : '') + '" data-act="c.veg" data-k="' + key + '" data-v="non">' + Z.veg(false) + 'Non-veg</button></div>';
  }
  function tintOf(it) { const s = Z.shop(it.shop); return s ? s.tint : ''; }
  // MenuItemCard (one_place widgets/menu_item_card.dart): no + button, price turns food-blue when in cart
  function menuCard(it, showShop) {
    const inCart = Z.cartQty(it.id) > 0;
    return '<div class="c-mc' + (it.avail ? '' : ' off') + '"' + goA('c-item', { item: it.id }) + ' role="button">' +
      Z.img(it.e, tintOf(it), '<span class="c-vb">' + Z.veg(it.veg) + '</span>' + (it.avail ? '' : '<span class="c-unav">UNAVAILABLE</span>')) +
      '<div class="c-mc-n clamp-' + (showShop ? '2' : '1') + '">' + esc(it.name) + '</div>' +
      (showShop ? '<div class="t-cap clamp-1">' + esc(Z.shop(it.shop).name) + '</div>' : '') +
      '<div class="c-mc-p' + (inCart || showShop ? ' food' : '') + '">' + priceLabel(it) + '</div></div>';
  }
  function cartBtn() {
    const n = Z.cartCount();
    return '<button class="ib" data-go="c-cart" aria-label="Cart"><span style="font-size:22px">🛒</span>' +
      (n ? '<span class="dot-badge" style="border:1.5px solid #fff;min-width:18px;height:18px;border-radius:9px;top:2px;right:0">' + (n > 9 ? '9+' : n) + '</span>' : '') + '</button>';
  }
  function empty(em, t, d, btn) {
    return '<div class="empty"><div class="em-i">' + em + '</div><div class="em-t">' + t + '</div><div class="em-d">' + d + '</div>' + (btn || '') + '</div>';
  }
  function lineLabel(itemId, varId) {
    const it = Z.item(itemId);
    return esc(it.name) + (it.vars ? ' · ' + esc(Z.varName(it, varId)) : '');
  }
  function initials(n) { return n.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase(); }
  function myOrders() {
    const h = X().hidden;
    return Z.S.orders.filter(function (o) { return o.mine && !h[o.id]; }).slice().sort(function (a, b) {
      return (Z.ACTIVE.indexOf(b.status) >= 0 ? 1 : 0) - (Z.ACTIVE.indexOf(a.status) >= 0 ? 1 : 0);
    });
  }
  function orderDate(o) {
    const h0 = o.history[0] ? o.history[0][1] : '';
    if (!o.date || (/^Today/.test(o.date) && h0)) return 'Today · ' + h0;   // keep header time equal to the "Order placed" step
    return o.date;
  }
  const ETA = { placed: 35, assigned: 30, checking: 22, delivering: 10 };
  function histAt(o, st) { const h = o.history.find(function (x) { return x[0] === st; }); return h ? h[1] : ''; }
  function defaultAddr() { return Z.D.addresses.find(function (a) { return a.isDefault; }) || Z.D.addresses[0]; }
  function demoCart() { if (!Z.S.cart.length) { Z.cartAdd('i1', 'full', 1); Z.cartAdd('i4', null, 1); Z.cartAdd('i6', null, 2); } }
  function bill(rows) {
    return '<div class="bill">' + rows.map(function (r) {
      if (r === '-') return '<div class="hr" style="margin:6px 0"></div>';
      if (r[2] === 'hint') return '<div class="t-cap" style="color:var(--a-hint);padding:0 0 3px">' + r[0] + '</div>';
      return '<div class="bill-r' + (r[2] ? ' ' + r[2] : '') + '"><span class="k">' + r[0] + '</span><span class="num">' + r[1] + '</span></div>';
    }).join('') + '</div>';
  }
  function pinMap(h, extra) {
    return '<div class="map" style="height:' + h + 'px"><div class="river"></div><div class="pin-shadow"></div><div class="pin">' + Z.icon('pin') + '</div>' + (extra || '') + '</div>';
  }

  /* ---------------- module CSS ---------------- */
  Z.css('customer',
    '.c-rail{display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px}.c-rail::-webkit-scrollbar{height:0}' +
    '.c-rc{width:130px;flex-shrink:0;cursor:pointer}.c-rc .img{width:130px;height:130px;font-size:52px;background:var(--food-light)}' +
    '.c-rc-n{font-size:12.5px;font-weight:600;line-height:1.35;margin-top:6px}.c-rc-p{font-size:12px;font-weight:600;color:var(--food-ink);margin-top:2px}' +
    '.c-va{width:130px;height:130px;flex-shrink:0;border-radius:6px;background:var(--food-light);color:var(--food-ink);display:grid;place-items:center;align-content:center;gap:4px;cursor:pointer;font-size:12.5px;font-weight:600}.c-va b{font-size:24px}' +
    '.c-blk{margin-top:18px}.c-blk-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;gap:8px}' +
    '.c-blk-h .n{font-size:15px;font-weight:500;cursor:pointer}.phone .c-link{font-size:12px;font-weight:600;color:var(--food-ink);background:none;border:0;padding:0;cursor:pointer;white-space:nowrap}' +
    '.c-closed{opacity:.55}.c-closed .img .overlay{font-size:12.5px}' +
    '.c-car{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none}.c-car::-webkit-scrollbar{height:0}.c-car .banner{flex:0 0 90%;scroll-snap-align:start;height:auto;aspect-ratio:2.5/1;border-radius:8px}' +
    '.c-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}' +
    '.c-mc{background:var(--a-bg2);border-radius:8px;padding:8px;cursor:pointer;position:relative}.c-mc .img{width:100%;height:auto;aspect-ratio:1/1;font-size:54px;background:var(--food-light)}' +
    '.c-mc.off{opacity:.5}.c-vb{position:absolute;left:6px;top:6px;line-height:0}.c-vb .veg{width:16px;height:16px}' +
    '.c-unav{position:absolute;right:6px;top:6px;background:var(--a-error);color:#fff;font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;letter-spacing:.03em}' +
    '.c-mc-n{font-size:13.5px;font-weight:500;margin-top:8px;line-height:1.35}.c-mc-p{font-size:15px;font-weight:600;margin-top:2px}.c-mc-p.food{color:var(--food-ink)}' +
    '.c-pin{flex-shrink:0;background:#fff;border-bottom:1px solid var(--a-border);padding:8px 16px;display:flex;flex-direction:column;gap:8px}' +
    '.c-hero{width:100%;height:auto;aspect-ratio:2.5/1;font-size:56px;border-radius:8px}' +
    '.c-pill{display:inline-flex;align-items:center;gap:4px;background:var(--a-bg2);border-radius:6px;padding:3px 8px;font-size:12px;color:var(--a-text2)}' +
    '.c-cat{font-size:15px;font-weight:500;color:var(--a-text2);margin:20px 0 10px}' +
    '.c-item-img{width:100%;height:auto;aspect-ratio:16/9;font-size:84px;border-radius:8px;background:var(--food-light)}' +
    '.c-var{align-items:center}.c-var.on{border-color:var(--food);background:var(--food-light)}.c-var.on>.radio{border-color:var(--food)}.c-var.on>.radio::after{background:var(--food)}.c-var .radio{width:20px;height:20px}' +
    '.c-fbtn{background:var(--food);color:#fff;height:48px}' +
    '.c-gp{display:inline-flex;align-items:center;gap:6px;background:var(--food-light);color:var(--food-ink);border-radius:6px;padding:5px 10px;font-size:14px;font-weight:500}' +
    '.c-cr{display:flex;gap:10px;background:var(--a-bg2);border-radius:8px;padding:10px}.c-cr + .c-cr{margin-top:8px}.c-cr.off{opacity:.5}' +
    '.phone .c-rm{font-size:12px;color:var(--a-error-ink);background:none;border:0;padding:0;cursor:pointer;margin-top:6px}' +
    '.c-meth{display:grid;grid-template-columns:1fr 1fr;gap:8px}.c-meth button{border:1.5px solid var(--a-border);background:#fff;border-radius:6px;padding:9px 8px;font-size:12px;font-weight:500;display:flex;align-items:center;gap:6px;cursor:pointer;text-align:left;line-height:1.25}' +
    '.c-meth button.on{border-color:var(--brand);background:var(--brand-light);color:var(--brand-ink);font-weight:600}.c-meth .e{font-size:16px}' +
    '.c-ok{font-size:12px;color:var(--a-success-ink);font-weight:500}' +
    '.c-ov{display:flex;padding-left:12px}.c-ov .img{width:40px;height:40px;font-size:20px;border:2px solid #fff;margin-left:-12px;border-radius:6px}' +
    '.c-obtn{padding:0 12px;height:32px;border-radius:6px;font-size:12px;font-weight:600;background:#fff;cursor:pointer}' +
    '.c-obtn.del{border:1.5px solid var(--a-error);color:var(--a-error-ink)}.c-obtn.again{border:1.5px solid var(--brand);color:var(--brand-ink)}' +
    '.c-from{display:flex;align-items:center;gap:6px;background:var(--food-light);border:1px solid var(--food);color:var(--food-ink);border-radius:6px;padding:8px 12px;font-size:13.5px}' +
    '.c-lab{font-size:12px;color:var(--a-text2);margin-bottom:6px;font-weight:500}' +
    '.c-srow{display:flex;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid var(--a-divider);cursor:pointer}.c-srow:last-child{border-bottom:0}' +
    '.c-rec{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--a-divider);font-size:13.5px}' +
    '.phone .c-x{background:none;border:0;color:var(--a-hint);cursor:pointer;font-size:14px;padding:4px 6px}' +
    '.c-mappanel{flex-shrink:0;background:#fff;box-shadow:var(--sh-sticky);padding:14px 16px 16px;position:relative;z-index:2}' +
    '.c-maphint{position:absolute;left:12px;right:12px;top:12px;background:#fff;border-radius:6px;padding:8px 12px;font-size:12px;color:var(--a-text2);box-shadow:var(--sh-card);z-index:3}' +
    '.c-osm{position:absolute;left:8px;bottom:8px;font-size:9.5px;color:#607d8b;background:rgba(255,255,255,.8);padding:1px 4px;border-radius:3px}' +
    '.c-ck{width:88px;height:88px;border-radius:50%;background:rgba(76,175,80,.12);color:var(--a-success);display:grid;place-items:center;margin:8px auto 14px}.c-ck .ic{width:48px;height:48px}' +
    '.phone .cartbar{color:#fff}.c-bell{font-size:80px;line-height:1;text-align:center}' +
    '.phone .c-splash{cursor:pointer;border:0;width:100%;color:var(--on-brand)}' +
    /* styles.css: `.phone button{color:inherit}` outranks plain `.btn`, so primary <button class=btn> lost its white text */
    '.phone button.btn:not(.outline):not(.ghost):not(.soft):not(.neutral):not(.danger-outline):not([disabled]):not(.disabled){color:var(--on-brand)}' +
    '.c-splash .btn{background:#fff;color:var(--brand-ink);margin-top:28px;min-width:180px}'
  );

  /* ---------------- shared actions ---------------- */
  Z.on('drawer', function () {
    const c = Z.D.customer;
    const di = function (em, label, attrs) { return '<button class="di" ' + attrs + '><span class="em">' + em + '</span>' + label + '</button>'; };
    Z.drawer(
      '<div class="drawer-h"><div class="av">' + initials(c.name) + '</div><div class="t-title">' + esc(c.name) + '</div><div class="t-cap">' + esc(c.email) + '</div></div>' +
      '<div style="padding:8px 0;flex:1;overflow-y:auto">' +
      di('🧾', 'My Orders', 'data-go="c-orders" data-root') +
      di('📍', 'My Addresses', 'data-go="c-addresses"') +
      di('🔔', 'Notifications', 'data-go="c-notifications"') +
      di('⚙️', 'Notification Settings', 'data-go="c-notif-settings"') +
      di('💬', 'Feedback', 'data-go="c-feedback"') +
      di('🆘', 'Help &amp; Support', 'data-act="c.help"') +
      di('ℹ️', 'About', 'data-act="c.about"') +
      '</div>' +
      '<div style="border-top:1px solid var(--a-divider);padding:6px 0">' + di('🚪', 'Logout', 'data-act="c.logoutAsk" style="color:var(--a-error)"') +
      '<div class="t-cap" style="padding:4px 24px 12px;color:var(--a-hint)">Zugo v1.0.0+1</div></div>'
    );
  });
  Z.on('c.help', function () {
    const c = Z.D.config;
    Z.dialog('<div class="dialog-t">Help &amp; Support</div><div class="dialog-d">Questions about an order? Our Kochi support team usually replies within a few minutes.<br><b>Call:</b> ' + esc(c.support_phone) + '<br><b>WhatsApp:</b> ' + esc(c.support_whatsapp_number) + '</div>' +
      '<div class="col"><button class="btn block" data-act="c.call" data-n="' + esc(c.support_phone) + '">📞  Call</button>' +
      '<button class="btn success block" data-act="c.wa">💬  WhatsApp</button><button class="btn ghost block" data-act="closeOv">Close</button></div>');
  });
  Z.on('c.call', function (el) { Z.closeOv(); Z.toast('Calling ' + (el.getAttribute('data-n') || Z.D.config.support_phone) + '…'); });
  Z.on('c.wa', function () { Z.closeOv(); Z.toast('Opening WhatsApp · "Hi, I need help with my order"'); });
  Z.on('c.about', function () {
    Z.dialog('<div class="t-center"><div class="t-heading" style="color:var(--brand)">Zugo</div><div class="t-cap">Version 1.0.0+1</div>' +
      '<p class="t-body t-muted" style="margin:10px 0 16px">Food from Kochi\'s favourite kitchens</p><button class="btn block" data-act="closeOv">Close</button></div>');
  });
  Z.on('c.logoutAsk', function () {
    Z.dialog('<div class="dialog-t">Logout</div><div class="dialog-d">Are you sure you want to logout?</div>' +
      '<div class="btn-row"><button class="btn neutral" data-act="closeOv">Cancel</button><button class="btn danger" data-act="c.logout">Logout</button></div>');
  });
  Z.on('c.logout', function () { Z.closeOv(); Z.S.loggedIn.customer = false; Z.go('c-login', {}, { root: true }); });
  Z.on('c.veg', function (el) { X()[el.getAttribute('data-k')] = el.getAttribute('data-v'); Z.refresh(); });

  /* ======================= START ======================= */
  Z.screen('customer', {
    id: 'c-splash', group: 'Start', title: 'Splash', route: '/ (splash)', sb: 'brand', needsLogin: false,
    render: function () {
      return '<button class="splash c-splash" data-act="c.start"><img class="sp-img" src="' + Z.IMG + 'zugo-logo.jpg" alt="Zugo. Click. Order. Enjoy.">' +
        '<span class="btn" style="margin-top:28px">Continue</span></button>';
    },
    notes: {
      purpose: 'Brand splash while main.dart starts Firebase + Supabase, restores the session and loads app_config.',
      points: ['Tap or Continue: not logged in → Login; logged in → Home (router redirect).', 'The version gate (UpdateRequiredDialog "Update required") also runs here, driven by app_config.customer_min_version / force_update.', 'Brand colour and name come from the Zugo theme file (AppColors.sharedPrimary #1976D2).'],
      data: ['auth.getSession()', 'app_config (customer_min_version, force_update)'],
      next: ['c-login', 'c-home'], ref: 'one_place/apps/customer_app/lib/main.dart (_AppInitializer)'
    }
  });
  Z.on('c.start', function () {
    if (!Z.S.loggedIn.customer) Z.go('c-login', {}, { root: true });
    else Z.go('c-home', {}, { root: true });
  });

  function authShell(inner) { return '<div class="scroll" style="padding:24px 20px">' + inner + '</div>'; }
  const legal = function (pre) {
    return '<p class="t-cap t-center" style="color:var(--a-hint);margin-top:16px">' + pre + '<span class="t-brand">Terms &amp; Conditions</span> and <span class="t-brand">Privacy Policy</span></p>';
  };
  Z.screen('customer', {
    id: 'c-login', group: 'Start', title: 'Login', route: '/login', needsLogin: false,
    render: function () {
      return authShell(
        '<img class="auth-logo-img" style="margin:12px auto 16px" src="' + Z.IMG + 'zugo-icon.jpg" alt="Zugo">' +
        '<div class="t-heading t-center">Welcome back</div><div class="t-body t-muted t-center mb-16">Login to your account</div>' +
        '<div class="field"><label class="lbl">Email</label><input class="inp" type="email" value="rahul.nair@example.com"></div>' +
        '<div class="field"><label class="lbl">Password</label><input class="inp" type="password" value="zugo1234"></div>' +
        '<button class="btn block mt-16" data-act="c.login">Login</button>' +
        '<div class="divider-t">OR</div>' +
        '<button class="gbtn" data-act="c.login" data-g="1"><b style="color:#4285f4;font-size:16px">G</b> Continue with Google</button>' +
        '<p class="t-body t-center mt-16">Don\'t have an account? <a class="t-brand b" data-go="c-register" style="cursor:pointer">Register</a></p>' +
        legal('By continuing, you agree to our '));
    },
    notes: {
      purpose: 'Email + password or Google sign-in (one_place LoginScreen, same copy).',
      points: ['Validation banner: "Email and password are required".', 'Only role=customer accounts are accepted; staff accounts are told to use Zugo Operator.', 'First login goes to the notification gate; later logins go straight to Home.', 'Dropped from one_place: the Tamil/Malayalam "Choose your language" gate (Zugo is English-only for v1).'],
      data: ['supabase.auth.signInWithPassword', 'signInWithIdToken (Google)', 'profiles (role check)'],
      next: ['c-register', 'c-notify-gate', 'c-home'], ref: OP + 'login_screen.dart'
    }
  });
  Z.on('c.login', function (el) {
    Z.S.loggedIn.customer = true;
    if (el && el.getAttribute('data-g')) Z.toast('Signed in with Google');
    Z.go(X().notifDone ? 'c-home' : 'c-notify-gate', {}, { root: true });
  });
  Z.screen('customer', {
    id: 'c-register', group: 'Start', title: 'Register', route: '/register', needsLogin: false,
    render: function () {
      const f = function (l, t, v, h) { return '<div class="field"><label class="lbl">' + l + '</label><input class="inp" type="' + t + '" value="' + v + '" placeholder="' + (h || '') + '"></div>'; };
      return Z.appBar({ back: true, title: '' }).replace('class="ab"', 'class="ab" style="border-bottom:0"') + authShell(
        '<div class="t-heading t-center">Create Account</div><div class="t-body t-muted t-center mb-16">Sign up to get started</div>' +
        f('Full name', 'text', '', 'e.g. Rahul Nair') + f('Phone', 'tel', '', '10-digit mobile') +
        f('Email', 'email', '', 'you@example.com') + f('Password', 'password', '', 'At least 6 characters') + f('Confirm Password', 'password', '', '') +
        '<button class="btn block mt-16" data-act="c.register">Create Account</button>' +
        '<div class="divider-t">OR</div><button class="gbtn" data-act="c.register"><b style="color:#4285f4;font-size:16px">G</b> Sign up with Google</button>' +
        '<p class="t-body t-center mt-16">Already have an account? <a class="t-brand b" data-go="c-login" style="cursor:pointer">Login</a></p>' +
        legal('By creating an account, you agree to our '));
    },
    notes: {
      purpose: 'Create a customer account (one_place RegisterScreen).',
      points: ['Validation copy: "All fields are required", "Please enter a valid email address", "Password must be at least 6 characters", "Passwords do not match".', 'Zugo addition: Full name and Phone at sign-up, saved to profiles.full_name / profiles.phone, so checkout can prefill recipient and contact number.', 'handle_new_user trigger creates the profiles row with role=customer.'],
      data: ['supabase.auth.signUp', 'profiles (handle_new_user trigger)'],
      next: ['c-notify-gate', 'c-login'], ref: OP + 'register_screen.dart'
    }
  });
  Z.on('c.register', function () { Z.S.loggedIn.customer = true; Z.toast('Account created'); Z.go('c-notify-gate', {}, { root: true }); });
  Z.screen('customer', {
    id: 'c-notify-gate', group: 'Start', title: 'Enable notifications', route: '/enable-notifications',
    render: function () {
      return '<div class="scroll" style="display:flex;flex-direction:column;justify-content:center;padding:32px 24px">' +
        '<div class="c-bell">🔔</div><div class="t-heading t-center mt-16">Enable Notifications</div>' +
        '<p class="t-body t-muted t-center">We send you order status updates, delivery alerts, and important account messages. You won\'t miss a thing.</p>' +
        '<button class="btn block mt-16" data-act="c.allowNotif">Allow Notifications</button>' +
        '<p class="t-cap t-center mt-16" style="color:var(--a-hint)">Required to continue using Zugo.</p></div>';
    },
    notes: {
      purpose: 'Hard gate on mobile: the app needs push permission before Home (one_place NotificationPermissionScreen).',
      points: ['Permanently denied state: "Notifications are turned off for Zugo…" with [Open Settings] and [I\'ve enabled them].', 'On allow: FCM token registered via upsert_device_token.', 'Zugo addition: these pushes now carry every order status change (Assigned, Preparing, Out for delivery, Delivered, Cancelled) and open the order when tapped.', 'The one_place language gate that followed this screen is dropped.'],
      data: ['upsert_device_token(p_token, p_platform)', 'device_tokens'],
      next: ['c-home'], ref: OP + 'notification_permission_screen.dart'
    }
  });
  Z.on('c.allowNotif', function () { X().notifDone = true; Z.go('c-home', {}, { root: true }); Z.toast('Notifications enabled'); });

  /* ======================= BROWSE ======================= */
  function railCard(it) {
    return '<div class="c-rc"' + goA('c-item', { item: it.id }) + '>' + Z.img(it.e, '') +
      '<div class="c-rc-n clamp-2">' + esc(it.name) + '</div><div class="c-rc-p">' + priceLabel(it) + '</div></div>';
  }
  function shopBlock(s) {
    const items = shopItems(s.id).filter(function (i) { return i.avail; });
    const head = '<div class="c-blk-h"><div class="grow"><div class="n clamp-1"' + goA('c-menu', { shop: s.id }) + '>' + esc(s.name) + '</div>' +
      '<div class="t-cap clamp-1">' + esc(s.cuisine) + ' · ' + s.eta + (s.open ? '' : ' · <span class="t-err b">Closed</span>') + '</div></div>' +
      '<button class="c-link"' + goA('c-menu', { shop: s.id }) + '>View all →</button></div>';
    if (!s.open) {
      return '<div class="c-blk c-closed">' + head +
        '<div' + goA('c-menu', { shop: s.id }) + ' style="cursor:pointer">' + Z.img(s.e, s.tint + ' c-hero', '<div class="overlay">Closed · ' + esc(s.opensAt || 'Opens later') + '</div>') + '</div></div>';
    }
    return '<div class="c-blk">' + head + '<div class="c-rail">' + items.slice(0, 9).map(railCard).join('') +
      (items.length > 4 ? '<div class="c-va"' + goA('c-menu', { shop: s.id }) + '><b>→</b>View all</div>' : '') + '</div></div>';
  }
  Z.screen('customer', {
    id: 'c-home', group: 'Browse', title: 'Home (Restaurants)', route: '/food (home tab)',
    render: function () {
      const B = Z.D.banners;
      return Z.shellBar() + '<div class="scroll">' +
        '<div class="search" data-go="c-search">' + Z.icon('search', 'sm') + '<span>Search restaurants &amp; dishes</span></div>' +
        '<div class="c-car mt-12">' + B.map(function (b) {
          return '<div class="banner ' + b.cls + '"><div class="bn-k">' + b.k + '</div><div class="bn-t">' + b.t + '</div><div class="bn-e">' + b.e + '</div></div>';
        }).join('') + '</div><div class="dots">' + B.map(function (b, i) { return '<i' + (i === 0 ? ' class="on"' : '') + '></i>'; }).join('') + '</div>' +
        '<div class="chips mt-12"><button class="chip on">Restaurants</button><button class="chip" data-go="c-dishes" data-root>Menu items</button></div>' +
        visibleShops().map(shopBlock).join('') + '</div>' + Z.bottomNav('customer', 'c-home');
    },
    notes: {
      purpose: 'Zugo\'s home is one_place\'s Food tab: search stub, food banner carousel, then one block per restaurant with a rail of its dishes.',
      points: ['one_place Home hub (service tiles, promoted rows) is dropped — Zugo is food only.', 'Banner carousel: 2.5:1, 90% page width, auto-advance 4 s, dots 6×6 with the active dot 16 wide in food blue.', 'Per restaurant: name + "View all →", rail of up to 9 cards 130 wide (1:1 image, 2-line name, "₹X" or "₹min – ₹max" in food blue), trailing "View all" card.', 'Zugo addition: shop hours. A closed restaurant (Chai & Snacks Corner) is greyed with "Closed · Opens at 4:00 PM" and sorted last.', 'No location header — like one_place, location is asked only at checkout.', 'Empty: 🍔 "No restaurants yet" / "We\'re onboarding kitchens — check back soon."'],
      data: ['get_food_restaurants_with_top_items(p_offset, p_limit=30, p_items_per_restaurant=9)', 'app_config.food_banners', 'restaurants.opens_at / closes_at (Zugo addition)'],
      next: ['c-search', 'c-menu', 'c-item', 'c-dishes', 'c-cart'], ref: OP + 'restaurants_browse_screen.dart'
    }
  });

  Z.screen('customer', {
    id: 'c-dishes', group: 'Browse', title: 'Dishes (Menu items)', route: '/food?tab=menu-items',
    render: function () {
      const mode = X().dishVeg;
      const list = vegFilter(Z.D.items.filter(function (i) { const s = Z.shop(i.shop); return s && s.active; }), mode);
      const body = list.length ? '<div class="c-grid">' + list.map(function (it) { return menuCard(it, true); }).join('') + '</div>'
        : empty('🍽️', mode === 'veg' ? 'No veg dishes' : 'No non-veg dishes', 'Try the All chip to see everything available.');
      return Z.shellBar() + '<div class="scroll">' +
        '<div class="search" data-go="c-search">' + Z.icon('search', 'sm') + '<span>Search restaurants &amp; dishes</span></div>' +
        '<div class="chips mt-12"><button class="chip" data-go="c-home" data-root>Restaurants</button><button class="chip on">Menu items</button></div>' +
        '<div class="mt-12 mb-12">' + vegStrip('dishVeg', mode) + '</div>' + body + '</div>' + Z.bottomNav('customer', 'c-dishes');
    },
    notes: {
      purpose: 'Every dish across all restaurants in a 2-column grid (one_place Food tab, "Menu items" chip).',
      points: ['Veg strip [All] (blue) [Veg] (green) [Non-veg] (food blue).', 'Card: 1:1 image, veg badge top-left, red UNAVAILABLE pill when switched off (card at 50%), name, restaurant, price in food blue.', 'Tap opens the item detail. Grid is 3 columns from 600 px, 4 from 800 px.', 'Zugo: shown as its own bottom-nav tab (🍛 Dishes) instead of a chip inside Food.', 'Empty: 🍽️ "No dishes yet" / "Check back soon — chefs are uploading menus."'],
      data: ['get_food_menu_items_paged(p_offset, p_limit, p_filter_veg)'],
      next: ['c-item', 'c-home'], ref: OP + 'restaurants_browse_screen.dart (menu items chip)'
    }
  });

  function searchResults(q) {
    const x = X();
    q = (q || '').trim().toLowerCase();
    if (!q) {
      if (!x.recents.length) return empty(Z.icon('search'), 'No recent searches', 'Type a restaurant or dish above. Your recent searches will appear here.');
      return '<div class="sec-h"><h4>Recent searches</h4><button class="link" data-act="c.clearRecent">Clear all</button></div>' +
        x.recents.map(function (r, i) {
          return '<div class="c-rec"><span class="t-hint">⟲</span><span class="grow" data-act="c.recent" data-q="' + esc(r) + '" style="cursor:pointer">' + esc(r) + '</span><button class="c-x" data-act="c.rmRecent" data-i="' + i + '" aria-label="Remove">✕</button></div>';
        }).join('');
    }
    const shops = Z.D.shops.filter(function (s) { return s.active && (s.name + ' ' + s.cuisine).toLowerCase().indexOf(q) >= 0; });
    const dishes = Z.D.items.filter(function (i) { return (i.name + ' ' + i.cat + ' ' + i.desc).toLowerCase().indexOf(q) >= 0; });
    if (!shops.length && !dishes.length) {
      return empty('🔎', 'No results', 'Check the spelling. We\'re continuously adding more dishes, so come back and check later — something related might have been added by then.');
    }
    let h = '';
    if (shops.length) {
      h += '<div class="sec-h"><h4>🍔 Restaurants (' + shops.length + ')</h4></div>' + shops.map(function (s) {
        return '<div class="c-srow"' + goA('c-menu', { shop: s.id }) + '>' + Z.img(s.e, s.tint + ' s56') + '<div class="grow"><div class="t-sub clamp-1">' + esc(s.name) + '</div>' +
          '<div class="t-cap" style="color:var(--food-ink)">' + esc(s.cuisine) + '</div><div class="t-cap">' + s.eta + (s.open ? '' : ' · <span class="t-err">Closed</span>') + '</div></div></div>';
      }).join('');
    }
    if (dishes.length) {
      h += '<div class="sec-h"><h4>🍛 Dishes (' + dishes.length + ')</h4></div>' + dishes.map(function (it) {
        return '<div class="c-srow' + (it.avail ? '' : ' c-closed') + '"' + goA('c-item', { item: it.id }) + '>' + Z.img(it.e, tintOf(it) + ' s56') +
          '<div class="grow"><div class="row" style="gap:6px">' + Z.veg(it.veg) + '<span class="b clamp-1">' + esc(it.name) + '</span></div>' +
          '<div class="t-cap clamp-1">' + esc(Z.shop(it.shop).name) + '</div></div><span class="b" style="color:var(--food-ink)">' + priceLabel(it) + '</span></div>';
      }).join('');
    }
    return h;
  }
  Z.screen('customer', {
    id: 'c-search', group: 'Browse', title: 'Search', route: '/search',
    render: function () {
      const q = Z.S.search || '';
      return '<header class="ab" style="gap:4px"><button class="ib" data-back aria-label="Back">' + Z.icon('back') + '</button>' +
        '<label class="search grow" style="cursor:text">' + Z.icon('search', 'sm') + '<input id="c-q" value="' + esc(q) + '" placeholder="Search restaurants &amp; dishes" autocomplete="off">' +
        '<button class="c-x" data-act="c.clearQ" aria-label="Clear"' + (q ? '' : ' hidden') + '>✕</button></label></header>' +
        '<div class="scroll" id="c-sr">' + searchResults(q) + '</div>';
    },
    mount: function (root) {
      const inp = root.querySelector('#c-q');
      if (!inp) return;
      inp.focus();
      inp.setSelectionRange(inp.value.length, inp.value.length);
      inp.addEventListener('input', function () {
        Z.S.search = inp.value;
        root.querySelector('#c-sr').innerHTML = searchResults(inp.value);
        const x = root.querySelector('[data-act="c.clearQ"]'); if (x) x.hidden = !inp.value;
      });
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && inp.value.trim()) {
          const r = X().recents, v = inp.value.trim();
          const i = r.indexOf(v); if (i >= 0) r.splice(i, 1);
          r.unshift(v); if (r.length > 20) r.pop();
        }
      });
    },
    notes: {
      purpose: 'Find restaurants and dishes by name, cuisine or category.',
      points: ['Autofocused field "Search restaurants & dishes" with ✕ clear; recent searches (max 20, local) with "Clear all".', 'Results: "🍔 Restaurants (n)" rows (64 thumb, name, cuisines in food blue, prep time) and "🍛 Dishes (n)" rows (thumb, name, restaurant, price).', 'Zugo change: results filter live as you type (one_place waits for submit and shows a separate results page) and a dish opens its item detail directly.', 'Empty: "No results" / "Check the spelling…".'],
      data: ['search_food_by_substring(p_query)', 'get_restaurants_by_ids', 'get_menu_items_by_ids'],
      next: ['c-menu', 'c-item'], ref: OP + 'search_screen.dart, search_results_screen.dart'
    }
  });
  Z.on('c.clearQ', function () { Z.S.search = ''; Z.refresh(); });
  Z.on('c.recent', function (el) { Z.S.search = el.getAttribute('data-q'); Z.refresh(); });
  Z.on('c.rmRecent', function (el) { X().recents.splice(+el.getAttribute('data-i'), 1); Z.refresh(); });
  Z.on('c.clearRecent', function () { X().recents = []; Z.refresh(); });

  /* ======================= ORDER ======================= */
  function cartBar(shopId) {
    if (Z.S.cartShop !== shopId || !Z.cartCount()) return '';
    const n = Z.cartCount(), t = Z.cartTotals();
    return Z.miniCart();   // same floating mini cart as the tab screens
  }
  Z.screen('customer', {
    id: 'c-menu', group: 'Order', title: 'Restaurant menu', route: '/food/:id',
    defaults: function () { return { shop: 's1' }; },
    render: function (p) {
      const s = Z.shop(p.shop || 's1');
      const mode = X().menuVeg;
      const all = vegFilter(shopItems(s.id), mode);
      const cats = [];
      all.forEach(function (i) { if (cats.indexOf(i.cat) < 0) cats.push(i.cat); });
      cats.sort();
      let body = '';
      if (!shopItems(s.id).length) body = empty('🍽️', 'Menu is empty', 'Check back later — the kitchen is updating their menu.');
      else if (!all.length) body = '<p class="t-body t-muted t-center mt-24">' + (mode === 'veg' ? 'No veg dishes on this menu yet.' : 'No non-veg dishes on this menu yet.') + '</p>';
      else body = cats.map(function (c) {
        return '<div class="c-cat" id="c-cat-' + c.replace(/\W/g, '') + '">' + esc(c) + '</div><div class="c-grid">' +
          all.filter(function (i) { return i.cat === c; }).map(function (i) { return menuCard(i, false); }).join('') + '</div>';
      }).join('');
      return '<header class="ab"><button class="ib" data-back aria-label="Back">' + Z.icon('back') + '</button>' +
        '<div class="ab-title" style="font-size:21px">' + esc(s.name) + '</div>' + cartBtn() + '</header>' +
        '<div class="c-pin">' + vegStrip('menuVeg', mode) +
        (cats.length ? '<div class="chips">' + cats.map(function (c) { return '<button class="chip" data-act="c.cat" data-c="' + c.replace(/\W/g, '') + '">' + esc(c) + '</button>'; }).join('') + '</div>' : '') + '</div>' +
        '<div class="scroll">' + Z.img(s.e, s.tint + ' c-hero') +
        '<div class="t-cap mt-8">' + esc(s.cuisine.replace(' · ', ', ')) + '</div>' +
        '<div class="row mt-4 wrap"><span class="c-pill">🕒 ' + s.eta + '</span><span class="rating">' + s.rating + ' ★</span><span class="c-pill">' + esc(s.hours) + '</span></div>' +
        (s.open ? '' : '<div class="note warn mt-12">' + Z.icon('clock') + '<div><b>Closed right now</b> · ' + esc(s.opensAt) + '. You can browse the menu; ordering opens then.</div></div>') +
        body + '<div style="height:12px"></div></div>' + cartBar(s.id);
    },
    notes: {
      purpose: 'One restaurant\'s menu grouped by category (one_place RestaurantMenuScreen).',
      points: ['Pinned top bar: back + restaurant name (heading) + 🛒; pinned veg strip and category chips (tap scrolls to the section).', 'Hero 2.5:1, cuisines, prep-time pill; categories alphabetical with "Other" last.', 'MenuItemCard has no + button: tapping opens the item detail. Price turns food blue when that dish is in the cart; unavailable dishes are greyed with UNAVAILABLE.', 'Zugo addition: floating cart bar "N items · ₹X  View Cart →" when the cart holds items from this restaurant (one_place has no cart bar here).', 'Zugo addition: rating and opening hours; closed restaurants show a "Closed right now" banner.'],
      data: ['get_restaurant_menu(p_restaurant_id)', 'get_cart_items(p_user_id)'],
      next: ['c-item', 'c-cart'], ref: OP + 'restaurant_menu_screen.dart, widgets/menu_item_card.dart'
    }
  });
  Z.on('c.cat', function (el) {
    const t = document.getElementById('c-cat-' + el.getAttribute('data-c'));
    const sc = t && t.closest('.scroll');
    if (sc) sc.scrollTo({ top: t.offsetTop - sc.offsetTop - 8, behavior: 'smooth' });
  });

  function selVar(it) {
    if (!it.vars) return null;
    const x = X();
    if (x.sel[it.id]) return x.sel[it.id];
    const inCart = it.vars.find(function (v) { return Z.cartQty(it.id, v.id) > 0; });
    return inCart ? inCart.id : it.vars[0].id;
  }
  Z.screen('customer', {
    id: 'c-item', group: 'Order', title: 'Item detail', route: '/food/:restaurantId/menu/:menuItemId',
    defaults: function () { return { item: 'i1' }; },
    render: function (p) {
      const it = Z.item(p.item || 'i1');
      const s = Z.shop(it.shop);
      const v = selVar(it);
      const price = Z.itemPrice(it, v);
      const key = Z.cartKey(it.id, v);
      const q = Z.cartQty(it.id, v);
      const more = shopItems(s.id).filter(function (i) { return i.id !== it.id && i.avail; })
        .sort(function (a, b) { return (b.cat === it.cat ? 1 : 0) - (a.cat === it.cat ? 1 : 0); }).slice(0, 6);
      let foot;
      if (!it.avail) foot = '<button class="btn block" disabled style="height:48px">Not available</button>';
      else if (!s.open) foot = '<button class="btn block" disabled style="height:48px">Restaurant closed · ' + esc(s.opensAt) + '</button>';
      else if (!q) foot = '<button class="btn block c-fbtn" data-act="c.addItem" data-item="' + it.id + '" data-var="' + (v || '') + '">Add to cart · ' + Z.money(price) + '</button>';
      else foot = '<div class="row" style="gap:10px"><button class="btn c-fbtn grow" data-go="c-cart">Go to Cart (' + Z.cartCount() + ') →</button>' +
        '<div class="qty big"><button data-act="c.step" data-key="' + key + '" data-d="-1" aria-label="Less">−</button><span>' + q + '</span><button data-act="c.step" data-key="' + key + '" data-d="1" aria-label="More">+</button></div></div>';
      return Z.appBar({ back: true, title: 'Item details', sub: esc(s.name) }) +
        '<div class="scroll" style="padding-bottom:32px">' + Z.img(it.e, 'c-item-img') +
        '<div class="row mt-12" style="gap:10px">' + Z.veg(it.veg).replace('class="veg', 'style="width:18px;height:18px" class="veg') + '<div class="t-heading" style="font-size:21px">' + esc(it.name) + '</div></div>' +
        '<p class="t-body t-muted" style="margin:6px 0 0">' + esc(it.desc) + '</p>' +
        (it.best ? '<span class="tag amber mt-8">★ Bestseller</span>' : '') +
        (it.vars ? '<div class="t-sub t-muted mt-16 mb-8">Pick a size</div>' + it.vars.map(function (x) {
          return '<button class="opt-card c-var' + (x.id === v ? ' on' : '') + '" data-act="c.pickVar" data-item="' + it.id + '" data-var="' + x.id + '"><span class="radio"></span><span class="grow t-body">' + esc(x.name) + '</span><b>' + Z.money(x.price) + '</b></button>';
        }).join('') : '') +
        (more.length ? '<div class="t-sub mt-24 mb-12">More from ' + esc(s.name) + '</div><div class="c-grid">' + more.map(function (i) { return menuCard(i, false); }).join('') + '</div>' : '') +
        '</div><div class="sticky" style="border-top:1px solid var(--a-border)">' + foot + '</div>';
    },
    notes: {
      purpose: 'Dish detail with size selection and add to cart (one_place MenuItemDetailScreen).',
      points: ['16:9 image, veg badge + name, description, "Pick a size" VariantRadioRows (food-light when selected; starts on the size already in the cart).', '"More from {restaurant}": up to 6 cards, same category first.', 'Sticky: "Add to cart · ₹X" (food blue, 48 tall) → toast "Added {name} · {size} — ₹{price}". Once in cart: "Go to Cart (n) →" + big stepper.', 'Zugo simplification: one restaurant per order. Adding from a second restaurant opens "Replace cart items?" (one_place allows mixed carts, which complicates delivery).', 'Unavailable dish: button reads "Not available". Zugo addition: closed restaurant disables add with its opening time.'],
      data: ['add_to_cart(p_user_id, p_service_type=food, p_menu_item_id, p_restaurant_id, p_menu_item_variation_id)', 'cart_items (unique menu_item_id + variation)'],
      next: ['c-cart', 'c-item', 'c-menu'], ref: OP + 'menu_item_detail_screen.dart, utils/food_cart_actions.dart'
    }
  });
  Z.on('c.pickVar', function (el) { X().sel[el.getAttribute('data-item')] = el.getAttribute('data-var'); Z.refresh(); });
  Z.on('c.addItem', function (el) {
    const id = el.getAttribute('data-item'), v = el.getAttribute('data-var') || null;
    if (!Z.cartAdd(id, v, 1)) return;           // replace dialog opened (one shop per order) or unavailable
    const it = Z.item(id);
    Z.refresh();
    Z.toast('Added ' + esc(it.name) + (v ? ' · ' + esc(Z.varName(it, v)) : '') + ' — ' + Z.money(Z.itemPrice(it, v)));
  });
  Z.on('c.step', function (el) {
    const key = el.getAttribute('data-key');
    const c = Z.S.cart.find(function (x) { return x.key === key; });
    if (!c) return;
    const n = c.qty + (+el.getAttribute('data-d'));
    if (n > 50) { Z.toast('Maximum 50 per item'); return; }
    Z.cartSet(key, n);
    Z.refresh();
    if (n <= 0) Z.toast('Item removed');
  });

  Z.screen('customer', {
    id: 'c-cart', group: 'Order', title: 'Cart', route: '/cart',
    defaults: function () { demoCart(); return {}; },
    render: function () {
      const bar = Z.appBar({ back: true, title: 'My Cart' });
      if (!Z.S.cart.length) {
        return bar + '<div class="scroll">' + empty('🛒', 'Your cart is empty', 'Add dishes from your favourite Kochi kitchens to get started.', '<button class="btn" data-go="c-home" data-root>Browse restaurants</button>') + '</div>';
      }
      const x = X(), t = Z.cartTotals();
      // live cart: unavailable lines are excluded from the total and the minimum-order check (one_place get_cart_items)
      const availSub = Z.S.cart.reduce(function (a, c) { const it = Z.item(c.itemId); return a + (it.avail ? Z.itemPrice(it, c.varId) * c.qty : 0); }, 0);
      const minV = Z.D.config.minimum_cart_value;
      t.sub = availSub; t.short = availSub < minV ? minV - availSub : 0;
      const s = Z.shop(Z.S.cartShop);
      const off = Z.S.cart.filter(function (c) { return !Z.item(c.itemId).avail; });
      const blocked = !s.open ? 'We\'re closed. ' + s.name + ' ' + s.opensAt.toLowerCase() + '.' : Z.D.config.checkout_disabled ? 'Orders are temporarily paused' : '';
      const rows = Z.S.cart.map(function (c) {
        const it = Z.item(c.itemId);
        return '<div class="c-cr' + (it.avail ? '' : ' off') + '">' +
          '<div' + goA('c-item', { item: it.id }) + ' style="cursor:pointer">' + Z.img(it.e, s.tint + ' s48') + '</div>' +
          '<div class="grow"><div class="t-body b clamp-2">' + esc(it.name) + '</div>' + (it.vars ? '<div class="t-cap">' + esc(Z.varName(it, c.varId)) + '</div>' : '') +
          (it.avail ? '' : '<span class="tag solid-err">OUT OF STOCK</span><div class="t-cap t-err">Excluded from your total</div>') +
          '<button class="c-rm" data-act="c.rmAsk" data-key="' + c.key + '">🗑 Remove</button></div>' +
          '<div style="text-align:right"><div class="t-sub b">' + Z.money(Z.itemPrice(it, c.varId) * c.qty) + '</div>' +
          '<div class="qty light mt-8"><button data-act="c.step" data-key="' + c.key + '" data-d="-1" aria-label="Less">−</button><span>' + c.qty + '</span><button data-act="c.step" data-key="' + c.key + '" data-d="1" aria-label="More">+</button></div></div></div>';
      }).join('');
      const panel = x.bd ? '<div class="bill mb-12"><div class="bill-r"><span class="k">🍔 Food</span><span>' + Z.money(t.sub) + '</span></div><div class="hr" style="margin:6px 0"></div>' +
        '<div class="bill-r b"><span>Items total</span><span>' + Z.money(t.sub) + '</span></div><div class="t-cap mt-4" style="color:var(--a-hint)">* Delivery fee shown at checkout (depends on your address).</div></div>' : '';
      const can = !t.short && !blocked && !off.length;
      return bar + '<div class="scroll">' +
        (off.length ? '<div class="note err mb-12"><span>⚠️</span><div><b>' + off.length + ' item' + (off.length > 1 ? 's are' : ' is') + ' no longer available</b><br>Out of stock or removed by the seller. They\'re excluded from your total — remove them if you don\'t want them here.</div></div>' : '') +
        '<div class="c-gp mb-12">🍔 From ' + esc(s.name) + '</div>' + rows +
        '<button class="btn ghost sm mt-8"' + goA('c-menu', { shop: s.id }) + '>+ Add more items</button></div>' +
        '<div class="sticky">' + panel + '<div class="row between"><div><div class="t-price">' + Z.money(t.sub) + '</div>' +
        '<button class="c-link" style="color:var(--brand-ink);font-weight:500" data-act="c.bd">' + (x.bd ? 'Hide breakdown ▼' : 'View breakdown ▲') + '</button></div>' +
        '<button class="btn"' + (can ? ' data-go="c-checkout"' : ' disabled') + '>Checkout →</button></div>' +
        (blocked ? '<div class="t-cap t-err t-right mt-4">' + esc(blocked) + '</div>' : '') +
        (t.short ? '<div class="t-cap t-err t-right mt-4">Add ' + Z.money(t.short) + ' more (Min. order ' + Z.money(Z.D.config.minimum_cart_value) + ')</div>' : '') + '</div>';
    },
    notes: {
      purpose: 'Review the cart before checkout. Always shows live prices (one_place CartTab).',
      points: ['"🍔 From {restaurant}" pill; rows with 48 thumb, name, size, price, 26 px outlined stepper, "🗑 Remove" (confirm "Remove from cart?").', 'Unavailable banner "N items are no longer available…" with greyed OUT OF STOCK rows excluded from the total (shown when the admin switches a dish off).', 'Sticky: items total + "View breakdown ▲" panel with "* Delivery fee shown at checkout (depends on your address)." and [Checkout →].', 'Checkout disabled with "Add ₹x more (Min. order ₹100)" (app_config.minimum_cart_value), paused orders or a closed restaurant.', 'Zugo change: no saved address needed here — the location is chosen on the checkout screen, so the one_place [Add address →] branch is removed.', 'Empty: 🛒 "Your cart is empty" + [Browse restaurants].'],
      data: ['get_cart_items(p_user_id) (live price, is_available)', 'cart_items update/delete', 'app_config (minimum_cart_value, checkout_disabled, food hours)'],
      next: ['c-checkout', 'c-item', 'c-home'], ref: OP + 'cart_tab.dart'
    }
  });
  Z.on('c.bd', function () { X().bd = !X().bd; Z.refresh(); });
  Z.on('c.rmAsk', function (el) {
    const key = el.getAttribute('data-key');
    const c = Z.S.cart.find(function (x) { return x.key === key; });
    if (!c) return;
    Z.dialog('<div class="dialog-t">Remove from cart?</div><div class="dialog-d">' + lineLabel(c.itemId, c.varId) + ' will be removed.</div>' +
      '<div class="btn-row"><button class="btn neutral" data-act="closeOv">Keep</button><button class="btn danger" data-act="c.rm" data-key="' + key + '">Remove</button></div>');
  });
  Z.on('c.rm', function (el) { Z.cartSet(el.getAttribute('data-key'), 0); Z.closeOv(); Z.refresh(); Z.toast('Item removed'); });

  /* ---- checkout ---- */
  const COORD = { gps: '9.99890, 76.29660', map: '9.999400, 76.297100', link: '10.00120, 76.30240' };
  function locPanel() {
    const ck = Z.S.checkout, x = X();
    if (ck.method === 'gps') {
      return pinMap(110, '<span class="map-lbl" style="left:8px;top:8px">You are here</span>') +
        '<div class="row between mt-8"><span class="c-ok">✓ Pinned at ' + x.gpsAt + ' · accuracy 12 m</span><button class="btn outline sm" data-act="c.gps">📍 Re-capture</button></div>';
    }
    if (ck.method === 'map') {
      return x.mapPicked
        ? pinMap(110) + '<div class="row between mt-8"><span class="c-ok">✓ Pinned at ' + COORD.map + '</span><button class="btn outline sm" data-go="c-map">🗺️ Change</button></div>'
        : '<div class="note info">' + Z.icon('map') + '<div>Drop a pin exactly where the delivery partner should come.</div></div><button class="btn outline block mt-8" data-go="c-map">🗺️ Open map</button>';
    }
    if (ck.method === 'link') {
      return '<div class="lbl mb-8">Google Maps link</div><div class="row"><input class="inp grow" data-model="checkout.mapsUrl" value="' + esc(ck.mapsUrl) + '" placeholder="Paste a maps.app.goo.gl or google.com/maps link">' +
        '<button class="btn soft sm" style="height:44px" data-act="c.paste">Paste</button></div>' +
        (ck.linkParsed ? '<div class="c-ok mt-8">✓ Location found · ' + COORD.link + '</div><div class="t-cap" style="color:var(--a-hint)">Short link expanded by resolve-maps-url, pin read from the @lat,lng / !3d!4d part.</div>'
          : '<div class="row between mt-8"><span class="t-cap">In Google Maps: Share → Copy link, then paste here.</span><button class="btn ghost sm" data-act="c.resolve">Find</button></div>');
    }
    const a = Z.D.addresses.find(function (d) { return d.id === ck.addressId; }) || defaultAddr();
    return '<div class="row between"><div class="row"><span class="t-sub b">' + esc(a.label) + '</span>' + (a.isDefault ? '<span class="tag ok">Default</span>' : '') + '</div>' +
      '<button class="c-link" style="color:var(--brand-ink)"' + goA('c-addresses', { select: true }) + '>Change</button></div>' +
      '<div class="t-cap">' + esc(a.recipient) + ' · 📞 ' + esc(a.phone) + '</div><div class="t-body t-muted">' + esc(a.line) + (a.landmark ? ' · ' + esc(a.landmark) : '') + '</div>' +
      '<div class="t-cap" style="color:var(--a-hint)">📍 ' + a.lat.toFixed(4) + ', ' + a.lng.toFixed(4) + '</div>';
  }
  Z.screen('customer', {
    id: 'c-checkout', group: 'Order', title: 'Checkout (Order Summary)', route: '/checkout',
    defaults: function () { demoCart(); return {}; },
    render: function () {
      const bar = Z.appBar({ back: true, title: 'Order Summary' });
      if (!Z.S.cart.length) return bar + '<div class="scroll">' + empty('🛒', 'Your cart is empty.', 'Add a few dishes first.', '<button class="btn" data-go="c-home" data-root>Browse restaurants</button>') + '</div>';
      const ck = Z.S.checkout, cfg = Z.D.config, t = Z.cartTotals(), s = Z.shop(Z.S.cartShop);
      const M = [['gps', '📍', 'Current location'], ['map', '🗺️', 'Pick on map'], ['link', '🔗', 'Paste Google Maps link'], ['saved', '🏠', 'Saved address']];
      const paused = cfg.checkout_disabled ? cfg.checkout_disabled_reason : !cfg.food_service_active ? 'Food service is currently paused' : '';
      const extra = ck.method !== 'saved';
      const field = function (l, m, v, h, opt, type) {
        return '<div class="field"><label class="lbl">' + l + (opt ? ' <span class="opt">(optional)</span>' : '') + '</label><input class="inp" type="' + (type || 'text') + '" data-model="checkout.' + m + '" value="' + esc(v) + '" placeholder="' + h + '"></div>';
      };
      const ok = !paused && !t.short && ck.pay;
      return bar + '<div class="scroll bg2 stack-16" style="background:#fff">' +
        (paused ? '<div class="note warn"><span>🕒</span><div><b>Orders are paused</b><br>' + esc(paused) + '</div></div>' : '') +
        (t.short ? '<div class="note warn"><span>🛒</span><div><b>Minimum ' + Z.money(cfg.minimum_cart_value) + ' required</b><br>Add ' + Z.money(t.short) + ' more to place your order.</div></div>' : '') +
        // 1. deliver to
        '<div class="card flat"><div class="c-lab">Deliver to</div><div class="c-meth">' + M.map(function (m) {
          return '<button class="' + (ck.method === m[0] ? 'on' : '') + '" data-act="c.method" data-m="' + m[0] + '"><span class="e">' + m[1] + '</span>' + m[2] + '</button>';
        }).join('') + '</div><div class="mt-12">' + locPanel() + '</div>' +
        '<div class="hr soft"></div>' +
        (extra ? field('Address / flat / building', 'line', ck.line, 'e.g. Flat 4B, Skyline Apartments', true) + field('Landmark', 'landmark', ck.landmark, 'e.g. Opposite Kaloor stadium gate', true) : '') +
        '<div class="form-2' + (extra ? ' mt-12' : '') + '">' + field('Recipient name', 'recipient', ck.recipient, 'Who should we deliver to?') + field('Contact number', 'phone', ck.phone, '10-digit mobile', false, 'tel') + '</div></div>' +
        // 2. items
        '<div class="card flat"><div class="c-lab">Items (' + Z.S.cart.length + ')</div><div class="t-cap mb-8" style="color:var(--food-ink)">🍔 ' + esc(s.name) + '</div>' +
        Z.S.cart.map(function (c) {
          const it = Z.item(c.itemId);
          return '<div class="row" style="padding:4px 0;font-size:13px"><span class="t-muted" style="width:26px">' + c.qty + '×</span><span class="grow">' + lineLabel(c.itemId, c.varId) + '</span><span class="num">' + Z.money(Z.itemPrice(it, c.varId) * c.qty) + '</span></div>';
        }).join('') + '</div>' +
        // 3. bill
        '<div class="card flat" style="padding:0"><div class="c-lab" style="padding:12px 12px 0">Bill Details</div>' + bill([
          ['🍔 Food', Z.money(t.sub)], '-', ['Subtotal', Z.money(t.sub)],
          ['<span style="color:var(--a-hint)">Distance</span>', '<span style="color:var(--a-hint)">' + t.km.toFixed(1) + ' km</span>'],
          ['Delivery fee', Z.money(t.fee)], [t.feeNote, '', 'hint'], '-', ['Total', Z.money(t.total), 'total']
        ]) + '</div>' +
        // 4. meta / payment
        '<div class="card flat"><div class="b">Estimated delivery ~30–45 mins</div><div class="c-lab mt-12">Payment</div>' +
        '<button class="opt-card' + (ck.pay === 'cod' ? ' on' : '') + '" data-act="c.pay"><span class="radio"></span><span class="grow"><span class="b">Cash on Delivery</span><br><span class="t-cap">Pay when your order arrives</span></span><span style="font-size:20px">💵</span></button>' +
        '<div class="t-cap mt-8">You can also pay by UPI at delivery time.</div></div>' +
        // 5. notes
        '<div class="card flat"><div class="field"><label class="lbl">Notes for delivery boy <span class="opt">(optional)</span></label>' +
        '<textarea class="inp" rows="3" data-model="checkout.notes" placeholder="e.g. Call before reaching, leave at the gate">' + esc(ck.notes) + '</textarea></div></div>' +
        '</div><div class="sticky"><div class="row between"><div><div class="t-cap">Total</div><div class="t-price">' + Z.money(t.total) + '</div></div>' +
        '<button class="btn" style="min-width:190px"' + (ok ? ' data-act="c.place"' : ' disabled') + '>Place Order – ' + Z.money(t.total) + '</button></div></div>';
    },
    notes: {
      purpose: 'The key Zugo screen: choose where to deliver without needing a saved address, review the bill and place a Cash on Delivery order.',
      points: [
        'Zugo addition: four ways to set the drop location — 📍 Current location (one GPS fix, "✓ Pinned at … · accuracy 12 m"), 🗺️ Pick on map, 🔗 Paste Google Maps link (resolved by the resolve-maps-url edge function: expands maps.app.goo.gl and reads @lat,lng / q= / !3d!4d), 🏠 Saved address (one_place\'s only option, via My Addresses select mode).',
        'Zugo addition: "Address / flat / building" and "Landmark" are optional; recipient name and contact number are prefilled from the profile.',
        'Items card "Items (n)", Bill Details: Subtotal, Distance, Delivery fee with the one_place explanation ("Base ₹20 within 2 km" / "₹20 base + 1 km × ₹8"), Total.',
        '"Estimated delivery ~30–45 mins"; Payment: only "Cash on Delivery / Pay when your order arrives" is enabled (normal_online_enabled=false) plus "You can also pay by UPI at delivery time."',
        'Notes "Notes for delivery boy (optional)" → orders.notes.',
        'one_place states kept: "⚠️ Outside service area — Your address is x km away — we currently deliver up to 10 km." (red card) and orange "🕒 Orders are paused / {reason}" (shown live when the admin flips checkout_disabled) and "🛒 Minimum ₹100 required".',
        'Place Order → place_order returns {order_id, total, eta_minutes} → Order confirmed. Server re-reads live prices and re-checks radius, pause, hours and minimum.'
      ],
      data: ['compute-distance edge fn → {distanceKm, cacheKey}', 'resolve-maps-url edge fn (Zugo)', 'place_order(p_user_id, p_address_id | p_lat, p_lng, p_address_line, p_landmark, p_recipient_name, p_contact_number (Zugo), p_payment_method=cod, p_notes, p_distance_cache_key)', 'orders.delivery_lat/lng/address snapshot', 'app_config (normal_* fees, service_radius_km, checkout_disabled, minimum_cart_value)'],
      next: ['c-map', 'c-addresses', 'c-confirmed'], ref: OP + 'checkout_screen.dart, packages/core/lib/utils/delivery_pricing.dart'
    }
  });
  Z.on('c.method', function (el) {
    const m = el.getAttribute('data-m');
    Z.S.checkout.method = m;
    if (m === 'saved' && !Z.D.addresses.some(function (a) { return a.id === Z.S.checkout.addressId; })) Z.S.checkout.addressId = defaultAddr().id;
    Z.refresh();
    if (m === 'gps') Z.toast('Location captured');
  });
  Z.on('c.gps', function () { Z.toast('Location captured · accuracy 12 m'); });
  Z.on('c.paste', function () { Z.S.checkout.mapsUrl = 'https://maps.app.goo.gl/Qx7Ld2vKc9ZpR4mA8'; Z.S.checkout.linkParsed = true; Z.refresh(); Z.toast('Location found from link'); });
  Z.on('c.resolve', function () {
    if (!Z.S.checkout.mapsUrl.trim()) { Z.toast('Paste a Google Maps link first'); return; }
    Z.S.checkout.linkParsed = true; Z.refresh(); Z.toast('Location found from link');
  });
  Z.on('c.pay', function () { Z.S.checkout.pay = 'cod'; Z.refresh(); });
  Z.on('c.place', function () {
    const ck = Z.S.checkout;
    if (ck.method === 'map' && !X().mapPicked) { Z.toast('Pick your location on the map first'); return; }
    if (ck.method === 'link' && !ck.linkParsed) { Z.toast('Paste a Google Maps link first'); return; }
    if (ck.method !== 'saved' && (!ck.recipient.trim() || ck.phone.replace(/\D/g, '').length < 7)) { Z.toast('Add the recipient name and contact number'); return; }
    const o = Z.placeOrder();
    X().mapPicked = false; Z.S.checkout.linkParsed = false; Z.S.checkout.mapsUrl = '';
    Z.go('c-confirmed', { id: o.id }, { root: true });
  });

  Z.screen('customer', {
    id: 'c-map', group: 'Order', title: 'Pick on map', route: '/pick-location',
    render: function () {
      return Z.appBar({ back: true, title: 'Pick on Map' }) +
        '<div style="flex:1;position:relative;min-height:0"><div class="map tall"><div class="river"></div>' +
        '<div class="road" style="left:0;right:0;top:34%;height:10px"></div><div class="road" style="top:0;bottom:0;left:62%;width:9px"></div>' +
        '<span class="map-lbl" style="left:18%;top:28%">Kaloor</span><span class="map-lbl" style="left:66%;top:44%">Stadium Link Rd</span>' +
        '<div class="pin-shadow"></div><div class="pin">' + Z.icon('pin') + '</div>' +
        '<span class="c-osm">© OpenStreetMap contributors</span><button class="map-fab" data-act="c.gps" aria-label="My location" style="font-size:20px">🎯</button></div>' +
        '<div class="c-maphint">Drag the map to position the pin where you want delivery.</div></div>' +
        '<div class="c-mappanel"><div class="t-cap">Selected location</div><div class="t-sub b num mb-12">' + COORD.map + '</div>' +
        '<button class="btn block" data-act="c.useMap">Use this location</button></div>';
    },
    notes: {
      purpose: 'Drop a pin by dragging the map (core MapPickerScreen).',
      points: ['OpenStreetMap tiles via flutter_map, zoom 16, fixed 📍 in the centre, 🎯 re-centres on GPS at zoom 17.', 'Bottom panel "Selected location" with 6-decimal coordinates and [Use this location], which returns {lat, lng}.', 'Zugo: opened from checkout (method "Pick on map"), from the address form, and to confirm a pasted Google Maps link.'],
      data: ['none (client only); coordinates go to place_order / addresses'],
      next: ['c-checkout', 'c-addresses'], ref: 'one_place/packages/core/lib/ui/screens/map_picker_screen.dart'
    }
  });
  Z.on('c.useMap', function () {
    const x = X();
    const prev = Z.hist.customer[Z.hist.customer.length - 1];
    if (prev && prev.id === 'c-addresses') {
      if (x.af) x.af.pin = COORD.map;
      Z.back(); Z.toast('Location pinned'); if (x.af) openAddrSheet();
      return;
    }
    x.mapPicked = true; Z.S.checkout.method = 'map';
    if (prev && prev.id === 'c-checkout') Z.back(); else Z.go('c-checkout');
    Z.toast('Location pinned');
  });

  /* ---- addresses ---- */
  function openAddrSheet() {
    const f = X().af;
    const chip = function (l) { return '<button class="chip' + (f.label === l ? ' on' : '') + '" data-act="c.afLabel" data-l="' + l + '">' + l + '</button>'; };
    const inp = function (l, k, h, ta) {
      return '<div class="field"><label class="lbl">' + l + '</label>' + (ta ? '<textarea class="inp" rows="3" data-model="cx.af.' + k + '" placeholder="' + h + '">' + esc(f[k]) + '</textarea>'
        : '<input class="inp" data-model="cx.af.' + k + '" value="' + esc(f[k]) + '" placeholder="' + h + '">') + '</div>';
    };
    Z.sheet('New Address',
      '<div class="lbl mb-8">Label</div><div class="chips wrap mb-12">' + chip('Home') + chip('Office') + chip('Other') + '</div>' +
      inp('Recipient name *', 'recipient', 'Who should we deliver to?') + inp('Contact number *', 'phone', '10-digit mobile (e.g. 9876543210)') +
      inp('Address *', 'line', 'House #, street, area, city', true) +
      '<div class="lbl mt-12 mb-8">Location *</div><div class="btn-row"><button class="btn outline sm" data-act="c.afGps">📍 ' + (f.pin ? 'Re-capture' : 'Use current location') + '</button><button class="btn outline sm" data-act="c.afMap">🗺️ Pick on map</button></div>' +
      '<button class="btn outline sm block mt-8" data-act="c.afLink">🔗 Paste map link</button>' +
      (f.pin ? '<div class="c-ok mt-8">✓ Pinned at ' + f.pin + '</div>' : '<div class="hint mt-8">Required — used to calculate delivery distance and fee.</div>') +
      '<div class="row between mt-16"><span class="t-body">Set as default address</span><button class="tg' + (f.def ? ' on' : '') + '" data-act="c.afDef" aria-label="Default"></button></div>',
      '<div class="btn-row"><button class="btn outline" data-act="closeOv">Cancel</button><button class="btn" data-act="c.afSave">Save</button></div>');
  }
  Z.screen('customer', {
    id: 'c-addresses', group: 'Order', title: 'My addresses', route: '/addresses',
    render: function (p) {
      const list = Z.D.addresses;
      const body = list.length ? list.map(function (a) {
        return '<div class="card flat mb-12"><div class="row between"><div class="row"><span class="t-sub b">' + esc(a.label) + '</span>' + (a.isDefault ? '<span class="tag ok">Default</span>' : '') + '</div>' +
          '<button class="c-x" style="color:var(--a-error)" data-act="c.delAddrAsk" data-id="' + a.id + '" aria-label="Delete">✕</button></div>' +
          '<div class="t-cap">' + esc(a.recipient) + ' · ' + esc(a.phone) + '</div><div class="t-body">' + esc(a.line) + (a.landmark ? ' · ' + esc(a.landmark) : '') + '</div>' +
          '<div class="t-cap" style="color:var(--a-hint)">📍 ' + a.lat.toFixed(4) + ', ' + a.lng.toFixed(4) + '</div>' +
          (p.select ? '<button class="c-link mt-8" style="color:var(--brand-ink);font-size:13px" data-act="c.useAddr" data-id="' + a.id + '">Use this address →</button>'
            : a.isDefault ? '' : '<button class="c-link mt-8" style="color:var(--brand-ink);font-weight:500" data-act="c.setDef" data-id="' + a.id + '">Set as default</button>') + '</div>';
      }).join('') : empty('📍', 'No addresses yet', 'Add your first delivery address to speed up checkout.');
      return Z.appBar({ back: true, title: 'My Addresses', sub: p.select ? 'Choose where to deliver' : '' }) + '<div class="scroll">' + body + '</div>' +
        '<div class="sticky"><button class="btn block" data-act="c.addAddr">+ Add Address</button></div>';
    },
    notes: {
      purpose: 'Saved delivery addresses (one_place AddressesScreen). Optional in Zugo — checkout also works with GPS, a map pin or a pasted link.',
      points: ['Flat cards: label + green Default tag + red ✕ (confirm "Delete address"), recipient · contact, address, 📍 coords.', 'Normal mode: "Set as default". Select mode (from checkout "Change"): "Use this address →" sets it and returns.', 'Add sheet: label chips Home/Office/Other, Recipient name *, Contact number *, Address *, Location * (📍 Use current location / 🗺️ Pick on map), default toggle, [Cancel] [Save].', 'Zugo addition: 🔗 Paste map link in the location row (resolve-maps-url).', 'Toasts: "Address added", "Address deleted", "Set as default".'],
      data: ['addresses (label, address_line, landmark (Zugo), recipient_name, contact_number, lat, lng, is_default)', 'set_default_address(p_address_id)'],
      next: ['c-checkout', 'c-map'], ref: OP + 'addresses_screen.dart'
    }
  });
  Z.on('c.setDef', function (el) {
    const id = el.getAttribute('data-id');
    Z.D.addresses.forEach(function (a) { a.isDefault = a.id === id; });
    Z.refresh(); Z.toast('Set as default');
  });
  Z.on('c.useAddr', function (el) {
    const id = el.getAttribute('data-id');
    Z.D.addresses.forEach(function (a) { a.isDefault = a.id === id; });
    Z.S.checkout.method = 'saved'; Z.S.checkout.addressId = id;
    const prev = Z.hist.customer[Z.hist.customer.length - 1];
    if (prev && prev.id === 'c-checkout') Z.back(); else Z.go('c-checkout');
  });
  Z.on('c.delAddrAsk', function (el) {
    const a = Z.D.addresses.find(function (d) { return d.id === el.getAttribute('data-id'); });
    Z.dialog('<div class="dialog-t">Delete address</div><div class="dialog-d">Delete "' + esc(a.label) + '"? This can\'t be undone.</div>' +
      '<div class="btn-row"><button class="btn neutral" data-act="closeOv">Cancel</button><button class="btn danger" data-act="c.delAddr" data-id="' + a.id + '">Delete</button></div>');
  });
  Z.on('c.delAddr', function (el) {
    const id = el.getAttribute('data-id');
    const wasDef = (Z.D.addresses.find(function (a) { return a.id === id; }) || {}).isDefault;
    Z.D.addresses = Z.D.addresses.filter(function (a) { return a.id !== id; });
    if (wasDef && Z.D.addresses[0]) Z.D.addresses[0].isDefault = true;
    if (Z.S.checkout.addressId === id && Z.D.addresses[0]) Z.S.checkout.addressId = Z.D.addresses[0].id;
    Z.closeOv(); Z.refresh(); Z.toast('Address deleted');
  });
  Z.on('c.addAddr', function () {
    X().af = { label: 'Home', recipient: Z.D.customer.name, phone: Z.D.customer.phone, line: '', pin: '', def: !Z.D.addresses.length };
    openAddrSheet();
  });
  Z.on('c.afLabel', function (el) { X().af.label = el.getAttribute('data-l'); openAddrSheet(); });
  Z.on('c.afDef', function () { X().af.def = !X().af.def; openAddrSheet(); });
  Z.on('c.afGps', function () { X().af.pin = COORD.gps; openAddrSheet(); Z.toast('Location captured'); });
  Z.on('c.afMap', function () { Z.closeOv(); Z.go('c-map'); });
  Z.on('c.afLink', function () { X().af.pin = COORD.link; openAddrSheet(); Z.toast('Location found from link'); });
  Z.on('c.afSave', function () {
    const f = X().af;
    const miss = [];
    if (!f.recipient.trim()) miss.push('recipient name');
    if (f.phone.replace(/\D/g, '').length < 7) miss.push('contact number');
    if (!f.line.trim()) miss.push('address');
    if (!f.pin) miss.push('location');
    if (miss.length) { Z.toast('Still needed: ' + miss.join(', ')); return; }
    const ll = f.pin.split(',').map(Number);
    const id = 'ad' + (Date.now() % 100000);
    if (f.def) Z.D.addresses.forEach(function (a) { a.isDefault = false; });
    Z.D.addresses.push({ id: id, label: f.label, line: f.line, landmark: '', lat: ll[0], lng: ll[1], recipient: f.recipient, phone: f.phone, isDefault: f.def });
    X().af = null;
    Z.closeOv(); Z.refresh(); Z.toast('Address added');
  });

  Z.screen('customer', {
    id: 'c-confirmed', group: 'Order', title: 'Order confirmed', route: '/order-confirmed',
    defaults: function () { const o = Z.S.orders.find(function (x) { return x.mine; }); return { id: o ? o.id : 'ZG1042' }; },
    render: function (p) {
      const o = Z.order(p.id) || Z.S.orders.find(function (x) { return x.mine; });
      const t = Z.orderTotals(o);
      return Z.appBar({ title: 'Order Confirmed' }) + '<div class="scroll" style="padding-top:24px">' +
        '<div class="c-ck">' + Z.icon('check') + '</div><div class="t-heading t-center">Order placed successfully!</div>' +
        '<p class="t-body t-muted t-center" style="margin:4px 0 20px">Your order will arrive in about 30 min.</p>' +
        '<div class="card flat"><div class="t-cap">Order ID</div><div class="t-title num">#' + o.id + '</div><div class="hr soft"></div>' +
        '<dl class="kv"><dt>Subtotal</dt><dd>' + Z.money(t.sub) + '</dd><dt style="color:var(--a-hint)">Distance</dt><dd style="color:var(--a-hint)">' + o.km + ' km</dd>' +
        '<dt>Delivery fee</dt><dd>' + Z.money(t.fee) + '</dd></dl><div class="hr soft"></div>' +
        '<div class="bill-r" style="font-weight:700;font-size:15px"><span>Total</span><span>' + Z.money(t.total) + '</span></div>' +
        '<div class="t-cap mt-8">Payment: Cash on Delivery</div></div>' +
        '<button class="btn block mt-24"' + goA('c-order', { id: o.id }) + '>Track Order</button>' +
        '<button class="btn outline block mt-8" data-go="c-home" data-root>Continue Shopping</button></div>';
    },
    notes: {
      purpose: 'Receipt right after place_order succeeds (one_place OrderConfirmedScreen).',
      points: ['Green ✓, "Order placed successfully!", "Your order will arrive in about 30 min." (eta_minutes from place_order).', 'Receipt: Order ID, Subtotal, Distance, Delivery fee, Total, "Payment: Cash on Delivery".', 'Zugo change: [Track Order] opens this order\'s live tracking (one_place goes to the orders list). [Continue Shopping] → Home.', 'Back is intercepted and goes Home.', 'At the same moment admins and delivery boys get the push "🛒 New Order #…".'],
      data: ['place_order result {order_id, total, subtotal, delivery_fee, distance_km, eta_minutes}', 'fcm-order-notify (staff push)'],
      next: ['c-order', 'c-home'], ref: OP + 'order_confirmed_screen.dart'
    }
  });

  /* ======================= TRACK ======================= */
  function orderCard(o) {
    const t = Z.orderTotals(o);
    const names = o.items.map(function (l) { const it = Z.item(l.itemId); return it.name + (l.varId ? ' (' + Z.varName(it, l.varId) + ')' : ''); });
    const sum = names.slice(0, 2).join(' · ') + (names.length > 2 ? ' · +' + (names.length - 2) + ' more' : '');
    const active = Z.ACTIVE.indexOf(o.status) >= 0;
    const done = o.status === 'delivered' || o.status === 'cancelled';
    return '<div class="card flat tap mb-12"' + goA('c-order', { id: o.id }) + '>' +
      '<div class="row between top"><div><div class="t-sub b">Order #' + o.id + '</div><div class="t-cap">' + esc(orderDate(o)) + '</div></div>' + Z.badge(o.status) + '</div>' +
      '<div class="row mt-8" style="gap:12px"><div class="c-ov">' + o.items.slice(0, 3).map(function (l) { const it = Z.item(l.itemId); return Z.img(it.e, tintOf(it)); }).join('') + '</div>' +
      '<div class="t-body b clamp-2 grow">' + esc(sum) + '</div></div>' +
      '<div class="row between mt-8"><span class="t-cap">' + o.items.length + ' product' + (o.items.length > 1 ? 's' : '') + ' · ' + esc(Z.shop(o.shop).name) + '</span><span class="t-sub b">' + Z.money(t.total) + '</span></div>' +
      (active ? '<div class="t-cap b" style="color:var(--brand-ink)">ETA ~' + ETA[o.status] + ' min · ' + esc(Z.STATUS[o.status].cust) + '</div>' : '') +
      '<div class="t-cap" style="color:var(--a-hint)">Cash on Delivery</div>' +
      (o.notes ? '<div class="t-cap clamp-1">📝 ' + esc(o.notes) + '</div>' : '') +
      (done ? '<div class="row mt-8" style="justify-content:flex-end"><button class="c-obtn del" data-act="c.delOrdAsk" data-id="' + o.id + '">🗑️ Delete</button>' +
        '<button class="c-obtn again"' + goA('c-reorder', { id: o.id }) + '>🔁 Order Again</button></div>' : '') + '</div>';
  }
  Z.screen('customer', {
    id: 'c-orders', group: 'Track', title: 'My orders', route: '/orders',
    render: function () {
      const list = myOrders();
      return Z.shellBar() + '<div class="scroll"><div class="t-title mb-12">My Orders</div>' +
        (list.length ? list.map(orderCard).join('') : empty('🧾', 'No orders yet', 'Your order history will appear here once you place your first order.', '<button class="btn" data-go="c-home" data-root>Start Shopping</button>')) +
        '</div>' + Z.bottomNav('customer', 'c-orders');
    },
    notes: {
      purpose: 'Order history with active orders first (one_place OrdersScreen).',
      points: ['Card: "Order #id", date, status pill, overlapping thumbs, item summary, "N products", total, "ETA ~n min" while active, payment, 📝 notes.', 'Delivered / cancelled: [🗑️ Delete] (confirm "Delete this order?" — hides it only) and [🔁 Order Again].', 'Zugo addition: Orders is a bottom-nav tab, and the list updates live (Supabase Realtime on orders) instead of a 5-minute cache.', 'Zugo addition: Order Again works for food — it opens the "Prices updated" review first (one_place skips food lines with "food reorders are coming soon").', 'Empty: 🧾 "No orders yet" + [Start Shopping].'],
      data: ['get_customer_orders()', 'delete_customer_order(p_order_id)', 'Realtime: orders where user_id = auth.uid() (Zugo)'],
      next: ['c-order', 'c-reorder'], ref: OP + 'orders_screen.dart'
    }
  });
  Z.on('c.delOrdAsk', function (el) {
    const id = el.getAttribute('data-id');
    Z.dialog('<div class="dialog-t">Delete this order?</div><div class="dialog-d">Order #' + id + ' will be removed from your history. Your purchase record is kept with the store for support and refund purposes.</div>' +
      '<div class="btn-row"><button class="btn neutral" data-act="closeOv">Cancel</button><button class="btn danger" data-act="c.delOrd" data-id="' + id + '">Delete</button></div>');
  });
  Z.on('c.delOrd', function (el) {
    X().hidden[el.getAttribute('data-id')] = true;
    Z.closeOv();
    if (Z.cur.customer.id === 'c-order') Z.go('c-orders', {}, { root: true }); else Z.refresh();
    Z.toast('Order deleted');
  });

  function timeline(o) {
    const T = { placed: 'Order placed', assigned: 'Delivery partner assigned', checking: 'Preparing your food', delivering: 'Out for delivery', delivered: 'Delivered' };
    const rider = o.rider ? Z.staff(o.rider) : null;
    const shop = Z.shop(o.shop).name;
    const C = {
      placed: 'Cash on Delivery · ' + Z.money(Z.orderTotals(o).total),
      assigned: rider ? rider.name + ' will pick up from ' + shop : 'Waiting for a delivery partner',
      checking: shop + ' is preparing your order',
      delivering: rider ? rider.name + ' is on the way' : 'On the way to you',
      delivered: 'Enjoy your meal!'
    };
    const step = function (cls, st, title, cap, time) {
      return '<div class="tl-s ' + cls + '"><div class="tl-d">' + (cls === 'done' ? Z.icon('check') : cls === 'cancel' ? Z.icon('close', 'xs') : '') + '</div>' +
        '<div class="grow"><div class="row between"><span class="tl-t">' + title + '</span><span class="t-cap num">' + (time || '') + '</span></div><div class="tl-c">' + cap + '</div></div></div>';
    };
    if (o.status === 'cancelled') {
      return '<div class="tl">' + Z.FLOW.filter(function (st) { return histAt(o, st); }).map(function (st) { return step('done', st, T[st], C[st], histAt(o, st)); }).join('') +
        step('cancel', 'cancelled', '<span class="t-err">Cancelled</span>', esc(o.cancelReason || 'Cancelled'), histAt(o, 'cancelled')) + '</div>';
    }
    const cur = Z.FLOW.indexOf(o.status);
    return '<div class="tl">' + Z.FLOW.map(function (st, i) {
      const cls = i < cur || o.status === 'delivered' ? 'done' : i === cur ? 'now' : '';
      return step(cls, st, T[st], i <= cur ? C[st] : (st === 'delivered' ? 'Pay ' + Z.money(Z.orderTotals(o).total) + ' in cash or UPI' : ''), histAt(o, st));
    }).join('') + '</div>';
  }
  Z.screen('customer', {
    id: 'c-order', group: 'Track', title: 'Order detail & tracking', route: '/orders/:orderId',
    defaults: function () {
      const a = myOrders().find(function (o) { return Z.ACTIVE.indexOf(o.status) >= 0; });
      return { id: a ? a.id : 'ZG1042' };
    },
    render: function (p) {
      const o = Z.order(p.id);
      if (!o) return Z.appBar({ back: true, title: 'Order' }) + '<div class="scroll">' + empty('🔎', 'Couldn\'t find this order', 'Open My Orders to refresh the list.', '<button class="btn" data-go="c-orders" data-root>My Orders</button>') + '</div>';
      const t = Z.orderTotals(o), s = Z.shop(o.shop);
      const active = Z.ACTIVE.indexOf(o.status) >= 0;
      const cur = Z.FLOW.indexOf(o.status);
      const rider = o.rider ? Z.staff(o.rider) : null;
      const prog = o.status === 'cancelled' ? '' : '<div class="prog mt-12">' + Z.FLOW.map(function (st, i) {
        return '<i class="' + (i < cur || o.status === 'delivered' ? 'done' : i === cur ? 'now' : '') + '"></i>';
      }).join('') + '</div>';
      let foot = '';
      if (o.status === 'placed') foot = '<button class="btn danger-outline block" data-act="c.cancelAsk" data-id="' + o.id + '">Cancel order</button>';
      else if (!active) foot = '<button class="btn block"' + goA('c-reorder', { id: o.id }) + '>🔁 Order Again</button>';
      return Z.appBar({ back: true, title: 'Order #' + o.id }) + '<div class="scroll stack-12">' +
        // status card
        '<div class="card flat"><div class="row between"><span class="t-cap">Status</span>' + Z.badge(o.status) + '</div>' +
        '<div class="t-cap">Placed ' + esc(orderDate(o)) + '</div>' +
        (active ? '<div class="t-sub b" style="color:var(--brand-ink)">Estimated delivery ~' + ETA[o.status] + ' min</div>' : '') +
        (o.status === 'delivered' ? '<div class="t-body b t-ok">Delivered ' + histAt(o, 'delivered') + '</div>' : '') +
        (o.status === 'cancelled' ? '<div class="t-body b t-err">Cancelled ' + histAt(o, 'cancelled') + '</div>' : '') + prog + '</div>' +
        // timeline
        '<div class="card flat"><div class="c-lab mb-12">Order status</div>' + timeline(o) + '</div>' +
        (rider && o.status !== 'cancelled' ? '<div class="card flat row"><span class="avatar s48">' + initials(rider.name) + '</span><div class="grow"><div class="t-cap">Your delivery partner</div><div class="t-sub b">' + esc(rider.name) + '</div><div class="t-cap">🛵 ' + esc(rider.vehicle || '') + '</div></div>' +
          '<button class="btn outline sm" data-act="c.call" data-n="' + esc(rider.phone) + '">📞 Call</button></div>' : '') +
        (o.status === 'delivering' ? '<div class="map" style="height:150px"><div class="river"></div><div class="route" style="left:24%;top:70%;width:34%;transform:rotate(-38deg)"></div>' +
          '<div class="bike" style="left:18%;top:62%">' + Z.icon('bike') + '</div><div class="pin-shadow"></div><div class="pin">' + Z.icon('pin') + '</div>' +
          '<span class="map-lbl" style="left:8px;top:8px">' + esc(rider ? rider.name.split(' ')[0] : 'Rider') + ' · 1.1 km away</span></div>' : '') +
        // address
        '<div class="card flat"><div class="c-lab">Delivery address</div><div class="t-cap">' + esc(o.recipient || o.customer) + ' · 📞 ' + esc(o.cphone) + '</div>' +
        '<div class="t-body">' + esc(o.addr) + '</div><div class="row between"><span class="t-cap" style="color:var(--a-hint)">📍 ' + o.lat.toFixed(4) + ', ' + o.lng.toFixed(4) + '</span><span class="tag grey">' + esc(o.method) + '</span></div></div>' +
        '<div class="c-from">🍔 From ' + esc(s.name) + '</div>' +
        // items
        '<div class="card flat"><div class="c-lab">Items</div>' + o.items.map(function (l) {
          const it = Z.item(l.itemId);
          return '<div class="row" style="padding:8px 0;border-bottom:1px solid var(--a-divider)">' + Z.img(it.e, s.tint + ' s48') + '<div class="grow"><div class="t-body b clamp-2">' + esc(it.name) + '</div>' +
            '<div class="t-cap">' + (l.varId ? esc(Z.varName(it, l.varId)) + ' × ' + l.qty : l.qty + ' × ' + Z.money(l.unit)) + '</div></div><span class="t-sub b">' + Z.money(l.unit * l.qty) + '</span></div>';
        }).join('') + '</div>' +
        // bill
        '<div class="card flat" style="padding:0"><div class="c-lab" style="padding:12px 12px 0">Bill Details</div>' + bill([
          ['Items total', Z.money(t.sub)], '-', ['<span style="color:var(--a-hint)">Distance</span>', '<span style="color:var(--a-hint)">' + o.km + ' km</span>'],
          ['Delivery fee', Z.money(t.fee)], ['Slab fee + per-km charge, rounded to the nearest half-km.', '', 'hint'], '-', ['Total paid', Z.money(t.total), 'total'],
          ['* Prices reflect what you paid — current prices may differ.', '', 'hint']
        ]) + '</div>' +
        '<div class="card flat"><div class="c-lab">Payment</div><div class="t-body b">Cash on Delivery</div><div class="t-cap">Status: ' + (o.status === 'delivered' ? 'Confirmed' : o.status === 'cancelled' ? 'Cancelled' : 'Pending') + '</div></div>' +
        (o.notes ? '<div class="card flat"><div class="c-lab">Notes</div><div class="t-body">📝 ' + esc(o.notes) + '</div></div>' : '') +
        '<div class="card flat"><div class="t-sub b">Order receipt</div><div class="t-cap mb-8">Save a PDF bill of this order. The receipt shows the current status, so you can download any time.</div>' +
        '<button class="btn outline block" data-act="c.receipt">📄 Download Receipt</button></div>' +
        '<div class="card flat"><div class="t-sub b">Need help with this order?</div><div class="t-cap mb-8">Reach out to our support team — we usually reply quickly.</div>' +
        '<button class="btn outline block" data-act="c.support" data-id="' + o.id + '">Contact Support</button></div>' +
        '</div>' + (foot ? '<div class="sticky">' + foot + '</div>' : '');
    },
    notes: {
      purpose: 'Everything about one order, with live tracking (one_place OrderDetailScreen + Zugo tracking).',
      points: [
        'Zugo addition: live status card (pill, ETA, 5-step progress bar) and a vertical timeline Placed → Assigned → Preparing → Out for delivery → Delivered with the time of each step from order_status_history; cancelled shows a red step with the reason.',
        'Zugo addition: delivery partner card (name, vehicle, 📞 Call) once assigned, and a map strip with the rider while "Out for delivery".',
        'Updates arrive through Supabase Realtime on orders + order_status_history and a push for every status change (try changing the status in the Operator tabs — this screen follows).',
        'Kept from one_place: address snapshot with 📍 coords, "From {restaurant}", items, Bill Details "Total paid" + "* Prices reflect what you paid — current prices may differ.", Payment, Notes, [📄 Download Receipt], [Contact Support] sheet.',
        'Sticky: while "Order Placed" → [Cancel order] (confirm; update_order_status → cancelled, allowed only before assignment). Delivered/cancelled → [🔁 Order Again].'
      ],
      data: ['get_customer_orders / orders + order_items', 'get_order_status_history (customer-safe version, Zugo)', 'update_order_status(p_order_id, cancelled)', 'Realtime channel orders:id=eq.{id} (Zugo)'],
      next: ['c-reorder', 'c-orders'], ref: OP + 'order_detail_screen.dart, utils/receipt_generator.dart'
    }
  });
  Z.on('c.receipt', function () { Z.toast('Receipt ready — tap "Save as PDF" or print'); });
  Z.on('c.support', function (el) {
    const id = el.getAttribute('data-id');
    Z.sheet('Contact Support', '<div class="t-cap mb-12">About order #' + id + '</div><div class="list">' +
      '<button class="li" data-act="c.wa"><span class="li-ic" style="background:#e8f5e9">💬</span><span class="grow"><span class="li-t">Chat on WhatsApp</span><br><span class="li-s">Open a WhatsApp chat with our support team</span></span></button>' +
      '<button class="li" data-act="c.call"><span class="li-ic">📞</span><span class="grow"><span class="li-t">Call</span><br><span class="li-s">Place a phone call to support</span></span></button></div>');
  });
  Z.on('c.cancelAsk', function (el) {
    const id = el.getAttribute('data-id');
    Z.dialog('<div class="dialog-t">Cancel this order?</div><div class="dialog-d">Order #' + id + ' hasn\'t been picked up yet, so you can cancel it for free.</div>' +
      '<div class="btn-row"><button class="btn neutral" data-act="closeOv">Keep order</button><button class="btn danger" data-act="c.cancel" data-id="' + id + '">Cancel order</button></div>');
  });
  Z.on('c.cancel', function (el) {
    const o = Z.order(el.getAttribute('data-id'));
    Z.closeOv();
    if (!o || o.status !== 'placed') { Z.toast('This order can no longer be cancelled'); Z.refresh(); return; }
    Z.setStatus(o.id, 'cancelled', 'Cancelled by customer', 'customer');
    Z.refresh(); Z.toast('Order cancelled');
  });

  Z.screen('customer', {
    id: 'c-reorder', group: 'Track', title: 'Order again: prices updated', route: '/orders/:orderId/reorder',
    defaults: function () { return { id: 'ZG1042' }; },
    render: function (p) {
      const o = Z.order(p.id || 'ZG1042');
      const rows = Z.recheck(o);
      const okRows = rows.filter(function (r) { return r.state !== 'item_unavailable' && r.state !== 'restaurant_closed'; });
      const oldSub = okRows.reduce(function (a, r) { return a + r.line.unit * r.line.qty; }, 0);
      const skipped = rows.length - okRows.length;
      const newSub = okRows.reduce(function (a, r) { return a + r.live * r.line.qty; }, 0);
      const changed = rows.some(function (r) { return r.state !== 'ok'; });
      const list = rows.map(function (r) {
        const l = r.line, it = r.item, bad = r.state === 'item_unavailable' || r.state === 'restaurant_closed';
        let right;
        if (bad) right = '<span class="tag err">' + (r.state === 'restaurant_closed' ? 'Restaurant closed' : 'No longer available') + '</span>';
        else {
          const d = (r.live - l.unit) * l.qty;
          right = (d ? '<div class="pc-old">' + Z.money(l.unit * l.qty) + '</div>' : '') + '<div class="pc-new">' + Z.money(r.live * l.qty) + '</div>' +
            (d > 0 ? '<div class="pc-up">▲ ' + Z.money(d) + ' more</div>' : d < 0 ? '<div class="pc-down">▼ ' + Z.money(-d) + ' cheaper</div>' : '<div class="t-cap">Same price</div>');
        }
        return '<div class="price-change"' + (bad ? ' style="opacity:.55"' : '') + '>' + Z.img(it.e, tintOf(it) + ' s40') +
          '<div class="grow"><div class="t-body b clamp-1">' + esc(it.name) + '</div><div class="t-cap">' + (l.varId ? esc(Z.varName(it, l.varId)) + ' · ' : '') + 'Qty ' + l.qty + '</div></div>' +
          '<div style="text-align:right">' + right + '</div></div>';
      }).join('');
      const n = okRows.length;
      return Z.appBar({ back: true, title: changed ? 'Prices updated' : 'Order again', sub: 'Order #' + o.id + ' · ' + esc(Z.shop(o.shop).name) }) +
        '<div class="scroll"><div class="note info">' + Z.icon('info') + '<div>We checked today\'s menu for this order. Prices and availability can change since ' + esc(orderDate(o)) + ' — review before adding to your cart.</div></div>' +
        '<div class="card mt-12" style="padding:4px 12px">' + list + '</div>' +
        '<div class="card flat mt-12"><div class="bill-r"><span class="k">Last time (same ' + okRows.length + ' item' + (okRows.length === 1 ? '' : 's') + ')</span><span class="t-strike">' + Z.money(oldSub) + '</span></div>' +
        '<div class="bill-r total"><span class="k">Today\'s subtotal</span><span>' + Z.money(newSub) + '</span></div>' +
        (newSub !== oldSub ? '<div class="t-cap ' + (newSub > oldSub ? 'pc-up' : 'pc-down') + '" style="text-align:right">' + (newSub > oldSub ? '▲ ' + Z.money(newSub - oldSub) + ' more than last time' : '▼ ' + Z.money(oldSub - newSub) + ' less than last time') + '</div>' : '') +
        (skipped ? '<div class="t-cap t-err mt-4">' + skipped + ' item' + (skipped > 1 ? 's' : '') + ' can\'t be added and will be skipped.</div>' : '') +
        '<div class="t-cap" style="color:var(--a-hint)">Delivery fee is worked out again at checkout for your current location.</div></div></div>' +
        '<div class="sticky"><button class="btn block"' + (n ? ' data-act="c.reorderAdd" data-id="' + o.id + '"' : ' disabled') + '>' + (n ? 'Add ' + n + ' item' + (n > 1 ? 's' : '') + ' to cart' : 'Nothing available to add') + '</button></div>';
    },
    notes: {
      purpose: 'Zugo addition: "Order Again" for food with a live price and availability check before anything lands in the cart.',
      points: ['Each line compares the price paid (order_items.unit_price) with today\'s live price: old struck through, new price, "▲ ₹20 more" / "▼ ₹x cheaper" / "Same price".', 'Lines whose dish, size or restaurant is off are greyed "No longer available" / "Restaurant closed" and skipped.', 'Totals: last time vs today\'s subtotal. [Add N items to cart] replaces the cart and opens it with the toast "Added N items · M unavailable".', 'Demo order ZG1042: Chicken Biryani Full went ₹220 → ₹240, Paneer Tikka is switched off.', 'one_place cannot reorder food at all (lines are skipped: "food reorders are coming soon").'],
      data: ['reorder_preview(p_order_id) → lines {old_unit_price, new_unit_price, delta, status: ok | price_up | price_down | item_unavailable | variation_removed | restaurant_closed}, {old_subtotal, new_subtotal} (new RPC)', 'reorder_to_cart(p_order_id, p_commit=true) → upserts available lines into cart_items'],
      next: ['c-cart'], ref: 'one_place orders_screen.dart performOrderAgain + 00025_bulk_add_to_cart.sql (grocery only)'
    }
  });
  Z.on('c.reorderAdd', function (el) {
    const o = Z.order(el.getAttribute('data-id'));
    const rows = Z.recheck(o);
    Z.S.cart = []; Z.S.cartShop = null;
    let added = 0, skipped = 0;
    rows.forEach(function (r) {
      if (r.state === 'item_unavailable' || r.state === 'restaurant_closed') { skipped++; return; }
      if (Z.cartAdd(r.line.itemId, r.line.varId || null, r.line.qty)) added++; else skipped++;
    });
    Z.go('c-cart', {}, { replace: true });
    Z.toast('Added ' + added + ' item' + (added === 1 ? '' : 's') + (skipped ? ' · ' + skipped + ' unavailable' : ''));
  });

  /* ======================= ACCOUNT ======================= */
  Z.screen('customer', {
    id: 'c-notifications', group: 'Account', title: 'Notifications inbox', route: '/notifications',
    render: function () {
      const list = Z.S.inbox;
      return Z.appBar({ back: true, title: 'Notifications' }) + '<div class="scroll">' +
        (list.length ? '<div class="list">' + list.map(function (n) {
          return '<button class="li"' + (n.go ? goA(n.go, n.p) : '') + '><span class="li-ic">🔔</span><span class="grow"><span class="li-t">' + esc(n.t) + '</span><br><span class="li-s">' + esc(n.b) + '</span></span><span class="t-cap" style="white-space:nowrap">' + esc(n.ago) + '</span></button>';
        }).join('') + '</div>' : empty('🔔', 'No notifications yet', 'Order updates and offers will show up here.')) + '</div>';
    },
    notes: {
      purpose: 'Zugo addition: a list of every push the customer received, so an order update missed on the lock screen is still one tap away.',
      points: ['Filled by the same server event that sends the push (order status changes, admin broadcasts).', 'Tapping an order update opens that order\'s tracking screen.', 'one_place has no inbox and no tap handling for pushes.'],
      data: ['customer_notifications table (Zugo): user_id, title, body, order_id, created_at, read_at', 'fcm-order-notify (extended to customers)'],
      next: ['c-order'], ref: 'new in Zugo'
    }
  });
  Z.screen('customer', {
    id: 'c-notif-settings', group: 'Account', title: 'Notification settings', route: '/notification-settings',
    render: function () {
      const on = X().notifOn;
      return Z.appBar({ back: true, title: 'Notification Settings' }) + '<div class="scroll"><div class="card flat row">' +
        '<div class="grow"><div class="t-sub b">Receive notifications</div><div class="t-cap">' + (on ? 'Order updates and offers will appear on this device.' : 'This device is unsubscribed. You can turn it back on anytime.') + '</div></div>' +
        '<button class="tg lg' + (on ? ' on' : '') + '" data-act="c.notifTg" aria-label="Receive notifications"></button></div></div>';
    },
    notes: {
      purpose: 'Turn pushes on or off for this device (one_place NotificationSettingsScreen).',
      points: ['Off deletes this device\'s row in device_tokens; on registers it again.', 'Toasts "Notifications enabled" / "Notifications turned off for this device".', 'Dropped: the Tamil/Malayalam notification language card (Zugo v1 is English only).'],
      data: ['upsert_device_token', 'device_tokens delete'],
      next: [], ref: OP + 'notification_settings_screen.dart'
    }
  });
  Z.on('c.notifTg', function () { const x = X(); x.notifOn = !x.notifOn; Z.refresh(); Z.toast(x.notifOn ? 'Notifications enabled' : 'Notifications turned off for this device'); });
  Z.screen('customer', {
    id: 'c-feedback', group: 'Account', title: 'Feedback', route: '/feedback',
    render: function () {
      const img = X().fbImg;
      return Z.appBar({ back: true, title: 'Send Feedback' }) + '<div class="scroll">' +
        '<p class="t-body t-muted" style="margin-top:0">Tell us what you like, what bothers you, or what you wish was different.</p>' +
        '<div class="field"><label class="lbl">Title</label><input class="inp" placeholder="e.g. Loved the biryani packing"></div>' +
        '<div class="field"><label class="lbl">Description</label><textarea class="inp" style="height:130px" placeholder="Share the details…"></textarea></div>' +
        '<div class="field"><label class="lbl">Image <span class="opt">(optional)</span></label>' +
        (img ? Z.img('🖼️', 'grey', '') .replace('class="img grey"', 'class="img grey" style="width:100%;aspect-ratio:16/9;font-size:40px"') +
          '<div class="row mt-4"><button class="c-link" style="color:var(--a-error-ink)" data-act="c.fbImg">Remove</button><button class="c-link" style="color:var(--brand-ink)" data-act="c.fbImg" data-keep="1">Change</button></div>'
          : '<div class="upl" style="aspect-ratio:16/9" data-act="c.fbImg">' + Z.icon('image') + 'Tap to attach image</div>') + '</div></div>' +
        '<div class="sticky"><button class="btn success block" data-act="c.fbSend">Submit</button></div>';
    },
    notes: {
      purpose: 'Send feedback to the Zugo team (one_place FeedbackScreen).',
      points: ['Title, Description, optional 16:9 image ("Tap to attach image", then Remove / Change).', '[Submit] in green → toast "Feedback submitted. Thank you!".', 'Admins read these in Operator (feedback list).'],
      data: ['submit_feedback(p_title, p_description, p_image_url)', 'storage bucket feedback-images'],
      next: [], ref: OP + 'feedback_screen.dart'
    }
  });
  Z.on('c.fbImg', function (el) { const x = X(); x.fbImg = el.getAttribute('data-keep') ? true : !x.fbImg; Z.refresh(); });
  Z.on('c.fbSend', function () { X().fbImg = false; Z.toast('Feedback submitted. Thank you!'); Z.back(); });
})();
