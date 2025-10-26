function drawCity() {
    fill(220); rect(0, 0, 60, height); rect(width - 60, 0, 60, height);
    for (let b of buildings) { b.update(); b.draw(); }
    fill(50); rect(60, 0, width - 120, height);
    noStroke(); fill(255, 255, 0);
    let gap = 60, segH = 30, offset = (millis() / 10) % (gap + segH);
    for (let y = -segH; y < height + segH; y += gap + segH) rect(width / 2 - 3, y + offset, 6, segH);
}
