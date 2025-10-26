// === Variables globales de interfaz (UI) ===
let cnv;                // referencia al canvas
let diffSelect;         // selector de dificultad
let currentDiff = "normal"; // dificultad inicial
let startBtn = { x: 0, y: 0, w: 180, h: 44 }; // botón "JUGAR"


function setup() {
    // Crea el canvas directamente en el body
    cnv = createCanvas(400, 600);


    // Desplegable de dificultad (p5 DOM)
    diffSelect = createSelect();
    diffSelect.hide();
    diffSelect.option('Argentino', 'facil');
    diffSelect.option('Normal', 'normal');
    diffSelect.option('Difícil', 'dificil');
    diffSelect.selected(currentDiff);
    diffSelect.changed(() => {
        currentDiff = diffSelect.value();
        setDifficulty(currentDiff);      // usa tu función existente
    });

    // Un toquecito de estilo
    diffSelect.style('font-size', '14px');
    diffSelect.style('padding', '6px 10px');
    diffSelect.style('border-radius', '8px');
    diffSelect.style('border', '1px solid #8aa');

    setState(STATES.INICIO); // arranca en el estado de inicio
    noLoop();

    noStroke();
    player = new Player();
    startTimeGlobal = millis();
    monthStartTime = millis();

    // Crea los edificios del fondo
    for (let i = 0; i < 10; i++) {
        buildings.push(new Building("left", i));
        buildings.push(new Building("right", i));
    }

    textFont("Arial");
}


function draw() {


    // Router de estados
    if (state === STATES.INICIO) {
        drawInicio();
        placeDiffSelect();  // ✅ en vez de las 3 líneas manuales
        updatePopups();
        return;
    }

    if (state === STATES.CREDITOS) {
        diffSelect.hide();
        drawCreditos();
        updatePopups();
        return;
    }
    if (state === STATES.GANAR) {
        diffSelect.hide();
        drawGanar();
        updatePopups();
        return;
    }
    if (state === STATES.PERDER) {
        diffSelect.hide();
        drawPerder();
        updatePopups();
        return;
    }

    if (state === STATES.SCORE) {
        diffSelect.hide();
        drawScore();   // ← nueva pantalla
        updatePopups();
        return;
    }



    // ===== JUEGO =====
    background(120, 170, 255);
    drawCity();
    drawHUD();

    if (gameOver) { noLoop(); enterScore(money, monthIndex); return; }
    if (victory) { noLoop(); enterScore(money, monthIndex); return; }


    const now = millis();
    const elapsedMonth = now - monthStartTime;

    if (inBoss) {
        updateBossPhase();
    } else {
        handleSpawning(elapsedMonth);

        for (let i = falling.length - 1; i >= 0; i--) {
            let o = falling[i];
            o.update(); o.draw();
            if (o.hits(player)) {
                money += o.value;
                floatingPopup(
                    o.x, o.y,
                    (o.value > 0 ? "+" : "") + "$" + nf(abs(int(o.value)), 0, 0),
                    o.value > 0 ? color(0, 180, 0) : color(220, 50, 50)
                );
                falling.splice(i, 1);
            } else if (o.y - o.d / 2 > height + 50) {
                falling.splice(i, 1);
            }
        }

        player.update();
        player.draw();

        for (let i = bullets.length - 1; i >= 0; i--) {
            let b = bullets[i];
            b.update(); b.draw();
            if (b.offscreen()) bullets.splice(i, 1);
        }

        if (elapsedMonth >= MONTH_DURATION_MS) enterBoss();
    }

    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        let eb = enemyBullets[i];
        eb.update(); eb.draw();
        if (eb.hits(player)) {
            money -= ENEMY_HIT_COST;
            floatingPopup(eb.x, eb.y, "-$" + nf(ENEMY_HIT_COST, 0, 0), color(220, 50, 50));
            player.bump();
            enemyBullets.splice(i, 1);
        } else if (eb.offscreen()) enemyBullets.splice(i, 1);
    }

    if (money <= 0 && !gameOver) gameOver = true;

    // ⬅️ Usa la versión que corresponda a tu función:
    // O bien:
    // drawMonthProgress(elapsedMonth);
    // O (si tu función calcula internamente):
    drawMonthProgress();

    updatePopups();
}

// --- Función auxiliar: detecta si el mouse está sobre el botón "JUGAR"
function overStartBtn() {
    return mouseX >= startBtn.x && mouseX <= startBtn.x + startBtn.w &&
        mouseY >= startBtn.y && mouseY <= startBtn.y + startBtn.h;
}


