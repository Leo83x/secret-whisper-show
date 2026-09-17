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
