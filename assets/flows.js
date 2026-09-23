/* Zugo mockups — "Flows" document page (viewer, not phone).
   Sources: reports backend-orders.md, customer-flow.md, operator-flow.md; core.js push texts. */
(function () {
  'use strict';
  const Z = window.Z;
  const esc = Z.esc;
  const ZA = '<span class="v-tag">Zugo addition</span>';

  Z.css('flows', [
    '.f-sec{margin-top:8px}',
    '.f-muted{color:var(--v-muted);font-size:13px}',
    '.f-mono{font-family:var(--mono);font-size:12px}',
    /* lifecycle */
    '.f-life{display:flex;align-items:stretch;gap:0;min-width:1030px}',
    '.f-state{flex:1 1 0;min-width:0;background:var(--v-surface-2);border:1px solid var(--v-line);border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px}',
    '.f-arrow{flex:0 0 26px;display:flex;align-items:center;justify-content:center;color:var(--v-muted)}',
    '.f-arrow svg{width:22px;height:22px}',
    '.f-st-h{display:flex;align-items:center;gap:8px}',
    '.f-dot{width:10px;height:10px;border-radius:3px;flex:0 0 auto}',
    '.f-st-name{font-weight:600;font-size:14px;color:var(--v-ink)}',
    '.f-st-enum{font-family:var(--mono);font-size:11px;color:var(--v-muted)}',
    '.f-k{font-size:10.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--v-muted);font-weight:600;margin-top:2px}',
    '.f-v{font-size:12.5px;color:var(--v-ink);line-height:1.45}',
    '.f-v code{font-size:11px}',
    '.f-push{border-left:3px solid var(--v-accent);background:var(--v-surface);border-radius:4px;padding:6px 8px;font-size:12px;line-height:1.4;color:var(--v-ink)}',
    '.f-push b{font-weight:600}',
    '.f-push .f-to{display:block;font-size:10.5px;color:var(--v-muted);text-transform:uppercase;letter-spacing:.05em;font-weight:600;margin-bottom:2px}',
    '.f-push.f-za{border-left-style:dashed}',
    '.f-cancel-row{display:flex;gap:12px;align-items:stretch;margin-top:14px;min-width:1030px}',
    '.f-cancel-lead{flex:0 0 220px;display:flex;flex-direction:column;justify-content:center;gap:4px;padding:8px 12px;border:1px dashed var(--v-line);border-radius:10px;font-size:12.5px;color:var(--v-muted)}',
    '.f-cancel-row .f-state{flex:1 1 auto}',
    '.f-pushes{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px}',
    /* swimlanes */
    '.f-lane{display:grid;grid-template-columns:130px minmax(0,1fr);gap:12px;padding:14px 0;border-bottom:1px solid var(--v-line)}',
    '.f-lane:last-child{border-bottom:0;padding-bottom:0}',
    '.f-lane:first-child{padding-top:0}',
    '.f-lane-h{font-weight:600;font-size:13.5px;color:var(--v-ink)}',
    '.f-lane-h small{display:block;font-weight:400;font-size:11.5px;color:var(--v-muted)}',
    '.f-chips{display:flex;flex-wrap:wrap;align-items:center;gap:6px 4px}',
    '.f-chips .v-link{display:inline-flex;align-items:center;gap:6px}',
    '.f-chips .v-link .f-n{font-family:var(--mono);font-size:10.5px;color:var(--v-muted)}',
    '.f-step{display:inline-flex;align-items:center;gap:4px}',
    '.f-to-arrow{color:var(--v-muted);font-size:13px;padding:0 2px}',
    '.f-chips .f-off{cursor:default;color:var(--v-muted);border-style:dashed}',
    '.f-chips .f-off:hover{border-color:var(--v-line);color:var(--v-muted)}',
    /* decision cards */
    '.f-opt{display:flex;flex-direction:column;gap:6px}',
    '.f-opt-h{display:flex;flex-wrap:wrap;align-items:center;gap:6px 8px;font-weight:600;font-size:14px;color:var(--v-ink)}',
    '.f-opt-h .f-em{font-size:18px}',
    '.f-opt p{margin:0;font-size:13px}',
    '.f-store{margin-top:14px}',
    /* sequence */
    '.f-seq{display:flex;flex-direction:column;gap:0}',
    '.f-seq-step{display:grid;grid-template-columns:32px minmax(0,1fr);gap:12px;position:relative;padding-bottom:16px}',
    '.f-seq-step:last-child{padding-bottom:0}',
    '.f-seq-step::before{content:"";position:absolute;left:15px;top:30px;bottom:0;width:2px;background:var(--v-line)}',
    '.f-seq-step:last-child::before{display:none}',
    '.f-seq-n{width:30px;height:30px;border-radius:8px;background:var(--v-accent-soft);color:var(--v-accent);font-weight:600;font-size:13px;display:flex;align-items:center;justify-content:center}',
    '.f-seq-t{font-weight:600;font-size:14px;color:var(--v-ink);margin-top:4px}',
    '.f-seq-d{font-size:13px;color:var(--v-ink);margin-top:2px}',
    '.f-who{font-size:11px;color:var(--v-muted);font-family:var(--mono)}',
    '.f-status-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:6px;margin-top:8px}',
    '.f-status-list div{font-size:12.5px;background:var(--v-surface-2);border:1px solid var(--v-line);border-radius:6px;padding:6px 8px}',
    /* fee */
    '.f-formula{font-family:var(--mono);font-size:12.5px;background:var(--v-surface-2);border:1px solid var(--v-line);border-radius:8px;padding:10px 12px;line-height:1.7;color:var(--v-ink)}',
    '.f-errs code{display:block;width:fit-content;margin-bottom:4px;white-space:normal}',
    '.f-errs br{display:none}',
    '.f-opt-h .v-tag{white-space:nowrap}',
    '.f-grid-4{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px}',
    '.f-num{text-align:right;font-variant-numeric:tabular-nums}',
    '@media (max-width:640px){.f-lane{grid-template-columns:minmax(0,1fr);gap:8px}.f-cancel-lead{flex-basis:180px}}'
  ].join('\n'));

  function arrowSvg() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>';
  }
  function push(to, title, body, za) {
    return '<div class="f-push' + (za ? ' f-za' : '') + '"><span class="f-to">' + to + (za ? ' · Zugo addition' : '') + '</span><b>' + esc(title) + '</b>' + (body ? '<br>' + esc(body) : '') + '</div>';
  }
  function stateCard(st, who, pushes) {
    const s = Z.STATUS[st];
    return '<div class="f-state">' +
      '<div class="f-st-h"><span class="f-dot" style="background:' + s.dot + '"></span><span class="f-st-name">' + esc(s.label) + '</span></div>' +
      '<div class="f-st-enum">' + st + '</div>' +
      '<div class="f-k">Moved here by</div><div class="f-v">' + who + '</div>' +
      '<div class="f-k">Push sent</div>' + pushes +
      '</div>';
  }

  function lifecycle() {
    const cards = [
      stateCard('placed',
        'Customer taps <b>Place order</b> (<code>place_order</code>).',
        push('All admins (MVP) · + delivery boys in Phase 2', '🛒 New Order #ZG1063', 'Rahul Nair · ₹420 · COD')),
      stateCard('assigned',
        '<b>MVP:</b> admin taps <b>✅ Accept</b>, which self-assigns the order to that admin (<code>assign_delivery_to_self</code>, allowed for admins). <b>Phase 2:</b> admin <code>assign_delivery</code> to a boy, or boy "Assign to me".',
        push('Customer', 'Delivery partner assigned', 'Anjali (Zugo) will pick up order ZG1063 from Malabar Biryani House.', true) +
        push('Assigned boy · Phase 2', '🛵 New delivery assigned', '#ZG1063 · Pickup at Malabar Biryani House · 2.7 km', true)),
      stateCard('checking',
        'The admin who accepted (MVP) or the boy (Phase 2): one step from Assigned.',
        push('Customer', 'Preparing your order', 'Malabar Biryani House is preparing order ZG1063.', true)),
      stateCard('delivering',
        'Whoever is delivering, when the food is collected. one_place label: "Pickup".',
        push('Customer', 'Out for delivery', 'Anjali (Zugo) picked up order ZG1063. Keep ₹420 cash ready.', true)),
      stateCard('delivered',
        'Whoever is delivering, at the door. Admin may skip straight here (e.g. self-pickup).',
        push('Customer', 'Delivered', 'Order ZG1063 delivered. Enjoy your meal!', true) +
        push('All admins', '✅ Delivered #ZG1063', 'Malabar Biryani House · Anjali (admin)', true))
    ];
    let row = '';
    cards.forEach(function (c, i) { row += c + (i < cards.length - 1 ? '<div class="f-arrow">' + arrowSvg() + '</div>' : ''); });

    const cancel = '<div class="f-state">' +
      '<div class="f-st-h"><span class="f-dot" style="background:' + Z.STATUS.cancelled.dot + '"></span><span class="f-st-name">Cancelled</span><span class="f-st-enum">cancelled</span></div>' +
      '<div class="f-v">Customer: only while <b>placed</b>. Boy: from his own assigned / preparing / out-for-delivery order, with a reason. Admin: from any open status.</div>' +
      '<div class="f-pushes">' +
      push('Customer (unless they cancelled)', 'Order cancelled', 'Order ZG1063 was cancelled: Restaurant closed early.', true) +
      push('All admins', '❌ Cancelled #ZG1063', 'Malabar Biryani House · Restaurant closed early', true) +
      push('Assigned boy (if admin cancelled)', 'Order #ZG1063 cancelled', 'Removed from your live queue.', true) +
      '</div></div>';

    return '<h2>1. Order lifecycle</h2>' +
      '<p class="f-muted">One <code>order_status</code> enum, same as one_place. Every move writes a row to <code>order_status_history</code>. one_place only pushes on <b>placed</b>; the dashed pushes are new in Zugo.</p>' +
      '<div class="v-legend"><span><i style="background:var(--v-accent)"></i>one_place push</span><span><i style="border:2px dashed var(--v-accent);width:10px;height:10px"></i>Zugo addition push</span></div>' +
      '<div class="v-flow-wrap"><div class="f-life">' + row + '</div>' +
      '<div class="f-cancel-row"><div class="f-cancel-lead"><b style="color:var(--v-ink)">Any open status</b>placed, assigned, preparing or out for delivery can end here.</div>' + cancel + '</div></div>';
  }

  function whoTable() {
    const rows = [
      ['Customer', '<code>placed → cancelled</code> on their own order only.', '<code>Customers can only cancel their own orders</code><br><code>You can only cancel an order before it is assigned</code>'],
      ['Delivery boy', 'Claim: <code>placed → assigned</code> via <code>assign_delivery_to_self</code> (first tap wins).<br>Then one step at a time: <code>assigned → checking</code>, <code>checking → delivering</code>, <code>delivering → delivered</code>, or <code>→ cancelled</code> with a reason.', '<code>Order is not assigned to you</code><br><code>Order is no longer available (status: %)</code><br><code>Order already assigned</code>'],
      ['Admin', 'Assign or reassign via <code>assign_delivery</code> (resets to <code>assigned</code>). Skip forward to any later status. Cancel from any open status. Assigning counts as acknowledging; there is no separate accept step.', '<code>Cannot set status to assigned without a delivery boy — use assign_delivery</code><br><code>Order is %, cannot assign a closed order</code><br><code>Delivery boy not found</code><br><code>Target user is not a delivery boy</code><br><code>Admin only</code>'],
      ['Anyone', 'Nothing leaves <code>delivered</code> or <code>cancelled</code>. Setting the same status again does nothing.', '<code>Illegal status transition: % → %</code>']
    ];
    return '<h2>2. Who can move an order</h2>' +
      '<p class="f-muted">All checks run in <code>update_order_status</code>, which locks the order row first.</p>' +
      '<div class="v-panel"><div class="v-scroll"><table class="v-table"><thead><tr><th>Actor</th><th>Allowed transitions</th><th>Error messages</th></tr></thead><tbody>' +
      rows.map(function (r) { return '<tr><td><b>' + r[0] + '</b></td><td>' + r[1] + '</td><td class="f-errs">' + r[2] + '</td></tr>'; }).join('') +
      '</tbody></table></div></div>';
  }

  const FALLBACK = {
    'c-splash': 'Splash', 'c-login': 'Login', 'c-home': 'Home', 'c-menu': 'Restaurant menu', 'c-item': 'Dish', 'c-cart': 'Cart',
    'c-checkout': 'Checkout', 'c-map': 'Pin on map', 'c-confirmed': 'Order placed', 'c-order': 'Track order', 'c-orders': 'My orders',
    'c-reorder': 'Reorder review', 'c-notifications': 'Notifications',
    'a-login': 'Login', 'a-orders': 'Orders', 'a-order': 'Order detail', 'a-shops': 'Shops', 'a-shop-form': 'Add shop', 'a-menu': 'Menu',
    'a-item-form': 'Add dish', 'a-reports': 'Reports', 'a-staff': 'Staff', 'a-staff-form': 'Add staff', 'a-settings': 'Settings',
    'a-cfg-pricing': 'Delivery pricing', 'a-broadcast': 'Broadcast',
    'd-login': 'Login', 'd-queue': 'Deliveries', 'd-order': 'Delivery detail', 'd-history': 'History', 'd-profile': 'Profile'
  };
  function lane(name, sub, ids) {
    const chips = ids.map(function (id, i) {
      const d = Z.defs[id];
      const title = d ? d.title : (FALLBACK[id] || id);
      const num = '<span class="f-n">' + String(i + 1).padStart(2, '0') + '</span>';
      // only link screens that are registered, so a chip never jumps to nowhere
      return '<span class="f-step">' + (i ? '<span class="f-to-arrow" aria-hidden="true">→</span>' : '') + (d
        ? '<button class="v-link" data-jump="' + id + '" title="Open ' + esc(title) + ' in the mockup">' + num + esc(title) + '</button>'
        : '<span class="v-link f-off" title="Screen not in the mockup yet">' + num + esc(title) + '</span>') + '</span>';
    }).join('');
    return '<div class="f-lane"><div class="f-lane-h">' + name + '<small>' + sub + '</small></div><div class="f-chips">' + chips + '</div></div>';
  }
  function journeys() {
    return '<h2>3. Journeys</h2>' +
      '<p class="f-muted">Click any step to open that screen in the phone.</p>' +
      '<div class="v-panel">' +
      lane('Customer', 'Zugo app', ['c-splash', 'c-login', 'c-home', 'c-menu', 'c-item', 'c-cart', 'c-checkout', 'c-map', 'c-confirmed', 'c-order', 'c-orders', 'c-reorder', 'c-notifications']) +
      lane('Admin', 'Zugo Operator', ['a-login', 'a-orders', 'a-order', 'a-shops', 'a-shop-form', 'a-menu', 'a-item-form', 'a-reports', 'a-staff', 'a-staff-form', 'a-settings', 'a-cfg-pricing', 'a-broadcast']) +
      lane('Delivery boy', 'Zugo Operator · Phase 2 (hidden in MVP)', ['d-login', 'd-queue', 'd-order', 'd-history', 'd-profile']) +
      '</div>';
  }

  function location() {
    const opts = [
      ['📍', 'Current location', false, 'Phone GPS gives the pin. Customer confirms it on the map.'],
      ['🗺️', 'Pin on map', true, 'Customer drags the map under a fixed pin. Pin must be inside the service radius.'],
      ['🔗', 'Paste Google Maps link', true, 'Customer pastes a <span class="f-mono">maps.app.goo.gl</span> share link. Edge function <code>resolve-maps-url</code> follows the redirect and reads <code>@lat,lng</code>, <code>q=</code> or <code>!3d…!4d…</code>. The pin is shown for confirmation.'],
      ['🏠', 'Saved address', false, 'Pick a row from <code>addresses</code> (one_place default). Its pin, recipient and phone are copied.']
    ];
    return '<h2>4. Checkout location</h2>' +
      '<p class="f-muted">one_place needs a saved address. Zugo lets the customer choose one of four ways; each ends in one pin.</p>' +
      '<div class="f-grid-4">' + opts.map(function (o) {
        return '<div class="v-panel f-opt"><div class="f-opt-h"><span class="f-em" aria-hidden="true">' + o[0] + '</span><span>' + o[1] + '</span>' + (o[2] ? ' ' + ZA : '') + '</div><p>' + o[3] + '</p></div>';
      }).join('') + '</div>' +
      '<div class="v-panel f-store"><h3 style="margin-top:0">What gets stored on the order</h3><div class="v-scroll"><table class="v-table"><thead><tr><th>Column</th><th>Required</th><th>From</th></tr></thead><tbody>' +
      '<tr><td><code>orders.delivery_lat</code>, <code>delivery_lng</code></td><td>Yes</td><td>The confirmed pin (all four ways)</td></tr>' +
      '<tr><td><code>orders.address_line</code></td><td>Optional ' + ZA + '</td><td>House / flat and landmark typed by the customer, or the saved address line</td></tr>' +
      '<tr><td><code>orders.recipient_name</code>, <code>contact_number</code></td><td>Yes</td><td>Profile, editable at checkout</td></tr>' +
      '<tr><td><code>orders.notes</code></td><td>Optional</td><td>"Notes for the delivery partner"</td></tr>' +
      '<tr><td><code>orders.distance_km</code>, <code>delivery_fee</code></td><td>Server</td><td>Road distance from <code>compute-distance</code> (cached key), fee recomputed by <code>place_order</code></td></tr>' +
      '</tbody></table></div></div>';
  }

  function reorder() {
    const st = [
      ['ok', 'Same price. Added as is.'],
      ['price_up', 'Price went up. Shows old → new.'],
      ['price_down', 'Price went down. Shows old → new.'],
      ['item_unavailable', 'Dish or size is off. Skipped.'],
      ['restaurant_closed', 'Restaurant closed. Nothing can be added.']
    ];
    const steps = [
      ['Customer taps 🔁 Order again', 'Customer app', 'From the order detail or the Orders list.'],
      ['<code>reorder_preview(p_order_id)</code> ' + ZA, 'RPC', 'Compares each line’s saved <code>unit_price</code> with the live menu price and returns one status per line:' +
        '<div class="f-status-list">' + st.map(function (s) { return '<div><code>' + s[0] + '</code> · ' + s[1] + '</div>'; }).join('') + '</div>'],
      ['Review screen', 'Customer app', 'Lists every line with its status and the new total. Nothing is in the cart yet.'],
      ['Add to cart', 'Customer app', 'Only buyable lines go in, at live prices. Replaces a cart from another restaurant after confirmation.'],
      ['<code>place_order</code> recomputes', 'RPC', 'Server reprices every line again, so the customer never pays a stale price. Zugo adds <code>p_expected_subtotal</code>; if it differs it raises <code>PRICE_CHANGED</code> and the cart shows the change.']
    ];
    return '<h2>5. Reorder with live price check</h2>' +
      '<p class="f-muted">one_place filters food lines out of reorder. Zugo adds the whole flow. ' + ZA + '</p>' +
      '<div class="v-panel"><div class="f-seq">' + steps.map(function (s, i) {
        return '<div class="f-seq-step"><div class="f-seq-n">' + (i + 1) + '</div><div><div class="f-seq-t">' + s[0] + ' <span class="f-who">' + s[1] + '</span></div><div class="f-seq-d">' + s[2] + '</div></div></div>';
      }).join('') + '</div></div>';
  }

  function fee() {
    const c = Z.D.config;
    const ex = [1.8, 2.7, 4.3, 4.8].map(function (km) {
      const over = Math.max(0, Math.round((km - c.normal_limit_km) * 10) / 10);
      const billed = Z.billedKm(over);
      const f = Z.deliveryFee(km);
      const how = over <= 0 ? 'Within ' + c.normal_limit_km + ' km → base ₹' + c.normal_base_charge
        : over + ' km over → billed ' + billed + ' km → ₹' + c.normal_beyond_charge + ' + ' + billed + ' × ₹' + c.normal_extra_per_km;
      return '<tr><td class="f-num">' + km + ' km</td><td>' + how + '</td><td class="f-num"><b>' + Z.money(f.fee) + '</b></td></tr>';
    }).join('');
    return '<h2>6. Delivery fee</h2>' +
      '<p class="f-muted">Same formula as one_place <code>delivery_pricing.dart</code>. Values come from <code>app_config</code> and are edited in Operator › Settings › Pricing.</p>' +
      '<div class="v-grid-2">' +
      '<div class="v-panel"><div class="f-formula">' +
      'if km ≤ normal_limit_km (' + c.normal_limit_km + ')<br>&nbsp;&nbsp;fee = normal_base_charge (₹' + c.normal_base_charge + ')<br>' +
      'else<br>&nbsp;&nbsp;over = km − ' + c.normal_limit_km + '<br>&nbsp;&nbsp;billed = over ≤ 1 ? 1 : whole km + (fraction ≤ .5 ? .5 : 1)<br>' +
      '&nbsp;&nbsp;fee = normal_beyond_charge (₹' + c.normal_beyond_charge + ') + billed × normal_extra_per_km (₹' + c.normal_extra_per_km + ')' +
      '</div><p class="f-muted" style="margin:10px 0 0">Distance is road distance from restaurant to pin, computed on the server.</p></div>' +
      '<div class="v-panel"><div class="v-scroll"><table class="v-table"><thead><tr><th class="f-num">Distance</th><th>Working</th><th class="f-num">Fee</th></tr></thead><tbody>' + ex + '</tbody></table></div></div>' +
      '</div>';
  }

  Z.pages.flows = function () {
    const el = document.getElementById('page-flows');
    if (!el) return;
    el.innerHTML =
      '<div class="v-doc-head"><h1>Zugo flows</h1><p class="v-lede">How an order moves, who can move it, what each person sees, and the three new pieces Zugo adds on top of one_place: flexible delivery location, reorder with a price check, and status pushes to the customer.</p></div>' +
      '<div class="v-panel" style="border-color:var(--v-accent)"><span class="v-tag">MVP</span> <b>No delivery-boy role yet.</b> An admin accepts each new order (✅ Accept) and delivers it personally: Accept → Preparing → Out for delivery → Delivered. The delivery-boy app role, assignment and self-claim below are Phase 2 and stay behind the <code>feature_delivery_role</code> flag. Use "Preview Phase 2" in the top bar to see them.</div>' +
      lifecycle() + whoTable() + journeys() + location() + reorder() + fee();
  };
})();
