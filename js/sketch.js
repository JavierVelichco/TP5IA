// js/sketch.js

function stopAllMusic() {
    musicaMenu?.stop();
    musicaJuego?.stop();
}
let cnv;
let startBtn = { x: 0, y: 0, w: 180, h: 44 };

function setup() {
    cnv = createCanvas(400, 600);

    // Estado inicial y dificultad por defecto (usa tu módulo difficulty.js)
    setState(STATES.INICIO);
    setDifficulty(CURRENT_DIFF);

    // En pantallas estáticas preferimos noLoop() + redraw() manual
    noLoop();

    // Inicialización básica (las clases están en /entities y /ui)
    noStroke();
    if (typeof Player === "function") player = new Player();
    startTimeGlobal = millis();
    monthStartTime = millis();

    // Fondo de ciudad (si tu módulo city usa este array global 'buildings')
    if (Array.isArray(buildings)) {
        buildings.length = 0;
        for (let i = 0; i < 10; i++) {
            buildings.push(new Building("left", i));
            buildings.push(new Building("right", i));
        }
    }

    textFont("Arial");
    // Habilita el audio tras primer click
    userStartAudio().then(() => {
        console.log("AudioContext listo, podemos reproducir música");

        // Iniciar música de menú
        if (musicaMenu && !musicaMenu.isPlaying()) {
            musicaMenu.loop();
            musicaMenu.setVolume(0.5);
        }
    });
}

function draw() {
    // 0) La transición del jefe SIEMPRE tiene prioridad.
    // Mientras bossTransition.active esté en true, solo dibujamos la animación.
    if (bossTransition && bossTransition.active) {
        // updateBossPhase() invoca internamente drawBossTransition()
        updateBossPhase?.();
        updatePopups?.();
        return;
    }

    // 1) Pantallas estáticas (router simple)
    if (state !== STATES.JUEGO) {
        if (state === STATES.INICIO) { drawInicio?.(); updatePopups?.(); return; }
        if (state === STATES.CREDITOS) { drawCreditos?.(); updatePopups?.(); return; }
        if (state === STATES.GANAR) { drawGanar?.(); updatePopups?.(); return; }
        if (state === STATES.PERDER) { drawPerder?.(); updatePopups?.(); return; }
        if (state === STATES.SCORE) { drawScore?.(); updatePopups?.(); return; }
        return;
    }

    // ===== 2) Estado JUEGO =====
    background(120, 170, 255);
    drawCity?.();
    drawHUD?.();

    const now = millis();
    const elapsedMonth = now - monthStartTime;

    if (inBoss) {
        // Puede disparar startBossTransition('win'|'lose') internamente
        updateBossPhase?.();
    } else {
        // Spawning y objetos que caen
        handleSpawning?.(elapsedMonth);

        for (let i = falling.length - 1; i >= 0; i--) {
            const o = falling[i];
            o.update?.();
            o.draw?.();

            if (o.hits?.(player)) {
                money += o.value;
                floatingPopup?.(
                    o.x, o.y,
                    (o.value > 0 ? "+" : "") + "$" + nf(abs(int(o.value)), 0, 0),
                    o.value > 0 ? color(0, 180, 0) : color(220, 50, 50)
                );
                falling.splice(i, 1);
            } else if (o.offscreen?.()) {
                falling.splice(i, 1);
            }
        }

        // Jugador
        player.update?.();
        player.draw?.();

        // Balas del jugador
        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            b.update?.();
            b.draw?.();
            if (b.offscreen?.()) bullets.splice(i, 1);
        }

        // ¿Entrar a jefe?
        if (elapsedMonth >= MONTH_DURATION_MS) enterBoss?.();
    }

    // Balas enemigas
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const eb = enemyBullets[i];
        eb.update?.();
        eb.draw?.();
        if (eb.hits?.(player)) {
            money -= ENEMY_HIT_COST;
            floatingPopup?.(eb.x, eb.y, "-$" + nf(ENEMY_HIT_COST, 0, 0), color(220, 50, 50));
            player.bump?.();
            enemyBullets.splice(i, 1);
        } else if (eb.offscreen?.()) {
            enemyBullets.splice(i, 1);
        }
    }

    // Derrota global por dinero: usar transición 'lose' (temblor + risa)
    if (money <= 0 && !gameOver) {
        gameOver = true;
        if (!bossTransition.active) startBossTransition?.('lose');
        updatePopups?.();
        return; // esperamos a que termine la animación de pérdida
    }

    // Victoria fuera de jefe (si tu flujo lo usa)
    // Si venías de jefe final, updateBossPhase ya disparó la transición 'win'.
    if (victory && !bossTransition.active) {
        setState(STATES.GANAR);
        noLoop();
        return;
    }

    // HUD inferior y popups
    drawMonthProgress?.();
    updatePopups?.();
}
