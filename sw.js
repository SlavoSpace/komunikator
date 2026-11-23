/* zdzislaw.dysza.app — program powiadomień w tle (service worker). Wersja 2026-11-23 23:30 · 6487f14. S40, 23.11.2026.
   Dostaje powiadomienie od usługi przeglądarki (treść przychodzi zaszyfrowana, przeglądarka ją odszyfrowuje), pokazuje je
   i dopiero po pokazaniu odsyła do bazy potwierdzenie: numer powiadomienia i jego losowy znak (bez sesji osoby).
   Stuknięcie w powiadomienie otwiera aplikację. Niczego nie przechowuje — strona zawsze idzie z sieci. */
var BAZA = 'https://srmiealxhcbjornmnboe.supabase.co';
var KLUCZ = 'sb_publishable_NkiS-_7GBmW5d3ufWjjFEg_CuCpaADz';

self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

function potwierdz(id, znak, co) {
  if (!id || !znak) return Promise.resolve();
  return fetch(BAZA + '/rest/v1/rpc/zdzislaw_doszlo', {
    method: 'POST', keepalive: true, cache: 'no-store',
    headers: { apikey: KLUCZ, Authorization: 'Bearer ' + KLUCZ, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_id: id, p_znak: znak, p_co: co })
  }).then(function () {}, function () { /* brak sieci — powiadomienie i tak pokazane */ });
}
function okna() { return self.clients.matchAll({ type: 'window', includeUncontrolled: true }); }
function powiedzOknom(wiadomosc) {
  return okna().then(function (lista) { lista.forEach(function (o) { o.postMessage(wiadomosc); }); }, function () {});
}

// powiadomienie przyszło: pokaż je, potem potwierdź w bazie i daj znać otwartej aplikacji
function naPush(e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { b: e.data ? e.data.text() : '' }; }
  var opcje = { body: d.b || '', icon: 'ikona-192.png', badge: 'znaczek-96.png', lang: 'pl', data: { id: d.id, z: d.z, u: d.u || './' } };
  if (d.id) opcje.tag = 'zdz-' + d.id;                      // ponowiona wysyłka zastępuje to samo powiadomienie
  e.waitUntil(self.registration.showNotification(d.t || 'ZDZISŁAW', opcje)
    .then(function () { return potwierdz(d.id, d.z, 'pokazano'); })
    .then(function () { return powiedzOknom({ typ: 'powiadomienie', id: d.id }); }));
}
// stuknięcie w powiadomienie: zapisz „otwarto” i pokaż aplikację (otwarte okno na wierzch albo nowe)
function naKlik(e) {
  var d = e.notification.data || {};
  e.notification.close();
  e.waitUntil(Promise.all([
    potwierdz(d.id, d.z, 'otwarto').then(function () { return powiedzOknom({ typ: 'otwarto', id: d.id }); }),
    okna().then(function (lista) {
      for (var i = 0; i < lista.length; i++) { if ('focus' in lista[i]) return lista[i].focus(); }
      return self.clients.openWindow(d.u || './');
    }).then(function () {}, function () { /* system nie pozwolił przenieść okna na wierzch */ })
  ]));
}
self.addEventListener('push', naPush);
self.addEventListener('notificationclick', naKlik);
// przeglądarka wymieniła adres powiadomień: aplikacja zapisze nowy przy najbliższym otwarciu
self.addEventListener('pushsubscriptionchange', function () { powiedzOknom({ typ: 'subskrypcja' }); });
