/* ==========================================================================
   CHRONOS MEMORY CLASH - CONTROLADOR PRINCIPAL (ENTRY POINT)
   Inicialización de módulos, enrutador de pantallas y vinculación de eventos
   ========================================================================== */

import { state } from './state.js';
import { i18n } from './i18n.js';
import { audio } from './audio.js';
import { storage } from './storage.js';
import { game } from './game.js';
import { ui } from './ui.js';

class AppController {
  constructor() {
    this.init();
  }

  init() {
    // 1. Cargar estado y configuración almacenada
    state.init();

    // 2. Aplicar Tema e Idioma guardado en DOM
    this.applyTheme(state.theme);
    i18n.init(state.lang);

    // 3. Restaurar valores de UI en formularios de Registro
    this.restoreAuthForm();
    this.restoreLobbyOptions();

    // 4. Vincular todos los eventos de interfaz
    this.bindNavbarEvents();
    this.bindAuthEvents();
    this.bindLobbyEvents();
    this.bindGameEvents();
    this.bindStatsEvents();
    this.bindModalEvents();

    // 5. Mostrar pantalla inicial
    this.showScreen('screen-auth');

    console.log('⚡ CHRONOS MEMORY CLASH - Motor Táctico Inicializado Correctamente ⚡');
  }

