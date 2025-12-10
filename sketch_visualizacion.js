let datos = [];
let anim = 0; // para la animación de entrada
let hoverIndex = -1; // índice del jugador bajo el mouse

function preload() {
    // visualizacion.html y get_data.php están en la misma carpeta:
    datos = loadJSON("get_data.php");
}

function setup() {
    let canvas = createCanvas(800, 500);
    canvas.parent("contenedor");
    textFont("system-ui");
}

function formatearNumero(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function draw() {
    background(20);

    if (!datos) {
        fill(255);
        textSize(16);
        text("Cargando datos...", 20, 40);
        return;
    }

    // Asegurar que sea un array (y NO modificar el original)
    let lista = Array.isArray(datos) ? datos : Object.values(datos);

    if (lista.length === 0) {
        fill(255);
        textSize(16);
        text("No hay datos de partidas aún.", 20, 40);
        return;
    }

    // Animación suave de entrada
    anim += 0.02;
    if (anim > 1) anim = 1;

    let margenIzq = 150;
    let margenSup = 60;
    let espacioVertical = 60;
    let paddingDerecho = 120; // margen a la derecha

    // Buscar puntaje máximo
    let maxPuntos = 0;
    for (let j of lista) {
        let p = Number(j.puntos);
        if (p > maxPuntos) maxPuntos = p;
    }
    if (maxPuntos === 0) maxPuntos = 1;

    fill(255);
    textSize(18);
    textAlign(LEFT, TOP);
    text("Ranking de puntajes", 20, 20);

    // Antes del bucle, reseteamos el índice de hover
    hoverIndex = -1;

    // Recorremos la lista en el orden que viene (NO hacemos sort aquí)
    for (let i = 0; i < lista.length; i++) {
        let jugador = lista[i];

        let nombre = jugador.nombre;
        let puntos = Number(jugador.puntos);

        let anchoMax = width - margenIzq - paddingDerecho;
        let anchoBarra = map(puntos, 0, maxPuntos, 0, anchoMax);
        anchoBarra *= anim; // efecto de entrada

        let y = margenSup + i * espacioVertical;

        // --- DETECCIÓN DE HOVER (sin modificar el orden) ---
        let estaSobre = (
            mouseX > margenIzq &&
            mouseX < margenIzq + anchoBarra &&
            mouseY > y - 10 &&
            mouseY < y + 10
        );
        if (estaSobre) {
            hoverIndex = i;
        }
        // --------------------------------------------------

        // Línea guía
        stroke(60);
        strokeWeight(1);
        line(margenIzq, y, margenIzq + anchoMax, y);

        // Barra (se resalta sólo en color si está bajo el mouse)
        noStroke();
        if (i === hoverIndex) {
            fill(120, 190, 255, 240);
        } else {
            fill(80, 140, 255, 220);
        }
        rect(margenIzq, y - 10, anchoBarra, 20, 5);

        // Nombre
        fill(255);
        textSize(14);
        textAlign(LEFT, CENTER);
        text(`${i + 1}. ${nombre}`, 20, y);

        // Puntaje formateado con separador de miles
        let puntosTxt = formatearNumero(puntos); // usando la función que definimos antes
        textAlign(LEFT, CENTER);
        let xPuntaje = margenIzq + anchoBarra + 10;
        text(puntosTxt, xPuntaje, y);
    }

    // Panel de detalle si el mouse está sobre alguna barra
    if (hoverIndex >= 0 && hoverIndex < lista.length) {
        let j = lista[hoverIndex];

        noStroke();
        fill(0, 0, 0, 180);
        rect(width - 260, 60, 230, 90, 10);

        fill(255);
        textSize(14);
        textAlign(LEFT, TOP);
        let xPanel = width - 250;
        let yPanel = 70;
        text(`Jugador: ${j.nombre}`, xPanel, yPanel);
        text(`Puntaje: ${formatearNumero(Number(j.puntos))}`, xPanel, yPanel + 22);
        // Aquí podríamos añadir más info (mes, resultado) si luego la traemos de la BD
    }
}



