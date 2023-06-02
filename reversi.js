"use strict";
// Leer por terminal
// ================================================================================================================================================================================================
const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);

/**
 * 
 * @param {string} texto 
 * @returns 
 */
function leeLinea(texto) {
    return new Promise((resolve) => {
        rl.question(texto, (introducido) => {
            resolve(introducido);
        });
    });
}
// ================================================================================================================================================================================================





// Declaro las variables necesarias como el tabero, las coordenadas y las coordenadas predefinidas y hago una función para imprimir el tablero
// ================================================================================================================================================================================================
let tablero = [];
let letras = ["A", "B", "C", "D", "E", "F", "G", "H"];
let fichaComida=false;

for (let fila = 0; fila < 8; fila++) {
    tablero[fila] = [];
    for (let columna = 0; columna < 8; columna++) {
        tablero[fila][columna] = "[ ]";
    }
}

// Coordenadas predefinidas
const coordenadasPredefinidas = [
    { fila: 3, columna: 3, ficha: "[X]" },
    { fila: 3, columna: 4, ficha: "[O]" },
    { fila: 4, columna: 3, ficha: "[O]" },
    { fila: 4, columna: 4, ficha: "[X]" }
];

// Colocar fichas predefinidas
coordenadasPredefinidas.forEach((coordenada) => {
    const { fila, columna, ficha } = coordenada;
    tablero[fila][columna] = ficha;
});

// Imprimir el tablero con las casillas en blanco
/**
 * Recibe el array bidimensional y lo imprime de manera "bonita"
 * @param {array} tablero 
 */
function imprimir(tablero) {
    console.log("   A   B   C   D   E   F   G   H"); // Imprimir letras de las coordenadas
    for (let fila = 0; fila < 8; fila++) {
        let cordFila = (8 - fila) + ' ';
        for (let columna = 0; columna < 8; columna++) {
            cordFila += tablero[fila][columna] + ' ';
        }
        console.log(cordFila);
    }
}
// ================================================================================================================================================================================================










// Funciones principales para poder jugar
// ================================================================================================================================================================================================
/**
 * Función principal para colocar fichas en el array bidimensional
 * Tambíen comprueba si la casilla introducida por terminal existe
 * @param {boolean} turno 
 */
async function colocarFicha(turno = false) {


    if (turno == false) {
        const coordenada = await leeLinea("Introduce la coordenada para colocar la ficha 'X' (ejemplo: A1): ");
        const letra = coordenada.charAt(0).toUpperCase();//charAt obtiene la primera coordenada(el primer caracter que ingresa el usuario, y toUpperCase convierte todo en mayusculas para poder introducir todo de las dos formas)
        const numero = parseInt(coordenada.charAt(1));//este obtiene el segundo caracter y con parseInt lo convierte en un numero en vez de una string
        // if para comprobar si la letra ingresada esta dentro del array de letras;
        if (letras.includes(letra) && numero >= 1 && numero <= 8) {
            const fila = 8 - numero;
            const columna = letras.indexOf(letra); // indexOf devuelve la columna del tablero ya que devuelve la posicion que tiene la letra en el array de letras;

            if (tablero[fila][columna] === "[ ]" && puedeComer('X', fila, columna)) {
                tablero[fila][columna] = "[X]";
                fichaComida=true;
                cambiarFicha('X', fila, columna);
                imprimir(tablero);  
                estadoDelJuego();
                colocarFicha(true);

            } else {
                console.log("No puedes colocar la ficha en esa posición o no puedes comer en ninguna dirección.");
                console.log("Inténtelo de nuevo.");
                colocarFicha(false);
            }
        } else {
            console.log("Coordenada inválida.");
            colocarFicha(false);
        }

    } else {
        // repetición de lo anterior pero para el otro jugador
        turno = false;
        const coordenada = await leeLinea("Introduce la coordenada para colocar la ficha 'O' (ejemplo: A1): ");
        const letra = coordenada.charAt(0).toUpperCase();
        const numero = parseInt(coordenada.charAt(1));

        if (letras.includes(letra) && numero >= 1 && numero <= 8) {
            const fila = 8 - numero;
            const columna = letras.indexOf(letra);

            if (tablero[fila][columna] === "[ ]" && puedeComer('O', fila, columna)) {
                tablero[fila][columna] = "[O]";
                cambiarFicha('O', fila, columna);
                imprimir(tablero);
                estadoDelJuego();
                colocarFicha(false);
            } else {
                console.log("No puedes colocar la ficha en esa posición o no puedes comer en ninguna dirección.");
                console.log("Inténtelo de nuevo.");
                colocarFicha(true);
            }
    
        } else {
            console.log("Coordenada inválida.");
            console.log("Intentelo de nuevo")
            colocarFicha(true); // Pedir coordenada nuevamente
        }

    }
}









