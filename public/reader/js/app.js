(function () {
  'use strict';

  /* ── SELEÇÃO DE ELEMENTOS DOM ────────────────────────── */
  const $ = id => document.getElementById(id);
  const $$ = sel => document.querySelectorAll(sel);

  let currentIdx = 0;
  let currentTheme = 'gold';
  let currentFont = 'serif';
  let currentFontSize = 18;
  let currentLineHeight = 1.75;

  const FONT_MAP = {
    serif: '"Cinzel Decorative", Georgia, serif',
    sans: '"Inter", -apple-system, sans-serif',
    epic: '"Cinzel Decorative", serif'
  };

  const dom = {
    body: document.body,
    coverScreen: $('cover-screen'),
    book3d: $('book-3d'),
    btnSheetStart: $('btn-sheet-start'),
    btnStart: $('btn-start-reading'),
    contentWrapper: $('content-wrapper'),
    chapterIndicator: $('chapter-indicator'),
    chapterList: $('chapter-list'),
    sidebar: $('sidebar'),
    sidebarOverlay: $('sidebar-overlay'),
    btnMenu: $('btn-menu'),
    btnCloseSidebar: $('btn-close-sidebar'),
    btnPrev: $('btn-prev'),
    btnNext: $('btn-next'),
    navCurrent: $('nav-current'),
    chapterSearch: $('chapter-search'),
    btnSettings: $('btn-settings'),
    settingsPanel: $('settings-panel'),
    btnCloseSettings: $('btn-close-settings'),
    fontSizeSlider: $('font-size'),
    fontSizeValue: $('font-size-value'),
    lineHeightSlider: $('line-height'),
    lineHeightValue: $('line-height-value')
  };

  /* ── APLICAR CONFIGURAÇÕES NA TELA ───────────────────── */
  function applyTheme(themeKey) {
    currentTheme = themeKey;
    dom.body.setAttribute('data-theme', themeKey);
    $$('.theme-card').forEach(card => {
      card.classList.toggle('active', card.dataset.theme === themeKey);
    });
    saveSettings();
  }

  function applyFontFamily(fontKey) {
    currentFont = fontKey;
    const fontCss = FONT_MAP[fontKey] || FONT_MAP.serif;
    if (dom.contentWrapper) dom.contentWrapper.style.fontFamily = fontCss;
    $$('.font-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.font === fontKey);
    });
    saveSettings();
  }

  function applyTypography(size, lh) {
    currentFontSize = size;
    currentLineHeight = lh;
    if (dom.contentWrapper) {
      dom.contentWrapper.style.fontSize = size + 'px';
      dom.contentWrapper.style.lineHeight = lh;
    }
    if (dom.fontSizeValue) dom.fontSizeValue.textContent = size + 'px';
    if (dom.lineHeightValue) dom.lineHeightValue.textContent = lh;
    if (dom.fontSizeSlider) dom.fontSizeSlider.value = size;
    if (dom.lineHeightSlider) dom.lineHeightSlider.value = lh;
    saveSettings();
  }

  function loadSettings() {
    try {
      const s = JSON.parse(localStorage.getItem('ereader_settings') || '{}');
      if (s.theme) applyTheme(s.theme);
      else applyTheme('gold');
      
      if (s.font) applyFontFamily(s.font);
      else applyFontFamily('serif');

      applyTypography(s.fontSize || 18, s.lineHeight || 1.75);
    } catch(e) {
      applyTheme('gold');
      applyFontFamily('serif');
      applyTypography(18, 1.75);
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem('ereader_settings', JSON.stringify({
        theme: currentTheme,
        font: currentFont,
        fontSize: currentFontSize,
        lineHeight: currentLineHeight
      }));
    } catch(e) {}
  }

  /* ── RENDERIZAÇÃO DO CAPÍTULO ───────────────────────── */
  function renderChapter(idx) {
    if (typeof BOOK === 'undefined' || !BOOK.chapters[idx]) return;
    currentIdx = idx;
    const ch = BOOK.chapters[idx];
    const textOnly = (ch.content || "").replace(/<[^>]*>/g, " ");
    const wordCount = textOnly.trim().split(/\s+/).filter(Boolean).length;
    const readMinutes = Math.max(1, Math.ceil(wordCount / 238));

    let html = '';

    // Dica de onboarding posicionada ANTES do título do capítulo
    const onboardingDismissed = localStorage.getItem('ereader_onboarding_dismissed');
    if (!onboardingDismissed && (idx === 0 || idx === 1)) {
      html += `
        <div id="onboarding-tip" class="onboarding-tip">
          <div class="tip-content">
            <span class="tip-icon">💡</span>
            <div class="tip-text">
              <strong>Personalize sua Leitura</strong>
              <p>Toque no ícone de engrenagem <span class="gear-highlight">⚙️</span> no topo para ajustar a fonte, tamanho do texto e modo noturno.</p>
            </div>
          </div>
          <button id="btn-close-tip" class="btn-close-tip" title="Entendi">✕</button>
        </div>
      `;
    }

    html += `
      <div class="chapter-header">
        <span class="chapter-num">${ch.num || ''}</span>
        <div class="chapter-reading-estimate" style="margin-bottom: 0.6rem;"><span class="reading-time-badge" style="display: inline-flex; align-items: center; gap: 0.35rem; font-family: var(--font-mono, monospace); font-size: 0.75rem; color: var(--acc); opacity: 0.9; padding: 0.25rem 0.65rem; background: var(--bg2); border: 1px solid var(--border); border-radius: 9999px;">⏱ ${readMinutes} min de leitura</span></div>
          <h1 class="chapter-title">${ch.title || ''}</h1>
        ${ch.subtitle ? `<div class="chapter-subtitle">${ch.subtitle}</div>` : ''}
      </div>
      <div class="chapter-body">
    `;

    if (ch.content) {
      html += ch.content;
    } else if (ch.paragraphs && ch.paragraphs.length > 0) {
      ch.paragraphs.forEach(p => {
        html += `<p>${p}</p>`;
      });
    }

    html += `</div>`;
    if (dom.contentWrapper) dom.contentWrapper.innerHTML = html;

    const label = ch.label || ch.num || (idx === 0 ? 'PRÓLOGO' : `CAPÍTULO ${idx}`);
    if (dom.chapterIndicator) dom.chapterIndicator.textContent = label;
    if (dom.navCurrent) dom.navCurrent.textContent = ch.title || '';

    updateNavState();
    highlightActiveChapter();
    updateProgress();

    const btnCloseTip = $('btn-close-tip');
    if (btnCloseTip) {
      btnCloseTip.addEventListener('click', () => {
        const tipEl = $('onboarding-tip');
        if (tipEl) tipEl.style.display = 'none';
        localStorage.setItem('ereader_onboarding_dismissed', 'true');
      });
    }


    // Reaplicar formatações de fonte no conteúdo recém-renderizado
    applyFontFamily(currentFont);
    applyTypography(currentFontSize, currentLineHeight);
  }


  function updateProgress() {
    if (typeof BOOK === 'undefined' || !BOOK.chapters.length) return;
    const total = BOOK.chapters.length;
    // Calcula o percentual de avanço com base no capítulo atual (0 a 100%)
    const pct = Math.round(((currentIdx + 1) / total) * 100);
    const readingPct = document.getElementById('reading-pct');
    const progressFill = document.getElementById('progress-fill');
    if (readingPct) readingPct.textContent = pct + '%';
    if (progressFill) progressFill.style.width = pct + '%';
  }

  function updateNavState() {
    if (dom.btnPrev) dom.btnPrev.disabled = (currentIdx === 0);
    if (dom.btnNext) dom.btnNext.disabled = (typeof BOOK !== 'undefined' && currentIdx >= BOOK.chapters.length - 1);
  }

  function buildChapterList(filter = '') {
    if (typeof BOOK === 'undefined' || !dom.chapterList) return;
    let html = '';
    BOOK.chapters.forEach((ch, idx) => {
      const label = ch.label || ch.num || (idx === 0 ? 'PRÓLOGO' : `CAPÍTULO ${idx}`);
      if (filter && !ch.title.toLowerCase().includes(filter.toLowerCase()) && !label.toLowerCase().includes(filter.toLowerCase())) {
        return;
      }
      html += `
        <button class="chapter-item-btn ${idx === currentIdx ? 'active' : ''}" data-idx="${idx}">
          <span class="ch-num">${label}</span>
          <span class="ch-title">${ch.title}</span>
        </button>
      `;
    });
    dom.chapterList.innerHTML = html;

    $$('.chapter-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        renderChapter(idx);
        closeSidebar();
        window.scrollTo(0, 0);
      });
    });
  }

  function highlightActiveChapter() {
    $$('.chapter-item-btn').forEach((btn, idx) => {
      btn.classList.toggle('active', idx === currentIdx);
    });
  }

  function openBookAndStart(idx) {
    renderChapter(idx);
    if (dom.coverScreen) {
      dom.coverScreen.style.display = 'none';
    }
    window.scrollTo(0, 0);
  }

  function openSidebar() {
    if (dom.sidebar) dom.sidebar.classList.add('open');
    if (dom.sidebarOverlay) dom.sidebarOverlay.classList.add('open');
  }

  function closeSidebar() {
    if (dom.sidebar) dom.sidebar.classList.remove('open');
    if (dom.sidebarOverlay) dom.sidebarOverlay.classList.remove('open');
  }

  function openSettings() {
    if (dom.settingsPanel) dom.settingsPanel.classList.add('open');
  }

  function closeSettings() {
    if (dom.settingsPanel) dom.settingsPanel.classList.remove('open');
  }

  /* ── LISTENERS DE EVENTOS ─────────────────────────────── */
  function setupListeners() {
    // Interação 3D do livro
    if (dom.book3d) {
      dom.book3d.addEventListener('click', function (e) {
        if (e.target.closest('#btn-sheet-start, #btn-start-reading, .cover-btn, a')) {
          return;
        }
        dom.book3d.classList.toggle('opened');
      });
    }

    // Botão Continuar Leitura (folha interna)
    if (dom.btnSheetStart) {
      dom.btnSheetStart.addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        openBookAndStart(currentIdx || 0);
      });
    }

    // Botão Iniciar Leitura
    if (dom.btnStart) {
      dom.btnStart.addEventListener('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        openBookAndStart(0);
      });
    }

    // Navegação principal
    if (dom.btnPrev) dom.btnPrev.addEventListener('click', () => { if (currentIdx > 0) { renderChapter(currentIdx - 1); window.scrollTo(0, 0); } });
    if (dom.btnNext) dom.btnNext.addEventListener('click', () => { if (currentIdx < BOOK.chapters.length - 1) { renderChapter(currentIdx + 1); window.scrollTo(0, 0); } });

    // Menu Sidebar
    if (dom.btnMenu) dom.btnMenu.addEventListener('click', openSidebar);
    if (dom.btnCloseSidebar) dom.btnCloseSidebar.addEventListener('click', closeSidebar);
    if (dom.sidebarOverlay) dom.sidebarOverlay.addEventListener('click', closeSidebar);

    // Busca de Capítulos
    if (dom.chapterSearch) {
      dom.chapterSearch.addEventListener('input', e => buildChapterList(e.target.value));
    }

    // Configurações
    if (dom.btnSettings) dom.btnSettings.addEventListener('click', openSettings);
    if (dom.btnCloseSettings) dom.btnCloseSettings.addEventListener('click', closeSettings);

    // Seleção de Temas
    $$('.theme-card').forEach(card => {
      card.addEventListener('click', () => {
        applyTheme(card.dataset.theme);
      });
    });

    // Seleção de Fontes
    $$('.font-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        applyFontFamily(btn.dataset.font);
      });
    });

    // Sliders de Tamanho e Espaçamento
    if (dom.fontSizeSlider) {
      dom.fontSizeSlider.addEventListener('input', e => {
        applyTypography(parseInt(e.target.value, 10), currentLineHeight);
      });
    }

    if (dom.lineHeightSlider) {
      dom.lineHeightSlider.addEventListener('input', e => {
        applyTypography(currentFontSize, parseFloat(e.target.value));
      });
    }
  }

  /* ── INICIALIZAÇÃO ───────────────────────────────────── */
  function init() {
    loadSettings();
    buildChapterList();
    renderChapter(0);
    setupListeners();
  }

  init();
})();

