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
    boss.update(); boss.draw();
    player.update(); player.draw();

    for (let i = bullets.length - 1; i >= 0; i--) {
        let b = bullets[i]; b.update(); b.draw();
        if (b.hitsBoss(boss)) { boss.hp -= b.damage; boss.flash?.(); floatingPopup(b.x, b.y, "-" + b.damage + "HP", color(255, 200, 0)); bullets.splice(i, 1); }
        else if (b.offscreen()) bullets.splice(i, 1);
    }

    boss.maybeShoot();

    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        let eb = enemyBullets[i]; eb.update(); eb.draw();
        if (eb.hits(player)) { money -= ENEMY_HIT_COST; floatingPopup(eb.x, eb.y, "-$" + nf(ENEMY_HIT_COST, 0, 0), color(220, 50, 50)); player.bump(); enemyBullets.splice(i, 1); }
        else if (eb.offscreen()) enemyBullets.splice(i, 1);
    }

    let bossElapsed = millis() - bossStartTime;
    if (boss.hp <= 0) { let bonus = int(SUELDO * 0.02 + monthIndex * 200); money += bonus; floatingPopup(width / 2, height / 2 - 40, "+$" + nf(bonus, 0, 0), color(0, 200, 0)); exitBoss(true); }
    else if (bossElapsed >= BOSS_DURATION_MS) { let penalty = int(SUELDO * 0.02); money -= penalty; floatingPopup(width / 2, height / 2 - 40, "-$" + nf(penalty, 0, 0), color(220, 50, 50)); exitBoss(false); }

    if (money <= 0 && !gameOver) gameOver = true;
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

    // Oculta el selector por si hubiera quedado visible
    if (typeof diffSelect !== 'undefined') diffSelect.hide();

    setState(STATES.SCORE);
    noLoop(); // deja de simular mientras se ve el score
}


function startGame() {
    // aplicar dificultad elegida en el menú
    setDifficulty(currentDiff);              // "facil" | "normal" | "dificil"
    setState(STATES.JUEGO);

    // ocultar el selector al entrar al juego (por si quedó visible)
    if (typeof diffSelect !== 'undefined') diffSelect.hide();

    // resetear estado de partida
    money = SUELDO;
    monthIndex = 0;
    gameOver = false;
    victory = false;
    inBoss = false;
    boss = null;

    // limpiar entidades
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
