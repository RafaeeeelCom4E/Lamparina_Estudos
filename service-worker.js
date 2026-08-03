// Service worker mínimo — existe principalmente para o navegador
// considerar o site "instalável" como app. Faz um cache básico dos
// arquivos estáticos para abrir mais rápido; dados (Firestore) nunca
// passam por aqui.
const CACHE_NAME = 'lamparina-v1';
const CORE_FILES = ['./index.html', './manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_FILES)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Só intercepta pedidos GET do próprio site; tudo do Firebase segue direto pra rede.
  if (event.request.method !== 'GET' || event.request.url.includes('googleapis.com') || event.request.url.includes('gstatic.com')) return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
