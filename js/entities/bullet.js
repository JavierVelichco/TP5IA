class Bullet {
    constructor(x, y) { this.x = x; this.y = y; this.vy = -9; this.r = 6; this.damage = BULLET_DAMAGE; }
    update() { this.y += this.vy; }
    draw() { push(); translate(this.x, this.y); fill(255, 230, 100); ellipse(0, 0, this.r * 2); pop(); }
    offscreen() { return this.y < -20; }
    hitsBoss(b) { if (!b) return false; return dist(this.x, this.y, b.x, b.y) < (this.r + b.r); }
}
