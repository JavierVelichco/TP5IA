function keyPressed() {

    // --- INICIO ---
    if (state === STATES.INICIO) {
        if (key === 'c' || key === 'C') { setState(STATES.CREDITOS); noLoop(); redraw(); }
        if (keyCode === ENTER || keyCode === RETURN) { startGame(); }
        return;
    }

    // --- CRÉDITOS ---
    if (state === STATES.CREDITOS) {
        if (keyCode === ENTER || keyCode === RETURN) {
            setState(STATES.INICIO);
            noLoop();
            redraw();
        }
        return;
    }

    // --- GANAR / PERDER ---
    if (state === STATES.PERDER || state === STATES.GANAR) {
        if (key === 'c' || key === 'C') {
            setState(STATES.CREDITOS);
            noLoop();
            redraw();
            return;
        }
        if (keyCode === ENTER || keyCode === 13) {
            enterScore(money, monthIndex); // abrir SCORE con los datos finales
            return;
        }
    }

    // --- SCORE ---
    if (state === STATES.SCORE) {
        const typingInName =
            typeof scoreInput !== 'undefined' &&
            scoreInput && scoreInput.elt &&
            document.activeElement === scoreInput.elt;

        if (typingInName) {
            if (keyCode === ENTER || keyCode === 13) { submitScore(); }
            return; // no tomar R/M mientras escribe el nombre
        }

        if (keyCode === ENTER || keyCode === 13) { submitScore(); return; } // guardar
        if (key === 'r' || key === 'R') { hideScoreUI(); startGame(); return; } // reintentar
        if (key === 'm' || key === 'M') { hideScoreUI(); setState(STATES.INICIO); noLoop(); redraw(); return; } // menú
        return;
    }

    // --- JUEGO ---
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
        const overBtn =
            mouseX >= startBtn.x && mouseX <= startBtn.x + startBtn.w &&
            mouseY >= startBtn.y && mouseY <= startBtn.y + startBtn.h;
        if (overBtn) startGame();
        return;
    }

    if (state === STATES.CREDITOS) {
        setState(STATES.INICIO);
        noLoop();
        redraw();
    }
}
