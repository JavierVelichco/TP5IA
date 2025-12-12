// Config y variables globales, elementos de interfaz.
let musicaMenu = null;
let musicaJuego = null;

const SUELDO = 322200;
let money = SUELDO;

const MONTHS = ["Noviembre", "Diciembre"];
const MONTH_DURATION_MS = 45 * 1000;
const BOSS_DURATION_MS = 25 * 1000;
const TOTAL_MONTHS = MONTHS.length;

let monthIndex = 0;
let monthStartTime = 0;
let inBoss = false;
let bossStartTime = 0;
let postBossCooldown = 0;
let boss = null;
let gameOver = false;
let victory = false;

let player;
let falling = [];
let bullets = [];
let enemyBullets = [];
let buildings = [];
let startTimeGlobal;

// Balance
const BASE_SPAWN_PROB = 0.018;
const BASE_SPEED = 2.5;
const INCOME_PERCENT = 0.01;
const GASTO_CHICO_PCT = 0.01;
const GASTO_MED_PCT = 0.03;
const GASTO_GRANDE_PCT = 0.06;

let SHOT_COST = 2000;
const BULLET_DAMAGE = 40;
let ENEMY_HIT_COST = 5000;
let BOSS_BASE_HP = 1200;

let imagenes = {};
let playerImg;

