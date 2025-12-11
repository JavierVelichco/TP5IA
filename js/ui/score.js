let scoreInput = null, scoreBtn = null, scoreGlobalBtn = null;

let leaderboard = [];
let lastRun = { money: 0, month: 0 };
let savedThisRun = false; // evita múltiples guardados por partida

const SCORE_KEY = "finDeMes_scores_v1"; // localStorage

function loadScores() {
    try {
        const raw = localStorage.getItem(SCORE_KEY);
        leaderboard = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(leaderboard)) leaderboard = [];
    } catch {
        leaderboard = [];
    }
}

function saveScores() {
    try {
        localStorage.setItem(SCORE_KEY, JSON.stringify(leaderboard));
    } catch { }
}

function enterScore(finalMoney, finalMonth) {
    lastRun.money = finalMoney;
    lastRun.month = finalMonth;
    savedThisRun = false;

    if (typeof diffSelect !== 'undefined') diffSelect.hide();
    loadScores();
    setState(STATES.SCORE);

    // Crear controles si no existen
    if (!scoreInput) scoreInput = createInput("");
    if (!scoreBtn) scoreBtn = createButton("Guardar");

    // Estilos base del input
    scoreInput.attribute("maxlength", "16");
    scoreInput.attribute("placeholder", "Tu nombre");
    scoreInput.style("padding", "4px 6px");
    scoreInput.style("border-radius", "6px");
    scoreInput.style("border", "1px solid #8aa");
    scoreInput.style("font-size", "14px");
    scoreInput.style("box-shadow", "0 1px 4px rgba(0,0,0,0.15)");
    scoreInput.style("background", "#fff");
    scoreInput.style("color", "#000");
    scoreInput.style("pointer-events", "auto");
    scoreInput.elt?.removeAttribute("readonly");
    scoreInput.value(""); // limpiar nombre previo

    // Estilos base del botón Guardar
    scoreBtn.style("padding", "8px 12px");
    scoreBtn.style("border-radius", "8px");
    scoreBtn.style("border", "none");
    scoreBtn.style("background", "#375fbe");
    scoreBtn.style("color", "#fff");
    scoreBtn.style("font-size", "14px");
    scoreBtn.style("cursor", "pointer");
    scoreBtn.style("font-weight", "600");
    scoreBtn.style("box-shadow", "0 2px 6px rgba(0,0,0,0.2)");
    scoreBtn.html("Guardar");
    scoreBtn.elt?.removeAttribute("disabled");
    scoreBtn.mousePressed(() => submitScore());

    // Crear botón para ver ranking histórico si no existe
    if (!scoreGlobalBtn) {
        scoreGlobalBtn = createButton("Ver ranking histórico");

        // Estilos del botón de ranking histórico
        scoreGlobalBtn.style("padding", "8px 12px");
        scoreGlobalBtn.style("border-radius", "8px");
        scoreGlobalBtn.style("border", "none");
        scoreGlobalBtn.style("background", "#444");
        scoreGlobalBtn.style("color", "#fff");
        scoreGlobalBtn.style("font-size", "14px");
        scoreGlobalBtn.style("cursor", "pointer");
        scoreGlobalBtn.style("font-weight", "600");
        scoreGlobalBtn.style("box-shadow", "0 2px 6px rgba(0,0,0,0.2)");
        scoreGlobalBtn.html("Ver ranking histórico");
        scoreGlobalBtn.mousePressed(() => {
            window.location.href = "visualizacion.html";
        });
    }

    // Mostrar/posicionar controles
    positionScoreUI();

    // Enfocar input
    if (scoreInput?.elt) {
        scoreInput.show();
        scoreInput.elt.focus();
        const v = scoreInput.value();
        try {
            scoreInput.elt.setSelectionRange(v.length, v.length);
        } catch { }
    }

    // Evitar que teclas del input disparen atajos globales
    if (scoreInput?.elt && !scoreInput._stopperAttached) {
        scoreInput.elt.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter') { ev.preventDefault(); submitScore(); }
            ev.stopPropagation();
        });
        scoreInput._stopperAttached = true;
    }

    loop();
}

