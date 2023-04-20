// Some of this may be redudant code

function parse(data) {
    if (data.map === 'Tutorial') data.map = 'MonkeyMeadow';
    if (data.map === 'TownCentre') data.map = 'TownCenter';
    data.map = data.map.replace(/([A-Z])/g, ' $1').trim();
    if (data.mode === 'Clicks') data.mode = 'Chimps';
    if (data.startingCash.toLocaleString('en-US') === -1) {
        data.startingCash.toLocaleString('en-US') = 650;
        if (data.mode === 'Deflation') data.startingCash.toLocaleString('en-US') = 20000;
    }
    if (data.lives === -1) {
        if (data.difficulty === 'Easy') data.lives = 200;
        if (data.difficulty === 'Medium') data.lives = 150;
        if (data.difficulty === 'Hard') data.lives = 100;
        if (data.mode === 'Impoppable' || data.mode === 'Chimps') data.lives = 1;
    }
    if (data.maxLives === -1) data.maxLives = 5000;
    if (data.lives > data.maxLives) data.lives = data.maxLives;
    if (data.startRound === -1) {
        data.startRound = 1;
        if (data.difficulty === 'Hard') data.startRound = 3;
        if (data.mode === 'Impoppable' || data.mode === 'Chimps') data.startRound = 6;
        if (data.mode === 'Deflation') data.startRound = 31;
    }
    if (data.endRound === -1) {
        if (data.difficulty === 'Easy') data.endRound = 40;
        if (data.difficulty === 'Medium') data.endRound = 60;
        if (data.difficulty === 'Hard') data.endRound = 80;
        if (data.mode === 'Deflation') data.endRound = 60;
        if (data.mode === 'Impoppable' || data.mode === 'Chimps') data.endRound = 100;
    }
    data.speedMultiplier = data._bloonModifiers.speedMultiplier;
    data.moabSpeedMultiplier = data._bloonModifiers.moabSpeedMultiplier;
    data.bossSpeedMultiplier = data._bloonModifiers.bossSpeedMultiplier;
    data.healthMultiplier = data._bloonModifiers.healthMultipliers.bloons;
    data.moabHealthMultiplier = data._bloonModifiers.healthMultipliers.moabs;
    data.bossHealthMultiplier = data._bloonModifiers.healthMultipliers.boss;
    data.abilityCooldownReductionMultiplier = data.abilityCooldownReductionMultiplier;
    data.allCamo = data._bloonModifiers.allCamo;
    data.allRegen = data._bloonModifiers.allRegen;
    delete data._bloonModifiers;
    parseTowers(data);
    return data;
}

function parseTowers(data) {
    data._availableTowers ? data._towers = data._availableTowers : data._towers;
    data.towers = {};
    data.towers.heroes = data._towers.filter(tower => tower.isHero === true && tower.max > 0).map(tower => tower.tower.replace(/([A-Z])/g, ' $1').replace('Admiral', '').replace('Captain', '').trim(),);
    data._towers = data._towers
        .filter(tower => tower.isHero === false && tower.max !== 0)
        .map(tower => {
            return {
                tower: tower.tower.replace(/([A-Z])/g, ' $1').replace('Monkey', '').replace('Tower', '').replace('Shooter', '').replace('Gunner', '').replace('Pilot', '').replace('Banana', '').replace('Buccaneer', 'Boat').trim(),
                max: tower.max,
                path1: tower.path1NumBlockedTiers === -1 ? 0 : 5 - tower.path1NumBlockedTiers,
                path2: tower.path2NumBlockedTiers === -1 ? 0 : 5 - tower.path2NumBlockedTiers,
                path3: tower.path3NumBlockedTiers === -1 ? 0 : 5 - tower.path3NumBlockedTiers,
            }
        })
    data.towers.primary = data._towers.filter(tower => ['Dart', 'Boomerang', 'Bomb Tower', 'Tack', 'Ice', 'Glue'].includes(tower.tower));
    data.towers.military = data._towers.filter(tower => ['Sniper', 'Sub', 'Boat', 'Ace', 'Heli', 'Mortar', 'Dartling'].includes(tower.tower));
    data.towers.magic = data._towers.filter(tower => ['Wizard', 'Super', 'Ninja', 'Alchemist', 'Druid'].includes(tower.tower));
    data.towers.support = data._towers.filter(tower => ['Farm', 'Spike Factory', 'Village', 'Engineer', 'Beast Handler'].includes(tower.tower));
    delete data.towers._towers;
    return data;
}

module.exports = {
    parse,
    parseTowers
}