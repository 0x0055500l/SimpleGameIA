# ⚡ CHRONOS MEMORY CLASH ⚡
### Juego de Memoria Táctica Multijugador & Agente Cognitivo por Turnos

---

**🎓 Información Académica del Proyecto**
* **Institución / Universidad**: Proyecto Universitario de Ingeniería en Sistemas / Informática
* **Asignatura / Clase**: **Inteligencia Artificial**
* **Estudiante / Usuario**: **201810020200**
* **Tecnologías**: HTML5, CSS3 Vanilla (Glassmorphism & Variables Dinámicas), JavaScript ES6+ (Módulos Nativos, Web Audio API, Canvas 2D)

---

## 📌 Descripción General

**Chronos Memory Clash** es una aplicación web de nivel ingeniería diseñada desde cero para explorar conceptos teóricos de desarrollo de software moderno e **Inteligencia Artificial**, aplicados a un entorno interactivo y competitivo de juegos de mesa digitales por turnos. 

El proyecto combina un motor de reglas estricto con un **Agente de IA Cognitivo** capaz de simular la memoria y toma de decisiones humana bajo condiciones de incertidumbre y presión de tiempo, todo dentro de una interfaz estética visualmente cautivadora (*Glassmorphism* con soporte multi-tema y multi-idioma).

---

## 🤖 El Agente de Inteligencia Artificial (IA)

En el marco de la clase de **Inteligencia Artificial**, el juego incorpora un oponente autómata (Bot Táctico) que implementa un modelo de **memoria episódica artificial** probabilística:

1. **Mapeo Cognitivo (`aiMemoryMap`)**: Durante la partida, cada vez que un jugador (humano o la propia IA) revela una carta en el tablero, el algoritmo procesa la información (*posición e identidad de la pareja*).
2. **Heurística Probabilística de Recuerdo**:
   * 🌱 **Nivel Novato (Fácil)**: La IA tiene un **35% de probabilidad** de retener en su memoria episódica la carta revelada, simulando distracciones o descuidos humanos.
   * ⚔️ **Nivel Táctico (Normal)**: La IA retiene el **70% de las cartas vistas**, tomando decisiones estratégicas basadas en emparejamientos confirmados antes de recurrir a la exploración aleatoria.
   * 🧠 **Maestro de Memoria (Hardcore)**: La IA cuenta con **100% de retención (Memoria Fotográfica)**. No olvida ninguna carta que haya sido volteada previamente en la partida, representando un desafío cognitivo perfecto para el usuario.
3. **Comportamiento Humanizado**: El autómata añade retrasos de tiempo calculados dinámicamente (`800ms - 1400ms`) para simular el proceso del pensamiento humano y análisis visual antes de ejecutar cada jugada.

---

## ✨ Características Principales y Funcionalidades

* 👥 **Modos de Juego**:
  * **Multijugador Local (Hot-Seat / P1 vs P2)**: Dos jugadores se alternan en el mismo dispositivo o pantalla.
  * **Solo vs IA**: Enfréntate al agente inteligente en cualquiera de sus 3 niveles cognitivos.
* 📏 **Dimensiones de Tablero Dinámicas**:
  * **4x4 (16 Cartas - 8 Parejas)**: Partida rápida y directa.
  * **6x6 (36 Cartas - 18 Parejas)**: Estándar estratégico.
  * **8x8 (64 Cartas - 32 Parejas)**: Desafío de memoria suprema.
* ⏱️ **Temporizador de Turno y Agotamiento**:
  * Configurable a **15, 30 o 45 segundos** (o sin límite). 
  * Si un jugador no encuentra una pareja antes de que el contador llegue a cero, suena una alarma cibernética, se cancela su jugada y **el turno pasa automáticamente a su adversario**.
* 🎨 **Estética Premium & Temas (Blanco / Negro / Neón)**:
  * Tema **Obsidiana (Dark Mode)**: Tonos profundos de azul/negro con bordes de cristal esmerilado (*Glassmorphism*) y acentos de luz neón.
  * Tema **Minimalista Blanco (Light Mode)**: Alto contraste, tipografía limpia y sombras suaves.
* 🌍 **Internacionalización Instantánea (i18n)**:
  * Traducción completa en tiempo real para **Español 🇪🇸, Inglés 🇺🇸 y Portugués 🇧🇷**, persistiendo en las preferencias del usuario.
* 💾 **Persistencia y Registro de Estadísticas (`localStorage`)**:
  * **Salón de la Fama**: Registro automático de alias, avatares seleccionados, total de victorias, partidas jugadas, porcentaje de efectividad (*Win Rate*) y racha máxima de aciertos consecutivos.
  * **Historial Detallado**: Bitácora de las últimas 50 batallas con fecha, oponente, modo y marcador final.
