/* ==========================================================================
   CHRONOS MEMORY CLASH - SINTETIZADOR DE AUDIO INTERACTIVO (Web Audio API)
   Genera efectos de sonido cibernéticos en tiempo real sin archivos externos
   ========================================================================== */

import { state } from './state.js';
import { storage } from './storage.js';

let audioCtx = null;

export const audio = {
  init() {
    // Inicializar el contexto en la primera interacción del usuario
    if (!audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  },

  toggle() {
    state.sound = !state.sound;
    storage.saveSettings({ sound: state.sound });
    
    const soundBtn = document.getElementById('sound-toggle');
    if (soundBtn) {
      soundBtn.innerHTML = state.sound ? '<span class="icon-sound">🔊</span>' : '<span class="icon-sound">🔇</span>';
      soundBtn.title = state.sound ? 'Sonido Activado' : 'Sonido Silenciado';
    }
    
    if (state.sound) {
      this.playClick();
    }
    return state.sound;
  },

  // Función interna para generar tonos con osciladores
  playTone(freq, type, duration, startDelay = 0, volume = 0.15) {
    if (!state.sound) return;
    this.init();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type; // 'sine' | 'square' | 'sawtooth' | 'triangle'
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startDelay);

      // Envolvente de volumen suave (Attack / Decay)
      gain.gain.setValueAtTime(0.001, audioCtx.currentTime + startDelay);
      gain.gain.exponentialRampToValueAtTime(volume, audioCtx.currentTime + startDelay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + startDelay + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(audioCtx.currentTime + startDelay);
      osc.stop(audioCtx.currentTime + startDelay + duration);
    } catch (e) {
      // Evitar errores si la pestaña está en segundo plano o el contexto está bloqueado
    }
  },

  // --- Efectos de Sonido Específicos del Juego ---
  
  // Volteo de carta: un "pop" cibernético rápido
  playFlip() {
    if (!state.sound) return;
    this.playTone(320, 'sine', 0.08, 0, 0.12);
    this.playTone(480, 'triangle', 0.06, 0.03, 0.08);
  },

  // Acierto de pareja: Arpegio armónico ascendente
  playMatch() {
    if (!state.sound) return;
    this.playTone(523.25, 'sine', 0.15, 0, 0.2);     // Do 5
    this.playTone(659.25, 'sine', 0.15, 0.08, 0.2);  // Mi 5
    this.playTone(783.99, 'triangle', 0.25, 0.16, 0.25); // Sol 5
  },

  // Error (No son pareja): Tono grave disonante con zumbido
  playError() {
    if (!state.sound) return;
    this.playTone(180, 'sawtooth', 0.2, 0, 0.15);
    this.playTone(140, 'square', 0.25, 0.08, 0.18);
  },

  // Turno Agotado por Temporizador: Alerta de alarma urgente
  playTimeout() {
    if (!state.sound) return;
    this.playTone(880, 'square', 0.1, 0, 0.2);
    this.playTone(440, 'sawtooth', 0.15, 0.12, 0.2);
    this.playTone(880, 'square', 0.2, 0.25, 0.25);
  },

  // Cambio de Turno normal: Tono suave de relevo
  playTurnSwitch() {
    if (!state.sound) return;
    this.playTone(440, 'sine', 0.12, 0, 0.1);
    this.playTone(330, 'triangle', 0.15, 0.08, 0.1);
  },

  // Clic de Interfaz en Botones
  playClick() {
    if (!state.sound) return;
    this.playTone(600, 'sine', 0.05, 0, 0.08);
  },

  // Fanfarria de Victoria
  playWin() {
    if (!state.sound) return;
    const notes = [
      { f: 523.25, d: 0.15, t: 0 },     // Do 5
      { f: 659.25, d: 0.15, t: 0.15 },  // Mi 5
      { f: 783.99, d: 0.15, t: 0.3 },   // Sol 5
      { f: 1046.50, d: 0.45, t: 0.45 }, // Do 6 (sostenido)
      { f: 783.99, d: 0.12, t: 0.65 },  // Sol 5 (rápido)
      { f: 1046.50, d: 0.6, t: 0.8 }    // Do 6 final triumfante
    ];

    notes.forEach(note => {
      this.playTone(note.f, 'triangle', note.d, note.t, 0.25);
    });
  },

  // Empate (Sonido neutral con misterio)
  playTie() {
    if (!state.sound) return;
    this.playTone(440, 'sine', 0.2, 0, 0.15);
    this.playTone(440, 'triangle', 0.3, 0.2, 0.15);
  }
};