document.addEventListener('DOMContentLoaded', function() { var getEl = function(id) { return document.getElementById(id); }; var getEls = function(sel) { return document.querySelectorAll(sel); }; var fontMap = { serif: 'Crimson Text, Georgia, serif', sans: 'Inter, sans-serif', epic: 'Cinzel, serif' }; getEls('.font-btn').forEach(function(btn) { btn.addEventListener('click', function() { var fontKey = this.dataset.font; document.body.setAttribute('data-font', fontKey); var fontCss = fontMap[fontKey] || fontMap.serif; var wrapper = getEl('content-wrapper'); if (wrapper) { wrapper.style.setProperty('font-family', fontCss, 'important'); wrapper.querySelectorAll('p, span, div, h1, h2, h3').forEach(function(el) { el.style.setProperty('font-family', fontCss, 'important'); }); } getEls('.font-btn').forEach(function(b) { b.classList.toggle('active', b === btn); }); }); }); function toggleZen() { if (!document.fullscreenElement && !document.webkitFullscreenElement) { var doc = document.documentElement; if (doc.requestFullscreen) doc.requestFullscreen(); else if (doc.webkitRequestFullscreen) doc.webkitRequestFullscreen(); document.body.classList.add('zen-mode'); } else { if (document.exitFullscreen) document.exitFullscreen(); else if (document.webkitExitFullscreen) document.webkitExitFullscreen(); document.body.classList.remove('zen-mode'); } } var btnZen = getEl('btn-zen'); var btnExitZen = getEl('btn-exit-zen'); if (btnZen) btnZen.addEventListener('click', toggleZen); if (btnExitZen) btnExitZen.addEventListener('click', toggleZen); var mPrev = getEl('m-btn-prev'); var mNext = getEl('m-btn-next'); var btnPrev = getEl('btn-prev'); var btnNext = getEl('btn-next'); if (mPrev && btnPrev) mPrev.addEventListener('click', function() { btnPrev.click(); }); if (mNext && btnNext) mNext.addEventListener('click', function() { btnNext.click(); }); });
document.addEventListener('DOMContentLoaded', function() { var mNav = document.getElementById('m-nav-current'); var nav = document.getElementById('nav-current'); if (mNav && nav) { var observer = new MutationObserver(function() { mNav.textContent = nav.textContent; }); observer.observe(nav, { childList: true, characterData: true, subtree: true }); mNav.textContent = nav.textContent; } });


