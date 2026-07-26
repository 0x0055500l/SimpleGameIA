/* ==========================================================================
   CHRONOS MEMORY CLASH - CONTROLADOR DE INTERFAZ & ANIMACIONES VISUALES
   Renderizado del DOM, partículas de confeti, modales y actualización de HUD
   ========================================================================== */

import { state } from './state.js';
import { i18n } from './i18n.js';
import { storage } from './storage.js';

let confettiReqId = null;

export const ui = {
  // --- Renderizado del Tablero ---
  renderBoard() {
    const grid = document.getElementById('card-grid');
    if (!grid) return;

    // Ajustar clase de grilla según dificultad
    grid.className = 'card-grid';
    grid.classList.add(`grid-${state.config.boardSize}x${state.config.boardSize}`);

    grid.innerHTML = '';
    
    state.match.cards.forEach((card, idx) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'memory-card';
      cardEl.dataset.index = idx;

      cardEl.innerHTML = `
        <div class="card-face-down"></div>
        <div class="card-face-up">${card.val}</div>
      `;

      cardEl.addEventListener('click', () => {
        // Al hacer clic, enviamos la orden al motor del juego
        import('./game.js').then(m => m.game.onCardClick(idx));
      });

      grid.appendChild(cardEl);
    });
  },

  updateCardView(idx) {
    const cardEl = document.querySelector(`.memory-card[data-index="${idx}"]`);
    if (!cardEl) return;
    const cardData = state.match.cards[idx];
    
    if (cardData.flipped || cardData.matched) {
      cardEl.classList.add('flipped');
    } else {
      cardEl.classList.remove('flipped');
    }
  },

  setCardMatched(idx) {
    const cardEl = document.querySelector(`.memory-card[data-index="${idx}"]`);
    if (cardEl) {
      cardEl.classList.add('flipped', 'matched');
    }
  },

  setCardError(idx) {
    const cardEl = document.querySelector(`.memory-card[data-index="${idx}"]`);
    if (cardEl) {
      cardEl.classList.add('error');
    }
  },

  resetCardError(idx) {
    const cardEl = document.querySelector(`.memory-card[data-index="${idx}"]`);
    if (cardEl) {
      cardEl.classList.remove('error');
    }
  },

  // --- Actualización del HUD (Marcadores y Turnos) ---
  updateHUD() {
    // Nombres y Avatares
    document.getElementById('hud-p1-name').textContent = state.p1.name;
    document.getElementById('hud-p1-avatar').textContent = state.p1.avatar;
    document.getElementById('hud-p2-name').textContent = state.p2.name;
    document.getElementById('hud-p2-avatar').textContent = state.p2.avatar;

    // Puntuaciones
    document.getElementById('hud-p1-score').textContent = state.p1.score;
    document.getElementById('hud-p2-score').textContent = state.p2.score;

    // Rachas
    const p1StreakEl = document.getElementById('hud-p1-streak');
    const p2StreakEl = document.getElementById('hud-p2-streak');

    if (state.p1.currentStreak >= 2) {
      p1StreakEl.textContent = `🔥 ${state.p1.currentStreak}`;
      p1StreakEl.classList.add('show');
    } else {
      p1StreakEl.classList.remove('show');
    }

    if (state.p2.currentStreak >= 2) {
      p2StreakEl.textContent = `🔥 ${state.p2.currentStreak}`;
      p2StreakEl.classList.add('show');
    } else {
      p2StreakEl.classList.remove('show');
    }

    // Resaltado de Turno Activo
    const hudP1 = document.getElementById('hud-p1');
    const hudP2 = document.getElementById('hud-p2');
    const turnBadge = document.getElementById('turn-indicator');

    turnBadge.classList.remove('turn-animate');
    void turnBadge.offsetWidth; // Reflow para reiniciar animación
    turnBadge.classList.add('turn-animate');

    if (state.match.currentTurn === 1) {
      hudP1.classList.add('active');
      hudP2.classList.remove('active');
      turnBadge.className = 'turn-badge turn-animate';
      turnBadge.textContent = i18n.t('turn_p1', { p1: state.p1.name });
    } else {
      hudP1.classList.remove('active');
      hudP2.classList.add('active');
      turnBadge.className = 'turn-badge p2-turn turn-animate';
      turnBadge.textContent = i18n.t('turn_p2', { p2: state.p2.name });
    }

    // Progreso Total de Parejas
    document.getElementById('pairs-matched-count').textContent = state.match.pairsMatched;
    document.getElementById('pairs-total-count').textContent = state.match.totalPairs;
  },

  updateTimerDisplay(seconds, pct) {
    const secEl = document.getElementById('timer-seconds');
    const barEl = document.getElementById('timer-bar');
    const timerBox = document.getElementById('timer-box');

    if (!secEl || !barEl) return;

    if (state.config.turnTimeout <= 0) {
      timerBox.style.display = 'none';
      return;
    } else {
      timerBox.style.display = 'flex';
    }

    secEl.textContent = seconds;
    barEl.style.width = `${Math.max(0, Math.min(100, pct))}%`;

    barEl.classList.remove('warning', 'danger');
    if (seconds <= 5 && seconds > 0) {
      barEl.classList.add('danger');
    } else if (seconds <= 8 && seconds > 5) {
      barEl.classList.add('warning');
    }
  },

  // --- Sistema de Notificaciones Rápidas (Toasts) ---
  showToast(msg, type = 'info') {
    const alertModal = document.getElementById('modal-alert');
    const overlay = document.getElementById('modal-overlay');
    
    document.getElementById('alert-icon').textContent = type === 'warning' ? '⏰' : 'ℹ️';
    document.getElementById('alert-title').textContent = type === 'warning' ? i18n.t('alert_timeout_title') : 'Notificación';
    document.getElementById('alert-msg').textContent = msg;

    overlay.classList.remove('hidden');
    alertModal.classList.remove('hidden');
    document.getElementById('modal-gameover').classList.add('hidden');
  },

  hideModals() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.getElementById('modal-gameover').classList.add('hidden');
    document.getElementById('modal-alert').classList.add('hidden');
    this.stopConfetti();
  },

  // --- Modal de Fin de Partida ---
  showGameOverModal(winner) {
    const overlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('modal-gameover');
    const badge = document.getElementById('gameover-badge');
    const title = document.getElementById('gameover-title');
    const avatar = document.getElementById('gameover-avatar');
    const summary = document.getElementById('gameover-summary');

    // Nombres y puntajes finales
    document.getElementById('go-p1-name').textContent = state.p1.name;
    document.getElementById('go-p1-score').textContent = `${state.p1.score} ${i18n.t('score_pairs')}`;
    document.getElementById('go-p2-name').textContent = state.p2.name;
    document.getElementById('go-p2-score').textContent = `${state.p2.score} ${i18n.t('score_pairs')}`;

    if (winner === 'p1') {
      badge.textContent = i18n.t('go_win_badge');
      title.textContent = i18n.t('go_win_title', { winner: state.p1.name });
      avatar.textContent = state.p1.avatar;
      summary.textContent = i18n.t('go_summary_win');
      this.launchConfetti(true); // Confetti neón
    } else if (winner === 'p2') {
      badge.textContent = i18n.t('go_win_badge');
      title.textContent = i18n.t('go_win_title', { winner: state.p2.name });
      avatar.textContent = state.p2.avatar;
      summary.textContent = i18n.t('go_summary_win');
      this.launchConfetti(true);
    } else {
      badge.textContent = i18n.t('go_tie_badge');
      title.textContent = i18n.t('go_tie_title');
      avatar.textContent = '🤝';
      summary.textContent = i18n.t('go_summary_tie');
      this.launchConfetti(false);
    }

    overlay.classList.remove('hidden');
    modal.classList.remove('hidden');
    document.getElementById('modal-alert').classList.add('hidden');
  },

  // --- Salón de la Fama y Estadísticas ---
  renderStatsScreen() {
    const users = storage.getAllUsers();
    const select = document.getElementById('stats-user-select');
    if (!select) return;

    const currentVal = select.value || state.p1.name;
    select.innerHTML = '';

    const usernames = Object.keys(users);
    if (usernames.length === 0) {
      // Si no hay usuarios registrados, agregar el actual por defecto
      storage.registerUser(state.p1.name, state.p1.avatar);
      usernames.push(state.p1.name);
    }

    usernames.forEach(uname => {
      const opt = document.createElement('option');
      opt.value = uname;
      opt.textContent = `${users[uname].avatar || '👤'} ${uname}`;
      if (uname === currentVal) opt.selected = true;
      select.appendChild(opt);
    });

    this.updateStatsMetrics(select.value || usernames[0]);
    this.renderHistoryTable();
  },

  updateStatsMetrics(username) {
    const uStats = storage.getUserStats(username);
    if (!uStats) return;

    const winrate = uStats.played > 0 ? Math.round((uStats.wins / uStats.played) * 100) : 0;
    
    document.getElementById('stat-wins').textContent = uStats.wins;
    document.getElementById('stat-played').textContent = uStats.played;
    document.getElementById('stat-winrate').textContent = `${winrate}%`;
    document.getElementById('stat-streak').textContent = uStats.bestStreak || 0;
  },

  renderHistoryTable() {
    const history = storage.getMatchHistory();
    const tbody = document.getElementById('history-table-body');
    const noMsg = document.getElementById('no-history-msg');
    
    if (!tbody) return;
    tbody.innerHTML = '';

    if (history.length === 0) {
      noMsg.style.display = 'block';
      return;
    } else {
      noMsg.style.display = 'none';
    }

    history.forEach(rec => {
      const tr = document.createElement('tr');
      const winText = rec.winner === 'p1' ? `🏆 ${rec.p1.name}` : (rec.winner === 'p2' ? `🏆 ${rec.p2.name}` : '🤝 Empate');
      
      tr.innerHTML = `
        <td style="color: var(--text-muted); font-size: 0.85rem;">${rec.date}</td>
        <td><span class="badge" style="margin:0; padding:0.2rem 0.6rem; font-size:0.75rem;">${rec.mode === 'ai' ? 'Vs IA' : 'Local'} (${rec.boardSize})</span></td>
        <td><strong>${rec.p1.name}</strong> (${rec.p1Score}) vs <strong>${rec.p2.name}</strong> (${rec.p2Score})</td>
        <td style="color: var(--accent-green); font-weight:700;">${winText}</td>
      `;
      tbody.appendChild(tr);
    });
  },

  // --- Motor de Confeti y Partículas de Victoria (Canvas Vanilla) ---
  launchConfetti(isVictory = true) {
    this.stopConfetti();
    const canvas = document.getElementById('fx-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const count = isVictory ? 160 : 60;
    const colors = isVictory 
      ? ['#00f0ff', '#ff0055', '#00ff88', '#ffb800', '#ffffff', '#a855f7'] 
      : ['#94a3b8', '#64748b', '#cbd5e1', '#ffffff'];

    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 8 + 4,
        d: Math.random() * count + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleIncremental: (Math.random() * 0.07) + 0.05,
        tiltAngle: 0,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() * 4) + 2
      });
    }

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, idx) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + p.vy);
        p.x += Math.sin(p.tiltAngle) * 2 + p.vx;
        p.tilt = Math.sin(p.tiltAngle) * 12;

        if (p.y > canvas.height) {
          particles[idx] = {
            x: Math.random() * canvas.width,
            y: -20,
            r: p.r,
            d: p.d,
            color: p.color,
            tilt: p.tilt,
            tiltAngleIncremental: p.tiltAngleIncremental,
            tiltAngle: p.tiltAngle,
            vx: p.vx,
            vy: p.vy
          };
        }

        ctx.beginPath();
        ctx.lineWidth = p.r / 2;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 3, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 5);
        ctx.stroke();
      });

      confettiReqId = requestAnimationFrame(render);
    }

    render();

    // Detener automáticamente a los 10 segundos para no consumir recursos indefinitely
    setTimeout(() => {
      this.stopConfetti();
    }, 10000);
  },

  stopConfetti() {
    if (confettiReqId) {
      cancelAnimationFrame(confettiReqId);
      confettiReqId = null;
    }
    const canvas = document.getElementById('fx-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
};
