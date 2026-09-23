/* ==========================================================================
   Zugo mockups — core engine (shared by every screen module)

   SCREEN MODULE CONTRACT (customer.js / admin.js / delivery.js)
   --------------------------------------------------------------
   Z.screen(app, def) registers a screen. app = 'customer' | 'admin' | 'delivery'.
   def = {
     id: 'c-home',            // unique; prefix c- / a- / d-
     group: 'Browse',         // rail group label
     title: 'Home',           // rail + notes title
     route: '/home',          // Flutter go_router path this maps to
     sb: 'light'|'brand'|'deep', // status-bar style (default light)
     render(p) -> string,     // HTML for everything below the status bar
                              // (app bar, .scroll body, sticky bars, bottom nav)
     mount(root, p) optional, // after-render hook (rarely needed)
     notes: { purpose: '...', points: ['...'], data: ['table / rpc'], ref: 'one_place file', next: ['c-menu', ...] },
     rail: true               // false = reachable only by navigation (still listed if true)
   }
   Navigation inside markup (event delegation, no inline JS):
     data-go="c-menu" data-p='{"shop":"s1"}'   navigate (params JSON optional)
     data-back                                 go back
     data-act="name" data-x="..."              run Z.acts[name](el, event)
     data-model="checkout.notes"               two-way bind input/textarea value into Z.S path (no re-render)
   Helpers: Z.icon, Z.money, Z.veg, Z.badge, Z.appBar, Z.bottomNav, Z.img, Z.toast,
            Z.sheet, Z.dialog, Z.drawer, Z.closeOv, Z.notify, Z.render, Z.go, Z.back
   State: Z.S (mutable, shared across all three apps), Z.D (catalog/sample data).
   ========================================================================== */
