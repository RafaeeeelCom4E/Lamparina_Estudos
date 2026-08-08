// Service worker mínimo — existe principalmente para o navegador
// considerar o site "instalável" como app, e permitir abrir algo
// (a última versão vista) quando estiver sem internet.
//
// IMPORTANTE: a estratégia é "network-first" (tenta a rede primeiro,
// só usa o cache se estiver offline). Uma versão antiga deste arquivo
// usava "cache-first", o que travava o app instalado numa versão
// antiga do site para sempre, mesmo depois de atualizações — por
// isso o app instalado podia se comportar diferente do site aberto
// no navegador. Sempre que este arquivo mudar (mesmo só o número da
// versão abaixo), o navegador percebe que há um service worker novo
// e atualiza sozinho.
const CACHE_NAME = 'lamparina-v2';
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
    fetch(event.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(()=>{});
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
