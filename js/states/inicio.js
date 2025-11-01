// === CanvasDropdown: menú desplegable dibujado en p5 (abre hacia ARRIBA) ===
class CanvasDropdown {
    constructor({ x, y, w, h, options, value, onChange }) {
        this.x = x; this.y = y; this.w = w; this.h = h;
        this.options = options;                 // [{label, value}]
        this.open = false;
        this.hoverIndex = -1;
        this.onChange = typeof onChange === "function" ? onChange : () => { };
        // selectedIndex según 'value' inicial
        this.selectedIndex = Math.max(0, options.findIndex(o => o.value === value));
    }

    setPosition(x, y) { this.x = x; this.y = y; }

    get value() { return this.options[this.selectedIndex]?.value; }
    get label() { return this.options[this.selectedIndex]?.label || ""; }

    draw() {
        push(); // ← guarda estado de estilos (fill, textAlign, textSize, etc.)

        // caja principal
        noStroke();
        fill(60, 120, 220);
        rect(this.x, this.y, this.w, this.h, 8);

        // etiqueta seleccionada
        fill(255);
        textAlign(LEFT, CENTER);
        textSize(14);
        text(this.label, this.x + 10, this.y + this.h / 2);

        // caret: ▲ si abierto, ▼ si cerrado
        textAlign(RIGHT, CENTER);
        text(this.open ? "▲" : "▼", this.x + this.w - 10, this.y + this.h / 2);

        if (this.open) {
            // === LISTA HACIA ARRIBA ===
            const itemH = this.h;
            const listH = itemH * this.options.length;
            const listY = this.y - listH; // se dibuja por encima

            // fondo lista
            fill(45, 80, 160);
            rect(this.x, listY, this.w, listH, 8);

            // ítems
            textAlign(LEFT, CENTER);
            textSize(14);
            for (let i = 0; i < this.options.length; i++) {
                const iy = listY + i * itemH;
                if (i === this.hoverIndex) {
                    fill(70, 130, 230);
                    rect(this.x, iy, this.w, itemH);
                }
                fill(255);
                text(this.options[i].label, this.x + 10, iy + itemH / 2);
            }
        }

        pop(); // ← restaura el estado anterior (textAlign, textSize, fill, etc.)
    }

    // devuelve true si consumió el clic (para cortar flujo)
    handleMousePressed(mx, my) {
        // clic en caja principal
        if (this._inside(mx, my, this.x, this.y, this.w, this.h)) {
            this.open = !this.open;
            this.hoverIndex = -1;
            return true;
        }

        if (this.open) {
            const itemH = this.h;
            const listH = itemH * this.options.length;
            const listY = this.y - listH; // lista arriba

            // clic en la lista
            for (let i = 0; i < this.options.length; i++) {
                const iy = listY + i * itemH;
                if (this._inside(mx, my, this.x, iy, this.w, itemH)) {
                    this.selectedIndex = i;
                    this.open = false;
                    this.hoverIndex = -1;
                    this.onChange(this.options[i]); // notifica
                    return true;
                }
            }

            // clic fuera: cerrar **y consumir** el clic para que no dispare JUGAR
            const insideList = this._inside(mx, my, this.x, listY, this.w, listH);
            const insideBox = this._inside(mx, my, this.x, this.y, this.w, this.h);
            if (!insideList && !insideBox) {
                this.open = false;
                this.hoverIndex = -1;
                return true; // consumir el clic
            }
        }

        return false;
    }

    handleMouseMoved(mx, my) {
        if (!this.open) return false;
        const itemH = this.h;
        const listH = itemH * this.options.length;
        const listY = this.y - listH; // lista arriba

        this.hoverIndex = -1;
        for (let i = 0; i < this.options.length; i++) {
            const iy = listY + i * itemH;
            if (this._inside(mx, my, this.x, iy, this.w, itemH)) {
                this.hoverIndex = i;
                return true;
            }
        }
        return false;
    }

    _inside(mx, my, x, y, w, h) {
        return mx >= x && mx <= x + w && my >= y && my <= y + h;
    }
}


function drawInicio() {
    background(30, 40, 70);
    fill(255);
    textAlign(CENTER, CENTER);

    // Título
    textSize(28);
    text("Llegar a fin de mes", width / 2, 70);

    // Subtítulo 
    textSize(14);
    text("Tratá de sobrevivir con...", width / 2, 110);
    text("un Salario Mínimo Vital y Móvil argentino.", width / 2, 135);
    text("Esquivá gastos y enfrentá al jefe a fin de mes.", width / 2, 160);

    // Controles 
    text("Mover: Flechas o WASD  •  Disparar al jefe: Z o J", width / 2, 200);
    text("Objetivo: Sobrevivir sin deudas", width / 2, 230);

    // Indicaciones
    text("Elegí la dificultad:", width / 2, 270);


    // Mostrar dropdown dentro del canvas
    ensureDiffDropdown();
    diffDropdown.draw();

    // --- Botón JUGAR ---
    const btnY = 360; // si querés proporcional, podés usar Math.round(height * 0.60)
    startBtn.x = width / 2 - startBtn.w / 2;
    startBtn.y = btnY;

    const hover = mouseX >= startBtn.x && mouseX <= startBtn.x + startBtn.w &&
        mouseY >= startBtn.y && mouseY <= startBtn.y + startBtn.h;

    noStroke();
    fill(hover ? 80 : 60, 120, 220);
    rect(startBtn.x, startBtn.y, startBtn.w, startBtn.h, 10);

    fill(255);
    textSize(18);
    text("JUGAR", width / 2, btnY + startBtn.h / 2);

    // Atajos
    textSize(13);
    text("ENTER para comenzar • C para Créditos", width / 2, btnY + 90);
}



// Opciones de dificultad
const DIFF_OPTIONS = [
    { label: "Argento", value: "facil" },
    { label: "Normal", value: "normal" },
    { label: "Difícil", value: "dificil" },
];

let diffDropdown = null;

function ensureDiffDropdown() {
    if (!diffDropdown) {
        diffDropdown = new CanvasDropdown({
            x: 0, y: 300, w: 220, h: 36,
            options: DIFF_OPTIONS,
            value: CURRENT_DIFF,
            onChange: (opt) => {
                setDifficulty(opt.value);
                redraw(); // actualizar pantalla ya que usás noLoop()
            }
        });
    }
    diffDropdown.setPosition(width / 2 - diffDropdown.w / 2, 300);
}

function cycleDifficulty(dir) {
    const n = DIFF_OPTIONS.length;
    let idx = DIFF_OPTIONS.findIndex(o => o.value === CURRENT_DIFF);
    if (idx < 0) idx = 0;
    idx = (idx + dir + n) % n;

    setDifficulty(DIFF_OPTIONS[idx].value);   // aplica el preset
    if (typeof diffDropdown !== "undefined" && diffDropdown) {
        diffDropdown.selectedIndex = idx;       // sincroniza UI del desplegable
        diffDropdown.open = false;              // opcional: cerrar si estaba abierto
    }
    redraw(); // porque usás noLoop()
}
