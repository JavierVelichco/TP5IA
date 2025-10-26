class Boss {
    constructor({ hp, img, w = 100, h = 80, r = 50, speed = 2, shotInterval = 600, pattern = "single" }) {
        this.hp = hp; this.maxHp = hp; this.img = img;
        this.w = w; this.h = h; this.r = r;
        this.x = width / 2; this.y = 80; this.dir = 1;
        this.speed = speed; this.lastShot = 0; this.shotInterval = shotInterval;
        this.pattern = pattern; this.flashTimer = 0;
    }

    update() {
        this.x += this.dir * this.speed;
        if (this.x < 60 + this.r) { this.dir = 1; this.x = 60 + this.r; }
        if (this.x > width - 60 - this.r) { this.dir = -1; this.x = width - 60 - this.r; }
        this.y = 70 + sin(millis() / 800) * 8;
        if (this.flashTimer > 0) this.flashTimer--;
    }

    draw() {
        push(); translate(this.x, this.y);
        if (this.img) {
            imageMode(CENTER);
            if (this.flashTimer > 0) { push(); tint(255, 200); image(this.img, 0, 0, this.w, this.h); pop(); }
            else image(this.img, 0, 0, this.w, this.h);
        } else {
            fill(60, 60, 80); rectMode(CENTER); rect(0, 0, this.r * 2, this.r * 1.4, 8); fill(200, 80, 80); ellipse(-14, -6, 14, 12);
        }
        let pct = constrain(this.hp / this.maxHp, 0, 1);
        rectMode(CENTER); fill(200); rect(0, -this.r - 16, this.w + 20, 10, 5);
        rectMode(CORNER); fill(80, 200, 100);
        const bw = (this.w + 20) * pct; rect(-(this.w + 20) / 2, -this.r - 21, bw, 10, 5);
        pop();
    }

    flash() { this.flashTimer = 8; }

    maybeShoot() {
        if (millis() - this.lastShot <= this.shotInterval) return;
        this.lastShot = millis();
        if (this.pattern === "single") {
            const vx = random(-1.2, 1.2);
            enemyBullets.push(new EnemyBullet(this.x, this.y + this.h / 2, vx, 4.2));
        } else if (this.pattern === "spread3") {
            for (let dvx of [-1.8, 0, 1.8]) enemyBullets.push(new EnemyBullet(this.x, this.y + this.h / 2, dvx, 4.2));
        } else if (this.pattern === "burst") {
            for (let i = 0; i < 5; i++) {
                const vx = random(-2.2, 2.2);
                enemyBullets.push(new EnemyBullet(this.x + random(-16, 16), this.y + this.h / 2, vx, 4.6 + random(0, 0.8)));
            }
        }
    }
}

function createBossForMonth(monthIndex, baseHp) {
    if (monthIndex === 0) {
        return new Boss({ hp: baseHp, img: imagenes["impuestos"], w: 96, h: 72, r: 48, speed: 2.0, shotInterval: 650, pattern: "single" });
    } else if (monthIndex === 1) {
        return new Boss({ hp: baseHp + 120, img: imagenes["navidad"], w: 108, h: 80, r: 54, speed: 2.3, shotInterval: 520, pattern: "spread3" });
    } else {
        return new Boss({ hp: baseHp + 240, img: imagenes["alquiler"], w: 120, h: 88, r: 60, speed: 2.6, shotInterval: 420, pattern: "burst" });
    }
}
