class Player {
    constructor(x = width / 2, y = height - 70) {
        this.x = x; this.y = y;
        this.w = 84; this.h = 62; this.r = 40;
        this.speed = 4.5;
        this.vx = 0; this.vy = 0;
        this.miraDerecha = true;
        this.bumpTimer = 0;
        this.turbo = 0;
        this.img = playerImg;
    }

    update() {
        const acc = (keyIsDown(SHIFT) || this.turbo > 0) ? 1.6 : 1.0;
        this.vx = (keyIsDown(LEFT_ARROW) || keyIsDown(65)) ? -this.speed * acc :
            (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) ? this.speed * acc : 0;
        this.vy = (keyIsDown(UP_ARROW) || keyIsDown(87)) ? -this.speed * acc :
            (keyIsDown(DOWN_ARROW) || keyIsDown(83)) ? this.speed * acc : 0;

        if (this.vx > 0) this.miraDerecha = true;
        else if (this.vx < 0) this.miraDerecha = false;

        this.x = constrain(this.x + this.vx, 60 + this.r, width - 60 - this.r);
        this.y = constrain(this.y + this.vy, 180, height - 40);

        if (this.bumpTimer > 0) this.bumpTimer--;
        if (this.turbo > 0) this.turbo--;
    }

    draw() {
        push();
        translate(this.x, this.y);
        scale(this.miraDerecha ? 1 : -1, 1);

        noStroke(); fill(0, 0, 0, 40); ellipse(0, 18, 32, 10);

        if (this.img) {
            imageMode(CENTER);
            if (this.bumpTimer > 0) { push(); tint(255, 200); image(this.img, 0, 0, this.w, this.h); pop(); }
            else image(this.img, 0, 0, this.w, this.h);
        }

        if (this.bumpTimer > 0) { stroke(255, 120, 120); noFill(); ellipse(0, 0, this.w + 8, this.h + 8); }
        pop();
    }

    bump() { this.bumpTimer = 18; }
}