/**
 * Recibe el jugador y la posición
 * Esta función verifica si puede comer o no, si puede devuelve true sino false
 * @param {string} jugador 
 * @param {number} fila 
 * @param {number} columna 
 * @returns 
 */
function puedeComer(jugador, fila, columna) {
    const oponente = (jugador === 'X') ? 'O' : 'X'; //si el jugador es X cojemos el valor 'O' sino el valor 'X';

    // Verificar dirección arriba
    if (fila > 1 && tablero[fila - 1][columna] === `[${oponente}]`) {
        let i = fila - 2;
        while (i >= 0) {
            if (tablero[i][columna] === `[${jugador}]`) {
                return true;
            } else if (tablero[i][columna] === `[${oponente}]`) {
                i--;
            } else {
                break;
            }
        }
    }

    // Verificar dirección abajo
    if (fila < 6 && tablero[fila + 1][columna] === `[${oponente}]`) {
        let i = fila + 2;
        while (i < 8) {
            if (tablero[i][columna] === `[${jugador}]`) {
                return true;
            } else if (tablero[i][columna] === `[${oponente}]`) {
                i++;
            } else {
                break;
            }
        }
    }

    // Verificar dirección izquierda
    if (columna > 1 && tablero[fila][columna - 1] === `[${oponente}]`) {
        let j = columna - 2;
        while (j >= 0) {
            if (tablero[fila][j] === `[${jugador}]`) {
                return true;
            } else if (tablero[fila][j] === `[${oponente}]`) {
                j--;
            } else {
                break;
            }
        }
    }

    // Verificar dirección derecha
    if (columna < 6 && tablero[fila][columna + 1] === `[${oponente}]`) {
        let j = columna + 2;
        while (j < 8) {
            if (tablero[fila][j] === `[${jugador}]`) {
                return true;
            } else if (tablero[fila][j] === `[${oponente}]`) {
                j++;
            } else {
                break;
            }
        }
    }

    return false;
}









/**
 * Esta función cambia el tipo de ficha si dos fichas de un tipo han encerrado a otra/as
 * @param {string} tipoFicha 
 * @param {number} fila_Ficha 
 * @param {number} columna_Ficha 
 */
