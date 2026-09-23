/* ==========================================================================
   Zugo Operator — admin role screens (a-*), actions (a.*)
   Mirrors one_place apps/operator_app (mobile shell), trimmed to food only.
   ========================================================================== */
(function () {
  'use strict';
  const Z = window.Z;
  const E = Z.esc;
  const OP = '/Users/macsolve/projects/one_place/apps/operator_app/lib/screens/';

  Z.css('admin', [
    '.a-h{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:2px 0 10px}',
    '.a-h h2{margin:0;font-size:22px;font-weight:600}',
    '.phone .a-link{background:none;border:0;padding:0;color:var(--brand);font-size:12px;font-weight:500;cursor:pointer;font-family:inherit}',
    '.a-cap{font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--food-ink);margin:18px 0 8px}',
    '.a-cap:first-child{margin-top:4px}',
    '.chip.a-or{background:#ff9800;color:#fff;border-color:#ff9800}',
    '.a-stats{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}',
    '.a-stat{background:var(--a-bg2);border-radius:var(--r-md);padding:10px}',
    '.a-stat .l{font-size:11px;color:var(--a-text2);line-height:1.3}',
    '.a-stat .v{font-size:18px;font-weight:600;margin-top:2px;font-variant-numeric:tabular-nums}',
    '.a-stat .v.ok{color:var(--a-success-ink)}.a-stat .v.warn{color:#ef6c00}',
    '.a-toggle-h{display:flex;align-items:center;gap:6px;cursor:pointer;margin:12px 0 4px;background:none;border:0;padding:0;width:100%;font-family:inherit;color:inherit}',
    '.a-toggle-h b{font-size:15px;font-weight:500;flex:1;text-align:left}',
    '.a-alert{display:flex;align-items:center;gap:10px;background:var(--brand-light);color:var(--brand-ink);border:1px solid var(--brand);border-radius:var(--r-sm);padding:10px 12px;font-size:12.5px;font-weight:600;margin:10px 0;cursor:pointer}',
    '.a-oc-b{display:grid;grid-template-columns:5fr 6fr;gap:10px;margin-top:10px;padding-top:10px;border-top:1px solid var(--a-divider);font-size:12px;line-height:1.5}',
    '.a-oc-b .c{min-width:0}',
    '.a-oc-b .c > div{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.a-oc-b .m{color:var(--a-text2)}',
    '.a-cta{display:flex;gap:6px;margin-top:10px;justify-content:flex-end}',
    '.a-cta-b{height:28px;padding:0 10px;border-radius:6px;border:1px solid var(--brand);background:#fff;color:var(--brand);font-size:11.5px;font-weight:600;cursor:pointer;white-space:nowrap}',
    '.a-cta-b:hover{background:var(--brand-light)}',
    '.a-cta-b.pri{background:var(--a-success);border-color:var(--a-success);color:#fff}',
    '.a-asg{display:inline-flex;align-items:center;gap:4px;border-radius:6px;padding:2px 8px;font-size:11.5px;font-weight:600;cursor:pointer;max-width:100%;white-space:nowrap}',
    '.a-asg.on{background:var(--brand-light);color:var(--brand-ink)}',
    '.a-asg.off{background:rgba(255,152,0,.12);color:#ef6c00}',
    '.a-asg[data-act]::after{content:" ▾"}',
    '.a-oc-tot{font-size:17px;font-weight:700;font-variant-numeric:tabular-nums}',
    '.a-boy{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--a-divider)}',
    '.a-boy:last-child{border-bottom:0}',
    '.a-dot{width:10px;height:10px;border-radius:50%;background:var(--a-hint);flex-shrink:0}',
    '.a-dot.on{background:var(--a-success)}',
    '.a-srow{display:flex;align-items:center;gap:10px;padding:12px 4px;border-bottom:1px solid var(--a-divider);cursor:pointer;width:100%;background:none;border-left:0;border-right:0;border-top:0;font-family:inherit;font-size:14px;text-align:left}',
    '.a-srow:last-child{border-bottom:0}',
    '.a-big{font-size:14px;padding:4px 12px}',
    '.a-t64{width:64px;height:64px;font-size:30px}',
    '.a-t48{width:48px;height:48px;font-size:22px}',
    '.a-card{background:#fff;border:1px solid var(--a-border);border-radius:var(--r-sm);padding:12px;cursor:pointer}',
    '.a-card + .a-card{margin-top:10px}',
    '.a-card.dim{opacity:.55}',
    '.a-tx{background:none;border:0;padding:0 0 0 10px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit}',
    '.a-tx.b{color:var(--brand)}.a-tx.g{color:var(--a-success-ink)}.a-tx.r{color:var(--a-error-ink)}',
    '.tg.a-food.on{background:var(--food)}',
    '.tg.a-red.on{background:var(--a-error)}',
    '.a-fab{width:56px;height:56px;padding:0;border-radius:50%;justify-content:center;background:var(--food);font-size:28px;font-weight:400;box-shadow:0 4px 14px rgba(0,147,67,.4)}',
    '.a-fab.nonav{bottom:20px}',
    '.a-grp{font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--food-ink);margin:16px 0 8px}',
    '.a-grp:first-child{margin-top:2px}',
    '.a-tgrow{display:flex;align-items:center;gap:10px;font-size:13px}',
    '.a-var{background:var(--a-bg2);border:1.5px solid transparent;border-radius:var(--r-md);padding:10px}',
    '.a-var.def{border-color:var(--food)}',
    '.a-var + .a-var{margin-top:8px}',
    '.phone .a-pill{flex:1;height:40px;border-radius:var(--r-sm);border:1px solid var(--a-border);background:#fff;font-size:13px;font-weight:500;cursor:pointer;font-family:inherit;color:var(--a-text2)}',
    '.phone .a-pill.on{background:var(--food-light);border-color:var(--food);color:var(--food-ink);font-weight:600}',
    '.a-2{display:grid;grid-template-columns:1fr 1fr;gap:8px;align-items:end}',
    '.a-2 .field + .field{margin-top:0}',
    '.a-demo{margin-top:22px;border:1.5px dashed var(--a-border);border-radius:var(--r-md);padding:12px;background:var(--a-bg2)}',
    '.a-login{padding:28px 24px 20px}',
    '.a-logo{width:56px;height:56px;border-radius:12px;background:var(--brand);color:#fff;display:grid;place-items:center;font-size:26px;font-weight:700;margin-bottom:18px}',
    '.a-kd{font-size:11px;margin-top:2px}.a-kd.up{color:var(--a-success-ink)}.a-kd.down{color:var(--a-error-ink)}',
    '.a-chart-t{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px}',
    '.a-chart-t b{font-size:13px;font-weight:600}.a-chart-t span{font-size:11px;color:var(--a-text2)}',
    '.chart svg .grid{stroke:var(--a-divider);stroke-width:1}',
    '.chart svg .axis{stroke:var(--a-border);stroke-width:1}',
    '.chart svg .hit{fill:transparent;cursor:crosshair}',
    '.chart svg .hit:hover + .tip, .chart svg g.pt:hover .tip{opacity:1}',
    '.chart svg .tip{opacity:0;pointer-events:none;transition:opacity .1s}',
    '.chart svg .tip rect{fill:#212121}.chart svg .tip text{fill:#fff;font-size:9px;font-weight:600}',
    '.chart svg g.pt:hover .mk{r:5}',
    '.a-tblw{border:1px solid var(--a-border);border-radius:var(--r-sm);overflow:hidden}',
    '.a-tblw .tbl td,.a-tblw .tbl th{padding:8px 6px}',
    '.a-tile{display:flex;align-items:center;gap:12px;background:var(--a-bg2);border-radius:var(--r-md);padding:12px;cursor:pointer;width:100%;border:0;font-family:inherit;text-align:left;color:inherit}',
    '.a-tile + .a-tile{margin-top:8px}',
    '.a-tile .em{font-size:22px;width:36px;text-align:center;flex-shrink:0}',
    '.a-tile .t{font-size:14px;font-weight:500}.a-tile .s{font-size:12px;color:var(--a-text2)}',
    '.a-tile .chv{color:var(--a-hint);font-size:20px}',
    '.a-cfg{background:#fff;border:1px solid var(--a-border);border-radius:var(--r-sm);padding:14px}',
    '.a-cfg + .a-cfg{margin-top:12px}',
    '.a-cfg h4{margin:0;font-size:15px;font-weight:600}',
    '.a-cfg .hint{margin:2px 0 10px}',
    '.a-ex{background:var(--food-light);color:var(--food-ink);border-radius:var(--r-sm);padding:8px 10px;font-size:12px;font-weight:600;margin-top:12px;font-variant-numeric:tabular-nums}',
    '.a-ban{background:var(--a-bg2);border-radius:var(--r-md);overflow:hidden}',
    '.a-ban + .a-ban{margin-top:10px}',
    '.a-ban .img{width:100%;height:auto;aspect-ratio:16/9;font-size:50px;border-radius:0}',
    '.a-ban .img .bt{position:absolute;left:12px;bottom:10px;right:12px;text-align:left;font-size:13px;font-weight:700;color:#212121;line-height:1.3}',
    '.a-ban .img .bt small{display:block;font-size:10px;font-weight:600;color:var(--brand-ink)}',
    '.a-pv{background:#fff;border-radius:14px;box-shadow:var(--sh-elev);padding:10px 12px;display:flex;gap:10px;border:1px solid var(--a-border)}',
    '.a-pv .ic0{width:28px;height:28px;border-radius:50%;flex-shrink:0}',
    '.a-pv .ap{font-size:10px;color:var(--a-text2);display:flex;justify-content:space-between}',
    '.a-pv .pt{font-size:13px;font-weight:600}.a-pv .pb{font-size:12px;color:var(--a-text2)}',
    '.a-cal{height:150px}',
    '.a-cal .ring{position:absolute;left:50%;top:50%;border-radius:50%;border:2px dashed var(--brand);background:rgba(0,122,56,.08);transform:translate(-50%,-50%)}',
    '.a-hist{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--a-divider)}',
    '.a-hist:last-child{border-bottom:0}',
    '.a-hist .d{width:10px;height:10px;border-radius:50%;margin-top:5px;flex-shrink:0}',
    '.a-mtag{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;padding:2px 8px;border-radius:6px;background:var(--food-light);color:var(--food-ink)}',
    'textarea.inp{height:auto;padding:10px 12px;resize:none;font-family:inherit;line-height:1.45}',
    '.a-err{margin-bottom:12px}'
  ].join('\n'));

  /* ---------------- helpers ---------------- */
  const S = function () { return Z.S; };
  function st(key, def) { if (Z.S[key] === undefined) Z.S[key] = def; return Z.S[key]; }
  function initials(n) { return String(n).split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase(); }
  function tg(on, act, attrs, cls) { return '<button class="tg' + (cls ? ' ' + cls : '') + (on ? ' on' : '') + '" data-act="' + act + '" ' + (attrs || '') + ' aria-pressed="' + !!on + '"></button>'; }
  function field(label, inner, hint) { return '<div class="field"><label class="lbl">' + label + '</label>' + inner + (hint ? '<div class="hint">' + hint + '</div>' : '') + '</div>'; }
  function inp(model, ph, type, extra) { return '<input class="inp" data-model="' + model + '" value="' + E(Z.getPath(Z.S, model) == null ? '' : Z.getPath(Z.S, model)) + '" placeholder="' + E(ph || '') + '"' + (type ? ' type="' + type + '"' : '') + (extra || '') + '>'; }
  function area(model, ph, rows) { return '<textarea class="inp" rows="' + (rows || 2) + '" data-model="' + model + '" placeholder="' + E(ph || '') + '">' + E(Z.getPath(Z.S, model) || '') + '</textarea>'; }
  function setPath(obj, path, val) { const p = path.split('.'); let o = obj; for (let i = 0; i < p.length - 1; i++) o = o[p[i]]; o[p[p.length - 1]] = val; }
  function ago(o) { return o.placedAgo || o.date || ''; }
  function daysAgo(o) {
    if (!o.date || o.date.indexOf('Today') === 0) return 0;
    const m = /(\d+) Sep/.exec(o.date);
    return m ? 23 - Number(m[1]) : 30;
  }
  function email(o) {
    if (o.customer === Z.D.customer.name) return Z.D.customer.email;
    return o.customer.toLowerCase().replace(/[^a-z]+/g, '.').replace(/\.$/, '') + '@gmail.com';
  }
  function itemsCount(o) { return o.items.reduce(function (a, l) { return a + l.qty; }, 0); }
  function riderName(o) { return o.rider ? Z.staff(o.rider).name : null; }
  function isNew(o) { return o.status === 'placed'; }
  function fmt12(t) {
    if (!t) return '';
    const p = t.split(':'); let h = Number(p[0]); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
    return h + ':' + p[1] + ' ' + ap;
  }
  function to24(s) {
    const m = /(\d+):(\d+)\s*(AM|PM)/.exec(s || ''); if (!m) return '';
    let h = Number(m[1]) % 12; if (m[3] === 'PM') h += 12;
    return String(h).padStart(2, '0') + ':' + m[2];
  }
  function priceLine(it) {
    if (!it.vars) return Z.money(it.price);
    const ps = it.vars.map(function (v) { return v.price; });
    return Z.money(Math.min.apply(null, ps)) + '–' + Z.money(Math.max.apply(null, ps)) + ' · ' + it.vars.length + ' sizes';
  }
  function liveItems(shopId) { return Z.D.items.filter(function (i) { return i.shop === shopId && !i.deleted; }); }
  function shopTint(s) { return s.tint || 'sky'; }
  function confirmDlg(title, msg, act, btn, attrs, danger) {
    Z.dialog('<div class="dialog-t">' + title + '</div><div class="dialog-d">' + msg + '</div>' +
      '<div class="btn-row"><button class="btn neutral" data-act="closeOv">Cancel</button><button class="btn' + (danger ? ' danger' : '') + '" data-act="' + act + '" ' + (attrs || '') + '>' + btn + '</button></div>');
  }
  const DP = function (o) { return "data-p='" + JSON.stringify(o) + "'"; };

  /* ---------------- date ranges (orders screen) ---------------- */
  const RANGES = [['today', 'Today', 0, 0], ['yesterday', 'Yesterday', 1, 1], ['7d', 'Last 7 days', 0, 6], ['30d', 'Last 30 days', 0, 29], ['custom', 'Custom', 0, 13]];
  function rangeDef() { const k = st('aRange', 'today'); return RANGES.find(function (r) { return r[0] === k; }) || RANGES[0]; }
  function rangeLabel() { const r = rangeDef(); return r[0] === 'custom' ? (st('aCustomLabel', '10 Sep 2026 – 23 Sep 2026')) : r[1]; }
  function inRange(o) { const r = rangeDef(); const d = daysAgo(o); return d >= r[2] && d <= r[3]; }

  const FILTERS = [['all', 'All'], ['active', 'Active'], ['placed', 'Order Placed'], ['assigned', 'Assigned'], ['checking', 'Preparing'], ['delivering', 'Out for delivery'], ['delivered', 'Delivered'], ['cancelled', 'Cancelled']];
  function matchFilter(o, f) { if (f === 'all') return true; if (f === 'active') return Z.ACTIVE.indexOf(o.status) >= 0; return o.status === f; }

  function stats() {
    const rs = Z.S.orders.filter(inRange);
    const tot = function (o) { return Z.orderTotals(o).total; };
    const sum = function (arr) { return arr.reduce(function (a, o) { return a + tot(o); }, 0); };
    const del = rs.filter(function (o) { return o.status === 'delivered'; });
    return {
      orders: rs.length,
      revenue: sum(del),
      codPending: sum(rs.filter(function (o) { return Z.ACTIVE.indexOf(o.status) >= 0; })),
      codCollected: sum(del),
      active: Z.S.orders.filter(function (o) { return Z.ACTIVE.indexOf(o.status) >= 0; }).length,
      unassigned: Z.S.orders.filter(function (o) { return o.status === 'placed'; }).length,
      online: Z.D.staff.filter(function (s) { return s.role === 'delivery' && s.online && s.active; }).length
    };
  }

  /* ---------------- order card ---------------- */
  function orderCard(o) {
    const shop = Z.shop(o.shop);
    const r = o.rider ? Z.staff(o.rider) : null;
    const terminal = o.status === 'delivered' || o.status === 'cancelled';
    return '<div class="oc' + (isNew(o) ? ' new' : '') + '" data-go="a-order" ' + DP({ id: o.id }) + '>' +
      '<div class="oc-h"><div><div class="oc-id">#' + o.id + ' 🍔</div><div class="oc-m">' + E(ago(o)) + ' · ' + E(shop.name) + '</div></div>' +
      '<div class="row" style="gap:8px">' + (terminal ? Z.badge(o.status) : '<span data-act="a.statusSheet" data-id="' + o.id + '">' + Z.badge(o.status, true) + '</span>') +
      '<span class="a-oc-tot">' + Z.money(Z.orderTotals(o).total) + '</span></div></div>' +
      '<div class="a-oc-b"><div class="c">' +
      '<div>👤 <b>' + E(o.recipient || o.customer) + '</b></div><div class="m">' + E(o.cphone) + '</div>' +
      '<div>📦 ' + itemsCount(o) + ' product' + (itemsCount(o) > 1 ? 's' : '') + '</div>' +
      '<div>💵 COD · ' + (o.status === 'delivered' ? 'collected' : o.status === 'cancelled' ? 'void' : 'pending') + '</div>' +
      (o.notes ? '<div class="m">📝 ' + E(o.notes) + '</div>' : '') +
      '</div><div class="c">' +
      '<div>' + (!Z.FEATURES.deliveryRole
          ? (o.status === 'placed' ? '<span class="a-asg off">Waiting to accept</span>' : '<span class="a-asg on" style="cursor:default">🛵 ' + E(r ? (r.id === Z.ADMIN_ID ? 'You' : r.name) : '—') + '</span>')
          : terminal ? '<span class="a-asg on" style="cursor:default">' + E(r ? r.name : 'Not assigned') + '</span>'
        : '<span class="a-asg ' + (r ? 'on' : 'off') + '" data-act="a.assignSheet" data-id="' + o.id + '">' + E(r ? r.name : 'Not assigned') + '</span>') + '</div>' +
      '<div class="clamp-2" style="white-space:normal">📍 ' + E(o.addr) + '</div>' +
      '<div>📏 ' + o.km + ' km</div>' +
      (r && Z.FEATURES.deliveryRole ? '<div>' + (r.online ? '🟢 Online' : '⚪ Offline') + '</div>' : '') +
      '</div></div>' +
      // quick actions: call the customer without opening the order
      '<div class="a-cta">' +
        '<button class="a-cta-b" data-act="a.call" data-ph="' + E(o.cphone) + '">📞 Call</button>' +
        (!terminal && o.status !== 'placed' ? '<button class="a-cta-b" data-act="a.maps">🗺️ Navigate</button>' : '') +
        (o.status === 'placed' && !Z.FEATURES.deliveryRole ? '<button class="a-cta-b pri" data-act="a.accept" data-id="' + o.id + '">✅ Accept</button>' : '') +
      '</div></div>';
  }

  /* ---------------- assign (shared) ---------------- */
  function boysSorted() {
    return Z.D.staff.filter(function (s) { return s.role === 'delivery' && s.active; }).sort(function (a, b) {
      if (a.online !== b.online) return a.online ? -1 : 1;
      return Z.activeFor(a.id) - Z.activeFor(b.id) || a.name.localeCompare(b.name);
    });
  }
  function boyRows(o) {
    const list = boysSorted();
    if (!list.length) return '<div class="t-cap">No delivery boys exist yet. Add one from the Team page.</div>';
    return list.map(function (b) {
      const n = Z.activeFor(b.id), cur = o.rider === b.id;
      return '<div class="a-boy"><span class="a-dot' + (b.online ? ' on' : '') + '"></span><div class="grow">' +
        '<div class="row" style="gap:6px"><b style="font-size:13.5px">' + E(b.name) + '</b>' + (cur ? '<span class="tag brand">Current</span>' : '') + '</div>' +
        '<div class="t-cap">' + E(b.phone) + '</div><div class="t-cap">' + (b.online ? '' : 'Offline · ') + n + ' active order' + (n === 1 ? '' : 's') + '</div></div>' +
        (cur ? '<button class="btn sm neutral" disabled>Assigned</button>' :
          '<button class="btn sm' + (b.online ? '' : ' outline') + '" data-act="a.assign" data-id="' + o.id + '" data-staff="' + b.id + '">' + (o.rider ? 'Reassign' : 'Assign') + '</button>') + '</div>';
    }).join('');
  }
  function remarksField() {
    return field('Remarks for delivery boy <span class="opt">(optional)</span>', area('aRemarks', 'e.g. Call before reaching, leave at gate', 2));
  }
  function openAssign(id) {
    const o = Z.order(id); if (!o) return;
    st('aRemarks', '');
    Z.sheet(o.rider ? 'Reassign delivery boy' : 'Assign delivery boy',
      '<div class="t-cap" style="margin-bottom:10px">#' + o.id + ' · Online delivery boys with the lightest load are listed first.</div>' +
      remarksField() + '<div style="margin-top:6px">' + boyRows(o) + '</div>');
  }
  function doAssign(id, staffId) {
    const r = Z.assign(id, staffId, 'admin');
    const o = Z.order(id);
    if (Z.S.aRemarks && o) { o.history[o.history.length - 1][2] += ' · Remarks: ' + Z.S.aRemarks; Z.S.aRemarks = ''; }
    Z.closeOv();
    Z.refresh();
    Z.toast('Assigned to ' + E(r.name));
  }
  Z.on('a.assignSheet', function (el) { openAssign(el.getAttribute('data-id')); });
  Z.on('a.assign', function (el) {
    const id = el.getAttribute('data-id'), sid = el.getAttribute('data-staff');
    const b = Z.staff(sid);
    if (!b.online) {
      Z.dialog('<div class="dialog-t">Assign to offline delivery boy?</div><div class="dialog-d">' + E(b.name) + ' is currently offline. They will see the order when they next come online.</div>' +
        '<div class="btn-row"><button class="btn neutral" data-act="closeOv">Cancel</button><button class="btn" data-act="a.assignForce" data-id="' + id + '" data-staff="' + sid + '">Assign anyway</button></div>');
      return;
    }
    doAssign(id, sid);
  });
  Z.on('a.assignForce', function (el) { doAssign(el.getAttribute('data-id'), el.getAttribute('data-staff')); });

  /* ---------------- status changes ---------------- */
  Z.on('a.statusSheet', function (el) {
    const o = Z.order(el.getAttribute('data-id')); if (!o) return;
    const nx = Z.nextForAdmin(o.status);
    Z.sheet('Change status', '<div class="t-cap" style="margin-bottom:6px">Currently: ' + Z.STATUS[o.status].label + '. Pick the next status.</div>' +
      (nx.length ? nx.map(function (s) {
        return '<button class="a-srow" data-act="a.pickStatus" data-id="' + o.id + '" data-st="' + s + '"><span class="dotc" style="color:' + Z.STATUS[s].dot + ';background:' + Z.STATUS[s].dot + '22"></span><span class="grow">' + Z.STATUS[s].label + '</span><span class="t-hint">›</span></button>';
      }).join('') : '<div class="t-cap">No further transitions available.</div>'));
  });
  function cancelDialog(id) {
    st('aCancelReason', '');
    Z.dialog('<div class="dialog-t">Cancel order #' + id + '?</div><div class="dialog-d">The customer is notified with this reason. It also lands in the status history.</div>' +
      field('Reason <span class="opt">(optional, shown in audit log)</span>', area('aCancelReason', 'Customer requested / out of stock / …', 2)) +
      '<div class="btn-row" style="margin-top:14px"><button class="btn neutral" data-act="closeOv">Back</button><button class="btn danger" data-act="a.doCancel" data-id="' + id + '">Cancel order</button></div>');
  }
  Z.on('a.pickStatus', function (el) {
    const id = el.getAttribute('data-id'), s = el.getAttribute('data-st');
    if (s === 'cancelled') { cancelDialog(id); return; }
    Z.setStatus(id, s, null, 'admin');
    Z.closeOv(); Z.refresh(); Z.toast('Status → ' + Z.STATUS[s].label);
  });
  Z.on('a.doCancel', function (el) {
    const id = el.getAttribute('data-id');
    Z.setStatus(id, 'cancelled', (Z.S.aCancelReason || '').trim() || 'Cancelled by admin', 'admin');
    Z.S.aCancelReason = '';
    Z.closeOv(); Z.refresh(); Z.toast('Status → Cancelled');
  });
  Z.on('a.markStatus', function (el) {
    const id = el.getAttribute('data-id'), s = el.getAttribute('data-st');
    if (s === 'cancelled') {
      Z.setStatus(id, 'cancelled', (Z.S.aCancelReason || '').trim() || 'Cancelled by admin', 'admin');
      Z.S.aCancelReason = '';
    } else Z.setStatus(id, s, null, 'admin');
    Z.refresh(); Z.toast('Status → ' + Z.STATUS[s].label);
  });

  /* ======================================================================
     SIGN IN
     ====================================================================== */
  Z.screen('admin', {
    id: 'a-login', group: 'Sign in', title: 'Operator login', route: '/login', sb: 'light', needsLogin: false,
    render: function () {
      const L = st('aLogin', { email: '', password: '', err: '' });
      return '<div class="scroll"><div class="a-login">' +
        '<img class="auth-logo-img" src="' + Z.IMG + 'zugo-icon.jpg" alt="Zugo">' +
        '<div class="t-heading" style="color:var(--brand)">Operator Login</div>' +
        '<div class="t-cap" style="margin-bottom:22px">Sign in to manage operations</div>' +
        (L.err ? '<div class="note err a-err">' + Z.icon('warn') + '<div>' + E(L.err) + '</div></div>' : '') +
        field('Email', inp('aLogin.email', 'Enter your email', 'email')) +
        field('Password', inp('aLogin.password', 'Enter your password', 'password')) +
        '<button class="btn block" style="margin-top:18px" data-act="a.login">Login</button>' +
        '<div class="a-demo"><div class="t-cap b" style="color:var(--a-text);font-weight:600;margin-bottom:2px">Demo: role routing</div>' +
        '<div class="hint" style="margin-bottom:10px">One app, two roles. After sign-in, profiles.role decides the landing screen.</div>' +
        '<div class="col"><button class="btn outline block" data-act="a.demoAdmin">Sign in as Admin</button>' +
        (Z.FEATURES.deliveryRole ? '<button class="btn outline block" data-act="a.demoBoy">Sign in as Delivery boy</button>' : '<div class="hint">Delivery-boy sign-in arrives in Phase 2. In the MVP every operator is an admin who also delivers.</div>') + '</div></div>' +
        '</div></div>';
    },
    notes: {
      purpose: 'Single sign-in for the Zugo Operator app. The role on the profile decides where the user lands.',
      points: ['Heading "Operator Login", subtitle "Sign in to manage operations", Email + Password, full-width Login.',
        'Router redirect: admin → /admin-orders, delivery_boy → /delivery. Customers are rejected ("use the Zugo app").',
        'Validation copy: "Email and password are required".',
        'Mobile then shows the non-skippable "Enable Notifications" gate before the role landing (one_place).',
        'The dashed "Demo" box is mockup-only. Try typing arun@zugo.in to see the delivery routing, or rahul.nair@example.com for the customer rejection.'],
      data: ['supabase.auth.signInWithPassword', 'profiles.role (admin | delivery_boy | customer)', 'rpc upsert_device_token (FCM)', 'app_config + operator_version_config (version gate)'],
      next: ['a-orders', 'd-queue'], ref: OP + 'login_screen.dart'
    }
  });
  function loginAdmin() {
    Z.S.loggedIn.admin = true;
    if (Z.S.aLogin) Z.S.aLogin.err = '';
    Z.go('a-orders', {}, { root: true });
  }
  Z.on('a.demoAdmin', loginAdmin);
  Z.on('a.demoBoy', function () { Z.jump('d-queue'); });
  Z.on('a.login', function () {
    const L = Z.S.aLogin;
    const em = (L.email || '').trim().toLowerCase();
    if (!em || !L.password) { L.err = 'Email and password are required'; Z.refresh(); return; }
    const staff = Z.D.staff.find(function (s) { return s.email === em; });
    if (em === Z.D.customer.email) { L.err = 'This is a customer account. Please use the Zugo app to order.'; Z.refresh(); return; }
    if (staff && !staff.active) { L.err = 'This account has been deactivated. Contact your admin.'; Z.refresh(); return; }
    if (staff && staff.role === 'delivery') { L.err = ''; Z.S.me = staff.id; Z.jump('d-queue'); return; }
    loginAdmin();
  });

  /* ======================================================================
     ORDERS
     ====================================================================== */
  Z.screen('admin', {
    id: 'a-orders', group: 'Orders', title: 'Orders (home)', route: '/admin-orders', sb: 'light',
    render: function () {
      const f = Z.S.orderFilter || 'active';
      const rs = Z.S.orders.filter(inRange);
      const s = stats();
      const fresh = Z.S.orders.filter(function (o) { return o.status === 'placed'; });
      const shown = rs.filter(function (o) { return matchFilter(o, f); }).sort(function (a, b) {
        const aa = Z.ACTIVE.indexOf(a.status) >= 0 ? 0 : 1, bb = Z.ACTIVE.indexOf(b.status) >= 0 ? 0 : 1;
        return aa - bb;
      });
      const rk = rangeDef()[0];
      const RL = rk === 'today' ? 'Today' : rk === 'yesterday' ? 'Yesterday' : rangeLabel();
      const tiles = [
        [RL + ' · Orders', s.orders, ''],
        [RL + ' · Revenue (delivered)', Z.money(s.revenue), 'ok'],
        ['COD pending', Z.money(s.codPending), s.codPending > 0 ? 'warn' : ''],
        ['COD collected', Z.money(s.codCollected), 'ok'],
        ['Online pending', Z.money(0), ''],
        ['Online collected', Z.money(0), 'ok'],
        ['Active deliveries', s.active, ''],
        [Z.FEATURES.deliveryRole ? 'Unassigned' : 'Waiting to accept', s.unassigned, s.unassigned > 0 ? 'warn' : '']
      ].concat(Z.FEATURES.deliveryRole ? [['Delivery boys online', s.online, '']] : []);
      return Z.opBar('admin') + '<div class="scroll">' +
        '<div class="a-h"><h2>Orders</h2><button class="a-link" data-act="a.refresh">↻ Refresh</button></div>' +
        '<div class="chips">' + RANGES.map(function (r) {
          return '<button class="chip' + (rk === r[0] ? ' a-or' : '') + '" data-act="a.range" data-k="' + r[0] + '">' + (r[0] === 'custom' && rk === 'custom' ? E(rangeLabel()) : r[1]) + '</button>';
        }).join('') + '</div>' +
        '<button class="a-toggle-h" data-act="a.stats"><span class="t-hint">' + (Z.S.statsOpen ? '▾' : '▸') + '</span><b>Stats</b><span class="a-link">' + (Z.S.statsOpen ? 'Hide' : 'Show') + '</span></button>' +
        (Z.S.statsOpen ? '<div class="a-stats">' + tiles.map(function (t) { return '<div class="a-stat"><div class="l">' + t[0] + '</div><div class="v ' + t[2] + '">' + t[1] + '</div></div>'; }).join('') + '</div>' : '') +
        (fresh.length ? '<div class="a-alert" data-act="a.showPlaced">🛒 <span class="grow">' + fresh.length + ' new order' + (fresh.length > 1 ? 's' : '') + (Z.FEATURES.deliveryRole ? ' waiting for a delivery boy' : ' waiting for you to accept') + '</span><span>View ›</span></div>' : '') +
        '<div class="chips" style="margin:12px 0">' + FILTERS.map(function (x) {
          const n = rs.filter(function (o) { return matchFilter(o, x[0]); }).length;
          return '<button class="chip' + (f === x[0] ? ' blue' : '') + '" data-act="a.filter" data-k="' + x[0] + '">' + x[1] + ' · ' + n + '</button>';
        }).join('') + '</div>' +
        (shown.length ? shown.map(orderCard).join('') :
          '<div class="empty"><div class="em-i">📋</div><div class="em-t">' + (rs.length ? 'No orders match the selected filter.' : 'No orders yet.') + '</div><div class="em-d">' + (rs.length ? 'Try All or a wider date range.' : 'New orders show up here in real time.') + '</div></div>') +
        '</div>' + Z.bottomNav('admin', 'a-orders');
    },
    notes: {
      purpose: 'Admin home. Every order in the chosen date window, filterable by status. MVP: tap ✅ Accept on a new order (the admin self-assigns and delivers it); each card has quick 📞 Call and 🗺️ Navigate buttons.',
      points: ['Date chips (orange when active): Today, Yesterday, Last 7 days, Last 30 days, Custom (date-range sheet). one_place also has Last 90 days.',
        'Collapsible "Stats" (collapsed by default) with the 9 one_place tiles, computed live from the mockup orders.',
        'Status chips "Label · count"; Active is the default. Active orders sort first.',
        'Tap the status pill → "Change status" sheet with the legal next states (admin may skip forward). Cancelled asks for a reason.',
        'Tap the assign pill → "Assign delivery boy" sheet: online first, lightest load first; offline asks "Assign to offline delivery boy?". Assigning = accepting the order (no separate Accept step).',
        'Zugo addition: new-order banner and highlighted card while any order is still "Order Placed" (one_place relies on the push only).',
        'Realtime: subscribe to orders changes (one_place uses a 30 s cache + manual refresh on this screen).'],
      data: ['rpc get_admin_orders(p_status, p_limit, p_offset, p_from, p_to)', 'rpc get_admin_order_stats(p_from, p_to)', 'rpc update_order_status(p_order_id, p_new_status, p_reason)', 'rpc get_assignable_delivery_boys()', 'rpc assign_delivery(p_order_id, p_delivery_boy_id, p_reason)'],
      next: ['a-order', 'a-shops', 'a-reports', 'a-staff', 'a-settings'], ref: OP + 'admin_orders_screen.dart'
    }
  });
  Z.on('a.refresh', function () { Z.refresh(); Z.toast('Orders refreshed'); });
  Z.on('a.stats', function () { Z.S.statsOpen = !Z.S.statsOpen; Z.refresh(); });
  Z.on('a.filter', function (el) { Z.S.orderFilter = el.getAttribute('data-k'); Z.refresh(); });
  Z.on('a.showPlaced', function () { Z.S.orderFilter = 'placed'; Z.S.aRange = 'today'; Z.refresh(); });
  Z.on('a.range', function (el) {
    const k = el.getAttribute('data-k');
    if (k === 'custom') {
      st('aCustom', { from: '2026-09-10', to: '2026-09-23' });
      Z.sheet('Select date range', '<div class="t-cap" style="margin-bottom:10px">Pick the first and last day. Orders are filtered on the server.</div>' +
        '<div class="a-2">' + field('From', inp('aCustom.from', '', 'date')) + field('To', inp('aCustom.to', '', 'date')) + '</div>',
        '<div class="btn-row"><button class="btn outline" data-act="closeOv">Cancel</button><button class="btn" data-act="a.applyCustom">Apply</button></div>');
      return;
    }
    Z.S.aRange = k; Z.refresh();
  });
  Z.on('a.applyCustom', function () {
    const c = Z.S.aCustom;
    const f = function (d) { const p = d.split('-'); return Number(p[2]) + ' ' + ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(p[1]) - 1] + ' ' + p[0]; };
    Z.S.aCustomLabel = c.from === c.to ? f(c.from) : f(c.from) + ' – ' + f(c.to);
    Z.S.aRange = 'custom'; Z.closeOv(); Z.refresh();
  });

  /* ---------------- order detail ---------------- */
  function historyBy(o, h) {
    if (h[0] === 'placed') return o.recipient || o.customer;
    if (h[0] === 'assigned') return /^Self-assigned/.test(h[2]) ? riderName(o) : 'Anjali Menon (admin)';
    if (h[0] === 'cancelled' && o.cancelReason && /customer/i.test(o.cancelReason)) return o.customer;
    return h.by || (o.rider ? riderName(o) : 'Anjali Menon (admin)');
  }
  Z.screen('admin', {
    id: 'a-order', group: 'Orders', title: 'Order detail', route: '/admin-orders/:orderId', sb: 'light',
    defaults: function () { const p = Z.S.orders.find(function (o) { return o.status === 'placed'; }); return { id: p ? p.id : 'ZG1056' }; },
    render: function (p) {
      const o = Z.order(p.id || 'ZG1056');
      if (!o) {
        return Z.appBar({ back: true, title: 'Order' }) + '<div class="scroll"><div class="empty"><div class="em-i">🔎</div><div class="em-t">Couldn\'t find order ' + E(p.id) + '</div><button class="btn" data-go="a-orders" data-root>Back to Orders</button></div></div>';
      }
      const shop = Z.shop(o.shop);
      const t = Z.orderTotals(o);
      const nx = Z.nextForAdmin(o.status);
      const terminal = !nx.length;
      const fwd = nx.filter(function (s) { return s !== 'cancelled'; });
      let status = '<div class="card flat"><div class="row between"><span class="t-cap">Status</span><span class="tag pill st-' + o.status + ' a-big">' + Z.STATUS[o.status].label + '</span></div>';
      if (terminal) {
        status += '<div class="t-cap" style="margin-top:10px">' + Z.STATUS[o.status].label + '. No further state transitions.</div>' +
          (o.status === 'cancelled' && o.cancelReason ? '<div class="note err" style="margin-top:8px">' + Z.icon('info') + '<div>Reason: ' + E(o.cancelReason) + '</div></div>' : '');
      } else {
        status += '<div class="col" style="margin-top:12px">' + fwd.map(function (s, i) {
          return '<button class="btn block' + (i === 0 ? '' : ' soft') + '" data-act="a.markStatus" data-id="' + o.id + '" data-st="' + s + '">Mark as ' + Z.STATUS[s].label + '</button>';
        }).join('') + '</div>' +
          '<div style="margin-top:12px">' + field('Reason <span class="opt">(optional, shown in audit log)</span>', inp('aCancelReason', 'Customer requested / out of stock / …')) + '</div>' +
          '<button class="btn danger-outline block" style="margin-top:8px" data-act="a.markStatus" data-id="' + o.id + '" data-st="cancelled">Mark as Cancelled</button>';
        if (o.status === 'placed' && !Z.FEATURES.deliveryRole) status = status.replace('<div class="col" style="margin-top:12px">', '<div class="col" style="margin-top:12px"><button class="btn block success" data-act="a.accept" data-id="' + o.id + '">✅ Accept order · I\'ll deliver it</button>');
        if (o.status === 'placed' && Z.FEATURES.deliveryRole) status += '<div class="hint" style="margin-top:8px">Tip: assigning a delivery boy below accepts the order (status → Assigned).</div>';
      }
      status += '</div>';
      const assign = !Z.FEATURES.deliveryRole
        ? (o.rider ? '<div class="card flat"><div class="row between"><div><div class="t-cap">Delivered by</div><b>🛵 ' + E(riderName(o)) + '</b></div><button class="btn sm outline" data-act="a.call" data-ph="' + E(o.cphone) + '">📞 Call customer</button></div></div>' : '')
        : o.status === 'placed' ? '<div class="card flat"><div class="card-t">Assign to a delivery boy</div><div class="t-cap" style="margin-bottom:8px">Online delivery boys with the lightest current load are listed first.</div>' + remarksField() + '<div style="margin-top:4px">' + boyRows(o) + '</div></div>' :
        (terminal ? '' : o.rider ? '<div class="card flat"><div class="row between"><div><div class="t-cap">Delivery boy</div><b>' + E(riderName(o)) + '</b> <span class="t-cap">' + (Z.staff(o.rider).online ? '🟢 Online' : '⚪ Offline') + '</span></div><button class="btn sm outline" data-act="a.assignSheet" data-id="' + o.id + '">Reassign</button></div></div>'
          : '<div class="card flat"><div class="row between"><div><div class="t-cap">Delivery boy</div><b style="color:#ef6c00">Not assigned</b></div><button class="btn sm" data-act="a.assignSheet" data-id="' + o.id + '">Assign</button></div></div>');
      const items = o.items.map(function (l) {
        const it = Z.item(l.itemId);
        const vn = Z.varName(it, l.varId);
        return '<div class="row" style="padding:8px 0;border-bottom:1px solid var(--a-divider)">' + Z.img(it.e, shopTint(shop) + ' a-t48') +
          '<div class="grow"><div style="font-weight:500">' + E(it.name) + '</div><div class="t-cap">' + (vn ? E(vn) + ' × ' + l.qty : l.qty + ' × ' + Z.money(l.unit)) + '</div><div class="hint">From ' + E(shop.name) + '</div></div>' +
          '<div class="t-sub num">' + Z.money(l.unit * l.qty) + '</div></div>';
      }).join('');
      const hist = o.history.slice().reverse().map(function (h) {
        return '<div class="a-hist"><span class="d" style="background:' + Z.STATUS[h[0]].dot + '"></span><div class="grow"><div style="font-size:13px;font-weight:600">' + Z.STATUS[h[0]].label + ' · ' + E(h[1]) + '</div>' +
          (h[2] ? '<div class="t-cap">' + E(h[2]) + '</div>' : '') + '<div class="hint">by ' + E(historyBy(o, h)) + '</div></div></div>';
      }).join('');
      return Z.appBar({ back: true, title: 'Order #' + o.id, sub: E(o.date || o.placedAgo) + ' · ' + E(shop.name), actions: '<button class="chip" style="margin-right:4px;color:var(--brand);border-color:var(--brand)" data-act="a.share" data-id="' + o.id + '">↗ Share</button>' }) +
        '<div class="scroll stack-12">' + status + assign +
        '<div class="card flat"><div class="t-cap">Customer</div><div class="t-sub">' + E(o.customer) + '</div><div class="t-body">📞 ' + E(o.cphone) + '</div><div class="t-cap">' + E(email(o)) + '</div></div>' +
        '<div class="card flat"><div class="card-t">Deliver to</div><div class="t-body">' + E(o.recipient || o.customer) + ' · 📞 ' + E(o.cphone) + '</div>' +
        '<div class="t-body" style="margin-top:2px">' + E(o.addr) + '</div><div class="hint" style="margin-top:2px">📍 ' + o.lat.toFixed(4) + ', ' + o.lng.toFixed(4) + ' · ' + o.km + ' km</div>' +
        '<div class="row between" style="margin-top:10px"><span class="a-mtag">' + E(o.method) + '</span><button class="btn sm outline" data-act="a.maps">🗺️ Open in Maps</button></div></div>' +
        '<div class="card flat"><div class="card-t">Items <span class="t-cap" style="font-weight:400">· ' + itemsCount(o) + ' products</span></div>' + items + '</div>' +
        '<div class="bill"><div class="card-t">Bill</div><div class="bill-r"><span class="k">Subtotal</span><span>' + Z.money(t.sub) + '</span></div>' +
        '<div class="bill-r"><span class="k t-hint">Distance</span><span class="t-hint">' + o.km + ' km</span></div>' +
        '<div class="bill-r"><span class="k">Delivery fee</span><span>' + Z.money(t.fee) + '</span></div>' +
        '<div class="bill-r total"><span class="k">Total</span><span>' + Z.money(t.total) + '</span></div></div>' +
        '<div class="card flat"><div class="card-t">Payment</div><div class="t-body">Cash on Delivery</div><div class="t-cap">Status: ' + (o.status === 'delivered' ? 'collected' : 'pending') + '</div></div>' +
        (o.notes ? '<div class="card flat"><div class="card-t">Notes</div><div class="t-body">📝 ' + E(o.notes) + '</div></div>' : '') +
        '<div class="card flat"><div class="row between"><div class="card-t" style="margin:0">Status history</div><button class="a-link" data-act="a.refresh">↻</button></div>' + (hist || '<div class="t-cap">No history yet.</div>') + '</div>' +
        '</div>';
    },
    notes: {
      purpose: 'Full order view for the admin: accept the order, move it through Preparing → Out for delivery → Delivered, see where to deliver and what was ordered. MVP: the admin delivers personally, so there is no assign panel (Phase 2 brings back delivery-boy assignment).',
      points: ['"Mark as {label}" buttons list every later state (Assigned skipped; it needs a boy). Admin may jump ahead, e.g. Order Placed → Delivered.',
        '"Mark as Cancelled" uses the reason field ("Reason (optional, shown in audit log)"); the customer gets a push with it.',
        'Assign panel shows only while the order is "Order Placed"; afterwards a Reassign button opens the shared assign sheet.',
        'Deliver to shows the recipient, address and "📍 lat, lng · km".',
        'Zugo addition: the location method tag (Current location / Pinned on map / Google Maps link / Saved address) and "🗺️ Open in Maps" (google.com/maps/dir/?api=1&destination=lat,lng).',
        'Items keep the price captured at order time (order_items.unit_price), not the live menu price.',
        'Terminal orders show "Delivered. No further state transitions." one_place also has a danger-zone "Delete order permanently" (admin_delete_order); Zugo can keep it behind a confirm.',
        '↗ Share opens the one_place store-share sheet (PDF / WhatsApp to the restaurant). Optional for Zugo.'],
      data: ['orders, order_items, addresses (lat/lng), payments', 'rpc update_order_status', 'rpc assign_delivery', 'rpc get_order_status_history(p_order_id)', 'Zugo addition: orders.location_method column'],
      next: ['a-orders'], ref: OP + 'admin_order_detail_screen.dart'
    }
  });
  Z.on('a.accept', function (el) {
    const id = el.getAttribute('data-id');
    Z.accept(id);
    Z.refresh();
    Z.toast('Order #' + id + ' accepted · you are delivering it');
  });
  Z.on('a.maps', function () { Z.toast('Opening Google Maps…'); });
  Z.on('a.share', function (el) {
    Z.sheet('Share to restaurant', '<div class="t-cap" style="margin-bottom:10px">Send the order summary to the restaurant. Customer phone and address are not included.</div>' +
      '<button class="opt-card" data-act="a.shareGo" data-m="PDF saved"><span style="font-size:20px">📄</span><div><b>Download PDF</b><div class="t-cap">Save / share the printable kitchen ticket for #' + el.getAttribute('data-id') + '.</div></div></button>' +
      '<button class="opt-card" data-act="a.shareGo" data-m="Opening WhatsApp…"><span style="font-size:20px">💬</span><div><b>Send via WhatsApp</b><div class="t-cap">Open WhatsApp with the items and totals for the restaurant number.</div></div></button>',
      '<button class="btn outline block" data-act="closeOv">Cancel</button>');
  });
  Z.on('a.shareGo', function (el) { Z.closeOv(); Z.toast(el.getAttribute('data-m')); });

  /* ======================================================================
     CATALOG
     ====================================================================== */
  function shopMatches(s) {
    const q = (Z.S.aShopQ || '').trim().toLowerCase();
    const c = Z.S.aCuisine || null;
    if (s.deleted) return false;
    if (!st('aInclInactive', true) && !s.active) return false;
    if (c && s.tags.indexOf(c) < 0) return false;
    if (q && (s.name + ' ' + s.cuisine).toLowerCase().indexOf(q) < 0) return false;
    return true;
  }
  function shopCard(s) {
    const n = liveItems(s.id).length;
    return '<div class="a-card' + (s.active ? '' : ' dim') + '" data-go="a-menu" ' + DP({ shop: s.id }) + '>' +
      '<div class="row top" style="gap:12px">' + Z.img(s.e, 'sky a-t64') +
      '<div class="grow"><div class="row between top"><div class="grow" style="min-width:0"><div class="row" style="gap:6px;flex-wrap:wrap"><b style="font-size:14px">' + E(s.name) + '</b>' + (s.active ? '' : '<span class="tag solid-err">INACTIVE</span>') + '</div></div>' +
      '<div style="white-space:nowrap"><button class="a-tx b" data-act="a.editShop" data-id="' + s.id + '">Edit</button><button class="a-tx g" data-act="a.call" data-ph="' + E(s.phone || '') + '">Call</button><button class="a-tx r" data-act="a.delShop" data-id="' + s.id + '">Delete</button></div></div>' +
      '<div class="t-cap">' + E(s.cuisine) + ' · ' + n + ' items' + (s.lat ? '' : ' · <span class="t-warn">⚠ No coords</span>') + '</div>' +
      '<div class="t-cap">🕒 ' + E(s.hours || '—') + '</div></div></div>' +
      '<div class="row between" style="margin-top:10px"><div class="a-tgrow">' + tg(s.active, 'a.shopActive', 'data-id="' + s.id + '"', 'a-food') + '<span>' + (s.active ? 'Active' : 'Inactive') + '</span></div>' +
      '<span style="color:var(--food-ink);font-size:12px;font-weight:600">Tap card → Menu →</span></div></div>';
  }
  function shopList() {
    const list = Z.D.shops.filter(shopMatches);
    const q = (Z.S.aShopQ || '').trim();
    if (!list.length) {
      return q ? '<div class="empty"><div class="em-i">🔍</div><div class="em-t">No restaurants match "' + E(q) + '"</div><div class="em-d">Try a different name or cuisine.</div></div>'
        : '<div class="empty"><div class="em-i">🍔</div><div class="em-t">No restaurants yet</div><div class="em-d">Tap + to onboard your first restaurant.</div></div>';
    }
    return list.map(shopCard).join('');
  }
  Z.screen('admin', {
    id: 'a-shops', group: 'Catalog', title: 'Restaurants', route: '/restaurants', sb: 'light',
    render: function () {
      const inc = st('aInclInactive', true);
      const c = Z.S.aCuisine || null;
      const count = Z.D.shops.filter(function (s) { return !s.deleted; }).length;
      return Z.opBar('admin') + '<div class="scroll">' +
        '<div class="a-h"><h2>Restaurants</h2><span class="pill-count">' + count + ' restaurants</span></div>' +
        '<div class="search" style="cursor:text">' + Z.icon('search') + '<input id="a-shop-q" placeholder="Search restaurants, cuisines…" value="' + E(Z.S.aShopQ || '') + '"></div>' +
        '<div class="a-tgrow" style="margin:12px 0">' + tg(inc, 'a.inclInactive', '', 'a-food') + '<span>Include inactive</span></div>' +
        '<div class="chips" style="margin-bottom:12px"><button class="chip' + (c ? '' : ' on') + '" data-act="a.cuisine" data-k="">All</button>' +
        Z.D.cuisines.map(function (x) { return '<button class="chip' + (c === x.id ? ' on' : '') + '" data-act="a.cuisine" data-k="' + x.id + '">' + x.e + ' ' + x.label + '</button>'; }).join('') + '</div>' +
        '<div id="a-shop-list">' + shopList() + '</div><div style="height:70px"></div>' +
        '</div><button class="fab a-fab" data-act="a.newShop" aria-label="Add restaurant">+</button>' + Z.bottomNav('admin', 'a-shops');
    },
    mount: function (root) {
      const q = root.querySelector('#a-shop-q');
      if (q) q.addEventListener('input', function () { Z.S.aShopQ = q.value; const l = root.querySelector('#a-shop-list'); if (l) l.innerHTML = shopList(); });
    },
    notes: {
      purpose: 'All restaurants, including inactive ones. Tap a card to manage its menu.',
      points: ['Search "Search restaurants, cuisines…" (300 ms debounce), "Include inactive" toggle, cuisine chips.',
        'Card: 64 px thumb, name + INACTIVE pill, Edit / Call / Delete text actions, "cuisines · N items", food-blue Active toggle, "Tap card → Menu →".',
        'The Active toggle is live: switch Malabar Biryani House off, then open the Zugo customer view; it disappears from Home.',
        'Delete confirm: "This permanently removes the restaurant and all its menu items. Order history is not affected."',
        'Zugo addition: opening hours line per restaurant (one_place only has global food hours).',
        'Food-blue "+" FAB → Add Restaurant.'],
      data: ['rpc get_admin_restaurants()', 'rpc search_restaurants_by_substring', 'rpc toggle_restaurant_active(p_id, p_is_active)', 'rpc delete_restaurant_with_image_cleanup(p_id)'],
      next: ['a-menu', 'a-shop-form'], ref: OP + 'restaurants_screen.dart'
    }
  });
  Z.on('a.inclInactive', function () { Z.S.aInclInactive = !st('aInclInactive', true); Z.refresh(); });
  Z.on('a.cuisine', function (el) { Z.S.aCuisine = el.getAttribute('data-k') || null; Z.refresh(); });
  Z.on('a.call', function (el) { const ph = el.getAttribute('data-ph'); Z.toast(ph ? 'Calling ' + E(ph) + '…' : 'No phone number on file'); });
  Z.on('a.shopActive', function (el) {
    const s = Z.shop(el.getAttribute('data-id')); s.active = !s.active;
    Z.refresh(); Z.toast(E(s.name) + (s.active ? ' is live for customers' : ' hidden from customers'));
  });
  Z.on('a.newShop', function () { Z.S.aShopDraft = null; Z.go('a-shop-form', {}); });
  Z.on('a.editShop', function (el) { Z.S.aShopDraft = null; Z.go('a-shop-form', { id: el.getAttribute('data-id') }); });
  Z.on('a.delShop', function (el) {
    const s = Z.shop(el.getAttribute('data-id'));
    confirmDlg('Delete ' + E(s.name) + '?', 'This permanently removes the restaurant and all its menu items. Order history is not affected.', 'a.delShopGo', 'Delete', 'data-id="' + s.id + '"', true);
  });
  Z.on('a.delShopGo', function (el) {
    const id = el.getAttribute('data-id'); const s = Z.shop(id);
    const used = Z.S.orders.some(function (o) { return o.shop === id; });
    if (used) { s.deleted = true; s.active = false; Z.D.items.forEach(function (i) { if (i.shop === id) { i.deleted = true; i.avail = false; } }); }
    else { Z.D.shops = Z.D.shops.filter(function (x) { return x.id !== id; }); Z.D.items = Z.D.items.filter(function (i) { return i.shop !== id; }); }
    Z.closeOv(); Z.refresh(); Z.toast('Restaurant deleted');
  });

  /* ---------------- add / edit restaurant ---------------- */
  function shopDraft(id) {
    const key = id || 'new';
    if (Z.S.aShopDraft && Z.S.aShopDraft._for === key) return Z.S.aShopDraft;
    const s = id ? Z.shop(id) : null;
    const hp = s && s.hours ? s.hours.split('–') : [];
    Z.S.aShopDraft = {
      _for: key, name: s ? s.name : '', desc: s ? (s.desc || s.cuisine) : '', tags: s ? s.tags.slice() : [], custom: s && s.custom ? s.custom.slice() : [],
      addingCustom: false, customText: '', img: !!s, address: s ? s.address : '', lat: s ? String(s.lat) : '', lng: s ? String(s.lng) : '',
      prepMin: s ? '15' : '', prepMax: s ? '20' : '', open: s ? to24(hp[0]) : '11:00', close: s ? to24(hp[1]) : '23:00',
      phone: s ? s.phone : '', priority: s ? String(Z.D.shops.indexOf(s)) : '', active: s ? s.active : true, err: '', e: s ? s.e : null
    };
    return Z.S.aShopDraft;
  }
  Z.screen('admin', {
    id: 'a-shop-form', group: 'Catalog', title: 'Add / edit restaurant', route: '/restaurants/add · /restaurants/:id/edit', sb: 'light',
    render: function (p) {
      const d = shopDraft(p.id);
      const all = Z.D.cuisines.map(function (c) { return [c.id, c.e + ' ' + c.label]; }).concat(d.custom.map(function (c) { return [c, c + ' ✕']; }));
      const cover = d.img ? '<div style="position:relative;width:96px;height:96px">' + Z.img(d.e || '🍽️', 'sky s96') + '<button class="thumb-x" data-act="a.shopImgX" aria-label="Remove">' + Z.icon('close') + '</button></div>'
        : '<div class="upl" style="width:96px;height:96px" data-act="a.shopImg">' + Z.icon('upload') + '<span>Add cover</span></div>';
      return Z.appBar({ back: true, title: p.id ? 'Edit Restaurant' : 'Add Restaurant' }) + '<div class="scroll">' +
        (d.err ? '<div class="note err a-err">' + Z.icon('warn') + '<div>' + E(d.err) + '</div></div>' : '') +
        '<div class="a-grp">Basic</div>' +
        field('Name (English) *', inp('aShopDraft.name', 'e.g. Malabar Biryani House')) +
        field('Description', area('aShopDraft.desc', 'Short tagline', 3), 'Short tagline shown on customer cards.') +
        field('Cuisine Types *', '<div class="chips wrap">' + all.map(function (c) {
          return '<button class="chip' + (d.tags.indexOf(c[0]) >= 0 || d.custom.indexOf(c[0]) >= 0 ? ' on' : '') + '" data-act="a.shopTag" data-k="' + E(c[0]) + '">' + E(c[1]) + '</button>';
        }).join('') + '</div>' +
          (d.addingCustom ? '<div class="row" style="margin-top:8px">' + inp('aShopDraft.customText', 'e.g. Andhra, Mughlai') + '<button class="btn sm" data-act="a.customSave">Save</button><button class="btn sm ghost" data-act="a.customToggle">Cancel</button></div>'
            : '<button class="a-link" style="margin-top:8px;align-self:flex-start" data-act="a.customToggle">+ Add custom cuisine</button>')) +
        field('Cover Image', cover, 'Single image · food/restaurants/{id}/0.jpg (R2)') +
        '<div class="a-grp">Location</div>' +
        field('Address', area('aShopDraft.address', 'Building, street, area', 2)) +
        field('Location (latitude / longitude)', '<div class="a-2">' + inp('aShopDraft.lat', 'lat', 'text', ' inputmode="decimal"') + inp('aShopDraft.lng', 'lng', 'text', ' inputmode="decimal"') + '</div>' +
          '<div class="a-2" style="margin-top:8px"><button class="btn sm outline" data-act="a.shopGps">🎯 Use current location</button><button class="btn sm outline" data-act="a.shopMap">📍 Pick on map</button></div>' +
          '<button class="btn sm outline block" style="margin-top:8px" data-act="a.shopLink">🔗 Paste map link</button>',
          'Customer browse uses straight-line distance from these coords; checkout uses Google Maps Distance Matrix.') +
        field('Prep time (minutes)', '<div class="row">' + inp('aShopDraft.prepMin', 'min', 'number') + '<span class="t-hint">—</span>' + inp('aShopDraft.prepMax', 'max', 'number') + '</div>', 'Kitchen prep time only. Delivery time is added at checkout.') +
        field('Opening hours', '<div class="a-2">' + inp('aShopDraft.open', '', 'time') + inp('aShopDraft.close', '', 'time') + '</div>', 'Zugo addition: outside these hours the restaurant shows "Closed · Opens at …" and checkout is blocked.') +
        '<div class="a-grp">Contact &amp; status</div>' +
        field('Contact phone', inp('aShopDraft.phone', '+91 …', 'tel')) +
        field('Home priority', inp('aShopDraft.priority', 'e.g. 0, 1, 2 …', 'number'), 'Leave blank for no priority. 0 = first, 1 = second …') +
        '<div class="a-tgrow" style="margin-top:14px">' + tg(d.active, 'a.shopDraftActive', '', 'a-food') + '<span>' + (d.active ? 'Active' : 'Inactive') + '</span></div>' +
        '</div><div class="sticky"><div class="btn-row"><button class="btn ghost" data-back>Cancel</button><button class="btn" style="flex:2" data-act="a.saveShop" data-id="' + (p.id || '') + '">' + (p.id ? 'Save Changes' : 'Save Restaurant') + '</button></div></div>';
    },
    notes: {
      purpose: 'Onboard or edit a restaurant: name, cuisines, cover image, location, prep time, hours, contact and status.',
      points: ['Sections BASIC / LOCATION / CONTACT & STATUS with uppercase food-blue captions; sticky Cancel / Save Restaurant bar.',
        'Dropped from one_place: the Tamil and Malayalam name fields (Zugo is English-only for v1; name_translations stays nullable in the schema).',
        'Cover image is a single image uploaded to R2 after the row is created (food/restaurants/{id}/0.jpg).',
        '🎯 Use current location / 📍 Pick on map (map picker "Pick Restaurant Location").',
        'Zugo addition: 🔗 Paste map link resolves a Google Maps share URL into lat/lng (edge function resolve-maps-url, the same one checkout uses).',
        'Zugo addition: per-restaurant opening hours (open_time / close_time columns); one_place has only global food hours.',
        'Validation: "Name (English) is required", "Pick at least one cuisine", "Prep min must be ≤ max", "Latitude and longitude must both be set (or both empty)".',
        'Saving adds or updates the shop in the shared mockup data, so the customer app shows it straight away.'],
      data: ['rpc create_restaurant(p_data)', 'rpc update_restaurant(p_id, p_data)', 'edge r2-signed-url (image upload)', 'edge resolve-maps-url (Zugo addition)', 'restaurants.open_time / close_time (Zugo addition)'],
      next: ['a-shops'], ref: OP + 'add_restaurant_screen.dart'
    }
  });
  Z.on('a.shopTag', function (el) {
    const d = Z.S.aShopDraft, k = el.getAttribute('data-k');
    if (d.custom.indexOf(k) >= 0) d.custom = d.custom.filter(function (x) { return x !== k; });
    else if (d.tags.indexOf(k) >= 0) d.tags = d.tags.filter(function (x) { return x !== k; });
    else d.tags.push(k);
    Z.refresh();
  });
  Z.on('a.customToggle', function () { const d = Z.S.aShopDraft; d.addingCustom = !d.addingCustom; d.customText = ''; Z.refresh(); });
  Z.on('a.customSave', function () { const d = Z.S.aShopDraft; const t = (d.customText || '').trim(); if (t && d.custom.indexOf(t) < 0) d.custom.push(t); d.addingCustom = false; d.customText = ''; Z.refresh(); });
  Z.on('a.shopImg', function () {
    Z.sheet('Cover image', '<button class="a-srow" data-act="a.shopImgPick">📷 <span class="grow">Camera</span></button><button class="a-srow" data-act="a.shopImgPick">🖼️ <span class="grow">Gallery</span></button>',
      '<button class="btn outline block" data-act="closeOv">Cancel</button>');
  });
  Z.on('a.shopImgPick', function () {
    const d = Z.S.aShopDraft; d.img = true;
    if (!d.e) { const c = Z.D.cuisines.find(function (x) { return d.tags.indexOf(x.id) >= 0; }); d.e = c ? c.e : '🍽️'; }
    Z.closeOv(); Z.refresh(); Z.toast('Image ready · uploads on save');
  });
  Z.on('a.shopImgX', function () { Z.S.aShopDraft.img = false; Z.refresh(); });
  Z.on('a.shopDraftActive', function () { Z.S.aShopDraft.active = !Z.S.aShopDraft.active; Z.refresh(); });
  Z.on('a.shopGps', function () { const d = Z.S.aShopDraft; d.lat = '9.9971'; d.lng = '76.2999'; Z.refresh(); Z.toast('Location set from GPS'); });
  Z.on('a.shopMap', function () {
    Z.sheet('Pick Restaurant Location', '<div class="t-cap" style="margin-bottom:8px">Drag the map to place the pin at the restaurant. Tap 🎯 to use the device GPS.</div>' +
      '<div class="map" style="height:220px"><div class="pin-shadow"></div><div class="pin">' + Z.icon('pin') + '</div><button class="map-fab" data-act="a.shopGps">🎯</button></div>' +
      '<div class="t-cap" style="margin-top:8px">📍 10.0027, 76.3067 · Palarivattom, Kochi</div>',
      '<button class="btn block" data-act="a.shopMapUse">Use this location</button>');
  });
  Z.on('a.shopMapUse', function () { const d = Z.S.aShopDraft; d.lat = '10.0027'; d.lng = '76.3067'; if (!d.address) d.address = 'Palarivattom, Kochi'; Z.closeOv(); Z.refresh(); Z.toast('Location pinned'); });
  Z.on('a.shopLink', function () {
    st('aLinkText', '');
    Z.sheet('Paste map link', '<div class="t-cap" style="margin-bottom:8px">Open the restaurant in Google Maps → Share → Copy link, then paste it here.</div>' +
      field('Google Maps link', inp('aLinkText', 'https://maps.app.goo.gl/…')),
      '<button class="btn block" data-act="a.shopLinkGo">Get coordinates</button>');
  });
  Z.on('a.shopLinkGo', function () {
    const d = Z.S.aShopDraft; const t = (Z.S.aLinkText || '').trim();
    if (t && !/maps|goo\.gl|google/.test(t)) { Z.toast('That doesn\'t look like a Google Maps link'); return; }
    d.lat = '10.0012'; d.lng = '76.3024'; Z.closeOv(); Z.refresh(); Z.toast('Link resolved · 10.0012, 76.3024');
  });
  Z.on('a.saveShop', function (el) {
    const d = Z.S.aShopDraft, id = el.getAttribute('data-id');
    d.err = '';
    if (!(d.name || '').trim()) d.err = 'Name (English) is required';
    else if (!d.tags.length && !d.custom.length) d.err = 'Pick at least one cuisine';
    else if (d.prepMin && d.prepMax && Number(d.prepMin) > Number(d.prepMax)) d.err = 'Prep min must be ≤ max';
    else if (!!d.lat !== !!d.lng) d.err = 'Latitude and longitude must both be set (or both empty)';
    else if (d.lat && Math.abs(Number(d.lat)) > 90) d.err = 'Latitude must be between -90 and 90';
    if (d.err) { Z.refresh(); return; }
    const labels = d.tags.map(function (t) { const c = Z.D.cuisines.find(function (x) { return x.id === t; }); return c ? c.label : t; }).concat(d.custom);
    const firstC = Z.D.cuisines.find(function (x) { return d.tags.indexOf(x.id) >= 0; });
    const pm = Number(d.prepMin) || 15, px = Number(d.prepMax) || 20;
    const data = {
      name: d.name.trim(), desc: d.desc, cuisine: labels.slice(0, 2).join(' · '), tags: d.tags.slice(), custom: d.custom.slice(),
      address: d.address || 'Kochi', lat: d.lat ? Number(d.lat) : null, lng: d.lng ? Number(d.lng) : null, phone: d.phone,
      hours: fmt12(d.open) + ' – ' + fmt12(d.close), active: d.active
    };
    if (id) {
      Object.assign(Z.shop(id), data);
      Z.S.aShopDraft = null; Z.back(); Z.toast('Restaurant updated');
    } else {
      const nid = 's' + (Z.D.shops.length + 10);
      Z.D.shops.push(Object.assign({
        id: nid, e: d.img ? (d.e || (firstC ? firstC.e : '🍽️')) : (firstC ? firstC.e : '🍽️'), tint: 'sky', rating: 4.0, km: 1.5,
        eta: (pm + 10) + '–' + (px + 15) + ' min', open: true, minOrder: 99, orders30: 0
      }, data));
      Z.S.aShopDraft = null; Z.back(); Z.toast('Restaurant created · add menu items next');
    }
  });

  /* ---------------- menu ---------------- */
  Z.screen('admin', {
    id: 'a-menu', group: 'Catalog', title: 'Restaurant menu', route: '/restaurants/:id/menu', sb: 'light',
    defaults: function () { return { shop: 's1' }; },
    render: function (p) {
      const s = Z.shop(p.shop || 's1') || Z.D.shops[0];
      const items = liveItems(s.id);
      const cats = [];
      items.forEach(function (i) { if (cats.indexOf(i.cat) < 0) cats.push(i.cat); });
      const body = items.length ? cats.map(function (c) {
        return '<div class="a-grp">' + E(c) + '</div>' + items.filter(function (i) { return i.cat === c; }).map(function (it) {
          return '<div class="a-card' + (it.avail ? '' : ' dim') + '" data-act="a.editItem" data-id="' + it.id + '" data-shop="' + s.id + '"><div class="row top" style="gap:12px">' + Z.img(it.e, shopTint(s) + ' a-t64') +
            '<div class="grow"><div class="row" style="gap:6px;flex-wrap:wrap"><b style="font-size:14px">' + E(it.name) + '</b>' + (it.avail ? '' : '<span class="tag solid-err">UNAVAILABLE</span>') + '</div>' +
            '<div class="t-price" style="font-size:14px;margin-top:2px">' + priceLine(it) + '</div>' +
            '<div class="row between" style="margin-top:8px"><span class="row" style="gap:6px;font-size:12px">' + Z.veg(it.veg) + (it.veg ? 'Veg' : 'Non-veg') + '</span>' +
            '<span class="row" style="gap:10px">' + tg(it.avail, 'a.itemAvail', 'data-id="' + it.id + '"', 'a-food') + '<button class="a-tx r" style="padding:0" data-act="a.delItem" data-id="' + it.id + '">Delete</button></span></div></div></div></div>';
        }).join('');
      }).join('') : '<div class="empty"><div class="em-i">🍽️</div><div class="em-t">No menu items yet</div><div class="em-d">Tap + to add the first dish.</div><button class="btn" data-act="a.newItem" data-shop="' + s.id + '">+ Add Item</button></div>';
      return Z.appBar({ back: true, title: E(s.name), sub: items.length + ' items' + (s.active ? '' : ' · inactive') }) +
        '<div class="scroll"><div class="row between" style="gap:10px;margin-bottom:2px"><span class="t-cap">Tap a dish to edit. The switch hides it from customers.</span>' +
        '<button class="btn sm" style="background:var(--food);flex-shrink:0" data-act="a.newItem" data-shop="' + s.id + '">+ Add Item</button></div>' + body + '</div>';
    },
    notes: {
      purpose: 'Menu of one restaurant, grouped by category, with a live availability switch per dish.',
      points: ['Uppercase food-blue category headers; card = thumb, name, UNAVAILABLE pill, price ("₹249" or "₹160–₹240 · 2 sizes"), veg marker, availability toggle, Delete.',
        'Availability toggle is live: switch Chicken Biryani off and the customer menu greys it out; a reorder of it flags "item unavailable".',
        'Unavailable items render at 55% opacity. Tap a card to edit.',
        'Delete confirm: "Removes the item and all its variations. Order history is not affected."'],
      data: ['rpc get_admin_restaurant_menu(p_restaurant_id)', 'menu_items.is_available (direct update, admin RLS)', 'rpc delete_menu_item_with_image_cleanup(p_id)'],
      next: ['a-item-form', 'a-shops'], ref: OP + 'restaurant_menu_screen.dart'
    }
  });
  Z.on('a.itemAvail', function (el) {
    const it = Z.item(el.getAttribute('data-id')); it.avail = !it.avail;
    Z.refresh(); Z.toast(E(it.name) + (it.avail ? ' is available' : ' marked unavailable'));
  });
  Z.on('a.delItem', function (el) {
    const it = Z.item(el.getAttribute('data-id'));
    confirmDlg('Delete ' + E(it.name) + '?', 'Removes the item and all its variations. Order history is not affected.', 'a.delItemGo', 'Delete', 'data-id="' + it.id + '"', true);
  });
  Z.on('a.delItemGo', function (el) {
    const id = el.getAttribute('data-id');
    const used = Z.S.orders.some(function (o) { return o.items.some(function (l) { return l.itemId === id; }); }) || Z.S.cart.some(function (c) { return c.itemId === id; });
    if (used) { const it = Z.item(id); it.deleted = true; it.avail = false; } else Z.D.items = Z.D.items.filter(function (i) { return i.id !== id; });
    Z.closeOv(); Z.refresh(); Z.toast('Item deleted');
  });
  Z.on('a.newItem', function (el) { Z.S.aItemDraft = null; Z.go('a-item-form', { shop: el.getAttribute('data-shop') }); });
  Z.on('a.editItem', function (el) { Z.S.aItemDraft = null; Z.go('a-item-form', { item: el.getAttribute('data-id'), shop: el.getAttribute('data-shop') }); });

  /* ---------------- add / edit item ---------------- */
  function itemDraft(p) {
    const key = p.item || ('new:' + (p.shop || 's1'));
    if (Z.S.aItemDraft && Z.S.aItemDraft._for === key) return Z.S.aItemDraft;
    const it = p.item ? Z.item(p.item) : null;
    Z.S.aItemDraft = {
      _for: key, name: it ? it.name : '', desc: it ? it.desc : '', cat: it ? it.cat : '', veg: it ? it.veg : false, avail: it ? it.avail !== false : true,
      img: !!it, hasVars: !!(it && it.vars), price: it && !it.vars ? String(it.price) : '',
      vars: it && it.vars ? it.vars.map(function (v, i) { return { id: v.id, name: v.name, price: String(v.price), def: i === 0, avail: v.avail !== false }; }) : [],
      err: ''
    };
    return Z.S.aItemDraft;
  }
  const PRESETS = [['Half / Full', ['Half', 'Full']], ['S / M / L', ['Small', 'Medium', 'Large']], ['Regular / Large', ['Regular', 'Large']]];
  Z.screen('admin', {
    id: 'a-item-form', group: 'Catalog', title: 'Add / edit menu item', route: '/restaurants/:id/menu/add · /:itemId/edit', sb: 'light',
    defaults: function () { return { item: 'i1', shop: 's1' }; },
    render: function (p) {
      const d = itemDraft(p);
      const shopId = p.shop || (p.item ? Z.item(p.item).shop : 's1');
      const cats = [];
      liveItems(shopId).forEach(function (i) { if (cats.indexOf(i.cat) < 0) cats.push(i.cat); });
      const img = d.img ? '<div style="position:relative;width:96px;height:96px">' + Z.img(p.item ? Z.item(p.item).e : '🍽️', 'warm s96') + '<button class="thumb-x" data-act="a.itemImgX" aria-label="Remove">' + Z.icon('close') + '</button></div>'
        : '<div class="upl" style="width:96px;height:96px" data-act="a.itemImg">' + Z.icon('upload') + '<span>Add image</span></div>';
      let pricing;
      if (!d.hasVars) pricing = field('Price (₹) *', inp('aItemDraft.price', 'e.g. 249', 'number'));
      else {
        pricing = '<div class="lbl" style="margin-bottom:6px">QUICK-ADD</div><div class="chips wrap" style="margin-bottom:10px">' +
          PRESETS.map(function (x, i) { const cur = d.vars.map(function (v) { return v.name; }).join('|') === x[1].join('|'); return '<button class="chip' + (cur ? ' on' : '') + '" data-act="a.preset" data-i="' + i + '">' + x[0] + '</button>'; }).join('') + '</div>' +
          d.vars.map(function (v, i) {
            return '<div class="a-var' + (v.def ? ' def' : '') + '"><div class="row between" style="margin-bottom:8px"><b style="font-size:12.5px">Variation ' + (i + 1) + '</b><button class="a-tx r" data-act="a.varDel" data-i="' + i + '">✕ Remove</button></div>' +
              '<div class="row" style="align-items:flex-end">' + '<div class="field grow"><label class="lbl">Label (e.g. Half)</label>' + inp('aItemDraft.vars.' + i + '.name', 'Half') + '</div>' +
              '<div class="field" style="width:100px"><label class="lbl">Price</label>' + inp('aItemDraft.vars.' + i + '.price', '₹', 'number') + '</div></div>' +
              '<div class="row between" style="margin-top:10px"><button class="row" style="background:none;border:0;padding:0;cursor:pointer;font-family:inherit;font-size:12.5px;gap:6px" data-act="a.varDef" data-i="' + i + '"><span class="radio' + (v.def ? ' on' : '') + '"></span>Default</button>' +
              '<span class="a-tgrow" style="font-size:12.5px">' + (v.avail ? 'Available' : 'Unavailable') + tg(v.avail, 'a.varAvail', 'data-i="' + i + '"', 'a-food') + '</span></div></div>';
          }).join('') +
          '<button class="btn outline block sm" style="margin-top:10px" data-act="a.varAdd">+ Add Variation</button>';
      }
      return Z.appBar({ back: true, title: p.item ? 'Edit Item' : 'Add Menu Item', sub: E(Z.shop(shopId).name) }) + '<div class="scroll">' +
        (d.err ? '<div class="note err a-err">' + Z.icon('warn') + '<div>' + E(d.err) + '</div></div>' : '') +
        '<div class="a-grp">Item</div>' +
        field('Name *', inp('aItemDraft.name', 'e.g. Chicken Biryani')) +
        field('Description', area('aItemDraft.desc', 'Optional short tagline', 2)) +
        field('Category *', inp('aItemDraft.cat', 'e.g. Biryani') + (cats.length ? '<div class="chips wrap" style="margin-top:6px">' + cats.map(function (c) { return '<button class="chip' + (d.cat === c ? ' on' : '') + '" data-act="a.pickCat" data-k="' + E(c) + '">' + E(c) + '</button>'; }).join('') + '</div>' : ''), 'Tap an existing one or type a new label') +
        field('Item image', img, 'Single image · food/menu_items/{id}/0.jpg') +
        field('Type', '<div class="row"><button class="a-pill' + (d.veg ? ' on' : '') + '" data-act="a.itemVeg" data-v="1">🟢 Veg</button><button class="a-pill' + (d.veg ? '' : ' on') + '" data-act="a.itemVeg" data-v="0">🔴 Non-veg</button></div>') +
        '<div class="a-tgrow" style="margin-top:14px">' + tg(d.avail, 'a.itemDraftAvail', '', 'a-food') + '<span>' + (d.avail ? 'Available' : 'Unavailable') + '</span></div>' +
        '<div class="a-grp">Pricing</div>' +
        '<div class="a-tgrow" style="margin-bottom:12px">' + tg(d.hasVars, 'a.hasVars', '', 'a-food') + '<span>Has variations (e.g. Half/Full)</span></div>' +
        pricing +
        '<div class="note info" style="margin-top:14px">' + Z.icon('info') + '<div><b>Price change</b> · Changing a price updates live cart and reorder prices; past orders keep their price.</div></div>' +
        '</div><div class="sticky"><div class="btn-row"><button class="btn ghost" data-back>Cancel</button><button class="btn" style="flex:2" data-act="a.saveItem" data-item="' + (p.item || '') + '" data-shop="' + shopId + '">' + (p.item ? 'Save Changes' : 'Save Item') + '</button></div></div>';
    },
    notes: {
      purpose: 'Create or edit a dish: name, category, image, veg/non-veg, availability and either one price or a set of variations.',
      points: ['ITEM: Name *, Description, Category * (existing-category chips), Item image, Type pills 🟢 Veg / 🔴 Non-veg, Available toggle.',
        'PRICING: "Has variations (e.g. Half/Full)" off → Price (₹) *; on → QUICK-ADD presets and variation cards (Label, Price, Default radio, Available, ✕ Remove) + "+ Add Variation".',
        'Exactly one default variation (server error "Pick exactly one default variation (got N)").',
        'Live price: try it. Raise Chicken Biryani Full from ₹240 to ₹260, then in the customer app open order ZG1042 → Reorder: the recheck flags the price rise. Past orders keep ₹220.',
        'Dropped: Tamil / Malayalam name and label fields, Home priority (optional later).',
        'Update may warn "N variation(s) kept (referenced by customer carts)" as an info toast.'],
      data: ['rpc create_menu_item_with_variations(p_data)', 'rpc update_menu_item_with_variations(p_id, p_data) → {menu_item, warnings}', 'menu_item_variations (is_default, is_available, price)', 'edge r2-signed-url'],
      next: ['a-menu'], ref: OP + 'add_menu_item_screen.dart'
    }
  });
  function varsFromNames(names) { return names.map(function (n, i) { return { id: '', name: n, price: '', def: i === 0, avail: true }; }); }
  Z.on('a.pickCat', function (el) { Z.S.aItemDraft.cat = el.getAttribute('data-k'); Z.refresh(); });
  Z.on('a.itemImg', function () {
    Z.sheet('Item image', '<button class="a-srow" data-act="a.itemImgPick">📷 <span class="grow">Camera</span></button><button class="a-srow" data-act="a.itemImgPick">🖼️ <span class="grow">Gallery</span></button>',
      '<button class="btn outline block" data-act="closeOv">Cancel</button>');
  });
  Z.on('a.itemImgPick', function () { Z.S.aItemDraft.img = true; Z.closeOv(); Z.refresh(); Z.toast('Image ready · uploads on save'); });
  Z.on('a.itemImgX', function () { Z.S.aItemDraft.img = false; Z.refresh(); });
  Z.on('a.itemVeg', function (el) { Z.S.aItemDraft.veg = el.getAttribute('data-v') === '1'; Z.refresh(); });
  Z.on('a.itemDraftAvail', function () { Z.S.aItemDraft.avail = !Z.S.aItemDraft.avail; Z.refresh(); });
  Z.on('a.hasVars', function () {
    const d = Z.S.aItemDraft; d.hasVars = !d.hasVars;
    if (d.hasVars && !d.vars.length) d.vars = varsFromNames(['Half', 'Full']);
    Z.refresh();
  });
  Z.on('a.preset', function (el) { Z.S.aItemDraft.vars = varsFromNames(PRESETS[Number(el.getAttribute('data-i'))][1]); Z.refresh(); });
  Z.on('a.varAdd', function () { const d = Z.S.aItemDraft; d.vars.push({ id: '', name: '', price: '', def: !d.vars.length, avail: true }); Z.refresh(); });
  Z.on('a.varDel', function (el) {
    const d = Z.S.aItemDraft; const i = Number(el.getAttribute('data-i'));
    const wasDef = d.vars[i].def; d.vars.splice(i, 1);
    if (wasDef && d.vars.length) d.vars[0].def = true;
    Z.refresh();
  });
  Z.on('a.varDef', function (el) { const i = Number(el.getAttribute('data-i')); Z.S.aItemDraft.vars.forEach(function (v, j) { v.def = j === i; }); Z.refresh(); });
  Z.on('a.varAvail', function (el) { const v = Z.S.aItemDraft.vars[Number(el.getAttribute('data-i'))]; v.avail = !v.avail; Z.refresh(); });
  Z.on('a.saveItem', function (el) {
    const d = Z.S.aItemDraft, id = el.getAttribute('data-item'), shop = el.getAttribute('data-shop');
    d.err = '';
    const names = d.vars.map(function (v) { return (v.name || '').trim().toLowerCase(); });
    if (!(d.name || '').trim()) d.err = 'Name is required';
    else if (!(d.cat || '').trim()) d.err = 'Category is required';
    else if (!d.hasVars && !(Number(d.price) > 0)) d.err = 'Price is required (or add variations)';
    else if (d.hasVars && !d.vars.length) d.err = 'Price is required (or add variations)';
    else if (d.hasVars && names.some(function (n) { return !n; })) d.err = 'Every variation needs a label';
    else if (d.hasVars && names.some(function (n, i) { return names.indexOf(n) !== i; })) d.err = 'Duplicate variation label: "' + d.vars[names.findIndex(function (n, i) { return names.indexOf(n) !== i; })].name + '"';
    else if (d.hasVars && d.vars.some(function (v) { return !(Number(v.price) > 0); })) d.err = 'Every variation needs a price';
    else if (d.hasVars && d.vars.filter(function (v) { return v.def; }).length !== 1) d.err = 'Pick exactly one default variation (got ' + d.vars.filter(function (v) { return v.def; }).length + ')';
    if (d.err) { Z.refresh(); return; }
    let vars = null;
    if (d.hasVars) {
      vars = d.vars.map(function (v) {
        return { id: v.id || v.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'), name: v.name.trim(), price: Number(v.price), avail: v.avail };
      });
      const di = d.vars.findIndex(function (v) { return v.def; });
      if (di > 0) vars.unshift(vars.splice(di, 1)[0]);
    }
    const data = { name: d.name.trim(), desc: d.desc, cat: d.cat.trim(), veg: d.veg, avail: d.avail };
    if (id) {
      const it = Z.item(id);
      const before = JSON.stringify(it.vars || it.price);
      Object.assign(it, data);
      if (vars) { it.vars = vars; delete it.price; } else { it.price = Number(d.price); delete it.vars; }
      const changed = before !== JSON.stringify(it.vars || it.price);
      Z.S.aItemDraft = null; Z.back();
      Z.toast(changed ? 'Item saved · new price is live for carts and reorders' : 'Item saved');
    } else {
      const it = Object.assign({ id: 'i' + (Z.D.items.length + 100), shop: shop, e: d.veg ? '🥗' : '🍗' }, data);
      if (vars) it.vars = vars; else it.price = Number(d.price);
      Z.D.items.push(it);
      Z.S.aItemDraft = null; Z.back(); Z.toast('Item added to the menu');
    }
  });

  /* ======================================================================
     INSIGHTS
     ====================================================================== */
  function reportData(k) {
    const w = Z.D.week;
    if (k === 'today') {
      const hrs = ['11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p'];
      const f = [2, 6, 9, 5, 2, 2, 3, 5, 11, 13, 9, 5];
      const tot = f.reduce(function (a, b) { return a + b; }, 0);
      const last = w[w.length - 1];
      return { label: 'today, by hour', series: hrs.map(function (h, i) { return { d: h, orders: Math.round(last.orders * f[i] / tot), revenue: Math.round(last.revenue * f[i] / tot / 10) * 10 }; }), prev: { orders: 66, revenue: 20480 }, cancel: 2.8, pcancel: 3.1, mult: 1 / 7 };
    }
    if (k === '30d' || k === 'custom') {
      const s = [];
      for (let i = 0; i < 30; i++) { const b = w[i % 7]; const g = 0.86 + (i / 29) * 0.18 + ((i * 7) % 5) * 0.012; s.push({ d: String(((i + 24) % 30) + 1), orders: Math.round(b.orders * g), revenue: Math.round(b.revenue * g / 10) * 10 }); }
      return { label: 'last 30 days', series: s, prev: { orders: 2080, revenue: 628400 }, cancel: 3.6, pcancel: 4.2, mult: 30 / 7 };
    }
    return { label: 'last 7 days', series: w.slice(), prev: { orders: 498, revenue: 152300 }, cancel: 3.4, pcancel: 4.1, mult: 1 };
  }
  function delta(cur, prev, invert) {
    const pct = prev ? (cur - prev) / prev * 100 : 0;
    const up = pct >= 0;
    const good = invert ? !up : up;
    return '<div class="a-kd ' + (good ? 'up' : 'down') + '">' + (up ? '▲ ' : '▼ ') + Math.abs(pct).toFixed(1) + '% vs previous</div>';
  }
  function niceStep(v) { const p = Math.pow(10, Math.floor(Math.log10(v))); const n = v / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p; }
  // single-series chart (one y-axis): kind 'line' or 'bar'
  function chartSvg(series, key, kind, color, fmtY, fmtTip) {
    const W = 340, H = 170, L = 38, R = 8, T = 10, B = 22;
    const iw = W - L - R, ih = H - T - B;
    const dmax = Math.max.apply(null, series.map(function (x) { return x[key]; }));
    const stp = niceStep(dmax / 4), ticks = Math.ceil(dmax / stp), max = stp * ticks;
    const n = series.length;
    const step = iw / n;
    const xc = function (i) { return L + step * i + step / 2; };
    const y = function (v) { return T + ih - v / max * ih; };
    let g = '';
    for (let i = 0; i <= ticks; i++) {
      const v = stp * i, yy = y(v);
      g += '<line class="' + (i ? 'grid' : 'axis') + '" x1="' + L + '" x2="' + (W - R) + '" y1="' + yy + '" y2="' + yy + '"/>' +
        '<text x="' + (L - 6) + '" y="' + (yy + 3) + '" text-anchor="end">' + fmtY(v) + '</text>';
    }
    const every = n > 14 ? 5 : n > 8 ? 2 : 1;
    series.forEach(function (s, i) { if (i % every === 0 || i === n - 1) g += '<text x="' + xc(i) + '" y="' + (H - 6) + '" text-anchor="middle">' + s.d + '</text>'; });
    let marks = '';
    if (kind === 'line') {
      const pts = series.map(function (s, i) { return xc(i).toFixed(1) + ',' + y(s[key]).toFixed(1); }).join(' ');
      marks += '<polyline points="' + pts + '" fill="none" stroke="' + color + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>';
      const li = n - 1;
      marks += '<circle cx="' + xc(li) + '" cy="' + y(series[li][key]) + '" r="4" fill="' + color + '" stroke="#fff" stroke-width="2"/>';
    }
    series.forEach(function (s, i) {
      const tx = Math.min(Math.max(xc(i), L + 40), W - R - 40), ty = Math.max(y(s[key]) - 26, T);
      let m = '';
      if (kind === 'bar') {
        const bw = Math.max(Math.min(step - 4, 22), 3), bh = Math.max(ih - (y(s[key]) - T), 1), bx = xc(i) - bw / 2, by = y(s[key]);
        const r = Math.min(4, bw / 2);
        m = '<path class="mk" d="M' + bx + ',' + (by + bh) + 'V' + (by + r) + 'q0,-' + r + ' ' + r + ',-' + r + 'H' + (bx + bw - r) + 'q' + r + ',0 ' + r + ',' + r + 'V' + (by + bh) + 'Z" fill="' + color + '"/>';
      } else {
        m = '<circle class="mk" cx="' + xc(i) + '" cy="' + y(s[key]) + '" r="3" fill="' + color + '" stroke="#fff" stroke-width="1.5" opacity="0"/>';
      }
      marks += '<g class="pt">' + m + '<rect class="hit" x="' + (L + step * i) + '" y="' + T + '" width="' + step + '" height="' + ih + '"/>' +
        '<g class="tip"><rect x="' + (tx - 38) + '" y="' + ty + '" width="76" height="18" rx="4"/><text x="' + tx + '" y="' + (ty + 12) + '" text-anchor="middle">' + s.d + ' · ' + fmtTip(s[key]) + '</text></g></g>';
    });
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img">' + g + marks + '</svg>';
  }
  const kfmt = function (v) { return v >= 1000 ? '₹' + (v / 1000).toFixed(v % 1000 ? 1 : 0) + 'k' : '₹' + Math.round(v); };
  Z.screen('admin', {
    id: 'a-reports', group: 'Insights', title: 'Reports', route: '/reports', sb: 'light',
    render: function () {
      const k = Z.S.reportRange || '7d';
      const R = reportData(k);
      const orders = R.series.reduce(function (a, s) { return a + s.orders; }, 0);
      const rev = R.series.reduce(function (a, s) { return a + s.revenue; }, 0);
      const aov = rev / orders;
      const s = stats();
      const codPend = Z.S.orders.filter(function (o) { return Z.ACTIVE.indexOf(o.status) >= 0; }).reduce(function (a, o) { return a + Z.orderTotals(o).total; }, 0);
      const kpi = function (l, v, d) { return '<div class="kpi"><div class="k-l">' + l + '</div><div class="k-v">' + v + '</div>' + (d || '') + '</div>'; };
      const shops = Z.D.shops.filter(function (x) { return !x.deleted; });
      const tot30 = shops.reduce(function (a, x) { return a + (x.orders30 || 0); }, 0) || 1;
      const byShop = shops.map(function (x) { return { n: x.name, v: Math.round(rev * (x.orders30 || 0) / tot30 / 10) * 10 }; }).sort(function (a, b) { return b.v - a.v; });
      const bmax = byShop.length ? byShop[0].v || 1 : 1;
      const dishes = [['i1', 1.0], ['i12', 0.82], ['i9', 0.64], ['i4', 0.55], ['i14', 0.47]].filter(function (x) { return Z.item(x[0]); }).map(function (x) {
        const it = Z.item(x[0]); const q = Math.round(orders * 0.31 * x[1]);
        return { it: it, q: q, v: q * Z.fromPrice(it) };
      });
      const boys = Z.D.staff.filter(function (b) { return b.role === 'delivery'; }).map(function (b, i) {
        const base = [0.38, 0.34, 0.22, 0.06][i] || 0.1;
        return { b: b, n: Math.round(orders * base), t: [24, 27, 31, 29][i] || 28, cod: b.cod };
      });
      const chips = [['today', 'Today'], ['7d', '7 days'], ['30d', '30 days'], ['custom', 'Custom']];
      return Z.opBar('admin') + '<div class="scroll">' +
        '<div class="a-h"><h2>Reports</h2><button class="btn sm outline" data-act="a.csv">⬇ Export CSV</button></div>' +
        '<div class="chips" style="margin-bottom:12px">' + chips.map(function (c) { return '<button class="chip' + (k === c[0] ? ' a-or' : '') + '" data-act="a.rRange" data-k="' + c[0] + '">' + (c[0] === 'custom' && k === 'custom' ? '1 Sep – 30 Sep' : c[1]) + '</button>'; }).join('') + '</div>' +
        '<div class="kpis">' +
        kpi('Revenue (delivered)', Z.money(rev), delta(rev, R.prev.revenue)) +
        kpi('Orders', orders.toLocaleString('en-IN'), delta(orders, R.prev.orders)) +
        kpi('Avg order value', Z.money(aov), delta(aov, R.prev.revenue / R.prev.orders)) +
        kpi('Cancellation rate', R.cancel.toFixed(1) + '%', delta(R.cancel, R.pcancel, true)) +
        kpi('COD pending', Z.money(codPend), '<div class="a-kd" style="color:var(--a-text2)">cash with riders, live</div>') +
        (Z.FEATURES.deliveryRole ? kpi('Delivery boys online', s.online + ' / ' + Z.D.staff.filter(function (b) { return b.role === 'delivery' && b.active; }).length, '<div class="a-kd" style="color:var(--a-text2)">right now</div>') : kpi('Deliveries done', Z.S.orders.filter(function (o) { return o.status === 'delivered'; }).length, '<div class="a-kd" style="color:var(--a-text2)">by admins</div>')) +
        '</div>' +
        '<div class="chart" style="margin-top:12px"><div class="a-chart-t"><b>Revenue (delivered)</b><span>' + R.label + '</span></div>' +
        chartSvg(R.series, 'revenue', 'line', 'var(--brand)', kfmt, function (v) { return Z.money(v); }) + '</div>' +
        '<div class="chart" style="margin-top:10px"><div class="a-chart-t"><b>Orders</b><span>' + R.label + '</span></div>' +
        chartSvg(R.series, 'orders', 'bar', 'var(--food)', function (v) { return String(Math.round(v)); }, function (v) { return v + ' orders'; }) + '</div>' +
        '<div class="sec-h"><h4>Revenue by shop</h4></div>' +
        '<div class="card bars">' + byShop.map(function (x) { return '<div class="bar-r"><span class="bl">' + E(x.n) + '</span><span class="bt"><i style="width:' + Math.round(x.v / bmax * 100) + '%"></i></span><span class="bv">' + kfmt(x.v) + '</span></div>'; }).join('') + '</div>' +
        '<div class="sec-h"><h4>Top dishes</h4></div>' +
        '<div class="a-tblw"><table class="tbl"><thead><tr><th>Dish</th><th class="r">Qty</th><th class="r">Revenue</th></tr></thead><tbody>' +
        dishes.map(function (x) { return '<tr><td><div class="row" style="gap:6px">' + Z.veg(x.it.veg) + '<div><div style="font-weight:500">' + E(x.it.name) + '</div><div class="t-cap" style="font-size:10.5px">' + E(Z.shop(x.it.shop).name) + '</div></div></div></td><td class="r">' + x.q + '</td><td class="r">' + Z.money(x.v) + '</td></tr>'; }).join('') +
        '</tbody></table></div>' +
        (Z.FEATURES.deliveryRole ? '<div class="sec-h"><h4>Delivery boy performance</h4></div>' +
        '<div class="a-tblw"><table class="tbl"><thead><tr><th>Name</th><th class="r">Deliveries</th><th class="r">Avg time</th><th class="r">COD in hand</th></tr></thead><tbody>' +
        boys.map(function (x) { return '<tr><td><span class="a-dot' + (x.b.online ? ' on' : '') + '" style="display:inline-block;width:8px;height:8px;margin-right:6px"></span>' + E(x.b.name) + '</td><td class="r">' + x.n + '</td><td class="r">' + (x.n ? x.t + ' min' : '—') + '</td><td class="r">' + Z.money(x.cod) + '</td></tr>'; }).join('') +
        '</tbody></table></div>' : '') +
        '<div class="hint" style="margin-top:10px">Revenue counts delivered orders only (order total incl. delivery fee). Hover a chart for daily values.</div>' +
        '</div>' + Z.bottomNav('admin', 'a-reports');
    },
    notes: {
      purpose: 'Zugo addition: real reporting. one_place\'s Dashboard is a "Coming soon" placeholder and its only numbers are the Orders-screen stat tiles.',
      points: ['Date chips Today / 7 days (default) / 30 days / Custom. KPI tiles show ▲/▼ against the previous period of the same length (cancellation rate going down is green).',
        'Two single-axis charts (revenue line, orders bars) rather than one dual-axis chart; hover shows the value.',
        'Revenue by shop, Top dishes (qty + revenue) and Delivery boy performance (deliveries, avg time from Assigned to Delivered, COD in hand).',
        'COD in hand = delivered COD totals since the boy\'s last cash handover. one_place has no handover step; Zugo adds a "Cash received" action on the staff detail later if needed.',
        '⬇ Export CSV downloads the same numbers for the chosen range.'],
      data: ['NEW rpc get_admin_reports(p_from, p_to) → {totals, prev_totals, daily[], by_shop[], top_items[], by_delivery_boy[]} — extends get_admin_order_stats', 'orders, order_items, order_status_history (assigned → delivered durations)', 'rpc get_admin_order_stats(p_from, p_to) for the live tiles'],
      next: ['a-orders', 'a-staff'], ref: '/Users/macsolve/projects/one_place/apps/operator_app/lib/screens/dashboard_screen.dart (placeholder)'
    }
  });
  Z.on('a.rRange', function (el) { Z.S.reportRange = el.getAttribute('data-k'); Z.refresh(); });
  Z.on('a.csv', function () { Z.toast('Exported zugo-report-' + (Z.S.reportRange || '7d') + '.csv'); });

  /* ======================================================================
     TEAM
     ====================================================================== */
  function staffCard(b) {
    const del = b.role === 'delivery';
    return '<div class="a-card' + (b.active ? '' : ' dim') + '" data-go="a-staff-detail" ' + DP({ id: b.id }) + '><div class="row top" style="gap:12px">' +
      '<span class="avatar">' + initials(b.name) + '<span class="on-dot' + (b.online && b.active ? ' on' : '') + '"></span></span>' +
      '<div class="grow"><div class="row between"><b style="font-size:14px">' + E(b.name) + '</b>' +
      (b.active ? '<span class="tag ' + (b.online ? 'ok' : 'grey') + '">' + (b.online ? 'ONLINE' : 'OFFLINE') + '</span>' : '<span class="tag err">DEACTIVATED</span>') + '</div>' +
      '<div class="t-cap">' + E(b.phone) + (del && b.vehicle ? ' · ' + E(b.vehicle) : ' · ' + E(b.email)) + '</div>' +
      (del ? '<div class="row between" style="margin-top:6px;font-size:12px"><span>' + Z.activeFor(b.id) + ' active · ' + (b.today || 0) + ' today</span><span class="t-warn" style="font-weight:600">💵 ' + Z.money(b.cod || 0) + ' in hand</span></div>' : '') +
      '<div class="row between" style="margin-top:8px"><span class="a-tgrow" style="font-size:12px">' + tg(b.active, 'a.staffActive', 'data-id="' + b.id + '"') + (b.active ? 'Active' : 'Deactivated') + '</span><span class="t-hint">›</span></div>' +
      '</div></div></div>';
  }
  Z.screen('admin', {
    id: 'a-staff', group: 'Team', title: 'Staff', route: '/staff', sb: 'light',
    render: function () {
      if (!Z.FEATURES.deliveryRole) Z.S.aStaffTab = 'admin';
      const tab = st('aStaffTab', 'delivery');
      const dl = Z.D.staff.filter(function (s) { return s.role === 'delivery'; });
      const ad = Z.D.staff.filter(function (s) { return s.role === 'admin'; });
      const list = tab === 'delivery' ? dl : ad;
      return Z.opBar('admin') + (!Z.FEATURES.deliveryRole ? '' : '<div class="tabs-u"><button class="' + (tab === 'delivery' ? 'on' : '') + '" data-act="a.staffTab" data-k="delivery">Delivery boys (' + dl.length + ')</button><button class="' + (tab === 'admin' ? 'on' : '') + '" data-act="a.staffTab" data-k="admin">Admins (' + ad.length + ')</button></div>') +
        '<div class="scroll"><div class="a-h"><h2>' + (tab === 'delivery' ? 'Delivery Boys' : 'Admins') + '</h2><button class="btn sm" data-act="a.newStaff">+ Add Staff</button></div>' +
        (tab === 'delivery' ? '<div class="t-cap" style="margin:-4px 0 10px">' + dl.filter(function (b) { return b.online && b.active; }).length + ' online · ' + dl.reduce(function (a, b) { return a + Z.activeFor(b.id); }, 0) + ' active deliveries</div>' : '') +
        (!Z.FEATURES.deliveryRole ? '<div class="note info" style="margin-bottom:12px">' + Z.icon('info') + '<div>MVP: every staff member is an admin who can accept and deliver orders. Delivery-boy accounts arrive in Phase 2.</div></div>' : '') +
        (list.length ? list.map(staffCard).join('') : '<div class="empty"><div class="em-i">👥</div><div class="em-t">No Delivery Boys</div><div class="em-d">Add your first delivery boy to get started</div></div>') +
        '</div>' + Z.bottomNav('admin', 'a-staff');
    },
    notes: {
      purpose: 'Zugo addition beyond one_place (which only lists and creates delivery boys): both roles, live load, cash in hand and activate/deactivate.',
      points: ['Tabs "Delivery boys (n)" / "Admins (n)". Card: avatar with online dot, name, phone, vehicle, ONLINE/OFFLINE, "N active · M today", COD in hand, Active toggle.',
        'Deactivate = admin_set_staff_active(false) + auth ban (edge function), and the boy is forced offline. Active orders stay assigned until reassigned.',
        'Deactivated boys drop out of the assign sheet (try it, then open an order\'s assign pill).',
        'Tap a card → staff detail. "+ Add Staff" → create account.'],
      data: ['profiles where role in (delivery_boy, admin)', 'rpc get_assignable_delivery_boys() (active order counts)', 'NEW rpc admin_set_staff_active(p_user_id, p_active) + edge set-user-ban', 'profiles.vehicle_number (Zugo addition)'],
      next: ['a-staff-detail', 'a-staff-form'], ref: OP + 'delivery_boys_screen.dart'
    }
  });
  Z.on('a.staffTab', function (el) { Z.S.aStaffTab = el.getAttribute('data-k'); Z.refresh(); });
  Z.on('a.newStaff', function () { Z.S.aStaffDraft = null; Z.go('a-staff-form', {}); });
  function setActive(id) {
    const b = Z.staff(id);
    b.active = !b.active;
    if (!b.active) b.online = false;
    Z.closeOv(); Z.refresh(); Z.toast(b.active ? E(b.name) + ' reactivated' : E(b.name) + ' deactivated and signed out');
  }
  Z.on('a.staffActive', function (el) {
    const b = Z.staff(el.getAttribute('data-id'));
    if (!b.active) { setActive(b.id); return; }
    const n = Z.activeFor(b.id);
    confirmDlg('Deactivate ' + E(b.name) + '?', 'They are signed out and cannot log in until reactivated.' + (n ? ' ' + n + ' active order' + (n > 1 ? 's stay' : ' stays') + ' assigned; reassign from Orders.' : ''), 'a.staffActiveGo', 'Deactivate', 'data-id="' + b.id + '"', true);
  });
  Z.on('a.staffActiveGo', function (el) { setActive(el.getAttribute('data-id')); });

  Z.screen('admin', {
    id: 'a-staff-form', group: 'Team', title: 'Add staff', route: '/staff/add', sb: 'light',
    render: function () {
      const d = Z.S.aStaffDraft || (Z.S.aStaffDraft = { role: (Z.S.aStaffTab === 'admin' || !Z.FEATURES.deliveryRole) ? 'admin' : 'delivery', name: '', phone: '', email: '', password: '', vehicle: '', err: '' });
      return Z.appBar({ back: true, title: 'Add Staff' }) + '<div class="scroll">' +
        (d.err ? '<div class="note err a-err">' + Z.icon('warn') + '<div>' + E(d.err) + '</div></div>' : '') +
        (!Z.FEATURES.deliveryRole ? '' : field('Role', '<div class="seg"><button class="' + (d.role === 'delivery' ? 'on' : '') + '" data-act="a.staffRole" data-k="delivery">🛵 Delivery boy</button><button class="' + (d.role === 'admin' ? 'on' : '') + '" data-act="a.staffRole" data-k="admin">🧑‍💼 Admin</button></div>')) +
        field('Full Name', inp('aStaffDraft.name', 'Enter full name')) +
        field('Phone', inp('aStaffDraft.phone', 'Enter phone number', 'tel')) +
        field('Email', inp('aStaffDraft.email', 'Enter email address', 'email')) +
        field('Password', inp('aStaffDraft.password', 'Min 6 characters', 'password'), 'Share it with them; they can change it from Profile.') +
        (d.role === 'delivery' ? field('Vehicle number', inp('aStaffDraft.vehicle', 'e.g. KL-07-AB-1234'), 'Shown to admins on the assign sheet.') : '') +
        '<button class="btn block" style="margin-top:20px" data-act="a.createStaff">Create Account</button>' +
        '<div class="hint t-center" style="margin-top:10px">The account is confirmed automatically. They sign in with this email in Zugo Operator.</div>' +
        '</div>';
    },
    notes: {
      purpose: 'Create a delivery boy or admin account.',
      points: ['one_place fields kept: Full Name, Phone, Email, Password (Min 6 characters), "Create Account".',
        'Zugo addition: Role segmented control (one_place UI creates delivery boys only, although create-user accepts admin) and Vehicle number for delivery boys.',
        'Errors: "All fields are required", "Password must be at least 6 characters", "This email is already in use".'],
      data: ['edge create-user {email, password, full_name, phone, role: delivery_boy | admin, vehicle_number}'],
      next: ['a-staff'], ref: '/Users/macsolve/projects/one_place/apps/operator_app/lib/screens/add_delivery_boy_screen.dart'
    }
  });
  Z.on('a.staffRole', function (el) { Z.S.aStaffDraft.role = el.getAttribute('data-k'); Z.refresh(); });
  Z.on('a.createStaff', function () {
    const d = Z.S.aStaffDraft; d.err = '';
    const em = (d.email || '').trim().toLowerCase();
    if (!d.name || !d.phone || !em || !d.password) d.err = 'All fields are required';
    else if (d.password.length < 6) d.err = 'Password must be at least 6 characters';
    else if (Z.D.staff.some(function (s) { return s.email === em; })) d.err = 'This email is already in use';
    if (d.err) { Z.refresh(); return; }
    const s = { id: 'st' + (Z.D.staff.length + 20), name: d.name.trim(), role: d.role, phone: d.phone.trim(), email: em, online: false, active: true };
    if (d.role === 'delivery') Object.assign(s, { vehicle: d.vehicle || '', today: 0, cod: 0 });
    Z.D.staff.push(s);
    Z.S.aStaffTab = d.role; Z.S.aStaffDraft = null;
    Z.back(); Z.toast('Account created for ' + E(s.name));
  });

  Z.screen('admin', {
    id: 'a-staff-detail', group: 'Team', title: 'Staff detail', route: '/staff/:id', sb: 'light',
    defaults: function () { return { id: 'st1' }; },
    render: function (p) {
      const b = Z.staff(p.id || 'st1') || Z.staff('st1');
      const del = b.role === 'delivery';
      const orders = Z.S.orders.filter(function (o) { return o.rider === b.id; });
      const kpi = function (l, v) { return '<div class="kpi"><div class="k-l">' + l + '</div><div class="k-v" style="font-size:18px">' + v + '</div></div>'; };
      return Z.appBar({ back: true, title: E(b.name), sub: del ? 'Delivery boy' : 'Admin' }) + '<div class="scroll stack-12">' +
        '<div class="card flat"><div class="row" style="gap:12px"><span class="avatar s48">' + initials(b.name) + '<span class="on-dot' + (b.online && b.active ? ' on' : '') + '"></span></span>' +
        '<div class="grow"><div class="t-sub">' + E(b.name) + '</div><div class="row" style="gap:6px;margin-top:2px">' + (b.active ? '<span class="tag ' + (b.online ? 'ok' : 'grey') + '">' + (b.online ? 'ONLINE' : 'OFFLINE') + '</span>' : '<span class="tag err">DEACTIVATED</span>') + '<span class="tag brand">' + (del ? 'Delivery boy' : 'Admin') + '</span></div></div></div>' +
        '<dl class="kv" style="margin:12px 0 0"><dt>Phone</dt><dd>' + E(b.phone) + '</dd><dt>Email</dt><dd>' + E(b.email) + '</dd>' + (del ? '<dt>Vehicle</dt><dd>' + E(b.vehicle || '—') + '</dd>' : '') + '<dt>Last seen</dt><dd>' + (b.online ? 'Now' : 'Today · 6:10 PM') + '</dd></dl></div>' +
        (del ? '<div class="sec-h"><h4>Today</h4></div><div class="kpis">' + kpi('Deliveries', b.today || 0) + kpi('Active now', Z.activeFor(b.id)) + kpi('COD in hand', Z.money(b.cod || 0)) + kpi('Avg delivery time', b.today ? '24 min' : '—') + '</div>' +
          '<div class="sec-h"><h4>Recent deliveries</h4><span class="pill-count">' + orders.length + '</span></div>' +
          (orders.length ? '<div class="list">' + orders.map(function (o) {
            return '<button class="li" data-go="a-order" ' + DP({ id: o.id }) + '><div class="grow"><div class="li-t">#' + o.id + ' · ' + E(Z.shop(o.shop).name) + '</div><div class="li-s">' + E(o.date || o.placedAgo) + ' · ' + E(o.recipient || o.customer) + '</div></div>' +
              '<div class="col" style="gap:2px;align-items:flex-end">' + Z.badge(o.status) + '<span class="num" style="font-size:12px;font-weight:600">' + Z.money(Z.orderTotals(o).total) + '</span></div></button>';
          }).join('') + '</div>' : '<div class="t-cap">No deliveries yet.</div>') : '') +
        '<div class="col" style="margin-top:16px"><button class="btn outline block" data-act="a.call" data-ph="' + E(b.phone) + '">📞 Call ' + E(b.name.split(' ')[0]) + '</button>' +
        '<button class="btn outline block" data-act="a.resetPw" data-id="' + b.id + '">🔑 Reset password</button>' +
        (b.active ? '<button class="btn danger-outline block" data-act="a.staffActive" data-id="' + b.id + '">Deactivate</button>' : '<button class="btn success block" data-act="a.staffActive" data-id="' + b.id + '">Reactivate</button>') + '</div>' +
        '</div>';
    },
    notes: {
      purpose: 'Zugo addition: one person\'s profile, today\'s numbers, recent deliveries and account actions.',
      points: ['Today: deliveries, active now, COD in hand, average delivery time (assigned → delivered).',
        'Recent deliveries open the admin order detail.',
        'Reset password sets a new password via an admin-only edge function; Deactivate bans the auth user and hides them from assignment.'],
      data: ['profiles', 'orders where delivery_boy_id = :id', 'NEW edge admin-reset-password {user_id, password}', 'NEW rpc admin_set_staff_active(p_user_id, p_active)'],
      next: ['a-order', 'a-staff'], ref: 'Zugo addition (no one_place equivalent)'
    }
  });
  Z.on('a.resetPw', function (el) {
    const b = Z.staff(el.getAttribute('data-id'));
    Z.S.aNewPw = '';
    Z.sheet('Reset password', '<div class="t-cap" style="margin-bottom:10px">Set a new password for ' + E(b.name) + '. They are signed out of other devices.</div>' + field('New password', inp('aNewPw', 'Min 6 characters', 'password')),
      '<button class="btn block" data-act="a.resetPwGo" data-id="' + b.id + '">Save password</button>');
  });
  Z.on('a.resetPwGo', function (el) {
    if ((Z.S.aNewPw || '').length < 6) { Z.toast('Password must be at least 6 characters'); return; }
    Z.closeOv(); Z.toast('Password reset. Share it with ' + E(Z.staff(el.getAttribute('data-id')).name));
  });

  /* ======================================================================
     SETTINGS
     ====================================================================== */
  const TILES = [
    ['🚚', 'Delivery Pricing', 'Delivery charge, platform fee, GST, payment methods, minimum cart', 'go', 'a-cfg-pricing'],
    ['🕒', 'Availability & Hours', 'Pause checkout, food service hours', 'go', 'a-cfg-hours'],
    ['📍', 'Service Area', 'Service centre and delivery radius', 'go', 'a-cfg-area'],
    ['🖼️', 'Food Banners', 'Home carousel images', 'go', 'a-banners'],
    ['📣', 'Send Notification', 'Push a message to customers or staff', 'go', 'a-broadcast'],
    ['🆘', 'Support Contact', 'WhatsApp number and high-traffic message', 'act', 'a.cfgSupport'],
    ['📱', 'App Versions', 'Minimum versions and force update', 'act', 'a.cfgVersions'],
    ['💬', 'Feedback', 'Customer feedback inbox', 'act', 'a.feedback']
  ];
  Z.screen('admin', {
    id: 'a-settings', group: 'Settings', title: 'Settings', route: '/settings', sb: 'light',
    render: function () {
      Z.S.aCfgDraft = null;
      const me = Z.staff('st4');
      return Z.opBar('admin') + '<div class="scroll">' +
        '<div class="a-h" style="margin-bottom:2px"><h2>Settings</h2></div><div class="t-cap" style="margin-bottom:14px">Manage customer touchpoints and platform configuration.</div>' +
        TILES.map(function (t) {
          return '<button class="a-tile" ' + (t[3] === 'go' ? 'data-go="' + t[4] + '"' : 'data-act="' + t[4] + '"') + '><span class="em">' + t[0] + '</span><span class="grow"><div class="t">' + t[1] + '</div><div class="s">' + t[2] + '</div></span><span class="chv">›</span></button>';
        }).join('') +
        '<div class="sec-h"><h4>Account</h4></div>' +
        '<button class="a-tile" data-go="a-profile"><span class="avatar" style="width:36px;height:36px;font-size:12px">' + initials(me.name) + '</span><span class="grow"><div class="t">' + E(me.name) + '</div><div class="s">' + E(me.email) + ' · Admin</div></span><span class="chv">›</span></button>' +
        '<button class="a-tile" data-act="a.logout"><span class="em">🚪</span><span class="grow"><div class="t t-err">Logout</div></span></button>' +
        '<div class="hint t-center" style="margin-top:16px">Zugo Operator v1.0.0 (1)</div>' +
        '</div>' + Z.bottomNav('admin', 'a-settings');
    },
    notes: {
      purpose: 'Settings hub. Every tile edits app_config keys or a customer touchpoint.',
      points: ['one_place splits this into Settings → Configuration → sub-screens; Zugo flattens it to one list (food only, no Categories / Attributes / Delivery Slots).',
        'Support Contact, App Versions and Feedback open as sheets in this mockup; in the app they are full screens like one_place.',
        'Profile row and Logout (confirm "Are you sure you want to logout?").'],
      data: ['app_config (key, value jsonb) — admin upsert via RLS', 'customer_version_config / operator_version_config', 'rpc list_feedbacks_admin'],
      next: ['a-cfg-pricing', 'a-cfg-hours', 'a-cfg-area', 'a-banners', 'a-broadcast', 'a-profile'], ref: OP + 'settings_screen.dart'
    }
  });
  Z.on('a.logout', function () {
    Z.dialog('<div class="dialog-t">Logout</div><div class="dialog-d">Are you sure you want to logout?</div><div class="btn-row"><button class="btn neutral" data-act="closeOv">Cancel</button><button class="btn danger" data-act="a.logoutGo">Logout</button></div>');
  });
  Z.on('a.logoutGo', function () { Z.closeOv(); Z.S.loggedIn.admin = false; Z.go('a-login', {}, { root: true }); });
  Z.on('a.cfgSupport', function () {
    cfgDraft();
    Z.sheet('Support Contact & High Traffic', field('WhatsApp number', inp('aCfgDraft.support_whatsapp_number', '+91 …', 'tel'), 'Powers the customer "Contact Support" button.') +
      field('Support phone', inp('aCfgDraft.support_phone', '+91 …', 'tel')) +
      field('Threshold (orders / delivery boy)', inp('aCfgDraft.high_traffic_threshold', '5', 'number')) +
      field('Message shown to customers', area('aCfgDraft.high_traffic_message', '', 2)),
      '<button class="btn block" data-act="a.cfgSaveSheet">Save Configuration</button>');
  });
  Z.on('a.cfgVersions', function () {
    cfgDraft();
    Z.sheet('App Versions', field('Customer app · min version', inp('aCfgDraft.customer_min_version', '1.0.0')) +
      field('Operator app · min version', inp('aCfgDraft.operator_min_version', '1.0.0')) +
      '<div class="a-tgrow" style="margin-top:14px">' + tg(Z.S.aCfgDraft.force_update, 'a.cfgTgSheet', 'data-k="force_update"') + '<span>Force update — make the dialog non-dismissible</span></div>',
      '<button class="btn block" data-act="a.cfgSaveSheet">Save Configuration</button>');
  });
  Z.on('a.cfgTgSheet', function (el) { const k = el.getAttribute('data-k'); Z.S.aCfgDraft[k] = !Z.S.aCfgDraft[k]; el.classList.toggle('on'); });
  Z.on('a.cfgSaveSheet', function () { commitCfg(); Z.closeOv(); Z.toast('Configuration saved'); });
  Z.on('a.feedback', function () {
    const fb = [['Delivery was late by 20 min', 'Asha K · +91 99610 22003', 'Open', 'warn'], ['Add more breakfast options in Kakkanad', 'Nikhil P · +91 99610 22002', 'In progress', 'brand'], ['Biryani was great, thanks!', 'Meera S · +91 99610 22001', 'Resolved', 'ok']];
    Z.sheet('Feedback', '<div class="chips" style="margin-bottom:10px"><span class="chip blue">All · 3</span><span class="chip">Open · 1</span><span class="chip">In progress · 1</span><span class="chip">Resolved · 1</span></div>' +
      fb.map(function (f) { return '<div class="card flat" style="margin-bottom:8px"><div class="row between top"><b style="font-size:13px">' + f[0] + '</b><span class="tag ' + f[3] + '">' + f[2] + '</span></div><div class="t-cap" style="margin-top:4px">' + f[1] + '</div><div class="row" style="margin-top:6px"><button class="a-tx b" style="padding:0" data-act="a.call" data-ph="' + f[1].split(' · ')[1] + '">Call</button><button class="a-tx g" data-act="a.shareGo" data-m="Opening WhatsApp…">WhatsApp</button></div></div>'; }).join(''));
  });

  /* ---------------- config drafts ---------------- */
  function cfgDraft() { if (!Z.S.aCfgDraft) Z.S.aCfgDraft = JSON.parse(JSON.stringify(Z.D.config)); return Z.S.aCfgDraft; }
  const NUMS = ['normal_limit_km', 'normal_base_charge', 'normal_beyond_charge', 'normal_extra_per_km', 'minimum_cart_value', 'service_center_lat', 'service_center_lng', 'service_radius_km', 'high_traffic_threshold'];
  function numify(d) {
    const o = JSON.parse(JSON.stringify(d));
    NUMS.forEach(function (k) { if (o[k] !== undefined) o[k] = Number(o[k]) || 0; });
    o.platform_fee.amount = Number(o.platform_fee.amount) || 0; o.service_gst.pct = Number(o.service_gst.pct) || 0;
    return o;
  }
  function commitCfg() { Object.assign(Z.D.config, numify(cfgDraft())); Z.S.aCfgDraft = null; }
  function example(d) {
    const saved = Z.D.config;
    Z.D.config = numify(d);
    const r = [1.8, 2.7, 4.3].map(function (km) { return km + ' km → ' + Z.money(Z.deliveryFee(km).fee); }).join(' · ');
    Z.D.config = saved;
    return r;
  }
  function cfgTg(path, danger) { return tg(Z.getPath(Z.S.aCfgDraft, path), 'a.cfgTg', 'data-k="' + path + '"', danger ? 'a-red' : ''); }
  Z.on('a.cfgTg', function (el) { const k = el.getAttribute('data-k'); setPath(Z.S.aCfgDraft, k, !Z.getPath(Z.S.aCfgDraft, k)); Z.refresh(); });
  Z.on('a.cfgSave', function (el) { commitCfg(); Z.refresh(); Z.toast(el.getAttribute('data-m') || 'Configuration saved'); });
  const saveBtn = function (m) { return '<button class="btn block" style="margin-top:16px" data-act="a.cfgSave" data-m="' + m + '">Save Configuration</button>'; };
  function liveExample(root) {
    root.querySelectorAll('[data-model^="aCfgDraft.normal_"]').forEach(function (i) {
      i.addEventListener('input', function () { const ex = root.querySelector('#a-ex'); if (ex) ex.textContent = 'Example: ' + example(Z.S.aCfgDraft); });
    });
  }

  Z.screen('admin', {
    id: 'a-cfg-pricing', group: 'Settings', title: 'Delivery pricing', route: '/config/delivery-pricing', sb: 'light',
    render: function () {
      const d = cfgDraft();
      const m = function (k) { return 'aCfgDraft.' + k; };
      return Z.appBar({ back: true, title: 'Delivery Pricing & Platform Fee' }) + '<div class="scroll">' +
        '<div class="a-cfg"><h4>Normal Delivery Charge</h4><div class="hint">' + (d.normal_delivery_enabled ? 'Delivery fee applied per the values below.' : 'All orders ship free.') + '</div>' +
        '<div class="a-tgrow" style="margin-bottom:12px">' + cfgTg('normal_delivery_enabled') + '<span>Charge for delivery</span></div>' +
        '<div class="a-2">' + field('Limit (km)', inp(m('normal_limit_km'), '2', 'number')) + field('Within limit charge (₹)', inp(m('normal_base_charge'), '20', 'number')) + '</div>' +
        '<div class="a-2" style="margin-top:12px">' + field('Beyond limit charge (₹)', inp(m('normal_beyond_charge'), '20', 'number')) + field('Extra per km (₹)', inp(m('normal_extra_per_km'), '8', 'number')) + '</div>' +
        '<div class="hint" style="margin-top:8px">Beyond the limit: beyond charge + extra per km × overage, rounded up to the next half km (≤ 1 km bills 1 km).</div>' +
        '<div class="a-ex" id="a-ex">Example: ' + example(d) + '</div></div>' +
        '<div class="a-cfg"><h4>Platform Fee</h4><div class="hint">Flat fee added to every order.</div><div class="row between">' + '<span class="a-tgrow">' + cfgTg('platform_fee.enabled') + 'Charge platform fee</span><div style="width:110px">' + inp(m('platform_fee.amount'), '₹', 'number') + '</div></div></div>' +
        '<div class="a-cfg"><h4>Service GST</h4><div class="hint">Applies to delivery and platform fees only (food GST is in menu prices).</div><div class="row between">' + '<span class="a-tgrow">' + cfgTg('service_gst.enabled') + 'Charge GST</span><div style="width:110px">' + inp(m('service_gst.pct'), '%', 'number') + '</div></div></div>' +
        '<div class="a-cfg"><h4>Payment Methods</h4><div class="hint">Regular orders.</div>' +
        '<div class="a-tgrow" style="margin-bottom:10px">' + cfgTg('normal_cod_enabled') + '<span>Cash on Delivery</span></div>' +
        '<div class="a-tgrow">' + cfgTg('normal_online_enabled') + '<span>Online Payment <span class="t-hint">(Razorpay, phase 2)</span></span></div></div>' +
        '<div class="a-cfg"><h4>Minimum Cart Value</h4><div class="hint">Customers see "Add ₹X more" below this.</div>' + field('Minimum amount (₹)', inp(m('minimum_cart_value'), '100', 'number')) + '</div>' +
        saveBtn('Pricing saved') + '</div>';
    },
    mount: liveExample,
    notes: {
      purpose: 'Delivery fee rules and order-level charges, stored in app_config.',
      points: ['Formula (one_place delivery_pricing.dart): within limit → base; beyond → beyond charge + billed km × extra per km. Overage ≤ 1 km bills 1 km, else whole km + 0.5 or + 1.',
        'The example line updates as you type (1.8 / 2.7 / 4.3 km).',
        'Saving is live: change "Within limit charge" to ₹25 and the customer cart fee changes.',
        'Dropped: prebooking delivery charge, Razorpay keys (online payment is phase 2).'],
      data: ['app_config: normal_delivery_enabled, normal_limit_km, normal_base_charge, normal_beyond_charge, normal_extra_per_km, platform_fee{enabled,amount}, service_gst{enabled,pct}, normal_cod_enabled, normal_online_enabled, minimum_cart_value'],
      next: ['a-settings'], ref: OP + 'config_delivery_pricing_screen.dart'
    }
  });

  Z.screen('admin', {
    id: 'a-cfg-hours', group: 'Settings', title: 'Availability & hours', route: '/config/availability', sb: 'light',
    render: function () {
      const d = cfgDraft();
      return Z.appBar({ back: true, title: 'Availability' }) + '<div class="scroll">' +
        '<div class="a-cfg"><h4>Common</h4><div class="hint">' + (d.checkout_disabled ? 'Customers cannot place any orders.' : 'Customers can place orders normally.') + '</div>' +
        '<div class="a-tgrow" style="margin-bottom:12px">' + cfgTg('checkout_disabled', true) + '<span' + (d.checkout_disabled ? ' class="t-err" style="font-weight:600"' : '') + '>Pause all checkout</span></div>' +
        field('Reason (shown when paused)', inp('aCfgDraft.checkout_disabled_reason', 'Today Closed')) + '</div>' +
        '<div class="a-cfg"><h4>🍔 Food</h4><div class="hint">' + (d.food_service_active ? 'Service is active.' : 'Service is paused — customers cannot order.') + '</div>' +
        '<div class="a-tgrow" style="margin-bottom:12px">' + cfgTg('food_service_active') + '<span>Service active</span></div>' +
        '<div class="a-2">' + field('Hours start (24h)', inp('aCfgDraft.food_hours_start', '10:00', 'time')) + field('Hours end (24h)', inp('aCfgDraft.food_hours_end', '23:00', 'time')) + '</div>' +
        '<div class="hint" style="margin-top:6px">Wrapping past midnight is supported (e.g. 18:00 → 02:00). Each restaurant also has its own hours.</div></div>' +
        saveBtn('Availability saved') + '</div>';
    },
    notes: {
      purpose: 'Emergency pause and daily food-service hours.',
      points: ['"Pause all checkout" (red when on) blocks ordering with the reason shown in the customer app.',
        'Food service active + hours start/end. Zugo adds a server-side check in place_order (one_place checks hours only in the client).',
        'Dropped: grocery / medicine / meat service cards.'],
      data: ['app_config: checkout_disabled, checkout_disabled_reason, food_service_active, food_hours_start, food_hours_end'],
      next: ['a-settings'], ref: OP + 'config_availability_screen.dart'
    }
  });

  Z.screen('admin', {
    id: 'a-cfg-area', group: 'Settings', title: 'Service area', route: '/config/service-area', sb: 'light',
    render: function () {
      const d = cfgDraft();
      const px = Math.max(40, Math.min(150, Number(d.service_radius_km) * 12));
      return Z.appBar({ back: true, title: 'Service Area' }) + '<div class="scroll">' +
        '<div class="a-cfg"><h4>Service Area</h4><div class="hint">Center point used for distance calculations + radius for which orders are accepted.</div>' +
        '<div class="map a-cal" style="margin-bottom:12px"><div class="ring" style="width:' + px + 'px;height:' + px + 'px"></div><div class="pin-shadow"></div><div class="pin">' + Z.icon('pin') + '</div>' +
        '<div class="map-lbl" style="left:8px;top:8px">' + E(d.service_center) + ' · ' + E(d.service_radius_km) + ' km</div></div>' +
        field('Service center latitude', inp('aCfgDraft.service_center_lat', '9.9971'), 'e.g. 9.9971 (decimal degrees)') +
        field('Service center longitude', inp('aCfgDraft.service_center_lng', '76.2999')) +
        field('Service radius (km)', inp('aCfgDraft.service_radius_km', '10', 'number'), 'Customers further than this can\'t place orders.') + '</div>' +
        saveBtn('Service area saved') + '</div>';
    },
    notes: {
      purpose: 'Hub point and delivery radius. Distance and delivery fee are measured from the service centre, not from the restaurant (one_place hub model).',
      points: ['Radius check runs in place_order; customers outside see "We don\'t deliver here yet".', 'The map ring previews the radius.'],
      data: ['app_config: service_center_lat, service_center_lng, service_radius_km', 'edge compute-distance (Distance Matrix)'],
      next: ['a-settings'], ref: OP + 'config_service_area_screen.dart'
    }
  });

  Z.screen('admin', {
    id: 'a-banners', group: 'Settings', title: 'Food banners', route: '/banners/food', sb: 'light',
    render: function () {
      const bs = Z.D.banners;
      return Z.appBar({ back: true, title: 'Food Banners' }) + '<div class="scroll">' +
        '<div class="t-cap" style="margin-bottom:10px">Shown above featured restaurants on the customer Home. Upload 16:9 images — off-ratio images crop to fit.</div>' +
        '<button class="btn block" style="background:var(--food);margin-bottom:14px" data-act="a.addBanner">+ Add banners</button>' +
        (bs.length ? bs.map(function (b, i) {
          const vis = b.visible !== false;
          return '<div class="a-ban">' + Z.img(b.e, b.cls === 'b2' ? 'warm' : b.cls === 'b3' ? 'green' : 'sky', '<div class="bt"><small>' + E(b.k) + '</small>' + E(b.t) + '</div>') +
            '<div class="row" style="padding:10px 12px"><span class="t-hint" style="cursor:grab">⋮⋮</span><div class="grow"><b style="font-size:13px">Banner #' + (i + 1) + '</b><div class="t-cap" style="color:' + (vis ? 'var(--a-success-ink)' : 'var(--a-text2)') + '">' + (vis ? 'Visible to customers' : 'Hidden — customer app skips this banner') + '</div></div>' +
            tg(vis, 'a.banVis', 'data-i="' + i + '"') + '<button class="ib" data-act="a.banDel" data-i="' + i + '" aria-label="Remove">' + Z.icon('close') + '</button></div></div>';
        }).join('') : '<div class="empty"><div class="em-i">🖼️</div><div class="em-t">No banners yet</div></div>') +
        '</div>';
    },
    notes: {
      purpose: 'Home carousel images for the customer app.',
      points: ['"+ Add banners" (multi-pick upload to R2 food/banners/), drag to reorder, visibility toggle, ✕ remove.',
        'Remove confirm: "This will delete the image from storage. To temporarily hide it instead, switch the visibility toggle off."'],
      data: ['app_config.food_banners {items:[{id, image_url, visible}]}', 'edge r2-signed-url'],
      next: ['a-settings'], ref: OP + 'food_banners_screen.dart'
    }
  });
  Z.on('a.addBanner', function () { Z.D.banners.push({ k: 'Weekend', t: 'Combo meals from ₹149', e: '🎉', cls: '' }); Z.refresh(); Z.toast('Uploaded 1 banner'); });
  Z.on('a.banVis', function (el) { const b = Z.D.banners[Number(el.getAttribute('data-i'))]; b.visible = b.visible === false; Z.refresh(); });
  Z.on('a.banDel', function (el) {
    confirmDlg('Remove banner?', 'This will delete the image from storage. To temporarily hide it instead, switch the visibility toggle off.', 'a.banDelGo', 'Remove', 'data-i="' + el.getAttribute('data-i') + '"', true);
  });
  Z.on('a.banDelGo', function (el) { Z.D.banners.splice(Number(el.getAttribute('data-i')), 1); Z.closeOv(); Z.refresh(); Z.toast('Banner removed'); });

  const AUD = [['customers', 'Customers', 1284], ['delivery', 'Delivery boys', 5], ['all', 'All', 1291]];
  Z.screen('admin', {
    id: 'a-broadcast', group: 'Settings', title: 'Send notification', route: '/push', sb: 'light',
    render: function () {
      const b = st('aBc', { aud: 'customers', title: 'Weekend biryani fest 🍛', body: 'Flat ₹50 off on biryanis from Malabar Biryani House till Sunday.', img: false });
      const a = AUD.find(function (x) { return x[0] === b.aud; });
      return Z.appBar({ back: true, title: 'Send Notification' }) + '<div class="scroll">' +
        field('Audience', '<div class="chips">' + AUD.map(function (x) { return '<button class="chip' + (b.aud === x[0] ? ' blue' : '') + '" data-act="a.aud" data-k="' + x[0] + '">' + x[1] + '</button>'; }).join('') + '</div>', 'Reaches ' + a[2].toLocaleString('en-IN') + ' registered devices.') +
        field('Title', inp('aBc.title', 'e.g. Free delivery tonight', 'text', ' maxlength="60" data-live')) +
        field('Message', area('aBc.body', 'What should they know?', 3)) +
        field('Image <span class="opt">(optional)</span>', b.img ? '<div style="position:relative;width:120px;height:68px">' + Z.img('🍛', 'warm', '') + '<button class="thumb-x" data-act="a.bcImg" aria-label="Remove">' + Z.icon('close') + '</button></div>'
          : '<div class="upl" style="width:120px;height:68px" data-act="a.bcImg">' + Z.icon('image') + '<span>Add image</span></div>') +
        '<div class="sec-h"><h4>Preview</h4></div>' +
        '<div class="a-pv">' + Z.logo(36, 'ic0') + '<div class="grow"><div class="ap"><span>' + (b.aud === 'delivery' ? 'ZUGO OPERATOR' : 'ZUGO') + '</span><span>now</span></div><div class="pt" id="a-pv-t">' + E(b.title || 'Title') + '</div><div class="pb" id="a-pv-b">' + E(b.body || 'Message') + '</div></div>' + (b.img ? Z.img('🍛', 'warm s40') : '') + '</div>' +
        '</div><div class="sticky"><button class="btn block" data-act="a.send">📣 Send to ' + a[1].toLowerCase() + '</button></div>';
    },
    mount: function (root) {
      root.querySelectorAll('[data-model^="aBc."]').forEach(function (i) {
        i.addEventListener('input', function () {
          const t = root.querySelector('#a-pv-t'), bd = root.querySelector('#a-pv-b');
          if (t) t.textContent = Z.S.aBc.title || 'Title'; if (bd) bd.textContent = Z.S.aBc.body || 'Message';
        });
      });
    },
    notes: {
      purpose: 'Send a push to customers, delivery boys or everyone (offers, closures, announcements).',
      points: ['Audience chips, title, message, optional image and a live preview of the notification.',
        'one_place ships a Push test screen and the fcm-broadcast function; Zugo turns it into a proper admin tool and logs each send.',
        'Order pushes (new order, assigned, status updates) are automatic and not sent from here.'],
      data: ['edge fcm-broadcast {audience: customer | delivery_boy | all, title, body, image_url}', 'device_tokens (by role)', 'NEW table broadcasts (audit log)'],
      next: ['a-settings'], ref: '/Users/macsolve/projects/one_place/supabase/functions/fcm-broadcast/index.ts'
    }
  });
  Z.on('a.aud', function (el) { Z.S.aBc.aud = el.getAttribute('data-k'); Z.refresh(); });
  Z.on('a.bcImg', function () { Z.S.aBc.img = !Z.S.aBc.img; Z.refresh(); });
  Z.on('a.send', function () {
    const b = Z.S.aBc;
    if (!(b.title || '').trim() || !(b.body || '').trim()) { Z.toast('Title and message are required'); return; }
    const a = AUD.find(function (x) { return x[0] === b.aud; });
    if (b.aud !== 'delivery') {
      Z.S.inbox.unshift({ t: b.title, b: b.body, ago: 'just now' });
      Z.notify('customer', { t: b.title, b: b.body });
    }
    Z.toast('Sent to ' + a[2].toLocaleString('en-IN') + ' devices');
  });

  Z.screen('admin', {
    id: 'a-profile', group: 'Settings', title: 'Profile', route: '/profile', sb: 'light',
    render: function () {
      const me = Z.staff('st4');
      return Z.appBar({ back: true, title: 'Profile' }) + '<div class="scroll">' +
        '<div class="row" style="gap:12px;margin:4px 0 16px"><span class="avatar s48">' + initials(me.name) + '</span><div><div class="t-title">' + E(me.name) + '</div><div class="t-cap">Zugo Operator · Admin</div></div></div>' +
        '<div class="card flat"><dl class="kv" style="margin:0"><dt>Name</dt><dd>' + E(me.name) + '</dd><dt>Phone</dt><dd>' + E(me.phone) + '</dd><dt>Email</dt><dd>' + E(me.email) + '</dd><dt>Role</dt><dd>Admin</dd></dl></div>' +
        '<button class="btn danger-outline block" style="margin-top:20px" data-act="a.logout">Logout</button>' +
        '</div>';
    },
    notes: {
      purpose: 'Who is signed in, and logout.',
      points: ['Name, Phone, Email, Role (Admin / Delivery Boy) like one_place.', 'Logout confirm "Are you sure you want to logout?" → Operator Login.'],
      data: ['profiles (current user)', 'supabase.auth.signOut + delete device token'],
      next: ['a-login'], ref: OP + 'profile_screen.dart'
    }
  });
})();
