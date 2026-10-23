/* ============================================================
   Service Worker — ONG Amor Animal Marília
   Estratégias:
   - Navegação (HTML) .......... network-first, fallback offline.html
   - API (projetosdinamicos) ... network-first, fallback do último cache (só GETs sem token)
   - Assets estáticos .......... stale-while-revalidate (rápido e sempre atualizado)
   ============================================================ */
'use strict';

var CACHE_VERSION = 'amoranimal-v1.0.2';
var CACHE_NAME = CACHE_VERSION;
var OFFLINE_URL = 'offline.html';

/* Casca mínima do site, pré-cacheada na instalação */
var PRECACHE_URLS = [
  './',
  'index.html',
  'offline.html',
  'manifest.json',
  'static/css/default.css',
  'static/css/home.css',
  'static/css/impactos.css',
  'static/css/icons/bootstrap-icons.min.css',
  'static/css/favicon/ong.ico',
  'static/css/imagem/ong.jpg',
  'static/js/api.js',
  'static/js/pwa.js',
  'static/pwa/icon-192.png',
  'static/pwa/icon-512.png',
  'static/pwa/maskable-512.png',
  'static/css/favicon/apple-touch-icon.png'
];

var API_ORIGIN = 'https://api.projetosdinamicos.com.br';

/* ---------- Instalação ---------- */
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        // addAll falha como um todo se um item 404; usa requisições individuais tolerantes
        return Promise.all(
          PRECACHE_URLS.map(function (url) {
            return cache.add(url).catch(function () { /* item opcional indisponível */ });
          })
        );
      })
      .then(function () { return self.skipWaiting(); })
  );
});

/* ---------- Ativação: limpa versões antigas ---------- */
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) { return key.indexOf('amoranimal-') === 0 && key !== CACHE_NAME; })
            .map(function (key) { return caches.delete(key); })
        );
      })
      .then(function () { return self.clients.claim(); })
  );
});

/* ---------- Estratégias ---------- */

/** Tenta a rede; se falhar usa o cache. `shouldCache` controla persistir a resposta. */
function networkFirst(request, shouldCache, fallbackUrl) {
  return fetch(request)
    .then(function (response) {
      if (shouldCache && response && response.ok) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(request, clone); });
      }
      return response;
    })
    .catch(function () {
      return caches.match(request).then(function (cached) {
        if (cached) return cached;
        if (fallbackUrl) {
          return caches.match(fallbackUrl).then(function (fallback) {
            if (fallback) return fallback;
            return new Response('Você está offline.', {
              status: 503,
              headers: { 'Content-Type': 'text/plain; charset=utf-8' }
            });
          });
        }
        return new Response('Indisponível offline.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      });
    });
}

/** Serve do cache imediatamente e atualiza em segundo plano. */
function staleWhileRevalidate(request) {
  var cachePromise = caches.open(CACHE_NAME);
  var fromCache = cachePromise.then(function (cache) { return cache.match(request); });

  var fromNetwork = fetch(request)
    .then(function (response) {
      if (response && response.ok) {
        var clone = response.clone();
        cachePromise.then(function (cache) { cache.put(request, clone); });
      }
      return response;
    })
    .catch(function () { return fromCache; });

  return fromCache.then(function (cached) {
    return cached || fromNetwork;
  });
}

/* ---------- Interceptação de requisições ---------- */
self.addEventListener('fetch', function (event) {
  var request = event.request;

  // Apenas GET
  if (request.method !== 'GET') return;

  var url = new URL(request.url);

  // 1) Requisições à API remota: network-first com fallback para o último cache.
  //    Só persiste respostas SEM token de admin (evita vazar dados sensíveis no cache).
  if (url.origin === API_ORIGIN) {
    var hasAuth = request.headers.get('Authorization');
    event.respondWith(networkFirst(request, !hasAuth));
    return;
  }

  // 2) Navegação entre páginas: network-first, fallback offline.html
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, true, OFFLINE_URL));
    return;
  }

  // 3) Assets do próprio site (CSS/JS/imagens/fontes): stale-while-revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request));
  }
});