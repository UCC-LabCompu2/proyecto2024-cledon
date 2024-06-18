/**
 * Crea una instancia de Tetrimino.
 * @constructor
 * @param {string} [nombre=random(["Z", "S", "J", "L", "T", "O", "I"])] - Nombre del tetrimino (opcional, por defecto se elige aleatoriamente).
 */

class Tetrimino {
    constructor(nombre = random(["Z", "S", "J", "L", "T", "O", "I"])) {
        this.nombre = nombre;
        let base = tetriminosBase[nombre];
        this.color = base.color;
        this.mapa = [];
        for (const pmino of base.mapa) {
            this.mapa.push(pmino.copy());
        }
        this.posicion = createVector(int(tablero.columnas / 2), -1);
    }

    /**
     * Método para mover la pieza a la derecha.
     * Si hay un movimiento erróneo, se revierte el movimiento.
     * @method moverDerecha
     */

    moverDerecha() {
        this.posicion.x++;
        if (this.movimientoErroneo) {
            this.moverIzquierda();
        }
    }

    /**
     * Método para mover la pieza a la izquierda.
     * Si hay un movimiento erróneo, se revierte el movimiento.
     * @method moverIzquierda
     */

    moverIzquierda() {
        this.posicion.x--;
        if (this.movimientoErroneo) {
            this.moverDerecha();
        }
    }


    /**
     * Método para mover la pieza hacia abajo.
     * Si hay un movimiento erróneo, se revierte el movimiento y se almacena la pieza en el tablero.
     * @method moverAbajo
     * @return {boolean} Verdadero si la pieza pudo moverse hacia abajo correctamente, falso si no.
     */

    moverAbajo() {
        this.posicion.y++;
        if (this.movimientoErroneo) {
            this.moverArriba();
            if (tetrimino == this) {
                tablero.almacenarMino = this;
                reemplazarTetrimino();
            }
            return false;
        }
        return true;
    }

    /**
     * Método para mover la pieza hacia arriba.
     * @method moverArriba
     */

    moverArriba() {
        this.posicion.y--;
    }

    /**
     * Método para colocar la pieza en el fondo del tablero.
     * La posición de la pieza se establece en la posición espectro y luego se mueve hacia abajo.
     * @method ponerEnElFondo
     */

    ponerEnElFondo() {
        this.posicion = this.espectro.posicion;
        this.moverAbajo();
    }


    /**
     * Método para girar la pieza en sentido horario.
     * Si hay un movimiento erróneo, se revierte el giro.
     * @method girar
     */

    girar() {
        for (const pmino of this.mapa) {
            pmino.set(pmino.y, -pmino.x);
        }
        if (this.movimientoErroneo) {
            this.desgirar();
        }
    }

    /**
     * Método para deshacer el giro de la pieza.
     * @method desgirar
     */

    desgirar() {
        for (const pmino of this.mapa) {
            pmino.set(-pmino.y, pmino.x);
        }
    }

    /**
     * Verifica si hay un movimiento erróneo (colisión o salida del tablero).
     * @member {boolean} movimientoErroneo
     * @readonly
     */

    get movimientoErroneo() {
        let salioDelTablero = !this.estaDentroDelTablero;
        return salioDelTablero || this.colisionConMinosAlmacenados;
    }

    /**
     * Verifica si hay colisión con minos almacenados en el tablero.
     * @member {boolean} colisionConMinosAlmacenados
     * @readonly
     */

    get colisionConMinosAlmacenados() {
        for (const pmino of this.mapaTablero) {
            if (tablero.minosAlmacenados[pmino.x][pmino.y]) {
                return true;
            }
        }
        return false;
    }

    /**
     * Verifica si la pieza está dentro del tablero.
     * @member {boolean} estaDentroDelTablero
     * @readonly
     */

    get estaDentroDelTablero() {
        for (const pmino of this.mapaTablero) {
            if (pmino.x < 0) {
                return false;
            }
            if (pmino.x >= tablero.columnas) {
                return false;
            }
            if (pmino.y >= tablero.filas) {
                return false;
            }
        }
        return true;
    }

