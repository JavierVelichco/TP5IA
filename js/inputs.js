function keyPressed() {
    // --- PREINTRO ---
    if (state === STATES.PREINTRO) {
        if (keyCode === ENTER || keyCode === RETURN) {
        setState(STATES.INICIO);
        noLoop();
        redraw();
        }
        return;
    }

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

        // Ir a créditos con C
        if (key === 'c' || key === 'C') {
            setState(STATES.CREDITOS);
            redraw();
            noLoop();
            return;
        }

        // Continuar con ENTER
        if (keyCode === ENTER || keyCode === RETURN || keyCode === 13) {
            console.log("[KEY] ENTER en GANAR/PERDER → SCORE"); // Debug

            // Ir al score (si existe la función, sino fallback)
            if (typeof enterScore === "function") {
                enterScore(money, monthIndex);
            } else {
                setState(STATES.SCORE);
                redraw();
                noLoop();
            }
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
    
  // --- PREINTRO ---
    if (state === STATES.PREINTRO) {

        const overBtn =
            mouseX >= preIntroBtn.x && mouseX <= preIntroBtn.x + preIntroBtn.w &&
            mouseY >= preIntroBtn.y && mouseY <= preIntroBtn.y + preIntroBtn.h;

        if (overBtn) {
            setState(STATES.INICIO);
            noLoop();
            redraw();
        }
        return;
    }

    // --- INICIO ---
    if (state === STATES.INICIO) {

        // 1) ¿Clic en el menú desplegable (canvas)?
        if (diffDropdown && diffDropdown.handleMousePressed(mouseX, mouseY)) {
            redraw(); // usa noLoop(), así refrescamos la vista
            return;
        }

        // 2) ¿Clic en el botón JUGAR?
        const overBtn =
            mouseX >= startBtn.x && mouseX <= startBtn.x + startBtn.w &&
            mouseY >= startBtn.y && mouseY <= startBtn.y + startBtn.h;
        if (overBtn) startGame();
        return;
    }

    // --- CRÉDITOS ---
    if (state === STATES.CREDITOS) {
        setState(STATES.INICIO);
        noLoop();
        redraw();
        return;
    }
}

function mouseMoved() {
    if (state === STATES.INICIO) {
        if (diffDropdown && diffDropdown.handleMouseMoved(mouseX, mouseY)) {
            redraw();
        } else {
            redraw(); // refresca hover del botón JUGAR también
        }
    }
}