function cambiarFicha(tipoFicha, fila_Ficha, columna_Ficha) {
    const oponente = (tipoFicha === 'X') ? 'O' : 'X';

    // Verificar dirección derecha
    if (columna_Ficha < 6 && tablero[fila_Ficha][columna_Ficha + 1] === `[${oponente}]`) {
        let j = columna_Ficha + 2;
        while (j < 8) {
            if (tablero[fila_Ficha][j] === `[${tipoFicha}]`) {
                // Cambiar las fichas encerradas
                for (let k = columna_Ficha + 1; k < j; k++) {
                    tablero[fila_Ficha][k] = `[${tipoFicha}]`;
                }
                break;
            } else if (tablero[fila_Ficha][j] === `[${oponente}]`) {
                j++;
            } else {
                break;
            }
        }
    }

    // Verificar dirección izquierda
    if (columna_Ficha > 1 && tablero[fila_Ficha][columna_Ficha - 1] === `[${oponente}]`) {
        let j = columna_Ficha - 2;
        while (j >= 0) {
            if (tablero[fila_Ficha][j] === `[${tipoFicha}]`) {
                // Cambiar las fichas encerradas
                for (let k = columna_Ficha - 1; k > j; k--) {
                    tablero[fila_Ficha][k] = `[${tipoFicha}]`;
                }
                break;
            } else if (tablero[fila_Ficha][j] === `[${oponente}]`) {
                j--;
            } else {
                break;
            }
        }
    }

    // Verificar dirección arriba
    if (fila_Ficha > 1 && tablero[fila_Ficha - 1][columna_Ficha] === `[${oponente}]`) {
        let i = fila_Ficha - 2;
        while (i >= 0) {
            if (tablero[i][columna_Ficha] === `[${tipoFicha}]`) {
                // Cambiar las fichas encerradas
                for (let k = fila_Ficha - 1; k > i; k--) {
                    tablero[k][columna_Ficha] = `[${tipoFicha}]`;
                }
                break;
            } else if (tablero[i][columna_Ficha] === `[${oponente}]`) {
                i--;
            } else {
                break;
            }
        }
    }

    // Verificar dirección abajo
    if (fila_Ficha < 6 && tablero[fila_Ficha + 1][columna_Ficha] === `[${oponente}]`) {
        let i = fila_Ficha + 2;
        while (i < 8) {
            if (tablero[i][columna_Ficha] === `[${tipoFicha}]`) {
                // Cambiar las fichas encerradas
                for (let k = fila_Ficha + 1; k < i; k++) {
                    tablero[k][columna_Ficha] = `[${tipoFicha}]`;
                }
                break;
            } else if (tablero[i][columna_Ficha] === `[${oponente}]`) {
                i++;
            } else {
                break;
            }
        }
    }
    fichaComida=true
}







/**
 * Esta función verifica si se puede seguir colocando fichas, si se puede devuelve true sino false
 * @returns 
 */
function ningunoPuedeColocar(tipoFicha){
    for (let fila = 0; fila < 8; fila++) {
        for (let columna = 0; columna < 8; columna++) {
            if(tablero[fila][columna]=='[ ]'&& puedeComer(tipoFicha, fila, columna)){
                // aún algún jugador puede colocar ficha
                return false;
            }
            
        }        
    }
    // ya ningún jugador puede colocar ficha
    return true;
}





/**
 * Esta función cuenta las fichas de cada tipo que hay y devuelve un objeto con cada ficha y el numero que hay de su tipo en el tablero
 * @returns 
 */
function contarFichas() {
    let contadorX=0;
    let contadorO=0;
    for (let fila = 0; fila < 8; fila++) {
        for (let columna = 0; columna < 8; columna++) {
            if (tablero[fila][columna] === "[X]") {
                contadorX++;
            } else if (tablero[fila][columna] === "[O]") {
                contadorO++;
            }
        }
    }
    return { X: contadorX, O: contadorO };
}





/**
 * Esta función solo comprueba si hay un ganador o no, no devuelve nada y no se ejecuta si el tablero sigue teniendo casillas vacias.
 * Finalmente cierra la interfaz y corta la ejecución.
 * 
 * 
 */
function estadoDelJuego() {
    //llamo al objeto que devuelve contarFichas y lo guardo en una variable
    const fichas=contarFichas();
    if (ningunoPuedeColocar('X')||ningunoPuedeColocar('O')) {
        if (fichas.X > fichas.O) {
            console.log("¡El jugador X gana!");
        } else if (fichas.O > fichas.X) {
            console.log("¡El jugador O gana!");
        } else {
            console.log("¡Empate! No hay ganador.");
        }
        rl.close();//esto cierra la interfaz de linea de comandos
        process.exit(0);
    }
}

// ================================================================================================================================================================================================


// console.log(tablero)
imprimir(tablero);
colocarFicha(); 