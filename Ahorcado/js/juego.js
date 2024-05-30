/* Variables */
var ctx;
var canvas;
var palabra;
var letras = "QWERTYUIOPASDFGHJKLÑZXCVBNM";
var colorTecla = "#585858";
var colorMargen = "red";
var inicioX = 200;
var inicioY = 300;
var lon = 35;
var margen = 20;
var pistaText = "";

/* Arreglos */
var teclas_array = new Array();
var letras_array = new Array();
var palabras_array = [
    { palabra: "LEON", pista: "Ruge y es fuerte" },
    { palabra: "CABALLO", pista: "Hay de tierra y hay de mar" },
    { palabra: "PERRO", pista: "El mejor amigo del hombre" },
    { palabra: "GATO", pista: "Son tiernos pero arañan" },
    { palabra: "LAGARTIJA", pista: "Un reptil pequeño" },
    { palabra: "RINOCERONTE", pista: "Tiene un cuerno en la nariz" },
    { palabra: "TIBURON", pista: "Reina de los mares" },
    { palabra: "CARACOL", pista: "Lleva su casa a cuestas" },
    { palabra: "ALACRAN", pista: "Pequeño pero peligroso" },
    { palabra: "ARAÑA", pista: "Teje telarañas" },
    { palabra: "CHAPULIN", pista: "Un insecto saltador" },
    { palabra: "AVESTRUZ", pista: "No vuela pero corre rápido" },
    { palabra: "OCELOTE", pista: "Un felino salvaje" },
    { palabra: "MUSARAÑA", pista: "Pequeño mamífero insectívoro" },
    { palabra: "AGUILA", pista: "Ave de presa con vista aguda" }
];

/* Variables de control */
var aciertos = 0;
var errores = 0;

/* Objetos */
function Tecla(x, y, ancho, alto, letra) {
    this.x = x;
    this.y = y;
    this.ancho = ancho;
    this.alto = alto;
    this.letra = letra;
    this.dibuja = dibujaTecla;
}

function Letra(x, y, ancho, alto, letra) {
    this.x = x;
    this.y = y;
    this.ancho = ancho;
    this.alto = alto;
    this.letra = letra;
    this.dibuja = dibujaCajaLetra;
    this.dibujaLetra = dibujaLetraLetra;
}

/* Funciones */

/* Dibujar Teclas*/
function dibujaTecla() {
    ctx.fillStyle = colorTecla;
    ctx.strokeStyle = colorMargen;
    ctx.fillRect(this.x, this.y, this.ancho, this.alto);
    ctx.strokeRect(this.x, this.y, this.ancho, this.alto);

    ctx.fillStyle = "white";
    ctx.font = "bold 20px courier";
    ctx.fillText(this.letra, this.x + this.ancho / 2 - 5, this.y + this.alto / 2 + 5);
}

/* Dibujar la letra y su caja */
function dibujaLetraLetra() {
    var w = this.ancho;
    var h = this.alto;
    ctx.fillStyle = "black";
    ctx.font = "bold 40px Courier";
    ctx.fillText(this.letra, this.x + w / 2 - 12, this.y + h / 2 + 14);
}

function dibujaCajaLetra() {
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.fillRect(this.x, this.y, this.ancho, this.alto);
    ctx.strokeRect(this.x, this.y, this.ancho, this.alto);
}

/* Función para dar una pista al usuario */
function pistaFunction(palabra) {
    let pista = palabras_array.find(p => p.palabra === palabra).pista;
    ctx.fillStyle = "black";
    ctx.font = "bold 20px Courier";
    ctx.fillText(pista, 10, 15);
}

