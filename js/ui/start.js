
(function () {
    const intro = document.getElementById("intro");
    const startBtn = document.getElementById("startBtn");

    // Ocultar el canvas hasta que comience
    window.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
            const cnv = document.querySelector("canvas");
            if (cnv) cnv.style.display = "none";
        }, 300);
    });

    // Al iniciar: mostrar canvas, ocultar intro y arrancar juego
    if (startBtn) {
        startBtn.addEventListener("click", () => {
            const cnv = document.querySelector("canvas");
            if (cnv) cnv.style.display = "block";
            if (intro) intro.style.display = "none";
            if (window.setState) setState(STATES.JUEGO);
            if (window.startGame) window.startGame();
            if (window.loop) loop(); 
        });
    }
})();
