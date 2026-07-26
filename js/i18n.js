/* ==========================================================================
   CHRONOS MEMORY CLASH - MOTOR DE INTERNACIONALIZACIÓN (I18N)
   Soporte multi-idioma dinámico (Español, Inglés, Portugués) sin recargas
   ========================================================================== */

const translations = {
  es: {
    lang_label: "Idioma:",
    theme_dark: "Obsidiana",
    theme_light: "Minimalista",
    nav_stats: "📊 Estadísticas",
    auth_badge: "INGRESO DE JUGADORES",
    auth_title: "Registro de Pilotos Tácticos",
    auth_subtitle: "Ingresa tus datos para registrar partidas, estadísticas y rachas de victoria.",
    player_1: "JUGADOR 1",
    player_2: "JUGADOR 2 / IA",
    label_username: "Alias del Jugador:",
    label_username_p2: "Alias del Oponente:",
    btn_proceed_lobby: "⚡ CONFIGURAR PARTIDA ⚡",
    
    lobby_title: "Configuración de la Batalla",
    lobby_subtitle: "Selecciona el modo de juego, tamaño del tablero y temporizador de turno.",
    cfg_mode: "Modo de Juego",
    mode_pvp: "👥 Local (P1 vs P2)",
    mode_ai: "🤖 Contra IA (Solo)",
    cfg_ai_level: "Inteligencia Artificial",
    ai_easy: "🌱 Novato",
    ai_normal: "⚔️ Táctico",
    ai_hard: "🧠 Maestro Memoria",
    cfg_board: "Tamaño del Tablero",
    board_4x4: "🟢 4x4 (16 Cartas - Rápido)",
    board_6x6: "🟡 6x6 (36 Cartas - Normal)",
    board_8x8: "🔴 8x8 (64 Cartas - Experto)",
    cfg_timer: "Tiempo de Turno (Agotamiento)",
    timer_none: "♾️ Sin Límite",
    timer_15s: "⏱️ 15 Segundos",
    timer_30s: "⏱️ 30 Segundos",
    timer_45s: "⏱️ 45 Segundos",
    cfg_theme: "Temática de Cartas",
    theme_tech: "💻 Software & Tech",
    theme_emojis: "✨ Emojis Vibrantes",
    theme_cosmic: "🌌 Símbolos Cósmicos",
    theme_animals: "🦁 Reino Animal",
    btn_start_match: "🚀 INICIAR PARTIDA 🚀",
    
    score_pairs: "Parejas:",
    turn_p1: "TURNO DE {p1}",
    turn_p2: "TURNO DE {p2}",
    hud_completed: "completadas",
    btn_pause: "⏸️ Pausar",
    btn_resume: "▶️ Continuar",
    btn_resign: "🏳️ Rendirse / Salir",
    
    stats_title: "Salón de la Fama & Registro de Partidas",
    stats_subtitle: "Consulta tus estadísticas acumuladas, rachas históricas y el registro de tus batallas.",
    stats_select_user: "Filtrar por Jugador:",
    stat_wins: "Victorias",
    stat_played: "Partidas Jugadas",
    stat_winrate: "Tasa de Victoria",
    stat_best_streak: "Mejor Racha",
    history_title: "Registro Reciente de Partidas",
    th_date: "Fecha",
    th_mode: "Modo / Tablero",
    th_players: "Encuentro",
    th_winner: "Resultado",
    no_history: "Aún no hay partidas jugadas. ¡Inicia una batalla ahora!",
    btn_clear_stats: "🗑️ Reiniciar Estadísticas",
    
    go_win_badge: "🏆 ¡VICTORIA TÁCTICA! 🏆",
    go_tie_badge: "🤝 ¡EMPATE TÁCTICO! 🤝",
    go_win_title: "¡{winner} Gana la Batalla!",
    go_tie_title: "¡Los Maestros Han Empatado!",
    go_summary_win: "Ha demostrado una memoria cibernética excepcional al dominar el tablero.",
    go_summary_tie: "Ambos pilotos mostraron un nivel igualado de memoria suprema.",
    btn_rematch: "🔄 Revancha Inmediata",
    btn_back_lobby: "🏠 Volver al Lobby",
    
    alert_timeout_title: "¡Tiempo Agotado!",
    alert_timeout_msg: "El tiempo del turno se ha consumido. El control pasa al adversario.",
    alert_resign_title: "¡Batalla Abandonada!",
    alert_resign_msg: "{player} se ha retirado de la arena de juego.",
    btn_ok: "Entendido"
  },
  
  en: {
    lang_label: "Language:",
    theme_dark: "Obsidian",
    theme_light: "Minimalist",
    nav_stats: "📊 Statistics",
    auth_badge: "PLAYER LOGIN",
    auth_title: "Tactical Pilot Registration",
    auth_subtitle: "Enter your details to track match history, win rates, and streak records.",
    player_1: "PLAYER 1",
    player_2: "PLAYER 2 / AI",
    label_username: "Player Alias:",
    label_username_p2: "Opponent Alias:",
    btn_proceed_lobby: "⚡ CONFIGURE MATCH ⚡",
    
    lobby_title: "Battle Configuration",
    lobby_subtitle: "Select game mode, board dimension, and turn timeout limit.",
    cfg_mode: "Game Mode",
    mode_pvp: "👥 Local (P1 vs P2)",
    mode_ai: "🤖 vs AI (Solo)",
    cfg_ai_level: "Artificial Intelligence",
    ai_easy: "🌱 Novice",
    ai_normal: "⚔️ Tactical",
    ai_hard: "🧠 Memory Master",
    cfg_board: "Board Size",
    board_4x4: "🟢 4x4 (16 Cards - Quick)",
    board_6x6: "🟡 6x6 (36 Cards - Standard)",
    board_8x8: "🔴 8x8 (64 Cards - Expert)",
    cfg_timer: "Turn Timeout Limit",
    timer_none: "♾️ No Limit",
    timer_15s: "⏱️ 15 Seconds",
    timer_30s: "⏱️ 30 Seconds",
    timer_45s: "⏱️ 45 Seconds",
    cfg_theme: "Card Theme",
    theme_tech: "💻 Software & Tech",
    theme_emojis: "✨ Vibrant Emojis",
    theme_cosmic: "🌌 Cosmic Symbols",
    theme_animals: "🦁 Animal Kingdom",
    btn_start_match: "🚀 START MATCH 🚀",
    
    score_pairs: "Pairs:",
    turn_p1: "{p1}'S TURN",
    turn_p2: "{p2}'S TURN",
    hud_completed: "completed",
    btn_pause: "⏸️ Pause",
    btn_resume: "▶️ Resume",
    btn_resign: "🏳️ Resign / Leave",
    
    stats_title: "Hall of Fame & Match Log",
    stats_subtitle: "Check cumulative stats, historical streaks, and battle records.",
    stats_select_user: "Filter by Player:",
    stat_wins: "Victories",
    stat_played: "Matches Played",
    stat_winrate: "Win Rate",
    stat_best_streak: "Best Streak",
    history_title: "Recent Match Log",
    th_date: "Date",
    th_mode: "Mode / Board",
    th_players: "Encounter",
    th_winner: "Result",
    no_history: "No matches played yet. Start a battle now!",
    btn_clear_stats: "🗑️ Reset Statistics",
    
    go_win_badge: "🏆 TACTICAL VICTORY! 🏆",
    go_tie_badge: "🤝 TACTICAL DRAW! 🤝",
    go_win_title: "{winner} Wins the Battle!",
    go_tie_title: "The Masters Are Tied!",
    go_summary_win: "Demonstrated superior cybernetic memory dominance on the grid.",
    go_summary_tie: "Both pilots showed equal tactical memory mastery.",
    btn_rematch: "🔄 Immediate Rematch",
    btn_back_lobby: "🏠 Back to Lobby",
    
    alert_timeout_title: "Time Out!",
    alert_timeout_msg: "Turn timer has expired. Control passes to the opponent.",
    alert_resign_title: "Battle Forfeited!",
    alert_resign_msg: "{player} has retreated from the arena.",
    btn_ok: "Understood"
  },
  
  pt: {
    lang_label: "Idioma:",
    theme_dark: "Obsidiana",
    theme_light: "Minimalista",
    nav_stats: "📊 Estatísticas",
    auth_badge: "ENTRADA DE JOGADORES",
    auth_title: "Registro de Pilotos Táticos",
    auth_subtitle: "Insira seus dados para registrar partidas, estatísticas e sequências de vitórias.",
    player_1: "JOGADOR 1",
    player_2: "JOGADOR 2 / IA",
    label_username: "Apelido do Jogador:",
    label_username_p2: "Apelido do Oponente:",
    btn_proceed_lobby: "⚡ CONFIGURAR PARTIDA ⚡",
    
    lobby_title: "Configuração da Batalha",
    lobby_subtitle: "Selecione o modo de jogo, tamanho do tabuleiro e temporizador de turno.",
    cfg_mode: "Modo de Jogo",
    mode_pvp: "👥 Local (P1 vs P2)",
    mode_ai: "🤖 Contra IA (Solo)",
    cfg_ai_level: "Inteligência Artificial",
    ai_easy: "🌱 Novato",
    ai_normal: "⚔️ Tático",
    ai_hard: "🧠 Mestre da Memória",
    cfg_board: "Tamanho do Tabuleiro",
    board_4x4: "🟢 4x4 (16 Cartas - Rápido)",
    board_6x6: "🟡 6x6 (36 Cartas - Normal)",
    board_8x8: "🔴 8x8 (64 Cartas - Especialista)",
    cfg_timer: "Tempo de Turno (Esgotamento)",
    timer_none: "♾️ Sem Limite",
    timer_15s: "⏱️ 15 Segundos",
    timer_30s: "⏱️ 30 Segundos",
    timer_45s: "⏱️ 45 Segundos",
    cfg_theme: "Temática de Cartas",
    theme_tech: "💻 Software & Tech",
    theme_emojis: "✨ Emojis Vibrantes",
    theme_cosmic: "🌌 Símbolos Cósmicos",
    theme_animals: "🦁 Reino Animal",
    btn_start_match: "🚀 INICIAR PARTIDA 🚀",
    
    score_pairs: "Pares:",
    turn_p1: "VEZ DE {p1}",
    turn_p2: "VEZ DE {p2}",
    hud_completed: "concluídas",
    btn_pause: "⏸️ Pausar",
    btn_resume: "▶️ Continuar",
    btn_resign: "🏳️ Desistir / Sair",
    
    stats_title: "Hall da Fama & Registro de Partidas",
    stats_subtitle: "Consulte suas estatísticas acumuladas, sequências históricas e registro de batalhas.",
    stats_select_user: "Filtrar por Jogador:",
    stat_wins: "Vitórias",
    stat_played: "Partidas Jogadas",
    stat_winrate: "Taxa de Vitória",
    stat_best_streak: "Melhor Sequência",
    history_title: "Registro Recente de Partidas",
    th_date: "Data",
    th_mode: "Modo / Tabuleiro",
    th_players: "Encontro",
    th_winner: "Resultado",
    no_history: "Ainda não há partidas jogadas. Inicie uma batalha agora!",
    btn_clear_stats: "🗑️ Reiniciar Estatísticas",
    
    go_win_badge: "🏆 VITÓRIA TÁTICA! 🏆",
    go_tie_badge: "🤝 EMPATE TÁTICO! 🤝",
    go_win_title: "¡{winner} Vence a Batalha!",
    go_tie_title: "Os Mestres Empataram!",
    go_summary_win: "Demonstrou uma memória cibernética excepcional ao dominar o tabuleiro.",
    go_summary_tie: "Ambos os pilotos mostraram um nível igual de supremacia de memória.",
    btn_rematch: "🔄 Revancha Imediata",
    btn_back_lobby: "🏠 Voltar ao Lobby",
    
    alert_timeout_title: "Tempo Esgotado!",
    alert_timeout_msg: "O tempo do turno acabou. O controle passa para o adversário.",
    alert_resign_title: "Batalha Abandonada!",
    alert_resign_msg: "{player} se retirou da arena.",
    btn_ok: "Entendido"
  }
};

let currentLang = 'es';

export const i18n = {
  init(defaultLang = 'es') {
    currentLang = defaultLang;
    this.updateDOM();
  },

  setLang(lang) {
    if (translations[lang]) {
      currentLang = lang;
      this.updateDOM();
      return true;
    }
    return false;
  },

  getLang() {
    return currentLang;
  },

  t(key, params = {}) {
    let str = translations[currentLang]?.[key] || translations['es'][key] || key;
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    }
    return str;
  },

  updateDOM() {
    document.documentElement.lang = currentLang;
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = this.t(key);
      if (text) {
        if (el.tagName === 'INPUT' && (el.type === 'submit' || el.type === 'button')) {
          el.value = text;
        } else {
          el.textContent = text;
        }
      }
    });

    // Actualizar nombre de tema en el botón del navbar
    const themeNameSpan = document.querySelector('.theme-name');
    if (themeNameSpan) {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      themeNameSpan.textContent = isLight ? this.t('theme_light') : this.t('theme_dark');
    }
  }
};