// Lógica de Registro de Leitor e Controle de Paywall (Capítulo 3+)

async function handleReaderRegistration(e) {
  if (e) e.preventDefault();
  const nameInput = document.getElementById('reg-name');
  const emailInput = document.getElementById('reg-email');
  const phoneInput = document.getElementById('reg-phone');
  const btn = document.getElementById('reg-btn');

  if (!nameInput || !emailInput) return;
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput ? phoneInput.value.trim() : '';

  if (!name || !email) {
    alert('Por favor, informe seu nome e e-mail.');
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerText = 'CRIANDO SUA IDENTIDADE...';
  }

  try {
    const urlRef = new URLSearchParams(window.location.search).get('ref');
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, ref: urlRef })
    });
    const data = await res.json();

    if (data.success && data.reader) {
      localStorage.setItem('ush_token', data.reader.access_token);
      localStorage.setItem('ush_name', data.reader.name);
      
      const modal = document.getElementById('registration-modal');
      if (modal) modal.style.display = 'none';

      // Recarrega o leitor com o token de acesso
      window.location.href = window.location.pathname + '?token=' + data.reader.access_token;
    } else {
      alert(data.error || 'Erro ao criar conta. Tente novamente.');
      if (btn) {
        btn.disabled = false;
        btn.innerText = 'ACESSAR A DEGUSTAÇÃO →';
      }
    }
  } catch (err) {
    alert('Erro de conexão. Verifique sua rede e tente novamente.');
    if (btn) {
      btn.disabled = false;
      btn.innerText = 'ACESSAR A DEGUSTAÇÃO →';
    }
  }
}

