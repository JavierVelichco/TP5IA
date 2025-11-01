// Transiciones de fin de juego con el jefe en pantalla
let bossTransition = {
    active: false,
    type: null,       // 'win' | 'lose'
    start: 0,
    duration: 1200    // ms (1.2 s). Ajustá a gusto
};

function startBossTransition(type) {
    console.log("startBossTransition:", type); // <---- DEBUG
    bossTransition.active = true;
    bossTransition.type = type; // 'win' o 'lose'
    bossTransition.start = millis();

    // Limpiar cualquier cosa que pueda dejar “rastros”
    if (Array.isArray(falling)) falling.length = 0;
    if (Array.isArray(bullets)) bullets.length = 0;
    if (Array.isArray(enemyBullets)) enemyBullets.length = 0;
    if (typeof popups !== 'undefined' && Array.isArray(popups)) popups.length = 0;

}

function drawBossTransition() {
    console.log("🎬 drawBossTransition", bossTransition.type); // DEBUG
    if (bossTransition.type === 'win') {
        drawBossWinFade();
    } else {
        drawBossLoseLaugh();
    }
}

// Ganar: desvanecer jefe y luego ir a GANAR
function drawBossWinFade() {
    const t = constrain((millis() - bossTransition.start) / bossTransition.duration, 0, 1);

    if (player && player.draw) player.draw();

    push();
    if (typeof drawingContext !== 'undefined') drawingContext.globalAlpha = 1 - t;
    if (boss && boss.draw) boss.draw();
    if (typeof drawingContext !== 'undefined') drawingContext.globalAlpha = 1;
    pop();

    push();
    noStroke(); fill(255); textAlign(CENTER, CENTER); textSize(18);
    text("¡Jefe derrotado!", width / 2, height / 2 - 60);
    pop();

    if (t >= 1) {
        // Cerrar transición de forma atómica
        bossTransition.active = false;
        bossTransition.type = null;

        // Asegurar que no quede nada del jefe activo
        inBoss = false;
        boss = null;
        bullets = [];
        enemyBullets = [];

        // Cambiar pantalla y detener loop
        setState(STATES.GANAR);

        // Pintar GANAR una vez por si el ruteo de draw usa noLoop/redraw
        if (typeof drawGanar === "function") {
            drawGanar();
        }

        noLoop();   // detiene el bucle; no llames redraw() aquí
        return;     // salir del frame
    }
}


function drawBossLoseLaugh() {
    const t = constrain((millis() - bossTransition.start) / bossTransition.duration, 0, 1);
    const shake = (1 - t) * 8;

    // Jugador estático
    if (player && player.draw) player.draw();

    // Jefe con temblor
    push();
    translate(random(-shake, shake), random(-shake, shake));
    if (boss && boss.draw) boss.draw();
    pop();

    // Risa
    push();
    textAlign(CENTER, CENTER); noStroke(); fill(255); textSize(26);
    text("JA  JA  JA", width / 2, height / 2 - 60);
    pop();

    // === FINAL ÚNICO ===
    if (t >= 1) {
        console.log("[LOSE] Pintar PERDER directamente (único final) y detener");
        bossTransition.active = false;

        // Cambia estado
        setState(STATES.PERDER);

        // Pinta PERDER una vez (por si el router/redraw no lo hace)
        if (typeof drawPerder === "function") {
            drawPerder();
        } else {
            background(24, 8, 8);
            fill(240); textAlign(CENTER, CENTER); textSize(22);
            text("Has perdido", width / 2, height / 2 - 20);
            textSize(14); text("ENTER para volver al inicio", width / 2, height / 2 + 20);
        }

        // Detiene el loop en esa pantalla
        noLoop();
    }
}



