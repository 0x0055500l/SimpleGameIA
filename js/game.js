/* ==========================================================================
   CHRONOS MEMORY CLASH - MOTOR LÓGICO DEL JUEGO
   Algoritmo Fisher-Yates, evaluación de parejas, temporizador y modo IA
   ========================================================================== */

import { state } from './state.js';
import { audio } from './audio.js';
import { ui } from './ui.js';
import { storage } from './storage.js';
import { i18n } from './i18n.js';

// --- Sets de Cartas Temáticas (32+ símbolos únicos para cubrir hasta 8x8) ---
const CARD_THEMES = {
  tech: [
    '💻', '⚡', '🚀', '🔥', '⚙️', '🛠️', '🧬', '🤖',
    '🛰️', '📡', '🔋', '💡', '💎', '🔑', '🛡️', '🕹️',
    '🖥️', '⌨️', '🖱️', '💾', '💿', '📱', '📟', '🔌',
    '🔬', '🔭', '🧪', '🧲', '🔮', '🧭', '⏱️', '🎛️'
  ],
  emojis: [
    '😎', '🤠', '🥳', '👻', '👽', '👾', '🎃', '🤖',
    '😻', '🦄', '🐲', '🐙', '🦖', '🐝', '🐞', '🦋',
    '🍕', '🍔', '🌮', '🍿', '🍩', '🥑', '🍉', '🍒',
    '🏆', '🥇', '🎯', '🎳', '🎨', '🎭', '🎸', '🎺'
  ],
  cosmic: [
    '☀️', '🌙', '⭐', '🌟', '☄️', '🪐', '🌌', '🚀',
    '🛸', '🛰️', '🔭', '🌑', '🌓', '🌕', '⚡', '🌀',
    '🔥', '❄️', '🌈', '🌩️', '☀️', '✨', '☄️', '💫',
    '🔮', '🧿', '💎', '👑', '🔱', '⚜️', '🛡️', '⚔️'
  ],
  animals: [
    '🦁', '🐯', '🐼', '🐨', '🦊', '🐺', '🐗', '🦓',
    '🦒', '🦘', '🦥', '🦔', '🦇', '🦅', '🦉', '🦜',
    '🐢', '🐍', '🐙', '🦑', '🐬', '🐳', '🦈', '🐊',
    '🦚', '🦩', '🦢', '🦤', '🦭', '🦫', '🦦', '🦨'
  ]
};

// Memoria artificial de la IA para recordar cartas volteadas durante la batalla
let aiMemoryMap = {};

