function keyPressed() {


    if (state === STATES.INICIO) {
        if (key === 'c' || key === 'C') { setState(STATES.CREDITOS); noLoop(); redraw(); }
        if (keyCode === ENTER || keyCode === RETURN) { startGame(); }
        return;
    }

    if (state === STATES.CREDITOS) {
        if (keyCode === ENTER || keyCode === RETURN) {
            setState(STATES.INICIO);
            noLoop();
            redraw();
        }
        return;
    }


    if (state === STATES.PERDER || state === STATES.GANAR) {
        if (key === 'c' || key === 'C') { setState(STATES.CREDITOS); noLoop(); redraw(); return; }
        if (keyCode === ENTER) { setState(STATES.INICIO); noLoop(); redraw(); return; }
    }

    if (state !== STATES.JUEGO) return;

    // Disparar (solo con jefe)
    if (!inBoss) return;
    if (key === 'z' || key === 'Z' || key === 'j' || key === 'J') {
        if (money >= SHOT_COST) { money -= SHOT_COST; bullets.push(new Bullet(player.x, player.y - 20)); }
        else floatingPopup(player.x, player.y - 30, "No $", color(200, 50, 50));
    }
}

function mousePressed() {
    if (state === STATES.INICIO) {
        // Solo inicia si el clic fue sobre el botón "JUGAR"
        const overBtn =
            mouseX >= startBtn.x && mouseX <= startBtn.x + startBtn.w &&
            mouseY >= startBtn.y && mouseY <= startBtn.y + startBtn.h;

        if (overBtn) startGame();
        return; // no hacer nada más estando en INICIO
    }

    if (state === STATES.CREDITOS) {
        setState(STATES.INICIO);
        noLoop();
        redraw();
    }
}
