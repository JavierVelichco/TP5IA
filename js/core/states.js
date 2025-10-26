// Estados y helper
const STATES = {
    INICIO: "inicio",
    JUEGO: "juego",
    GANAR: "ganar",
    PERDER: "perder",
    CREDITOS: "creditos",
    SCORE: "score",
};
let state = STATES.INICIO;

function setState(next) {
    state = next;
}