  // --- Enrutador de Pantallas SPA ---
  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(el => {
      el.classList.remove('active');
    });
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      state.currentScreen = screenId;
    }
    ui.hideModals();
    audio.playClick();
  }

  // --- Temas ---
  applyTheme(themeName) {
    state.theme = themeName;
    document.documentElement.setAttribute('data-theme', themeName);
    storage.saveSettings({ theme: themeName });
    i18n.updateDOM();
  }

  toggleTheme() {
    const nextTheme = (state.theme === 'dark') ? 'light' : 'dark';
    this.applyTheme(nextTheme);
    audio.playFlip();
  }

  // --- Configuración Inicial en UI ---
  restoreAuthForm() {
    const p1Input = document.getElementById('p1-name');
    const p2Input = document.getElementById('p2-name');
    if (p1Input) p1Input.value = state.p1.name;
    if (p2Input) p2Input.value = state.p2.name;

    // Seleccionar avatares guardados
    document.querySelectorAll('#p1-box .avatar-btn').forEach(btn => {
      if (btn.dataset.avatar === state.p1.avatar) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });

    document.querySelectorAll('#p2-box .avatar-btn').forEach(btn => {
      if (btn.dataset.avatar === state.p2.avatar) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });
  }

  restoreLobbyOptions() {
    this.setActiveBtnGroup('group-mode', state.config.mode);
    this.setActiveBtnGroup('group-ai-level', state.config.aiLevel);
    this.setActiveBtnGroup('group-board', String(state.config.boardSize));
    this.setActiveBtnGroup('group-timer', String(state.config.turnTimeout));
    this.setActiveBtnGroup('group-card-theme', state.config.cardTheme);

    const aiLevelContainer = document.getElementById('config-ai-level');
    if (aiLevelContainer) {
      if (state.config.mode === 'ai') {
        aiLevelContainer.classList.remove('hidden');
      } else {
        aiLevelContainer.classList.add('hidden');
      }
    }
  }

  setActiveBtnGroup(groupId, value) {
    const group = document.getElementById(groupId);
    if (!group) return;
    group.querySelectorAll('.option-btn').forEach(btn => {
      if (btn.dataset.val === value) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // ================= BINDING DE EVENTOS =================

  // --- Barra de Navegación ---
  bindNavbarEvents() {
    // Selector de Idioma
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
      langSelect.value = state.lang;
      langSelect.addEventListener('change', (e) => {
        const newLang = e.target.value;
        if (i18n.setLang(newLang)) {
          state.lang = newLang;
          storage.saveSettings({ lang: newLang });
          audio.playFlip();
        }
      });
    }

    // Toggle de Tema
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Toggle de Sonido
    const soundBtn = document.getElementById('sound-toggle');
    if (soundBtn) {
      soundBtn.innerHTML = state.sound ? '<span class="icon-sound">🔊</span>' : '<span class="icon-sound">🔇</span>';
      soundBtn.addEventListener('click', () => {
        audio.toggle();
      });
    }

    // Botón de Estadísticas
    const statsBtn = document.getElementById('nav-stats-btn');
    if (statsBtn) {
      statsBtn.addEventListener('click', () => {
        ui.renderStatsScreen();
        this.showScreen('screen-stats');
      });
    }

    // Click en Logo (vuelve al inicio/auth si no se está en partida)
    const brand = document.getElementById('nav-brand');
    if (brand) {
      brand.addEventListener('click', () => {
        if (state.match.active) {
          if (confirm(i18n.t('btn_resign') + '?')) {
            game.resignMatch();
            this.showScreen('screen-lobby');
          }
        } else {
          this.showScreen('screen-auth');
        }
      });
    }
  }

  // --- Pantalla 1: Registro de Jugadores ---
  bindAuthEvents() {
    // Avatares P1
    document.querySelectorAll('#p1-box .avatar-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#p1-box .avatar-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.p1.avatar = btn.dataset.avatar;
        audio.playClick();
      });
    });

    // Avatares P2
    document.querySelectorAll('#p2-box .avatar-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#p2-box .avatar-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.p2.avatar = btn.dataset.avatar;
        audio.playClick();
      });
    });

    // Botón Continuar a Lobby
    const proceedBtn = document.getElementById('btn-proceed-lobby');
    if (proceedBtn) {
      proceedBtn.addEventListener('click', () => {
        const p1Name = document.getElementById('p1-name').value.trim() || 'Jugador 1';
        const p2Name = document.getElementById('p2-name').value.trim() || 'Jugador 2';

        state.p1.name = p1Name;
        state.p2.name = p2Name;

        // Registrar o actualizar perfiles en localStorage
        storage.registerUser(p1Name, state.p1.avatar);
        if (state.config.mode !== 'ai') {
          storage.registerUser(p2Name, state.p2.avatar);
        }

        storage.saveSettings({
          lastP1: p1Name,
          lastP1Avatar: state.p1.avatar,
          lastP2: p2Name,
          lastP2Avatar: state.p2.avatar
        });

        audio.playFlip();
        this.showScreen('screen-lobby');
      });
    }
  }

  // --- Pantalla 2: Lobby de Batalla ---
  bindLobbyEvents() {
    // Volver a Registro
    const backBtn = document.getElementById('btn-back-auth');
    if (backBtn) {
      backBtn.addEventListener('click', () => this.showScreen('screen-auth'));
    }

    // Selector de Modo (PvP o IA)
    this.bindOptionGroup('group-mode', (val) => {
      state.config.mode = val;
      const aiContainer = document.getElementById('config-ai-level');
      if (val === 'ai') {
        aiContainer.classList.remove('hidden');
        state.p2.name = 'IA';
        state.p2.avatar = '🤖';
      } else {
        aiContainer.classList.add('hidden');
        state.p2.name = document.getElementById('p2-name').value.trim() || 'Jugador 2';
      }
    });

    // Nivel IA
    this.bindOptionGroup('group-ai-level', (val) => { state.config.aiLevel = val; });
    // Tamaño Tablero
    this.bindOptionGroup('group-board', (val) => { state.config.boardSize = parseInt(val, 10); });
    // Temporizador
    this.bindOptionGroup('group-timer', (val) => { state.config.turnTimeout = parseInt(val, 10); });
    // Temática
    this.bindOptionGroup('group-card-theme', (val) => { state.config.cardTheme = val; });

    // Botón INICIAR PARTIDA
    const startBtn = document.getElementById('btn-start-match');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        // Guardar preferencias en storage
        storage.saveSettings({
          gameMode: state.config.mode,
          aiLevel: state.config.aiLevel,
          boardSize: String(state.config.boardSize),
          turnTimer: String(state.config.turnTimeout),
          cardTheme: state.config.cardTheme
        });

        audio.playWin();
        this.showScreen('screen-game');
        game.startNewMatch();
      });
    }
  }

  bindOptionGroup(groupId, callback) {
    const group = document.getElementById(groupId);
    if (!group) return;
    group.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        audio.playClick();
        if (callback) callback(btn.dataset.val);
      });
    });
  }

  // --- Pantalla 3: Arena de Juego ---
  bindGameEvents() {
    // Botón Pausar
    const pauseBtn = document.getElementById('btn-pause-game');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        const isPaused = game.togglePause();
        pauseBtn.innerHTML = isPaused ? i18n.t('btn_resume') : i18n.t('btn_pause');
        audio.playClick();
        if (isPaused) {
          ui.showToast('Juego en Pausa. Pulsa Continuar para seguir jugando.');
        } else {
          ui.hideModals();
        }
      });
    }

    // Botón Rendirse / Salir
    const resignBtn = document.getElementById('btn-resign-game');
    if (resignBtn) {
      resignBtn.addEventListener('click', () => {
        if (confirm(i18n.t('btn_resign') + '?')) {
          game.resignMatch();
          this.showScreen('screen-lobby');
        }
      });
    }
  }

  // --- Pantalla 4: Estadísticas e Historial ---
  bindStatsEvents() {
    const backBtn = document.getElementById('btn-back-from-stats');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.showScreen('screen-lobby');
      });
    }

    const selectUser = document.getElementById('stats-user-select');
    if (selectUser) {
      selectUser.addEventListener('change', (e) => {
        ui.updateStatsMetrics(e.target.value);
        audio.playClick();
      });
    }

    const clearBtn = document.getElementById('btn-clear-stats');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm(i18n.t('btn_clear_stats') + '?')) {
          storage.clearStats();
          ui.renderStatsScreen();
          audio.playError();
        }
      });
    }
  }

  // --- Eventos en Modals ---
  bindModalEvents() {
    // Revancha en Modal de Victoria
    const rematchBtn = document.getElementById('btn-rematch');
    if (rematchBtn) {
      rematchBtn.addEventListener('click', () => {
        ui.hideModals();
        audio.playWin();
        game.startNewMatch();
      });
    }

    // Volver al Lobby desde Modal
    const modalLobbyBtn = document.getElementById('btn-modal-lobby');
    if (modalLobbyBtn) {
      modalLobbyBtn.addEventListener('click', () => {
        ui.hideModals();
        this.showScreen('screen-lobby');
      });
    }

    // Aceptar Alerta / Toast
    const alertOkBtn = document.getElementById('btn-alert-ok');
    if (alertOkBtn) {
      alertOkBtn.addEventListener('click', () => {
        ui.hideModals();
        if (state.match.paused) {
          game.togglePause();
          const pauseBtn = document.getElementById('btn-pause-game');
          if (pauseBtn) pauseBtn.innerHTML = i18n.t('btn_pause');
        }
      });
    }
  }
}

// Inicializar la aplicación tan pronto el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
});
