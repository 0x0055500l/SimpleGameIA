/* ==========================================================================
   CHRONOS MEMORY CLASH - CAPA DE ALMACENAMIENTO PERSISTENTE
   Gestión segura en localStorage para usuarios, estadísticas e historial
   ========================================================================== */

const STORAGE_KEYS = {
  SETTINGS: 'chronos_settings_v1',
  USERS: 'chronos_users_v1',
  HISTORY: 'chronos_history_v1'
};

export const storage = {
  // --- Ajustes del Sistema ---
  loadSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : {
        theme: 'dark',
        lang: 'es',
        sound: true,
        lastP1: 'Jugador 1',
        lastP1Avatar: '👨‍🚀',
        lastP2: 'Jugador 2',
        lastP2Avatar: '👩‍🚀',
        gameMode: 'pvp',
        aiLevel: 'normal',
        boardSize: '4',
        turnTimer: '15',
        cardTheme: 'tech'
      };
    } catch (e) {
      console.warn('No se pudieron cargar los ajustes del localStorage:', e);
      return {};
    }
  },

  saveSettings(newSettings) {
    try {
      const current = this.loadSettings();
      const updated = { ...current, ...newSettings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('Error al guardar ajustes en localStorage:', e);
    }
  },

  // --- Perfiles de Jugador y Estadísticas ---
  getAllUsers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  },

  getUserStats(username) {
    if (!username) return null;
    const users = this.getAllUsers();
    return users[username] || {
      name: username,
      wins: 0,
      played: 0,
      bestStreak: 0,
      totalPairs: 0
    };
  },

  registerUser(username, avatar = '👨‍🚀') {
    if (!username || username.trim() === '') return null;
    const name = username.trim();
    const users = this.getAllUsers();
    
    if (!users[name]) {
      users[name] = {
        name: name,
        avatar: avatar,
        wins: 0,
        played: 0,
        bestStreak: 0,
        totalPairs: 0,
        registeredAt: Date.now()
      };
    } else {
      users[name].avatar = avatar; // Actualizar último avatar preferido
    }
    
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.warn('Error al registrar usuario en localStorage:', e);
    }
    return users[name];
  },

  updateUserStatsAfterMatch(username, isWinner, streak, pairsMatched) {
    if (!username || username === 'IA') return; // No registramos estadísticas acumuladas para el bot de IA
    
    const users = this.getAllUsers();
    let user = users[username] || this.registerUser(username);
    
    user.played += 1;
    if (isWinner) {
      user.wins += 1;
    }
    if (streak > (user.bestStreak || 0)) {
      user.bestStreak = streak;
    }
    user.totalPairs = (user.totalPairs || 0) + pairsMatched;
    
    users[username] = user;
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.warn('Error al actualizar estadísticas en localStorage:', e);
    }
  },

  // --- Historial de Partidas ---
  getMatchHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  recordMatch(matchData) {
    try {
      const history = this.getMatchHistory();
      const record = {
        id: Date.now(),
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        mode: matchData.mode,
        boardSize: matchData.boardSize,
        p1: matchData.p1,
        p2: matchData.p2,
        winner: matchData.winner, // 'p1', 'p2', o 'tie'
        p1Score: matchData.p1Score,
        p2Score: matchData.p2Score
      };
      
      // Guardar más reciente al principio, límite máximo 50 registros para no saturar memoria
      history.unshift(record);
      if (history.length > 50) history.pop();
      
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
      
      // Actualizar estadísticas individuales
      this.updateUserStatsAfterMatch(
        matchData.p1.name, 
        matchData.winner === 'p1', 
        matchData.p1.maxStreak || 0, 
        matchData.p1Score
      );
      
      if (matchData.mode !== 'ai') {
        this.updateUserStatsAfterMatch(
          matchData.p2.name, 
          matchData.winner === 'p2', 
          matchData.p2.maxStreak || 0, 
          matchData.p2Score
        );
      }
      
      return record;
    } catch (e) {
      console.warn('Error al guardar historial:', e);
      return null;
    }
  },

  clearStats() {
    try {
      localStorage.removeItem(STORAGE_KEYS.USERS);
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
      return true;
    } catch (e) {
      return false;
    }
  }
};
