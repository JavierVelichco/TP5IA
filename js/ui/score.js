// === SCORE / RANKING ===
let scoreInput = null, scoreBtn = null;
let leaderboard = [];
let lastRun = { money: 0, month: 0 };
let savedThisRun = false; // evita múltiples guardados por partida

const SCORE_KEY = "finDeMes_scores_v1"; // localStorage

function loadScores() {
    try {
        const raw = localStorage.getItem(SCORE_KEY);
        leaderboard = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(leaderboard)) leaderboard = [];
    } catch { leaderboard = []; }
}

function saveScores() {
    try { localStorage.setItem(SCORE_KEY, JSON.stringify(leaderboard)); } catch { }
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
    scoreInput.attribute("maxlength", "18");
    scoreInput.attribute("placeholder", "Tu nombre");
    scoreInput.style("padding", "8px 10px");
    scoreInput.style("border-radius", "8px");
    scoreInput.style("border", "1px solid #8aa");
    scoreInput.style("font-size", "14px");
    scoreInput.style("box-shadow", "0 1px 4px rgba(0,0,0,0.15)");
    scoreInput.style("background", "#fff");
    scoreInput.style("color", "#000");
    scoreInput.style("pointer-events", "auto");
    scoreInput.elt?.removeAttribute("readonly");
    scoreInput.value(""); // limpiar nombre previo

    // Estilos base del botón
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

    // Mostrar/posicionar controles
    positionScoreUI();

    // Enfocar input
    if (scoreInput?.elt) {
        scoreInput.show();
        scoreInput.elt.focus();
        const v = scoreInput.value();
        try { scoreInput.elt.setSelectionRange(v.length, v.length); } catch { }
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

    // reposicionar
    scoreInput.size(inputW, inputH);
    scoreInput.position(inputX, inputY);

    const btnX = p.x + (width - btnW) / 2;
    const btnY = inputY + inputH + gapY;
    scoreBtn.size(btnW, btnH);
    scoreBtn.position(btnX, btnY);

    // mostrar/ocultar según si ya se guardó
    if (!savedThisRun) {
        scoreInput.show();
        scoreBtn.show();
    } else {
        scoreInput.hide();
        scoreBtn.hide();
    }
}

function hideScoreUI() {
    if (scoreInput?.elt) scoreInput.elt.blur();
    if (scoreInput) scoreInput.hide();
    if (scoreBtn) scoreBtn.hide();
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
        const isBetter = (incoming.money > cur.money) ||
            (incoming.money === cur.money && incoming.month > cur.month);
        if (isBetter) leaderboard[idx] = incoming;
    } else {
        leaderboard.push(incoming);
    }

    leaderboard.sort((a, b) => (b.money - a.money) || (b.month - a.month));
    leaderboard = leaderboard.slice(0, 10);
    saveScores();

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
    text("Resultados", width / 2, 40);

    textSize(16);
    fill(230);
    text(`Mes alcanzado: ${lastRun.month}`, width / 2, 90);
    text(`Dinero final: $${nf(lastRun.money, 0, 0)}`, width / 2, 114);

    fill(210);
    textSize(14);
    text("Escribe tu nombre y presiona Guardar", width / 2, 150);
    text("ENTER = Guardar  •  R = Reintentar  •  M = Menú", width / 2, 170);

    fill(255);
    textSize(18);
    text("Ranking (Top 10)", width / 2, 210);

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
