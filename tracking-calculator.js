(function (root, factory) {
    const api = factory();
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    root.TrackingCalculator = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    const defaults = () => ({
        ruleId: 'tracking-proficiency-calculator', rulesMode: 'core', trackingProficiencyRating: 7, terrain: 'normal-ground-or-wood-floor', trackedCreatureCount: 1,
        groupSizeOverride: null, trailAgeHours: 0, precipitationHours: 0, poorLighting: false, trackedPartyHidingTrail: false,
        animalEmpathyApplies: false, animalLoreApplies: false, environment: 'outdoor-land', kitOverridesEnvironmentPenalty: false,
        otherModifiers: 0, manualModifierOverride: null, trackingMovementAt14: null, environmentRounding: 'floor',
        indoor: false, sawCreatureRecently: false, beginsWhereLastSeen: false, outdoorEvidence: false, physicalTrail: true,
        flyingOrNoncorporeal: false, trailStatus: 'searching', failureCount: 0, newSignSearchHours: 0,
        nextCheckTrigger: '', identificationCheck: false, additionalTrackers: 0, leadTracker: true
    });
    const number = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
    const integer = (value, fallback = 0) => Number.isInteger(Number(value)) ? Number(value) : fallback;
    const signed = value => `${value >= 0 ? '+' : ''}${value}`;

    function normalize(state = {}) {
        const result = { ...defaults(), ...(state && typeof state === 'object' ? state : {}) };
        result.rulesMode = result.rulesMode === 'skills-and-powers' ? result.rulesMode : 'core';
        result.trackingMovementAt14 = ['half', 'three-quarters'].includes(result.trackingMovementAt14) ? result.trackingMovementAt14 : null;
        result.environmentRounding = ['floor', 'ceil', 'round'].includes(result.environmentRounding) ? result.environmentRounding : 'floor';
        result.trailStatus = ['searching', 'found', 'lost', 'permanently-lost', 'ended'].includes(result.trailStatus) ? result.trailStatus : 'searching';
        result.failureCount = Math.max(0, integer(result.failureCount));
        return result;
    }

    function calculate(rule, input = {}, character = {}) {
        const state = normalize(input);
        const terrainValue = rule.calculator.modifierRules.terrain[state.terrain];
        const isRanger = character.isRanger === true;
        const isDragon = character.isDragon === true;
        const isBarbarian = character.isBarbarian === true;
        const groupSize = state.groupSizeOverride == null ? Math.floor(Math.max(1, integer(state.trackedCreatureCount, 1)) / 2) : integer(state.groupSizeOverride);
        const modifiers = [
            { label: 'Terrain', value: terrainValue == null ? 0 : terrainValue },
            { label: 'Tracked group', value: groupSize },
            { label: 'Trail age', value: -Math.floor(Math.max(0, number(state.trailAgeHours)) / 12) },
            { label: 'Precipitation', value: -5 * Math.max(0, number(state.precipitationHours)) },
            { label: 'Poor lighting', value: state.poorLighting ? -6 : 0 },
            { label: 'Trail concealed', value: state.trackedPartyHidingTrail ? -5 : 0 },
            { label: 'Manual DM modifier', value: state.manualModifierOverride == null ? integer(state.otherModifiers) : integer(state.manualModifierOverride) }
        ];
        const base = state.rulesMode === 'core' ? integer(character.wisdom, 0) : Math.max(0, integer(state.trackingProficiencyRating, 7));
        const classModifier = state.rulesMode === 'core' ? (isRanger || isDragon ? 0 : -6) : (isRanger ? 5 : 0);
        const animalEmpathy = state.rulesMode === 'skills-and-powers' && state.animalEmpathyApplies ? 2 : 0;
        const animalLore = state.rulesMode === 'skills-and-powers' && state.animalLoreApplies ? 2 : 0;
        const teamBonus = Math.max(0, integer(state.additionalTrackers)) > 0 && state.leadTracker ? 1 : 0;
        const preEnvironment = base + classModifier + animalEmpathy + animalLore + teamBonus + modifiers.reduce((total, term) => total + term.value, 0);
        const rangerHalves = isRanger && !state.kitOverridesEnvironmentPenalty && ['urban', 'man-made', 'aquatic'].includes(state.environment);
        const barbarianHalves = isBarbarian && ['urban', 'man-made'].includes(state.environment);
        const environmentMultiplier = rangerHalves || barbarianHalves ? 0.5 : 1;
        const rounded = environmentMultiplier === 1 ? preEnvironment : Math[state.environmentRounding](preEnvironment * environmentMultiplier);
        const warnings = [];
        if (terrainValue == null) warnings.push('Set a manual DM modifier for the selected terrain.');
        if (!state.physicalTrail) warnings.push('Tracking requires a physical trail.');
        if (state.flyingOrNoncorporeal) warnings.push('Flying or noncorporeal creatures are normally virtually impossible to track; the DM may allow substantial penalties.');
        if (state.indoor && !(state.sawCreatureRecently && state.beginsWhereLastSeen)) warnings.push('Indoor tracking requires seeing the creature within 30 minutes and starting where it was last seen.');
        if (!state.indoor && !state.outdoorEvidence) warnings.push('Outdoor tracking requires sighting, recent eyewitness evidence, or obvious evidence in the area.');
        if (rounded === 14 && !state.trackingMovementAt14) warnings.push('Movement at target 14 is unresolved: choose one campaign setting.');
        if (state.groupSizeOverride == null) warnings.push('Group size uses floor(count / 2); the source boundary remains DM-overridable.');
        const eligible = !warnings.some(message => /requires|virtually impossible/.test(message));
        let trailStatus = state.trailStatus;
        if (state.rulesMode === 'core' && rounded < 0) trailStatus = 'permanently-lost';
        if (state.failureCount >= 2) trailStatus = 'ended';
        const movementMultiplier = rounded <= 0 ? 0 : rounded <= 6 ? .25 : rounded < 14 ? .5 : rounded > 14 ? .75 : state.trackingMovementAt14 === 'half' ? .5 : state.trackingMovementAt14 === 'three-quarters' ? .75 : null;
        const rerollAvailability = trailStatus === 'permanently-lost' || trailStatus === 'ended' ? 'No further attempt.' : state.failureCount === 1 ? (number(state.newSignSearchHours) >= 1 ? 'One new-sign search attempt is available.' : 'Search for new signs for at least one hour before one retry.') : 'Available when qualifying conditions are met.';
        return { state, base, classModifier, animalEmpathy, animalLore, teamBonus, modifiers, preEnvironment, environmentMultiplier, finalTargetNumber: rounded, movementMultiplier, trailStatus, eligible, warnings, rerollAvailability, identificationCheckAvailable: state.identificationCheck && eligible, breakdown: [`Base ${base}`, `class ${signed(classModifier)}`, `animal empathy ${signed(animalEmpathy)}`, `animal lore ${signed(animalLore)}`, `lead tracker ${signed(teamBonus)}`, ...modifiers.map(term => `${term.label} ${signed(term.value)}`), `environment x${environmentMultiplier}`] };
    }

    return { defaults, normalize, calculate };
});