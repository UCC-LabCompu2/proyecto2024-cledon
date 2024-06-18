/**
 * Reproduce la música de fondo si la configuración lo permite al cargar la ventana.
 * @function
 */
let music = new Audio('Tetrismusic.mp3');
music.loop = true;
let isMusicPlaying = localStorage.getItem('isMusicPlaying') === 'true';
let volumeLevel = localStorage.getItem('volumeLevel') || 0.5;
music.volume = volumeLevel;
window.addEventListener('load', () => {
    if (isMusicPlaying) {
        music.play();
    }
});

const MARGEN_TABLERO = 10;
let regulador_velocidad_teclas = 0;
let regulador_de_caida = 0;
let lineas_hechas = 0;
let tiempo_restante = 180;
let siguienteTetrimino;
let velocidadCaida = 500;

/**
 * Formatea el tiempo en minutos y segundos.
 * @param {number} tiempo - Tiempo en segundos.
 * @returns {string} Tiempo formateado en formato 'minutos:segundos'.
 * @function
 */

function formatearTiempo(tiempo) {
    let minutos = Math.floor(tiempo / 60);
    let segundos = tiempo % 60;
    return `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
}

/**
 * Actualiza el temporizador en la interfaz.
 * @function
 */

setInterval(() => {
    if (tiempo_restante > 0) {
        tiempo_restante--;
        document.getElementById("timer").innerText = `Time: ${formatearTiempo(tiempo_restante)}`;
    } else {
        noLoop(); // Detener el juego cuando el tiempo se agote
        alert("Tiempo agotado. ¡Juego terminado!");
    }
}, 1000);
setInterval(() => {
    if (millis() - regulador_de_caida < velocidadCaida) {
        return;
    }
    regulador_de_caida = millis();
    tetrimino.moverAbajo();
}, velocidadCaida);

/**
 * Actualiza el color y ángulo de fondo del canvas de juego.
 * @function
 */

let angulo_fondo = Math.random() * 360;
let tono_fondo = Math.random() * 360;
setInterval(() => {
    angulo_fondo += Math.random();
    tono_fondo += Math.random();
}, 20);

/**
 * Configura el lienzo de juego y prepara los tetriminos iniciales.
 * @function
 */

function setup() {
    createCanvas(900, 600);
    tablero = new Tablero();
    crearMapeoBaseTetriminos();
    tetrimino = new Tetrimino();
    siguienteTetrimino = new Tetrimino();
    resizeCanvas(
        tablero.ancho + 2 * MARGEN_TABLERO,
        tablero.alto + 2 * MARGEN_TABLERO + 2 * tablero.lado_celda
    );
}

/**
 * Dibuja la interfaz de juego incluyendo el tablero y los tetriminos.
 * @function
 */

function draw() {
    background(0);
    clear();
    dibujarPuntaje();
    dibujarSiguientePieza();
    tablero.dibujar();
    tetrimino.dibujar();
    keyEventsTetris();
}

/**
 * Dibuja el puntaje actualizado en la interfaz.
 * @function
 */

function dibujarPuntaje() {
    let score = "Score: " + lineas_hechas;
    document.getElementById("score").innerText = score;
}

/**
 * Dibuja la siguiente pieza en la interfaz de juego.
 * @function
 */

function dibujarSiguientePieza() {
    let nextPieceDiv = document.getElementById("next-piece");
    nextPieceDiv.innerHTML = "Next Piece<br>";
    let gridSize = 4;
    let cellSize = 25;
    let grid = Array.from({length: gridSize}, () => Array(gridSize).fill(''));
    let base = tetriminosBase[siguienteTetrimino.nombre];
    for (const pmino of base.mapa) {
        let row = pmino.y + 1;
        let col = pmino.x + 1;
        grid[row][col] = base.color;
    }
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            let color = grid[row][col];
            let cellDiv = document.createElement('div');
            cellDiv.style.backgroundColor = color;
            cellDiv.style.width = `25px`;
            cellDiv.style.height = `44px`;
            cellDiv.style.display = 'inline-block';
            cellDiv.style.margin = '2px';
            nextPieceDiv.appendChild(cellDiv);
        }
        nextPieceDiv.appendChild(document.createElement('br'));
    }
}

/**
 * Maneja los eventos de teclado para el juego Tetris.
 * @function
 */

let limite_regulador_velocidad_teclas = 100;

function keyEventsTetris() {
    if (millis() - regulador_velocidad_teclas < limite_regulador_velocidad_teclas) {
        return;
    }
    limite_regulador_velocidad_teclas = 100;
    regulador_velocidad_teclas = millis();
    if (keyIsDown(RIGHT_ARROW)) {
        tetrimino.moverDerecha();
        regulador_de_caida = millis();
    }
    if (keyIsDown(LEFT_ARROW)) {
        tetrimino.moverIzquierda();
        regulador_de_caida = millis();
    }
    if (keyIsDown(DOWN_ARROW)) {
        tetrimino.moverAbajo();
        regulador_de_caida = millis();
    }
    if (keyIsDown(UP_ARROW)) {
        limite_regulador_velocidad_teclas = 150;
        tetrimino.girar();
        regulador_de_caida = millis();
    }
    if (keyIsDown(32)) {
        limite_regulador_velocidad_teclas = 200;
        tetrimino.ponerEnElFondo();
        regulador_de_caida = millis();
    }
}

/**
 * Reemplaza el tetrimino actual por el siguiente tetrimino generado.
 * @function
 */

function reemplazarTetrimino() {
    tetrimino = siguienteTetrimino;
    siguienteTetrimino = new Tetrimino();
}

/**
 * Actualiza el número de líneas hechas y verifica si se ha completado el juego.
 * @param {number} nuevasLineas - Número de líneas completadas en esta jugada.
 * @function
 */
function actualizarLineasHechas(nuevasLineas) {
    lineas_hechas += nuevasLineas;
    actualizarUI();
    if (lineas_hechas >= 40) {
        noLoop(); // Detiene el juego
        alert('¡Has ganado!');
    }
}