* 🔊 **Sintetizador de Sonido (Web Audio API)**:
  * Generación interactiva en código de tonos de acierto (arpegios armónicos), fallo (zumbidos disonantes), volteo de cartas y fanfarria triunfal, garantizando **cero latencia** sin requerir archivos de audio externos.
* 🎊 **Celebraciones Dinámicas (HTML5 Canvas)**:
  * Generador de partículas de confeti en tiempo real que se proyecta al ganar una batalla.

---

## 📂 Estructura Arquitectónica del Proyecto

El código fuente está estructurado de forma modular y limpia, respetando el principio de responsabilidad única (SOLID):

```text
game/
│
├── index.html               # Estructura SPA (Single Page Application) semántica y accesible
│
├── css/
│   ├── styles.css           # Sistema de diseño, variables CSS para temas (Blanco/Negro), botones y tarjetas
│   ├── board.css            # Grids adaptativos (4x4, 6x6, 8x8), cartas con perspectiva 3D y HUD
│   └── animations.css       # Keyframes para latidos del temporizador, temblores de error y brillos
│
└── js/
    ├── main.js              # Controlador de la aplicación, enrutador de pantallas y gestión de eventos
    ├── state.js             # Estado global de la partida, configuración activa y marcadores en juego
    ├── i18n.js              # Diccionarios multi-idioma y motor de traducción reactiva del DOM
    ├── storage.js           # Almacenamiento seguro en localStorage para perfiles y estadísticas
    ├── audio.js             # Sintetizador de efectos de audio nativo mediante Web Audio API
    ├── game.js              # Motor de barajado Fisher-Yates, reglas de turnos, temporizador y lógica de IA
    └── ui.js                # Renderizado de cartas en el DOM, modales, alertas y confeti (Canvas)
```

---

## 🚀 Instrucciones para Ejecutar y Correr el Juego

Debido a que el proyecto utiliza la arquitectura moderna de **Módulos ES6 nativos de JavaScript** (`<script type="module">`), el navegador requiere que los archivos sean servidos mediante un servidor web local (HTTP) para gestionar correctamente los permisos de seguridad y CORS.

### Paso 1: Abrir la terminal en el directorio del proyecto
Abre tu consola o terminal (PowerShell, CMD, Bash o la terminal integrada de VS Code) y ubícate dentro de la carpeta del proyecto:
```powershell
cd ruta/a/tu/proyecto/game
```

### Paso 2: Iniciar un servidor local
Puedes utilizar cualquiera de las siguientes opciones según tus herramientas instaladas:

#### Opción A: Con Python (Recomendada y más rápida)
Si tienes Python instalado, ejecuta el módulo de servidor HTTP:
```powershell
python -m http.server 8000
```

#### Opción B: Con Node.js / npx
Si tienes Node.js instalado, puedes usar el servidor estático `serve`:
```powershell
npx serve .
```

#### Opción C: Con Visual Studio Code (Live Server)
Si utilizas VS Code, instala la extensión **Live Server**, haz clic derecho sobre el archivo `index.html` y selecciona:
👉 **"Open with Live Server"**.

### Paso 3: Abrir en el Navegador
Abre tu navegador web favorito (Chrome, Edge, Firefox, Brave, Safari) e ingresa a la dirección:
👉 **http://localhost:8000** (o el puerto que te indique tu terminal/editor).

---

## 🎮 Guía Rápida de Jugabilidad

1. **Pantalla Inicial (Registro)**: Ingresa tu alias (ej. `201810020200` o tu nombre), escoge tu avatar táctico y el nombre de tu oponente (o déjalo en IA). Pulsa en **Configurar Partida**.
2. **Configuración de la Batalla**: Selecciona el modo de juego (*Local* o *Contra IA*), la dificultad del autómata, el tamaño del tablero, la temática visual de las cartas y el tiempo límite por turno.
3. **El Duelo de Memoria**: 
   * Voltea 2 cartas en tu turno intentando encontrar parejas idénticas.
   * Si aciertas, sumas un punto, aumentas tu racha 🔥 y **conservas tu turno**.
   * Si fallas, las cartas se vuelven a ocultar y el turno pasa a tu rival o a la IA.
   * ¡Cuidado con el reloj! Si la barra llega a rojo y se agota tu tiempo, perderás el turno inmediatamente.
4. **Victoria y Estadísticas**: Al encontrar la última pareja, el sistema proclamará al Maestro de la Memoria con una lluvia de confeti, registrando la batalla en el **Salón de la Fama**. ¡Puedes revisar tu historial acumulado en el botón de estadísticas de la barra de navegación!

---

*Desarrollado con excelencia en ingeniería de software para la clase de Inteligencia Artificial - 201810020200.*
