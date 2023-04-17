function parseModifiers(data, defaultRoundSetLength = 1) {
    const description = [];
    if (data.roundSets?.length > defaultRoundSetLength) description.push('Custom Rounds!');
    if (data.maxParagons > 0 && data.maxParagons !== 4 && data.maxParagons <= 6) description.push(`${data.maxParagons} Paragon Limit`);
    if (data.disableSelling == true) description.push('<:selling:947206526018387999> Selling Disabled');
    if (data.disableMK == true) description.push('<:knowledge:947206527721291786> Knowledge Disabled');
    if (data.allCamo == true) description.push('<:camo:947206526765002843> All Camo');
    if (data.allRegen == true) description.push('<:regrow:947206530162376804> All Regrow ');
    if (data.bossSpeedMultiplier < 1) description.push(`<:slowmoabs:947454215587000340> ${+data.bossSpeedMultiplier * 100}% Boss Speed`);
    if (data.bossSpeedMultiplier > 1) description.push(`<:fastmoabs:947454219907125258> ${+data.bossSpeedMultiplier * 100}% Boss Speed`);
    if (data.speedMultiplier < 1) description.push(`<:slowbloons:947454221903613982> ${+data.speedMultiplier * 100}% Bloon Speed`);
    if (data.speedMultiplier > 1) description.push(`<:fastbloons:947454217566715944> ${+data.speedMultiplier * 100}% Bloon Speed`);
    if (data.moabSpeedMultiplier < 1) description.push(`<:slowmoabs:947454215587000340> ${+data.moabSpeedMultiplier * 100}% Moab Speed`);
    if (data.moabSpeedMultiplier > 1) description.push(`<:fastmoabs:947454219907125258> ${+data.moabSpeedMultiplier * 100}% Moab Speed`);
    if (data.healthMultiplier < 1) description.push(`<:lowceramichp:947456989150199859> ${+data.healthMultiplier * 100}% Ceramic Health`);
    if (data.healthMultiplier > 1) description.push(`<:highceramichp:947456989208932382> ${+data.healthMultiplier * 100}% Ceramic Health`);
    if (data.moabHealthMultiplier < 1) description.push(`<:lowmoabhp:947459371154178098> ${+data.moabHealthMultiplier * 100}% Moab Health`);
    if (data.moabHealthMultiplier > 1) description.push(`<:highmoabhp:947459368473989130> ${+data.moabHealthMultiplier * 100}% Moab Health`);
    if (data.regrowRateMultiplier < 1) description.push(`<:slowerregrow:947460169372143686> ${+data.regrowRateMultiplier * 100}% Regrow Rate`);
    if (data.regrowRateMultiplier > 1) description.push(`<:fasterregrow:947460169699307520> ${+data.regrowRateMultiplier * 100}% Regrow Rate`);
    if (data.abilityCooldownReductionMultiplier < 1) description.push(`<:fastercooldown:947462092661862420> ${+data.abilityCooldownReductionMultiplier * 100}% Ability Cooldown`);
    if (data.abilityCooldownReductionMultiplier > 1) description.push(`<:slowercooldown:947462070721454160> ${+data.abilityCooldownReductionMultiplier * 100}% Ability Cooldown`);
    if (data.removeableCostMultiplier == 0) description.push(`<:decreasedremoval:947462619835535451> Free Removal`);
    if (data.removeableCostMultiplier == 12) description.push(`<:increasedremoval:947462621060280330> Removal Disabled`);
    if (data.removeableCostMultiplier < 1 && data.removeableCostMultiplier > 0) description.push(`<:increasedremoval:947462621060280330> ${+data.removeableCostMultiplier * 100}% Removal Cost`);
    if (data.removeableCostMultiplier > 1 && data.removeableCostMultiplier < 12) description.push(`<:decreasedremoval:947462619835535451> ${+data.removeableCostMultiplier * 100}% Removal Cost`);
    if (data.leastCashUsed > -1) description.push(`<:LeastCashIcon:964440130221928498> $${data.leastCashUsed} Cash Limit`);
    if (data.leastTiersUsed > -1) description.push(`<:LeastTiersIcon:964440130481963048> ${data.leastTiersUsed} Tier Limit`);
    return description;
};

