var canvas, lienzo;
var cuerpo = []; // Array para que la serpiente crezca
var comida = { x: 0, y: 0 };
var dir = 1;
var puntos = 0;
var nombreActual = "Invitado";
var lastPress = null;
var pausa = true;
var juegoActivo = true;

const ARRIBA = 0, DERECHA = 1, ABAJO = 2, IZQUIERDA = 3;
const KEY_UP = 38, KEY_RIGHT = 39, KEY_DOWN = 40, KEY_LEFT = 37, KEY_M = 77;

function iniciar() {
    canvas = document.getElementById('lienzo');
    lienzo = canvas.getContext('2d');

    document.addEventListener('keydown', function (evt) {
        lastPress = evt.keyCode;
        if (evt.keyCode == KEY_M) {
            if (!juegoActivo) {
                reinicioTotal();
            } else {
                pausa = !pausa;
            }
        }
    }, false);

    document.getElementById('grabar').addEventListener('click', registrarJugador, false);

    reinicioTotal();
    actualizarLista();
    run();
}

function run() {
    if (!pausa && juegoActivo) {
        logicaJuego();
        dibujar();
    } else if (pausa && juegoActivo) {
        lienzo.fillStyle = "white";
        lienzo.font = "16px Arial";
        lienzo.fillText("PULSA 'M' PARA EMPEZAR", 100, 200);
    }
    setTimeout(run, 100);
}

function logicaJuego() {
    // Control de dirección
    if (lastPress == KEY_UP && dir != ABAJO) dir = ARRIBA;
    if (lastPress == KEY_RIGHT && dir != IZQUIERDA) dir = DERECHA;
    if (lastPress == KEY_DOWN && dir != ARRIBA) dir = ABAJO;
    if (lastPress == KEY_LEFT && dir != DERECHA) dir = IZQUIERDA;

    // Calcular nueva posición de la cabeza
    var nx = cuerpo[0].x;
    var ny = cuerpo[0].y;

    if (dir == DERECHA) nx += 10;
    else if (dir == IZQUIERDA) nx -= 10;
    else if (dir == ARRIBA) ny -= 10;
    else if (dir == ABAJO) ny += 10;

    // Colisión con paredes (Muerte)
    if (nx >= canvas.width || ny >= canvas.height || nx < 0 || ny < 0) {
        morir();
        return;
    }

    // Lógica de comer manzana
    if (nx == comida.x && ny == comida.y) {
        puntos += 10;
        document.getElementById('puntos').innerHTML = puntos;
        generarComida();
        actualizarRecord();
        // Al comer, no quitamos la cola, así crece
    } else {
        cuerpo.pop(); // Si no come, movemos el cuerpo quitando el último trozo
    }

    // Añadir nueva cabeza
    cuerpo.unshift({ x: nx, y: ny });
}

function dibujar() {
    // Fondo
    lienzo.fillStyle = "black";
    lienzo.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar Serpiente
    lienzo.fillStyle = "lime";
    for (var i = 0; i < cuerpo.length; i++) {
        lienzo.fillRect(cuerpo[i].x, cuerpo[i].y, 9, 9);
    }

    // Dibujar Manzana
    lienzo.fillStyle = "red";
    lienzo.fillRect(comida.x, comida.y, 9, 9);
}

function generarComida() {
    comida.x = Math.floor(Math.random() * (canvas.width / 10)) * 10;
    comida.y = Math.floor(Math.random() * (canvas.height / 10)) * 10;
}

function morir() {
    juegoActivo = false;
    pausa = true;
    lienzo.fillStyle = "red";
    lienzo.font = "20px Arial";
    lienzo.fillText("GAME OVER - PULSA 'M'", 90, 200);
}

function actualizarRecord() {
    var recordGuardado = localStorage.getItem(nombreActual) || 0;
    if (puntos > recordGuardado) {
        localStorage.setItem(nombreActual, puntos);
        document.getElementById('record').innerHTML = puntos;
        actualizarLista();
    }
}

function reinicioTotal() {
    cuerpo = [{ x: 50, y: 50 }, { x: 40, y: 50 }, { x: 30, y: 50 }];
    dir = DERECHA;
    puntos = 0;
    juegoActivo = true;
    pausa = true;
    generarComida();
    document.getElementById('puntos').innerHTML = "0";
}

function registrarJugador() {
    var nuevoNombre = document.getElementById('clave').value;
    if (nuevoNombre != "") {
        nombreActual = nuevoNombre;
        document.getElementById('nombreJugador').innerHTML = nombreActual;
        document.getElementById('record').innerHTML = localStorage.getItem(nombreActual) || 0;
        reinicioTotal();
        pausa = false; // Empieza directo al registrar
    }
}

function actualizarLista() {
    var lista = document.getElementById('lista');
    lista.innerHTML = "";
    for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        var v = localStorage.getItem(k);
        lista.innerHTML += "<div><strong>" + k + ":</strong> " + v + " pts</div>";
    }
}

window.addEventListener('load', iniciar, false);