export const game = {
  // --- Inicialización y Barajado ---
  startNewMatch() {
    state.resetForNewMatch();
    aiMemoryMap = {}; // Limpiar memoria de la IA para nueva partida

    const totalPairsNeeded = state.match.totalPairs;
    const themeSymbols = CARD_THEMES[state.config.cardTheme] || CARD_THEMES.tech;
    
    // Tomar el número necesario de símbolos únicos
    const selectedSymbols = themeSymbols.slice(0, totalPairsNeeded);
    
    // Duplicar para crear parejas
    let deck = [];
    selectedSymbols.forEach((sym, idx) => {
      deck.push({ id: idx * 2, pairId: idx, val: sym, matched: false, flipped: false });
      deck.push({ id: idx * 2 + 1, pairId: idx, val: sym, matched: false, flipped: false });
    });

    // Barajado de Fisher-Yates para aleatoriedad criptográficamente pura
    this.fisherYatesShuffle(deck);

    state.match.cards = deck;
    
    // Renderizar tablero e inicializar HUD
    ui.renderBoard();
    ui.updateHUD();
    
    // Iniciar temporizador de turno si aplica
    this.startTurnTimer();

    // Si el turno 1 es asignado a una IA (raro, pero posible en modos avanzados)
    if (state.match.currentTurn === 2 && state.config.mode === 'ai') {
      this.scheduleAIMove();
    }
  },

  fisherYatesShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  // --- Interacción de Selección de Carta ---
  onCardClick(cardIndex) {
    const match = state.match;
    if (!match.active || match.paused || match.isProcessing) return;
    
    // Evitar interacciones de humanos durante el turno de la IA
    if (match.currentTurn === 2 && state.config.mode === 'ai') return;
    
    const card = match.cards[cardIndex];
    if (!card || card.flipped || card.matched) return;

    this.flipCard(cardIndex);
  },

  flipCard(cardIndex) {
    const match = state.match;
    const card = match.cards[cardIndex];
    
    card.flipped = true;
    match.flippedCards.push(cardIndex);
    
    // Sonido y actualización visual
    audio.playFlip();
    ui.updateCardView(cardIndex);
    
    // Alimentar la memoria de la IA con probabilidad según dificultad
    this.memorizeForAI(cardIndex, card);

    // Evaluar jugada si se han volteado 2 cartas
    if (match.flippedCards.length === 2) {
      this.evaluateTurn();
    }
  },

  // --- Evaluación del Turno (Acierto o Fallo) ---
  evaluateTurn() {
    const match = state.match;
    match.isProcessing = true; // Bloquear tablero mientras evaluamos
    
    const [idx1, idx2] = match.flippedCards;
    const card1 = match.cards[idx1];
    const card2 = match.cards[idx2];

    if (card1.pairId === card2.pairId) {
      // --- ¡PAREJA ENCONTRADA! ---
      setTimeout(() => {
        card1.matched = true;
        card2.matched = true;
        
        audio.playMatch();
        state.registerMatchSuccess();
        
        ui.setCardMatched(idx1);
        ui.setCardMatched(idx2);
        ui.updateHUD();

        // Limpiar de la memoria de la IA las cartas ya resueltas
        delete aiMemoryMap[idx1];
        delete aiMemoryMap[idx2];

        match.isProcessing = false;

        // Comprobar fin de juego
        if (match.pairsMatched >= match.totalPairs) {
          this.endMatch();
        } else {
          // El jugador (o IA) mantiene el turno tras acertar
          this.startTurnTimer();
          if (match.currentTurn === 2 && state.config.mode === 'ai') {
            this.scheduleAIMove();
          }
        }
      }, 400);

    } else {
      // --- FALLO (NO COINCIDEN) ---
      setTimeout(() => {
        audio.playError();
        ui.setCardError(idx1);
        ui.setCardError(idx2);
      }, 400);

      // Esperar un segundo para que memoricen y voltear boca abajo
      setTimeout(() => {
        card1.flipped = false;
        card2.flipped = false;
        
        ui.resetCardError(idx1);
        ui.resetCardError(idx2);
        ui.updateCardView(idx1);
        ui.updateCardView(idx2);

        state.switchTurn();
        audio.playTurnSwitch();
        ui.updateHUD();

        match.isProcessing = false;
        this.startTurnTimer();

        // Si ahora es el turno del Jugador 2 y estamos en modo IA, ejecutar bot
        if (match.currentTurn === 2 && state.config.mode === 'ai') {
          this.scheduleAIMove();
        }
      }, 1400);
    }
  },

  // --- Temporizador del Turno (Turn Timeout) ---
  startTurnTimer() {
    const match = state.match;
    if (match.timerId) {
      clearInterval(match.timerId);
      match.timerId = null;
    }
    
    if (state.config.turnTimeout <= 0 || !match.active) {
      ui.updateTimerDisplay(0, 100); // Sin límite visual
      return;
    }

    match.timeRemaining = state.config.turnTimeout;
    ui.updateTimerDisplay(match.timeRemaining, 100);

    match.timerId = setInterval(() => {
      if (match.paused || !match.active) return;
      
      match.timeRemaining -= 1;
      const pct = (match.timeRemaining / state.config.turnTimeout) * 100;
      ui.updateTimerDisplay(match.timeRemaining, pct);

      // Sonido palpitante los últimos 3 segundos
      if (match.timeRemaining <= 3 && match.timeRemaining > 0) {
        audio.playClick();
      }

      // ¡Tiempo agotado!
      if (match.timeRemaining <= 0) {
        clearInterval(match.timerId);
        match.timerId = null;
        this.handleTurnTimeout();
      }
    }, 1000);
  },

  handleTurnTimeout() {
    const match = state.match;
    if (!match.active || match.isProcessing) return;
    
    audio.playTimeout();

    // Si había 1 carta volteada cuando se agotó el tiempo, regresarla boca abajo
    match.flippedCards.forEach(idx => {
      match.cards[idx].flipped = false;
      ui.updateCardView(idx);
    });

    match.flippedCards = [];
    match.isProcessing = false;

    // Notificación rápida o cambio visual
    ui.showToast(i18n.t('alert_timeout_msg'), 'warning');
    
    state.switchTurn();
    audio.playTurnSwitch();
    ui.updateHUD();

    this.startTurnTimer();

    if (match.currentTurn === 2 && state.config.mode === 'ai') {
      this.scheduleAIMove();
    }
  },

  // --- Inteligencia Artificial Táctica (Bot) ---
  memorizeForAI(index, card) {
    if (state.config.mode !== 'ai') return;
    
    let prob = 0.5; // Probabilidad base de recordar una carta vista
    if (state.config.aiLevel === 'easy') prob = 0.35;
    if (state.config.aiLevel === 'normal') prob = 0.70;
    if (state.config.aiLevel === 'hard') prob = 1.0; // Memoria fotográfica perfecta

    if (Math.random() <= prob) {
      aiMemoryMap[index] = card.pairId;
    }
  },

  scheduleAIMove() {
    const match = state.match;
    if (!match.active || match.paused || match.isProcessing) return;
    
    // Retraso para simular "pensamiento" humano (800ms a 1400ms)
    const delay = Math.floor(Math.random() * 600) + 800;
    setTimeout(() => {
      if (!match.active || match.currentTurn !== 2 || match.paused) return;
      this.executeAIStep();
    }, delay);
  },

  executeAIStep() {
    const match = state.match;
    if (!match.active || match.currentTurn !== 2) return;

    // Obtener índices de todas las cartas disponibles (no volteadas y no emparejadas)
    const availableIndices = [];
    match.cards.forEach((c, idx) => {
      if (!c.flipped && !c.matched) availableIndices.push(idx);
    });

    if (availableIndices.length === 0) return;

    // ¿Es la primera carta del turno de la IA?
    if (match.flippedCards.length === 0) {
      let chosenIdx = null;

      // 1. Verificar si la IA tiene en memoria 2 cartas que forman pareja
      const memoryIndices = Object.keys(aiMemoryMap).map(Number).filter(idx => !match.cards[idx].matched && !match.cards[idx].flipped);
      
      for (let i = 0; i < memoryIndices.length; i++) {
        for (let j = i + 1; j < memoryIndices.length; j++) {
          const idxA = memoryIndices[i];
          const idxB = memoryIndices[j];
          if (aiMemoryMap[idxA] === aiMemoryMap[idxB]) {
            chosenIdx = idxA; // ¡Tenemos una pareja segura en memoria!
            break;
          }
        }
        if (chosenIdx !== null) break;
      }

      // 2. Si no hay pareja conocida en memoria, elegir una carta al azar
      if (chosenIdx === null) {
        const rnd = Math.floor(Math.random() * availableIndices.length);
        chosenIdx = availableIndices[rnd];
      }

      this.flipCard(chosenIdx);

      // Programar la selección de la 2da carta
      setTimeout(() => {
        if (!match.active || match.currentTurn !== 2 || match.paused) return;
        this.executeAIStep();
      }, 900);

    } else if (match.flippedCards.length === 1) {
      // Elegir la 2da carta
      const firstIdx = match.flippedCards[0];
      const firstPairId = match.cards[firstIdx].pairId;
      let secondIdx = null;

      // 1. ¿Recuerda la IA dónde está la pareja de la primera carta?
      for (const [idxStr, pairId] of Object.entries(aiMemoryMap)) {
        const idx = Number(idxStr);
        if (idx !== firstIdx && pairId === firstPairId && !match.cards[idx].matched && !match.cards[idx].flipped) {
          secondIdx = idx; // ¡Encontrada en memoria!
          break;
        }
      }

      // 2. Si no la recuerda, elegir al azar entre las restantes
      if (secondIdx === null) {
        const remaining = availableIndices.filter(idx => idx !== firstIdx);
        if (remaining.length > 0) {
          const rnd = Math.floor(Math.random() * remaining.length);
          secondIdx = remaining[rnd];
        } else {
          secondIdx = firstIdx; // Fallback de seguridad
        }
      }

      this.flipCard(secondIdx);
    }
  },

  // --- Finalización y Resultados de Batalla ---
  endMatch() {
    const match = state.match;
    match.active = false;
    if (match.timerId) {
      clearInterval(match.timerId);
      match.timerId = null;
    }

    // Determinar ganador
    let winner = 'tie';
    if (state.p1.score > state.p2.score) winner = 'p1';
    else if (state.p2.score > state.p1.score) winner = 'p2';

    // Registrar en historial persistente
    storage.recordMatch({
      mode: state.config.mode,
      boardSize: `${state.config.boardSize}x${state.config.boardSize}`,
      p1: state.p1,
      p2: state.p2,
      winner: winner,
      p1Score: state.p1.score,
      p2Score: state.p2.score
    });

    // Celebración visual y sonora
    if (winner !== 'tie') {
      audio.playWin();
    } else {
      audio.playTie();
    }

    setTimeout(() => {
      ui.showGameOverModal(winner);
    }, 800);
  },

  // Pausar y reanudar
  togglePause() {
    const match = state.match;
    if (!match.active) return false;
    
    match.paused = !match.paused;
    if (!match.paused) {
      // Reanudar reloj
      this.startTurnTimer();
    }
    return match.paused;
  },

  // Rendición o salida de partida en curso
  resignMatch() {
    const match = state.match;
    match.active = false;
    if (match.timerId) {
      clearInterval(match.timerId);
      match.timerId = null;
    }
  }
};