    /**
     * Método para obtener las coordenadas de la pieza en el tablero.
     * @method mapaTablero
     * @return {Array} Arreglo de vectores que representan las coordenadas en el tablero.
     */

    get mapaTablero() {
        let retorno = [];
        for (const pmino of this.mapa) {
            let copy = pmino.copy().add(this.posicion);
            retorno.push(copy);
        }
        return retorno;
    }

    /**
     * Método para obtener las coordenadas de la pieza en el canvas.
     * @method mapaCanvas
     * @return {Array} Arreglo de vectores que representan las coordenadas en el canvas.
     */

    get mapaCanvas() {
        let retorno = [];
        for (const pmino of this.mapa) {
            let copy = pmino.copy().add(this.posicion);
            retorno.push(tablero.coordenada(copy.x, copy.y));
        }
        return retorno;
    }

    /**
     * Método para dibujar la pieza en el canvas.
     * @method dibujar
     */

    dibujar() {
        push();
        fill(this.color);
        for (const pmino of this.mapaCanvas) {
            Tetrimino.dibujarMino(pmino);
        }
        pop();
        if (tetrimino == this) {
            this.dibujarEspectro();
        }
    }

    /**
     * Método para dibujar el espectro de la pieza.
     * @method dibujarEspectro
     */

    dibujarEspectro() {
        this.espectro = new Tetrimino(this.nombre);
        this.espectro.posicion = this.posicion.copy();
        for (let i = 0; i < this.mapa.length; i++) {
            this.espectro.mapa[i] = this.mapa[i].copy();
        }
        //Lo uso para que al apretar el espacio caiga la pieza directamente
        while (this.espectro.moverAbajo()) ;
        push();
        drawingContext.globalAlpha = 0.3;
        this.espectro.dibujar();
        pop();
    }

    /**
     * Método estático para dibujar un mino en el canvas.
     * @method dibujarMino
     * @static
     * @param {p5.Vector} pmino - Vector que representa la coordenada del mino a dibujar.
     */

    static dibujarMino(pmino) {
        rect(pmino.x, pmino.y, tablero.lado_celda);
        push();
        noStroke();
        fill(255, 255, 255, 80);
        beginShape();
        vertex(pmino.x, pmino.y);
        vertex(pmino.x + tablero.lado_celda, pmino.y);
        vertex(pmino.x + tablero.lado_celda, pmino.y + tablero.lado_celda);
        endShape(CLOSE);
        beginShape();
        fill(0, 0, 0, 80);
        vertex(pmino.x, pmino.y);
        vertex(pmino.x, pmino.y + tablero.lado_celda);
        vertex(pmino.x + tablero.lado_celda, pmino.y + tablero.lado_celda);
        endShape(CLOSE);
        pop();
    }
}

/**
 * Función para crear el mapeo base de los tetriminos (piezas del Tetris).
 * @function crearMapeoBaseTetriminos
 */

function crearMapeoBaseTetriminos() {
    tetriminosBase = {
        Z: {
            color: "red",
            mapa: [
                createVector(),
                createVector(-1, -1),
                createVector(0, -1),
                createVector(1, 0),
            ],
        },
        S: {
            color: "lime",
            mapa: [
                createVector(),
                createVector(1, -1),
                createVector(0, -1),
                createVector(-1, 0),
            ],
        },
        J: {
            color: "orange",
            mapa: [
                createVector(),
                createVector(-1, 0),
                createVector(-1, -1),
                createVector(1, 0),
            ],
        },
        L: {
            color: "dodgerblue",
            mapa: [
                createVector(),
                createVector(-1, 0),
                createVector(1, -1),
                createVector(1, 0),
            ],
        },
        T: {
            color: "magenta",
            mapa: [
                createVector(),
                createVector(-1, 0),
                createVector(1, 0),
                createVector(0, -1),
            ],
        },
        O: {
            color: "yellow",
            mapa: [
                createVector(),
                createVector(0, -1),
                createVector(1, -1),
                createVector(1, 0),
            ],
        },
        I: {
            color: "cyan",
            mapa: [
                createVector(),
                createVector(-1, 0),
                createVector(1, 0),
                createVector(2, 0),
            ],
        },
    };
}