(function () {
  'use strict';
  const Z = (window.Z = {});
  /* Feature flags. MVP: no delivery-boy role; the admin accepts and delivers every order.
     Phase 2 turns deliveryRole on (maps to app_config key feature_delivery_role). */
  Z.FEATURES = { deliveryRole: false };
  Z.ADMIN_ID = 'st4';

  /* ---------------- icons (Material Icons baseline paths, 24px) ---------------- */
  const P = {
    menu: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
    search: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
    back: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
    cart: 'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0 0 20 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z',
    bag: 'M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z',
    home: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
    receipt: 'M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z',
    person: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
    pin: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    gps: 'M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z',
    map: 'M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z',
    link: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z',
    edit: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
    add: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
    remove: 'M19 13H5v-2h14v2z',
    close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
    check: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
    chev: 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
    down: 'M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z',
    star: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
    call: 'M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z',
    nav: 'M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z',
    bell: 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z',
    store: 'M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z',
    food: 'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z',
    dashboard: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
    chart: 'M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z',
    group: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
    settings: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
    logout: 'M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z',
    image: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',
    delete: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
    clock: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z',
    share: 'M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z',
    copy: 'M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z',
    info: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
    warn: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
    reorder: 'M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z',
    tune: 'M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z',
    cash: 'M19 14V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-9-1c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-6v11c0 1.1-.9 2-2 2H4v-2h17V7h2z',
    history: 'M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z',
    help: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z',
    offer: 'M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z',
    lock: 'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z',
    mail: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
    eye: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
    power: 'M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42A6.92 6.92 0 0 1 19 12c0 3.87-3.13 7-7 7A6.995 6.995 0 0 1 7.58 6.58L6.17 5.17A8.932 8.932 0 0 0 3 12a9 9 0 0 0 18 0c0-2.74-1.23-5.18-3.17-6.83z',
    download: 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z',
    ok: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
    cancel: 'M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z',
    more: 'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
    trend: 'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z',
    notes: 'M3 18h12v-2H3v2zM3 6v2h18V6H3zm0 7h18v-2H3v2z',
    calendar: 'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z',
    campaign: 'M18 11v2h4v-2h-4zm-2 6.61c.96.71 2.21 1.65 3.2 2.39.4-.53.8-1.07 1.2-1.6-.99-.74-2.24-1.68-3.2-2.4-.4.54-.8 1.08-1.2 1.61zM20.4 5.6c-.4-.53-.8-1.07-1.2-1.6-.99.74-2.24 1.68-3.2 2.4.4.53.8 1.07 1.2 1.6.96-.72 2.21-1.65 3.2-2.4zM4 9c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1v4h2v-4h1l5 3V6L8 9H4zm11.5 3c0-1.33-.58-2.53-1.5-3.35v6.69c.92-.81 1.5-2.01 1.5-3.34z',
    list: 'M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z',
    wifi: 'M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 0 0-6 0zm-4-4l2 2a7.074 7.074 0 0 1 10 0l2-2C15.14 9.14 8.87 9.14 5 13z',
    signal: 'M2 22h20V2z',
    battery: 'M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z',
    upload: 'M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z',
    wallet: 'M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
    qr: 'M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM17 17h2v2h-2zM19 19h2v2h-2zM15 19h2v2h-2zM17 13h2v2h-2zM19 15h2v2h-2z',
    verified: 'M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z'
  };
  const STROKE = {
    bike: '<g fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="16.5" r="3"/><circle cx="18.5" cy="16.5" r="3"/><path d="M8.5 16.5h5.2l2.8-6.5h-3.5"/><path d="M5.5 16.5l2.6-5h4.4"/><path d="M14.5 5.5h2.2l1.8 11"/></g>'
  };
  Z.icon = function (name, cls) {
    const c = 'ic' + (cls ? ' ' + cls : '');
    if (STROKE[name]) return '<svg class="' + c + '" viewBox="0 0 24 24" aria-hidden="true">' + STROKE[name] + '</svg>';
    const d = P[name] || P.info;
    return '<svg class="' + c + '" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="' + d + '"/></svg>';
  };

  /* ---------------- formatting ---------------- */
  Z.money = function (n) {
    const v = Math.round(Number(n) || 0);
    return '₹' + v.toLocaleString('en-IN');
  };
  Z.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  };
  Z.veg = function (isVeg) { return '<span class="veg' + (isVeg ? '' : ' non') + '" title="' + (isVeg ? 'Veg' : 'Non-veg') + '"></span>'; };
  Z.img = function (emoji, cls, extra) { return '<div class="img ' + (cls || '') + '">' + (emoji || '🍽️') + (extra || '') + '</div>'; };
  Z.json = function (o) { return Z.esc(JSON.stringify(o)); };
  // module-scoped CSS: Z.css('customer', '.c-foo{...}') injects one <style> per module id
  Z.css = function (id, text) {
    let el = document.getElementById('css-' + id);
    if (!el) { el = document.createElement('style'); el.id = 'css-' + id; document.head.appendChild(el); }
    el.textContent = text;
  };

  /* ---------------- order status model (one_place order_status enum, migration 00128) ----------------
     placed -> assigned -> checking -> delivering -> delivered ; cancelled from any non-terminal.
     Labels: one_place calls `delivering` "Pickup"; Zugo shows "Out for delivery" (clearer for customers). */
  Z.FLOW = ['placed', 'assigned', 'checking', 'delivering', 'delivered'];
  Z.ACTIVE = ['placed', 'assigned', 'checking', 'delivering'];
  Z.STATUS = {
    placed:     { label: 'Order Placed',     cust: 'Order placed',              dot: '#1976d2' },
    assigned:   { label: 'Assigned',         cust: 'Delivery partner assigned', dot: '#ff9800' },
    checking:   { label: 'Preparing',        cust: 'Food is being prepared',    dot: '#ff9800' },
    delivering: { label: 'Out for delivery', cust: 'Out for delivery',          dot: '#03a9f4' },
    delivered:  { label: 'Delivered',        cust: 'Delivered',                 dot: '#4caf50' },
    cancelled:  { label: 'Cancelled',        cust: 'Cancelled',                 dot: '#f44336' }
  };
  // legal next steps (one_place update_order_status): delivery boy one step; admin may skip forward
  Z.nextForBoy = function (st) {
    return { assigned: ['checking', 'cancelled'], checking: ['delivering', 'cancelled'], delivering: ['delivered', 'cancelled'] }[st] || [];
  };
  Z.nextForAdmin = function (st) {
    const i = Z.FLOW.indexOf(st);
    if (i < 0 || st === 'delivered') return [];
    if (!Z.FEATURES.deliveryRole && st === 'placed') return ['cancelled'];   // MVP: "Accept order" first (self-assign)
    return Z.FLOW.slice(i + 1).filter(function (x) { return x !== 'assigned'; }).concat(['cancelled']);
  };
  Z.badge = function (st, tap) {
    const s = Z.STATUS[st] || { label: st };
    return '<span class="tag pill st-' + st + (tap ? ' tap' : '') + '">' + Z.esc(s.label) + '</span>';
  };

  /* ---------------- chrome builders ---------------- */
  Z.appBar = function (o) {
    o = o || {};
    const cls = 'ab' + (o.variant ? ' ' + o.variant : '');
    let left = '';
    if (o.back) left = '<button class="ib" data-back aria-label="Back">' + Z.icon('back') + '</button>';
    else if (o.menu) left = '<button class="ib" data-act="' + o.menu + '" aria-label="Menu">' + Z.icon('menu') + '</button>';
    const titles = o.sub
      ? '<div class="ab-titles"><span class="ab-title">' + o.title + '</span><span class="ab-sub">' + o.sub + '</span></div>'
      : '<div class="ab-title">' + (o.title || '') + '</div>';
    return '<header class="' + cls + '">' + left + titles + (o.actions || '') + '</header>';
  };
  Z.iconBtn = function (icon, attrs, badge) {
    return '<button class="ib" ' + (attrs || '') + '>' + Z.icon(icon) + (badge ? '<span class="dot-badge">' + badge + '</span>' : '') + '</button>';
  };
  // items: [{em, label, go, badge, cls}] — emoji icons like one_place (shell_screen / operator_shell)
  Z.nav = function (items, active) {
    return '<nav class="bn">' + items.map(function (it) {
      return '<button class="ni' + (it.cls ? ' ' + it.cls : '') + (it.go === active ? ' on' : '') + '" data-go="' + it.go + '" data-root>' +
        '<span class="em">' + it.em + '</span><span>' + it.label + '</span>' + (it.badge ? '<span class="dot-badge">' + it.badge + '</span>' : '') + '</button>';
    }).join('') + '</nav>';
  };
  Z.bottomNav = function (app, active) {
    if (app === 'customer') {
      return Z.miniCart() + Z.nav([
        { em: '🏠', label: 'Home', go: 'c-home' },
        { em: '🍛', label: 'Dishes', go: 'c-dishes', cls: 'food' },
        { em: '🧾', label: 'Orders', go: 'c-orders' }
      ], active);
    }
    if (app === 'admin') {
      const nw = Z.S.orders.filter(function (o) { return o.status === 'placed'; }).length;
      return Z.nav([
        { em: '📋', label: 'Orders', go: 'a-orders', badge: nw || '' },
        { em: '🍔', label: 'Shops', go: 'a-shops', cls: 'food' },
        { em: '📊', label: 'Reports', go: 'a-reports' },
        { em: '👥', label: 'Staff', go: 'a-staff' },
        { em: '⚙️', label: 'Settings', go: 'a-settings' }
      ], active);
    }
    const live = Z.deliveryQueue().length;
    return Z.nav([
      { em: '🛵', label: 'Deliveries', go: 'd-queue', badge: live || '', cls: 'food' },
      { em: '📜', label: 'History', go: 'd-history' },
      { em: '👤', label: 'Profile', go: 'd-profile' }
    ], active);
  };
  // floating mini cart (customer): sits just above the bottom nav whenever the cart has items
  Z.miniCart = function () {
    const n = Z.cartCount();
    if (!n) return '';
    const t = Z.cartTotals();
    const shop = Z.S.cartShop ? Z.shop(Z.S.cartShop) : null;
    return '<button class="mini-cart" data-go="c-cart" aria-label="View cart">' +
      '<span class="mc-n">' + n + '</span>' +
      '<span class="mc-t"><b>' + n + ' item' + (n > 1 ? 's' : '') + ' · ' + Z.money(t.sub) + '</b>' + (shop ? '<span>' + Z.esc(shop.name) + '</span>' : '') + '</span>' +
      '<span class="mc-go">View cart ›</span></button>';
  };
  // customer shell app bar: ☰ + "Zugo" + 🛒 badge (one_place shell_screen)
  Z.shellBar = function () {
    const n = Z.cartCount();
    return '<header class="ab" style="border-bottom:0">' +
      '<button class="ib" data-act="drawer" aria-label="Menu">' + Z.icon('menu') + '</button>' +
      '<div class="ab-title" style="color:var(--brand);font-size:18px">Zugo</div>' +
      '<button class="ib" data-go="c-cart" aria-label="Cart"><span style="font-size:22px">🛒</span>' + (n ? '<span class="dot-badge" style="border:1.5px solid #fff;min-width:18px;height:18px;border-radius:9px;top:2px;right:0">' + (n > 9 ? '9+' : n) + '</span>' : '') + '</button>' +
      '</header>';
  };
  // operator top bar (one_place operator_shell mobile): brand + (delivery: Online toggle) + name
  Z.opBar = function (role) {
    const me = role === 'delivery' ? Z.staff(Z.S.me) : Z.staff('st4');
    const right = role === 'delivery'
      ? '<span class="t-cap b" style="color:' + (Z.S.dutyOnline ? '#2e7d32' : 'var(--a-hint)') + '">' + (Z.S.dutyOnline ? 'Online' : 'Offline') + '</span><button class="tg' + (Z.S.dutyOnline ? ' on' : '') + '" data-act="toggleDuty" aria-label="Online status"></button>'
      : '<button class="ib" data-go="a-profile" aria-label="Profile"><span class="avatar" style="width:32px;height:32px;font-size:12px">' + me.name.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2) + '</span></button>';
    return '<header class="ab">' +
      '<div class="ab-titles"><span class="ab-title" style="color:var(--brand);font-size:17px">Zugo <span style="color:var(--a-text2);font-weight:400;font-size:13px">Operator</span></span></div>' +
      '<div class="row" style="gap:8px;padding-right:8px">' + right + '</div></header>';
  };

  /* ---------------- sample data (Zugo, food only) ---------------- */
  Z.D = {
    city: 'Kochi',
    support: '+91 484 400 1234',
    cuisines: [
      { id: 'biryani', label: 'Biryani', e: '🍛' }, { id: 'burger', label: 'Burgers', e: '🍔' },
      { id: 'pizza', label: 'Pizza', e: '🍕' }, { id: 'south', label: 'South Indian', e: '🥘' },
      { id: 'chinese', label: 'Chinese', e: '🍜' }, { id: 'dessert', label: 'Desserts', e: '🍰' },
      { id: 'shakes', label: 'Shakes', e: '🥤' }, { id: 'snacks', label: 'Snacks', e: '🍟' }
    ],
    banners: [
      { k: 'Today only', t: 'Free delivery above ₹299', e: '🛵', cls: '' },
      { k: 'New on Zugo', t: 'Malabar Biryani House', e: '🍛', cls: 'b2' },
      { k: 'Pure veg', t: 'Green Leaf mini meals ₹120', e: '🥗', cls: 'b3' }
    ],
    shops: [
      { id: 's1', name: 'Malabar Biryani House', cuisine: 'Biryani · Kerala', tags: ['biryani', 'south'], e: '🍛', tint: 'warm', rating: 4.4, km: 1.2, eta: '25–30 min', open: true, active: true, minOrder: 149, phone: '+91 98950 11111', address: 'Palarivattom, Kochi', hours: '11:00 AM – 11:00 PM', lat: 10.0027, lng: 76.3067, orders30: 412 },
      { id: 's2', name: 'Burger Lab', cuisine: 'Burgers · Fast food', tags: ['burger', 'snacks', 'shakes'], e: '🍔', tint: 'sand', rating: 4.2, km: 2.0, eta: '20–25 min', open: true, active: true, minOrder: 99, phone: '+91 98950 22222', address: 'Edappally, Kochi', hours: '12:00 PM – 12:00 AM', lat: 10.0261, lng: 76.3083, orders30: 288 },
      { id: 's3', name: 'Green Leaf Veg', cuisine: 'South Indian · Pure veg', tags: ['south'], e: '🥘', tint: 'green', rating: 4.5, km: 0.8, eta: '15–20 min', open: true, active: true, minOrder: 79, phone: '+91 98950 33333', address: 'Kaloor, Kochi', hours: '7:00 AM – 10:00 PM', lat: 9.9971, lng: 76.2999, orders30: 356, pureVeg: true },
      { id: 's4', name: 'Pizza Point', cuisine: 'Pizza · Italian', tags: ['pizza'], e: '🍕', tint: 'rose', rating: 4.0, km: 3.1, eta: '30–35 min', open: true, active: true, minOrder: 199, phone: '+91 98950 44444', address: 'Vyttila, Kochi', hours: '11:00 AM – 11:00 PM', lat: 9.9676, lng: 76.3182, orders30: 164 },
      { id: 's5', name: 'Chai & Snacks Corner', cuisine: 'Tea · Snacks', tags: ['snacks'], e: '☕', tint: 'sky', rating: 4.3, km: 1.6, eta: '15–20 min', open: false, opensAt: 'Opens at 4:00 PM', active: true, minOrder: 49, phone: '+91 98950 55555', address: 'MG Road, Kochi', hours: '4:00 PM – 10:00 PM', lat: 9.9816, lng: 76.2823, orders30: 97 }
    ],
    // price is the current live price; variations override price
    items: [
      { id: 'i1', shop: 's1', cat: 'Biryani', name: 'Chicken Biryani', desc: 'Malabar-style dum biryani with jeerakasala rice, fried onions and raita.', veg: false, e: '🍛', best: true, vars: [{ id: 'half', name: 'Half', price: 160 }, { id: 'full', name: 'Full', price: 240 }], avail: true },
      { id: 'i2', shop: 's1', cat: 'Biryani', name: 'Mutton Biryani', desc: 'Slow-cooked mutton, whole spices, served with salad and pickle.', veg: false, e: '🍲', price: 320, avail: true },
      { id: 'i3', shop: 's1', cat: 'Biryani', name: 'Veg Biryani', desc: 'Seasonal vegetables, cashew and raisins, dum cooked.', veg: true, e: '🥗', price: 150, avail: true },
      { id: 'i4', shop: 's1', cat: 'Starters', name: 'Chicken 65', desc: 'Crispy spicy fried chicken with curry leaves.', veg: false, e: '🍗', price: 180, avail: true, best: true },
      { id: 'i5', shop: 's1', cat: 'Starters', name: 'Paneer Tikka', desc: 'Tandoor-grilled cottage cheese, mint chutney.', veg: true, e: '🧀', price: 200, avail: false },
      { id: 'i6', shop: 's1', cat: 'Breads', name: 'Kerala Porotta', desc: 'Flaky layered flatbread (per piece).', veg: true, e: '🫓', price: 15, avail: true },
      { id: 'i7', shop: 's1', cat: 'Beverages', name: 'Fresh Lime Soda', desc: 'Sweet, salt or mixed.', veg: true, e: '🍋', price: 40, avail: true },
      { id: 'i8', shop: 's2', cat: 'Burgers', name: 'Classic Veg Burger', desc: 'Crispy veg patty, lettuce, house sauce.', veg: true, e: '🍔', price: 99, avail: true },
      { id: 'i9', shop: 's2', cat: 'Burgers', name: 'Crispy Chicken Burger', desc: 'Buttermilk fried chicken, slaw, spicy mayo.', veg: false, e: '🍔', price: 149, avail: true, best: true },
      { id: 'i10', shop: 's2', cat: 'Sides', name: 'Peri Peri Fries', desc: 'Skin-on fries with peri peri dust.', veg: true, e: '🍟', vars: [{ id: 'reg', name: 'Regular', price: 89 }, { id: 'lg', name: 'Large', price: 129 }], avail: true },
      { id: 'i11', shop: 's2', cat: 'Shakes', name: 'Chocolate Shake', desc: 'Thick Belgian chocolate shake.', veg: true, e: '🥤', price: 120, avail: true },
      { id: 'i12', shop: 's3', cat: 'Breakfast', name: 'Masala Dosa', desc: 'Crisp dosa, potato masala, sambar and chutneys.', veg: true, e: '🥞', price: 80, avail: true, best: true },
      { id: 'i13', shop: 's3', cat: 'Breakfast', name: 'Idli Vada Combo', desc: '2 idli, 1 medu vada, sambar, chutney.', veg: true, e: '🍚', price: 60, avail: true },
      { id: 'i14', shop: 's3', cat: 'Meals', name: 'Kerala Mini Meals', desc: 'Matta rice, sambar, avial, thoran, pappadam, payasam.', veg: true, e: '🍱', price: 120, avail: true },
      { id: 'i15', shop: 's3', cat: 'Beverages', name: 'Filter Coffee', desc: 'Strong decoction with frothy milk.', veg: true, e: '☕', price: 30, avail: true },
      { id: 'i16', shop: 's4', cat: 'Pizza', name: 'Margherita', desc: 'Tomato, mozzarella, basil.', veg: true, e: '🍕', vars: [{ id: 'r', name: 'Regular 7"', price: 199 }, { id: 'm', name: 'Medium 10"', price: 299 }], avail: true },
      { id: 'i17', shop: 's4', cat: 'Pizza', name: 'Chicken BBQ Pizza', desc: 'BBQ chicken, onion, capsicum.', veg: false, e: '🍕', price: 349, avail: true },
      { id: 'i18', shop: 's4', cat: 'Sides', name: 'Garlic Bread', desc: 'Toasted with garlic butter and herbs.', veg: true, e: '🥖', price: 119, avail: true }
    ],
    customer: { name: 'Rahul Nair', phone: '+91 98470 12345', email: 'rahul.nair@example.com' },
    addresses: [
      { id: 'ad1', label: 'Home', line: 'Flat 4B, Skyline Apartments, Kaloor', landmark: 'Near Kaloor stadium', lat: 9.9989, lng: 76.2966, recipient: 'Rahul Nair', phone: '+91 98470 12345', isDefault: true },
      { id: 'ad2', label: 'Work', line: 'Infopark Phase 1, Kakkanad', landmark: 'Gate 2', lat: 10.0103, lng: 76.3632, recipient: 'Rahul Nair', phone: '+91 98470 12345' }
    ],
    staff: [
      { id: 'st1', name: 'Arun Kumar', role: 'delivery', phone: '+91 97450 10001', email: 'arun@zugo.in', vehicle: 'KL-07-BK-2231', online: true, active: true, today: 9, cod: 1840 },
      { id: 'st2', name: 'Faisal M', role: 'delivery', phone: '+91 97450 10002', email: 'faisal@zugo.in', vehicle: 'KL-07-CE-8810', online: true, active: true, today: 6, cod: 960 },
      { id: 'st3', name: 'Vishnu R', role: 'delivery', phone: '+91 97450 10003', email: 'vishnu@zugo.in', vehicle: 'KL-39-A-4412', online: false, active: true, today: 0, cod: 0 },
      { id: 'st4', name: 'Anjali Menon', role: 'admin', phone: '+91 97450 10010', email: 'anjali@zugo.in', online: true, active: true },
      { id: 'st6', name: 'Zugo Owner', role: 'admin', phone: '+91 97450 10000', email: 'owner@zugo.in', online: false, active: true },
      { id: 'st5', name: 'Joseph T', role: 'delivery', phone: '+91 97450 10004', email: 'joseph@zugo.in', vehicle: 'KL-07-DA-1190', online: false, active: false, today: 0, cod: 0 }
    ],
    // app_config keys (one_place names) — edited in Operator > Settings
    config: {
      normal_delivery_enabled: true, normal_limit_km: 2, normal_base_charge: 20, normal_beyond_charge: 20, normal_extra_per_km: 8,
      platform_fee: { enabled: false, amount: 0 }, service_gst: { enabled: false, pct: 18 }, minimum_cart_value: 100,
      service_center: 'Kaloor, Kochi', service_center_lat: 9.9971, service_center_lng: 76.2999, service_radius_km: 10,
      checkout_disabled: false, checkout_disabled_reason: 'Today Closed',
      food_service_active: true, food_hours_start: '10:00', food_hours_end: '23:00',
      normal_cod_enabled: true, normal_online_enabled: false,
      support_phone: '+91 484 400 1234', support_whatsapp_number: '+91 94470 40012',
      high_traffic_threshold: 5, high_traffic_message: 'High traffic! Delivery may take 30-60 minutes',
      customer_min_version: '1.0.0', operator_min_version: '1.0.0', force_update: false
    },
    // last 7 days for admin reports (Mon..Sun)
    week: [
      { d: 'Wed', orders: 58, revenue: 17420 }, { d: 'Thu', orders: 64, revenue: 19310 },
      { d: 'Fri', orders: 81, revenue: 25880 }, { d: 'Sat', orders: 97, revenue: 31240 },
      { d: 'Sun', orders: 104, revenue: 33960 }, { d: 'Mon', orders: 61, revenue: 18150 },
      { d: 'Tue', orders: 72, revenue: 21990 }
    ]
  };
  Z.shop = function (id) { return Z.D.shops.find(function (s) { return s.id === id; }); };
  Z.item = function (id) { return Z.D.items.find(function (i) { return i.id === id; }); };
  Z.staff = function (id) { return Z.D.staff.find(function (s) { return s.id === id; }); };
  Z.itemPrice = function (it, varId) {
    if (it.vars) { const v = it.vars.find(function (x) { return x.id === varId; }) || it.vars[0]; return v.price; }
    return it.price;
  };
  Z.varName = function (it, varId) {
    if (!it.vars) return '';
    const v = it.vars.find(function (x) { return x.id === varId; }) || it.vars[0];
    return v.name;
  };
  Z.fromPrice = function (it) { return it.vars ? Math.min.apply(null, it.vars.map(function (v) { return v.price; })) : it.price; };

  /* ---------------- state ---------------- */
  function freshState() {
    return {
      loggedIn: { customer: false, admin: false, delivery: false },
      me: 'st1',                       // delivery boy in the Delivery view
      cart: [],                        // {key, itemId, varId, qty}
      cartShop: null,
      vegOnly: false,
      cuisine: null,
      checkout: {
        method: 'gps',                 // gps | map | link | saved   (Zugo addition: one_place needs a saved address)
        addressId: 'ad1',
        mapsUrl: '',
        linkParsed: false,
        line: '', landmark: '',
        recipient: 'Rahul Nair', phone: '+91 98470 12345',
        notes: '', pay: 'cod'
      },
      search: '',
      orders: seedOrders(),
      inbox: [
        { t: 'Delivered · #ZG1042', b: 'Order ZG1042 delivered. Enjoy your meal!', ago: '2 days ago', go: 'c-order', p: { id: 'ZG1042' } },
        { t: 'Free delivery weekend', b: 'Free delivery on orders above ₹299 till Sunday.', ago: '4 days ago' }
      ],
      pending: { customer: [], admin: [], delivery: [] },
      adminTab: 'placed',
      reportRange: '7d',
      dutyOnline: true,
      seq: 1063,
      dqTab: 'live',
      orderFilter: 'active',
      statsOpen: false
    };
  }
  function seedOrders() {
    // unit = price captured at order time (order_items.unit_price). Live prices may differ -> reorder recheck.
    return [
      { id: 'ZG1058', shop: 's3', status: 'checking', placedAgo: '12 min ago', rider: 'st6',
        items: [{ itemId: 'i12', qty: 2, unit: 80 }, { itemId: 'i15', qty: 2, unit: 30 }],
        fee: 20, method: 'Saved address · Home', addr: '12/340 Temple Road, Kaloor', notes: 'Less spicy please', pay: 'COD', customer: 'Meera S', cphone: '+91 99610 22001', km: 1.6, lat: 9.9994, lng: 76.2981,
        history: [['placed', '7:38 PM', 'Order placed via cod'], ['assigned', '7:40 PM', 'Self-assigned by Zugo Owner'], ['checking', '7:46 PM', 'Status changed to checking']] },
      { id: 'ZG1056', shop: 's2', status: 'assigned', placedAgo: '18 min ago', rider: 'st4',
        items: [{ itemId: 'i9', qty: 2, unit: 149 }, { itemId: 'i10', varId: 'lg', qty: 1, unit: 129 }],
        fee: 28, method: 'Current location (GPS)', addr: 'Pinned location · near Edappally toll', notes: 'Call when you reach the gate', pay: 'COD', customer: 'Nikhil P', cphone: '+91 99610 22002', km: 2.7, lat: 10.0150, lng: 76.3100,
        history: [['placed', '7:32 PM', 'Order placed via cod'], ['assigned', '7:35 PM', 'Self-assigned by Anjali Menon']] },
      { id: 'ZG1054', shop: 's1', status: 'delivered', placedAgo: '1 h ago', rider: 'st4', date: 'Today · 6:48 PM',
        items: [{ itemId: 'i1', varId: 'half', qty: 2, unit: 160 }],
        fee: 20, method: 'Google Maps link', addr: 'maps.app.goo.gl/… · Panampilly Nagar', notes: '', pay: 'COD', customer: 'Asha K', cphone: '+91 99610 22003', km: 1.9, lat: 9.9600, lng: 76.2950,
        history: [['placed', '6:48 PM', 'Order placed via cod'], ['assigned', '6:50 PM', 'Self-assigned by Anjali Menon'], ['checking', '6:55 PM', ''], ['delivering', '7:10 PM', ''], ['delivered', '7:24 PM', '']] },
      { id: 'ZG1042', shop: 's1', status: 'delivered', date: 'Sun, 21 Sep · 7:32 PM', rider: 'st6', mine: true,
        items: [{ itemId: 'i1', varId: 'full', qty: 1, unit: 220 }, { itemId: 'i4', qty: 1, unit: 180 }, { itemId: 'i5', qty: 1, unit: 200 }, { itemId: 'i6', qty: 4, unit: 15 }],
        fee: 20, method: 'Saved address · Home', addr: 'Flat 4B, Skyline Apartments, Kaloor', notes: 'Ring the bell twice', pay: 'COD', customer: 'Rahul Nair', cphone: '+91 98470 12345', km: 1.8, lat: 9.9989, lng: 76.2966,
        history: [['placed', '7:32 PM', 'Order placed via cod'], ['assigned', '7:34 PM', 'Self-assigned by Zugo Owner'], ['checking', '7:36 PM', ''], ['delivering', '7:55 PM', ''], ['delivered', '8:12 PM', '']] },
      { id: 'ZG1031', shop: 's2', status: 'delivered', date: 'Tue, 16 Sep · 1:02 PM', rider: 'st4', mine: true,
        items: [{ itemId: 'i8', qty: 1, unit: 99 }, { itemId: 'i11', qty: 1, unit: 120 }],
        fee: 28, method: 'Google Maps link', addr: 'maps.app.goo.gl/… · Infopark Phase 1', notes: 'Leave at reception', pay: 'COD', customer: 'Rahul Nair', cphone: '+91 98470 12345', km: 2.6, lat: 10.0103, lng: 76.3632,
        history: [['placed', '1:02 PM', 'Order placed via cod'], ['assigned', '1:03 PM', 'Self-assigned by Anjali Menon'], ['checking', '1:05 PM', ''], ['delivering', '1:24 PM', ''], ['delivered', '1:40 PM', '']] },
      { id: 'ZG1019', shop: 's4', status: 'cancelled', date: 'Fri, 12 Sep · 9:01 PM', rider: null, mine: true, cancelReason: 'Restaurant closed early',
        items: [{ itemId: 'i16', varId: 'm', qty: 1, unit: 299 }],
        fee: 36, method: 'Saved address · Home', addr: 'Flat 4B, Skyline Apartments, Kaloor', notes: '', pay: 'COD', customer: 'Rahul Nair', cphone: '+91 98470 12345', km: 3.6, lat: 9.9989, lng: 76.2966,
        history: [['placed', '9:01 PM', 'Order placed via cod'], ['cancelled', '9:05 PM', 'Restaurant closed early']] }
    ];
  }
  Z.S = freshState();
  Z.resetState = function () { Z.S = freshState(); };

  /* ---------------- cart ---------------- */
  Z.cartKey = function (itemId, varId) { return itemId + (varId ? ':' + varId : ''); };
  Z.cartQty = function (itemId, varId) {
    if (varId === undefined) return Z.S.cart.filter(function (c) { return c.itemId === itemId; }).reduce(function (a, c) { return a + c.qty; }, 0);
    const c = Z.S.cart.find(function (x) { return x.key === Z.cartKey(itemId, varId); });
    return c ? c.qty : 0;
  };
  Z.cartCount = function () { return Z.S.cart.reduce(function (a, c) { return a + c.qty; }, 0); };
  // returns false (and opens replace dialog) when the cart has another shop — one shop per order
  Z.cartAdd = function (itemId, varId, qty) {
    const it = Z.item(itemId);
    if (!it || !it.avail) return false;
    if (Z.S.cartShop && Z.S.cartShop !== it.shop && Z.S.cart.length) {
      Z.dialog('<div class="dialog-t">Replace cart items?</div><div class="dialog-d">Your cart has items from <b>' + Z.esc(Z.shop(Z.S.cartShop).name) +
        '</b>. Zugo orders come from one restaurant at a time. Start a new cart with <b>' + Z.esc(Z.shop(it.shop).name) + '</b>?</div>' +
        '<div class="btn-row"><button class="btn neutral" data-act="closeOv">Keep cart</button><button class="btn" data-act="replaceCart" data-item="' + itemId + '" data-var="' + (varId || '') + '">Start new cart</button></div>');
      return false;
    }
    const key = Z.cartKey(itemId, varId);
    const c = Z.S.cart.find(function (x) { return x.key === key; });
    if (c) c.qty += qty || 1; else Z.S.cart.push({ key: key, itemId: itemId, varId: varId || null, qty: qty || 1 });
    Z.S.cartShop = it.shop;
    return true;
  };
  Z.cartSet = function (key, qty) {
    const c = Z.S.cart.find(function (x) { return x.key === key; });
    if (!c) return;
    c.qty = qty;
    if (c.qty <= 0) Z.S.cart = Z.S.cart.filter(function (x) { return x.key !== key; });
    if (!Z.S.cart.length) Z.S.cartShop = null;
  };
  // one_place delivery_pricing.dart: within limit -> base; beyond -> beyond + billedKm x perKm,
  // overage rounded up: <=1 km bills 1; else whole km + 0.5 (fraction <= .5) or + 1.
  Z.billedKm = function (over) {
    if (over <= 0) return 0;
    if (over <= 1) return 1;
    const w = Math.floor(over), f = over - w;
    return f === 0 ? w : w + (f <= 0.5 ? 0.5 : 1);
  };
  Z.deliveryFee = function (km) {
    const c = Z.D.config;
    if (!c.normal_delivery_enabled) return { fee: 0, note: 'Free delivery' };
    if (km <= c.normal_limit_km) return { fee: c.normal_base_charge, note: 'Base ₹' + c.normal_base_charge + ' within ' + c.normal_limit_km + ' km' };
    const b = Z.billedKm(km - c.normal_limit_km);
    return { fee: c.normal_beyond_charge + b * c.normal_extra_per_km, note: '₹' + c.normal_beyond_charge + ' base + ' + b + ' km × ₹' + c.normal_extra_per_km };
  };
  Z.cartTotals = function () {
    const sub = Z.S.cart.reduce(function (a, c) { return a + Z.itemPrice(Z.item(c.itemId), c.varId) * c.qty; }, 0);
    const shop = Z.S.cartShop ? Z.shop(Z.S.cartShop) : null;
    const km = shop ? Math.round((shop.km + 1.1) * 10) / 10 : 0;   // road distance to the customer (compute-distance)
    const f = sub ? Z.deliveryFee(km) : { fee: 0, note: '' };
    const min = Z.D.config.minimum_cart_value;
    return { sub: sub, km: km, fee: f.fee, feeNote: f.note, total: sub + f.fee, short: sub && sub < min ? min - sub : 0 };
  };

  /* ---------------- orders ---------------- */
  Z.order = function (id) { return Z.S.orders.find(function (o) { return o.id === id; }); };
  Z.orderTotals = function (o) {
    const sub = o.items.reduce(function (a, l) { return a + l.unit * l.qty; }, 0);
    return { sub: sub, fee: o.fee, total: sub + o.fee };
  };
  Z.nowTime = function () {
    // deterministic clock for the mockup: 7:50 PM + minutes elapsed in session
    Z._tick = (Z._tick || 0) + 1;
    const m = 50 + Z._tick;
    return (m >= 60 ? '8:' + String(m - 60).padStart(2, '0') : '7:' + m) + ' PM';
  };
  Z.placeOrder = function () {
    const t = Z.cartTotals();
    const ck = Z.S.checkout;
    const id = 'ZG' + (++Z.S.seq);
    const addr = Z.D.addresses.find(function (a) { return a.id === ck.addressId; });
    const methodLabel = { gps: 'Current location (GPS)', map: 'Pinned on map', link: 'Google Maps link', saved: 'Saved address · ' + (addr ? addr.label : '') }[ck.method];
    const pin = { gps: [9.9989, 76.2966], map: [9.9994, 76.2971], link: [10.0012, 76.3024], saved: addr ? [addr.lat, addr.lng] : [9.9989, 76.2966] }[ck.method];
    const addrText = ck.method === 'saved' && addr ? addr.line + (addr.landmark ? ' · ' + addr.landmark : '') :
      (ck.method === 'link' ? (ck.mapsUrl || 'maps.app.goo.gl/…') : 'Pinned location') + (ck.line ? ' · ' + ck.line : '') + (ck.landmark ? ' · ' + ck.landmark : '');
    const o = {
      id: id, shop: Z.S.cartShop, status: 'placed', placedAgo: 'just now', rider: null, mine: true, fresh: true,
      items: Z.S.cart.map(function (c) { return { itemId: c.itemId, varId: c.varId, qty: c.qty, unit: Z.itemPrice(Z.item(c.itemId), c.varId) }; }),
      fee: t.fee, method: methodLabel, addr: addrText, notes: ck.notes, pay: 'COD',
      customer: Z.D.customer.name, cphone: ck.phone || Z.D.customer.phone, recipient: ck.recipient, km: t.km, lat: pin[0], lng: pin[1],
      date: 'Today · ' + Z.nowTime(), history: [['placed', Z.nowTime(), 'Order placed via cod']]
    };
    Z.S.orders.unshift(o);
    Z.S.cart = []; Z.S.cartShop = null;
    Z.S.checkout.notes = ''; Z.S.checkout.line = ''; Z.S.checkout.landmark = '';
    const total = Z.orderTotals(o).total;
    // one_place fcm-order-notify: every admin + every delivery boy gets "🛒 New Order #…"
    const n = { t: '🛒 New Order #' + id, b: (o.recipient || o.customer) + ' · ' + Z.money(total) + ' · COD' };
    Z.notify('admin', Object.assign({ go: 'a-order', p: { id: id } }, n));
    Z.notify('delivery', Object.assign({ go: 'd-queue', p: { tab: 'pool' } }, n));
    return o;
  };
  // status change (update_order_status). by: 'admin' | 'delivery' | 'customer'
  Z.setStatus = function (id, st, reason, by) {
    const o = Z.order(id);
    if (!o || o.status === st) return;
    o.status = st;
    o.fresh = false;
    o.history.push([st, Z.nowTime(), reason || (st === 'cancelled' ? 'Cancelled' : 'Status changed to ' + st)]);
    if (st === 'cancelled') o.cancelReason = reason || 'Cancelled by ' + (by || 'admin');
    const shop = Z.shop(o.shop).name;
    const rider = o.rider ? Z.staff(o.rider).name : 'Your delivery partner';
    // Zugo addition: customer pushes on every status (one_place only pushes staff on "placed")
    const cust = {
      checking: ['Preparing your order', shop + ' is preparing order ' + id + '.'],
      delivering: ['Out for delivery', rider + ' picked up order ' + id + '. Keep ' + Z.money(Z.orderTotals(o).total) + ' cash ready.'],
      delivered: ['Delivered', 'Order ' + id + ' delivered. Enjoy your meal!'],
      cancelled: ['Order cancelled', 'Order ' + id + ' was cancelled' + (o.cancelReason ? ': ' + o.cancelReason : '') + '.']
    }[st];
    if (cust && o.mine && by !== 'customer') Z.pushCustomer(o, cust[0], cust[1]);
    if (st === 'delivered' || st === 'cancelled') {
      Z.notify('admin', { t: (st === 'delivered' ? '✅ Delivered #' : '❌ Cancelled #') + id, b: shop + (o.rider ? ' · ' + rider : '') + (o.cancelReason && st === 'cancelled' ? ' · ' + o.cancelReason : ''), go: 'a-order', p: { id: id } });
    }
    if (st === 'cancelled' && o.rider && by !== 'delivery') {
      Z.notify('delivery', { t: 'Order #' + id + ' cancelled', b: 'Removed from your live queue.', go: 'd-queue' });
    }
  };
  Z.pushCustomer = function (o, t, b) {
    const n = { t: t, b: b, go: 'c-order', p: { id: o.id } };
    Z.S.inbox.unshift({ t: t + ' · #' + o.id, b: b, ago: 'just now', go: n.go, p: n.p });
    Z.notify('customer', n);
  };
  // assign_delivery (admin) / assign_delivery_to_self (boy): sets delivery_boy_id and status -> assigned
  Z.assign = function (id, staffId, by) {
    const o = Z.order(id);
    if (!o) return;
    const re = !!o.rider;
    o.rider = staffId;
    const r = Z.staff(staffId);
    o.status = 'assigned';
    o.fresh = false;
    o.history.push(['assigned', Z.nowTime(), by === 'self' ? 'Self-assigned by ' + r.name : (re ? 'Reassigned to ' : 'Assigned to ') + r.name]);
    if (o.mine) Z.pushCustomer(o, 'Delivery partner assigned', r.name + ' will pick up order ' + id + ' from ' + Z.shop(o.shop).name + '.');
    // Zugo addition: push the assigned boy (one_place relies on realtime + 10 s poll)
    if (staffId === Z.S.me && by !== 'self') {
      Z.notify('delivery', { t: '🛵 New delivery assigned', b: '#' + id + ' · Pickup at ' + Z.shop(o.shop).name + ' · ' + o.km + ' km', go: 'd-order', p: { id: id } });
    }
    return r;
  };
  // MVP: admin accepts the order and delivers it personally (assign_delivery_to_self for admins)
  Z.accept = function (id) {
    const o = Z.order(id);
    if (!o || o.status !== 'placed') return;
    Z.assign(id, Z.ADMIN_ID, 'self');
  };
  Z.deliveryQueue = function () {
    return Z.S.orders.filter(function (o) { return o.rider === Z.S.me && ['assigned', 'checking', 'delivering'].indexOf(o.status) >= 0; });
  };
  Z.pool = function () {
    return Z.S.orders.filter(function (o) { return o.status === 'placed' && !o.rider; });
  };
  Z.activeFor = function (staffId) {
    return Z.S.orders.filter(function (o) { return o.rider === staffId && ['assigned', 'checking', 'delivering'].indexOf(o.status) >= 0; }).length;
  };
  // reorder recheck: compares captured unit prices with LIVE catalog (mirrors one_place bulk_add_to_cart / cart recheck)
  Z.recheck = function (o) {
    return o.items.map(function (l) {
      const it = Z.item(l.itemId);
      const shop = Z.shop(it.shop);
      const live = Z.itemPrice(it, l.varId);
      // statuses mirror the proposed reorder_preview RPC: ok | price_up | price_down | item_unavailable | restaurant_closed
      let state = 'ok';
      if (!shop.open || !shop.active) state = 'restaurant_closed';
      else if (!it.avail) state = 'item_unavailable';
      else if (live > l.unit) state = 'price_up';
      else if (live < l.unit) state = 'price_down';
      return { line: l, item: it, live: live, state: state };
    });
  };

  /* ---------------- registry + navigation ---------------- */
  Z.APPS = {
    customer: { name: 'Zugo', role: 'Customer app', start: 'c-splash', home: 'c-home', screens: [] },
    admin: { name: 'Zugo Operator', role: 'Admin role', start: 'a-login', home: 'a-orders', screens: [] },
    delivery: { name: 'Zugo Operator', role: 'Delivery role · Phase 2', start: 'd-login', home: 'd-queue', screens: [] }
  };
  Z.defs = {};
  Z.acts = {};
  Z.screen = function (app, def) {
    def.app = app;
    Z.defs[def.id] = def;
    Z.APPS[app].screens.push(def);
  };
  Z.on = function (name, fn) { Z.acts[name] = fn; };
  Z.view = 'customer';
  Z.cur = { customer: { id: 'c-splash', p: {} }, admin: { id: 'a-login', p: {} }, delivery: { id: 'd-login', p: {} } };
  Z.hist = { customer: [], admin: [], delivery: [] };

  Z.appOf = function (id) { return Z.defs[id] ? Z.defs[id].app : null; };
  Z.go = function (id, p, opts) {
    const app = Z.appOf(id);
    if (!app) { console.warn('Unknown screen', id); return; }
    opts = opts || {};
    const cur = Z.cur[app];
    if (!opts.replace && cur && cur.id !== id) Z.hist[app].push(cur);
    if (opts.root) Z.hist[app] = [];
    Z.cur[app] = { id: id, p: p || {} };
    Z._keepScroll = false;
    if (Z.view !== app) { Z.setView(app); return; }
    Z.render();
  };
  Z.back = function () {
    const app = Z.view;
    const h = Z.hist[app];
    if (!h || !h.length) return;
    Z.cur[app] = h.pop();
    Z._keepScroll = false;
    Z.render();
  };
  Z.refresh = function () { Z._keepScroll = true; Z.render(); };
  Z.p = function () { return (Z.cur[Z.view] || {}).p || {}; };

  /* ---------------- overlays ---------------- */
  function layer() { return document.getElementById('phone-layer'); }
  Z.closeOv = function () { const l = layer(); if (l) l.innerHTML = ''; };
  Z.sheet = function (title, body, foot) {
    layer().innerHTML = '<div class="ov" data-ovbg><div class="sheet" role="dialog" aria-label="' + Z.esc(String(title).replace(/<[^>]+>/g, '')) + '">' +
      '<div class="sheet-h"><div class="sheet-t"><span>' + title + '</span><button class="ib" data-act="closeOv" aria-label="Close">' + Z.icon('close') + '</button></div></div>' +
      '<div class="sheet-b">' + body + '</div>' + (foot ? '<div class="sheet-f">' + foot + '</div>' : '') + '</div></div>';
  };
  Z.dialog = function (html) {
    layer().innerHTML = '<div class="ov center" data-ovbg><div class="dialog" role="dialog">' + html + '</div></div>';
  };
  Z.drawer = function (html) {
    layer().innerHTML = '<div class="ov" data-ovbg></div><div class="drawer" role="dialog" aria-label="Menu">' + html + '</div>';
  };
  let toastTimer = null;
  Z.toast = function (msg, act) {
    const el = document.getElementById('phone-toast');
    if (!el) return;
    el.innerHTML = '<div class="toast" role="status">' + Z.icon('ok') + '<span>' + msg + '</span>' +
      (act ? '<button class="t-act" data-act="' + act.act + '"' + (act.data || '') + '>' + act.label + '</button>' : '') + '</div>';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.innerHTML = ''; }, 2600);
  };
  let pushTimer = null;
  Z.notify = function (app, n) {
    if (app === 'delivery' && !Z.FEATURES.deliveryRole) return;
    if (Z.view === app) Z.showPush(app, n);
    else { Z.S.pending[app].push(n); Z.renderTabs(); }
  };
  Z.showPush = function (app, n) {
    const el = document.getElementById('phone-push');
    if (!el) return;
    const a = Z.APPS[app];
    el.innerHTML = '<div class="push" data-push role="alert"' + (n.go ? ' data-go="' + n.go + '"' + (n.p ? " data-p='" + JSON.stringify(n.p) + "'" : '') : '') + '>' +
      '<div class="p-ic">' + (app === 'customer' ? 'Z' : Z.icon(app === 'admin' ? 'store' : 'bike', 'sm')) + '</div><div class="grow">' +
      '<div class="p-app"><span>' + a.name.toUpperCase() + '</span><span>now</span></div>' +
      '<div class="p-t">' + Z.esc(n.t) + '</div><div class="p-b">' + Z.esc(n.b) + '</div></div></div>';
    clearTimeout(pushTimer);
    pushTimer = setTimeout(function () { el.innerHTML = ''; }, 5200);
  };

  /* ---------------- rendering ---------------- */
  function statusBar(kind) {
    return '<div class="sb' + (kind === 'brand' ? ' on-brand' : kind === 'deep' ? ' on-deep' : '') + '"><span class="num">7:50</span><span class="sb-icons">' +
      Z.icon('signal') + Z.icon('wifi') + Z.icon('battery') + '</span></div>';
  }
  Z.render = function () {
    const app = Z.view;
    if (!Z.APPS[app]) return;
    const cur = Z.cur[app];
    const def = Z.defs[cur.id];
    const screenEl = document.getElementById('phone-screen');
    if (!screenEl || !def) return;
    let scrollTop = 0;
    const prevScroll = screenEl.querySelector('.scroll');
    if (Z._keepScroll && prevScroll) scrollTop = prevScroll.scrollTop;
    let html;
    try { html = def.render(cur.p || {}); } catch (e) {
      console.error(e);
      html = '<div class="scroll"><div class="note err">' + Z.icon('warn') + '<div>Render error in ' + def.id + ': ' + Z.esc(e.message) + '</div></div></div>';
    }
    screenEl.innerHTML = statusBar(def.sb) + '<div class="scr' + (def.bg2 ? ' bg2' : '') + '" data-screen="' + def.id + '">' + html + '</div>' +
      '<div id="phone-layer"></div><div id="phone-toast"></div><div id="phone-push"></div>';
    if (Z._keepScroll) { const s = screenEl.querySelector('.scroll'); if (s) s.scrollTop = scrollTop; }
    Z._keepScroll = false;
    if (def.mount) { try { def.mount(screenEl, cur.p || {}); } catch (e) { console.error(e); } }
    Z.renderChrome();
  };

  /* ---------------- viewer chrome ---------------- */
  Z.VIEWS = [
    { id: 'customer', label: 'Zugo', sub: 'Customer' },
    { id: 'admin', label: 'Operator', sub: 'Admin' },
    { id: 'delivery', label: 'Operator', sub: 'Delivery' },
    { id: 'flows', label: 'Flows', sub: '' },
    { id: 'plan', label: 'Project plan', sub: '' }
  ];
  Z.renderTabs = function () {
    const el = document.getElementById('v-tabs');
    if (!el) return;
    el.innerHTML = Z.VIEWS.filter(function (v) { return v.id !== 'delivery' || Z.FEATURES.deliveryRole; }).map(function (v) {
      const pend = Z.S.pending[v.id] && Z.S.pending[v.id].length;
      return '<button class="v-tab" role="tab" aria-selected="' + (Z.view === v.id) + '" data-view="' + v.id + '">' +
        (Z.APPS[v.id] ? '<span class="v-dot"' + (pend ? ' style="background:var(--a-error, #f44336)"' : '') + '></span>' : '') +
        v.label + (v.sub ? ' · ' + v.sub : '') + (pend ? ' <span class="v-tag" style="background:#ffebee;color:#c62828">' + pend + '</span>' : '') + '</button>';
    }).join('');
  };
  Z.renderChrome = function () {
    Z.renderTabs();
    const app = Z.view;
    const A = Z.APPS[app];
    if (!A) return;
    const cur = Z.cur[app];
    const def = Z.defs[cur.id];
    // rail
    const rail = document.getElementById('v-rail');
    if (rail) {
      let last = null, n = 0, html = '<div class="v-rail-head"><div class="v-rail-title">' + A.name + '</div><div class="v-rail-sub">' + A.role + ' · ' + A.screens.filter(function (s) { return s.rail !== false; }).length + ' screens</div></div>';
      A.screens.forEach(function (s) {
        if (s.rail === false) return;
        n++;
        if (s.group !== last) { html += '<div class="v-group">' + s.group + '</div>'; last = s.group; }
        html += '<button class="v-item" data-jump="' + s.id + '" aria-current="' + (s.id === cur.id) + '"><span class="v-num">' + String(n).padStart(2, '0') + '</span>' + s.title + '</button>';
      });
      rail.innerHTML = html;
      const on = rail.querySelector('[aria-current="true"]');
      if (on && on.scrollIntoView && rail.scrollHeight > rail.clientHeight) {
        const r = on.getBoundingClientRect(), rr = rail.getBoundingClientRect();
        if (r.top < rr.top || r.bottom > rr.bottom) rail.scrollTop += r.top - rr.top - 80;
      }
    }
    // crumb
    const crumb = document.getElementById('v-crumb');
    if (crumb) crumb.innerHTML = A.name + ' · ' + A.role + ' / <b>' + def.title + '</b>';
    const backBtn = document.getElementById('v-back');
    if (backBtn) backBtn.disabled = !Z.hist[app].length;
    // notes
    const notes = document.getElementById('v-notes');
    if (notes) {
      const nt = def.notes || {};
      let h = '<h2>' + def.title + '</h2>' + (def.route ? '<div class="v-route">' + def.route + '</div>' : '');
      if (nt.purpose) h += '<h3>What this screen does</h3><p>' + nt.purpose + '</p>';
      if (nt.points && nt.points.length) h += '<h3>Details</h3><ul>' + nt.points.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>';
      if (nt.data && nt.data.length) h += '<h3>Supabase</h3><ul>' + nt.data.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>';
      if (nt.next && nt.next.length) h += '<h3>Leads to</h3><div class="v-links">' + nt.next.filter(function (id) { return Z.defs[id]; }).map(function (id) {
        return '<button class="v-link" data-jump="' + id + '">' + Z.defs[id].title + '</button>';
      }).join('') + '</div>';
      if (nt.ref) h += '<h3>one_place reference</h3><div class="v-ref">' + nt.ref + '</div>';
      notes.innerHTML = h;
    }
  };
  Z.setView = function (v) {
    Z.view = v;
    try { localStorage.setItem('zugo-mock-view', v); } catch (e) { /* storage unavailable */ }
    document.querySelectorAll('[data-pane]').forEach(function (el) { el.hidden = el.getAttribute('data-pane') !== (Z.APPS[v] ? 'app' : v); });
    if (Z.APPS[v]) {
      Z.render();
      const pend = Z.S.pending[v];
      if (pend && pend.length) {
        const n = pend[pend.length - 1];
        Z.S.pending[v] = [];
        setTimeout(function () { Z.showPush(v, n); Z.renderTabs(); }, 350);
      }
    } else {
      Z.renderTabs();
      if (Z.pages && Z.pages[v]) Z.pages[v]();
    }
  };
  // jump from rail: supply sensible default params so any screen can open directly
  Z.jump = function (id) {
    const def = Z.defs[id];
    if (!def) return;
    const app = def.app;
    if (app !== Z.view) Z.view = app;
    if (def.needsLogin !== false) Z.S.loggedIn[app] = true;
    const p = def.defaults ? def.defaults() : {};
    Z.hist[app] = def.id === Z.APPS[app].home || def.id === Z.APPS[app].start ? [] : [{ id: Z.APPS[app].home, p: {} }];
    Z.cur[app] = { id: id, p: p };
    Z.setView(app);
  };

  /* ---------------- events ---------------- */
  function setPath(obj, path, val) {
    const parts = path.split('.');
    let o = obj;
    for (let i = 0; i < parts.length - 1; i++) o = o[parts[i]];
    o[parts[parts.length - 1]] = val;
  }
  function getPath(obj, path) {
    return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, obj);
  }
  Z.getPath = getPath;
  document.addEventListener('click', function (e) {
    const t = e.target;
    const view = t.closest('[data-view]');
    if (view) { Z.setView(view.getAttribute('data-view')); return; }
    const jump = t.closest('[data-jump]');
    if (jump) { Z.jump(jump.getAttribute('data-jump')); return; }
    const phone = t.closest('.phone');
    if (!phone) {
      const act0 = t.closest('[data-vact]');
      if (act0 && Z.vacts[act0.getAttribute('data-vact')]) Z.vacts[act0.getAttribute('data-vact')](act0, e);
      return;
    }
    if (t.matches('[data-ovbg]')) { Z.closeOv(); return; }
    const push = t.closest('[data-push]');
    if (push) { document.getElementById('phone-push').innerHTML = ''; }
    const act = t.closest('[data-act]');
    if (act) {
      e.preventDefault();
      const name = act.getAttribute('data-act');
      if (name === 'closeOv') { Z.closeOv(); return; }
      if (Z.acts[name]) Z.acts[name](act, e); else console.warn('No action', name);
      return;
    }
    const back = t.closest('[data-back]');
    if (back) { Z.closeOv(); Z.back(); return; }
    const go = t.closest('[data-go]');
    if (go) {
      e.preventDefault();
      let p = {};
      const raw = go.getAttribute('data-p');
      if (raw) { try { p = JSON.parse(raw); } catch (err) { console.warn('Bad data-p', raw); } }
      Z.closeOv();
      Z.go(go.getAttribute('data-go'), p, { root: go.hasAttribute('data-root') });
    }
  });
  document.addEventListener('input', function (e) {
    const m = e.target.closest && e.target.closest('[data-model]');
    if (m) setPath(Z.S, m.getAttribute('data-model'), m.type === 'checkbox' ? m.checked : m.value);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') Z.closeOv();
  });
  Z.on('replaceCart', function (el) {
    Z.S.cart = []; Z.S.cartShop = null;
    Z.closeOv();
    Z.cartAdd(el.getAttribute('data-item'), el.getAttribute('data-var') || null, 1);
    Z.refresh();
    Z.toast('New cart started');
  });

  Z.on('toggleDuty', function () {
    Z.S.dutyOnline = !Z.S.dutyOnline;
    const me = Z.staff(Z.S.me); if (me) me.online = Z.S.dutyOnline;
    Z.refresh();
    Z.toast(Z.S.dutyOnline ? 'You are online' : 'You are offline');
  });

  // viewer-level actions (outside the phone)
  Z.vacts = {
    back: function () { Z.back(); },
    restart: function () {
      const app = Z.view;
      if (!Z.APPS[app]) return;
      Z.hist[app] = [];
      Z.S.loggedIn[app] = false;
      Z.cur[app] = { id: Z.APPS[app].start, p: {} };
      Z.render();
    },
    phase2: function (el) {
      Z.FEATURES.deliveryRole = !Z.FEATURES.deliveryRole;
      el.setAttribute('aria-pressed', String(Z.FEATURES.deliveryRole));
      el.textContent = Z.FEATURES.deliveryRole ? 'Phase 2 preview: on' : 'Preview Phase 2 (delivery boys)';
      if (!Z.FEATURES.deliveryRole && Z.view === 'delivery') Z.setView('admin'); else Z.setView(Z.view);
    },
    resetAll: function () {
      Z.resetState();
      ['customer', 'admin', 'delivery'].forEach(function (a) { Z.hist[a] = []; Z.cur[a] = { id: Z.APPS[a].start, p: {} }; });
      Z._tick = 0;
      Z.setView(Z.APPS[Z.view] ? Z.view : 'customer');
    }
  };

  Z.pages = {};
  Z.boot = function () {
    let v = 'customer';
    try { const s = localStorage.getItem('zugo-mock-view'); if (s && Z.VIEWS.some(function (x) { return x.id === s; })) v = s; } catch (e) { /* ignore */ }
    const hash = (location.hash || '').replace('#', '');
    if (hash && Z.VIEWS.some(function (x) { return x.id === hash; })) v = hash;
    if (v === 'delivery' && !Z.FEATURES.deliveryRole) v = 'customer';
    Z.setView(v);
  };
})();
