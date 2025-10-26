const DIFFICULTY_PRESETS = {
    facil: { spawnMul: 0.85, speedAdd: -0.25, shotCostMul: 0.75, enemyHitCostMul: 0.7, bossHpMul: 0.9 },
    normal: { spawnMul: 1.00, speedAdd: 0.00, shotCostMul: 1.00, enemyHitCostMul: 1.0, bossHpMul: 1.0 },
    dificil: { spawnMul: 1.25, speedAdd: +0.30, shotCostMul: 1.15, enemyHitCostMul: 1.25, bossHpMul: 1.2 },
};

let CURRENT_DIFF = "normal";
let _diffCfg = DIFFICULTY_PRESETS.normal;

function setDifficulty(name = "normal") {
    if (!DIFFICULTY_PRESETS[name]) name = "normal";
    CURRENT_DIFF = name;
    _diffCfg = DIFFICULTY_PRESETS[name];
    SHOT_COST = Math.round(2000 * _diffCfg.shotCostMul);
    ENEMY_HIT_COST = Math.round(5000 * _diffCfg.enemyHitCostMul);
}

function difficultyFactor(elapsedMs) {
    const monthFactor = 1 + monthIndex * 0.2;
    const timeFactor = 1 + Math.floor((elapsedMs / 1000) / 20) * 0.15;
    return monthFactor * timeFactor;
}