function handleSpawning(elapsedMonthMs) {
    const ratio = constrain(elapsedMonthMs / MONTH_DURATION_MS, 0, 1);
    const prog = difficultyFactor(elapsedMonthMs);

    let spawnProb = (BASE_SPAWN_PROB * _diffCfg.spawnMul) + monthIndex * 0.006 + ratio * 0.02;
    let speedMultiplier = (1 + monthIndex * 0.08 + ratio * 0.6) + _diffCfg.speedAdd + (prog - 1) * 0.12;
    let probIngreso = constrain(0.55 - monthIndex * 0.03 - ratio * 0.35, 0.05, 0.6);

    if (random(1) < spawnProb) {
        let count = random() < 0.2 ? int(random(2, 4)) : 1;
        for (let k = 0; k < count; k++) {
            let r = random(1);
            if (r < probIngreso) falling.push(new FallingObject("ingreso", speedMultiplier, prog));
            else {
                let rr = random(1);
                if (rr < 0.65) falling.push(new FallingObject("gasto_chico", speedMultiplier, prog));
                else if (rr < 0.92) falling.push(new FallingObject("gasto_med", speedMultiplier, prog));
                else falling.push(new FallingObject("gasto_grande", speedMultiplier, prog));
            }
        }
    }
}

function enterBoss() {
    inBoss = true; bossStartTime = millis();
    const base = BOSS_BASE_HP + monthIndex * 40 + int(SUELDO * 0.0003 * monthIndex);
    const hp = Math.round(base * _diffCfg.bossHpMul);
    boss = createBossForMonth(monthIndex, hp);
    falling = []; bullets = []; enemyBullets = [];
}

function updateBossPhase() {
    // A) ¿Hay transición visual en curso? -> solo dibujarla y salir
    if (bossTransition.active) {
        drawBossTransition();
        return;
    }

    // B) Lógica normal de pelea
    boss.update(); boss.draw();
    player.update(); player.draw();

    for (let i = bullets.length - 1; i >= 0; i--) {
        let b = bullets[i]; b.update(); b.draw();
        if (b.hitsBoss(boss)) {
            boss.hp -= b.damage; boss.flash?.();
            floatingPopup(b.x, b.y, "-" + b.damage + "HP", color(255, 200, 0));
            bullets.splice(i, 1);
        } else if (b.offscreen()) bullets.splice(i, 1);
    }

    boss.maybeShoot();

    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        let eb = enemyBullets[i]; eb.update(); eb.draw();
        if (eb.hits(player)) {
            money -= ENEMY_HIT_COST;
            floatingPopup(eb.x, eb.y, "-$" + nf(ENEMY_HIT_COST, 0, 0), color(220, 50, 50));
            player.bump(); enemyBullets.splice(i, 1);
        } else if (eb.offscreen()) enemyBullets.splice(i, 1);
    }

    // C) ¿Derrota global por dinero? -> risa + pasar a PERDER
    if (money <= 0 && !gameOver) {
        gameOver = true;
        startBossTransition('lose');
        return;
    }

    // D) Tiempo/vida del jefe
    let bossElapsed = millis() - bossStartTime;

    // D1) ¿Jefe derrotado?
    if (boss.hp <= 0) {
        let bonus = int(SUELDO * 0.02 + monthIndex * 200);
        money += bonus;
        floatingPopup(width / 2, height / 2 - 40, "+$" + nf(bonus, 0, 0), color(0, 200, 0));

        // Avanzar mes y limpiar pelea
        inBoss = false; boss = null; bullets = []; enemyBullets = [];
        const nextMonth = monthIndex + 1;

        if (nextMonth >= TOTAL_MONTHS) {
            // Victoria final -> animación de desvanecer y luego pantalla GANAR
            monthIndex = nextMonth; // actualiza el índice para consistencia
            victory = true;
            if (!bossTransition.active) startBossTransition('win');
            return;
        } else {
            // No es el último mes: seguimos flujo normal
            monthIndex = nextMonth;
            actualizarSueldo(monthIndex);
            monthStartTime = millis();
            return;
        }
    }

    // D2) ¿Se acabó el tiempo del jefe? Penalidad y avanzar (sin transición final)
    if (bossElapsed >= BOSS_DURATION_MS) {
        let penalty = int(SUELDO * 0.02);
        money -= penalty;
        floatingPopup(width / 2, height / 2 - 40, "-$" + nf(penalty, 0, 0), color(220, 50, 50));

        inBoss = false; boss = null; bullets = []; enemyBullets = [];
        monthIndex++;

        if (monthIndex >= TOTAL_MONTHS) {
            // Si tu diseño considera fin por meses como derrota global, puedes activar:
            // gameOver = true; startBossTransition('lose'); return;
            // Si prefieres ir a score/ganar aquí, ajústalo según tu regla.
            // Por ahora, mantenemos tu comportamiento original (no transición).
        } else {
            actualizarSueldo(monthIndex);
            monthStartTime = millis();
        }
    }
}

