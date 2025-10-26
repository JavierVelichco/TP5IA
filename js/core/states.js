// Estados y helper
const STATES = {
    INICIO: "inicio",
    JUEGO: "juego",
    GANAR: "ganar",
    PERDER: "perder",
    CREDITOS: "creditos",
};
let state = STATES.INICIO;

function setState(next) {
    state = next;
}
