class Building {
    constructor(side, idx) { this.side = side; this.idx = idx; this.reset(); }
    reset() {
        this.w = 40; this.h = random(80, 260);
        this.x = this.side === "left" ? 10 : width - 50;
        this.y = random(-600, height);
        const g = int(random(180, 240));
        this.col = color(g, g, g + random(-10, 10));
        this.winCols = 2; this.winRows = int(this.h / 30); this.windows = [];
        for (let r = 0; r < this.winRows; r++) for (let c = 0; c < this.winCols; c++)
            this.windows.push({ colOn: color(255, 220, 120), colOff: color(80, 80, 80), on: random() < 0.2, timer: int(random(200, 2000)) });
        this.lastToggle = millis(); this.toggleInterval = int(random(300, 1200));
    }
    update() {
        this.y += 1.8; if (this.y > height + this.h) this.reset();
        let now = millis();
        if (now - this.lastToggle > this.toggleInterval) {
            for (let w of this.windows) {
                if (random(1) < 0.25) w.on = !w.on; else if (random(1) < 0.05) w.on = true;
            }
            this.lastToggle = now; this.toggleInterval = int(random(300, 1400));
        }
    }
    draw() {
        fill(this.col); rect(this.x, this.y - this.h, this.w, this.h);
        let idx = 0, padX = 6, padY = 8, wx = (this.w - padX * 2) / this.winCols, wy = 12;
        for (let r = 0; r < this.winRows; r++) for (let c = 0; c < this.winCols; c++) {
            let px = this.x + padX + c * wx + wx / 2 - 5;
            let py = this.y - this.h + padY + r * (wy + 6);
            let wobj = this.windows[idx]; fill(wobj.on ? wobj.colOn : wobj.colOff);
            rect(px, py, 10, wy, 2); idx++; if (idx >= this.windows.length) return;
        }
    }
}
