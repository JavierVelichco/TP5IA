//panel superior
function drawHUD() {

    fill(40, 40, 50, 230); rect(0, 0, width, 30);
    textSize(11); fill(255); textAlign(LEFT, CENTER);
    // text("🎚️ " + CURRENT_DIFF.toUpperCase(), 330, 38);

    textSize(15);
    text(MONTHS[monthIndex], 20, 18);
    text("$ " + int(money).toLocaleString('es-AR'), 160, 18);


    let remaining = inBoss ? max(0, BOSS_DURATION_MS - (millis() - bossStartTime))
        : max(0, MONTH_DURATION_MS - (millis() - monthStartTime));
    text("⏱️ " + nf(remaining / 1000, 2, 1) + " s", 300, 18);
}

function drawMonthProgress() {
    let total = inBoss ? BOSS_DURATION_MS : MONTH_DURATION_MS;
    let left = inBoss ? millis() - bossStartTime : millis() - monthStartTime;
    let pct = constrain(left / total, 0, 1);
    fill(30, 200, 100); rect(10, height - 18, (width - 20) * pct, 8, 4);
    fill(200); rect(10 + (width - 20) * pct, height - 18, (width - 20) * (1 - pct), 8, 4);
}

function drawGameOver() {
    fill(255, 50, 50, 220); rect(0, height / 2 - 50, width, 120);
    fill(255); textAlign(CENTER, CENTER); textSize(28);
    text("¡Te quedaste sin plata! 💸", width / 2, height / 2);
}

function drawVictory() {
    fill(0, 200, 0, 220); rect(0, height / 2 - 50, width, 120);
    fill(255); textAlign(CENTER, CENTER); textSize(28);
    text("¡Completaste el año! 🎉", width / 2, height / 2);
}
