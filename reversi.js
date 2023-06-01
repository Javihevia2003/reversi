"use strict";
const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);

function leeLinea(texto) {
    return new Promise((resolve) => {
        rl.question(texto, (introducido) => {
            resolve(introducido);
        });
    });
}

let tablero = [];
let letras = ["A", "B", "C", "D", "E", "F", "G", "H"];

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

async function colocarFicha(turno = false) {


    if (turno == false) {
        const coordenada = await leeLinea("Introduce la coordenada para colocar la ficha 'X' (ejemplo: A1): ");
        const letra = coordenada.charAt(0).toUpperCase();
        const numero = parseInt(coordenada.charAt(1));

        if (letras.includes(letra) && numero >= 1 && numero <= 8) {
            const fila = 8 - numero;
            const columna = letras.indexOf(letra);

            if (tablero[fila][columna] === "[ ]") {
                tablero[fila][columna] = "[X]";
                encerraste('X', fila, columna);
                imprimir(tablero);
                colocarFicha(true);

            } else {
                console.log("La casilla ya está ocupada.");
            }
        } else {
            console.log("Coordenada inválida.");
            colocarFicha(false);
        }

    } else {
        turno = false;
        const coordenada = await leeLinea("Introduce la coordenada para colocar la ficha 'O' (ejemplo: A1): ");
        const letra = coordenada.charAt(0).toUpperCase();
        const numero = parseInt(coordenada.charAt(1));

        if (letras.includes(letra) && numero >= 1 && numero <= 8) {
            const fila = 8 - numero;
            const columna = letras.indexOf(letra);

            if (tablero[fila][columna] === "[ ]") {
                tablero[fila][columna] = "[O]";
                encerraste('O', fila, columna);
                imprimir(tablero);
                colocarFicha(false)
            } else {
                console.log("La casilla ya está ocupada.");
                console.log("Intentelo de nuevo");
                colocarFicha(true);
            }
        } else {
            console.log("Coordenada inválida.");
            console.log("Intentelo de nuevo")
            colocarFicha(true); // Pedir coordenada nuevamente
        }

    }
}

function encerraste(tipoFicha, fila_Ficha, columna_Ficha) {
    if (tipoFicha == 'X') {
        if (tablero[fila_Ficha][columna_Ficha + 1] == "[O]") {
            for (let fila = fila_Ficha; fila < 8; fila++) {
                for (let columna = columna_Ficha + 1; columna < 8; columna++) {
                    if (tablero[fila][columna] == '[O]') {
                        tablero[fila][columna] = '[X]'
                    }
                }
            }
            // este funciona a la izquierda no 
        }
        if (tablero[fila_Ficha][columna_Ficha - 1] == "[O]") {
            for (let fila = fila_Ficha; fila < 8; fila++) {
                for (let columna = columna_Ficha - 1; columna < 8; columna--) {
                    if (tablero[fila][columna] == '[O]') {
                        tablero[fila][columna] = '[X]'
                    }
                }
            }
        }
    }
    if (tipoFicha == 'O') {
        if (tablero[fila_Ficha][columna_Ficha + 1] == "[X]") {
            for (let fila = fila_Ficha; fila < 8; fila++) {
                for (let columna = columna_Ficha + 1; columna < 8; columna++) {
                    if (tablero[fila][columna] == '[X]') {
                        tablero[fila][columna] = '[O]'
                    }
                }
            }
        }
        if (tablero[fila_Ficha][columna_Ficha - 1] == "[X]") {
            for (let fila = fila_Ficha; fila < 8; fila++) {
                for (let columna = columna_Ficha - 1; columna < 8;columna--) {
                    // while (tablero[fila][columna] !== '[X]') {
                    //     columna--
                        if (tablero[fila][columna] == '[X]') {
                            tablero[fila][columna] = '[O]'
                        }
                    }
                }
            }
        }
    }
}
console.log(tablero)
imprimir(tablero);
colocarFicha(); // Pedron