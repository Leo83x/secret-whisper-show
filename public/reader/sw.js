/* ==========================================================================
   SERVICE WORKER OFICIAL - O ÚLTIMO SEGREDO DA HUMANIDADE (E-READER PWA)
   Estratégia: NETWORK-FIRST (Rede Sempre Primeiro)
   Finalidade: Zero risco de cache preso + Leitura Offline segura
   ========================================================================== */

const CACHE_NAME = 'ush-reader-v2.5';

// Recursos essenciais para permitir leitura no modo avião / offline
const PRECACHE_ASSETS = [
  '/reader/',
  '/reader/index.html',
  '/reader/css/style.css',
  '/reader/js/app.js',
  '/reader/js/chapters.js',
  '/reader/manifest.json',
  '/reader/icons/icon-192.png',
  '/reader/icons/icon-512.png',
  '/reader/assets/capa_ush.jpg'
];

// 1. Instalação: Pré-cache inicial silencioso
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[PWA SW] Aviso no pré-cache (não bloqueante):', err);
      });
    })
  );
});

// 2. Ativação: Limpeza imediata de versões antigas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[PWA SW] Removendo cache legado:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Interceptação: NETWORK-FIRST ESTRITO
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // REGRA DE SEGURANÇA 1: Apenas requisições GET
  if (req.method !== 'GET') {
    return;
  }

  // REGRA DE SEGURANÇA 2: NUNCA interceptar APIs, Supabase ou rotas fora do /reader/
  if (url.pathname.startsWith('/api/') || 
      url.hostname.includes('supabase.co') || 
      url.hostname.includes('pagar.me') ||
      url.hostname.includes('facebook') ||
      url.hostname.includes('google-analytics') ||
      !url.pathname.startsWith('/reader/')) {
    return; // Pass-through direto para o navegador
  }

  // ESTRATÉGIA NETWORK-FIRST:
  // Tenta baixar da rede. Se tiver internet, entrega a versão mais recente e atualiza o cache.
  // Se estiver offline ou a rede falhar, entrega do cache.
  event.respondWith(
    fetch(req)
      .then((networkResponse) => {
        // Se a resposta for válida, clonar e salvar no cache
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Falha de rede (offline): buscar no cache
        return caches.match(req).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Se for navegação de página html e falhou, entrega o index.html em cache
          if (req.mode === 'navigate') {
            return caches.match('/reader/index.html');
          }
          return new Response('Offline - Conteúdo não disponível sem conexão', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })
          });
        });
      })
  );
});
