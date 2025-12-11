let preIntroBtn = { x: 0, y: 0, w: 200, h: 50 };

function drawPreIntro() {
    background(25, 35, 60);
    fill(255);
    textAlign(CENTER, CENTER);

    // Título
    textSize(30);
    text("Bienvenidx", width / 2, 160);

    textSize(16);
    text("Te esperan unos meses difíciles...", width / 2, 210);
    text("Vas a intentar sobrevivir con un Salario Mímino,", width / 2, 235);
    text("mientras esquivás gastos y enfrentás", width / 2, 260);
    text("al jefe al final de cada mes.", width / 2, 285);

    textSize(24);
    text("¿Estás listx?", width / 2, 330);


    // Atajo
    textSize(13);
    text("ENTER para continuar", width / 2, 510);
}