function parseMode(data) {
    let mode = ''
    switch (data.mode) {
        case 'Deflation':
            mode = 'https://i.gyazo.com/692f69b2239e6e7c58530d24e05e50f1.png';
            break;
        case 'Reverse':
            mode = 'https://i.gyazo.com/fad8916ca6638c5f8ccacc0c3c89aa48.png';
            break;
        case 'Apopalypse':
            mode = 'https://i.gyazo.com/fa276e92d0827bc2032f21f1a5cc6f29.png';
            break;
        case 'DoubleMoabHealth':
            mode = 'https://i.gyazo.com/c0639b69078970041dee23d92daf0b13.png';
            break;
        case 'HalfCash':
            mode = 'https://i.gyazo.com/50a88ece1c58ae5ee742a4672a5559bf.png';
            break;
        case 'AlternateBloonsRounds':
            mode = 'https://i.gyazo.com/d7bba9962f2d1307a316aa2eebfcd8e9.png';
            break;
        case 'Impoppable':
            mode = 'https://i.gyazo.com/7b7f57b101cdc8c682d1c5c3654687df.png';
            break;
        case 'Chimps':
            mode = 'https://i.gyazo.com/e739a2ca6afcd40dd20c099d226b31fd.png';
            break;
        default:
            mode = 'https://i.gyazo.com/f3d3fb46de3c4c6f791cd1b6fe9b60dd.png';
    };
    return mode;
};

function parseDifficulty(data) {
    let difficulty = '';
    switch (data.difficulty) {
        case 'Easy':
            difficulty = 'https://i.gyazo.com/fa0dc0d42855ce8fc7920eec06ede956.png';
            break;
        case 'Medium':
            difficulty = 'https://i.gyazo.com/08e5b02e88d6d4c50e75d6e433db359d.png';
            break;
        case 'Hard':
            difficulty = 'https://i.gyazo.com/6e6137d23ad90d5df01ddd4baf1ac36e.png';
            break;
    }
    return difficulty;
};

function pushTower(array, { tower: name, max, path1, path2, path3 }) {
    let upgrades = '';
    if (max > -1) {
        max = `${max}x `;
    } else {
        max = ``;
    }
    if (path1 + path2 + path3 !== 15) upgrades = ` (${path1}-${path2}-${path3})`;
    array.push(`${max}${name}${upgrades}`);
};

function parseTowerSets(data) {

    let towers = [];
    if (data.towers.heroes.length > 0) towers.push({ name: 'Heroes', value: data.towers.heroes.join(', ') });
    let primaryTowers = [];
    let militaryTowers = [];
    let magicTowers = [];
    let supportTowers = [];

    for (tower of data.towers.primary) {
        pushTower(primaryTowers, tower);
    }
    for (tower of data.towers.military) {
        pushTower(militaryTowers, tower);
    }
    for (tower of data.towers.magic) {
        pushTower(magicTowers, tower);
    }
    for (tower of data.towers.support) {
        pushTower(supportTowers, tower);
    }
    if (data.towers.primary.length) towers.push({ name: 'Primary', value: primaryTowers.join(', ') });
    if (data.towers.military.length) towers.push({ name: 'Military', value: militaryTowers.join(', ') });
    if (data.towers.magic.length) towers.push({ name: 'Magic', value: magicTowers.join(', ') });
    if (data.towers.support.length) towers.push({ name: 'Support', value: supportTowers.join(', ') });
    return towers;
};

module.exports = {
    parseModifiers,
    parseMode,
    parseDifficulty,
    parseTowerSets
};