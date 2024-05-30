document.addEventListener('keydown', function(evento){
    if(evento.keyCode == 32){
        saltar();
    }
});

document.getElementById('jumpBtn').addEventListener('click', function() {
    saltar();
});


// Variables para las imágenes
var imgRex, imgNube, imgCactus, imgSuelo, imgCactus2;

// Función para cargar las imágenes
function CargaImagenes(callback){
    imgRex = new Image();
    imgNube = new Image();
    imgCactus = new Image();
    imgSuelo = new Image();
    imgCactus2 = new Image();

    let imagenesCargadas = 0;
    const totalImagenes = 5;

    const imagenCargada = () => {
        imagenesCargadas++;
        if (imagenesCargadas === totalImagenes) {
            callback();
        }
    };

    imgRex.onload = imagenCargada;
    imgNube.onload = imagenCargada;
    imgCactus.onload = imagenCargada;
    imgSuelo.onload = imagenCargada;
    imgCactus2.onload = imagenCargada;

    imgRex.src = './img/dino.png';
    imgNube.src = './img/nube.png';
    imgCactus.src = './img/cactus1.png';
    imgSuelo.src = './img/suelo.png';
    imgCactus2.src = './img/cactus2.png';
}

// Variables de configuración del canvas
var ancho = 700;
var alto = 300;
var canvas, ctx;

// Inicialización
function inicializa(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    CargaImagenes(() => {
        iniciarJuego();
    });
}

// Función para limpiar el canvas
function borrarCanvas(){
    canvas.width = ancho;
    canvas.height = alto;
}

// Variables para el control del dinosaurio
var alturaSuelo = 230; // Altura del suelo constante
var trex = {y: 210, vy:0, gravedad:2, salto:28, vymax:9, saltando: false};
var nivel = {velocidad: 9, marcador: 0, muerto: false};
var cactuss = {x: ancho + 100, y: alturaSuelo - 25};
var nube = {x: 400, y: 100, velocidad: 1};
var suelog = {x: 0, y: alturaSuelo +10};

//-----------------------------------------------------------------------------------------------------------
// Función para dibujar al Rex
function dibujarRex(){
    ctx.drawImage(imgRex, 0, 0, 100, 100, 100, trex.y, 50, 50);
}

// Función para saltar
function saltar(){
    if (!trex.saltando && !nivel.muerto) { // Solo saltar si no está ya saltando y no está muerto
        trex.saltando = true;
        trex.vy = trex.salto;
    } else if (nivel.muerto) {
        reiniciarJuego();
        canvas.focus(); // Mover el foco al canvas después de reiniciar el juego
    }
}

// Función que controla la gravedad
function gravedad(){
    if(trex.saltando){
        if(trex.y - trex.vy - trex.gravedad > 210){
            trex.saltando = false;
            trex.vy = 0;
            trex.y = 210;
        }else{
            trex.vy -= trex.gravedad;
            trex.y -= trex.vy;
        }
    }
}

// Función colisión
function colision(){
    if(cactuss.x >= 100 && cactuss.x <= 150){
        if(trex.y >= alturaSuelo - 25){
            console.log("Colision");
            nivel.muerto = true;
            nivel.velocidad = 0;
            nube.velocidad = 0;
        }
    }
}

//-----------------------------------------------------------------------------------------------------------
// Función para dibujar el cactus
function dibujarCactus(){
    ctx.drawImage(imgCactus, 0, 0, 100, 100, cactuss.x, cactuss.y, 50, 50);
}

// Función para la lógica del cactus
function logicaCactus(){
    if(cactuss.x < -100){
        cactuss.x = ancho + 100;
        nivel.marcador++;
    }
    else{
        cactuss.x -= nivel.velocidad;
    }
}

//-----------------------------------------------------------------------------------------------------------
// Función para dibujar la nube
function dibujarNube(){ 
    ctx.drawImage(imgNube, 0, 0, 100, 100, nube.x, nube.y, 50, 50);
}

// Función para la lógica de la nube
function logicaNube(){
    if(nube.x < -100){
        nube.x = ancho + 100;
    }
    else{
        nube.x -= nube.velocidad;
    }
}

//-----------------------------------------------------------------------------------------------------------
// Función para dibujar el suelo
function dibujarSuelo(){
    ctx.drawImage(imgSuelo, suelog.x, 0, 700, 30, 0, suelog.y, 700, 30);
    ctx.drawImage(imgSuelo, suelog.x + 700, 0, 700, 30, 0, suelog.y, 700, 30);
}

// Función para la lógica del suelo
function logicaSuelo(){
    if(suelog.x <= -700){
        suelog.x = 0;
    }else{
        suelog.x -= nivel.velocidad;
    }
}

//-----------------------------------------------------------------------------------------------------------
function puntuacion(){
    ctx.font = "30px impact";
    ctx.fillStyle = '#555555';
    ctx.fillText(`${nivel.marcador}`, 600, 50);

    if(nivel.muerto == true){
        ctx.font = "60px impact";
        ctx.fillText(`GAME OVER`, 240, 150);
    }
}

var gameInterval;
var scoreInterval;

// Bucle principal
function iniciarJuego() {
    if (gameInterval) clearInterval(gameInterval);
    if (scoreInterval) clearInterval(scoreInterval);

    gameInterval = setInterval(function(){
        principal();
    }, 1000 / 50);

    // Incrementar el marcador cada segundo
    scoreInterval = setInterval(function(){
        if (!nivel.muerto) {
            nivel.marcador++;
        }
    }, 1000);
}

function reiniciarJuego() {
    // Reiniciar variables del juego
    nivel.velocidad = 9;
    nube.velocidad = 1;
    cactuss.x = ancho + 100;
    nube.x = ancho + 100;
    nivel.marcador = 0;
    nivel.muerto = false;
    trex.y = 210;
    trex.vy = 0;
    trex.saltando = false;
    suelog.x = 0;
    iniciarJuego();
    canvas.focus();  // Mover el foco al canvas después de reiniciar el juego
}

// Función principal del juego
function principal(){
    borrarCanvas();
    gravedad(); 
    colision();
    logicaSuelo();
    logicaCactus();
    logicaNube();
    dibujarSuelo();
    dibujarCactus();
    dibujarNube();  
    dibujarRex();
    puntuacion();
}

// Inicializa el juego
window.onload = function(){
    inicializa();
};