/* Distribuir nuestro teclado con sus letras respectivas al acomodo de nuestro array */
function teclado() {
    var ren = 0;
    var col = 0;
    var letra = "";
    var miLetra;
    var x = inicioX;
    var y = inicioY;
    for (var i = 0; i < letras.length; i++) {
        letra = letras.substr(i, 1);
        miLetra = new Tecla(x, y, lon, lon, letra);
        miLetra.dibuja();
        teclas_array.push(miLetra);
        x += lon + margen;
        col++;
        if (col == 10) {
            col = 0;
            ren++;
            if (ren == 2) {
                x = 280;
            } else {
                x = inicioX;
            }
        }
        y = inicioY + ren * 50;
    }
}

/* Obtener nuestra palabra aleatoriamente y dividirla en letras */
function pintaPalabra() {
    var p = Math.floor(Math.random() * palabras_array.length);
    palabra = palabras_array[p].palabra;

    pistaFunction(palabra);

    var w = canvas.width;
    var len = palabra.length;
    var ren = 0;
    var col = 0;
    var y = 230;
    var lon = 50;
    var x = (w - (lon + margen) * len) / 2;
    for (var i = 0; i < palabra.length; i++) {
        letra = palabra.substr(i, 1);
        miLetra = new Letra(x, y, lon, lon, letra);
        miLetra.dibuja();
        letras_array.push(miLetra);
        x += lon + margen;
    }
}

/* Dibujar cadalzo y partes del personaje según sea el caso */
function horca(errores) {
    var imagen = new Image();
    imagen.src = "./img/ahorcado" + errores + ".png";
    imagen.onload = function () {
        ctx.drawImage(imagen, 390, 0, 230, 230);
    }
}

/* Ajustar coordenadas */
function ajusta(xx, yy) {
    var posCanvas = canvas.getBoundingClientRect();
    var x = xx - posCanvas.left;
    var y = yy - posCanvas.top;
    return { x: x, y: y };
}

/* Detectar tecla clickeada y compararla con las de la palabra ya elegida al azar */
function selecciona(e) {
    var pos = ajusta(e.clientX, e.clientY);
    var x = pos.x;
    var y = pos.y;
    var tecla;
    var bandera = false;
    for (var i = 0; i < teclas_array.length; i++) {
        tecla = teclas_array[i];
        if (tecla.x > 0) {
            if ((x > tecla.x) && (x < tecla.x + tecla.ancho) && (y > tecla.y) && (y < tecla.y + tecla.alto)) {
                break;
            }
        }
    }
    if (i < teclas_array.length) {
        for (var i = 0; i < palabra.length; i++) {
            letra = palabra.substr(i, 1);
            if (letra == tecla.letra) {
                caja = letras_array[i];
                caja.dibujaLetra();
                aciertos++;
                bandera = true;
            }
        }
        if (bandera == false) {
            errores++;
            horca(errores);
            if (errores == 5) gameOver(errores);
        }
        ctx.clearRect(tecla.x - 1, tecla.y - 1, tecla.ancho + 2, tecla.alto + 2);
        tecla.x - 1;
        if (aciertos == palabra.length) gameOver(errores);
    }
}

/* Borrar las teclas y la palabra con sus cajas y mandar mensaje según el caso si se ganó o se perdió */
function gameOver(errores) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";

    ctx.font = "bold 50px Courier";
    if (errores < 5) {
        ctx.fillText("Muy bien, la palabra es: ", 110, 280);
    } else {
        ctx.fillText("Lo sentimos, la palabra era: ", 110, 280);
    }

    ctx.font = "bold 80px Courier";
    lon = (canvas.width - (palabra.length * 48)) / 2;
    ctx.fillText(palabra, lon, 380);
    horca(errores);
}

/* Detectar si se ha cargado nuestro contexto en el canvas, iniciar las funciones necesarias para jugar o mandar mensaje de error según sea el caso */
window.onload = function () {
    canvas = document.getElementById("pantalla");
    if (canvas && canvas.getContext) {
        ctx = canvas.getContext("2d");
        if (ctx) {
            teclado();
            pintaPalabra();
            horca(errores);
            canvas.addEventListener("click", selecciona, false);
        } else {
            alert("Error al cargar el contexto!");
        }
    }
}
