// js/sketch.js

function stopAllMusic() {
    musicaMenu?.stop();
    musicaJuego?.stop();
}
let cnv;
let startBtn = { x: 0, y: 0, w: 180, h: 44 };

function setup() {
    userStartAudio().then(() => {
    console.log("Audio habilitado");
    });
    cnv = createCanvas(400, 600);

    // ESTADO INICIAL: PREINTRO
    setState(STATES.PREINTRO);   // << CAMBIO CLAVE

    setDifficulty(CURRENT_DIFF);
    noLoop();

    noStroke();
    if (typeof Player === "function") player = new Player();
    startTimeGlobal = millis();

    if (Array.isArray(buildings)) {
        buildings.length = 0;
        for (let i = 0; i < 10; i++) {
            buildings.push(new Building("left", i));
            buildings.push(new Building("right", i));
        }
    }

    textFont("Arial");

    userStartAudio().then(() => {
        console.log("AudioContext listo, podemos reproducir música");
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

    // 1) Pantallas 
    if (state !== STATES.JUEGO) {
        if (state === STATES.PREINTRO) { drawPreIntro(); updatePopups?.(); return;}
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

    // Si estamos EN PELEA con un boss, delego TODO a updateBossPhase y salgo
    if (inBoss) {
        updateBossPhase?.();
        updatePopups?.();
        return; // IMPORTANTÍSIMO: no procesar spawning ni cierre de mes aquí
    }

    // Si hay cooldown post-boss, lo decremento y no dejo que cierre el mes ni spawnee
    if (postBossCooldown > 0) {
        // deltaTime es proveído por p5.js; sirve para decrementar en ms
        postBossCooldown -= deltaTime;
        if (postBossCooldown < 0) postBossCooldown = 0;

        // Mientras hay cooldown, procesamos solamente objetos ya existentes (caídas, player)
        // para que la pantalla no quede congelada, pero evitamos que se crezcan nuevos objetos
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

        // Jugador + balas (si querés que sigan activos durante cooldown)
        player.update?.();
        player.draw?.();

        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            b.update?.();
            b.draw?.();
            if (b.offscreen?.()) bullets.splice(i, 1);
        }

        // En cooldown NO entramos a jefe aunque elapsedMonth sea > límite
        // tampoco ejecutamos handleSpawning
    } else {
        // Sin cooldown: flujo normal sin jefe
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

    // Balas enemigas (se procesan fuera del bloque del boss para que sigan impactando)
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