function exitBoss() {
    inBoss = false; boss = null; bullets = []; enemyBullets = [];
    monthIndex++;
    if (monthIndex >= TOTAL_MONTHS) {
        victory = true;  // termina el juego
    } else {
        actualizarSueldo(monthIndex);// paga solo si sigue el juego

        monthStartTime = millis();
    }
}

function goToScore() {
    // Actualiza highscore si corresponde
    if (money > highscore.money || (money === highscore.money && monthIndex > highscore.month)) {
        highscore.money = money;
        highscore.month = monthIndex;
        highscore.when = new Date().toLocaleDateString();
        saveHighscore();
    }

    // (ya no usamos diffSelect HTML)
    // if (typeof diffSelect !== 'undefined') diffSelect.hide();

    setState(STATES.SCORE);
    noLoop();
}


function startGame() {
    // Reset transición de jefe por si venís de victoria anterior
    if (typeof bossTransition !== 'undefined') {
        bossTransition.active = false;
        bossTransition.type = null;
    }

    // aplicar dificultad elegida en el menú
    setDifficulty(CURRENT_DIFF);

    setState(STATES.JUEGO);

    // resetear estado de partida
    money = SUELDO;
    monthIndex = 0;
    gameOver = false;
    victory = false;
    inBoss = false;
    boss = null;

    // limpiar objetos
    falling = [];
    bullets = [];
    enemyBullets = [];
    if (typeof popups !== 'undefined') popups.length = 0;

    // tiempos
    startTimeGlobal = millis();
    monthStartTime = millis();

    // escenario y jugador
    if (buildings.length === 0) {
        for (let i = 0; i < 10; i++) {
            buildings.push(new Building("left", i));
            buildings.push(new Building("right", i));
        }
    }

    player = new Player();

    // empezar a dibujar
    loop();
}


function actualizarSueldo(monthIndex) {
    money += SUELDO;
    floatingPopup(width / 2, 60, "💰 Sueldo depositado: +$" + nf(SUELDO, 0, 0), color(0, 200, 0));
}

// --- Estado JUEGO: bucle de dibujo/actualización ---
function updateJuego() {
    // Fondo / ciudad
    if (typeof drawCity === "function") {
        drawCity();
    } else {
        background(18, 24, 40);
    }

    // 👇 Clave: si hay jefe o una transición activa, actualizar esa fase
    if (inBoss || bossTransition.active) {
        updateBossPhase();
    } else {
        // Juego “normal” (sin jefe)
        const elapsed = millis() - monthStartTime;

        if (typeof handleSpawning === "function") handleSpawning(elapsed);

        if (player) { player.update?.(); player.draw?.(); }

        // Objetos que caen
        for (let i = falling.length - 1; i >= 0; i--) {
            const o = falling[i];
            o.update?.(); o.draw?.();
            if (o.offscreen?.()) falling.splice(i, 1);
        }

        // ¿cierra el mes?
        if (elapsed > MONTH_DURATION_MS) {
            // Si querés entrar a jefe acá, descomentá:
            // enterBoss();
            monthIndex++;
            monthStartTime = millis();
        }
    }

    // HUD (podés ocultarlo durante la transición si querés)
    if (!bossTransition.active && typeof drawHUD === "function") {
        drawHUD(1);
    }
}
