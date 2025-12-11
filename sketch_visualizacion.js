let datos = [];
let barraAnim = [];
let hoverIndex = -1;

function preload() {
    datos = loadJSON("get_data.php");
}

function setup() {
    let canvas = createCanvas(400, 600);
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

    // ------------------------------------
    //  LISTADO VERTICAL CENTRADO ARRIBA
    // ------------------------------------
    fill(255);
    textSize(12);
    textAlign(CENTER, TOP);

    let listadoAltura = lista.length * 18 + 15; 
    let listadoY = 10;

    for (let i = 0; i < lista.length; i++) {
        let nombre = lista[i].nombre;
        text(`${i + 1}. ${nombre}`, width / 2, listadoY + i * 18);
    }

    // Aumentamos distancia entre listado y gráfico
    let offsetGrafico = listadoAltura + 20;

    // ------------------------------------
    // MÁRGENES
    // ------------------------------------
    let margenIzq = 90;
    let margenDer = 60;
    let margenSup = offsetGrafico;
    let margenInf = 60;

    // Eje horizontal centrado del gráfico
    let ejeY = (margenSup + (height - margenInf)) / 2;

    // ------------------------------------
    // ESCALA AUTOMÁTICA REDONDEADA A 100
    // ------------------------------------
    let maxPuntos = 0;
    for (let j of lista) {
        let p = Math.abs(Number(j.puntos));
        if (p > maxPuntos) maxPuntos = p;
    }

    maxPuntos = Math.ceil(maxPuntos / 100) * 100;
    if (maxPuntos < 100) maxPuntos = 100;

    // ------------------------------------
    // Ejes
    // ------------------------------------
    stroke(150);
    strokeWeight(1);
    line(margenIzq, margenSup, margenIzq, height - margenInf);
    line(margenIzq, ejeY, width - margenDer, ejeY);

    hoverIndex = -1;

    let espacioEntreBarras = (width - margenIzq - margenDer) / lista.length;
    let barraAncho = espacioEntreBarras * 0.5;

    // ------------------------------------
    // BARRAS
    // ------------------------------------
    for (let i = 0; i < lista.length; i++) {
        let jugador = lista[i];
        let puntos = Number(jugador.puntos);

        let hMax = (height - margenSup - margenInf) / 2;

        let barraAlturaFinal = map(puntos, -maxPuntos, maxPuntos, -hMax, hMax);

        barraAnim[i] += (barraAlturaFinal - barraAnim[i]) * 0.1;
        if (Math.abs(barraAlturaFinal - barraAnim[i]) < 0.5) barraAnim[i] = barraAlturaFinal;

        let x = margenIzq + i * espacioEntreBarras + espacioEntreBarras / 2;
        let y = ejeY - barraAnim[i];

        let estaSobre =
            mouseX > x - barraAncho/2 && mouseX < x + barraAncho/2 &&
            mouseY > min(y, ejeY) && mouseY < max(y, ejeY);

        if (estaSobre) hoverIndex = i;

        noStroke();
        fill(puntos >= 0 ? color(0, 200, 100, 220) : color(255, 50, 50, 220));
        rect(x - barraAncho/2, y, barraAncho, barraAnim[i]);
    }

    // ------------------------------------
    // POP-UP MÁS CHICO
    // ------------------------------------
    if (hoverIndex >= 0) {
        let j = lista[hoverIndex];
        let panelW = 170;
        let panelH = 65;
        let offsetX = 12;
        let offsetY = 12;

        let panelX = mouseX + offsetX;
        let panelY = mouseY + offsetY;

        if (panelX + panelW > width) panelX = mouseX - panelW - offsetX;
        if (panelY + panelH > height) panelY = mouseY - panelH - offsetY;

        noStroke();
        fill(0, 0, 0, 180);
        rect(panelX, panelY, panelW, panelH, 10);

        fill(255);
        textSize(12);
        textAlign(LEFT, TOP);
        text(`Jugador: ${j.nombre}`, panelX + 8, panelY + 6);
        text(`Puntaje: ${formatearNumero(Number(j.puntos))}`, panelX + 8, panelY + 26);
    }

    // ------------------------------------
    // MARCAS DEL EJE Y
    // ------------------------------------
    stroke(150);
    strokeWeight(1);
    fill(200);
    textSize(12);
    textAlign(RIGHT, CENTER);

    let divisiones = 5;
    for (let i = -divisiones; i <= divisiones; i++) {
        let v = (i * maxPuntos) / divisiones;
        let hMax = (height - margenSup - margenInf) / 2;
        let yMarc = ejeY - map(v, -maxPuntos, maxPuntos, -hMax, hMax);

        line(margenIzq - 5, yMarc, margenIzq, yMarc);
        text(v, margenIzq - 10, yMarc);
    }
}
