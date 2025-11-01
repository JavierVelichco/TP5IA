function preload() {
    imagenes = {};

    // jefes
    imagenes["navidad"] = loadImage("img/jefe-navidenio.png");
    imagenes["impuestos"] = loadImage("img/jefe-impuestos.png");

    // jugador
    playerImg = loadImage("img/tortu.png");

    // objetos que caen
    imagenes["billete"] = loadImage("img/billete.png");
    imagenes["masbillete"] = loadImage("img/masbillete.png");
    imagenes["bill"] = loadImage("img/bill.png");
    imagenes["gasto_chico"] = loadImage("img/hambur.png");
    imagenes["gasto_med"] = loadImage("img/pizza.png");
    imagenes["gasto_grande"] = loadImage("img/facluz.png");
}
