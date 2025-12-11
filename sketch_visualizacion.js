let datos = [];
let barraAnim = []; // altura animada de cada barra
let hoverIndex = -1;

function preload() {
    datos = loadJSON("get_data.php");
}

function setup() {
    let canvas = createCanvas(800, 500);
    canvas.parent("contenedor");
    textFont("system-ui");

    let lista = Array.isArray(datos) ? datos : Object.values(datos);
    barraAnim = new Array(lista.length).fill(0);
}

function formatearNumero(n) {
    return Number(n).toLocaleString();
}

function draw() {
    background(20);

    if (!datos) {
        fill(255);
        textSize(16);
        text("Cargando datos...", 20, 40);
        return;
    }

    let lista = Array.isArray(datos) ? datos : Object.values(datos);
    if (lista.length === 0) {
        fill(255);
        textSize(16);
        text("No hay datos de partidas aún.", 20, 40);
        return;
    }

    let margenSup = 60;
    let margenInf = 60; 
    let margenIzq = 100;
    let margenDer = 100;

    // Eje horizontal en cero
    let ejeY = height / 2;

    // Puntaje máximo absoluto (para escala simétrica)
    let maxPuntos = 0;
    for (let j of lista) {
        let p = Number(j.puntos);
        if (Math.abs(p) > maxPuntos) maxPuntos = Math.abs(p);
    }
    if (maxPuntos === 0) maxPuntos = 1;


    // Dibujar ejes
    stroke(150);
    strokeWeight(1);
    line(margenIzq, margenSup, margenIzq, height - margenInf); // eje vertical
    line(margenIzq, ejeY, width - margenDer, ejeY); // eje horizontal

    hoverIndex = -1;

    // Espacio y ancho de barra
    let espacioEntreBarras = (width - margenIzq - margenDer) / lista.length;
    let barraAncho = espacioEntreBarras * 0.5;

    for (let i = 0; i < lista.length; i++) {
        let jugador = lista[i];
        let puntos = Number(jugador.puntos);

        // Altura final según signo, sin abs
        let barraAlturaFinal = map(puntos, -maxPuntos, maxPuntos, -(height - margenSup - margenInf)/2, (height - margenSup - margenInf)/2);

        // Efecto rebote con easing
        barraAnim[i] += (barraAlturaFinal - barraAnim[i]) * 0.1;
        if (Math.abs(barraAlturaFinal - barraAnim[i]) < 0.5) barraAnim[i] = barraAlturaFinal;

        // Posición X centrada en su slot
        let x = margenIzq + i * espacioEntreBarras + espacioEntreBarras/2;

        // Posición Y según barraAnim
        let y = ejeY - barraAnim[i];

        // Detección de hover
        let estaSobre = mouseX > x - barraAncho/2 && mouseX < x + barraAncho/2 &&
                        mouseY > min(y, ejeY) && mouseY < max(y, ejeY);
        if (estaSobre) hoverIndex = i;

        // Dibujar barra
        noStroke();
        if (puntos >= 0) fill(0, 200, 100, 220); // verde positivo
        else fill(255, 50, 50, 220); // rojo negativo
        rect(x - barraAncho/2, y, barraAncho, barraAnim[i]);

        // Nombre y puntaje arriba o abajo de la barra
        fill(255);
        textSize(12);
        textAlign(CENTER, BOTTOM);
        if (puntos >= 0) {
            text(jugador.nombre, x, y - 4);
            text(formatearNumero(puntos), x, y - 18);
        } else {
            text(jugador.nombre, x, y + barraAnim[i] + 14);
            text(formatearNumero(puntos), x, y + barraAnim[i] + 28);
        }
    }

    // Panel de detalle al mouse
    if (hoverIndex >= 0 && hoverIndex < lista.length) {
        let j = lista[hoverIndex];
        let panelW = 230;
        let panelH = 90;
        let offsetX = 15;
        let offsetY = 15;
        let panelX = mouseX + offsetX;
        let panelY = mouseY + offsetY;

        if (panelX + panelW > width) panelX = mouseX - panelW - offsetX;
        if (panelY + panelH > height) panelY = mouseY - panelH - offsetY;

        noStroke();
        fill(0, 0, 0, 180);
        rect(panelX, panelY, panelW, panelH, 10);

        fill(255);
        textSize(14);
        textAlign(LEFT, TOP);
        text(`Jugador: ${j.nombre}`, panelX + 10, panelY + 10);
        text(`Puntaje: ${formatearNumero(Number(j.puntos))}`, panelX + 10, panelY + 32);
    }

    // Marcas eje Y
    stroke(150);
    strokeWeight(1);
    fill(200);
    textSize(12);
    textAlign(RIGHT, CENTER);
    let numMarcas = 5;
    for (let i = -numMarcas; i <= numMarcas; i++) {
        let v = (i * maxPuntos) / numMarcas;
        let yMarc = ejeY - map(v, -maxPuntos, maxPuntos, -(height - margenSup - margenInf)/2, (height - margenSup - margenInf)/2);
        line(margenIzq - 5, yMarc, margenIzq, yMarc);
        text(Math.round(v), margenIzq - 10, yMarc);
    }
}
