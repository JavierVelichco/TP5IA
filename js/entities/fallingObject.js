class FallingObject {
    constructor(kind, speedMultiplier = 1, diff = 1) {
        this.kind = kind;
        this.x = random(70, width - 70);
        this.y = -random(20, 120);
        this.d = random(22, 36);
        this.isExpense = (kind !== "ingreso");

        if (!this.isExpense) {
            // INGRESOS
            this.sub = random() < 0.7 ? "billete" : "masbillete";
            this.v = (this.sub === "billete" ? random(2.2, 3.4) : random(2.4, 3.6)) * speedMultiplier;
            this.swayAmp = 0.15;
            this.col = color(90, 200, 110);

            // el valor del ingreso disminuye levemente a medida que aumenta la dificultad (diff)
            const incomeFactor = map(diff, 1, 10, 1.0, 0.5, true);
            this.value = int(SUELDO * INCOME_PERCENT * random(0.8, 1.3) * incomeFactor);
            this.icon = "💵";
            this.imgKey = this.sub; // "billete" o "masbillete"
        } else {
            // GASTOS: caen más rápido, son más variados y aumentan con la dificultad
            this.v = (random(2.4, 3.4) + diff * 0.4) * speedMultiplier;
            this.swayAmp = 0.8;

            // los tipos de gasto se eligen al azar, pero el valor crece con diff
            let r = random(1);
            if (r < 0.5) {
                // gastos chicos (cafecito, comida rápida, transporte, etc.)
                this.kind = "gasto_chico";
                this.col = color(255, 120, 120);
                this.value = -int(SUELDO * GASTO_CHICO_PCT * random(0.5, 1.8) * (1 + diff * 0.05));
                this.icon = random(["🍔", "☕", "🎟️", "🍞"]);
            } else if (r < 0.85) {
                // gastos medianos (servicios, comidas, salidas)
                this.kind = "gasto_med";
                this.col = color(230, 80, 80);
                this.value = -int(SUELDO * GASTO_MED_PCT * random(0.8, 2.4) * (1 + diff * 0.08));
                this.icon = random(["🍕", "🍻", "🧾", "📱"]);
            } else {
                // gastos grandes (alquiler, auto, cuentas importantes)
                this.kind = "gasto_grande";
                this.col = color(200, 30, 30);
                this.value = -int(SUELDO * GASTO_GRANDE_PCT * random(1.5, 3.5) * (1 + diff * 0.12));
                this.icon = random(["🏠", "🚗", "💡", "🧰"]);
                this.d *= 1.3;
            }

            this.imgKey = this.kind;
        }

        // se vincula la imagen correspondiente desde preload()
        this.img = imagenes[this.imgKey] || null;
    }

    update() {
        this.y += this.v;
        if (this.swayAmp && this.swayAmp > 0) {
            this.x += sin(frameCount * 0.03 + this.y * 0.02) * this.swayAmp;
            this.x = constrain(this.x, 60 + this.d * 0.5, width - 60 - this.d * 0.5);
        }
    }

    draw() {
        push();
        translate(this.x, this.y);
        imageMode(CENTER);
        noStroke();

        // Si hay imagen, dibuja; si no, usa emoji
        if (this.img) {
            push();
            let w, h;

            if (this.imgKey.includes("billete")) {
                // 💸 billetes: forma rectangular y bamboleo
                rotate(sin(frameCount * 0.05 + this.y * 0.02) * 0.2);
                w = this.d * 1.6;
                h = this.d * 0.8;
            } else if (this.imgKey === "gasto_chico" || this.imgKey === "gasto_med") {
                // 🍔🍕 un poco más grandes
                w = this.d * 1.3;
                h = this.d * 1.3;
            } else if (this.imgKey === "gasto_grande") {
                // 💡 focos o elementos grandes un poquito más destacados
                w = this.d * 1.4;
                h = this.d * 1.4;
            } else {
                // cualquier otro objeto
                w = this.d;
                h = this.d;
            }

            image(this.img, 0, 0, w, h);
            pop();
        } else {
            textAlign(CENTER, CENTER);
            textSize(18);
            text(this.icon, 0, -2);
        }

        // Valor en $ debajo
        fill(255);
        textAlign(CENTER, TOP);
        textSize(10);
        const sign = (this.value > 0 ? "+" : "-");
        text(`${sign}$${nf(int(abs(this.value)), 0, 0)}`, 0, this.d / 2 + 10);
        pop();
    }

    hits(p) {
        return dist(this.x, this.y, p.x, p.y) < (this.d / 2 + p.r);
    }
}
