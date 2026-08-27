const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const rules = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'phbr11-ranger-thief-abilities.json'), 'utf8'));

function calculate({ level, race = 'human', dexterity = 13, kit = '', armor = 'leather', environment = 'wilderness', rounding = 'floor', optionalHeavyArmor = false, allowHeavyArmor = false, other = 0 }) {
    const base = rules.baseByRangerLevel.find(row => level >= row.minLevel && (row.maxLevel == null || level <= row.maxLevel)) || rules.baseByRangerLevel.at(-1);
    const racial = rules.racialAdjustments[race] || { hideInShadows: 0, moveSilently: 0 };
    const dex = rules.dexterityAdjustments.find(row => dexterity >= row.minDexterity && dexterity <= row.maxDexterity) || { hideInShadows: 0, moveSilently: 0 };
    const kitAdjustment = rules.kitAdjustments[kit] || { hideInShadows: 0, moveSilently: 0 };
    const standardAllowed = ['none', 'leather', 'padded', 'studded-leather'].includes(armor);
    const armorAdjustment = standardAllowed ? rules.standardArmorAdjustments[armor] : (optionalHeavyArmor || allowHeavyArmor ? rules.optionalHeavyArmorAdjustments[armor] : null);
    if (kitAdjustment.notApplicable || !armorAdjustment) return null;
    const values = ['hideInShadows', 'moveSilently'].map(skill => {
        const additive = base[skill] + (racial[skill] || 0) + (dex[skill] || 0) + (kitAdjustment[skill] || 0) + (armorAdjustment[skill] || 0) + other;
        const adjusted = environment === 'wilderness' ? additive : additive * rules.calculation.nonWildernessMultiplier;
        const rounded = rounding === 'ceil' ? Math.ceil(adjusted) : rounding === 'round' ? Math.round(adjusted) : Math.floor(adjusted);
        return Math.max(0, Math.min(99, rounded));
    });
    return values;
}

test('level 1 human ranger uses base values with leather and dex 13-16', () => assert.deepEqual(calculate({ level: 1 }), [10, 15]));
test('level 1 half-elf Beastmaster with dexterity 18 applies race, dexterity, and kit', () => assert.deepEqual(calculate({ level: 1, race: 'half-elf', dexterity: 18, kit: 'beastmaster' }), [30, 25]));
test('level 15 elf Stalker caps both skills at 99', () => assert.deepEqual(calculate({ level: 15, race: 'elf', dexterity: 19, kit: 'stalker', armor: 'none', other: 20 }), [99, 99]));
test('Sea Ranger is unavailable', () => assert.equal(calculate({ level: 1, kit: 'sea-ranger' }), null));
test('heavy armor is unavailable by default', () => assert.equal(calculate({ level: 1, armor: 'chain-mail' }), null));
test('optional heavy armor applies supplied penalties', () => assert.deepEqual(calculate({ level: 1, armor: 'chain-mail', optionalHeavyArmor: true }), [-20, -15].map(value => Math.max(0, Math.min(99, value)))));
test('non-wilderness applies multiplier after additive modifiers', () => assert.deepEqual(calculate({ level: 1, race: 'half-elf', dexterity: 18, kit: 'beastmaster', environment: 'other' }), [15, 12]));
test('multiclass ranger level drives the base row', () => assert.deepEqual(calculate({ level: 8 }), [49, 62]));
