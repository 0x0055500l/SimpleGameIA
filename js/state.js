/* ==========================================================================
   CHRONOS MEMORY CLASH - GESTOR DE ESTADO GLOBAL
   Centraliza la configuración de la partida, puntajes, turnos y temporizadores
   ========================================================================== */

import { storage } from './storage.js';

export const state = {
  // Configuración de la aplicación
  theme: 'dark',
  lang: 'es',
  sound: true,
  currentScreen: 'screen-auth',

  // Configuración del Lobby para la partida activa
  config: {
    mode: 'pvp',       // 'pvp' (local) | 'ai' (contra bot)
    aiLevel: 'normal', // 'easy' | 'normal' | 'hard'
    boardSize: 4,      // 4 (4x4) | 6 (6x6) | 8 (8x8)
    turnTimeout: 15,   // 0 (sin tiempo) | 15 | 30 | 45
    cardTheme: 'tech'  // 'tech' | 'emojis' | 'cosmic' | 'animals'
  },

  // Estado en juego de los jugadores
  p1: {
    name: 'Jugador 1',
    avatar: '👨‍🚀',
    score: 0,
    currentStreak: 0,
    maxStreak: 0
  },

  p2: {
    name: 'Jugador 2',
    avatar: '👩‍🚀',
    score: 0,
    currentStreak: 0,
    maxStreak: 0,
    isAI: false
  },

  // Estado del Tablero y Turnos
  match: {
    active: false,
    paused: false,
    currentTurn: 1, // 1 (Jugador 1) | 2 (Jugador 2 / IA)
    cards: [],      // Arreglo con la baraja de juego actual
    flippedCards: [], // Cartas volteadas en el turno en curso (máximo 2)
    pairsMatched: 0,
    totalPairs: 8,
    isProcessing: false, // Bloqueo de clics mientras se evalúa una pareja o juega la IA
    timerId: null,
    timeRemaining: 15
  },

  // Inicializar estado desde localStorage
  init() {
    const saved = storage.loadSettings();
    this.theme = saved.theme || 'dark';
    this.lang = saved.lang || 'es';
    this.sound = saved.sound !== undefined ? saved.sound : true;
    
    this.p1.name = saved.lastP1 || 'Jugador 1';
    this.p1.avatar = saved.lastP1Avatar || '👨‍🚀';
    this.p2.name = saved.lastP2 || 'Jugador 2';
    this.p2.avatar = saved.lastP2Avatar || '👩‍🚀';
    
    this.config.mode = saved.gameMode || 'pvp';
    this.config.aiLevel = saved.aiLevel || 'normal';
    this.config.boardSize = parseInt(saved.boardSize || '4', 10);
    this.config.turnTimeout = parseInt(saved.turnTimer || '15', 10);
    this.config.cardTheme = saved.cardTheme || 'tech';
  },

  // Reiniciar estado para una nueva partida
  resetForNewMatch() {
    this.p1.score = 0;
    this.p1.currentStreak = 0;
    this.p1.maxStreak = 0;
    
    this.p2.score = 0;
    this.p2.currentStreak = 0;
    this.p2.maxStreak = 0;
    this.p2.isAI = (this.config.mode === 'ai');
    
    this.match.active = true;
    this.match.paused = false;
    this.match.currentTurn = 1;
    this.match.flippedCards = [];
    this.match.pairsMatched = 0;
    this.match.totalPairs = (this.config.boardSize * this.config.boardSize) / 2;
    this.match.isProcessing = false;
    this.match.timeRemaining = this.config.turnTimeout;
    
    if (this.match.timerId) {
      clearInterval(this.match.timerId);
      this.match.timerId = null;
    }
  },

  // Alternar al siguiente jugador en el turno
  switchTurn() {
    this.match.currentTurn = (this.match.currentTurn === 1) ? 2 : 1;
    this.match.flippedCards = [];
    this.match.timeRemaining = this.config.turnTimeout;
    
    // Reiniciar racha actual del jugador que perdió el turno
    if (this.match.currentTurn === 1) {
      this.p2.currentStreak = 0;
    } else {
      this.p1.currentStreak = 0;
    }
  },

  // Añadir puntaje y racha al jugador activo
  registerMatchSuccess() {
    const activePlayer = (this.match.currentTurn === 1) ? this.p1 : this.p2;
    activePlayer.score += 1;
    activePlayer.currentStreak += 1;
    if (activePlayer.currentStreak > activePlayer.maxStreak) {
      activePlayer.maxStreak = activePlayer.currentStreak;
    }
    this.match.pairsMatched += 1;
    this.match.flippedCards = [];
    // Mantener el turno del jugador tras un acierto (regla de oro del juego de memoria)
    this.match.timeRemaining = this.config.turnTimeout;
  }
};