// Verificação de Acesso e Paywall no Capítulo 3+
async function checkChapterAccess(chapterIndex) {
  // Capítulos 1 e 2 (índices 0 e 1) são gratuitos para degustação
  if (chapterIndex < 2) {
    return true;
  }

  const token = localStorage.getItem('ush_token') || new URLSearchParams(window.location.search).get('token');

  // Se não tem token ou não está cadastrado, abre o modal de cadastro primeiro
  if (!token) {
    const regModal = document.getElementById('registration-modal');
    if (regModal) regModal.style.display = 'flex';
    return false;
  }

  // Valida com a API se o leitor já é pago ('paid')
  try {
    const res = await fetch('/api/validate-access?token=' + token);
    const data = await res.json();

    if (data.valid && data.isPaid) {
      return true; // Acesso total liberado!
    } else {
      // Leitor cadastrado mas ainda na degustação -> Abre Paywall (R$ 49)
      const paywallModal = document.getElementById('paywall-modal');
      if (paywallModal) paywallModal.style.display = 'flex';
      return false;
    }
  } catch (err) {
    // Em caso de erro de conexão, se estiver no cap 3+, abre o paywall por segurança
    const paywallModal = document.getElementById('paywall-modal');
    if (paywallModal) paywallModal.style.display = 'flex';
    return false;
  }
}

