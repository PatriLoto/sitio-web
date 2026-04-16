/* ========================================
   Display Options Widget — Patricia Loto
   Guardado automático en localStorage
   ======================================== */

(function () {
  'use strict';

  // ── Valores por defecto ──────────────────────────────
  const DEFAULTS = {
    fontSize:  16,    // px
    eyeStrain: 0,     // 0–100 (opacidad del overlay cálido)
    hue:       0,     // 0–360 (filter: hue-rotate)
    padding:   0,     // 0–60 px extra en body
    spacing:   150,   // 100–220 % line-height
    font:      'default'
  };

  const FONTS = {
    'default':   '',
    'atkinson':  "'Atkinson Hyperlegible', sans-serif",
    'sans':      "'Helvetica Neue', Arial, sans-serif",
    'serif':     "Georgia, 'Times New Roman', serif"
  };

  // ── Inyectar Google Font Atkinson ────────────────────
  const link = document.createElement('link');
  link.rel  = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap';
  document.head.appendChild(link);

  // ── Cargar ajustes guardados ─────────────────────────
  function loadSettings() {
    try {
      const saved = localStorage.getItem('do-settings');
      return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : { ...DEFAULTS };
    } catch { return { ...DEFAULTS }; }
  }

  function saveSettings(s) {
    try { localStorage.setItem('do-settings', JSON.stringify(s)); } catch {}
  }

  // ── Aplicar ajustes al DOM ───────────────────────────
  function applySettings(s) {
    const root    = document.documentElement;
    const body    = document.body;
    const overlay = document.getElementById('do-overlay');

    root.style.fontSize   = s.fontSize + 'px';
    body.style.lineHeight = (s.spacing / 100).toFixed(2);

    const basePad = 0; // Quarto ya tiene su propio padding
    body.style.paddingLeft  = s.padding + 'px';
    body.style.paddingRight = s.padding + 'px';

    // Rotación de tono sobre el documento
    body.style.filter = s.hue !== 0 ? `hue-rotate(${s.hue}deg)` : '';

    // Overlay warm/sepia para reducir fatiga visual
    if (overlay) overlay.style.opacity = (s.eyeStrain / 100).toFixed(2);

    // Fuente
    if (FONTS[s.font]) {
      body.style.fontFamily = FONTS[s.font];
    } else {
      body.style.fontFamily = '';
    }
  }

  // ── Construir el HTML del widget ─────────────────────
  function buildPanel(s) {
    // Overlay
    const overlay = document.createElement('div');
    overlay.id = 'do-overlay';
    document.body.appendChild(overlay);

    // Botón flotante
    const toggle = document.createElement('button');
    toggle.id = 'display-options-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'display-options-panel');
    toggle.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg> Opciones de lectura';
    document.body.appendChild(toggle);

    // Panel
    const panel = document.createElement('div');
    panel.id   = 'display-options-panel';
    panel.role = 'dialog';
    panel.setAttribute('aria-label', 'Opciones de visualización');
    panel.innerHTML = `
      <h3>Opciones de lectura</h3>

      <div class="do-group">
        <label>Tamaño de letra <span class="do-value" id="do-fs-val">${s.fontSize}px</span></label>
        <input type="range" id="do-fontSize" min="12" max="26" step="1" value="${s.fontSize}" aria-label="Tamaño de letra">
      </div>

      <div class="do-group">
        <label>Fatiga visual <span class="do-value" id="do-es-val">${s.eyeStrain}%</span></label>
        <input type="range" id="do-eyeStrain" min="0" max="70" step="1" value="${s.eyeStrain}" aria-label="Reducir fatiga visual">
      </div>

      <div class="do-group">
        <label>Tono de color <span class="do-value" id="do-hue-val">${s.hue}°</span></label>
        <input type="range" id="do-hue" min="0" max="360" step="5" value="${s.hue}" aria-label="Rotación de tono">
      </div>

      <div class="do-group">
        <label>Márgenes laterales <span class="do-value" id="do-pad-val">${s.padding}px</span></label>
        <input type="range" id="do-padding" min="0" max="80" step="4" value="${s.padding}" aria-label="Márgenes laterales">
      </div>

      <div class="do-group">
        <label>Interlineado <span class="do-value" id="do-sp-val">${s.spacing}%</span></label>
        <input type="range" id="do-spacing" min="100" max="220" step="5" value="${s.spacing}" aria-label="Interlineado">
      </div>

      <div class="do-group">
        <label>Tipografía</label>
        <div class="do-font-buttons">
          <button class="do-font-btn ${s.font==='default'?'active':''}"  data-font="default"   style="font-family:inherit">Por defecto</button>
          <button class="do-font-btn ${s.font==='atkinson'?'active':''}" data-font="atkinson"  style="font-family:'Atkinson Hyperlegible',sans-serif">Atkinson</button>
          <button class="do-font-btn ${s.font==='sans'?'active':''}"     data-font="sans"      style="font-family:Arial,sans-serif">Sans</button>
          <button class="do-font-btn ${s.font==='serif'?'active':''}"    data-font="serif"     style="font-family:Georgia,serif">Serif</button>
        </div>
      </div>

      <button id="do-reset">↺ Restablecer por defecto</button>
    `;
    document.body.appendChild(panel);
  }

  // ── Eventos ──────────────────────────────────────────
  function bindEvents(settings) {
    const toggle = document.getElementById('display-options-toggle');
    const panel  = document.getElementById('display-options-panel');

    // Abrir/cerrar panel
    toggle.addEventListener('click', () => {
      const open = panel.classList.toggle('visible');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Cerrar al hacer clic afuera
    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && e.target !== toggle) {
        panel.classList.remove('visible');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        panel.classList.remove('visible');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });

    // Sliders
    function slider(id, key, valId, unit) {
      const el  = document.getElementById(id);
      const val = document.getElementById(valId);
      el.addEventListener('input', () => {
        settings[key] = parseFloat(el.value);
        val.textContent = el.value + unit;
        applySettings(settings);
        saveSettings(settings);
      });
    }

    slider('do-fontSize',  'fontSize',  'do-fs-val',  'px');
    slider('do-eyeStrain', 'eyeStrain', 'do-es-val',  '%');
    slider('do-hue',       'hue',       'do-hue-val', '°');
    slider('do-padding',   'padding',   'do-pad-val', 'px');
    slider('do-spacing',   'spacing',   'do-sp-val',  '%');

    // Botones de fuente
    document.querySelectorAll('.do-font-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.do-font-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        settings.font = btn.dataset.font;
        applySettings(settings);
        saveSettings(settings);
      });
    });

    // Reset
    document.getElementById('do-reset').addEventListener('click', () => {
      Object.assign(settings, DEFAULTS);
      saveSettings(settings);
      // Actualizar sliders y valores mostrados
      document.getElementById('do-fontSize').value  = DEFAULTS.fontSize;
      document.getElementById('do-eyeStrain').value = DEFAULTS.eyeStrain;
      document.getElementById('do-hue').value       = DEFAULTS.hue;
      document.getElementById('do-padding').value   = DEFAULTS.padding;
      document.getElementById('do-spacing').value   = DEFAULTS.spacing;
      document.getElementById('do-fs-val').textContent  = DEFAULTS.fontSize + 'px';
      document.getElementById('do-es-val').textContent  = DEFAULTS.eyeStrain + '%';
      document.getElementById('do-hue-val').textContent = DEFAULTS.hue + '°';
      document.getElementById('do-pad-val').textContent = DEFAULTS.padding + 'px';
      document.getElementById('do-sp-val').textContent  = DEFAULTS.spacing + '%';
      document.querySelectorAll('.do-font-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.font === 'default');
      });
      applySettings(settings);
    });
  }

  // ── Inicialización ───────────────────────────────────
  function init() {
    const settings = loadSettings();
    buildPanel(settings);
    applySettings(settings);
    bindEvents(settings);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
