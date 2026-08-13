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
// v3: agora também cacheia os scripts do SDK do Firebase (gstatic.com).
// Antes eles ficavam de fora junto com as chamadas de API do Firestore/Auth
// (googleapis.com), mas são coisas diferentes: gstatic.com aqui serve só os
// arquivos .js do SDK (estáticos, versionados na URL), enquanto googleapis.com
// é quem faz as chamadas de dados de verdade (essas sim nunca devem ser
// cacheadas). Sem cachear o SDK, o app não conseguia nem inicializar o modo
// nuvem estando 100% offline (script não carregava, e o site caía sozinho
// pro modo local, escondendo a sala e as atividades da equipe).
const CACHE_NAME = 'lamparina-v3';
const CORE_FILES = ['./index.html', './manifest.json', './firebase-config.js'];

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
  // Só intercepta pedidos GET. As chamadas de dados do Firestore/Auth
  // (googleapis.com) sempre vão direto pra rede — essas nunca podem vir de
  // cache. Os arquivos do SDK do Firebase (gstatic.com) são estáticos e
  // passam pela mesma regra network-first-com-fallback de qualquer outro
  // arquivo do site, para funcionarem offline também.
  if (event.request.method !== 'GET' || event.request.url.includes('googleapis.com')) return;
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