// Handler de Checkout do Paywall
// Handler de Checkout do Paywall (Integrado com Pagar.me API)
async function handlePaywallCheckout() {
  const token = localStorage.getItem('ush_token') || new URLSearchParams(window.location.search).get('token');
  const btn = document.getElementById('paywall-buy-btn');

  if (!token) {
    alert('Sua sessão de leitor não foi encontrada. Faça seu cadastro novamente.');
    const regModal = document.getElementById('registration-modal');
    if (regModal) regModal.style.display = 'flex';
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerText = 'GERANDO PAGAMENTO SEGURO...';
  }

  try {
    const res = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token, payment_method: 'checkout' })
    });

    const data = await res.json();

    if (data.success && data.checkoutUrl) {
      // Redireciona o leitor para o Checkout Seguro do Pagar.me
      window.location.href = data.checkoutUrl;
    } else {
      alert(data.error || 'Erro ao gerar o checkout. Tente novamente.');
      if (btn) {
        btn.disabled = false;
        btn.innerText = 'ADQUIRIR ACESSO COMPLETO (R$ 49) →';
      }
    }
  } catch (err) {
    alert('Erro de conexão com o meio de pagamento. Tente novamente.');
    if (btn) {
      btn.disabled = false;
      btn.innerText = 'ADQUIRIR ACESSO COMPLETO (R$ 49) →';
    }
  }
}


// Verifica no carregamento inicial se o leitor possui token/cadastro
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('ush_token') || new URLSearchParams(window.location.search).get('token');
  if (!token) {
    // Exibe o modal de cadastro inicial se for o primeiro acesso
    setTimeout(() => {
      const regModal = document.getElementById('registration-modal');
      if (regModal) regModal.style.display = 'flex';
    }, 1200);
  }
});
