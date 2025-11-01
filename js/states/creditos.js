function enterCredits() {
    // Cambia el estado actual a CREDITOS
    setState(STATES.CREDITOS);

    //  Limpia pantalla
    if (typeof popups !== 'undefined') popups.length = 0;
    if (typeof falling !== 'undefined') falling.length = 0;
    if (typeof bullets !== 'undefined') bullets.length = 0;
    if (typeof enemyBullets !== 'undefined') enemyBullets.length = 0;

    inBoss = false;
    boss = null;

    // Restablece el modo de dibujo
    resetMatrix();
    blendMode(BLEND);
    noTint();

}


function drawCreditos() {
    background(20, 24, 36);
    fill(255);
    textAlign(CENTER, TOP);
    textSize(26);
    text("Créditos", width / 2, 40);

    const lines = [
        { text: "Universidad Nacional de las Artes", size: 16 },
        { text: "Área Transdepartamental de Artes Multimediales", size: 16 },
        { text: "", size: 16 },
        { text: "", size: 16 },

        // Título del juego destacado
        { text: "Llegar a fin de mes", size: 28 },

        { text: "", size: 16 },
        { text: "Estudiantes:", size: 16 },
        { text: "Camila Barbón y Javier Velichco", size: 16 },
        { text: "", size: 16 },
        { text: "", size: 16 },
        { text: "Trabajo Práctico Nº 5", size: 16 },
        { text: "Informática Aplicada I", size: 16 },
        { text: "", size: 16 },
        { text: "Cátedra Bedoian", size: 16 },
        { text: "", size: 16 },
        { text: "", size: 16 },
        { text: "Gracias por jugar", size: 16 },
    ];

    let y = 110;
    for (let i = 0; i < lines.length; i++) {
        textSize(lines[i].size);
        text(lines[i].text, width / 2, y);
        y += 24;
    }

    textSize(14);
    fill(220);
    text("ENTER para volver al Inicio", width / 2, height - 60);
}