// Posiciona/oculta controles según estado
function positionScoreUI() {
    if (!cnv || !scoreInput || !scoreBtn) return;

    const p = cnv.position();
    const margin = 40;
    const inputW = Math.min(260, width - margin * 2);
    const inputH = 32;
    const btnW = 140;
    const btnH = 34;
    const gapY = 12;

    const inputX = p.x + (width - inputW) / 2;
    const inputY = p.y + 240;

    // reposicionar input
    scoreInput.size(inputW, inputH);
    scoreInput.position(inputX, inputY);

    // reposicionar botón Guardar
    const btnX = p.x + (width - btnW) / 2;
    const btnY = inputY + inputH + gapY;
    scoreBtn.size(btnW, btnH);
    scoreBtn.position(btnX, btnY);

    // reposicionar botón "Ver ranking histórico"
    if (scoreGlobalBtn) {
        const globalW = 180;
        const globalH = 34;
        const globalX = p.x + (width - globalW) / 2;
        const globalY = btnY + btnH + 8; // debajo del botón Guardar
        scoreGlobalBtn.size(globalW, globalH);
        scoreGlobalBtn.position(globalX, globalY);
    }

    // mostrar/ocultar según si ya se guardó
    if (!savedThisRun) {
        scoreInput.show();
        scoreBtn.show();
        if (scoreGlobalBtn) scoreGlobalBtn.show();
    } else {
        scoreInput.hide();
        scoreBtn.hide();
        if (scoreGlobalBtn) scoreGlobalBtn.show(); // este puede seguir visible
    }
}

function hideScoreUI() {
    if (scoreInput?.elt) scoreInput.elt.blur();
    if (scoreInput) scoreInput.hide();
    if (scoreBtn) scoreBtn.hide();
    if (scoreGlobalBtn) scoreGlobalBtn.hide();
}

function submitScore() {
    if (savedThisRun) return;
    savedThisRun = true;

    const rawName = (scoreInput?.value() || "").trim();
    const name = rawName || "Anónimo";
    const norm = name.toLowerCase();

    loadScores();
    const idx = leaderboard.findIndex(r => (r.name || "").toLowerCase() === norm);

    const incoming = {
        name,
        money: lastRun.money,
        month: lastRun.month,
        date: new Date().toLocaleDateString()
    };

    if (idx >= 0) {
        const cur = leaderboard[idx];
        const isBetter =
            (incoming.money > cur.money) ||
            (incoming.money === cur.money && incoming.month > cur.month);
        if (isBetter) leaderboard[idx] = incoming;
    } else {
        leaderboard.push(incoming);
    }

    leaderboard.sort((a, b) => (b.money - a.money) || (b.month - a.month));
    leaderboard = leaderboard.slice(0, 10);
    saveScores(); // sigue usando localStorage

    // Enviar también el puntaje al servidor (PHP + MySQL)
    try {
        fetch("save_score.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                name: name,
                money: String(lastRun.money),
                month: String(lastRun.month)
            })
        })
            .then(r => r.json())
            .then(res => {
                console.log("Respuesta de save_score.php:", res);
            })
            .catch(err => {
                console.error("Error al guardar en servidor:", err);
            });
    } catch (e) {
        console.error("Error de red al intentar enviar el puntaje:", e);
    }

    // asegurar que el input tenga el nombre (por si querés usarlo)
    scoreInput?.value(name);

    // Ocultar controles al guardar
    if (scoreBtn) scoreBtn.hide();
    if (scoreInput) scoreInput.hide();

    // Redibujar ranking actualizado
    redraw?.();
}

function drawScore() {
    background(15, 20, 40);
    textAlign(CENTER, TOP);
    noStroke();

    fill(255);
    textSize(26);
    text("Tus resultados", width / 2, 40);

    textSize(16);
    fill(230);
    text(`Mes alcanzado: ${lastRun.month}`, width / 2, 90);
    text(`Dinero final: $${nf(lastRun.money, 0, 0)}`, width / 2, 114);

    fill(210);
    textSize(14);
    text("Guardá tu nombre y mirá el ranking ", width / 2, 150);
    text("¿Quién llega a fin de mes? ", width / 2, 170);
    text("ENTER = Guardar  |  R = Reintentar  |  M = Menú", width / 2, 370);

    fill(255);
    textSize(18);
    text("Ranking | Top 10", width / 2, 210);

    textAlign(LEFT, TOP);
    textSize(14);
    const leftX = width / 2 - 160;
    let y = 240;
    for (let i = 0; i < leaderboard.length; i++) {
        const r = leaderboard[i];
        const linea = `${i + 1}. ${r.name.padEnd(12, " ")}  $${nf(r.money, 0, 0)}  (Mes ${r.month})  ${r.date || ""}`;
        fill(220);
        text(linea, leftX, y);
        y += 22;
    }

    // mantiene posición/visibilidad según savedThisRun
    positionScoreUI();
}
