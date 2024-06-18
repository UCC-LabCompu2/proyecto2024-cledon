/**
 * Crea una instancia de Tablero.
 * @constructor
 */

class Tablero {
    constructor() {
        this.columnas = 10;
        this.filas = 20;
        this.lado_celda = 25;
        this.ancho = this.columnas * this.lado_celda;
        this.alto = this.filas * this.lado_celda;
        this.posicion = createVector(
            MARGEN_TABLERO,
            MARGEN_TABLERO + 2 * this.lado_celda
        );
        this.minosAlmacenados = [];
        for (let fila = 0; fila < this.filas; fila++) {
            this.minosAlmacenados[fila] = [];
            for (let columna = 0; columna < this.columnas; columna++) {
                this.minosAlmacenados[fila].push("");
            }
        }
    }

    /**
     * Setter para almacenar un tetrimino en el tablero.
     * @method almacenarMino
     * @param {Tetrimino} tetrimino - Instancia del tetrimino que se va a almacenar.
     */

    set almacenarMino(tetrimino) {
        for (const pmino of tetrimino.mapaTablero) {
            if (pmino.y < 0) {
                // Juego terminado
                Tablero = new Tablero();
                tetrimino = new Tetrimino();
                lineas_hechas = 0;
            }
            this.minosAlmacenados[pmino.x][pmino.y] = tetrimino.nombre;
        }
        this.buscarLineasHorizontalesBorrar();
    }

    /**
     * Método para buscar y borrar líneas horizontales completas en el tablero.
     * @method buscarLineasHorizontalesBorrar
     */

    buscarLineasHorizontalesBorrar() {
        let lineas = [];
        for (let fila = this.filas; fila >= 0; fila--) {
            let agregar = true;
            for (let columna = 0; columna < this.columnas; columna++) {
                if (!this.minosAlmacenados[columna][fila]) {
                    agregar = false;
                    break;
                }
            }
            if (agregar) {
                lineas.push(fila);
            }
        }
        this.borrarLineasHorizontales(lineas);
    }

    /**
     * Método para borrar líneas horizontales completas del tablero.
     * @method borrarLineasHorizontales
     * @param {Array} lineas - Arreglo de números que representan las filas a borrar.
     */

    borrarLineasHorizontales(lineas) {
        lineas_hechas += lineas.length;
        for (const linea of lineas) {
            for (let fila = linea; fila >= 0; fila--) {
                for (let columna = 0; columna < this.columnas; columna++) {
                    if (fila === 0) {
                        this.minosAlmacenados[columna][fila] = "";
                        continue;
                    }
                    this.minosAlmacenados[columna][fila] =
                        this.minosAlmacenados[columna][fila - 1];
                }
            }
        }
    }

    /**
     * Método para convertir coordenadas de matriz en coordenadas de canvas.
     * @method coordenada
     * @param {number} x - Coordenada x en la matriz del tablero.
     * @param {number} y - Coordenada y en la matriz del tablero.
     * @return {p5.Vector} Vector que representa la coordenada en el canvas.
     */

    coordenada(x, y) {
        return createVector(x, y).mult(this.lado_celda).add(this.posicion);
    }

    /**
     * Método para dibujar el tablero y los tetriminos almacenados en el canvas.
     * @method dibujar
     */

    dibujar() {
        push();
        noStroke();
        pop();
        this.dibujarMinosAlmacenados();
    }

    /**
     * Método para dibujar los tetriminos almacenados en el tablero.
     * @method dibujarMinosAlmacenados
     */

    dibujarMinosAlmacenados() {
        push();
        for (let columna = 0; columna < this.columnas; columna++) {
            for (let fila = 0; fila < this.filas; fila++) {
                let nombreMino = this.minosAlmacenados[columna][fila];
                if (nombreMino) {
                    fill(tetriminosBase[nombreMino].color);
                    Tetrimino.dibujarMino(this.coordenada(columna, fila));
                }
            }
        }
        pop();
    }
}
