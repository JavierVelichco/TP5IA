// Estados
const STATES = {
    INICIO: "inicio",
    JUEGO: "juego",
    GANAR: "ganar",
    PERDER: "perder",
    CREDITOS: "creditos",
    SCORE: "score",
};
let state = STATES.INICIO;

// === AUDIO ===
function stopAllMusic() {
    if (window.musicaMenu && musicaMenu.isPlaying) {
        try { musicaMenu.stop(); } catch (e) {}
    }
    if (window.musicaJuego && musicaJuego.isPlaying) {
        try { musicaJuego.stop(); } catch (e) {}
    }
}

function setState(next) {
    state = next;

    if (state === STATES.JUEGO) {
        stopAllMusic();
        if (musicaJuego && !musicaJuego.isPlaying()) {
            musicaJuego.loop();
            musicaJuego.setVolume(0.5);
        }
    } else {
        stopAllMusic();
        if (musicaMenu && !musicaMenu.isPlaying()) {
            musicaMenu.loop();
            musicaMenu.setVolume(0.5);
        }
    }
}