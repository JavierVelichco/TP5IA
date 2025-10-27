function drawInicio() {
    background(30, 40, 70);
    fill(255);
    textAlign(CENTER, CENTER);

    // Título
    textSize(28);
    text("Llegar a fin de mes", width / 2, 70);

    // Subtítulo 
    textSize(14);
    text("Tratá de sobrevivir con un Salario Mínimo Vital y Móvil argentino", width / 2, 110);
    text("Esquivá gastos y enfrentá al jefe del fin de mes", width / 2, 130);

    // Controles 
    text("Mover: Flechas o WASD  •  Disparar al jefe: Z o J", width / 2, 170);
    text("Objetivo: Sobrevivir sin deudas", width / 2, 220);

    // Indicaciones de inicio
    textSize(14);
    text("Elegí la dificultad y luego presioná:", width / 2, 270);

    // --- Botón JUGAR ---
    const btnY = 360;   
    startBtn.x = width / 2 - startBtn.w / 2;
    startBtn.y = btnY;

    // Hover
    const hover = mouseX >= startBtn.x && mouseX <= startBtn.x + startBtn.w &&
        mouseY >= startBtn.y && mouseY <= startBtn.y + startBtn.h;

    noStroke();
    fill(hover ? 80 : 60, 120, 220);
    rect(startBtn.x, startBtn.y, startBtn.w, startBtn.h, 10);

    fill(255);
    textSize(18);
    text("JUGAR", width / 2, btnY + startBtn.h / 2);

    // Atajos
    textSize(13);
    text("ENTER para comenzar • C para Créditos", width / 2, btnY + 90);
}


//Centrar selector en INICIO ---
function placeDiffSelect() {
    if (!diffSelect || !cnv) return; // seguridad
    const p = cnv.position(); 
    const x = p.x + width / 2 - diffSelect.elt.offsetWidth / 2 - 50;
    const y = p.y + 300; // altura bajo el texto de inicio
    diffSelect.position(x, y);
    diffSelect.show();
}


