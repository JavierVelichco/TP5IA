function drawPerder() {
    background(20, 25, 40);
    fill(0, 0, 0, 140); rect(0, 0, width, height);
    fill(255); textAlign(CENTER, CENTER); textSize(22);
    text("¡No llegaste a fin de mes", width / 2, height / 2 - 40);
    text("¡te endeudaste!", width / 2, height / 2 - 20);
    textSize(14);
    text("ENTER para continuar al puntaje  |  C para Créditos", width / 2, height / 2 + 50);
}
