let popups = [];
function floatingPopup(x, y, txt, colr) {
    if (state !== STATES.JUEGO) return;
    popups.push({ x, y, txt, col: colr, life: 80 });
}


function updatePopups() {
    // si no estamos jugando, no mostrar ni actualizar
    if (state !== STATES.JUEGO) return;
    for (let i = popups.length - 1; i >= 0; i--) {
        let p = popups[i]; p.y -= 0.6; p.life--;
        push(); textSize(14); textAlign(CENTER, CENTER); fill(p.col); text(p.txt, p.x, p.y); pop();
        if (p.life <= 0) popups.splice(i, 1);
    }
}
