let datos = [];
let barraAnim = []; // altura animada de cada barra
let hoverIndex = -1;

// Botón "virtual" dentro del canvas
let btnVolver = {
    x: 0,
    y: 0,
    w: 180,
    h: 32
};

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
    return "$" + Number(n).toLocaleString("es-AR");
}

function draw() {
    background(20);

    // TÍTULO dentro del canvas
    fill(255);
    textAlign(CENTER, TOP);
    textSize(20);
    text("¿Quién llegó a fin de mes?", width / 2, 16);

    if (!datos) {
        textSize(16);
        text("Cargando datos...", width / 2, 60);
        return;
    }

    let lista = Array.isArray(datos) ? datos : Object.values(datos);
    if (lista.length === 0) {
        textSize(16);
        text("No hay datos de partidas aún.", width / 2, 60);
        return;
    }

    // Dejo más espacio arriba (título) y abajo (botón)
    let margenSup = 80;
    let margenInf = 80;
    let margenIzq = 100;
    let margenDer = 100;

    const yTop = margenSup;
    const yBottom = height - margenInf;

    // Rango real de puntajes (permitiendo negativos más chicos)
    let minPuntos = 0;
    let maxPuntos = 0;
    for (let j of lista) {
        let p = Number(j.puntos);
        if (p < minPuntos) minPuntos = p;
        if (p > maxPuntos) maxPuntos = p;
    }
    // evitar rango vacío
    if (minPuntos === 0 && maxPuntos === 0) {
        maxPuntos = 1;
    }

    // Eje horizontal en valor 0:
    // si no hay negativos, el eje queda abajo; si los hay, sube un poco
    let ejeY = map(0, maxPuntos, minPuntos, yTop, yBottom);

    // Dibujar ejes
    stroke(150);
    strokeWeight(1);
    line(margenIzq, yTop, margenIzq, yBottom);       // eje vertical
    line(margenIzq, ejeY, width - margenDer, ejeY);  // eje horizontal (valor 0)

    hoverIndex = -1;

    // Espacio y ancho de barra
    let espacioEntreBarras = (width - margenIzq - margenDer) / lista.length;
    let barraAncho = espacioEntreBarras * 0.5;

    for (let i = 0; i < lista.length; i++) {
        let jugador = lista[i];
        let puntos = Number(jugador.puntos);

        // y objetivo según valor real (más puntos → más arriba)
        let yObjetivo = map(
            puntos,
            maxPuntos,   // valor más alto
            minPuntos,   // valor más bajo (tal vez negativo)
            yTop,        // arriba
            yBottom      // abajo
        );

        // Efecto rebote con easing: animamos la posición Y
        if (barraAnim[i] === undefined) barraAnim[i] = ejeY; // inicializar
        barraAnim[i] += (yObjetivo - barraAnim[i]) * 0.1;
        if (Math.abs(yObjetivo - barraAnim[i]) < 0.5) barraAnim[i] = yObjetivo;

        // Posición X centrada en su “slot”
        let x = margenIzq + i * espacioEntreBarras + espacioEntreBarras / 2;

        // La barra va siempre entre el eje (0) y el valor
        let yBarraTop = Math.min(ejeY, barraAnim[i]);
        let alturaBarra = Math.abs(ejeY - barraAnim[i]);

        // Detección de hover
        let estaSobre =
            mouseX > x - barraAncho / 2 && mouseX < x + barraAncho / 2 &&
            mouseY > yBarraTop && mouseY < yBarraTop + alturaBarra;
        if (estaSobre) hoverIndex = i;

        // Dibujar barra
        noStroke();
        if (puntos >= 0) fill(0, 200, 100, 220);  // verde positivo
        else fill(255, 50, 50, 220);              // rojo negativo

        rect(x - barraAncho / 2, yBarraTop, barraAncho, alturaBarra);

// (sin nombres ni puntajes sobre las barras)
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
    let numMarcas = 6;
    for (let i = 0; i <= numMarcas; i++) {
        // valor de la marca, del máximo al mínimo
        let v = maxPuntos - (i * (maxPuntos - minPuntos) / numMarcas);

        // posición vertical de esa marca
        let yMarc = map(v, maxPuntos, minPuntos, yTop, yBottom);

        // línea corta a la izquierda del eje
        line(margenIzq - 5, yMarc, margenIzq, yMarc);

        // número formateado (puede ser negativo, positivo o cero)
        text(formatearNumero(Math.round(v)), margenIzq - 10, yMarc);
    }

    // Opcional: remarcar el 0 (si está dentro del rango)
    if (minPuntos < 0 && maxPuntos > 0) {
        let y0 = map(0, maxPuntos, minPuntos, yTop, yBottom);
        stroke(200);
        line(margenIzq, y0, width - margenDer, y0);
        fill(200);
        textAlign(RIGHT, CENTER);
        text(formatearNumero(0), margenIzq - 10, y0);
    }

    // BOTÓN “Volver a jugar” dentro del canvas
    btnVolver.w = 180;
    btnVolver.h = 32;
    btnVolver.x = width / 2 - btnVolver.w / 2;
    btnVolver.y = height - 40;

    let sobreBtn =
        mouseX >= btnVolver.x && mouseX <= btnVolver.x + btnVolver.w &&
        mouseY >= btnVolver.y && mouseY <= btnVolver.y + btnVolver.h;

    noStroke();
    fill(sobreBtn ? color(70, 130, 230) : color(55, 95, 190));
    rect(btnVolver.x, btnVolver.y, btnVolver.w, btnVolver.h, 8);

    fill(255);
    textSize(14);
    textAlign(CENTER, CENTER);
    text("Volver a jugar", btnVolver.x + btnVolver.w / 2, btnVolver.y + btnVolver.h / 2);
}

// Detecta clic dentro del botón del canvas
function mousePressed() {
    if (
        mouseX >= btnVolver.x && mouseX <= btnVolver.x + btnVolver.w &&
        mouseY >= btnVolver.y && mouseY <= btnVolver.y + btnVolver.h
    ) {
        window.location.href = "index.html";
    }
}
