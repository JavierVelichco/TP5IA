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

    textSize(16);
    const lines = [

        "Universidad Nacional de las Artes",
        "Área Transdepartamental de Artes Multimediales",
        "",
        "",
        "Llegar a finde mes",
        "",
        "Estudiantes:",
        "Camila Barbón y Javier Velichco",
        "",
        "",
        "Trabajo Práctico Nº 5 - ",
        "Informática Aplicada I",

        "Cátedra Bedoian",
        "",
        "",
        "Gracias por jugar",
    ];
    let y = 110;
    for (let i = 0; i < lines.length; i++) {
        text(lines[i], width / 2, y + i * 26);
    }

    textSize(14);
    fill(220);
    text("ENTER para volver al Inicio", width / 2, height - 60);
}
