let preIntroBtn = { x: 0, y: 0, w: 200, h: 50 };

function drawPreIntro() {
    background(25, 35, 60);
    fill(255);
    textAlign(CENTER, CENTER);

    // Título
    textSize(30);
    text("Bienvenidx", width / 2, 120);
    textSize(22);
    text("Esto es: ¿Quién llega a fin de mes?", width / 2, 155);

    textSize(15);
    text("Te esperan unos meses difíciles...", width / 2, 210);
    text("Vas a intentar sobrevivir con un Salario Mímino", width / 2, 235);
     textSize(17);
     textStyle(BOLD);
    text("(es decir $328,400 :O)", width / 2, 260);
    textSize(15);
    textStyle(NORMAL);
    text("Mientras esquivás gastos y enfrentás", width / 2, 285);
    text("al jefe al final de cada mes.", width / 2, 305);

    textSize(24);
    text("¿Estás listx?", width / 2, 345);


    // Atajo
    textSize(13);
    text("ENTER para continuar", width / 2, 490);
}