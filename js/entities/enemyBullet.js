class EnemyBullet {
    constructor(x, y, vx = 0, vy = 4) { this.x = x; this.y = y; this.vx = vx; this.vy = vy; this.r = 8; }
    update() { this.x += this.vx; this.y += this.vy; }
    draw() { push(); translate(this.x, this.y); fill(200, 60, 60); rectMode(CENTER); rect(0, 0, this.r * 1.6, this.r * 1.6, 3); pop(); }
    offscreen() { return this.y > height + 40 || this.x < -40 || this.x > width + 40; }
    hits(p) { return dist(this.x, this.y, p.x, p.y) < (this.r + p.r); }
}
