const SCHEMA_VERSION = 2;
const FIXED = {
    schemaVersion: SCHEMA_VERSION,
    identity: {
        name: '',
        player: '',
        alignment: '',
        race: '',
        className: '',
        multiClass: [],
        manualClass: '',
        manualMultiClass: '',
        classKit: '',
        inspiration: 0,
        temporaryAdventurePoints: 0,
        visionType: '',
        level: '',
        xp: '',
        nextLevel: '',
        deity: '',
        classEntries: [{ className: '', level: '', xp: '', nextLevel: '', specialization: '', xpBonusEnabled: false }]
    },
    raceSelection: '',
    manualRace: '',
    racialBonuses: {},
    selectedBackground: '',
    racialFeatures: '',
    racialBonusChoice: '',
    racialWeaponChoice: '',
    portraitUrl: '',
    abilities: {
        str: '',
        dex: '',
        con: '',
        int: '',
        wis: '',
        cha: ''
    },
    details: {
        age: '',
        gender: '',
        height: '',
        build: '',
        complexion: '',
        hair: '',
        eyes: '',
        birthplace: '',
        personality: '',
        appearance: '',
        background: '',
        goals: '',
        fears: '',
        allies: '',
        enemies: ''
    },
    combat: {
        hpMax: '',
        hpCurrent: '',
        hpBonus: '',
        ac: '',
        acItems: [],
        thac0: '',
        initiative: '',
        movement: '',
        surprisedAc: '',
        shieldlessAc: '',
        rearAc: '',
        missileAc: '',
        bladesingerCastingActive: false
    },
    saves: {
        paralyzationPoison: '',
        rodStaffWand: '',
        petrificationPolymorph: '',
        breathWeapon: '',
        spell: ''
    },
    currency: {
        platinum: '',
        gold: '',
        electrum: '',
        silver: '',
        copper: '',
        gems: ''
    },
    weapons: [],
    henchmen: [],
    thiefSkills: [
        { name: 'Pick Pockets', value: '' }, { name: 'Open Locks', value: '' }, { name: 'Find/Remove Traps', value: '' },
        { name: 'Move Silently', value: '' }, { name: 'Hide in Shadows', value: '' }, { name: 'Detect Noise', value: '' },
        { name: 'Climb Walls', value: '' }, { name: 'Read Languages', value: '' }, { name: 'Backstab', value: '' }
    ],
    undeadTurning: [
        { name: 'Skeleton or 1 HD', value: '' }, { name: 'Zombie', value: '' }, { name: 'Ghoul or 2 HD', value: '' },
        { name: 'Shadow or 3-4 HD', value: '' }, { name: 'Wight or 5 HD', value: '' }, { name: 'Ghast', value: '' },
        { name: 'Wraith or 6 HD', value: '' }, { name: 'Mummy or 7 HD', value: '' }, { name: 'Spectre or 8 HD', value: '' },
        { name: 'Vampire or 9 HD', value: '' }, { name: 'Ghost or 10 HD', value: '' }, { name: 'Lich or 11+ HD', value: '' },
        { name: 'Special', value: '' }
    ],
    spellLevels: [
        { name: '1st', value: '' }, { name: '2nd', value: '' }, { name: '3rd', value: '' }, { name: '4th', value: '' },
        { name: '5th', value: '' }, { name: '6th', value: '' }, { name: '7th', value: '' }, { name: '8th', value: '' }, { name: '9th', value: '' }
    ],
    spellSlots: [
        { level: '1st', available: '', used: '' }, { level: '2nd', available: '', used: '' }, { level: '3rd', available: '', used: '' },
        { level: '4th', available: '', used: '' }, { level: '5th', available: '', used: '' }, { level: '6th', available: '', used: '' },
        { level: '7th', available: '', used: '' }, { level: '8th', available: '', used: '' }, { level: '9th', available: '', used: '' }
    ],
    proficiencies: [],
    weaponProficiencies: [],
    weaponProficiencySettings: { autoCalculate: true, availableSlots: 0 },
    languages: [],
    languageTracking: { availableBonusLanguages: null },
    nwpSettings: { autoCalculate: true, exemptBonusProficiencies: true, availableSlots: 0 },
    trackingCalculator: { activeTrackingRow: null, sessions: {} },
    rangerThiefSettings: { environment: 'wilderness', rounding: 'floor', optionalHeavyArmor: false, allowHeavyArmor: false, other: { hideInShadows: 0, moveSilently: 0 }, manualOverrides: { hideInShadows: null, moveSilently: null } },
    rangerThiefCalculations: {},
    adviserSettings: { enabled: true, dismissed: false, currentAdviceId: null },
    inventory: [],
    spells: [],
    spellUsageLog: [],
    recoveryLog: [],
    resistances: [],
    surpriseBonus: {
        active: true,
        target: 'Enemy',
        roll: 'Surprise',
        fullModifier: '-4',
        reducedModifier: '-2',
        source: 'Racial',
        conditions: 'Non-metal armor; eligible party composition or distance',
        notes: ''
    },
    globalModifiers: [],
    xpHistory: [],
    specialAbilities: '',
    wounds: '',
    notes: '',
    additionalNotes: [],
    notesDrawerMode: 'stub',
    notesDrawerPinned: false,
    sectionStates: {},
    sectionOrder: []
};
const clone = o => JSON.parse(JSON.stringify(o));
FIXED.spellSlotPools = Object.fromEntries(['priest', 'wizard', 'bard', 'ranger', 'paladin'].map(source => [source, clone(FIXED.spellSlots)]));
let data = clone(FIXED);
let equipmentCatalogue = [];
let catalogueValidation = [];
let missileRangeProfiles = [];
let nonweaponCatalog = [];
let nonweaponRules = {};
let nonweaponClassCrossovers = {};
let classAbilitiesCatalog = {};
let classAbilityRecords = [];
let classAbilityValidation = [];
let weaponProficiencyCatalog = [];
let proficiencyRules = {};
let trackingProficiencyRule = null;
let languageCatalog = [];
let languageRecords = [];
let languageValidation = [];
let languageCategories = [];
let languageSourceTypes = [];
let intelligenceBonusLanguages = [];
let languageRaceRules = {};
let raceCardRecords = {};
let priestSpellProgression = null;
let wizardSpellProgression = null;
let rangerSpellProgression = null;
let druidSphereAccess = null;
let rangerSpellAccess = null;
let paladinSpellProgression = null;
let paladinSpellAccess = null;
let bardSpellProgression = null;
let shamanSpellcasting = null;
let rangerThiefAbilities = null;
let languageCatalogStatus = 'loading';
let spellCatalogStatus = 'loading';
const gameRules = {
    currencyConversion: { cp: 1, sp: 10, ep: 50, gp: 100, pp: 500 },
    wealthCalculations: { baseCurrency: 'cp', displayCurrency: 'gp', allowCurrencyBreakdown: true, autoCalculateInventoryValue: true }
};
const copperPerCurrency = gameRules.currencyConversion;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
} [c]));
const paginateCatalog = (records, page, pageSize) => {
    const pageCount = Math.max(1, Math.ceil(records.length / pageSize));
    const currentPage = Math.max(0, Math.min(page, pageCount - 1));
    return { currentPage, pageCount, records: records.slice(currentPage * pageSize, (currentPage + 1) * pageSize) };
};
const catalogPaginationMarkup = (pagination, control) => `<nav class="catalog-pagination" aria-label="Catalogue pages"><button type="button" data-${control}-page="${pagination.currentPage - 1}" aria-label="Previous page" ${pagination.currentPage === 0 ? 'disabled' : ''}>&larr;</button><span>Page ${pagination.currentPage + 1} of ${pagination.pageCount}</span><button type="button" data-${control}-page="${pagination.currentPage + 1}" aria-label="Next page" ${pagination.currentPage === pagination.pageCount - 1 ? 'disabled' : ''}>&rarr;</button></nav>`;
const PORTRAIT_PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 300" role="img" aria-label="Upload character portrait"><defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#5f564d"/><stop offset="100%" stop-color="#2e2924"/></linearGradient><radialGradient id="shade" cx="0.5" cy="0.28" r="0.9"><stop offset="0%" stop-color="#8d8378" stop-opacity="0.35"/><stop offset="70%" stop-color="#1b1714" stop-opacity="0.62"/><stop offset="100%" stop-color="#0f0d0b" stop-opacity="0.78"/></radialGradient><radialGradient id="halo" cx="0.5" cy="0.43" r="0.42"><stop offset="0%" stop-color="#c2c7cc" stop-opacity="0.22"/><stop offset="100%" stop-color="#11100f" stop-opacity="0"/></radialGradient></defs><rect width="240" height="300" fill="url(#bg)"/><rect width="240" height="300" fill="url(#shade)"/><rect width="240" height="300" fill="url(#halo)"/><circle cx="120" cy="102" r="40" fill="#868e96"/><path d="M58 252c0-41 28-74 62-74s62 33 62 74" fill="#7a838c"/><rect x="20" y="20" width="200" height="260" rx="8" ry="8" fill="none" stroke="#a79a8a" stroke-opacity="0.42" stroke-width="2"/><text x="120" y="279" fill="#d9cec0" fill-opacity="0.92" font-family="Georgia, serif" font-size="13" text-anchor="middle" letter-spacing="0.5">Upload character portrait</text></svg>`;
const PORTRAIT_PLACEHOLDER_DATA_URI = `data:image/svg+xml,${encodeURIComponent(PORTRAIT_PLACEHOLDER_SVG)}`;

function normalize(x = {}) {
    const d = clone(FIXED);
    for (const section of ['identity', 'abilities', 'details', 'combat', 'saves', 'currency']) Object.assign(d[section], x[section] || {});
    d.identity.multiClass = Array.isArray(d.identity.multiClass) ? d.identity.multiClass : [];
    d.identity.classKit = typeof d.identity.classKit === 'string' ? d.identity.classKit : '';
    d.identity.manualClass = typeof d.identity.manualClass === 'string' ? d.identity.manualClass : '';
    d.identity.manualMultiClass = typeof d.identity.manualMultiClass === 'string' ? d.identity.manualMultiClass : '';
    const inspiration = Number.parseInt(d.identity.inspiration, 10);
    d.identity.inspiration = Number.isInteger(inspiration) ? Math.max(0, inspiration) : 0;
    const temporaryAdventurePoints = Number.parseInt(d.identity.temporaryAdventurePoints, 10);
    d.identity.temporaryAdventurePoints = Number.isInteger(temporaryAdventurePoints) ? Math.max(0, temporaryAdventurePoints) : 0;
    d.identity.visionType = typeof d.identity.visionType === 'string' ? d.identity.visionType : '';
        d.identity.classEntries = Array.isArray(d.identity.classEntries) && d.identity.classEntries.length ? d.identity.classEntries : [{ className: d.identity.className, level: d.identity.level, xp: d.identity.xp, nextLevel: d.identity.nextLevel, specialization: '' }];
        d.identity.classEntries = d.identity.classEntries.map(entry => ({ ...entry, specialization: typeof entry.specialization === 'string' ? entry.specialization : '' }));
        d.identity.classEntries = d.identity.classEntries.map(entry => ({ ...entry, xpBonusEnabled: entry.xpBonusEnabled === true || (entry.xpBonusMode === 'manual' && Number.parseInt(entry.xpBonusPercent, 10) > 0) }));
        d.combat.acItems = Array.isArray(d.combat.acItems) ? d.combat.acItems.map(item => ({ name: typeof item.name === 'string' ? item.name : '', type: typeof item.type === 'string' ? item.type : 'other', value: item.value ?? '', appliesTo: typeof item.appliesTo === 'string' ? item.appliesTo : 'Default', equipped: item.equipped !== false })) : [];
        d.combat.bladesingerCastingActive = d.combat.bladesingerCastingActive === true;
    for (const k of ['portraitUrl', 'specialAbilities', 'wounds', 'notes']) d[k] = typeof x[k] === 'string' ? x[k] : '';
    for (const k of ['raceSelection', 'manualRace', 'selectedBackground', 'racialFeatures', 'racialBonusChoice', 'racialWeaponChoice']) d[k] = typeof x[k] === 'string' ? x[k] : '';
    d.racialBonuses = x.racialBonuses && typeof x.racialBonuses === 'object' && !Array.isArray(x.racialBonuses) ? x.racialBonuses : {};
    d.sectionStates = x.sectionStates && typeof x.sectionStates === 'object' && !Array.isArray(x.sectionStates) ? x.sectionStates : {};
    d.sectionOrder = Array.isArray(x.sectionOrder) ? x.sectionOrder.filter(key => typeof key === 'string') : [];
    for (const k of ['weapons', 'henchmen', 'proficiencies', 'inventory', 'spells', 'resistances', 'spellUsageLog', 'recoveryLog']) d[k] = Array.isArray(x[k]) ? x[k] : [];
    d.additionalNotes = Array.isArray(x.additionalNotes) ? x.additionalNotes.map(note => ({ id: typeof note.id === 'string' ? note.id : `note-${Date.now()}-${Math.random().toString(36).slice(2)}`, title: typeof note.title === 'string' ? note.title : 'Untitled note', body: typeof note.body === 'string' ? note.body : '', pinned: note.pinned === true })) : [];
    d.notesDrawerMode = x.notesDrawerMode === 'auto' ? 'auto' : 'stub';
    d.notesDrawerPinned = x.notesDrawerPinned === true;
    d.proficiencies = d.proficiencies.map(item => ({
        ...item,
        id: item.id ?? '',
        name: typeof item.name === 'string' ? item.name : '',
        slotCost: item.slotCost ?? item.slots ?? 1,
        acquisition: ['purchased', 'class', 'kit', 'race', 'language', 'campaign', 'ranger-granted', 'barbarian-homeland', 'barbarian-expertise', 'custom'].includes(item.acquisition) ? item.acquisition : 'purchased',
        usesNwpSlot: item.usesNwpSlot === false || item.usesNwpSlot === 'false' ? false : item.usesNwpSlot ?? !['class', 'kit', 'race', 'language', 'campaign', 'ranger-granted', 'barbarian-homeland'].includes(item.acquisition),
        exemptFromNwpLimits: item.exemptFromNwpLimits === true || item.exemptFromNwpLimits === 'true',
        ability: item.ability ?? item.score ?? '',
        checkModifier: item.checkModifier ?? null,
        source: item.source ?? '',
        notes: item.notes ?? ''
    }));
    d.weaponProficiencies = Array.isArray(x.weaponProficiencies) ? x.weaponProficiencies.map(item => ({ proficiencyId: typeof item.proficiencyId === 'string' ? item.proficiencyId : null, weaponId: typeof item.weaponId === 'string' ? item.weaponId : null, name: typeof item.name === 'string' ? item.name : '', proficient: item.proficient === true || item.proficient === 'true', specialization: typeof item.specialization === 'string' ? item.specialization : 'none', notes: typeof item.notes === 'string' ? item.notes : '' })) : [];
    const legacyWeaponNames = ['Battle Axe', 'Bow, Long', 'Bow, Short', 'Shortbow', 'Club', 'Crossbow', 'Dagger', 'Dart', 'Flail', 'Hand Axe', 'Javelin', 'Knife', 'Lance', 'Mace', 'Pick', 'Polearm', 'Sling', 'Spear', 'Staff', 'Sword, Bastard', 'Bastard Sword', 'Long Sword', 'Sword, Scimitar', 'Scimitar', 'Short Sword', 'Sword, Short', 'Two-Handed Sword', 'Sword, Two-Handed', 'Warhammer', 'War Hammer', 'Whip'];
    const legacyWeaponRows = d.proficiencies.filter(item => legacyWeaponNames.some(name => name.toLowerCase() === String(item.name || '').trim().toLowerCase()) || String(item.type || '').toLowerCase() === 'weapon');
    if (!d.weaponProficiencies.length) d.weaponProficiencies = legacyWeaponRows.map(item => ({ proficiencyId: null, weaponId: null, name: item.name, proficient: true, specialization: 'none', notes: '' }));
    const legacyLanguageRows = d.proficiencies.filter(item => String(item.type || '').toLowerCase() === 'language');
    if ((!Array.isArray(x.languages) || !x.languages.length) && legacyLanguageRows.length) d.languages = legacyLanguageRows.map(item => ({ name: item.name || '', source: item.source || 'legacy', countsAgainstLanguageLimit: false }));
    if (legacyWeaponRows.length || legacyLanguageRows.length) d.proficiencies = d.proficiencies.filter(item => !legacyWeaponRows.includes(item) && !legacyLanguageRows.includes(item));
    d.weaponProficiencySettings = { ...d.weaponProficiencySettings, ...(x.weaponProficiencySettings || {}) };
    d.languages = Array.isArray(x.languages) && x.languages.length ? x.languages.map(language => ({ id: typeof language.id === 'string' ? language.id : '', name: typeof language.name === 'string' ? language.name : '', category: language.category ?? null, sourceType: ['native', 'racial', 'bonus', 'class', 'kit', 'campaign', 'magic'].includes(language.sourceType) ? language.sourceType : language.source === 'racial' ? 'racial' : 'native', isAutomatic: language.isAutomatic === true, speaks: language.speaks !== false, reads: language.reads === true, writes: language.writes === true, usesLanguageSlot: language.usesLanguageSlot === true, countsAgainstLanguageLimit: language.countsAgainstLanguageLimit === true, notes: language.notes ?? '' })) : d.languages;
    d.languageTracking = { ...d.languageTracking, ...(x.languageTracking || {}) };
    d.nwpSettings = { ...d.nwpSettings, ...(x.nwpSettings || {}) };
    const savedTracking = x.trackingCalculator && typeof x.trackingCalculator === 'object' ? x.trackingCalculator : {};
    d.trackingCalculator = { activeTrackingRow: Number.isInteger(savedTracking.activeTrackingRow) ? savedTracking.activeTrackingRow : null, sessions: {} };
    if (savedTracking.sessions && typeof savedTracking.sessions === 'object') Object.entries(savedTracking.sessions).forEach(([key, session]) => { d.trackingCalculator.sessions[key] = TrackingCalculator.normalize(session); });
    d.rangerThiefSettings = { ...d.rangerThiefSettings, ...(x.rangerThiefSettings || {}), other: { ...d.rangerThiefSettings.other, ...(x.rangerThiefSettings?.other || {}) }, manualOverrides: { ...d.rangerThiefSettings.manualOverrides, ...(x.rangerThiefSettings?.manualOverrides || {}) } };
    d.rangerThiefCalculations = x.rangerThiefCalculations && typeof x.rangerThiefCalculations === 'object' ? x.rangerThiefCalculations : {};
    d.adviserSettings = { ...d.adviserSettings, ...(x.adviserSettings || {}), enabled: x.adviserSettings?.enabled !== false, dismissed: x.adviserSettings?.dismissed === true, currentAdviceId: typeof x.adviserSettings?.currentAdviceId === 'string' ? x.adviserSettings.currentAdviceId : null };
    d.resistances = d.resistances.map(item => ({ type: typeof item.type === 'string' ? item.type : 'Other', appliesTo: item.appliesTo ?? '', value: item.value ?? '', source: item.source ?? '', active: item.active !== false, notes: item.notes ?? '' }));
    d.surpriseBonus = { ...d.surpriseBonus, ...(x.surpriseBonus || {}) };
    d.globalModifiers = Array.isArray(x.globalModifiers) ? x.globalModifiers.map(item => ({ category: typeof item.category === 'string' ? item.category : 'Other', value: item.value ?? '', appliesTo: item.appliesTo ?? '', source: item.source ?? '', active: item.active !== false, condition: item.condition ?? '', notes: item.notes ?? '' })) : [];
    d.xpHistory = Array.isArray(x.xpHistory) ? x.xpHistory : [];
    d.inventory = d.inventory.map(item => ({
        catalogType: typeof item.catalogType === 'string' ? item.catalogType : 'equipment',
        catalogItemId: ({ needle: 'blowgun-needle', 'flight-arrow-12': 'flight-arrow', 'sheaf-arrow-6': 'sheaf-arrow' }[item.catalogItemId || item.itemId] || item.catalogItemId || item.itemId || ''),
        itemId: ({ needle: 'blowgun-needle', 'flight-arrow-12': 'flight-arrow', 'sheaf-arrow-6': 'sheaf-arrow' }[item.itemId] || item.itemId || ''),
        item: typeof item.item === 'string' ? item.item : typeof item.name === 'string' ? item.name : '',
        location: item.location === 'stored' ? 'stored' : 'carried',
        equipped: item.equipped !== false,
        customName: typeof item.customName === 'string' ? item.customName : null,
        weightOverride: item.weightOverride ?? (item.weight ?? null),
        quantity: item.quantity ?? 1,
        notes: typeof item.notes === 'string' ? item.notes : ''
    }));
    d.weapons = d.weapons.map(item => ({
        name: typeof item.name === 'string' ? item.name : '',
        attackType: typeof item.attackType === 'string' ? item.attackType : typeof item.attacks === 'string' ? item.attacks : '',
        attackAdj: item.attackAdj ?? '',
        damageAdj: item.damageAdj ?? '',
        thac0Adj: item.thac0Adj ?? '',
        damageSM: item.damageSM ?? item.damage ?? '',
        damageL: item.damageL ?? item.damage ?? '',
        range: item.range ?? '',
        weight: item.weight ?? '',
        speed: item.speed ?? '',
        equipped: item.equipped !== false
    }));
    for (const k of ['thiefSkills', 'undeadTurning', 'spellLevels']) d[k] = Array.isArray(x[k]) && x[k].length ? x[k] : d[k];
    const normalizeSlotPool = slots => Array.isArray(slots) && slots.length ? slots.map((slot, index) => ({ level: typeof slot.level === 'string' ? slot.level : d.spellSlots[index]?.level || `${index + 1}th`, available: slot.available ?? '', used: slot.used ?? '' })) : clone(d.spellSlots);
    const legacySlots = normalizeSlotPool(x.spellSlots);
    const classText = (d.identity.classEntries || []).map(entry => String(entry.className || '').toLowerCase()).join(' ');
    const legacySource = /priest|cleric|druid|shaman/.test(classText) ? 'priest' : /paladin/.test(classText) ? 'paladin' : /bard/.test(classText) ? 'bard' : /wizard|mage/.test(classText) ? 'wizard' : /ranger/.test(classText) ? 'ranger' : 'priest';
    d.spellSlotPools = Object.fromEntries(Object.keys(FIXED.spellSlotPools).map(source => [source, normalizeSlotPool(x.spellSlotPools?.[source] || (source === legacySource ? legacySlots : null))]));
    d.spellSlots = d.spellSlotPools[legacySource];
    d.spells = d.spells.map(spell => ({ ...spell, name: typeof spell.name === 'string' ? spell.name : '', level: spell.level ?? '', type: typeof spell.type === 'string' ? spell.type : 'Spell', school: spell.school ?? '', castingSource: typeof spell.castingSource === 'string' ? spell.castingSource : '', known: spell.known ?? '', memorized: spell.memorized === true || spell.memorized === 'true' || spell.memorized === 'yes' || spell.memorized === '1', memorizedQty: spell.memorizedQty ?? '', uses: spell.uses ?? spell.castQty ?? '', castQty: spell.castQty ?? spell.uses ?? '', verbal: spell.verbal === true, somatic: spell.somatic === true, material: spell.material === true, materialComponents: typeof spell.materialComponents === 'string' ? spell.materialComponents : '', notes: spell.notes ?? '' }));
    d.spellUsageLog = d.spellUsageLog.map(entry => ({ timestamp: typeof entry.timestamp === 'string' ? entry.timestamp : '', castingSource: typeof entry.castingSource === 'string' ? entry.castingSource : '', spellName: typeof entry.spellName === 'string' ? entry.spellName : '', spellLevel: entry.spellLevel ?? '', slotLevel: typeof entry.slotLevel === 'string' ? entry.slotLevel : '', target: typeof entry.target === 'string' ? entry.target : '', purpose: typeof entry.purpose === 'string' ? entry.purpose : '', notes: typeof entry.notes === 'string' ? entry.notes : '' }));
    d.recoveryLog = d.recoveryLog.map(entry => ({ timestamp: typeof entry.timestamp === 'string' ? entry.timestamp : '', eventType: typeof entry.eventType === 'string' ? entry.eventType : 'recovery', hours: entry.hours ?? '', location: typeof entry.location === 'string' ? entry.location : '', notes: typeof entry.notes === 'string' ? entry.notes : '' }));
    const maximumHitPoints = Number.parseInt(d.combat.hpMax, 10);
    const currentHitPoints = Number.parseInt(d.combat.hpCurrent, 10);
    if (Number.isInteger(maximumHitPoints) && Number.isInteger(currentHitPoints) && currentHitPoints > maximumHitPoints) d.combat.hpCurrent = String(maximumHitPoints);
    return d
}
const labels = {
    str: 'STR',
    dex: 'DEX',
    con: 'CON',
    int: 'INT',
    wis: 'WIS',
    cha: 'CHA'
};
const abilityAbbreviations = { strength: 'STR', dexterity: 'DEX', constitution: 'CON', intelligence: 'INT', wisdom: 'WIS', charisma: 'CHA' };
const abilityAbbreviation = ability => abilityAbbreviations[String(ability || '').toLowerCase()] || ability || '';

const raceCatalog = {
    Humans: { classes: ['Fighter', 'Ranger', 'Paladin', 'Cleric', 'Druid', 'Thief', 'Bard', 'Mage', 'Specialist Mage', 'Dual-Class'], bonuses: {}, choiceAbilities: ['str', 'dex', 'con', 'int', 'wis', 'cha'], backgrounds: { 'Saltwind Soul': 'Weather Sense or Navigation; Swimming; Rope Use', 'Silver Halls Noble': 'Etiquette or Dancing; Reading / Writing; 150 starting gold', 'Heart of Harvestfall': 'Agriculture; Animal Handling; Cooking or Brewing', 'Autumn Line Vanguard': 'Survival or Tracking; Fire Building', 'Child of Flame': 'Healing or Herbalism; Religion', 'Oldcraft Disciple': 'Ancient History or Languages; Engineering' }, features: '+1 starting language; +1 non-weapon proficiency; +1 encounter rolls with intelligent creatures.', activeSkill: { name: 'Manifest Destiny', condition: 'One time use only, during character creation.', description: 'Roll 9 sets of ability scores and keep the highest 6.' } },
    Elves: { classes: ['Fighter', 'Ranger', 'Cleric', 'Druid', 'Thief', 'Mage', 'Specialist Mage: Diviner', 'Specialist Mage: Enchanter', 'Specialist Mage: Wild Mage', 'Fighter / Mage', 'Fighter / Thief', 'Mage / Thief', 'Fighter / Mage / Thief'], bonuses: {}, choiceAbilities: ['dex', 'con', 'int', 'cha'], backgrounds: { 'Bone Reef Bred': 'Weapon Proficiency; Navigation or Rope Use; Swimming', 'Obsidian Shaped': 'Fast Talking or Bartering; Blacksmithing; 150 starting gold', 'Vel’seraak Pit Caste': 'Animal Handling or Training; Intimidation; Dirty Tricks', 'Black Forest Faithful': 'Herbalism or Healing; Religion', 'Vel’seran Loreborn': 'Ancient History or Languages; Reading / Writing; Agriculture', 'Deadwind Exile': 'Survival or Tracking; Alertness; Hunting' }, features: 'Infravision 60’; 90% immunity to Sleep and Charm spells; enemies receive -4 / -2 to surprise rolls in the listed conditions; +1 to hit/damage with axes and throwing weapons; detect secret doors.', activeSkill: { name: 'Blood-Tide Frenzy', condition: 'Once per adventure; lasts 2 rounds plus 1 round per 3 levels.', description: 'Suffer the listed AC penalty and gain the listed attack benefits against spells, melee, and thrown weapons.' } },
    Goblins: { classes: ['Fighter', 'Cleric', 'Thief', 'Witchdoctor', 'Fighter / Cleric', 'Fighter / Thief', 'Witchdoctor / Thief'], bonuses: {}, choiceAbilities: ['str', 'dex', 'wis', 'cha'], backgrounds: { 'Shallows Scallywag': 'Fishing; Rope Use; Weather Sense or Navigation', 'Underhill Highborn': 'Heraldry or Etiquette; +1 Bonus Language; Dancing or Singing', 'Grublight Devoted': 'Religion; Soothsaying or Herbalism', 'Glitterdeep Stray': 'Gem Cutting or Mining; Direction Sense', 'Rokpokkít Wanderer': 'Gaming or Drinking; Fast Talking; 150 starting gold', 'Gristleborn': 'Weapon Proficiency; Blind-Fighting or Wild Fighting' }, features: 'Infravision 60’; Ogres, Trolls, and Giants receive -4 to hit when targeting goblins; detect underground construction, stonework traps, and nearby crystals/gems.', activeSkill: { name: 'Grabby Lil’ Gremlins', condition: 'Once per adventure, when treasure is found.', description: 'Secretly tell the DM to roll 1d6 for the listed gold, gem, or item outcome.' } },
    Dwarf: { classes: ['Fighter', 'Paladin', 'Cleric', 'Thief', 'Specialist Mage: Illusionist', 'Fighter / Cleric', 'Fighter / Thief', 'Thief / Illusionist'], bonuses: { con: 1, cha: -1 }, choiceAbilities: ['str', 'dex', 'int', 'wis'], backgrounds: { 'Treeline Tactician': 'Survival or Danger Sense; Danger Sense', 'Stonesail Explorer': 'Swimming; Rope Use; Slow Respiration or Deep Diving', 'Oathbound Defender': 'Endurance or Armorer; Weapon Proficiency', 'Deepvein Touched': 'Stonemasonry or Blacksmithing; Mining or Engineering', 'Stonefaith Devotee': 'Religion; Dwarf Runes; Chanting or Brewing', 'Deephold Ascendant': 'Etiquette or Reading / Writing; Heraldry; 2 gems worth 80 gp each' }, features: 'Infravision 60’; +1 saves per 3.5 points of CON; Ogres, Trolls, and Giants receive -4 to hit; +1 to hit listed humanoids; 20% chance of non-class magic item malfunction; stonework detection.', activeSkill: { name: 'Tough as Rocks', condition: 'Once per adventure, when reduced to 0 hit points or below.', description: 'Roll 1d6 to determine whether you remain unconscious at 0 hit points or survive at 1 hit point.' } },
    Halfling: { classes: ['Fighter', 'Cleric', 'Thief', 'Bard', 'Fighter / Cleric', 'Fighter / Thief', 'Cleric / Thief'], bonuses: {}, choiceAbilities: ['con', 'int', 'wis', 'cha'], backgrounds: { 'Hearthland Tender': 'Etiquette; Cooking; Brewing or Winemaking', 'Lord of the Fields': 'Weapon Proficiency; Leadership or Oratory; Local History', 'Deep Lake Seeker': 'Fishing or Swimming; Ancient History; Arcanology', 'Woodspirit Watcher': 'Running; Signaling; Alertness or Camouflage', 'Harvest-Rite Follower': 'Religion; Agriculture; Animal Handling or Animal Lore', 'Silver-Tongued Arbiter': 'Fast Talking or Bartering; Gaming; 150 starting gold' }, features: 'Infravision 60’; +1 saves per 3.5 points of CON; Ogres, Trolls, and Giants receive -4 to hit; +1 to hit and damage with thrown weapons or slings; enemies receive -4 / -2 to surprise rolls in listed conditions.', activeSkill: { name: 'Fortune’s Favor', condition: 'At the start of the adventure.', description: 'Gain 1d4 adventure points; these temporary points do not carry over to the next adventure.' } },
    'Half-Elf': { classes: ['Fighter', 'Ranger', 'Paladin', 'Cleric', 'Druid', 'Thief', 'Bard', 'Mage', 'Specialist Mage', 'Fighter / Mage', 'Fighter / Thief', 'Mage / Thief', 'Every combination but the kitchen sink'], bonuses: {}, choiceAbilities: ['str', 'dex', 'con', 'int', 'wis', 'cha'], backgrounds: { 'Ink-Stained Scion': 'Ancient History or Arcanology; +1 Bonus Language; Reading / Writing', 'Twice-Scarred Drifter': 'Weapon Proficiency; Survival or Endurance', 'Rust Shallows Outcast': 'Swimming; Rope Use; Weather Sense or Navigation', 'Forged by the Forest': 'Alertness; Fire Building; Foraging or Weather Sense', 'Open-Hand Pilgrim': 'Religion; Cartography or Cryptography; Reading / Writing', 'Wayward Ward': 'Etiquette; Musical Instrument or Singing; 150 starting gold' }, features: 'Infravision 60’; 30% immunity to Sleep and Charm spells; enemies receive -4 / -2 to surprise rolls in listed conditions; +1 to hit with a chosen weapon group; detect secret doors.', activeSkill: { name: 'Pilgrim’s Cache', condition: 'Once per adventure.', description: 'Spend 1d4+1 rounds searching your pack to produce one tool or supply worth 5 sp or less; it is used immediately and consumed.' } },
    Lizardfolk: { classes: ['Fighter', 'Ranger', 'Druid', 'Witchdoctor', 'Thief', 'Fighter / Thief', 'Druid / Thief'], bonuses: {}, choiceAbilities: ['str', 'dex', 'wis', 'cha'], backgrounds: { 'Broken Coast Castaway': 'Survival or Endurance; Swimming', 'Wyrm-Blood Noble': 'Ancient History; Dancing or Singing; 150 starting gold', 'Fringe-Crest Savage': 'Tracking or Survival; Weapon Proficiency', 'Ophidian Acolyte': 'Astrology or Soothsaying; Religion', 'Marsh Warden': 'Set Snares; Hunting; Local History or Animal Lore' }, features: 'Movement rate of 12 in water; natural AC 5 while unarmored; may hold breath; +1 attack every 2 rounds for 1d6 damage; must wet entire body once per day.', activeSkill: { name: 'Apex Predator', condition: 'Once per adventure; remain perfectly still for 1 turn.', description: 'Become invisible while silent and unmoving, then gain the listed attack and surprise benefits.' } }
};

function integrateRaceCards(records) {
    records.forEach(record => {
        if (!record || typeof record.name !== 'string' || !raceCatalog[record.name]) return;
        const bonuses = Object.fromEntries((record.abilityAdjustments || [])
            .filter(adjustment => adjustment?.condition == null && ['str', 'dex', 'con', 'int', 'wis', 'cha'].includes(adjustment.ability) && Number.isFinite(adjustment.modifier))
            .map(adjustment => [adjustment.ability, adjustment.modifier]));
        const backgrounds = Object.fromEntries((record.backgrounds || [])
            .filter(background => typeof background?.name === 'string')
            .map(background => [background.name, (background.benefits || []).join('; ') || background.description || '']));
        const specialAbility = record.specialAbility || {};
        raceCatalog[record.name] = {
            ...raceCatalog[record.name],
            classes: Array.isArray(record.allowedClasses) ? record.allowedClasses : raceCatalog[record.name].classes,
            bonuses,
            choiceAbilities: Array.isArray(record.abilityChoice?.choices) ? record.abilityChoice.choices : [],
            backgrounds,
            features: (record.features || []).map(feature => feature.description).filter(Boolean).join('; '),
            activeSkill: specialAbility.name ? {
                name: specialAbility.name,
                condition: [specialAbility.frequency, specialAbility.activation, specialAbility.duration].filter(Boolean).join(' '),
                description: specialAbility.description || ''
            } : null
        };
        raceCardRecords[record.name] = record;
    });
}

async function loadRaceCards() {
    try {
        const response = await fetch('data/race-cards-ocr.json');
        if (!response.ok) throw new Error('Race card data unavailable');
        const dataset = await response.json();
        if (dataset.schemaVersion !== 1 || !Array.isArray(dataset.races)) throw new Error('Invalid race card data');
        integrateRaceCards(dataset.races);
    } catch {
        raceCardRecords = {};
    }
}

const classRequirements = {
    Fighter: { str: 9 }, Paladin: { str: 12, con: 9, wis: 13, cha: 17 }, Ranger: { str: 13, dex: 13, con: 14, wis: 14 },
    Wizard: { int: 9 }, 'Specialist Wizard': { int: 9 }, Priest: { wis: 9 }, Druid: { wis: 12, cha: 15 },
    Thief: { dex: 9 }, Bard: { dex: 12, cha: 13 }, Psionicist: { wis: 15, con: 15 }
};
const classPrimeRequisites = {
    Fighter: 'Strength', Paladin: 'Strength, Wisdom', Ranger: 'Strength, Dexterity, Wisdom', Wizard: 'Intelligence',
    'Specialist Wizard': 'Intelligence', Priest: 'Wisdom', Druid: 'Wisdom, Charisma', Thief: 'Dexterity', Bard: 'Dexterity, Charisma', Psionicist: 'Wisdom, Constitution'
};
const experienceTables = {
    fighter: [0, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 750000, 1000000, 1250000, 1500000, 1750000, 2000000, 2250000, 2500000, 2750000, 3000000],
    paladinRanger: [0, 2250, 4500, 9000, 18000, 36000, 75000, 150000, 300000, 600000, 900000, 1200000, 1500000, 1800000, 2100000, 2400000, 2700000, 3000000, 3300000, 3600000],
    mage: [0, 2500, 5000, 10000, 20000, 40000, 60000, 90000, 135000, 250000, 375000, 750000, 1125000, 1500000, 1875000, 2250000, 2625000, 3000000, 3375000, 3750000],
    cleric: [0, 1500, 3000, 6000, 13000, 27500, 55000, 110000, 225000, 450000, 675000, 900000, 1125000, 1350000, 1575000, 1800000, 2025000, 2250000, 2475000, 2700000],
    druid: [0, 2000, 4000, 7500, 12500, 20000, 35000, 60000, 90000, 125000, 200000, 300000, 750000, 1500000, 3000000, 3500000, 500000, 1000000, 1500000, 2000000],
    thief: [0, 1250, 2500, 5000, 10000, 20000, 40000, 80000, 110000, 160000, 220000, 440000, 660000, 880000, 1100000, 1320000, 1540000, 1760000, 1980000, 2200000],
    psionicist: [0, 2200, 4400, 8800, 16500, 30000, 55000, 100000, 200000, 400000, 600000, 800000, 1000000, 1200000, 1500000, 1800000, 2100000, 2400000, 2700000, 3000000]
};

function experienceTableId(className) {
    const name = String(className || '').toLowerCase();
    if (/fighter|barbarian/.test(name)) return 'fighter';
    if (/paladin|ranger/.test(name)) return 'paladinRanger';
    if (/wizard|mage|specialist/.test(name)) return 'mage';
    if (/priest|cleric/.test(name)) return 'cleric';
    if (/druid/.test(name)) return 'druid';
    if (/thief|bard|ninja/.test(name)) return 'thief';
    if (/psionicist/.test(name)) return 'psionicist';
    return '';
}

function formatExperience(value) {
    return Number.isInteger(value) ? value.toLocaleString('en-US') : '-';
}

function catalogueItem(item) {
    const legacyIds = { longsword: 'long-sword' };
    return equipmentCatalogue.find(record => record.id === (legacyIds[item.catalogItemId || item.itemId] || item.catalogItemId || item.itemId)) || null;
}

function itemName(item) {
    return item.customName || catalogueItem(item)?.name || item.item || 'Custom item';
}

function itemWeight(item) {
    const override = Number.parseFloat(item.weightOverride);
    return Number.isFinite(override) ? override : Number.parseFloat(catalogueItem(item)?.weightLb) || 0;
}

function weaponRangeProfile(record) {
    return record?.rangeProfileId ? missileRangeProfiles.find(profile => profile.id === record.rangeProfileId) || null : null;
}

function formatCost(cost) {
    if (!cost || !Number.isFinite(Number(cost.amount)) || typeof cost.currency !== 'string') return '-';
    return `${cost.amount} ${cost.currency}`;
}

function currencyToCopper(amount, currency) {
    const multiplier = copperPerCurrency[String(currency || '').toLowerCase()];
    return Number.isFinite(Number(amount)) && multiplier ? Number(amount) * multiplier : 0;
}

function copperBreakdown(value) {
    let remaining = Math.max(0, Math.round(Number(value) || 0));
    const pp = Math.floor(remaining / copperPerCurrency.pp); remaining %= copperPerCurrency.pp;
    const gp = Math.floor(remaining / copperPerCurrency.gp); remaining %= copperPerCurrency.gp;
    const ep = Math.floor(remaining / copperPerCurrency.ep); remaining %= copperPerCurrency.ep;
    const sp = Math.floor(remaining / copperPerCurrency.sp); remaining %= copperPerCurrency.sp;
    return `${pp} pp / ${gp} gp / ${ep} ep / ${sp} sp / ${remaining} cp`;
}

function wealthInCopper() {
    return Object.entries(data.currency || {}).reduce((total, [currency, amount]) => total + currencyToCopper(amount, currency === 'platinum' ? 'pp' : currency === 'electrum' ? 'ep' : currency === 'gold' ? 'gp' : currency === 'silver' ? 'sp' : 'cp'), 0);
}

function inventoryValue() {
    let totalCopper = 0;
    data.inventory.forEach(item => {
        const cost = catalogueItem(item)?.cost;
        if (!cost || !Number.isFinite(Number(cost.amount))) return;
        totalCopper += currencyToCopper(cost.amount, cost.currency) * (Number(item.quantity) || 0);
    });
    return copperBreakdown(totalCopper);
}

function validateCatalogue(records) {
    const errors = [];
    const ids = new Set();
    records.forEach((item, index) => {
        if (!item || typeof item.name !== 'string' || !item.name.trim()) errors.push(`Record ${index + 1}: missing item name.`);
        if (!item?.id || ids.has(item.id)) errors.push(`Record ${index + 1}: duplicate or missing ID (${item?.id || 'blank'}).`);
        ids.add(item?.id);
        if (item?.cost !== null && (!item?.cost || !Number.isFinite(Number(item.cost.amount)) || !['cp', 'sp', 'ep', 'gp', 'pp'].includes(item.cost.currency))) errors.push(`${item?.id || 'Unnamed item'}: malformed cost.`);
        const dice = [item?.damage?.smallMedium, item?.damage?.large].filter(value => value != null);
        dice.forEach(value => { if (!/^\d+(?:d\d+(?:[+-]\d+)?)?$/i.test(String(value))) errors.push(`${item.id}: invalid dice expression (${value}).`); });
    });
    return errors;
}

async function loadEquipmentCatalogue() {
    try {
        const sources = [
            ['equipment-catalog', 'equipment'],
            ['weapons', 'weapon'],
            ['armor', 'armor'],
            ['animals', 'animal'],
            ['services', 'service']
        ];
        const responses = await Promise.all(sources.map(([file]) => fetch(`data/${file}.json`)));
        if (responses.some(response => !response.ok)) throw new Error('Catalogue file unavailable');
        const catalogs = await Promise.all(responses.map(response => response.json()));
        const records = catalogs.flatMap((catalog, index) => {
            const items = Array.isArray(catalog) ? catalog : catalog.items;
            return (Array.isArray(items) ? items : []).map(item => ({ ...item, catalogType: sources[index][1] }));
        });
        const rangeResponse = await fetch('data/missile-ranges.json');
        missileRangeProfiles = rangeResponse.ok ? await rangeResponse.json() : [];
        equipmentCatalogue = records.filter(item => item && typeof item === 'object').map(item => ({
            ...item,
            id: typeof item.id === 'string' ? item.id : '',
            name: typeof item.name === 'string' ? item.name : '',
            category: item.category ?? null,
            subcategory: item.subcategory ?? null,
            cost: item.cost && typeof item.cost === 'object' ? { amount: item.cost.amount ?? null, currency: item.cost.currency ?? null } : null,
            weightLb: item.weightLb ?? null,
            stackable: item.stackable === true,
            consumable: item.consumable === true,
            trackQuantity: item.trackQuantity !== false,
            source: item.source ?? item.sourceReference ?? null,
            notes: Array.isArray(item.notes) ? item.notes : item.notes == null ? [] : [String(item.notes)]
        }));
        catalogueValidation = validateCatalogue(equipmentCatalogue);
    } catch (error) {
        equipmentCatalogue = [];
        catalogueValidation = [`Could not load equipment catalogue: ${error.message}`];
    }
}

async function loadNonweaponCatalog() {
    try {
        let response = await fetch('data/nonweapon-proficiencies-expanded.json');
        if (!response.ok) response = await fetch('data/nonweapon-proficiencies.json');
        if (!response.ok) throw new Error('Proficiency catalogue unavailable');
        const catalog = await response.json();
        nonweaponCatalog = Array.isArray(catalog) ? catalog : Array.isArray(catalog.proficiencies) ? catalog.proficiencies : [];
        nonweaponRules = catalog.slotProgression || {};
        nonweaponClassCrossovers = catalog.classGroupCrossovers || {};
    } catch {
        nonweaponCatalog = [];
    }
}

function normalizeSpellLevel(value) {
    if (Number.isInteger(value)) return value;
    if (typeof value === 'string') {
        const match = value.match(/(\d+)/);
        return match ? Number.parseInt(match[1], 10) : 0;
    }
    return 0;
}

function normalizeLegacySpellSource(value) {
    const text = Array.isArray(value) ? value.join(', ') : String(value || '').trim();
    if (!text) return 'Unknown';
    return text.includes('wizard') ? 'Wizard' : text.includes('priest') ? 'Priest' : text;
}

function spellSources(record) {
    return [...new Set([...(Array.isArray(record.source) ? record.source : [record.source]), ...(record.sourceRefs || [])].filter(Boolean))];
}

function readableSourceSummary(value) {
    const sources = [...new Set(Array.isArray(value) ? value : [value])].filter(Boolean).map(String);
    if (!sources.length) return 'Source not recorded';
    if (sources.length === 1) return sources[0];
    return `Multiple source books (${sources.length})`;
}

function sourceQualifiedValue(record, value) {
    const source = spellSources(record).join(', ') || 'Unknown';
    return `${source}: ${value}`;
}

function sourceQualifiedValueFromSources(sources, value) {
    return `${sources.join(', ') || 'Unknown'}: ${value}`;
}

function mergeSpellField(existing, incoming, field) {
    const existingValue = existing[field];
    const incomingValue = incoming[field];
    if (Array.isArray(existingValue) && Array.isArray(incomingValue)) {
        existing[field] = [...new Set([...existingValue, ...incomingValue])];
        return;
    }
    const existingMissing = existingValue == null || existingValue === '' || (Array.isArray(existingValue) && !existingValue.length);
    const incomingMissing = incomingValue == null || incomingValue === '' || (Array.isArray(incomingValue) && !incomingValue.length);
    if (existingMissing && !incomingMissing) {
        existing[field] = incomingValue;
        return;
    }
    if (existingMissing || incomingMissing || JSON.stringify(existingValue) === JSON.stringify(incomingValue)) return;
    const existingSources = existing.fieldSources?.[field] || spellSources(existing);
    const values = Array.isArray(existingValue) && existingValue.every(value => typeof value === 'string') && !existing.fieldSources?.[field] ? existingValue : [sourceQualifiedValueFromSources(existingSources, existingValue)];
    const incomingValues = Array.isArray(incomingValue) && incomingValue.every(value => typeof value === 'string') ? incomingValue.map(value => sourceQualifiedValue(incoming, value)) : [sourceQualifiedValue(incoming, incomingValue)];
    existing[field] = [...new Set([...values, ...incomingValues])].join('; ');
    existing.fieldSources = { ...(existing.fieldSources || {}), [field]: [...new Set([...existingSources, ...spellSources(incoming)])] };
}

function normalizeSpellRecord(record = {}, index = 0) {
    const source = record.source || record.school || record.spellGroup || 'Unknown';
    const legacySource = normalizeLegacySpellSource(record.spellGroup || record.school || source);
    const components = record.components && typeof record.components === 'object' ? record.components : { verbal: null, somatic: null, material: null };
    const classLists = Array.isArray(record.classLists) ? record.classLists : Array.isArray(record.classes) ? record.classes : [];
    return {
        id: typeof record.id === 'string' ? record.id : `spell-${index + 1}`,
        sourceRecordId: typeof record.sourceRecordId === 'string' ? record.sourceRecordId : null,
        name: typeof record.name === 'string' ? record.name : '',
        level: record.level == null ? null : normalizeSpellLevel(record.level),
        type: typeof record.type === 'string' ? record.type : 'Spell',
        school: typeof record.school === 'string' ? record.school : null,
        classLists,
        spellGroup: typeof record.spellGroup === 'string' ? record.spellGroup : typeof record.school === 'string' ? record.school.toLowerCase() : '',
        components: {
            verbal: components.verbal ?? null,
            somatic: components.somatic ?? null,
            material: components.material ?? null
        },
        materialComponents: record.materialComponents ?? null,
        source: typeof record.source === 'string' ? record.source : source,
        sourceLabel: legacySource,
        notes: Array.isArray(record.notes) ? record.notes : [],
        ...(Array.isArray(record.descriptorSchools) ? { descriptorSchools: record.descriptorSchools } : {}),
        ...(Array.isArray(record.settingOrElementDescriptors) ? { settingOrElementDescriptors: record.settingOrElementDescriptors } : {}),
        ...(typeof record.reversibleSpell === 'boolean' ? { reversibleSpell: record.reversibleSpell } : {}),
        ...(Object.prototype.hasOwnProperty.call(record, 'reverseSpellId') ? { reverseSpellId: record.reverseSpellId } : {}),
        ...(Object.prototype.hasOwnProperty.call(record, 'sourceNotes') ? { sourceNotes: record.sourceNotes } : {}),
        ...(record.sourceLocation && typeof record.sourceLocation === 'object' ? { sourceLocation: record.sourceLocation } : {}),
        ...(Array.isArray(record.sphere) ? { sphere: record.sphere } : {}),
        ...(Array.isArray(record.schools) ? { schools: record.schools } : {}),
        ...(['verbal', 'somatic', 'material'].reduce((fields, field) => {
            if (Object.prototype.hasOwnProperty.call(record, field)) fields[field] = record[field];
            return fields;
        }, {})),
        ...(record.unmapped && typeof record.unmapped === 'object' ? { unmapped: record.unmapped } : {}),
        ...(['range', 'duration', 'castingTime', 'areaOfEffect', 'savingThrow'].reduce((fields, field) => {
            if (Object.prototype.hasOwnProperty.call(record, field)) fields[field] = record[field];
            return fields;
        }, {}))
    };
}

function validateSpellCatalog(records) {
    const ids = new Set();
    const errors = [];
    records.forEach((record, index) => {
        const label = record.id || `Record ${index + 1}`;
        if (!record.id || ids.has(record.id)) errors.push(`${label}: duplicate or missing ID.`);
        ids.add(record.id);
        if (!record.name) errors.push(`${label}: missing name.`);
        if (record.level != null && (!Number.isInteger(record.level) || record.level < 0)) errors.push(`${label}: invalid level.`);
        if (!Array.isArray(record.classLists) || record.classLists.length === 0) errors.push(`${label}: classLists is required.`);
        if (!record.spellGroup && !record.school && !Array.isArray(record.sphere)) errors.push(`${label}: spellGroup, school, or sphere is required.`);
        if (!record.source) errors.push(`${label}: source is required.`);
        if (!record.components || typeof record.components !== 'object') errors.push(`${label}: invalid components object.`);
    });
    return errors;
}

function spellCatalogLookupById(id, records = spellCatalogRecords) {
    return records.find(record => record.id === id) || null;
}

function spellCatalogLookupAllById(id, records = spellCatalogSourceRecords) {
    return records.filter(record => record.id === id);
}

function spellCatalogLookupByName(name, records = spellCatalogRecords) {
    const normalizedName = String(name || '').trim().toLowerCase();
    return records.find(record => record.name && record.name.toLowerCase() === normalizedName) || null;
}

function filterSpellCatalog(records = spellCatalogRecords, filters = {}) {
    return records.filter(record => {
        const matchesLevel = filters.level == null || Number(record.level) === Number(filters.level);
        const matchesClass = !filters.classList || (Array.isArray(record.classLists) && record.classLists.includes(filters.classList));
        const matchesGroup = !filters.spellGroup || record.spellGroup === filters.spellGroup;
        const matchesSource = !filters.source || spellSources(record).includes(filters.source);
        return matchesLevel && matchesClass && matchesGroup && matchesSource;
    });
}

function mergeSpellCatalogRecords(existingRecords, incomingRecords) {
    const merged = [...existingRecords.map(record => ({ ...record, sourceRefs: spellSources(record), source: Array.isArray(record.source) ? [...record.source] : record.source ? [record.source] : [], fieldSources: { ...(record.fieldSources || {}) } }))];
    const conflicts = [];
    incomingRecords.forEach(incoming => {
        const normalizedIncoming = {
            ...incoming,
            sourceRefs: spellSources(incoming),
            schools: Array.isArray(incoming.schools) ? incoming.schools : incoming.school ? [incoming.school] : [],
            notes: Array.isArray(incoming.notes) ? incoming.notes : [],
            materialComponents: incoming.materialComponents ?? null
        };
        const existingIndex = merged.findIndex(record => record.id === normalizedIncoming.id);
        if (existingIndex === -1) {
            merged.push(normalizedIncoming);
            return;
        }
        const existing = merged[existingIndex];
        const comparedKeys = [...new Set([...Object.keys(existing), ...Object.keys(normalizedIncoming)])].filter(key => !['id', 'name', 'source', 'sourceRefs', 'sourceLabel', 'notes', 'components', 'spellGroup', 'sourceRecordId'].includes(key));
        const conflictingFields = comparedKeys.filter(key => {
            const before = existing[key];
            mergeSpellField(existing, normalizedIncoming, key);
            return before != null && normalizedIncoming[key] != null && before !== existing[key];
        });
        existing.sourceRefs = [...new Set([...(existing.sourceRefs || []), ...(normalizedIncoming.sourceRefs || [])].filter(Boolean))];
        existing.source = existing.sourceRefs;
        existing.sourceRecordIds = [...new Set([...(existing.sourceRecordIds || []), existing.sourceRecordId, normalizedIncoming.sourceRecordId].filter(Boolean))];
        existing.notes = [...new Set([...(Array.isArray(existing.notes) ? existing.notes : []), ...(Array.isArray(normalizedIncoming.notes) ? normalizedIncoming.notes : [])].filter(Boolean))];
        if (!existing.schools && normalizedIncoming.schools?.length) existing.schools = normalizedIncoming.schools;
        if (!existing.school && normalizedIncoming.school) existing.school = normalizedIncoming.school;
        if (conflictingFields.length) conflicts.push({ spellId: normalizedIncoming.id, conflictingFields, sources: existing.sourceRefs });
    });
    return { merged, conflicts };
}

async function loadSpellCatalog() {
    try {
        const [legacyResponse, catalogResponse, tomeResponse, tomePriestResponse, compendiumResponse, compendiumV2Response, compendiumV3Response, wizardCompendiumResponse, wizardCompendiumV2Response, wizardCompendiumV3Response, wizardCompendiumV4Response, playersOptionResponse, magicEncyclopediaResponse, completeWizardsHandbookResponse] = await Promise.all([fetch('data/spells.json'), fetch('data/spell-catalog.json'), fetch('data/tome-of-magic-spells.json').catch(() => null), fetch('data/tome-of-magic-priest-spells.json').catch(() => null), fetch('data/priest-spell-compendium-v1-extract.json').catch(() => null), fetch('data/priest-spell-compendium-v2-extract.json').catch(() => null), fetch('data/priest-spell-compendium-v3-extract.json').catch(() => null), fetch('data/wizard-spell-compendium-v1-extract.json').catch(() => null), fetch('data/wizard-spell-compendium-v2-extract.json').catch(() => null), fetch('data/wizard-spell-compendium-v3-extract.json').catch(() => null), fetch('data/wizard-spell-compendium-v4-extract.json').catch(() => null), fetch('data/players-option-spells-and-magic-extract.json').catch(() => null), fetch('data/magic-encyclopedia-v1-spell-extract.json').catch(() => null), fetch('data/complete-wizards-handbook-spell-extract.json').catch(() => null)]);
        if (!legacyResponse.ok || !catalogResponse.ok) throw new Error('Spell catalogue unavailable');
        const legacyRecords = await legacyResponse.json();
        const catalog = await catalogResponse.json();
        const normalizedLegacy = (Array.isArray(legacyRecords) ? legacyRecords : Array.isArray(legacyRecords.spells) ? legacyRecords.spells : []).map((item, index) => normalizeSpellRecord(item, index));
        const normalizedCatalog = (Array.isArray(catalog.spells) ? catalog.spells : []).map((item, index) => normalizeSpellRecord(item, index));
        let mergedRecords = normalizedCatalog.length ? normalizedCatalog : normalizedLegacy;
        const sourceBatches = [];
        if (tomeResponse && tomeResponse.ok) sourceBatches.push(await tomeResponse.json());
        if (tomePriestResponse && tomePriestResponse.ok) sourceBatches.push(await tomePriestResponse.json());
        if (compendiumResponse && compendiumResponse.ok) sourceBatches.push(await compendiumResponse.json());
        if (compendiumV2Response && compendiumV2Response.ok) sourceBatches.push(await compendiumV2Response.json());
        if (compendiumV3Response && compendiumV3Response.ok) sourceBatches.push(await compendiumV3Response.json());
        if (wizardCompendiumResponse && wizardCompendiumResponse.ok) sourceBatches.push(await wizardCompendiumResponse.json());
        if (wizardCompendiumV2Response && wizardCompendiumV2Response.ok) sourceBatches.push(await wizardCompendiumV2Response.json());
        if (wizardCompendiumV3Response && wizardCompendiumV3Response.ok) sourceBatches.push(await wizardCompendiumV3Response.json());
        if (wizardCompendiumV4Response && wizardCompendiumV4Response.ok) sourceBatches.push(await wizardCompendiumV4Response.json());
        if (playersOptionResponse && playersOptionResponse.ok) sourceBatches.push(await playersOptionResponse.json());
        if (magicEncyclopediaResponse && magicEncyclopediaResponse.ok) sourceBatches.push(await magicEncyclopediaResponse.json());
        if (completeWizardsHandbookResponse && completeWizardsHandbookResponse.ok) sourceBatches.push(await completeWizardsHandbookResponse.json());
        spellCatalogSourceRecords = sourceBatches.flatMap(batch => (Array.isArray(batch) ? batch : []).map((item, index) => {
                const normalized = normalizeSpellRecord(item, index);
                normalized.source = typeof item.source === 'string' ? item.source : 'Tome of Magic';
                normalized.sourceRefs = [normalized.source];
                normalized.notes = Array.isArray(item.notes) ? item.notes : [];
                return normalized;
            }));
        if (spellCatalogSourceRecords.length) {
            const duplicateIds = new Set();
            spellCatalogSourceRecords.forEach((record, index) => {
                if (spellCatalogSourceRecords.slice(0, index).some(previous => previous.id === record.id)) duplicateIds.add(record.id);
            });
            spellCatalogConflicts = [...duplicateIds].map(spellId => {
                const duplicateRecord = spellCatalogSourceRecords.find(record => record.id === spellId);
                return { spellId, type: 'duplicate-source-id', source: duplicateRecord?.source || 'Unknown', conflictingFields: [] };
            });
            const mergeResult = mergeSpellCatalogRecords(mergedRecords, spellCatalogSourceRecords);
            mergedRecords = mergeResult.merged;
            spellCatalogConflicts.push(...mergeResult.conflicts);
        } else {
            spellCatalogConflicts = [];
        }
        spellCatalogRecords = mergedRecords;
        spellCatalogValidation = validateSpellCatalog(spellCatalogRecords);
        spellCatalog = spellCatalogRecords.map(item => ({
            ...item,
            source: item.source || item.sourceRefs?.[0] || (item.spellGroup ? normalizeLegacySpellSource(item.spellGroup) : 'Unknown'),
            school: item.school || item.spellGroup || (Array.isArray(item.schools) ? item.schools[0] : Array.isArray(item.sphere) ? item.sphere[0] : ''),
            level: String(item.level),
            type: 'Spell',
            notes: Array.isArray(item.notes) ? item.notes : []
        }));
        spellCatalogStatus = 'ready';
    } catch {
        spellCatalogRecords = [];
        spellCatalogValidation = [];
        spellCatalog = [];
        spellCatalogConflicts = [];
        spellCatalogSourceRecords = [];
        spellCatalogStatus = 'error';
    } finally {
        if (document.querySelector('.reference-library-section')) setupReferenceLibrary();
    }
}

async function loadPriestSpellProgression() {
    try {
        const response = await fetch('data/priest-spell-progression.json');
        if (!response.ok) throw new Error('Priest spell progression unavailable');
        const catalog = await response.json();
        if (catalog.recordType !== 'spell-progression' || !Array.isArray(catalog.levels)) throw new Error('Invalid priest spell progression');
        priestSpellProgression = catalog;
    } catch (error) {
        priestSpellProgression = null;
        console.warn(error.message);
    }
}

async function loadWizardSpellProgression() {
    try {
        const response = await fetch('data/wizard-spell-progression.json');
        if (!response.ok) throw new Error('Wizard spell progression unavailable');
        const catalog = await response.json();
        if (catalog.recordType !== 'spell-progression' || catalog.class !== 'wizard' || !Array.isArray(catalog.levels)) throw new Error('Invalid wizard spell progression');
        wizardSpellProgression = catalog;
    } catch (error) {
        wizardSpellProgression = null;
        console.warn(error.message);
    }
}

async function loadRangerSpellProgression() {
    try {
        const response = await fetch('data/ranger-spell-progression.json');
        if (!response.ok) throw new Error('Ranger spell progression unavailable');
        const catalog = await response.json();
        if (catalog.recordType !== 'spell-progression' || catalog.class !== 'ranger' || !Array.isArray(catalog.castingProgression)) throw new Error('Invalid ranger spell progression');
        rangerSpellProgression = catalog;
    } catch (error) {
        rangerSpellProgression = null;
        console.warn(error.message);
    }
}

async function loadDruidSphereAccess() {
    try {
        const response = await fetch('data/druid-sphere-access.json');
        if (!response.ok) throw new Error('Druid sphere access unavailable');
        const catalog = await response.json();
        if (catalog.recordType !== 'spell-access-rule' || catalog.class !== 'druid' || !Array.isArray(catalog.majorSpheres) || !Array.isArray(catalog.minorSpheres)) throw new Error('Invalid druid sphere access');
        druidSphereAccess = catalog;
    } catch (error) {
        druidSphereAccess = null;
        console.warn(error.message);
    }
}

async function loadRangerSpellAccess() {
    try {
        const response = await fetch('data/ranger-spell-access.json');
        if (!response.ok) throw new Error('Ranger spell access unavailable');
        const catalog = await response.json();
        if (catalog.recordType !== 'spell-access-rule' || catalog.class !== 'ranger' || !Array.isArray(catalog.majorSpheres)) throw new Error('Invalid ranger spell access');
        rangerSpellAccess = catalog;
    } catch (error) {
        rangerSpellAccess = null;
        console.warn(error.message);
    }
}

async function loadPaladinSpellData() {
    try {
        const [progressionResponse, accessResponse] = await Promise.all([fetch('data/paladin-spell-progression.json'), fetch('data/paladin-spell-access.json')]);
        if (!progressionResponse.ok || !accessResponse.ok) throw new Error('Paladin spell data unavailable');
        const progression = await progressionResponse.json();
        const access = await accessResponse.json();
        if (progression.recordType !== 'spell-progression' || progression.class !== 'paladin' || !Array.isArray(progression.castingProgression)) throw new Error('Invalid paladin spell progression');
        if (access.recordType !== 'spell-access-rule' || access.class !== 'paladin' || !Array.isArray(access.majorSpheres)) throw new Error('Invalid paladin spell access');
        paladinSpellProgression = progression;
        paladinSpellAccess = access;
    } catch (error) {
        paladinSpellProgression = null;
        paladinSpellAccess = null;
        console.warn(error.message);
    }
}

async function loadBardSpellProgression() {
    try {
        const response = await fetch('data/bard-spell-progression.json');
        if (!response.ok) throw new Error('Bard spell progression unavailable');
        const catalog = await response.json();
        if (catalog.recordType !== 'spell-progression' || catalog.class !== 'bard' || !Array.isArray(catalog.levels)) throw new Error('Invalid bard spell progression');
        bardSpellProgression = catalog;
    } catch (error) {
        bardSpellProgression = null;
        console.warn(error.message);
    }
}

async function loadShamanSpellcasting() {
    try {
        const response = await fetch('data/shaman-spellcasting.json');
        if (!response.ok) throw new Error('Shaman spellcasting unavailable');
        const catalog = await response.json();
        if (catalog.recordType !== 'class-spellcasting' || catalog.class !== 'shaman' || catalog.spellProgression !== 'priest-spell-progression') throw new Error('Invalid shaman spellcasting');
        shamanSpellcasting = catalog;
    } catch (error) {
        shamanSpellcasting = null;
        console.warn(error.message);
    }
}

async function loadRangerThiefAbilities() {
    try {
        const response = await fetch('data/phbr11-ranger-thief-abilities.json');
        if (!response.ok) throw new Error('Ranger thief abilities unavailable');
        const catalog = await response.json();
        if (catalog.id !== 'phbr11-ranger-thief-abilities' || !Array.isArray(catalog.baseByRangerLevel)) throw new Error('Invalid ranger thief abilities');
        rangerThiefAbilities = catalog;
    } catch (error) {
        rangerThiefAbilities = null;
        console.warn(error.message);
    }
}

function druidSpellIsAccessible(record) {
    if (!druidSphereAccess || record.catalogueType !== 'spell') return true;
    const spheres = [
        ...(Array.isArray(record.sphere) ? record.sphere : []),
        ...(Array.isArray(record.spheres) ? record.spheres : []),
        record.spellGroup,
        record.school
    ].filter(Boolean).map(value => String(value).toLowerCase().trim());
    const majorSpheres = new Set([...druidSphereAccess.majorSpheres, ...(druidSphereAccess.elementalSubSpheres || [])]);
    if (spheres.some(sphere => majorSpheres.has(sphere))) return true;
    const level = Number.parseInt(record.level, 10);
    return Number.isInteger(level) && level <= druidSphereAccess.minorSphereMaxLevel && spheres.some(sphere => druidSphereAccess.minorSpheres.includes(sphere));
}

function rangerSpellIsAccessible(record) {
    if (!rangerSpellAccess || record.catalogueType !== 'spell') return true;
    const spheres = [
        ...(Array.isArray(record.sphere) ? record.sphere : []),
        ...(Array.isArray(record.spheres) ? record.spheres : []),
        record.spellGroup,
        record.school
    ].filter(Boolean).map(value => String(value).toLowerCase().trim());
    return spheres.some(sphere => rangerSpellAccess.majorSpheres.includes(sphere));
}

function paladinSpellIsAccessible(record) {
    if (!paladinSpellAccess || record.catalogueType !== 'spell') return true;
    const spheres = [
        ...(Array.isArray(record.sphere) ? record.sphere : []),
        ...(Array.isArray(record.spheres) ? record.spheres : []),
        record.spellGroup,
        record.school
    ].filter(Boolean).map(value => String(value).toLowerCase().trim());
    return spheres.some(sphere => paladinSpellAccess.majorSpheres.includes(sphere));
}

function spellSlotProgressionContext(source = availableCastingSources()[0] || 'priest') {
    const classEntries = data.identity.classEntries || [];
    const paladinEntries = classEntries.filter(entry => /paladin/i.test(entry.className || ''));
    const priestEntries = classEntries.filter(entry => /priest|cleric|druid|shaman/i.test(entry.className || ''));
    const bardEntries = classEntries.filter(entry => /bard/i.test(entry.className || ''));
    const wizardEntries = classEntries.filter(entry => /wizard|mage/i.test(entry.className || ''));
    const rangerEntries = classEntries.filter(entry => /ranger/i.test(entry.className || ''));
    const selectedEntries = source === 'priest' ? priestEntries : source === 'paladin' ? paladinEntries : source === 'bard' ? bardEntries : source === 'wizard' ? wizardEntries : rangerEntries;
    const selectedEntry = selectedEntries.slice().sort((left, right) => (Number.parseInt(right.level, 10) || 0) - (Number.parseInt(left.level, 10) || 0))[0];
    const selectedIsRanger = source === 'ranger';
    const progressionCatalog = source === 'priest' ? priestSpellProgression : source === 'paladin' ? paladinSpellProgression : source === 'bard' ? bardSpellProgression : source === 'wizard' ? wizardSpellProgression : rangerSpellProgression;
    const selectedLevel = Number.parseInt(selectedEntry?.level, 10);
    if (!progressionCatalog || !selectedEntry || !Number.isInteger(selectedLevel) || selectedLevel < 1) return null;
    const selectedIsLimitedCaster = selectedIsRanger || source === 'paladin' || source === 'bard';
    const progression = selectedIsRanger ? progressionCatalog.castingProgression.find(entry => entry.rangerLevel === Math.min(selectedLevel, 16)) : source === 'paladin' ? progressionCatalog.castingProgression.find(entry => entry.paladinLevel === Math.min(selectedLevel, 20)) : progressionCatalog.levels.find(entry => entry.level === Math.min(selectedLevel, 20));
    if (!progression) return null;
    const wisdom = Number.parseInt(data.abilities.wis, 10) || 0;
    const wisdomBonus = progressionCatalog === priestSpellProgression && !selectedIsLimitedCaster && (wisdom >= 18 ? [2, 2, 1, 1] : wisdom === 17 ? [2, 2, 1] : wisdom === 16 ? [2, 2] : wisdom === 15 ? [1, 1] : wisdom >= 13 ? [1] : []);
    return { source, selectedEntry, selectedLevel, progressionCatalog, progression, selectedIsRanger, selectedIsLimitedCaster, wisdom, wisdomBonus };
}

function spellSlotRecommendations(source = availableCastingSources()[0] || 'priest') {
    const context = spellSlotProgressionContext(source);
    if (!context) return null;
    return spellSlotPool(source).map((slot, index) => {
        const spellLevel = index + 1;
        const base = Number(context.progression.spells[String(spellLevel)] || 0);
        return String(base + (context.wisdomBonus[index] || 0));
    });
}

function spellCasterMode() {
    const classes = (data.identity.classEntries || []).map(entry => String(entry.className || '').toLowerCase()).join(' ');
    return { preparation: /priest|cleric|druid|paladin|wizard|mage/.test(classes), repertoire: /bard|ranger|shaman/.test(classes) };
}

function availableCastingSources() {
    const classes = (data.identity.classEntries || []).map(entry => String(entry.className || '').toLowerCase()).join(' ');
    const sources = [];
    if (/priest|cleric|druid|shaman/.test(classes)) sources.push('priest');
    if (/wizard|mage/.test(classes)) sources.push('wizard');
    if (/bard/.test(classes)) sources.push('bard');
    if (/ranger/.test(classes)) sources.push('ranger');
    if (/paladin/.test(classes)) sources.push('paladin');
    return sources;
}

function spellSlotPool(source = availableCastingSources()[0] || 'priest') {
    if (!source) return [];
    if (!data.spellSlotPools[source]) data.spellSlotPools[source] = clone(FIXED.spellSlots);
    return data.spellSlotPools[source];
}

function inferredCastingSource(spell) {
    const source = String(spell?.castingSource || '').toLowerCase();
    if (source) return source;
    const spellSource = String(spell?.source || '').toLowerCase();
    if (spellSource.includes('priest')) return 'priest';
    if (spellSource.includes('wizard')) return 'wizard';
    return '';
}

function spellCanBeCast(spell, source = inferredCastingSource(spell)) {
    const level = normalizeSpellLevel(spell.level);
    const mode = spellCasterMode();
    if (source && !availableCastingSources().includes(source)) return false;
    const known = String(spell.known || '').trim().toLowerCase();
    const isKnown = spell.spellCatalogId || ['yes', 'true', 'known', '1', 'x'].includes(known);
    const prepared = spell.memorized === true || (Number.parseInt(spell.memorizedQty, 10) || 0) > 0;
    const slot = spellSlotPool(source).find(item => normalizeSpellLevel(item.level) === level);
    const available = Number.parseInt(slot?.available, 10) || 0;
    const used = Number.parseInt(slot?.used, 10) || 0;
    return level > 0 && isKnown && (!mode.preparation || prepared) && slot && used < available;
}

function showSpellCastDialog(spell) {
    return new Promise(resolve => {
        const modal = document.createElement('div');
        modal.className = 'recovery-modal';
        modal.innerHTML = `<form class="recovery-dialog cast-dialog"><h3>Cast ${esc(spell.name || 'spell')}</h3><label>Enter what this spell is cast for<input name="purpose" autocomplete="off" required></label><label>Enter the target (optional)<input name="target" autocomplete="off"></label><label>Enter any casting notes (optional)<input name="notes" autocomplete="off"></label><div class="recovery-dialog-actions"><button type="button" data-recovery-cancel>Cancel</button><button type="submit" class="primary">Cast spell</button></div></form>`;
        const close = value => { modal.remove(); resolve(value); };
        modal.querySelector('[data-recovery-cancel]').onclick = () => close(null);
        modal.querySelector('form').onsubmit = event => { event.preventDefault(); close({ purpose: modal.querySelector('[name="purpose"]').value.trim(), target: modal.querySelector('[name="target"]').value.trim(), notes: modal.querySelector('[name="notes"]').value.trim() }); };
        document.body.append(modal);
        modal.querySelector('[name="purpose"]').focus();
    });
}

function setSpellSlotsFromProgression(source = availableCastingSources()[0] || 'priest') {
    const recommendations = spellSlotRecommendations(source);
    if (!recommendations) return false;
    spellSlotPool(source).forEach((slot, index) => {
        slot.available = recommendations[index];
        const used = Number.parseInt(slot.used, 10);
        if (Number.isInteger(used) && used > Number.parseInt(slot.available, 10)) slot.used = slot.available;
    });
    return true;
}

async function loadClassAbilitiesCatalog() {
    try {
        const [templateResponse, catalogResponse] = await Promise.all([fetch('data/class-abilities.json'), fetch('data/class-abilities-catalog.json')]);
        if (!templateResponse.ok || !catalogResponse.ok) throw new Error('Class abilities data unavailable');
        const template = await templateResponse.json();
        const catalog = await catalogResponse.json();
        classAbilitiesCatalog = template.abilities || {};
        classAbilityRecords = Array.isArray(catalog.abilities) ? catalog.abilities : [];
        classAbilityValidation = validateClassAbilityCatalog(classAbilityRecords);
    } catch {
        classAbilitiesCatalog = {};
        classAbilityRecords = [];
        classAbilityValidation = [];
    }
}

function validateClassAbilityCatalog(records) {
    const validTypes = ['class-feature', 'spellcasting', 'kit-feature', 'power', 'custom'];
    const validClasses = ['fighter', 'paladin', 'ranger', 'cleric', 'druid', 'mage', 'wizard', 'illusionist', 'thief', 'bard', 'barbarian', 'ninja', 'psionicist'];
    const ids = new Set();
    const errors = [];
    records.forEach((record, index) => {
        if (!record.id || ids.has(record.id)) errors.push(`Record ${index + 1}: duplicate or missing ID.`);
        ids.add(record.id);
        if (!record.name) errors.push(`Record ${index + 1}: missing name.`);
        if (!validTypes.includes(record.abilityType)) errors.push(`${record.id || 'Unnamed record'}: invalid ability type.`);
        if (!Array.isArray(record.classes) || record.classes.some(className => !validClasses.includes(className))) errors.push(`${record.id || 'Unnamed record'}: invalid class reference.`);
    });
    return errors;
}

function spellsAndAbilitiesCatalogueRecords() {
    return [
        ...classAbilityRecords.map(record => ({ ...record, catalogueType: 'ability' })),
        ...spellCatalogRecords.map(record => ({ ...record, classes: Array.isArray(record.classLists) ? record.classLists : [], abilityType: 'spell', catalogueType: 'spell' }))
    ];
}

function classAbilityLookup({ className = '', abilityType = '', source = '', catalogueType = '' } = {}, records = classAbilityRecords) {
    const normalizedClass = String(className).toLowerCase().replace(/\s+/g, '-');
    return records.filter(record => (!normalizedClass || (record.classes || []).includes(normalizedClass)) && (!abilityType || record.abilityType === abilityType) && (!source || record.source === source) && (!catalogueType || record.catalogueType === catalogueType));
}

function classAbilityCatalogMarkup() {
    const records = spellsAndAbilitiesCatalogueRecords();
    const classes = [...new Set(records.flatMap(record => record.classes || []))].sort();
    const types = [...new Set(classAbilityRecords.map(record => record.abilityType))].sort();
    const sources = [...new Set(records.flatMap(record => Array.isArray(record.source) ? record.source : [record.source]).filter(Boolean))].sort();
    const errors = classAbilityValidation.length ? `<div class="catalogue-validation">${classAbilityValidation.map(error => `<div>${esc(error)}</div>`).join('')}</div>` : '';
    return `<div class="class-ability-catalog"><h3>Spells and abilities catalogue</h3>${errors}<label class="class-ability-search">Search catalogue<input id="class-ability-search" type="search" placeholder="Search name or source"></label><div class="class-ability-filters"><label>Class<select id="class-ability-class"><option value="">All classes</option>${classes.map(value => `<option value="${esc(value)}">${esc(value)}</option>`).join('')}</select></label><label>Type<select id="class-ability-catalogue-type"><option value="">All</option><option value="spell">Spells</option><option value="ability">Abilities</option></select></label><label>Ability type<select id="class-ability-type"><option value="">All types</option>${types.map(value => `<option value="${esc(value)}">${esc(value)}</option>`).join('')}</select></label><label>Source<select id="class-ability-source"><option value="">All sources</option>${sources.map(value => `<option value="${esc(value)}">${esc(value)}</option>`).join('')}</select></label></div><div id="class-ability-catalog-results" class="class-ability-catalog-results"></div></div>`;
}

async function loadWeaponProficiencyCatalog() {
    try {
        const response = await fetch('data/weapon-proficiencies.json');
        if (!response.ok) throw new Error('Weapon proficiency catalogue unavailable');
        const records = await response.json();
        weaponProficiencyCatalog = Array.isArray(records) ? records.filter(item => typeof item.proficiencyId === 'string' && item.proficiencyId) : [];
    } catch {
        weaponProficiencyCatalog = [];
    }
}

async function loadProficiencyRules() {
    try {
        const response = await fetch('data/proficiency-rules.json');
        if (!response.ok) throw new Error('Proficiency rules unavailable');
        proficiencyRules = await response.json();
    } catch {
        proficiencyRules = {};
    }
}

async function loadTrackingProficiencyRule() {
    try {
        const response = await fetch('data/tracking-proficiency-calculator.json');
        if (!response.ok) throw new Error('Tracking proficiency rule unavailable');
        const rule = await response.json();
        trackingProficiencyRule = rule?.id === 'tracking-proficiency-calculator' && rule.recordType === 'proficiency-rule' ? rule : null;
    } catch {
        trackingProficiencyRule = null;
    }
}

function validateLanguageCatalog(records) {
    const validCategories = ['common', 'racial', 'humanoid', 'secret-tongue'];
    const ids = new Set();
    const errors = [];
    records.forEach((record, index) => {
        const label = record.id || `Record ${index + 1}`;
        if (!record.id || ids.has(record.id)) errors.push(`${label}: duplicate or missing ID.`);
        ids.add(record.id);
        if (!record.name) errors.push(`${label}: missing name.`);
        if (!validCategories.includes(record.category)) errors.push(`${label}: invalid category.`);
        if (!record.source) errors.push(`${label}: source is required.`);
        if (typeof record.literacySupported !== 'boolean') errors.push(`${label}: literacySupported must be boolean.`);
    });
    return errors;
}

function languageLookup(id) {
    return languageRecords.find(record => record.id === id) || null;
}

async function loadLanguageCatalog() {
    try {
        const [rulesResponse, catalogResponse] = await Promise.all([fetch('data/languages.json'), fetch('data/language-catalog.json')]);
        if (!rulesResponse.ok || !catalogResponse.ok) throw new Error('Language data unavailable');
        const rules = await rulesResponse.json();
        const catalog = await catalogResponse.json();
        languageCatalog = Array.isArray(rules) ? rules : rules.languages || [];
        languageRecords = Array.isArray(catalog.languages) ? catalog.languages : [];
        languageValidation = validateLanguageCatalog(languageRecords);
        languageCategories = rules.categories || [];
        languageSourceTypes = rules.sourceTypes || [];
        intelligenceBonusLanguages = rules.intelligenceBonusLanguages || [];
        languageRaceRules = rules.raceRules || {};
        languageCatalogStatus = 'ready';
    } catch {
        languageCatalog = [];
        languageRecords = [];
        languageValidation = [];
        languageCategories = [];
        languageSourceTypes = [];
        intelligenceBonusLanguages = [];
        languageRaceRules = {};
        languageCatalogStatus = 'error';
    } finally {
        if (document.querySelector('.reference-library-section')) setupReferenceLibrary();
    }
}

function globalModifierTotal(category, appliesTo = '') {
    return (data.globalModifiers || []).filter(item => item.active !== false && item.category === category && (!item.appliesTo || !appliesTo || item.appliesTo.toLowerCase() === appliesTo.toLowerCase())).reduce((total, item) => total + (Number.parseInt(item.value, 10) || 0), 0);
}

function targetedGlobalModifierTotal(category, appliesTo) {
    return (data.globalModifiers || []).filter(item => item.active !== false && item.category === category && item.appliesTo && item.appliesTo.toLowerCase() === String(appliesTo || '').toLowerCase()).reduce((total, item) => total + (Number.parseInt(item.value, 10) || 0), 0);
}

function updateNextLevel(index) {
    const entry = data.identity.classEntries?.[index];
    const table = experienceTables[experienceTableId(entry?.className)];
    const level = Number.parseInt(entry?.level, 10);
    if (!table || !Number.isInteger(level) || level < 1 || level >= table.length - 1) return;
    entry.nextLevel = String(table[level + 1]);
    document.querySelectorAll(`[data-class-entry="${index}"][data-key="nextLevel"]`).forEach(input => { input.value = entry.nextLevel; input.title = `Next level XP: level ${level + 1} threshold from the ${experienceTableId(entry.className)} table = ${formatExperience(table[level + 1])}.`; });
}

function advanceClassLevel(entry) {
    const table = experienceTables[experienceTableId(entry.className)];
    let level = Number.parseInt(entry.level, 10);
    const xp = Number.parseInt(entry.xp, 10);
    if (!table || !Number.isInteger(level) || !Number.isInteger(xp)) return 0;
    let levelsGained = 0;
    while (level < table.length && xp >= table[level]) {
        level += 1;
        levelsGained += 1;
    }
    if (levelsGained) entry.level = String(level);
    return levelsGained;
}

function xpBonusPercent(entry) {
    return entry?.xpBonusEnabled ? 10 : 0;
}

function xpBonusLabel(entry) {
    const percent = xpBonusPercent(entry);
    return percent ? `+${percent}%` : '0%';
}

function updateXpBonusDisplays() {
    document.querySelectorAll('.class-xp-bonus').forEach((cell, index) => {
        const entry = data.identity.classEntries[index];
        const output = cell.querySelector('.xp-bonus-value');
        if (entry && output) output.textContent = xpBonusLabel(entry);
    });
}

function updateXpAwardOptions() {
    const select = document.querySelector('#xp-award-class');
    if (!select) return;
    const selected = select.value;
    select.innerHTML = '<option value="">Choose a class</option>' + data.identity.classEntries.map((entry, index) => entry.className ? `<option value="${index}">${esc(entry.className)}</option>` : '').join('');
    if ([...select.options].some(option => option.value === selected)) select.value = selected;
}

function awardExperience() {
    const classSelect = document.querySelector('#xp-award-class');
    const amountInput = document.querySelector('#xp-award-amount');
    const index = Number.parseInt(classSelect?.value, 10);
    const baseAward = Number.parseInt(amountInput?.value, 10);
    const entry = data.identity.classEntries[index];
    if (!entry?.className || !Number.isInteger(baseAward) || baseAward <= 0) return;
    const percent = xpBonusPercent(entry);
    const bonus = Math.floor(baseAward * percent / 100);
    entry.xp = String((Number.parseInt(entry.xp, 10) || 0) + baseAward + bonus);
    const levelsGained = advanceClassLevel(entry);
    data.xpHistory.unshift({ amount: baseAward, details: `${entry.className}: ${baseAward} + ${bonus} (${percent}%)${levelsGained ? `; level +${levelsGained}` : ''}`, timestamp: new Date().toISOString() });
    amountInput.value = '';
    changed();
    render();
}

function requirementClassName(className) {
    const name = String(className || '').trim();
    return name.toLowerCase().includes('specialist') || name.toLowerCase().includes('mage') ? 'Specialist Wizard' : name;
}

function classRequirementNotice() {
    const missing = [];
    (data.identity.classEntries || []).forEach(entry => {
        const name = requirementClassName(entry.className);
        const requirements = classRequirements[name];
        if (!requirements) return;
        Object.entries(requirements).forEach(([ability, minimum]) => {
            const score = Number.parseInt(data.abilities[ability], 10);
            if (Number.isInteger(score) && score < minimum) missing.push(`${name}: ${ability.toUpperCase()} ${score}/${minimum}`);
        });
    });
    return missing.length ? `Check class requirements: ${missing.join(', ')}.` : 'Class requirements look satisfied or are not yet complete. See the reference below.';
}

function updateClassRequirementNotice() {
    const note = document.querySelector('.class-requirements-note');
    if (note) note.innerHTML = `${esc(classRequirementNotice())} <a href="#class-requirements-reference">Class requirements reference</a>`;
}

function classMinimumsHTML() {
    const entries = (data.identity.classEntries || []).filter(entry => classRequirements[requirementClassName(entry.className)]);
    if (!entries.length) return '<small>Select a supported class to show its minimum ability scores.</small>';
    return entries.map(entry => {
        const name = requirementClassName(entry.className);
        const requirements = classRequirements[name];
        const values = Object.entries(requirements).map(([ability, minimum]) => {
            const score = Number.parseInt(currentAbilityScore(ability), 10);
            const status = Number.isInteger(score) ? `${score}/${minimum}` : `-/${minimum}`;
            return `<span class="class-minimum${Number.isInteger(score) && score < minimum ? ' class-minimum-missing' : ''}"><strong>${ability.toUpperCase()}</strong> ${status}</span>`;
        }).join('');
        return `<div class="class-minimum-row"><strong>${esc(name)}</strong><div>${values}</div></div>`;
    }).join('');
}

function currentAbilityScore(ability) {
    return document.querySelector(`[data-section="abilities"][data-key="${ability}"]`)?.value ?? data.abilities[ability];
}

function updateClassMinimums() {
    const panel = document.querySelector('.class-minimums-content');
    if (panel) panel.innerHTML = classMinimumsHTML();
}

function selectedRaceData() {
    return data.raceSelection && raceCatalog[data.raceSelection] ? raceCatalog[data.raceSelection] : null;
}

function raceCardDetailsMarkup(record) {
    if (!record) return '';
    const details = [];
    const traits = record.unmapped?.traits;
    if (Array.isArray(traits) && traits.length) details.push(`<p class="race-card-traits">${traits.map(esc).join(' | ')}</p>`);
    const features = record.features || [];
    if (features.length) details.push(`<section class="race-card-detail"><h3>Racial abilities</h3><ul>${features.map(feature => `<li><strong>${esc(feature.name)}:</strong> ${esc(feature.description)}</li>`).join('')}</ul></section>`);
    const rules = [
        record.vision?.sourceText,
        record.movement?.sourceText,
        ...(record.weaponRules || []).map(rule => rule.sourceText),
        ...(record.surpriseRules || []).map(rule => rule.sourceText),
        ...(record.resistancesAndImmunities || []).map(rule => rule.sourceText),
        ...(record.restrictions || []).map(rule => rule.sourceText)
    ].filter(Boolean);
    if (rules.length) details.push(`<section class="race-card-detail"><h3>Additional rules</h3><ul>${rules.map(rule => `<li>${esc(rule)}</li>`).join('')}</ul></section>`);
    return details.join('');
}

function updateSurpriseFromRace(race) {
    const hasSurpriseBonus = ['Elves', 'Half-Elf', 'Halfling'].includes(race);
        if (hasSurpriseBonus) { 
            data.surpriseBonus.active = true; 
            data.surpriseBonus.target = 'Enemy'; 
            data.surpriseBonus.roll = 'Surprise'; 
            data.surpriseBonus.fullModifier = '-4'; 
            data.surpriseBonus.reducedModifier = '-2'; 
            data.surpriseBonus.source = 'Racial'; 
            data.surpriseBonus.conditions = 'Non-metal armor; party consists only of halflings, elves, or half-elves; or character is at least 90 ft. from others'; 
        } else if (data.surpriseBonus.source === 'Racial') { 
            data.surpriseBonus.active = false; 
        } 
    const section = document.querySelector('.surprise-section');
    if (!section) return;
    section.hidden = !hasSurpriseBonus;
    section.querySelectorAll('[data-surprise-key]').forEach(input => {
        input.value = data.surpriseBonus[input.dataset.surpriseKey];
        if (input.type === 'checkbox') input.checked = data.surpriseBonus[input.dataset.surpriseKey] !== false;
    });
    const summary = section.querySelector('.surprise-summary span');
    if (summary) summary.textContent = `Enemy surprise: ${data.surpriseBonus.fullModifier} / ${data.surpriseBonus.reducedModifier}`;
}

function updateVisionFromRace(race) {
    const vision = race === 'Humans' ? 'Normal Vision' : ['Elves', 'Goblins', 'Dwarf', 'Halfling', 'Half-Elf'].includes(race) ? "Infravision 60'" : '';
    if (!vision) return;
    data.identity.visionType = vision;
    const select = document.querySelector('#vision-type');
    const manual = document.querySelector('#manual-vision-type');
    if (select) select.value = vision;
    if (manual) {
        manual.value = '';
        manual.hidden = true;
    }
}

function raceOptions() {
    return ['Humans', 'Elves', 'Goblins', 'Dwarf', 'Halfling', 'Half-Elf', 'Lizardfolk'];
}

function setupRaceSystem() {
    const raceInput = document.querySelector('[data-section="identity"][data-key="race"]');
    if (!raceInput || raceInput.dataset.raceReady) return;
    raceInput.dataset.raceReady = 'true';
    const field = raceInput.closest('.field');
    const select = document.createElement('select');
    select.id = 'race-select';
    select.innerHTML = `<option value="">Choose a race</option>${raceOptions().map(race => `<option value="${esc(race)}">${esc(race)}</option>`).join('')}<option value="Other">Other</option>`;
    select.value = data.raceSelection || (raceInput.value && !raceCatalog[raceInput.value] ? 'Other' : raceInput.value);
    raceInput.replaceWith(select);
    const manual = document.createElement('input');
    manual.id = 'manual-race';
    manual.placeholder = 'Enter custom race';
    manual.value = data.manualRace;
    manual.hidden = select.value !== 'Other';
    field.append(manual);
    const classInput = document.querySelector('[data-section="identity"][data-key="className"]');
    const classList = document.createElement('datalist');
    classList.id = 'legal-classes';
    classInput?.setAttribute('list', classList.id);
    classInput?.after(classList);
    const rules = document.createElement('section');
    rules.className = 'card wide race-rules';
    rules.innerHTML = '<h2>Race rules</h2><div class="race-rules-content"></div>';
    document.querySelector('.grid').prepend(rules);
    const update = () => {
        const race = select.value;
        const preset = raceCatalog[race];
        manual.hidden = race !== 'Other';
        data.raceSelection = preset ? race : '';
        data.manualRace = race === 'Other' ? manual.value : '';
        data.identity.race = race === 'Other' ? manual.value : race;
        syncAutomaticLanguages(race);
        if (document.querySelector('.languages-section')) { changed(); render(); return; }
        updateVisionFromRace(race);
        data.racialBonuses = { ...(preset?.bonuses || {}) };
        if (preset?.choiceAbilities?.includes(data.racialBonusChoice)) data.racialBonuses[data.racialBonusChoice] = 1;
        data.racialFeatures = preset?.features || '';
        updateSurpriseFromRace(race);
        data.selectedBackground = preset ? data.selectedBackground : '';
        classList.innerHTML = (preset?.classes || []).map(className => `<option value="${esc(className)}"></option>`).join('');
        const backgrounds = preset ? Object.entries(preset.backgrounds) : [];
        const raceCardDetails = raceCardDetailsMarkup(raceCardRecords[race]);
        const surpriseSection = rules.querySelector('.surprise-section');
        rules.querySelector('.race-rules-content').innerHTML = preset
            ? `<div class="race-rule-columns"><div><h3>${esc(race)}</h3><p><strong>Ability bonuses:</strong> ${Object.entries(preset.bonuses).map(([ability, bonus]) => `${ability.toUpperCase()} ${bonus >= 0 ? '+' : ''}${bonus}`).join(', ') || (preset.choiceAbilities ? `+1 to ${preset.choiceAbilities.map(ability => ability.toUpperCase()).join(', ')}` : 'None listed')}</p><p><strong>Legal classes:</strong> ${preset.classes.map(esc).join(', ')}</p>${raceCardDetails}${preset.activeSkill ? `<div class="racial-ability-skill"><h3>Racial Ability Skill</h3><p><strong>${esc(preset.activeSkill.name)}</strong></p><p><strong>Condition:</strong> ${esc(preset.activeSkill.condition)}</p><p><strong>Effect:</strong> ${esc(preset.activeSkill.description)}</p></div>` : ''}</div><div>${preset.choiceAbilities ? `<label for="racial-bonus-choice">Choose +1 ability bonus</label><select id="racial-bonus-choice"><option value="">Choose an ability</option>${preset.choiceAbilities.map(ability => `<option value="${ability}">${ability.toUpperCase()}</option>`).join('')}</select>` : ''}${race === 'Half-Elf' ? `<label for="racial-weapon-choice">Choose +1 weapon to hit</label><select id="racial-weapon-choice"><option value="">Choose a weapon</option>${[...new Set(halfElfWeaponOptions.map(([, group]) => group))].map(group => `<optgroup label="${esc(group)}">${halfElfWeaponOptions.filter(([, itemGroup]) => itemGroup === group).map(([name,, label]) => `<option value="${esc(name)}">${esc(label || name)}</option>`).join('')}</optgroup>`).join('')}</select><small class="racial-weapon-note">Equipped matching weapon rows receive a separate racial +1 to hit.</small>` : ''}<label for="background-select">Background</label><select id="background-select"><option value="">Choose a background</option>${backgrounds.map(([name]) => `<option value="${esc(name)}">${esc(name)}</option>`).join('')}</select><p class="background-benefits"></p><p class="class-validity"></p><p class="class-requirements-note"></p></div></div>`
            : '<p>Custom race. Enter the race name manually; class legality, bonuses, and background rules must be entered manually.</p>';
        if (surpriseSection) {
            surpriseSection.hidden = !['Elves', 'Half-Elf', 'Halfling'].includes(race);
            rules.querySelector('.race-rules-content').append(surpriseSection);
        }
        const background = rules.querySelector('#background-select');
        const bonusChoice = rules.querySelector('#racial-bonus-choice');
        if (bonusChoice) {
            bonusChoice.value = data.racialBonusChoice;
            bonusChoice.onchange = () => {
                data.racialBonusChoice = bonusChoice.value;
                update();
            };
        } else if (!preset?.choiceAbilities) data.racialBonusChoice = '';
        const weaponChoice = rules.querySelector('#racial-weapon-choice');
        if (weaponChoice) {
            weaponChoice.value = data.racialWeaponChoice;
            weaponChoice.onchange = () => {
                data.racialWeaponChoice = weaponChoice.value;
                updateWeaponThac0();
                changed();
            };
        } else if (race !== 'Half-Elf') data.racialWeaponChoice = '';
        if (background) {
            background.value = data.selectedBackground;
            rules.querySelector('.background-benefits').textContent = preset.backgrounds[data.selectedBackground] || '';
            background.onchange = () => {
                data.selectedBackground = background.value;
                rules.querySelector('.background-benefits').textContent = preset.backgrounds[background.value] || '';
                changed();
            };
        }
        const validity = rules.querySelector('.class-validity');
        const requirementNote = rules.querySelector('.class-requirements-note');
        if (requirementNote) requirementNote.innerHTML = `${esc(classRequirementNotice())} <a href="#class-requirements-reference">Class requirements reference</a>`;
        if (validity && classInput) {
                const legal = !classInput.value || !preset || race === 'Half-Elf' || preset.classes.includes(classInput.value);
            validity.textContent = legal ? 'Class is legal for this race or not yet entered.' : 'This class combination is not listed for the selected race.';
            validity.className = `class-validity ${legal ? 'valid' : 'invalid'}`;
        }
        updateRacialBonuses();
        updateWeaponThac0();
        changed();
    };
    select.onchange = update;
    manual.oninput = update;
    classInput?.addEventListener('input', update);
    update();
}

function setupClassInputs() {
    const classField = document.querySelector('[data-section="identity"][data-key="className"]')?.closest('.field');
    if (!classField || document.querySelector('#class-entries')) return;
    const classOptions = ['Fighter', 'Thief', 'Priest', 'Wizard', 'Psionicist', 'Bard', 'Ranger', 'Paladin', 'Druid', 'Barbarian', 'Ninja'];
    const identityCard = classField.closest('.card');
    const classTableField = document.createElement('div');
    classTableField.className = 'field class-entries-field';
    classTableField.innerHTML = `<label for="class-entries">Classes</label><div class="tableWrap"><table id="class-entries" class="class-entries-table"><thead><tr><th>Class</th><th>Level</th><th>Experience</th><th>XP bonus</th><th>Next level</th><th>Actions</th></tr></thead><tbody></tbody></table></div><button type="button" class="add" id="add-class-entry">Add class</button><div class="xp-award-controls"><label for="xp-award-class">Award XP to</label><select id="xp-award-class"><option value="">Choose a class</option></select><label for="xp-award-amount">XP awarded</label><input id="xp-award-amount" type="number" min="1" step="1"><button type="button" class="add" id="award-xp">Award XP</button><button type="button" class="add" id="toggle-xp-history" aria-expanded="false">Show XP history</button></div><div class="xp-history" hidden></div>`;
    const body = classTableField.querySelector('tbody');
    const addRow = entry => {
        const index = entry ? data.identity.classEntries.indexOf(entry) : data.identity.classEntries.push({ className: '', level: '', xp: '', nextLevel: '', specialization: '', xpBonusEnabled: false }) - 1;
        const row = document.createElement('tr');
                row.innerHTML = `<td><select data-class-entry="${index}" ${index === 0 ? 'data-section="identity" data-key="className"' : 'data-key="className"'}><option value="">Choose a class</option>${classOptions.map(className => `<option value="${className}">${className}</option>`).join('')}<option value="Other">Other</option></select><input class="manual-entry-class" placeholder="Enter custom class" hidden><input class="class-specialization" placeholder="Wizard specialization" data-class-entry="${index}" data-key="specialization" hidden></td><td><input data-class-entry="${index}" data-key="level"></td><td><input data-class-entry="${index}" data-key="xp"></td><td><input data-class-entry="${index}" data-key="nextLevel"></td>`;
        body.append(row);
        row.querySelectorAll('[data-class-entry]').forEach(input => {
            const key = input.dataset.key;
            input.value = data.identity.classEntries[index][key];
            input.oninput = () => { data.identity.classEntries[index][key] = input.value; if (index === 0 && key !== 'className') data.identity[key] = input.value; if (key === 'className' || key === 'level' || key === 'xp') updateNextLevel(index); updateThac0(); updateSavingThrows(); updateAcTotal(); updateClassRequirementNotice(); updateClassMinimums(); updateXpBonusDisplays(); if (key === 'className') updateXpAwardOptions(); changed(); };
        });
        const select = row.querySelector('select');
        const manual = row.querySelector('.manual-entry-class');
        const specialization = row.querySelector('.class-specialization');
        const savedName = data.identity.classEntries[index].className;
        select.value = classOptions.includes(savedName) ? savedName : savedName ? 'Other' : '';
        manual.value = savedName && !classOptions.includes(savedName) ? savedName : '';
        manual.hidden = select.value !== 'Other';
        specialization.value = data.identity.classEntries[index].specialization;
        specialization.hidden = select.value !== 'Wizard';
        select.onchange = () => { manual.hidden = select.value !== 'Other'; specialization.hidden = select.value !== 'Wizard'; data.identity.classEntries[index].className = select.value === 'Other' ? manual.value : select.value; if (index === 0) { data.identity.className = data.identity.classEntries[index].className; data.identity.manualClass = select.value === 'Other' ? manual.value : ''; } updateNextLevel(index); updateThac0(); updateSavingThrows(); updateAcTotal(); updateClassRequirementNotice(); updateClassMinimums(); updateXpBonusDisplays(); updateClassAbilitiesVisibility(); updateXpAwardOptions(); changed(); };
        manual.oninput = () => { data.identity.classEntries[index].className = manual.value; if (index === 0) { data.identity.className = manual.value; data.identity.manualClass = manual.value; } updateNextLevel(index); updateThac0(); updateSavingThrows(); updateAcTotal(); updateClassRequirementNotice(); updateClassMinimums(); updateXpBonusDisplays(); updateClassAbilitiesVisibility(); updateXpAwardOptions(); changed(); };
        specialization.oninput = () => { data.identity.classEntries[index].specialization = specialization.value; changed(); };
        const xpCell = document.createElement('td');
        xpCell.className = 'class-xp-bonus';
        xpCell.innerHTML = `<label><input type="checkbox" class="xp-bonus-checkbox" aria-label="Enable 10 percent XP bonus"> XP bonus</label><output class="xp-bonus-value">${xpBonusLabel(data.identity.classEntries[index])}</output>`;
        const actionCell = document.createElement('td');
        actionCell.className = 'class-actions';
        actionCell.innerHTML = '<button type="button" class="remove remove-class-entry" aria-label="Remove class">×</button>';
        row.insertBefore(xpCell, row.children[3]);
        row.append(actionCell);
        row.querySelector('.remove-class-entry').onclick = () => { if (data.identity.classEntries.length === 1) return; data.identity.classEntries.splice(index, 1); render(); };
        const checkbox = xpCell.querySelector('.xp-bonus-checkbox');
        checkbox.checked = data.identity.classEntries[index].xpBonusEnabled === true;
        checkbox.onchange = () => { data.identity.classEntries[index].xpBonusEnabled = checkbox.checked; xpCell.querySelector('.xp-bonus-value').textContent = xpBonusLabel(data.identity.classEntries[index]); changed(); };
        updateNextLevel(index);
    };
    const initialEntries = data.identity.classEntries.slice();
    initialEntries.forEach(entry => addRow(entry));
    classTableField.querySelector('#add-class-entry').onclick = () => { addRow(); updateXpAwardOptions(); changed(); };
    updateXpAwardOptions();
    classTableField.querySelector('#award-xp').onclick = awardExperience;
    const history = classTableField.querySelector('.xp-history');
    history.innerHTML = data.xpHistory.length ? `<h4>XP history</h4>${data.xpHistory.map(item => `<div>+${formatExperience(item.amount)} XP | ${esc(item.details)}</div>`).join('')}` : '';
    const historyToggle = classTableField.querySelector('#toggle-xp-history');
    historyToggle.onclick = () => {
        const visible = history.hidden;
        history.hidden = !visible;
        historyToggle.textContent = visible ? 'Hide XP history' : 'Show XP history';
        historyToggle.setAttribute('aria-expanded', String(visible));
    };
    const kitField = document.createElement('div');
    kitField.className = 'field class-kit-field';
    kitField.innerHTML = `<label for="class-kit">Class kit</label><input id="class-kit" data-section="identity" data-key="classKit" value="${esc(data.identity.classKit)}">`;
    classField.replaceWith(kitField);
    const inspirationField = document.createElement('div');
    inspirationField.className = 'field inspiration-field';
    inspirationField.innerHTML = `<div class="adventure-points-row"><div class="adventure-points-control"><label for="inspiration-count">Adventure Points</label><div class="inspiration-controls"><button type="button" data-inspiration-key="inspiration" data-inspiration-change="-1" aria-label="Decrease adventure points">-</button><input id="inspiration-count" data-section="identity" data-key="inspiration" type="number" min="0" step="1" value="${data.identity.inspiration}"><button type="button" data-inspiration-key="inspiration" data-inspiration-change="1" aria-label="Increase adventure points">+</button></div></div><div class="adventure-points-control"><label for="temporary-adventure-points">Temporary Adventure Points</label><div class="inspiration-controls"><button type="button" data-inspiration-key="temporaryAdventurePoints" data-inspiration-change="-1" aria-label="Decrease temporary adventure points">-</button><input id="temporary-adventure-points" data-section="identity" data-key="temporaryAdventurePoints" type="number" min="0" step="1" value="${data.identity.temporaryAdventurePoints}"><button type="button" data-inspiration-key="temporaryAdventurePoints" data-inspiration-change="1" aria-label="Increase temporary adventure points">+</button></div></div></div>`;
    inspirationField.querySelectorAll('[data-inspiration-change]').forEach(button => button.onclick = () => {
        const key = button.dataset.inspirationKey;
        data.identity[key] = Math.max(0, (Number.parseInt(data.identity[key], 10) || 0) + Number(button.dataset.inspirationChange));
        inspirationField.querySelector(`[data-key="${key}"]`).value = data.identity[key];
        changed();
    });
    identityCard.append(inspirationField, classTableField);
    updateXpAwardOptions();
    document.querySelectorAll('[data-section="identity"][data-key="level"], [data-section="identity"][data-key="xp"], [data-section="identity"][data-key="nextLevel"]').forEach(input => input.closest('.field')?.remove());
}

const thac0Tables = {
    fighter: [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    priest: [20, 20, 20, 18, 18, 18, 16, 16, 16, 14, 14, 14, 12, 12, 12, 10, 10, 10, 8, 8],
    wizard: [20, 20, 20, 20, 20, 19, 19, 19, 19, 18, 18, 18, 17, 17, 17, 16, 16, 16, 15, 15],
    rogue: [20, 20, 20, 19, 19, 19, 18, 18, 18, 17, 17, 17, 16, 16, 16, 15, 15, 15, 14, 14],
    psionicist: [20, 20, 20, 19, 19, 18, 18, 17, 17, 16, 16, 15, 15, 14, 14, 13, 13, 12, 12, 11]
};

function thac0Families(className) {
    const name = String(className || '').toLowerCase();
    const families = [];
    if (/fighter|ranger|paladin|barbarian/.test(name)) families.push('fighter');
    if (/priest|cleric|druid|witchdoctor|shaman/.test(name)) families.push('priest');
    if (/wizard|mage|specialist/.test(name)) families.push('wizard');
    if (/thief|bard|ninja/.test(name)) families.push('rogue');
    if (/psionicist/.test(name)) families.push('psionicist');
    return families;
}

function updateThac0() {
    const values = [];
    (data.identity.classEntries || []).forEach(entry => {
        const level = Number.parseInt(entry.level, 10);
        if (!Number.isInteger(level) || level < 1) return;
        thac0Families(entry.className).forEach(family => {
            const table = thac0Tables[family];
            values.push(table[Math.min(level, table.length) - 1]);
        });
    });
    if (!values.length) return;
    data.combat.thac0 = String(Math.min(...values) + globalModifierTotal('THAC0'));
    const calculation = (data.identity.classEntries || []).filter(entry => Number.parseInt(entry.level, 10) >= 1).map(entry => `${entry.className || 'class'} level ${entry.level}`).join('; ');
    document.querySelectorAll('[data-section="combat"][data-key="thac0"]').forEach(input => { input.value = data.combat.thac0; input.title = `Best THAC0: ${calculation}. The lowest class-table result is selected: ${data.combat.thac0}.`; });
    document.querySelectorAll('.thac0-summary-value').forEach(output => { output.textContent = data.combat.thac0; output.title = `Best THAC0 from ${calculation}; lowest result selected.`; });
    updateWeaponThac0();
}

const saveKeys = ['paralyzationPoison', 'rodStaffWand', 'petrificationPolymorph', 'breathWeapon', 'spell'];
const saveTables = {
    priest: [[1, 3, [10, 14, 13, 16, 15]], [4, 6, [9, 13, 12, 15, 14]], [7, 9, [7, 11, 10, 13, 12]], [10, 12, [6, 10, 9, 12, 11]], [13, 15, [5, 9, 8, 11, 10]], [16, 18, [4, 8, 7, 10, 9]], [19, 20, [2, 6, 5, 8, 7]]],
    rogue: [[1, 4, [13, 14, 12, 16, 15]], [5, 8, [12, 12, 11, 15, 13]], [9, 12, [11, 10, 10, 14, 11]], [13, 16, [10, 8, 9, 13, 9]], [17, 20, [9, 6, 8, 12, 7]], [21, 21, [8, 4, 7, 11, 5]]],
    fighter: [[0, 0, [16, 18, 17, 20, 19]], [1, 2, [14, 16, 15, 17, 17]], [3, 4, [13, 15, 14, 16, 16]], [5, 6, [11, 13, 12, 13, 14]], [7, 8, [10, 12, 11, 12, 13]], [9, 10, [8, 10, 9, 9, 11]], [11, 12, [7, 9, 8, 8, 10]], [13, 14, [5, 7, 6, 5, 8]], [15, 16, [4, 6, 5, 4, 7]], [17, 20, [3, 5, 4, 4, 6]]],
    wizard: [[1, 5, [14, 11, 13, 15, 12]], [6, 10, [13, 9, 11, 13, 10]], [11, 15, [11, 7, 9, 11, 8]], [16, 20, [10, 5, 7, 9, 6]], [21, 21, [8, 3, 5, 7, 4]]],
    psionicist: [[1, 4, [13, 15, 10, 16, 15]], [5, 8, [12, 13, 9, 15, 14]], [9, 12, [11, 11, 8, 13, 12]], [13, 16, [10, 9, 7, 12, 11]], [17, 20, [9, 7, 6, 11, 9]], [21, 21, [8, 5, 5, 9, 7]]]
};

function saveValues(family, level) {
    const range = saveTables[family]?.find(([minimum, maximum]) => level >= minimum && level <= maximum) || saveTables[family]?.[saveTables[family].length - 1];
    return range?.[2] || [];
}

function updateSavingThrows() {
    const best = Array(saveKeys.length).fill(Infinity);
    (data.identity.classEntries || []).forEach(entry => {
        const level = Number.parseInt(entry.level, 10);
        if (!Number.isInteger(level) || level < 1) return;
        thac0Families(entry.className).forEach(family => saveValues(family, level).forEach((value, index) => best[index] = Math.min(best[index], value)));
    });
    if (best.some(value => value === Infinity)) return;
    const calculation = (data.identity.classEntries || []).filter(entry => Number.parseInt(entry.level, 10) >= 1).map(entry => `${entry.className || 'class'} level ${entry.level}`).join('; ');
    saveKeys.forEach((key, index) => {
        data.saves[key] = String(best[index] + globalModifierTotal('Saving Throws', key));
        document.querySelectorAll(`[data-section="saves"][data-key="${key}"]`).forEach(input => { input.value = data.saves[key]; input.title = `Best ${key} save from ${calculation}; the lowest target number is selected: ${data.saves[key]}.`; });
    });
}

function updateRacialBonuses() {
    document.querySelectorAll('.racial-bonus').forEach(element => element.remove());
    Object.entries(data.racialBonuses).forEach(([ability, bonus]) => {
        const stat = document.querySelector(`.stat input[data-key="${ability}"]`)?.closest('.stat');
        if (!stat || typeof bonus !== 'number') return;
        const display = document.createElement('small');
        display.className = 'racial-bonus';
        display.textContent = `Racial ${bonus >= 0 ? '+' : ''}${bonus}`;
        stat.append(display);
    });
}

function setupStrengthControl() {
    document.querySelectorAll('.stat input[data-section="abilities"]').forEach(input => {
        const stat = input.closest('.stat');
        const ability = input.dataset.key.toUpperCase();
        if (!stat || stat.querySelector('.ability-step-control')) return;
        const control = document.createElement('div');
        control.className = 'ability-step-control';
        control.innerHTML = `<div class="ability-step-buttons"><button type="button" data-ability-step="1" aria-label="Increase ${ability}" title="Increase ${ability}">↑</button><button type="button" data-ability-step="-1" aria-label="Decrease ${ability}" title="Decrease ${ability}">↓</button></div>`;
        control.querySelectorAll('[data-ability-step]').forEach(button => button.onclick = () => {
            const current = input.value.trim();
            const exceptional = input.dataset.key === 'str' ? exceptionalStrengthValues(current) : null;
            const values = input.dataset.key === 'str' && warriorStrengthClass() ? strengthValues : strengthValues.filter(value => !value.includes('/'));
            const currentIndex = values.indexOf(current);
            const numeric = Number.parseInt(current, 10);
            const fallbackIndex = Number.isInteger(numeric) ? values.indexOf(String(Math.max(1, Math.min(25, numeric)))) : -1;
            const index = currentIndex >= 0 ? currentIndex : fallbackIndex;
            const direction = Number(button.dataset.abilityStep);
            const nextIndex = index < 0 ? direction > 0 ? 0 : values.length - 1 : Math.max(0, Math.min(values.length - 1, index + direction));
            if (nextIndex === index && index >= 0) return;
            input.value = values[nextIndex];
            input.dispatchEvent(new Event('input', { bubbles: true }));
        });
        stat.append(control);
    });
}

const strengthValues = [...Array.from({ length: 17 }, (_, index) => String(index + 1)), '18/01-50', '18/51-75', '18/76-90', '18/91-99', '18/00', ...Array.from({ length: 7 }, (_, index) => String(index + 19))];

function warriorStrengthClass() {
    return (data.identity.classEntries || []).some(entry => thac0Families(entry.className).includes('fighter'));
}

const visionTypes = ['Normal Vision', 'Low-Light Vision', "Infravision 30'", "Infravision 60'", "Infravision 90'", "Infravision 120'", 'Ultravision', 'Darkvision', 'Blindsight', 'Tremorsense', 'Scent'];

function setupVisionInput() {
    const identityCard = document.querySelector('.hero > .wide');
    if (!identityCard || identityCard.querySelector('#vision-type')) return;
    const field = document.createElement('div');
    field.className = 'field vision-field';
    const isPreset = visionTypes.includes(data.identity.visionType);
    field.innerHTML = `<label for="vision-type">Vision type</label><select id="vision-type"><option value="">Choose vision type</option>${visionTypes.map(type => `<option value="${esc(type)}" ${data.identity.visionType === type ? 'selected' : ''}>${esc(type)}</option>`).join('')}<option value="Other" ${isPreset || !data.identity.visionType ? '' : 'selected'}>Other</option></select><input id="manual-vision-type" placeholder="Enter custom vision or sense" value="${isPreset ? '' : esc(data.identity.visionType)}" ${isPreset || !data.identity.visionType ? 'hidden' : ''}>`;
    const select = field.querySelector('#vision-type');
    const manual = field.querySelector('#manual-vision-type');
    select.onchange = () => {
        manual.hidden = select.value !== 'Other';
        data.identity.visionType = select.value === 'Other' ? manual.value : select.value;
        changed();
    };
    manual.oninput = () => {
        data.identity.visionType = manual.value;
        changed();
    };
    const classTable = identityCard.querySelector('.class-entries-field');
    identityCard.insertBefore(field, classTable || null);
}

const abilityModifiers = {
    str: [-5, -3, -3, -2, -2, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 3, 3, 4, 5, 5, 5, 7],
    dex: [-6, -4, -3, -2, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 4, 4, 4, 5, 5],
    con: [-3, -2, -2, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 4, 2, 2, 2, 2, 2, 2, 2],
    int: [-5, -4, -3, -2, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 0, 0, 0, 0, 0, 0, 0],
    wis: [-5, -3, -3, -2, -2, -1, -1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 4, 4, 4, 4, 4, 4, 4],
    cha: [-8, -7, -6, -5, -4, -3, -2, -1, 0, 0, 0, 0, 1, 2, 3, 4, 4, 5, 8, 9, 10, 11, 12, 13, 14]
};

function modifier(ability, score) {
    const value = Number.parseInt(score, 10);
    return Number.isInteger(value) && value >= 1 && value <= 25
        ? abilityModifiers[ability][value - 1]
        : '';
}

function formatModifier(value) {
    return value === '' ? '-' : value >= 0 ? `+${value}` : `${value}`;
}

const bonusLabels = {
    str: 'Hit adjustment',
    dex: 'Reaction adjustment',
    con: 'Hit point adjustment',
    int: 'Chance to learn',
    wis: 'Magical defense',
    cha: 'Reaction adjustment'
};

const intelligenceLearningChance = [0, 0, 0, 0, 0, 0, 0, 0, 35, 40, 50, 55, 60, 65, 70, 75, 85, 90, 95, 96, 97, 98, 99, 100, 100];

function attributeBonus(ability, score) {
    const value = Number.parseInt(score, 10);
    if (!Number.isInteger(value) || value < 1 || value > 25) return `${bonusLabels[ability]}: -`;
    if (ability === 'int') return `${bonusLabels[ability]}: ${intelligenceLearningChance[value - 1]}%`;
    return `${bonusLabels[ability]}: ${formatModifier(modifier(ability, value))}`;
}

const bonusViews = {
    str: [['Hit adjustment', 'hit'], ['Damage adjustment', 'damage'], ['Weight allowance', 'weight'], ['Maximum press', 'max press'], ['Open doors', 'open doors'], ['Bend bars', 'bend bars']],
    dex: [['Reaction adjustment', 'reaction'], ['Missile attack', 'missile attack'], ['Defensive adjustment', 'defensive adjustment']],
    con: [['Hit point adjustment', 'hit point'], ['System shock', 'system shock'], ['Resurrection survival', 'resurrection survival'], ['Poison save', 'poison save'], ['Regeneration', 'regeneration']],
    int: [['Languages', 'languages'], ['Maximum spell level', 'spells up to'], ['Chance to learn', 'chance to learn'], ['Spells per level', 'spells per level'], ['Spell immunity', 'immune']],
    wis: [['Magical defense', 'magical defense'], ['Bonus priest spells', 'bonus priest spell'], ['Spell failure', 'spell failure'], ['Spell immunity', 'immune']],
    cha: [['Maximum henchmen', 'maximum henchmen'], ['Loyalty base', 'loyalty base'], ['Reaction adjustment', 'reaction adjustment']]
};
const bonusIndex = {};

function currentBenefitText(ability, score) {
    const value = Number.parseInt(score, 10);
    const points = abilityBenefits[ability];
    const active = Number.isInteger(value) && value >= 1 && value <= 25
        ? points.filter(([threshold]) => threshold <= value).pop()
        : null;
    return active ? active[1] : '';
}

function carouselText(ability, score) {
    const views = bonusViews[ability];
    const index = bonusIndex[ability] || 0;
    const [label, key] = views[index];
    const segment = abilityBenefitText(ability, score).split('; ').find(item => item.toLowerCase().startsWith(key));
    return `${label}: ${segment ? segment.slice(segment.indexOf(' ') + 1) : '-'}`;
}

function setupAbilityTooltips() {
    document.querySelectorAll('.stat').forEach(stat => {
        const tooltip = document.createElement('div');
        tooltip.className = 'stat-tooltip';
        const text = document.createElement('div');
        text.className = 'stat-tooltip-text';
        const ability = stat.querySelector('[data-section="abilities"]').dataset.key;
        text.innerHTML = abilityTooltipTable(ability, data.abilities[ability]);
        const pin = document.createElement('button');
        pin.type = 'button';
        pin.className = 'tooltip-pin';
        pin.classList.add('tooltip-pin-muted');
        pin.textContent = '\u{1F4CC}';
        pin.title = 'Keep this tooltip visible';
        pin.setAttribute('aria-label', 'Pin this tooltip');
        pin.onclick = event => {
            event.stopPropagation();
            const pinned = stat.classList.toggle('tooltip-pinned');
            pin.classList.toggle('tooltip-pin-muted', !pinned);
            pin.title = `${pinned ? 'Return this tooltip to hover behavior' : 'Keep this tooltip visible'}`;
            pin.setAttribute('aria-label', `${pinned ? 'Unpin' : 'Pin'} this tooltip`);
            if (!pinned) pin.blur();
        };
        const resize = document.createElement('button');
        resize.type = 'button';
        resize.className = 'tooltip-resize';
        resize.textContent = '\u{2922}';
        resize.title = 'Drag to resize tooltip';
        resize.setAttribute('aria-label', 'Drag to resize tooltip');
        resize.onpointerdown = event => {
            event.preventDefault();
            event.stopPropagation();
            const startY = event.clientY;
                const startX = event.clientX;
            const startHeight = tooltip.getBoundingClientRect().height;
                const startWidth = tooltip.getBoundingClientRect().width;
            const move = moveEvent => {
                const height = Math.max(120, Math.min(window.innerHeight - 24, startHeight + moveEvent.clientY - startY));
                    const minimumWidth = tooltip.parentElement.getBoundingClientRect().width * 2.25;
                    const width = Math.max(minimumWidth, Math.min(window.innerWidth - tooltip.getBoundingClientRect().left - 12, startWidth + moveEvent.clientX - startX));
                tooltip.style.height = `${height}px`;
                tooltip.style.maxHeight = `${height}px`;
                    tooltip.style.width = `${width}px`;
                    tooltip.style.right = 'auto';
            };
            const stop = () => {
                document.removeEventListener('pointermove', move);
                document.removeEventListener('pointerup', stop);
            };
            document.addEventListener('pointermove', move);
            document.addEventListener('pointerup', stop, { once: true });
        };
        tooltip.append(pin, text, resize);
        stat.append(tooltip);
        const positionTooltip = () => {
            const statBox = stat.getBoundingClientRect();
            const tooltipWidth = tooltip.getBoundingClientRect().width;
            const minimumLeft = 12 - statBox.left;
            const maximumLeft = document.documentElement.clientWidth - 24 - statBox.left - tooltipWidth;
            tooltip.style.right = 'auto';
            tooltip.style.left = `${Math.min(0, Math.max(minimumLeft, maximumLeft))}px`;
        };
        stat.addEventListener('mouseenter', positionTooltip);
        stat.addEventListener('focusin', positionTooltip);
        window.addEventListener('resize', positionTooltip);
    });
}

function setupCharacterHeader() {
    const hero = document.querySelector('.hero');
    hero.classList.add('character-header');
    const portrait = hero.querySelector('.portrait') || (() => {
        const image = document.createElement('img');
        image.className = 'portrait';
        image.alt = 'Character portrait';
        image.src = data.portraitUrl || PORTRAIT_PLACEHOLDER_DATA_URI;
        hero.append(image);
        return image;
    })();
    const applyPortraitSource = source => {
        const portraitSource = String(source || '').trim();
        portrait.classList.toggle('portrait-placeholder', !portraitSource);
        portrait.src = portraitSource || PORTRAIT_PLACEHOLDER_DATA_URI;
    };
    portrait.onerror = () => {
        portrait.classList.add('portrait-placeholder');
        portrait.src = PORTRAIT_PLACEHOLDER_DATA_URI;
    };
    applyPortraitSource(data.portraitUrl);
    const portraitArea = document.createElement('div');
    portraitArea.className = 'portrait-area';
    portrait.replaceWith(portraitArea);
    const portraitFrame = document.createElement('div');
    portraitFrame.className = 'portrait-frame';
    portraitFrame.append(portrait);
    const controls = document.createElement('div');
    controls.className = 'portrait-controls';
    const portraitField = document.querySelector('[data-root="portraitUrl"]')?.closest('.field') || (() => {
        const field = document.createElement('div');
        field.className = 'field';
        field.innerHTML = `<label>Portrait image URL (optional)</label><input data-root="portraitUrl" value="${esc(data.portraitUrl)}">`;
        return field;
    })();
    const refresh = document.createElement('button');
    refresh.type = 'button';
    refresh.className = 'portrait-action';
    refresh.textContent = 'Refresh';
    refresh.title = 'Reload portrait from the last saved URL';
    refresh.onclick = () => {
        applyPortraitSource(data.portraitUrl);
    };
    const expand = document.createElement('button');
    expand.type = 'button';
    expand.className = 'portrait-action';
    expand.textContent = 'Expand';
    expand.title = 'Open portrait at full size';
    expand.onclick = () => {
        const lightbox = document.querySelector('.lightbox');
        lightbox.querySelector('img').src = portrait.currentSrc || portrait.src;
        lightbox.hidden = false;
    };
    const portraitInput = portraitField.querySelector('[data-root="portraitUrl"]');
    if (portraitInput) portraitInput.addEventListener('change', () => applyPortraitSource(portraitInput.value));
    controls.append(portraitField, refresh, expand);
    portraitArea.append(portraitFrame, controls);

    const className = data.identity.classEntries?.[0]?.className || data.identity.className || 'Adventurer';
    const level = data.identity.classEntries?.[0]?.level || data.identity.level || '?';
    const badgeLabel = data.selectedBackground || 'Campaign badge';
    const initials = (data.identity.name || className).split(/\s+/).map(part => part[0] || '').join('').slice(0, 2).toUpperCase() || '??';
    const notesSource = String(data.notes || data.details.background || '').trim();
    const notesSnippet = notesSource ? `${notesSource.slice(0, 150)}${notesSource.length > 150 ? '...' : ''}` : 'Add notes to display a session snippet here.';
    const portraitMeta = document.createElement('article');
    portraitMeta.className = 'portrait-meta';
    portraitMeta.innerHTML = `<div class="portrait-emblem" aria-label="Campaign emblem"><strong>${esc(initials)}</strong><small>${esc(badgeLabel)}</small></div><div class="portrait-session"><h3>Session notes</h3><p>${esc(notesSnippet)}</p><small>${esc(className)} · Level ${esc(level)}</small></div>`;
    portraitArea.append(portraitMeta);

    const details = document.createElement('section');
    details.className = 'card character-details';
    details.innerHTML = `<h2>Character details</h2><div class="details-layout"><div class="details-basic">${fields('details', [['age', 'Age'], ['gender', 'Gender'], ['height', 'Height'], ['build', 'Build'], ['complexion', 'Complexion'], ['hair', 'Hair'], ['eyes', 'Eyes'], ['birthplace', 'Birthplace']])}</div><div class="detail-notes"><label>Personality</label><textarea data-section="details" data-key="personality">${esc(data.details.personality)}</textarea><label>Appearance</label><textarea data-section="details" data-key="appearance">${esc(data.details.appearance)}</textarea><label>Background</label><textarea data-section="details" data-key="background">${esc(data.details.background)}</textarea><label>Goals</label><textarea data-section="details" data-key="goals">${esc(data.details.goals)}</textarea><label>Fears</label><textarea data-section="details" data-key="fears">${esc(data.details.fears)}</textarea><label>Allies</label><textarea data-section="details" data-key="allies">${esc(data.details.allies)}</textarea><label>Enemies</label><textarea data-section="details" data-key="enemies">${esc(data.details.enemies)}</textarea></div></div>`;
    const actionReference = document.querySelector('.action-reference-section');
    if (actionReference) actionReference.before(details);
    else document.querySelector('.grid').after(details);

    document.querySelector('.lightbox')?.remove();
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.hidden = true;
    lightbox.innerHTML = '<button type="button" class="lightbox-close" aria-label="Close full-size portrait">×</button><img alt="Full-size character portrait">';
    lightbox.onclick = event => {
        if (event.target === lightbox || event.target.classList.contains('lightbox-close')) lightbox.hidden = true;
    };
    document.body.append(lightbox);
}

function setupNotesDrawer() {
    document.querySelector('.notes-drawer')?.remove();
    document.querySelector('.notes-drawer-tab')?.remove();
    const notesSection = [...document.querySelectorAll('.grid > .card')].find(card => card.querySelector(':scope > h2')?.textContent === 'Notes');
    const notesField = notesSection?.querySelector('[data-root="notes"]');
    if (notesField) {
        notesField.hidden = true;
        const launcher = document.createElement('button');
        launcher.type = 'button';
        launcher.textContent = 'Open notes drawer';
        launcher.onclick = () => openDrawer();
        notesField.after(launcher);
    }
    const drawer = document.createElement('aside');
    drawer.className = `notes-drawer${data.notesDrawerPinned ? ' notes-drawer-pinned' : ''}${data.notesDrawerMode === 'auto' ? ' notes-drawer-auto' : ''}`;
    drawer.innerHTML = '<div class="notes-drawer-header"><h2>Notes</h2><button type="button" data-notes-close aria-label="Close notes">×</button></div><div class="notes-drawer-options"><label><input type="checkbox" data-notes-pin> Pin open</label><label>Behavior<select data-notes-mode><option value="stub">Stub</option><option value="auto">Auto-hide</option></select></label></div><section class="notes-main-editor"><h3>Main note</h3><textarea data-main-note></textarea><small>Appears in the character summary.</small></section><section class="additional-notes"><h3>Additional notes</h3><div data-additional-notes></div><button type="button" data-note-add>Add note</button></section></aside>';
    document.body.append(drawer);
    const tab = document.createElement('div');
    tab.className = `notes-drawer-tab${data.notesDrawerMode === 'auto' ? ' notes-drawer-tab-auto' : ''}`;
    tab.setAttribute('aria-label', 'Open notes drawer');
    tab.innerHTML = '<span>Notes</span><button type="button" class="notes-tab-pin" data-notes-tab-pin aria-label="Pin notes drawer" aria-pressed="false" title="Pin notes drawer">📌</button>';
    document.body.append(tab);
    const tabPin = tab.querySelector('[data-notes-tab-pin]');
    const syncDrawerTop = () => {
        drawer.style.top = `${document.querySelector('.toolbar')?.offsetHeight || 0}px`;
    };
    syncDrawerTop();
    window.addEventListener('resize', syncDrawerTop);
    const syncTabPosition = () => { tab.style.right = drawer.classList.contains('notes-drawer-open') || data.notesDrawerPinned ? `${drawer.getBoundingClientRect().width}px` : '0px'; };
    const openDrawer = () => { drawer.classList.add('notes-drawer-open'); syncTabPosition(); };
    const closeDrawer = () => { if (!data.notesDrawerPinned && (data.notesDrawerMode === 'stub' || data.notesDrawerMode === 'auto')) { drawer.classList.remove('notes-drawer-open'); syncTabPosition(); } };
    tabPin.onclick = event => { event.stopPropagation(); data.notesDrawerPinned = !data.notesDrawerPinned; drawer.classList.toggle('notes-drawer-pinned', data.notesDrawerPinned); tabPin.classList.toggle('tooltip-pin-muted', data.notesDrawerPinned); tabPin.textContent = '📌'; tabPin.title = data.notesDrawerPinned ? 'Unpin notes drawer' : 'Pin notes drawer'; tabPin.setAttribute('aria-label', data.notesDrawerPinned ? 'Unpin notes drawer' : 'Pin notes drawer'); tabPin.setAttribute('aria-pressed', String(data.notesDrawerPinned)); if (data.notesDrawerPinned) openDrawer(); changed(); };
    tab.onmouseenter = openDrawer;
    tab.onclick = openDrawer;
    tab.onmouseleave = () => { if (data.notesDrawerMode === 'stub' || data.notesDrawerMode === 'auto') setTimeout(() => { if (!drawer.matches(':hover')) closeDrawer(); }, 120); };
    drawer.onmouseleave = closeDrawer;
    drawer.querySelector('[data-main-note]').value = data.notes;
    drawer.querySelector('[data-notes-pin]').checked = data.notesDrawerPinned;
    drawer.querySelector('[data-notes-mode]').value = data.notesDrawerMode;
    drawer.querySelector('[data-notes-close]').onclick = () => { drawer.classList.remove('notes-drawer-open'); syncTabPosition(); };
    drawer.querySelector('[data-notes-pin]').onchange = event => { data.notesDrawerPinned = event.target.checked; drawer.classList.toggle('notes-drawer-pinned', data.notesDrawerPinned); tabPin.classList.toggle('tooltip-pin-muted', data.notesDrawerPinned); tabPin.setAttribute('aria-pressed', String(data.notesDrawerPinned)); if (data.notesDrawerPinned) openDrawer(); else syncTabPosition(); changed(); };
    drawer.querySelector('[data-notes-mode]').onchange = event => { data.notesDrawerMode = event.target.value; drawer.classList.toggle('notes-drawer-auto', data.notesDrawerMode === 'auto'); tab.classList.toggle('notes-drawer-tab-auto', data.notesDrawerMode === 'auto'); if (data.notesDrawerMode === 'auto') openDrawer(); changed(); };
    drawer.querySelector('[data-main-note]').oninput = event => {
        data.notes = event.target.value;
        const summary = document.querySelector('.portrait-session p');
        if (summary) summary.textContent = data.notes.trim() ? `${data.notes.trim().slice(0, 150)}${data.notes.trim().length > 150 ? '...' : ''}` : 'Add notes to display a session snippet here.';
        changed();
    };
    const renderAdditionalNotes = () => {
        const target = drawer.querySelector('[data-additional-notes]');
        target.innerHTML = data.additionalNotes.map((note, index) => `<article class="note-item"><input data-note-title="${index}" value="${esc(note.title)}" placeholder="Note title"><textarea data-note-body="${index}" placeholder="Note text">${esc(note.body)}</textarea><label><input type="checkbox" data-note-pin-item="${index}" ${note.pinned ? 'checked' : ''}> Pin note</label><button type="button" data-note-delete="${index}">Delete</button></article>`).join('') || '<small>No additional notes.</small>';
        target.querySelectorAll('[data-note-title]').forEach(input => input.oninput = () => { data.additionalNotes[+input.dataset.noteTitle].title = input.value; changed(); });
        target.querySelectorAll('[data-note-body]').forEach(input => input.oninput = () => { data.additionalNotes[+input.dataset.noteBody].body = input.value; changed(); });
        target.querySelectorAll('[data-note-pin-item]').forEach(input => input.onchange = () => { data.additionalNotes[+input.dataset.notePinItem].pinned = input.checked; changed(); });
        target.querySelectorAll('[data-note-delete]').forEach(button => button.onclick = () => { data.additionalNotes.splice(+button.dataset.noteDelete, 1); changed(); renderAdditionalNotes(); });
    };
    drawer.querySelector('[data-note-add]').onclick = () => { data.additionalNotes.push({ id: `note-${Date.now()}`, title: 'New note', body: '', pinned: false }); changed(); renderAdditionalNotes(); };
    renderAdditionalNotes();
    tabPin.textContent = '📌';
    tabPin.classList.toggle('tooltip-pin-muted', data.notesDrawerPinned);
    tabPin.setAttribute('aria-pressed', String(data.notesDrawerPinned));
    tabPin.title = data.notesDrawerPinned ? 'Unpin notes drawer' : 'Pin notes drawer';
    syncTabPosition();
    document.querySelector('#notesBtn').onclick = openDrawer;
}

function setupQuickFactsFooter() {
    document.querySelector('.quick-facts-footer')?.remove();
    const app = document.querySelector('#app');
    if (!app) return;
    const primaryClass = data.identity.classEntries?.[0]?.className || data.identity.className || 'Unknown';
    const primaryLevel = data.identity.classEntries?.[0]?.level || data.identity.level || '-';
    const entries = [
        ['Character', data.identity.name || 'Unnamed'],
        ['Class', `${primaryClass} (L${primaryLevel})`],
        ['Race', data.raceSelection || data.identity.race || 'Unknown'],
        ['Alignment', data.identity.alignment || 'Unspecified'],
        ['HP', `${data.combat.hpCurrent || '-'} / ${data.combat.hpMax || '-'}`],
        ['AC / THAC0', `${data.combat.ac || '-'} / ${data.combat.thac0 || '-'}`],
        ['Languages', String(data.languages.length || 0)],
        ['Proficiencies', String(data.proficiencies.length || 0)],
        ['Inventory items', String(data.inventory.length || 0)],
        ['Tracked spells/abilities', String(data.spells.length || 0)]
    ];
    const section = document.createElement('section');
    section.className = 'card wide quick-facts-footer';
    section.innerHTML = `<h2>Quick facts</h2><div class="quick-facts-grid">${entries.map(([label, value]) => `<article><h3>${esc(label)}</h3><p>${esc(value)}</p></article>`).join('')}</div>`;
    app.append(section);
}

function setupSectionToggles() {
    document.querySelectorAll('[data-section="combat"][data-key="hpMax"], [data-section="combat"][data-key="hpCurrent"], [data-section="combat"][data-key="movement"]').forEach(input => {
        const heading = input.closest('.card')?.querySelector(':scope > h2');
        if (heading?.textContent.includes('Combat')) input.closest('.field')?.remove();
    });
    document.querySelectorAll('.grid > .card, .character-details').forEach(card => {
        const heading = card.querySelector(':scope > h2');
        if (!heading) return;
        const title = heading.textContent;
        const stateKey = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        card.dataset.sectionKey = stateKey;
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'section-toggle';
        const collapsed = data.sectionStates[stateKey] === true;
        card.classList.toggle('section-collapsed', collapsed);
        toggle.textContent = collapsed ? '+' : '-';
        toggle.title = `${collapsed ? 'Show' : 'Hide'} ${title}`;
        toggle.setAttribute('aria-label', `${collapsed ? 'Show' : 'Hide'} ${title}`);
        toggle.setAttribute('aria-expanded', String(!collapsed));
        toggle.onclick = () => {
            const collapsed = card.classList.toggle('section-collapsed');
            data.sectionStates[stateKey] = collapsed;
            toggle.textContent = collapsed ? '+' : '-';
            toggle.title = `${collapsed ? 'Show' : 'Hide'} ${title}`;
            toggle.setAttribute('aria-label', `${collapsed ? 'Show' : 'Hide'} ${title}`);
            toggle.setAttribute('aria-expanded', String(!collapsed));
            changed();
        };
        heading.textContent = '';
        heading.append(toggle, title);
        if (title === 'Abilities') {
            const summary = document.createElement('span');
            summary.className = 'ability-total';
            summary.textContent = `Total: ${abilityTotal()}`;
            heading.append(summary);
        }
    });
}

function setupSectionOrdering() {
    const cards = [...document.querySelectorAll('.grid > .card')];
    const defaultOrder = cards.map(card => card.dataset.sectionKey);
    const savedOrder = data.sectionOrder.filter(key => defaultOrder.includes(key));
    const order = [...savedOrder];
    defaultOrder.filter(key => !savedOrder.includes(key)).forEach(key => {
        const keyPosition = defaultOrder.indexOf(key);
        const nextSavedKey = order.find(savedKey => defaultOrder.indexOf(savedKey) > keyPosition);
        if (nextSavedKey) order.splice(order.indexOf(nextSavedKey), 0, key);
        else order.push(key);
    });
    order.forEach(key => {
        const card = cards.find(item => item.dataset.sectionKey === key);
        if (card) document.querySelector('.grid').append(card);
    });
    const orderedCards = [...document.querySelectorAll('.grid > .card')];
    orderedCards.forEach(card => {
        const heading = card.querySelector(':scope > h2');
        card.draggable = false;
        card.classList.add('section-reorderable');
        if (heading) heading.draggable = true;
        if (heading) heading.ondragstart = event => {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', card.dataset.sectionKey);
            card.classList.add('section-dragging');
        };
        if (heading) heading.ondragend = () => card.classList.remove('section-dragging');
        card.ondragover = event => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
        };
        card.ondrop = event => {
            event.preventDefault();
            const dragged = orderedCards.find(item => item.dataset.sectionKey === event.dataTransfer.getData('text/plain'));
            if (!dragged || dragged === card) return;
            const box = card.getBoundingClientRect();
            card.parentElement.insertBefore(dragged, event.clientY < box.top + box.height / 2 ? card : card.nextSibling);
            data.sectionOrder = [...document.querySelectorAll('.grid > .card')].map(item => item.dataset.sectionKey);
            changed();
            setupTableOfContents();
        };
    });
}

let tocSort = 'appearance-asc';

function setupTableOfContents() {
    document.querySelector('.table-of-contents')?.remove();
    const sections = [...document.querySelectorAll('.grid > .card, .character-details')];
    const nav = document.createElement('aside');
    nav.className = 'table-of-contents';
    nav.innerHTML = '<button type="button" class="toc-tab" aria-label="Open table of contents">Index</button><div class="toc-panel"><h2>Contents</h2><label class="toc-sort-label" for="toc-sort">Sort sections</label><select id="toc-sort" class="toc-sort"><option value="appearance-asc">Appearance: ascending</option><option value="appearance-desc">Appearance: descending</option><option value="alphabetical">Alphabetical</option></select><nav aria-label="Character sheet sections"></nav></div>';
    const list = nav.querySelector('nav');
    const entries = sections.map((section, index) => {
        const heading = section.querySelector(':scope > h2');
        if (!heading) return null;
        const title = heading.textContent.replace(/^[+-]/, '').replace(/Total:\s*\d+/, '').trim();
        const id = section.id || `section-${index}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        section.id = id;
        return { section, title, index, id };
    }).filter(Boolean);
    const renderLinks = () => {
        const sorted = [...entries].sort((a, b) => tocSort === 'alphabetical'
            ? a.title.localeCompare(b.title)
            : tocSort === 'appearance-desc' ? b.index - a.index : a.index - b.index);
        list.innerHTML = '';
        sorted.forEach(({ section, title, id }) => {
            const link = document.createElement('a');
            link.href = `#${id}`;
            link.textContent = title;
            link.onclick = event => {
                event.preventDefault();
                if (section.classList.contains('section-collapsed')) {
                    section.classList.remove('section-collapsed');
                    data.sectionStates[section.dataset.sectionKey] = false;
                    const toggle = section.querySelector(':scope > h2 .section-toggle');
                    if (toggle) {
                        toggle.textContent = '-';
                        toggle.setAttribute('aria-expanded', 'true');
                        toggle.setAttribute('aria-label', `Hide ${title}`);
                    }
                    changed();
                }
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                section.classList.add('toc-target');
                setTimeout(() => section.classList.remove('toc-target'), 3000);
            };
            list.append(link);
        });
    };
    const sort = nav.querySelector('.toc-sort');
    sort.value = tocSort;
    sort.onchange = () => {
        tocSort = sort.value;
        renderLinks();
    };
    renderLinks();
    document.body.append(nav);
}

function abilityTotal() {
    return Object.values(data.abilities).reduce((total, score) => {
        const value = Number.parseInt(score, 10);
        return total + (Number.isInteger(value) && value >= 1 && value <= 25 ? value : 0);
    }, 0);
}

function modifierBreakpoints(ability) {
    return abilityModifiers[ability].reduce((points, value, index) => {
        if (index === 0 || value !== points[points.length - 1].value) {
            points.push({ score: index + 1, value });
        }
        return points;
    }, []);
}

const abilityBenefits = {
    str: [
        [1, 'Hit -5; damage -4; weight 1; max press 3; open doors 1; bend bars 0%'],
        [2, 'Hit -3; damage -2; weight 1; max press 5; open doors 1; bend bars 0%'],
        [3, 'Hit -3; damage -1; weight 5; max press 10; open doors 2; bend bars 0%'],
        [4, 'Hit -2; damage -1; weight 10; max press 25; open doors 3; bend bars 0%'],
        [5, 'Hit -2; damage -1; weight 10; max press 25; open doors 3; bend bars 0%'],
        [6, 'Hit -1; damage None; weight 20; max press 55; open doors 4; bend bars 0%'],
        [7, 'Hit -1; damage None; weight 20; max press 55; open doors 4; bend bars 0%'],
        [8, 'Hit Normal; damage None; weight 35; max press 90; open doors 5; bend bars 1%'],
        [9, 'Hit Normal; damage None; weight 35; max press 90; open doors 5; bend bars 1%'],
        [10, 'Hit Normal; damage None; weight 40; max press 115; open doors 6; bend bars 2%'],
        [11, 'Hit Normal; damage None; weight 40; max press 115; open doors 6; bend bars 2%'],
        [12, 'Hit Normal; damage None; weight 45; max press 140; open doors 7; bend bars 4%'],
        [13, 'Hit Normal; damage None; weight 45; max press 140; open doors 7; bend bars 4%'],
        [14, 'Hit Normal; damage None; weight 55; max press 170; open doors 8; bend bars 7%'],
        [15, 'Hit Normal; damage None; weight 55; max press 170; open doors 8; bend bars 7%'],
        [16, 'Hit +1; damage +1; weight 70; max press 195; open doors 9; bend bars 10%'],
        [17, 'Hit +1; damage +1; weight 85; max press 220; open doors 10; bend bars 13%'],
        [18, 'Hit +1; damage +2; weight 110; max press 255; open doors 11; bend bars 16%'],
        [19, 'Hit +3; damage +7; weight 485; max press 640; open doors 16(8); bend bars 50% (Hill Giant)'],
        [20, 'Hit +3; damage +8; weight 535; max press 700; open doors 17(10); bend bars 60% (Stone Giant)'],
        [21, 'Hit +4; damage +9; weight 535; max press 700; open doors 17(10); bend bars 60% (Stone Giant)'],
        [22, 'Hit +4; damage +10; weight 635; max press 810; open doors 17(12); bend bars 70% (Frost Giant)'],
        [23, 'Hit +5; damage +11; weight 785; max press 970; open doors 18(14); bend bars 80% (Fire Giant)'],
        [24, 'Hit +6; damage +12; weight 935; max press 1,130; open doors 18(16); bend bars 90% (Cloud Giant)'],
        [25, 'Hit +7; damage +14; weight 1,535; max press 1,750; open doors 19(18); bend bars 99% (Titan)']
    ],
    dex: [
        [1, 'Reaction -6; missile attack -6; defensive adjustment +5'], [2, 'Reaction -4; missile attack -4; defensive adjustment +5'],
        [3, 'Reaction -3; missile attack -3; defensive adjustment +4'], [4, 'Reaction -2; missile attack -2; defensive adjustment +3'],
        [5, 'Reaction -1; missile attack -1; defensive adjustment +2'], [6, 'Reaction 0; missile attack 0; defensive adjustment +1'],
        [9, 'Reaction 0; missile attack 0; defensive adjustment 0'], [16, 'Reaction +1; missile attack +1; defensive adjustment -2'],
        [17, 'Reaction +2; missile attack +2; defensive adjustment -3'], [18, 'Reaction +2; missile attack +2; defensive adjustment -4'],
        [19, 'Reaction +3; missile attack +3; defensive adjustment -4'], [20, 'Reaction +3; missile attack +3; defensive adjustment -4'],
        [21, 'Reaction +4; missile attack +4; defensive adjustment -5'], [22, 'Reaction +4; missile attack +4; defensive adjustment -5'],
        [23, 'Reaction +4; missile attack +4; defensive adjustment -6'], [25, 'Reaction +5; missile attack +5; defensive adjustment -6']
    ],
    con: [
        [1, 'Hit point -3; system shock 25%; resurrection survival 30%; poison save -2; regeneration None'],
        [2, 'Hit point -2; system shock 30%; resurrection survival 35%; poison save -1; regeneration None'],
        [4, 'Hit point -1; system shock 40%; resurrection survival 45%; poison save 0; regeneration None'],
        [6, 'Hit point 0; system shock 50%; resurrection survival 55%; poison save 0; regeneration None'],
        [7, 'Hit point 0; system shock 55%; resurrection survival 60%; poison save 0; regeneration None'],
        [8, 'Hit point 0; system shock 60%; resurrection survival 65%; poison save 0; regeneration None'],
        [9, 'Hit point 0; system shock 65%; resurrection survival 70%; poison save 0; regeneration None'],
        [10, 'Hit point 0; system shock 70%; resurrection survival 75%; poison save 0; regeneration None'],
        [11, 'Hit point 0; system shock 75%; resurrection survival 80%; poison save 0; regeneration None'],
        [12, 'Hit point 0; system shock 80%; resurrection survival 85%; poison save 0; regeneration None'],
        [13, 'Hit point 0; system shock 85%; resurrection survival 90%; poison save 0; regeneration None'],
        [14, 'Hit point 0; system shock 88%; resurrection survival 92%; poison save 0; regeneration None'],
        [15, 'Hit point +1; system shock 90%; resurrection survival 94%; poison save 0; regeneration None'],
        [16, 'Hit point +2; system shock 95%; resurrection survival 96%; poison save 0; regeneration None'],
        [17, 'Hit point +2 (warrior +3); system shock 97%; resurrection survival 98%; poison save 0; regeneration None'],
        [18, 'Hit point +2 (warrior +3); system shock 99%; resurrection survival 100%; poison save 0; regeneration None'],
        [19, 'Hit point +2 (warrior +5); system shock 100%; resurrection survival 100%; poison save +1; regeneration 1/5 turns'],
        [20, 'Hit point +2 (warrior +5); system shock 100%; resurrection survival 100%; poison save +1; regeneration 1/5 turns'],
        [21, 'Hit point +2 (warrior +6); system shock 100%; resurrection survival 100%; poison save +2; regeneration 1/4 turns'],
        [22, 'Hit point +2 (warrior +6); system shock 100%; resurrection survival 100%; poison save +2; regeneration 1/3 turns'],
        [23, 'Hit point +2 (warrior +7); system shock 100%; resurrection survival 100%; poison save +3; regeneration 1/2 turns'],
        [25, 'Hit point +2 (warrior +7); system shock 100%; resurrection survival 100%; poison save +4; regeneration 1/1 turn']
    ],
    int: [
        [1, '0 bonus languages; no spell level, spell learning, or additional spells'], [9, '2 bonus languages; spells up to 4th level; 35% chance to learn; 7 spells per level'],
        [10, '2 bonus languages; spells up to 5th level; 40% chance to learn; 7 spells per level'], [11, '3 bonus languages; spells up to 6th level; 50% chance to learn; 9 spells per level'],
        [12, '3 bonus languages; spells up to 6th level; 55% chance to learn; 9 spells per level'], [13, '4 bonus languages; spells up to 7th level; 60% chance to learn; 9 spells per level'],
        [14, '4 bonus languages; spells up to 7th level; 65% chance to learn; 11 spells per level'], [15, '5 bonus languages; spells up to 8th level; 70% chance to learn; 11 spells per level'],
        [16, '5 bonus languages; spells up to 8th level; 75% chance to learn; 11 spells per level'], [17, '6 bonus languages; spells up to 9th level; 85% chance to learn; all spells per level'],
        [18, '7 bonus languages; spells up to 9th level; 90% chance to learn; all spells per level'], [19, '8 bonus languages; spells up to 9th level; 95% chance to learn; all spells; immune to 1st-level illusions'],
        [20, '9 bonus languages; spells up to 9th level; 96% chance to learn; all spells; immune to 1st- and 2nd-level illusions'],
        [21, '10 bonus languages; spells up to 9th level; 97% chance to learn; all spells; immune through 3rd-level illusions'],
        [22, '11 bonus languages; spells up to 9th level; 98% chance to learn; all spells; immune through 4th-level illusions'],
        [23, '12 bonus languages; spells up to 9th level; 99% chance to learn; all spells; immune through 5th-level illusions'],
        [24, '15 bonus languages; spells up to 9th level; 100% chance to learn; all spells; immune through 6th-level illusions'],
        [25, '20 bonus languages; spells up to 9th level; 100% chance to learn; all spells; immune through 7th-level illusions']
    ],
    wis: [
        [1, 'Magical defense -6; spell failure 100%'], [2, 'Magical defense -4; spell failure 60%'], [3, 'Magical defense -3; spell failure 50%'],
        [4, 'Magical defense -2; spell failure 40%'], [5, 'Magical defense -1; spell failure 30%'], [6, 'Magical defense -1; spell failure 25%'],
        [7, 'Magical defense 0; spell failure 20%'], [8, 'Magical defense 0; spell failure 15%'], [9, 'Magical defense 0; spell failure 10%'],
        [10, 'Magical defense 0; spell failure 5%'], [11, 'Magical defense 0; spell failure 0%'], [13, 'Magical defense 0; 1st-level bonus priest spell'],
        [14, 'Magical defense +1; 1st-level bonus priest spell'], [15, 'Magical defense +2; 2nd-level bonus priest spell'],
        [16, 'Magical defense +3; 2nd-level bonus priest spell'], [17, 'Magical defense +3; 3rd-level bonus priest spell'],
        [18, 'Magical defense +4; 4th-level bonus priest spell'], [19, 'Magical defense +4; 1st-level bonus priest spell; immune to cause fear, charm person, command, friends, hypnotism'],
        [20, 'Magical defense +4; 2nd- and 4th-level bonus priest spells; immune to forget, hold person, ray of enfeeblement, scare'],
        [21, 'Magical defense +4; 3rd- and 5th-level bonus priest spells; immune to charm monster, confusion, emotion, fumble, suggestion'],
        [22, 'Magical defense +4; 4th- and 5th-level bonus priest spells; immune to chaos, feeblemind, hold monster, magic jar, quest'],
        [23, 'Magical defense +4; 5th- and 5th-level bonus priest spells; immune to geas, mass suggestion, rod of rulership'],
        [24, 'Magical defense +4; 6th- and 6th-level bonus priest spells; immune to antipathy/sympathy, death spell, mass charm'],
        [25, 'Magical defense +4; 6th- and 7th-level bonus priest spells; immune to antipathy/sympathy, death spell, mass charm']
    ],
    cha: [
        [1, 'Maximum henchmen 0; loyalty base -8; reaction adjustment -7'], [2, 'Maximum henchmen 1; loyalty base -7; reaction adjustment -6'],
        [3, 'Maximum henchmen 1; loyalty base -6; reaction adjustment -5'], [4, 'Maximum henchmen 1; loyalty base -5; reaction adjustment -4'],
        [5, 'Maximum henchmen 2; loyalty base -4; reaction adjustment -3'], [6, 'Maximum henchmen 2; loyalty base -3; reaction adjustment -2'],
        [7, 'Maximum henchmen 3; loyalty base -2; reaction adjustment -1'], [8, 'Maximum henchmen 3; loyalty base -1; reaction adjustment 0'],
        [9, 'Maximum henchmen 4; loyalty base 0; reaction adjustment 0'], [11, 'Maximum henchmen 5; loyalty base 0; reaction adjustment 0'],
        [12, 'Maximum henchmen 5; loyalty base 0; reaction adjustment +1'], [13, 'Maximum henchmen 6; loyalty base +1; reaction adjustment +1'],
        [14, 'Maximum henchmen 6; loyalty base +1; reaction adjustment +2'], [15, 'Maximum henchmen 7; loyalty base +3; reaction adjustment +3'],
        [16, 'Maximum henchmen 8; loyalty base +4; reaction adjustment +5'], [17, 'Maximum henchmen 10; loyalty base +6; reaction adjustment +6'],
        [18, 'Maximum henchmen 15; loyalty base +8; reaction adjustment +7'], [19, 'Maximum henchmen 20; loyalty base +10; reaction adjustment +8'],
        [20, 'Maximum henchmen 25; loyalty base +12; reaction adjustment +9'], [21, 'Maximum henchmen 30; loyalty base +14; reaction adjustment +10'],
        [22, 'Maximum henchmen 35; loyalty base +16; reaction adjustment +11'], [23, 'Maximum henchmen 40; loyalty base +18; reaction adjustment +12'],
        [24, 'Maximum henchmen 45; loyalty base +20; reaction adjustment +13'], [25, 'Maximum henchmen 50; loyalty base +20; reaction adjustment +14']
    ]
};

const exceptionalStrengthNote = 'Exceptional Strength (fighters only): 18/01-50 +1 hit, +3 damage, weight 135, max press 280, open doors 12, bend bars 20%; 18/51-75 +2 hit, +3 damage, weight 160, max press 305, open doors 13, bend bars 25%; 18/76-90 +2 hit, +4 damage, weight 185, max press 330, open doors 14, bend bars 30%; 18/91-99 +2 hit, +5 damage, weight 235, max press 380, open doors 15(3), bend bars 35%; 18/00 +3 hit, +6 damage, weight 335, max press 480, open doors 16(6), bend bars 40%.';

function exceptionalStrengthValues(score) {
    const match = String(score || '').match(/^18\/(\d{2})(?:-(\d{2}))?$/);
    if (!match) return null;
    const percentile = Number(match[1]);
    if (percentile === 0) return { hit: 3, damage: 6, weight: 335, maxPress: 480, openDoors: '16(6)', bendBars: '40%' };
    if (percentile <= 50) return { hit: 1, damage: 3, weight: 135, maxPress: 280, openDoors: '12', bendBars: '20%' };
    if (percentile <= 75) return { hit: 2, damage: 3, weight: 160, maxPress: 305, openDoors: '13', bendBars: '25%' };
    if (percentile <= 90) return { hit: 2, damage: 4, weight: 185, maxPress: 330, openDoors: '14', bendBars: '30%' };
    return { hit: 2, damage: 5, weight: 235, maxPress: 380, openDoors: '15(3)', bendBars: '35%' };
}

function abilityBenefitText(ability, score) {
    const exceptional = ability === 'str' ? exceptionalStrengthValues(score) : null;
    if (exceptional) return `Hit +${exceptional.hit}; damage +${exceptional.damage}; weight ${exceptional.weight}; max press ${exceptional.maxPress}; open doors ${exceptional.openDoors}; bend bars ${exceptional.bendBars}`;
    return currentBenefitText(ability, score);
}

function abilityTooltip(ability, score) {
    const value = Number.parseInt(score, 10);
    const points = abilityBenefits[ability].map(([threshold, text]) => ({ score: threshold, text }));
    const exceptional = ability === 'str' ? exceptionalStrengthValues(score) : null;
    const active = exceptional ? { score: score, text: abilityBenefitText(ability, score) } : Number.isInteger(value) && value >= 1 && value <= 25
        ? points.filter(point => point.score <= value).pop()
        : null;
    const future = points.filter(point => !active || point.score > value);
    const lines = ['Ability scores show strengths and weaknesses; class, race, and roleplay also matter.', ''];
    if (ability === 'str') lines.push('Enter exceptional Strength as 18/01-00. At 17, use the up arrow to start 18/01, then edit the percentile manually.', '');
    lines.push(...(active
        ? [`Enabled at ${active.score}:`, active.text]
        : ['Enter a score from 1 to 25.']));
    if (future.length) {
        lines.push('Future breakpoints:');
        lines.push(...future.map(point => `${point.score}: ${point.text}`));
    }
    if (ability === 'str') lines.push('', exceptionalStrengthNote);
    return lines.join('\n');
}

const benefitColumns = {
    str: [['Hit', 'hit'], ['Damage', 'damage'], ['Weight', 'weight'], ['Max press', 'max press'], ['Open doors', 'open doors'], ['Bend bars', 'bend bars']],
    dex: [['Reaction', 'reaction'], ['Missile attack', 'missile attack'], ['Defensive', 'defensive adjustment']],
    con: [['Hit points', 'hit point'], ['System shock', 'system shock'], ['Resurrection', 'resurrection survival'], ['Poison save', 'poison save'], ['Regeneration', 'regeneration']],
    int: [['Languages', 'languages'], ['Spell level', 'spells up to'], ['Learn chance', 'chance to learn'], ['Spells/level', 'spells per level'], ['Immunity', 'immune']],
    wis: [['Magic defense', 'magical defense'], ['Bonus spells', 'bonus priest spell'], ['Spell failure', 'spell failure'], ['Immunity', 'immune']],
    cha: [['Henchmen', 'maximum henchmen'], ['Loyalty', 'loyalty base'], ['Reaction', 'reaction adjustment']]
};

function abilityTooltipTable(ability, score) {
    const value = Number.parseInt(score, 10);
    const activeScore = exceptionalStrengthValues(score) ? 18 : Number.isInteger(value) && value >= 1 && value <= 25
        ? abilityBenefits[ability].filter(([threshold]) => threshold <= value).pop()?.[0]
        : null;
    const columns = benefitColumns[ability];
    const headers = columns.map(([label]) => `<th scope="col">${label}</th>`).join('');
    const rows = abilityBenefits[ability].map(([threshold, text]) => {
        const segments = text.split('; ');
        const lowerSegments = segments.map(segment => segment.toLowerCase());
        const cells = columns.map(([, key], index) => {
            const segmentIndex = lowerSegments.findIndex(segment => segment.includes(key));
            const segment = segmentIndex >= 0 ? segments[segmentIndex] : '';
            const labelStart = segmentIndex >= 0 ? lowerSegments[segmentIndex].indexOf(key) : -1;
            const value = key === 'spells per level' && lowerSegments.some(segment => segment.includes('all spells'))
                ? 'All'
                : labelStart >= 0 ? segment.slice(labelStart + key.length).trim() : '';
            return `<td>${esc(value || (segment ? segment : '-'))}</td>`;
        }).join('');
        const special = !columns.some(([, key]) => lowerSegments.some(segment => segment.includes(key)));
        return `<tr class="${threshold === activeScore ? 'active-breakpoint' : ''}"><th scope="row">${threshold}</th>${special ? `<td colspan="${columns.length}">${esc(text)}</td>` : cells}</tr>`;
    }).join('');
    return `<p class="tooltip-intro">Ability scores show strengths and weaknesses; class, race, and roleplay also matter.</p>${ability === 'str' ? '<p class="tooltip-note"><strong>Format:</strong> Enter exceptional Strength as 18/01-00. At 17, use the up arrow to start 18/01, then edit the percentile manually.</p>' : ''}<table class="tooltip-table"><thead><tr><th scope="col">Score</th>${headers}</tr></thead><tbody>${rows}</tbody></table>${ability === 'str' ? `<p class="tooltip-note"><strong>Exceptional Strength:</strong> ${esc(exceptionalStrengthNote.replace('Exceptional Strength (fighters only): ', ''))}</p>` : ''}`;
}

function currentBenefitValues(ability, score) {
    const value = Number.parseInt(score, 10);
    const active = exceptionalStrengthValues(score) ? [18, abilityBenefitText(ability, score)] : Number.isInteger(value) && value >= 1 && value <= 25
        ? abilityBenefits[ability].filter(([threshold]) => threshold <= value).pop()
        : null;
    if (!active) return { score: '-', values: benefitColumns[ability].map(() => '-') };
    const text = active[1];
    const segments = text.split('; ');
    const aliases = { 'hit point': ['hit point', 'hit points'], 'resurrection survival': ['resurrection survival'], 'maximum henchmen': ['maximum henchmen'] };
    const values = benefitColumns[ability].map(([, key]) => {
        const labels = aliases[key] || [key];
        const match = segments.map(segment => ({ segment, lower: segment.toLowerCase() })).find(({ lower }) => labels.some(label => lower.startsWith(label)));
        if (!match) return '-';
        const label = labels.find(value => match.lower.startsWith(value));
        return match.segment.slice(label.length).trim() || match.segment;
    });
    return { score: value, values };
}

function abilitySummaryHTML() {
    return Object.keys(labels).map(ability => {
        const columns = benefitColumns[ability];
        const current = currentBenefitValues(ability, currentAbilityScore(ability));
        return `<div class="ability-summary-row"><div class="ability-summary-name">${labels[ability]}<span>${current.score}</span></div><table class="ability-summary-table"><thead><tr>${columns.map(([label]) => `<th>${label}</th>`).join('')}</tr></thead><tbody><tr>${current.values.map(value => `<td>${esc(value)}</td>`).join('')}</tr></tbody></table></div>`;
    }).join('');
}

function updateAbilitySummary() {
    const summary = document.querySelector('.ability-summary-content');
    if (summary) summary.innerHTML = abilitySummaryHTML();
}

function setupAbilitySummary() {
    const abilities = [...document.querySelectorAll('.grid > .card')].find(card => card.querySelector(':scope > h2')?.textContent.includes('ABILITIES'));
    if (!abilities) return;
    abilities.classList.add('abilities-modifiers-card');
    const summary = document.createElement('div');
    summary.className = 'ability-summary';
    summary.innerHTML = '<h3>Current ability benefits</h3><div class="ability-summary-content"></div>';
    summary.querySelector('.ability-summary-content').innerHTML = abilitySummaryHTML();
    abilities.append(summary);
}

function defensiveAdjustment(score) {
    const value = Number.parseInt(score, 10);
    if (!Number.isInteger(value) || value < 1 || value > 25) return '';
    const adjustments = [5, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -2, -3, -4, -4, -4, -5, -5, -6, -6, -6];
    return adjustments[value - 1];
}

function bladesingerLevel() {
    const isBladesinger = String(data.identity.classKit || '').toLowerCase().includes('bladesinger') || (data.identity.classEntries || []).some(entry => String(entry.className || '').toLowerCase().includes('bladesinger'));
    if (!isBladesinger) return '';
    const levels = (data.identity.classEntries || []).filter(entry => String(entry.className || '').toLowerCase().includes('bladesinger')).map(entry => Number.parseInt(entry.level, 10)).filter(Number.isInteger);
    return levels[0] || Number.parseInt(data.identity.level, 10) || '';
}

function bladesingerCastingAdjustment() {
    const level = bladesingerLevel();
    return Number.isInteger(level) && level > 0 ? -(Math.floor(level / 2) + 1) : '';
}

function updateAcTotal() {
    const total = document.querySelector('.ac-total-value');
    const baseValue = document.querySelector('.ac-base-value');
    const adjustment = document.querySelector('.ac-defensive-adjustment');
    if (!total || !baseValue || !adjustment) return;
    const rows = data.combat.acItems || [];
    const activeRows = rows.filter(item => item.equipped !== false);
    const appliesTo = (item, target) => !item.appliesTo || item.appliesTo === 'Default' || item.appliesTo === target;
    const armor = activeRows.find(item => item.type === 'armor' && appliesTo(item, 'AC'));
    const armorValue = Number.parseInt(armor?.value, 10);
    const legacyBase = Number.parseInt(data.combat.ac, 10);
    const base = Number.isInteger(armorValue) ? armorValue : rows.length ? '' : legacyBase;
    const dexAdjustment = defensiveAdjustment(data.abilities.dex);
    const itemAdjustment = activeRows.filter(item => item.type !== 'armor' && appliesTo(item, 'AC')).reduce((sum, item) => {
        const value = Number.parseInt(item.value, 10);
        return sum + (Number.isInteger(value) ? value : 0);
    }, 0);
    const shieldAdjustment = activeRows.filter(item => item.type === 'shield' && appliesTo(item, 'AC')).reduce((sum, item) => sum + (Number.parseInt(item.value, 10) || 0), 0);
    const variantAdjustment = target => activeRows.filter(item => item.type !== 'armor' && item.type !== 'shield' && appliesTo(item, target)).reduce((sum, item) => sum + (Number.parseInt(item.value, 10) || 0), 0);
    const surprisedAdjustment = variantAdjustment('Surprised AC');
    const shieldlessAdjustment = variantAdjustment('Shieldless AC');
    const rearAdjustment = variantAdjustment('Rear AC');
    const missileAdjustment = variantAdjustment('Missile AC') + activeRows.filter(item => item.type === 'shield' && appliesTo(item, 'Missile AC')).reduce((sum, item) => sum + (Number.parseInt(item.value, 10) || 0), 0);
    const totalValue = Number.isInteger(base) && dexAdjustment !== '' ? base + dexAdjustment + itemAdjustment + globalModifierTotal('Armor Class') : '';
    const castingAdjustment = bladesingerCastingAdjustment();
    const castingValue = totalValue !== '' && castingAdjustment !== '' && data.combat.bladesingerCastingActive ? totalValue + castingAdjustment : '';
    const missileValue = totalValue === '' ? '' : totalValue + missileAdjustment + targetedGlobalModifierTotal('Armor Class', 'Missile AC');
    baseValue.textContent = Number.isInteger(base) ? base : '-';
    total.textContent = totalValue === '' ? '-' : totalValue;
    adjustment.textContent = dexAdjustment === '' ? '-' : formatModifier(dexAdjustment);
    const castingOutput = document.querySelector('.bladesinger-casting-value');
    if (castingOutput) {
        castingOutput.textContent = castingValue === '' ? '-' : castingValue;
        castingOutput.title = castingAdjustment === '' ? 'Enter a Bladesinger class or kit and level to calculate casting defense.' : `Casting melee AC = normal AC ${totalValue === '' ? '-' : totalValue} + Bladesinger casting adjustment ${castingAdjustment} = ${castingValue === '' ? '-' : castingValue}. Applies only while casting against front or side melee attacks.`;
    }
    const activeDescription = activeRows.map(item => `${item.name || 'unnamed'} ${item.value || 0}`).join(' + ') || 'none';
    total.title = `AC total = ${Number.isInteger(base) ? base : 'base AC'} + DEX defense ${dexAdjustment === '' ? '?' : dexAdjustment} + active adjustments (${activeDescription}). Lower AC is better.`;
    baseValue.title = `Base AC comes from the equipped armor row${armor ? `: ${armor.name || 'unnamed armor'} = ${armor.value}` : ' or the legacy Armor class field'}.`;
    adjustment.title = `DEX defensive adjustment from DEX ${data.abilities.dex || '?'}: ${dexAdjustment === '' ? 'enter a score from 1 to 25' : dexAdjustment}.`;
    const values = {
        ac: Number.isInteger(base) ? String(base) : '',
        surprisedAc: totalValue === '' || !Number.isInteger(dexAdjustment) ? '' : String(base + surprisedAdjustment + globalModifierTotal('Armor Class')),
        shieldlessAc: totalValue === '' ? '' : String(base + dexAdjustment + shieldlessAdjustment + globalModifierTotal('Armor Class')),
        rearAc: totalValue === '' ? '' : String(base + rearAdjustment + globalModifierTotal('Armor Class') + 2),
        missileAc: missileValue === '' ? '' : String(missileValue)
    };
    Object.entries(values).forEach(([key, value]) => {
        data.combat[key] = value;
        document.querySelectorAll(`[data-section="combat"][data-key="${key}"]`).forEach(input => input.value = value);
    });
    const acTooltips = {
        ac: `Base AC: ${base === '' ? '-' : base}. This is the equipped armor value before DEX and active adjustments.`,
        surprisedAc: `Surprised AC = base AC ${base === '' ? '-' : base} + active non-DEX adjustments ${itemAdjustment >= 0 ? '+' : ''}${itemAdjustment}. DEX defense is omitted.`,
        shieldlessAc: `Shieldless AC = total AC ${totalValue === '' ? '-' : totalValue} - active shield adjustment ${shieldAdjustment}.`,
        rearAc: `Rear AC = total AC ${totalValue === '' ? '-' : totalValue} + 2 for a rear attack.`,
        missileAc: `Missile AC = normal AC ${totalValue === '' ? '-' : totalValue} + missile-specific item adjustments ${missileAdjustment} + global modifiers ${targetedGlobalModifierTotal('Armor Class', 'Missile AC')}.`
    };
    Object.entries(acTooltips).forEach(([key, title]) => document.querySelectorAll(`[data-section="combat"][data-key="${key}"]`).forEach(input => input.title = title));
}

const acItemPresets = [
    ['None / unarmored', 'armor', 10], ['Leather / padded', 'armor', 8], ['Studded leather', 'armor', 7], ['Ring mail', 'armor', 7], ['Brigandine', 'armor', 6], ['Scale mail', 'armor', 6], ['Hide', 'armor', 6], ['Chain mail', 'armor', 5], ['Splint mail', 'armor', 4], ['Banded mail', 'armor', 4], ['Bronze plate mail', 'armor', 4], ['Plate mail', 'armor', 3], ['Field plate', 'armor', 2], ['Full plate', 'armor', 1],
    ['Small shield', 'shield', -1], ['Wooden small shield (crude)', 'shield', -1], ['Medium shield', 'shield', -1], ['Large / body shield', 'shield', -1], ['Shield +1', 'shield', -2], ['Ring of protection +1', 'magic', -1], ['Cloak of protection +1', 'magic', -1], ['Armor +1', 'magic', -1], ['Blur', 'spell', -3], ['Cover', 'cover', -2], ['Natural armor', 'natural', 10]
];

function acItemRowsHTML() {
    const types = [['shield', 'Shield'], ['magic', 'Magic item'], ['spell', 'Spell'], ['cover', 'Cover'], ['natural', 'Natural armor'], ['other', 'Other']];
    const targets = ['Default', 'AC', 'Missile AC', 'Shieldless AC', 'Surprised AC', 'Rear AC', 'Casting Melee AC'];
    return (data.combat.acItems || []).map((item, index) => {
        const presetItem = acItemPresets.some(([name]) => name === item.name);
        return `<tr><td><input class="ac-active" type="checkbox" data-ac-item="${index}" data-ac-key="equipped" aria-label="Equipped or active" title="Equipped or active" ${item.equipped !== false ? 'checked' : ''}></td><td><select data-ac-preset="${index}"><option value="Other" ${presetItem ? '' : 'selected'}>Other</option>${acItemPresets.map(([name, type, value]) => `<option value="${esc(name)}" ${item.name === name ? 'selected' : ''}>${esc(name)}</option>`).join('')}</select><input data-ac-item="${index}" data-ac-key="name" value="${esc(item.name)}" placeholder="Item or defense" ${presetItem ? 'hidden' : ''}></td><td><select data-ac-item="${index}" data-ac-key="type"><option value="armor" ${item.type === 'armor' ? 'selected' : ''}>Armor</option>${types.map(([value, label]) => `<option value="${value}" ${item.type === value ? 'selected' : ''}>${label}</option>`).join('')}</select></td><td><select data-ac-item="${index}" data-ac-key="appliesTo">${targets.map(target => `<option value="${target}" ${item.appliesTo === target || (!item.appliesTo && target === 'Default') ? 'selected' : ''}>${target}</option>`).join('')}</select></td><td><input class="ac-item-value" type="number" data-ac-item="${index}" data-ac-key="value" value="${esc(item.value)}" step="1" placeholder="0"></td><td><button type="button" class="remove" data-ac-remove="${index}" aria-label="Remove defense">×</button></td></tr>`;
    }).join('');
}

function setupAcSection() {
    const section = document.createElement('div');
    section.className = 'ac-section';
    section.innerHTML = `<div class="ac-layout"><div class="ac-shield" aria-label="Armor class total"><span class="ac-shield-label">AC</span><strong class="ac-total-value">-</strong></div><div class="thac0-mark" aria-label="THAC0 total"><span class="thac0-mark-blade thac0-mark-blade-one"></span><span class="thac0-mark-blade thac0-mark-blade-two"></span><span class="thac0-mark-label">THAC0</span><strong class="thac0-summary-value">${esc(data.combat.thac0 || '-')}</strong></div><div class="ac-breakdown"><p><span>Armor class</span><strong class="ac-base-value">-</strong></p><p><span>DEX defense</span><strong class="ac-defensive-adjustment">-</strong></p><p><span>Missile AC</span><strong class="missile-ac-value">-</strong></p><label class="bladesinger-toggle"><input type="checkbox" data-bladesinger-toggle ${data.combat.bladesingerCastingActive ? 'checked' : ''}> Bladesinger casting defense</label><p><span>Casting melee AC</span><strong class="bladesinger-casting-value">-</strong></p><small>Lower AC is better. Casting defense applies only to front/side melee attacks.</small><nav class="combat-reference-links" aria-label="Combat breakdown references"><a href="#ac-reference">AC breakdown</a><a href="#thac0-reference">THAC0 breakdown</a></nav></div><div class="ac-items"><h3>Defenses and equipment</h3><table class="ac-items-table"><thead><tr><th>Active</th><th>Item / defense</th><th>Type</th><th>Applies to</th><th>AC change</th><th></th></tr></thead><tbody>${acItemRowsHTML()}</tbody></table><button type="button" class="add" data-ac-add>Add defense</button><small>Only equipped / active entries apply. Default applies to the normal AC behavior; targeted entries affect only their selected AC mode.</small></div></div>`;
    const referenceLinks = section.querySelector('.combat-reference-links');
    const acLink = referenceLinks?.querySelector('a[href="#ac-reference"]');
    const thac0Link = referenceLinks?.querySelector('a[href="#thac0-reference"]');
    const shield = section.querySelector('.ac-shield');
    const thac0 = section.querySelector('.thac0-mark');
    if (acLink) {
        acLink.className = 'combat-reference-link';
        const shieldWrap = document.createElement('div');
        shieldWrap.className = 'combat-emblem';
        shield.replaceWith(shieldWrap);
        shieldWrap.append(shield, acLink);
    }
    if (thac0Link) {
        thac0Link.className = 'combat-reference-link';
        const thac0Wrap = document.createElement('div');
        thac0Wrap.className = 'combat-emblem';
        thac0.replaceWith(thac0Wrap);
        thac0Wrap.append(thac0, thac0Link);
    }
    referenceLinks?.remove();
    section.querySelector('[data-bladesinger-toggle]').onchange = event => {
        data.combat.bladesingerCastingActive = event.target.checked;
        updateAcTotal();
        changed();
    };
    const combat = [...document.querySelectorAll('.grid > .card')].find(card => card.querySelector(':scope > h2')?.textContent === 'Combat');
    if (combat) {
        combat.classList.remove('half');
        combat.classList.add('wide', 'combat-card');
        combat.append(section);
        const acLayout = section.querySelector('.ac-layout');
        const acItems = acLayout.querySelector('.ac-items');
        const combatFields = combat.querySelector(':scope > .fields');
        const topLayout = document.createElement('div');
        topLayout.className = 'combat-top-layout';
        topLayout.append(acLayout.querySelector('.combat-emblem'), acLayout.querySelector('.combat-emblem:nth-child(2)'), acLayout.querySelector('.ac-breakdown'), combatFields);
        const equipmentLayout = document.createElement('div');
        equipmentLayout.className = 'combat-equipment-layout';
        equipmentLayout.append(acItems);
        combat.insertBefore(topLayout, section);
        section.replaceChildren(equipmentLayout);
    }
    section.querySelector('[data-ac-add]').onclick = () => {
        data.combat.acItems.push({ name: '', type: 'other', value: '', appliesTo: 'Default', equipped: true });
        changed();
        render();
    };
    section.querySelectorAll('[data-ac-item]').forEach(input => input.oninput = () => {
        const item = data.combat.acItems[+input.dataset.acItem];
        item[input.dataset.acKey] = input.type === 'checkbox' ? input.checked : input.value;
        updateAcTotal();
        changed();
    });
    section.querySelectorAll('[data-ac-item][type="checkbox"]').forEach(input => input.onchange = () => {
        const item = data.combat.acItems[+input.dataset.acItem];
        item.equipped = input.checked;
        if (input.checked && item.type === 'armor') {
            data.combat.acItems.forEach((other, index) => {
                if (index !== +input.dataset.acItem && other.type === 'armor') other.equipped = false;
            });
        }
        changed();
        render();
    });
    section.querySelectorAll('[data-ac-preset]').forEach(select => select.onchange = () => {
        const preset = acItemPresets.find(item => item[0] === select.value);
        const item = data.combat.acItems[+select.dataset.acPreset];
        if (!preset) {
            item.name = '';
            changed();
            render();
            return;
        }
        data.combat.acItems[+select.dataset.acPreset] = { name: preset[0], type: preset[1], value: String(preset[2]), appliesTo: 'Default', equipped: true };
        changed();
        render();
    });
    section.querySelectorAll('[data-ac-remove]').forEach(button => button.onclick = () => {
        data.combat.acItems.splice(+button.dataset.acRemove, 1);
        changed();
        render();
    });
    updateAcTotal();
}

function setupMissileAcField() {
    const combat = [...document.querySelectorAll('.grid > .card')].find(card => card.querySelector(':scope > h2')?.textContent.includes('Combat'));
    const fields = combat?.querySelector('.combat-top-layout > .fields, :scope > .fields');
    if (!fields || fields.querySelector('[data-key="missileAc"]')) return;
    const field = document.createElement('div');
    field.className = 'field';
    field.innerHTML = '<label>Missile AC</label><input data-section="combat" data-key="missileAc" value="">';
    fields.append(field);
}

function setupHitPointsSection() {
    const section = document.createElement('section');
    section.className = 'card wide hit-points-section';
    section.innerHTML = `<h2>Hit points, wounds, saves, and resistances</h2><div class="hit-points-layout"><div class="hit-points-fields"><div class="hp-heart health-quarters-0" aria-live="polite"><span class="heart-quarter heart-quarter-tl" aria-hidden="true"></span><span class="heart-quarter heart-quarter-bl" aria-hidden="true"></span><span class="heart-quarter heart-quarter-tr" aria-hidden="true"></span><span class="heart-quarter heart-quarter-br" aria-hidden="true"></span><span class="heart-outline" aria-hidden="true"></span><span class="heart-shine heart-shine-one" aria-hidden="true"></span><span class="heart-shine heart-shine-two" aria-hidden="true"></span><span class="heart-shine heart-shine-three" aria-hidden="true"></span><strong class="hp-total">0 / 0</strong><small>Total HP</small></div>${fields('combat', [['hpMax', 'Maximum'], ['hpCurrent', 'Current'], ['hpBonus', 'Bonus']])}<div class="hp-actions"><label>Amount</label><input class="hp-action-amount" type="number" min="0" step="1" value="1"><button type="button" class="hp-action" data-hp-action="damage">Take damage</button><button type="button" class="hp-action" data-hp-action="heal">Heal</button></div></div><div class="wounds-field"><label>Wounds</label><textarea data-root="wounds">${esc(data.wounds)}</textarea></div></div>`;
    section.querySelectorAll('[data-hp-action]').forEach(button => button.onclick = () => {
        const previousCurrent = Math.max(0, Number.parseInt(data.combat.hpCurrent, 10) || 0);
        const previousBonus = Math.max(0, Number.parseInt(data.combat.hpBonus, 10) || 0);
        const previousTotal = previousCurrent + previousBonus;
        const amount = Math.max(0, Number.parseInt(section.querySelector('.hp-action-amount').value, 10) || 0);
        let bonus = Math.max(0, Number.parseInt(data.combat.hpBonus, 10) || 0);
        let current = Math.max(0, Number.parseInt(data.combat.hpCurrent, 10) || 0);
        const maximum = Math.max(0, Number.parseInt(data.combat.hpMax, 10) || 0);
        if (button.dataset.hpAction === 'damage') {
            const bonusDamage = Math.min(bonus, amount);
            bonus -= bonusDamage;
            current = Math.max(0, current - (amount - bonusDamage));
        } else {
            current = Math.min(maximum, current + amount);
        }
        data.combat.hpBonus = String(bonus);
        data.combat.hpCurrent = String(current);
        section.querySelector('[data-key="hpBonus"]').value = data.combat.hpBonus;
        section.querySelector('[data-key="hpCurrent"]').value = data.combat.hpCurrent;
        updateHitPointDisplay();
        updateCampRecoverySummary();
        const currentTotal = current + bonus;
        const effectiveMaximum = maximum + bonus;
        const previousEffectiveMaximum = maximum + previousBonus;
        const previousQuarter = previousEffectiveMaximum ? Math.floor(Math.max(0, Math.min(100, (previousTotal / previousEffectiveMaximum) * 100)) / 25) : 0;
        const currentQuarter = effectiveMaximum ? Math.floor(Math.max(0, Math.min(100, (currentTotal / effectiveMaximum) * 100)) / 25) : 0;
        if (button.dataset.hpAction === 'damage' && currentQuarter < previousQuarter) flashHeart('damage');
        if (button.dataset.hpAction === 'heal' && current > previousCurrent) flashHeart('heal');
        changed();
    });
    document.querySelector('.ability-summary')?.closest('.card')?.after(section);
    const savingCard = [...document.querySelectorAll('.grid > .card')].find(card => card.querySelector(':scope > h2')?.textContent.includes('Saving throws'));
    if (savingCard) {
        const savingPanel = document.createElement('div');
        savingPanel.className = 'saving-throws-panel';
        savingPanel.append(savingCard.querySelector(':scope > h2'), savingCard.querySelector(':scope > .fields'));
        section.querySelector('.hit-points-layout').append(savingPanel);
        savingCard.remove();
    }
    updateHitPointDisplay();
}

function flashHeart(type) {
    const heart = document.querySelector('.hp-heart');
    if (!heart) return;
    const heartFields = heart.closest('.hit-points-fields');
    console.log('Flashing heart:', type, '| v4');
    heart.classList.remove('hp-damage-flash', 'hp-heal-flash');
    heartFields?.classList.remove('hp-heal-ring-active', 'hp-damage-ring-active');
    void heart.offsetWidth;
    heart.classList.add(type === 'damage' ? 'hp-damage-flash' : 'hp-heal-flash');
    if (type === 'heal' || type === 'damage') {
        void heartFields?.offsetWidth;
        heartFields?.classList.add(type === 'heal' ? 'hp-heal-ring-active' : 'hp-damage-ring-active');
    }
    setTimeout(() => {
        heart.classList.remove('hp-damage-flash', 'hp-heal-flash');
        heartFields?.classList.remove('hp-heal-ring-active', 'hp-damage-ring-active');
    }, 2200);
}

function movementRate(base, multiplier) {
    const value = Number.parseInt(base, 10);
    return Number.isInteger(value) && value >= 0 ? Math.floor(value * multiplier) : '-';
}

function updateCampRecoverySummary() {
    const summary = document.querySelector('.camp-recovery-summary');
    if (!summary) return;
    const used = Object.values(data.spellSlotPools || {}).flat().reduce((total, slot) => total + (Number.parseInt(slot.used, 10) || 0), 0);
    summary.textContent = `Current HP: ${data.combat.hpCurrent || '-'} / ${data.combat.hpMax || '-'} · Slots used: ${used}`;
}

function setupMovementSection() {
    const section = document.createElement('section');
    section.className = 'field movement-base-field';
    section.innerHTML = `<label for="movement-base-rate">Base movement rate</label><input id="movement-base-rate" data-section="combat" data-key="movement" value="${esc(data.combat.movement)}" inputmode="numeric">`;
    const characterCard = document.querySelector('.hero > .card');
    if (characterCard) {
        const inspirationField = characterCard.querySelector('.inspiration-field');
        if (inspirationField) {
            const trackerRow = document.createElement('div');
            trackerRow.className = 'character-tracker-row';
            inspirationField.before(trackerRow);
            trackerRow.append(inspirationField, section);
        } else characterCard.append(section);
    }
}

function setupSpecialNotesPosition() {
    const spells = [...document.querySelectorAll('.grid > .card')].find(card => card.querySelector(':scope > h2')?.textContent.includes('Spells and abilities'));
    if (!spells) return;
    const cards = [...document.querySelectorAll('.grid > .card')];
    const extraCards = cards.filter(card => {
        const title = card.querySelector(':scope > h2')?.textContent || '';
        return title.includes('Special abilities') || title.includes('Notes');
    });
    if (!extraCards.length) return;
    const extras = document.createElement('div');
    extras.className = 'spell-extras-grid';
    extraCards.forEach(card => {
        const wrapper = document.createElement('div');
        wrapper.className = 'spell-extra-section';
        while (card.firstChild) wrapper.append(card.firstChild);
        extras.append(wrapper);
        card.remove();
    });
    spells.append(extras);
}

function updateMovementSection() {
    const section = document.querySelector('.movement-base-field');
    if (!section) return;
    const base = data.combat.movement;
    const rates = { light: 2 / 3, moderate: 1 / 2, heavy: 1 / 3, severe: 1 / 6, jog: 2, run3: 3, run4: 4, run5: 5 };
    Object.entries(rates).forEach(([key, multiplier]) => {
        section.querySelector(`[data-movement-rate="${key}"]`).textContent = movementRate(base, multiplier);
    });
}

function namedInputTable(key, heading, valueLabel) {
    const catalog = classAbilitiesCatalog[key] || {};
    const entries = catalog.entries || [];
    return `<div class="class-ability-group"><h3>${catalog.heading || heading}</h3><table class="class-ability-table"><thead><tr><th>Ability</th><th>${catalog.valueLabel || valueLabel}</th></tr></thead><tbody>${data[key].map((row, index) => `<tr><th scope="row">${esc(entries[index] || row.name)}</th><td><input data-array="${key}" data-index="${index}" data-key="value" value="${esc(row.value)}"></td></tr>`).join('')}</tbody></table></div>`;
}

function classAbilitiesVisibility() {
    const classNames = (data.identity.classEntries || []).map(entry => String(entry.className || '').toLowerCase());
    const hasPriest = classNames.some(className => /priest|cleric|druid|paladin|shaman/.test(className));
    const hasRogue = classNames.some(className => /thief|rogue|bard|ranger/.test(className));
    return { hasPriest, hasRogue, visible: hasPriest || hasRogue };
}

function rangerSkillCalculations() {
    if (!rangerThiefAbilities) return {};
    const ranger = (data.identity.classEntries || []).find(entry => /ranger/i.test(entry.className || ''));
    const level = Number.parseInt(ranger?.level, 10);
    if (!ranger || !Number.isInteger(level) || level < 1) return {};
    const base = rangerThiefAbilities.baseByRangerLevel.find(row => level >= row.minLevel && (row.maxLevel == null || level <= row.maxLevel)) || rangerThiefAbilities.baseByRangerLevel.at(-1);
    const race = String(data.raceSelection || data.identity.race || '').toLowerCase().replace(/\s+/g, '-');
    const racial = rangerThiefAbilities.racialAdjustments[race] || { hideInShadows: 0, moveSilently: 0 };
    const dex = Number.parseInt(data.abilities.dex, 10);
    const dexterity = rangerThiefAbilities.dexterityAdjustments.find(row => dex >= row.minDexterity && dex <= row.maxDexterity) || { hideInShadows: 0, moveSilently: 0 };
    const kit = String(data.identity.classKit || '').toLowerCase().trim().replace(/\s+/g, '-');
    const kitAdjustment = rangerThiefAbilities.kitAdjustments[kit] || { hideInShadows: 0, moveSilently: 0 };
    const armorItem = (data.combat.acItems || []).find(item => item.equipped !== false && item.type === 'armor');
    const armorName = String(armorItem?.name || 'none').toLowerCase();
    const armor = armorName.includes('none') || armorName.includes('unarmored') ? 'none' : armorName.includes('studded') ? 'studded-leather' : armorName.replace(/\s+\/\s+|\s+/g, '-');
    const standardArmor = rangerThiefAbilities.standardArmorAdjustments[armor];
    const heavyArmor = rangerThiefAbilities.optionalHeavyArmorAdjustments[armor];
    const heavyAllowed = data.rangerThiefSettings.optionalHeavyArmor || data.rangerThiefSettings.allowHeavyArmor;
    const standardArmorAllowed = ['none', 'leather', 'padded', 'studded-leather'].includes(armor);
    const armorAdjustment = standardArmorAllowed ? standardArmor : (heavyAllowed ? heavyArmor : null);
    const calculations = {};
    ['hideInShadows', 'moveSilently'].forEach(skill => {
        const unavailable = kitAdjustment.notApplicable ? 'Kit does not grant this Ranger skill.' : !armorAdjustment ? `Unavailable in ${armorItem?.name || 'this armor'} under the standard rule.` : null;
        const additive = unavailable ? null : base[skill] + (racial[skill] || 0) + (dexterity[skill] || 0) + (kitAdjustment[skill] || 0) + (armorAdjustment[skill] || 0) + (Number(data.rangerThiefSettings.other[skill]) || 0);
        const multiplied = additive == null ? null : data.rangerThiefSettings.environment === 'wilderness' ? additive : additive * rangerThiefAbilities.calculation.nonWildernessMultiplier;
        const rounded = multiplied == null ? null : data.rangerThiefSettings.rounding === 'ceil' ? Math.ceil(multiplied) : data.rangerThiefSettings.rounding === 'round' ? Math.round(multiplied) : Math.floor(multiplied);
        calculations[skill] = { skillId: skill === 'hideInShadows' ? 'hide-in-shadows' : 'move-silently', sourceClass: 'ranger', sourceRuleId: rangerThiefAbilities.id, base: base[skill], modifiers: { race: racial[skill] || 0, dexterity: dexterity[skill] || 0, kit: kitAdjustment[skill] || 0, armor: armorAdjustment?.[skill] || 0, other: Number(data.rangerThiefSettings.other[skill]) || 0 }, environmentMultiplier: data.rangerThiefSettings.environment === 'wilderness' ? 1 : .5, calculatedPercent: rounded == null ? null : Math.max(0, Math.min(99, rounded)), manualOverride: data.rangerThiefSettings.manualOverrides[skill], displayPercent: data.rangerThiefSettings.manualOverrides[skill] == null ? rounded : data.rangerThiefSettings.manualOverrides[skill], available: !unavailable, unavailableReason: unavailable };
    });
    data.rangerThiefCalculations = calculations;
    return calculations;
}

function rangerSkillControlsHTML(skill, label) {
    const calculation = rangerSkillCalculations()[skill];
    if (!calculation) return '';
    const display = calculation.manualOverride == null ? (calculation.available ? `${calculation.displayPercent}%` : 'N/A') : `${calculation.displayPercent}% (manual)`;
    const breakdown = calculation.available ? `Base ${calculation.base}; race ${calculation.modifiers.race >= 0 ? '+' : ''}${calculation.modifiers.race}; DEX ${calculation.modifiers.dexterity >= 0 ? '+' : ''}${calculation.modifiers.dexterity}; kit ${calculation.modifiers.kit >= 0 ? '+' : ''}${calculation.modifiers.kit}; armor ${calculation.modifiers.armor >= 0 ? '+' : ''}${calculation.modifiers.armor}; other ${calculation.modifiers.other >= 0 ? '+' : ''}${calculation.modifiers.other}; environment x${calculation.environmentMultiplier}.` : calculation.unavailableReason;
    return `<div class="ranger-skill-calculation"><strong>${label}: ${display}</strong><small>${esc(breakdown)}</small><label>Manual override <input type="number" min="0" max="99" data-ranger-override="${skill}" value="${calculation.manualOverride ?? ''}"></label><button type="button" data-ranger-reset="${skill}">Reset override</button></div>`;
}

function updateClassAbilitiesVisibility() {
    const section = document.querySelector('.class-abilities-section');
    if (!section) return;
    const visibility = classAbilitiesVisibility();
    section.querySelectorAll('.class-ability-group').forEach(group => {
        const heading = group.querySelector('h3')?.textContent || '';
        group.hidden = heading === 'Thief skills' ? !visibility.hasRogue : !visibility.hasPriest;
    });
}

function setupClassAbilitiesSection() {
    const spellsCard = [...document.querySelectorAll('.grid > .card')].find(card => /Spells/i.test(card.querySelector(':scope > h2')?.textContent || ''));
    if (!spellsCard) return;
    let section = spellsCard.querySelector('.class-abilities-section');
    if (!section) {
        section = document.createElement('div');
        section.className = 'class-abilities-section';
        const insertAfter = spellsCard.querySelector('.spell-slots') || spellsCard.querySelector('.manual-spells');
        section.innerHTML = `<div class="class-abilities-header"><h3><button type="button" class="section-toggle class-abilities-toggle" aria-expanded="true">-</button>Class abilities</h3></div><div class="class-abilities-content"><div class="class-abilities-grid">${namedInputTable('thiefSkills', 'Thief skills', 'Percent')} ${namedInputTable('undeadTurning', 'Undead turning', 'Result')}</div></div>`;
        if (insertAfter) {
            insertAfter.after(section);
        } else {
            spellsCard.append(section);
        }
        section.querySelector('.class-abilities-content').insertAdjacentHTML('beforeend', classAbilityCatalogMarkup());
    }
    const catalogPanel = section.querySelector('.class-ability-catalog');
    if (catalogPanel) {
        const classFilter = catalogPanel.querySelector('#class-ability-class');
        const search = catalogPanel.querySelector('#class-ability-search');
        const catalogueTypeFilter = catalogPanel.querySelector('#class-ability-catalogue-type');
        const typeFilter = catalogPanel.querySelector('#class-ability-type');
        const sourceFilter = catalogPanel.querySelector('#class-ability-source');
        const abilityTypeOption = catalogPanel.querySelector('#class-ability-catalogue-type option[value="ability"]');
        if (abilityTypeOption) abilityTypeOption.textContent = 'Abil.';
        let catalogPage = 0;
        const renderCatalog = (resetPage = false) => {
            if (resetPage) catalogPage = 0;
            const records = spellsAndAbilitiesCatalogueRecords();
            const query = search.value.trim().toLowerCase();
            const matches = classAbilityLookup({ className: classFilter.value, abilityType: typeFilter.value, source: sourceFilter.value, catalogueType: catalogueTypeFilter.value }, records).filter(record => classFilter.value !== 'druid' || druidSpellIsAccessible(record)).filter(record => classFilter.value !== 'ranger' || rangerSpellIsAccessible(record)).filter(record => classFilter.value !== 'paladin' || paladinSpellIsAccessible(record)).filter(record => !query || [record.name, record.source, ...(record.classes || [])].join(' ').toLowerCase().includes(query));
            const pagination = paginateCatalog(matches, catalogPage, 40);
            catalogPage = pagination.currentPage;
            const visibleMatches = pagination.records;
            const results = catalogPanel.querySelector('#class-ability-catalog-results');
            const paginationControls = catalogPanel.querySelector('[data-class-ability-pagination]') || document.createElement('div');
            if (!paginationControls.parentElement) {
                paginationControls.dataset.classAbilityPagination = '';
                results.after(paginationControls);
            }
            results.innerHTML = visibleMatches.map(record => {
                const trackedKey = record.catalogueType === 'spell' ? 'spellCatalogId' : 'classAbilityId';
                const tracked = data.spells.some(item => item[trackedKey] === record.id);
                const classNames = (record.classes || []).join(', ');
                const metadata = record.catalogueType === 'spell' ? [`Spell${record.level != null ? ` · L${record.level}` : ''}`, classNames, readableSourceSummary(record.source)] : ['Ability', record.abilityType, classNames, readableSourceSummary(record.source)];
                return `<button type="button" class="class-ability-result" data-class-ability-add="${esc(record.id)}" data-class-ability-type="${record.catalogueType}"${tracked ? ' disabled' : ''}><strong>${esc(record.name)}</strong><small>${esc(metadata.filter(Boolean).join(' · '))}${tracked ? ' · Tracked' : ''}</small></button>`;
            }).join('') || '<small>No matching class abilities.</small>';
            paginationControls.innerHTML = catalogPaginationMarkup(pagination, 'class-ability');
            results.querySelectorAll('[data-class-ability-add]').forEach(button => button.onclick = () => {
                const record = spellsAndAbilitiesCatalogueRecords().find(item => item.id === button.dataset.classAbilityAdd && item.catalogueType === button.dataset.classAbilityType);
                if (!record) return;
                const trackedKey = record.catalogueType === 'spell' ? 'spellCatalogId' : 'classAbilityId';
                if (data.spells.some(item => item[trackedKey] === record.id)) return;
                data.spells.push(record.catalogueType === 'spell'
                    ? { spellCatalogId: record.id, name: record.name, level: record.level ?? '', type: 'Spell', school: record.school || record.spellGroup || '', castingSource: Array.isArray(record.classLists) && record.classLists.some(className => /wizard|mage/.test(String(className).toLowerCase())) ? 'wizard' : 'priest', known: '', memorized: false, memorizedQty: '', uses: '', castQty: '', verbal: record.components?.verbal === true, somatic: record.components?.somatic === true, material: record.components?.material === true, materialComponents: record.materialComponents || '', notes: Array.isArray(record.notes) ? record.notes.join('; ') : record.notes || '', source: record.source || '' }
                    : { classAbilityId: record.id, name: record.name, level: record.levelRequired ?? '', type: 'Class ability', school: record.abilityType || '', known: '', memorized: false, memorizedQty: '', uses: '', castQty: '', verbal: false, somatic: false, material: false, materialComponents: '', notes: Array.isArray(record.notes) ? record.notes.join('; ') : record.notes || '', source: record.source || '' });
                changed();
                render();
            });
            paginationControls.querySelectorAll('[data-class-ability-page]').forEach(button => button.onclick = () => { catalogPage = Number(button.dataset.classAbilityPage); renderCatalog(); });
        };
        search.oninput = () => renderCatalog(true);
        classFilter.onchange = () => renderCatalog(true);
        catalogueTypeFilter.onchange = () => renderCatalog(true);
        typeFilter.onchange = () => renderCatalog(true);
        sourceFilter.onchange = () => renderCatalog(true);
        renderCatalog();
    }
    const toggle = section.querySelector('.class-abilities-toggle');
    const collapsed = data.sectionStates['class-abilities'] === true;
    section.classList.toggle('class-abilities-collapsed', collapsed);
    if (toggle) {
        toggle.textContent = collapsed ? '+' : '-';
        toggle.title = `${collapsed ? 'Show' : 'Hide'} class abilities`;
        toggle.setAttribute('aria-label', `${collapsed ? 'Show' : 'Hide'} class abilities`);
        toggle.setAttribute('aria-expanded', String(!collapsed));
        toggle.onclick = () => {
            const isCollapsed = section.classList.toggle('class-abilities-collapsed');
            data.sectionStates['class-abilities'] = isCollapsed;
            toggle.textContent = isCollapsed ? '+' : '-';
            toggle.title = `${isCollapsed ? 'Show' : 'Hide'} class abilities`;
            toggle.setAttribute('aria-label', `${isCollapsed ? 'Show' : 'Hide'} class abilities`);
            toggle.setAttribute('aria-expanded', String(!isCollapsed));
            changed();
        };
    }
    const thiefGroup = [...section.querySelectorAll('.class-ability-group')].find(group => group.querySelector('h3')?.textContent === 'Thief skills');
    if (thiefGroup) {
        thiefGroup.querySelector('.ranger-thief-calculations')?.remove();
        const hasRanger = (data.identity.classEntries || []).some(entry => /ranger/i.test(entry.className || ''));
        if (hasRanger && rangerThiefAbilities) {
            const calculations = rangerSkillCalculations();
            const panel = document.createElement('div');
            panel.className = 'ranger-thief-calculations';
            panel.innerHTML = `<h4>Ranger stealth calculations</h4><div class="ranger-thief-settings"><label>Environment<select data-ranger-environment><option value="wilderness">Wilderness</option><option value="other">Indoor / urban / underground</option></select></label><label>Rounding<select data-ranger-rounding><option value="floor">Round down</option><option value="round">Nearest whole percent</option><option value="ceil">Round up</option></select></label><label><input type="checkbox" data-ranger-heavy> Optional heavy armor rule</label><label><input type="checkbox" data-ranger-heavy-override> Allow heavy armor override</label><label>Other Hide modifier<input type="number" data-ranger-other="hideInShadows" value="${data.rangerThiefSettings.other.hideInShadows}"></label><label>Other Move modifier<input type="number" data-ranger-other="moveSilently" value="${data.rangerThiefSettings.other.moveSilently}"></label></div><div class="ranger-thief-results">${rangerSkillControlsHTML('moveSilently', 'MOVE SILENTLY')}${rangerSkillControlsHTML('hideInShadows', 'HIDE IN SHADOWS')}</div>`;
            panel.querySelector('[data-ranger-environment]').value = data.rangerThiefSettings.environment;
            panel.querySelector('[data-ranger-rounding]').value = data.rangerThiefSettings.rounding;
            panel.querySelector('[data-ranger-heavy]').checked = data.rangerThiefSettings.optionalHeavyArmor;
            panel.querySelector('[data-ranger-heavy-override]').checked = data.rangerThiefSettings.allowHeavyArmor;
            panel.querySelectorAll('[data-ranger-environment]').forEach(input => input.onchange = () => { data.rangerThiefSettings.environment = input.value; changed(); render(); });
            panel.querySelectorAll('[data-ranger-rounding]').forEach(input => input.onchange = () => { data.rangerThiefSettings.rounding = input.value; changed(); render(); });
            panel.querySelector('[data-ranger-heavy]').onchange = event => { data.rangerThiefSettings.optionalHeavyArmor = event.target.checked; changed(); render(); };
            panel.querySelector('[data-ranger-heavy-override]').onchange = event => { data.rangerThiefSettings.allowHeavyArmor = event.target.checked; changed(); render(); };
            panel.querySelectorAll('[data-ranger-other]').forEach(input => input.oninput = () => { data.rangerThiefSettings.other[input.dataset.rangerOther] = Number(input.value) || 0; changed(); render(); });
            panel.querySelectorAll('[data-ranger-override]').forEach(input => input.oninput = () => { data.rangerThiefSettings.manualOverrides[input.dataset.rangerOverride] = input.value === '' ? null : Math.max(0, Math.min(99, Number(input.value))); changed(); render(); });
            panel.querySelectorAll('[data-ranger-reset]').forEach(button => button.onclick = () => { data.rangerThiefSettings.manualOverrides[button.dataset.rangerReset] = null; changed(); render(); });
            thiefGroup.querySelectorAll('tbody tr').forEach(row => {
                const skill = row.querySelector('th')?.textContent.toLowerCase().replace(/[^a-z]+/g, '-');
                const key = skill === 'move-silently' ? 'moveSilently' : skill === 'hide-in-shadows' ? 'hideInShadows' : '';
                const calculation = key ? calculations[key] : null;
                if (!calculation) return;
                const valueCell = row.querySelector('td');
                const calculated = document.createElement('output');
                calculated.className = 'ranger-calculated-value';
                calculated.textContent = calculation.available ? `${calculation.displayPercent}% Ranger` : 'N/A';
                    calculated.title = calculation.available ? `Base ${calculation.base}; race ${calculation.modifiers.race}; DEX ${calculation.modifiers.dexterity}; kit ${calculation.modifiers.kit}; armor ${calculation.modifiers.armor}; other ${calculation.modifiers.other}; environment x${calculation.environmentMultiplier}.` : calculation.unavailableReason;
                valueCell.prepend(calculated);
            });
            section.querySelector('.class-abilities-grid')?.append(panel);
        }
    }
    setupTrackingCalculator(section);
    updateClassAbilitiesVisibility();
}

function setupHenchmenSection() {
    const section = document.createElement('section');
    section.className = 'card wide henchmen-section';
    section.innerHTML = `<h2>Henchmen</h2><div class="tableWrap"><table class="henchmen-table"><thead><tr><th>Type</th><th>Name</th><th>Level / HD</th><th>Role or species</th><th>Loyalty</th><th>Notes</th><th></th></tr></thead><tbody>${data.henchmen.map((row, index) => `<tr><td><select data-array="henchmen" data-index="${index}" data-key="type"><option value="NPC" ${row.type === 'NPC' ? 'selected' : ''}>NPC</option><option value="Animal" ${row.type === 'Animal' ? 'selected' : ''}>Animal</option></select></td><td><input data-array="henchmen" data-index="${index}" data-key="name" value="${esc(row.name)}"></td><td><input data-array="henchmen" data-index="${index}" data-key="levelOrHd" value="${esc(row.levelOrHd)}"></td><td><input data-array="henchmen" data-index="${index}" data-key="role" value="${esc(row.role)}"></td><td><input data-array="henchmen" data-index="${index}" data-key="loyalty" value="${esc(row.loyalty)}"></td><td><input data-array="henchmen" data-index="${index}" data-key="notes" value="${esc(row.notes)}"></td><td><button class="remove" data-remove="henchmen" data-index="${index}">×</button></td></tr>`).join('')}</tbody></table></div><button class="add" data-add="henchmen">Add henchman</button>`;
    const anchor = document.querySelector('.class-abilities-section')?.closest('.card') || [...document.querySelectorAll('.grid > .card')].find(card => /Spells/i.test(card.querySelector(':scope > h2')?.textContent || ''));
    if (anchor) anchor.after(section); else document.querySelector('.grid')?.append(section);
}

const weaponCatalog = [
    ['Battle Axe', 'M', '1d8', '1d8', '-', '7', '7'], ['Hand Axe', 'M/T', '1d6', '1d4', '10/20/30', '5', '4'], ['Throwing Axe', 'T', '1d6', '1d4', '10/20/30', '3', '4'], ['Club', 'M', '1d6', '1d3', '-', '3', '4'],
    ['Dagger', 'M/T', '1d4', '1d3', '10/20/30', '1', '2'], ['Dirk', 'M/T', '1d4', '1d3', '5/15/25', '1', '2'], ['Knife', 'M/T', '1d3', '1d2', '5/10/20', '0.5', '2'], ['Bone Knife (crude)', 'M/T', '1d3', '1d2', '5/10/20', '0.5', '2'], ['Javelin', 'M/T', '1d6', '1d6', '20/40/60', '2', '4'],
    ['Spear', 'M/T', '1d6', '1d8', '20/40/60', '5', '6'], ['Wooden Spear (crude)', 'M/T', '1d6', '1d8', '20/40/60', '5', '6'], ['Short Sword', 'M', '1d6', '1d8', '-', '3', '3'], ['Long Sword', 'M', '1d8', '1d12', '-', '4', '5'], ['Bastard Sword', 'M', '2d4', '2d8', '-', '6', '8'],
    ['Two-Handed Sword', 'M', '1d10', '3d6', '-', '15', '10'], ['Scimitar', 'M', '1d8', '1d8', '-', '4', '4'], ['Sabre', 'M', '1d6', '1d8', '-', '3', '4'], ['Broad Sword', 'M', '2d4', '1d6+1', '-', '4', '6'],
    ['Falchion', 'M', '2d4', '2d4', '-', '15', '8'], ['Rapier', 'M', '1d6', '1d4', '-', '2', '3'], ['Mace', 'M', '1d6+1', '1d6', '-', '8', '7'], ['Morning Star', 'M', '2d4', '1d6+1', '-', '6', '7'],
    ['Flail', 'M', '1d6+1', '2d4', '-', '15', '7'], ['War Hammer', 'M/T', '1d4+1', '1d4', '10/20/30', '5', '4'], ['Quarterstaff', 'M', '1d6', '1d6', '-', '4', '4'], ['Halberd', 'M', '1d10', '2d6', '-', '15', '9'],
    ['Polearm', 'M', '1d6', '1d6', '-', '15', '7'], ['Glaive', 'M', '1d6', '1d10', '-', '8', '8'], ['Trident', 'M/T', '1d6+1', '3d4', '10/20/30', '5', '7'], ['Bow, Short', 'X', '1d6', '1d6', '50/100/150', '2', '6'],
    ['Bow, Long', 'X', '1d6', '1d6', '70/140/210', '3', '7'], ['Composite Short Bow', 'X', '1d6', '1d6', '50/100/150', '3', '6'], ['Composite Long Bow', 'X', '1d6', '1d6', '70/140/210', '4', '7'],
    ['Crossbow, Light', 'X', '1d4+1', '1d4+1', '60/120/180', '5', '7'], ['Crossbow, Heavy', 'X', '1d6+1', '1d10+1', '80/160/240', '16', '10'], ['Crossbow, Hand', 'X', '1d3', '1d2', '20/40/60', '3', '4'], ['Sling', 'X', '1d4', '1d6', '40/80/160', '0', '6'], ['Dart', 'T', '1d3', '1d2', '15/30/60', '0.25', '2']
];
const halfElfWeaponGroups = ['Swords', 'Axes', 'Bows', 'Thrown weapons'];
const racialWeaponGroupNames = {
    Swords: ['Long Sword', 'Bastard Sword', 'Two-Handed Sword', 'Short Sword', 'Rapier', 'Scimitar'],
    Axes: ['Battle Axe', 'Hand Axe'],
    Bows: ['Bow, Long', 'Bow, Short', 'Composite Long Bow', 'Composite Short Bow'],
    'Thrown weapons': ['Dagger', 'Dirk', 'Knife', 'Bone Knife (crude)', 'Javelin', 'Spear', 'Wooden Spear (crude)', 'Trident', 'Hand Axe', 'War Hammer', 'Dart', 'Sling']
};

function halfElfWeaponOptionsHTML() {
    return halfElfWeaponGroups.map(group => `<option value="${esc(group)}">${esc(group)}</option>`).join('');
}

const halfElfWeaponOptions = halfElfWeaponGroups.map(group => [group, group]);

function halfElfWeaponApplies(weaponName) {
    return data.raceSelection === 'Half-Elf' && racialWeaponGroupNames[data.racialWeaponChoice]?.includes(weaponName);
}

function weaponProficiencyFor(weapon) {
    const weaponName = String(weapon?.name || '').trim().toLowerCase();
    return data.weaponProficiencies.find(item => {
        const record = weaponProficiencyCatalog.find(entry => (item.proficiencyId && entry.proficiencyId === item.proficiencyId) || (item.weaponId && entry.weaponId === item.weaponId));
        return String(item.name || record?.name || '').trim().toLowerCase() === weaponName;
    }) || null;
}

function weaponSpecializationBonuses(weapon) {
    const proficiency = weaponProficiencyFor(weapon);
    const specialized = proficiency?.proficient && proficiency.specialization === 'specialized';
    return { hit: specialized ? 1 : 0, damage: specialized ? 2 : 0 };
}

function weaponRacialBonuses(weapon) {
    const name = weapon?.name || '';
    const exceptional = exceptionalStrengthValues(data.abilities.str);
    const thrown = String(weapon?.attackType || '').includes('T') || name === 'Sling';
    const axe = /axe/i.test(name);
    const halflingOrElf = data.raceSelection === 'Halfling' || data.raceSelection === 'Elves';
    const halfElfHit = halfElfWeaponApplies(name) ? 1 : 0;
    const hit = halfElfHit + (halflingOrElf && (thrown || (data.raceSelection === 'Elves' && axe)) ? 1 : 0);
    const damage = data.raceSelection === 'Halfling' && thrown ? 1 : data.raceSelection === 'Elves' && (thrown || axe) ? 1 : 0;
    return { hit, damage };
}

function weaponUsesDexterity(weapon) {
    return String(weapon?.attackType || '').toUpperCase().includes('T') || String(weapon?.attackType || '').toUpperCase().includes('X') || /sling|bow|crossbow|dart|javelin/i.test(weapon?.name || '');
}

function weaponAbilityAttackBonus(weapon) {
    const ability = weaponUsesDexterity(weapon) ? 'dex' : 'str';
    const exceptional = ability === 'str' ? exceptionalStrengthValues(data.abilities.str) : null;
    return { ability, bonus: exceptional ? exceptional.hit : Number.parseInt(modifier(ability, data.abilities[ability]), 10) || 0 };
}

function weaponRowsHTML() {
    return data.weapons.map((weapon, index) => {
        const preset = weaponCatalog.find(entry => entry[0] === weapon.name);
        return `<tr><td><input class="weapon-equipped" type="checkbox" data-weapon-item="${index}" data-weapon-key="equipped" aria-label="Equipped weapon" ${weapon.equipped !== false ? 'checked' : ''}></td><td><select data-weapon-preset="${index}"><option value="Other" ${preset ? '' : 'selected'}>Other</option>${weaponCatalog.map(entry => `<option value="${esc(entry[0])}" ${weapon.name === entry[0] ? 'selected' : ''}>${esc(entry[0])}</option>`).join('')}</select><input class="weapon-custom-name" data-weapon-item="${index}" data-weapon-key="name" value="${esc(weapon.name)}" placeholder="Weapon name" ${preset ? 'hidden' : ''}></td><td><input data-weapon-item="${index}" data-weapon-key="attackType" value="${esc(weapon.attackType)}" placeholder="M/T"></td><td><input data-weapon-item="${index}" data-weapon-key="attackAdj" type="number" value="${esc(weapon.attackAdj)}" step="1"></td><td><input data-weapon-item="${index}" data-weapon-key="damageAdj" type="number" value="${esc(weapon.damageAdj)}" step="1"></td><td><input data-weapon-item="${index}" data-weapon-key="thac0Adj" type="number" value="${esc(weapon.thac0Adj)}" step="1"></td><td><input data-weapon-item="${index}" data-weapon-key="damageSM" value="${esc(weapon.damageSM)}"></td><td><input data-weapon-item="${index}" data-weapon-key="damageL" value="${esc(weapon.damageL)}"></td><td><input data-weapon-item="${index}" data-weapon-key="range" value="${esc(weapon.range)}"></td><td><input data-weapon-item="${index}" data-weapon-key="weight" value="${esc(weapon.weight)}"></td><td><input data-weapon-item="${index}" data-weapon-key="speed" value="${esc(weapon.speed)}"></td><td><output class="weapon-thac0" data-weapon-thac0="${index}">-</output></td><td><button type="button" class="remove" data-weapon-remove="${index}" aria-label="Remove weapon">×</button></td></tr>`;
    }).join('');
}

function updateWeaponThac0() {
    const base = Number.parseInt(data.combat.thac0, 10);
    document.querySelectorAll('[data-weapon-thac0]').forEach(output => {
        const weapon = data.weapons[+output.dataset.weaponThac0];
        const racial = weaponRacialBonuses(weapon);
        const specialization = weaponSpecializationBonuses(weapon);
        const abilityAttack = weaponAbilityAttackBonus(weapon);
        const attackAdjustment = abilityAttack.bonus + (Number.parseInt(weapon?.attackAdj, 10) || 0) + racial.hit + specialization.hit + globalModifierTotal('Hit', weapon?.name || '');
        const thac0Adjustment = Number.parseInt(weapon?.thac0Adj, 10) || 0;
        output.textContent = Number.isInteger(base) && weapon?.equipped !== false ? base - attackAdjustment + thac0Adjustment + targetedGlobalModifierTotal('THAC0', weapon?.name) : '-';
        output.title = weapon?.equipped !== false && Number.isInteger(base) ? `Weapon THAC0 = character THAC0 ${base} - ${abilityAttack.ability.toUpperCase()} attack adjustment ${abilityAttack.bonus} - weapon attack adjustment ${Number.parseInt(weapon?.attackAdj, 10) || 0}${racial.hit ? ` - racial hit bonus ${racial.hit}` : ''}${specialization.hit ? ` - specialization hit bonus ${specialization.hit}` : ''} + weapon THAC0 adjustment ${thac0Adjustment} = ${output.textContent}.` : 'Weapon is inactive or character THAC0 is not available.';
        const damageInput = output.closest('tr')?.querySelector('[data-weapon-key="damageAdj"]');
        if (damageInput) damageInput.title = `${racial.damage || specialization.damage ? 'Manual damage adjustment plus' : 'Manual weapon damage adjustment.'}${racial.damage ? ` racial ${racial.damage >= 0 ? '+' : ''}${racial.damage} damage from ${data.raceSelection} weapon rules` : ''}${racial.damage && specialization.damage ? ' and' : ''}${specialization.damage ? ` specialization +${specialization.damage} damage` : ''}.`;
    });
}

function setupWeaponSection() {
    const section = [...document.querySelectorAll('.grid > .card')].find(card => card.querySelector(':scope > h2')?.textContent.includes('Weapons'));
    if (!section) return;
    section.innerHTML = `<h2>Weapons</h2><div class="weapon-best-thac0">Best equipped THAC0: <output>-</output></div><div class="tableWrap"><table class="weapons-table"><thead><tr><th>Active</th><th>Weapon</th><th>AT</th><th>Attack adj</th><th>Damage adj</th><th>THAC0 adj</th><th>Damage S/M</th><th>Damage L</th><th>Range</th><th>Weight</th><th>Speed</th><th>THAC0</th><th></th></tr></thead><tbody>${weaponRowsHTML()}</tbody></table></div><button type="button" class="add" data-weapon-add>Add weapon</button><small class="weapon-key">M = melee, T = thrown, M/T = melee or thrown. Positive attack adjustments improve THAC0.</small>`;
    section.querySelector('.weapon-key').textContent = 'M = melee, T = thrown, M/T = melee or thrown, X = missile/projectile. Positive attack adjustments improve THAC0.';
    const weaponHeader = section.querySelector('.weapons-table thead tr');
    weaponHeader.children[3].textContent = 'HIT BONUS';
    weaponHeader.children[4].textContent = 'DAMAGE BONUS';
    weaponHeader.children[5].remove();
    section.querySelectorAll('.weapons-table tbody tr').forEach(row => row.children[5]?.remove());
    const combatEquipment = document.querySelector('.combat-equipment-layout');
    if (combatEquipment) {
        section.classList.remove('card', 'wide', 'half');
        section.classList.add('combat-weapons');
        combatEquipment.append(section);
    }
    const refresh = () => {
        updateWeaponThac0();
        const values = [...section.querySelectorAll('[data-weapon-thac0]')].map(output => Number.parseInt(output.textContent, 10)).filter(Number.isInteger);
        section.querySelector('.weapon-best-thac0 output').textContent = values.length ? Math.min(...values) : '-';
    };
    section.querySelector('[data-weapon-add]').onclick = () => {
        data.weapons.push({ name: '', attackType: '', attackAdj: 0, damageAdj: 0, thac0Adj: 0, damageSM: '', damageL: '', range: '', weight: '', speed: '', equipped: true });
        changed();
        render();
    };
    section.querySelectorAll('[data-weapon-item]').forEach(input => input.oninput = () => {
        const weapon = data.weapons[+input.dataset.weaponItem];
        weapon[input.dataset.weaponKey] = input.type === 'checkbox' ? input.checked : input.value;
        refresh();
        changed();
    });
    section.querySelectorAll('[data-weapon-preset]').forEach(select => select.onchange = () => {
        const preset = weaponCatalog.find(entry => entry[0] === select.value);
        const index = +select.dataset.weaponPreset;
        if (!preset) {
            data.weapons[index].name = '';
        } else {
            data.weapons[index] = { name: preset[0], attackType: preset[1], attackAdj: 0, damageAdj: 0, thac0Adj: 0, damageSM: preset[2], damageL: preset[3], range: preset[4], weight: preset[5], speed: preset[6], equipped: true };
        }
        changed();
        render();
    });
    section.querySelectorAll('[data-weapon-remove]').forEach(button => button.onclick = () => {
        data.weapons.splice(+button.dataset.weaponRemove, 1);
        changed();
        render();
    });
    refresh();
}

function setupActionReferenceSection() {
    const section = document.createElement('section');
    section.className = 'card wide action-reference-section';
    section.innerHTML = `<h2>Combat actions reference</h2><div class="action-reference-flow"><article><h3>Tracking time</h3><p><strong>Turn</strong> = 10 minutes<br><strong>Round</strong> = 1 minute</p><p>Most character actions are measured in turns or rounds. Turns are primarily used for out-of-combat actions while rounds are used for combat actions.</p></article><article><h3>Determine actions</h3><p>At the start of each combat round, each player decides what actions they will take. Events and enemy actions may later alter or interrupt those actions.</p></article><article><h3>Roll initiative</h3><p>Initiative is calculated each combat round using:</p><p><strong>1d10 + effect modifiers + reaction time + weapon or spell speed</strong></p></article><article><h3>Resolve actions</h3><p>Combatant actions are resolved in order of initiative, from lowest to highest.</p></article></div><div class="action-reference-actions"><article class="action-movement"><h3>Movement</h3><p><strong>Full move:</strong> Move your full rate only.</p><p><strong>Half move:</strong> Move up to half your rate and still make one melee attack, use a ranged weapon at half rate of fire, or perform a noncombat action.</p><p><strong>Withdraw move:</strong> Move up to your rate and retreat from melee. Attackers do not get an opportunity attack.</p><p><strong>Charge move:</strong> Increase your movement rate by 50% and make a melee attack against your charged target. Gain +2 to hit, lose all Dexterity bonuses to AC, suffer a -1 AC penalty, and give the target a -2 initiative bonus.</p></article><article class="action-attack"><h3>Attack</h3><p>Melee and ranged attacks use 1d20 plus or minus the applicable modifiers.</p><p>To determine whether an attack hits, subtract the target's armor class from the character's THAC0 and compare that number to the modified attack roll.</p><p>Damage is rolled on a successful hit according to the weapon's damage entry.</p></article><article class="action-spells"><h3>Spells</h3><p>A character may not move while casting a spell. Casting times range from an instant up to 10, and casting time affects initiative.</p><p>If damage is dealt before a spell goes off, the spell may be interrupted, fizzle from memory, or still go off depending on abilities and saves.</p><p>Some spells require saving throws or attack rolls; others automatically affect their targets.</p></article><article class="action-noncombat"><h3>Noncombat / free actions</h3><p>Examples include interacting with the environment, searching a body, using a magical item, bandaging a fallen comrade, recovering a weapon, rummaging through a pack, or drinking a potion already in hand.</p><p>Free actions include shouting a warning, giving brief instructions, changing weapons, dropping equipment, or throwing something already held.</p></article></div>`;
    document.querySelector('.grid').append(section);
}

function setupThac0ReferenceSection() {
    const section = document.createElement('section');
    section.className = 'card wide thac0-reference-section';
    section.id = 'thac0-reference';
    section.innerHTML = `<h2>THAC0 reference</h2><div class="thac0-reference-grid"><article><h3>What is THAC0?</h3><p>THAC0 means To Hit Armor Class 0. It is the number a character must roll on a d20 to hit a target with Armor Class 0. Lower THAC0 values are better.</p><h3>Hit calculation</h3><p class="formula"><strong>Required roll = THAC0 - target AC</strong></p><p>If the attack roll is equal to or greater than the required roll, the attack hits.</p></article><article><h3>Attack modifiers</h3><p>Strength, magic weapons, specialization, spells, and other attack bonuses reduce the roll needed to hit.</p><p class="formula"><strong>Effective THAC0 = THAC0 - attack bonuses</strong></p><p class="formula"><strong>Required roll = effective THAC0 - target AC</strong></p><p>Alternatively, add attack bonuses to the d20 roll and compare it to the unmodified required roll.</p></article><article><h3>Examples</h3><p><strong>THAC0 20 vs AC 5:</strong> 20 - 5 = 15. The attack needs 15 or higher.</p><p><strong>THAC0 16 vs AC 2:</strong> 16 - 2 = 14. The attack needs 14 or higher.</p><p><strong>THAC0 10 vs AC -3:</strong> 10 - (-3) = 13. The attack needs 13 or higher.</p><p><strong>THAC0 18, AC 4, +3 attack bonus:</strong> 18 - 4 - 3 = 11. The attack needs 11 or higher.</p></article><article><h3>Quick reminders</h3><p><strong>Lower THAC0 is better.</strong><br><strong>Lower AC is better.</strong></p><p>THAC0 20 = inexperienced<br>THAC0 15 = competent<br>THAC0 10 = skilled<br>THAC0 5 = veteran<br>THAC0 1 = elite warrior</p><h3>Shortcut</h3><p><strong>AC hit = THAC0 - d20 roll</strong></p><p>A roll of 14 with THAC0 16 hits AC 2 or any worse AC.</p></article></div>`;
    document.querySelector('.grid').append(section);
}

function setupAcReferenceSection() {
    const section = document.createElement('section');
    section.className = 'card wide ac-reference-section';
    section.id = 'ac-reference';
    section.innerHTML = `<h2>Armor Class reference</h2><div class="thac0-reference-grid"><article><h3>What is AC?</h3><p>Armor Class represents how difficult a character is to hit. In AD&amp;D 2e, lower AC is better. Unarmored characters typically start at AC 10.</p><h3>Calculating AC</h3><p class="formula"><strong>Final AC = base AC - armor protection - shield protection - Dexterity bonus - magical bonuses - other defensive modifiers</strong></p></article><article><h3>Common examples</h3><p>No armor: AC 10</p><p>Chain mail: AC 5</p><p>Chain mail + shield: AC 4</p><p>Chain mail + shield + DEX defense -2: AC 2</p><p>Plate mail + shield + DEX defense -4: AC -1</p></article><article><h3>How attacks use AC</h3><p>The attacker compares their THAC0 against the defender's AC.</p><p class="formula"><strong>Required roll = attacker THAC0 - defender AC</strong></p><p>The attack hits when the d20 roll plus attack bonuses equals or exceeds the required roll.</p><p><strong>Example:</strong> THAC0 18 against AC 5 requires 18 - 5 = 13, so the attacker needs 13 or higher.</p></article><article><h3>Modifiers and reminders</h3><p>Strength, magic weapons, specialization, spells, cover, and other effects can improve AC or the attack roll.</p><p><strong>Lower AC = better defense</strong><br><strong>Lower THAC0 = better offense</strong></p><p>AC 10 = unarmored<br>AC 5 = chain mail<br>AC 0 = full plate + shield<br>AC -5 = powerful magical protection</p><h3>Shortcut</h3><p><strong>AC hit = THAC0 - modified attack roll</strong></p></article></div>`;
    document.querySelector('.grid').append(section);
}

function setupClassRequirementsReferenceSection() {
    const section = document.createElement('section');
    section.className = 'card wide class-requirements-reference-section';
    section.id = 'class-requirements-reference';
    section.innerHTML = `<h2>Class requirements and ability benefits</h2><div class="reference-table-grid"><article><h3>Class minimum requirements</h3><table class="reference-table"><thead><tr><th>Class</th><th>STR</th><th>DEX</th><th>CON</th><th>INT</th><th>WIS</th><th>CHA</th></tr></thead><tbody>${[['Fighter','9','','','','',''],['Paladin','12','', '9','', '13','17'],['Ranger','13','13','14','','14',''],['Wizard','','','','9','',''],['Specialist Wizard','','','','9','',''],['Priest','','','','','9',''],['Druid','','','','','12','15'],['Thief','','9','','','',''],['Bard','','12','','','','13'],['Psionicist','','15','15','','15','']].map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table><small>These are minimum ability scores from the supplied reference. Custom classes and campaign-specific requirements remain manual.</small></article><article><h3>Prime requisites</h3><table class="reference-table"><thead><tr><th>Class</th><th>Prime requisite(s)</th></tr></thead><tbody>${Object.entries(classPrimeRequisites).map(([name, requisites]) => `<tr><td>${esc(name)}</td><td>${esc(requisites)}</td></tr>`).join('')}</tbody></table><small>Characters with all prime requisites at 16+ typically receive a 10% XP bonus.</small></article></div><div class="ability-reference-grid">${Object.entries({str:'Strength: hit and damage adjustments',dex:'Dexterity: missile and AC adjustments',con:'Constitution: hit-point adjustments',int:'Intelligence: spell level and learning chance',wis:'Wisdom: magical defense and bonus priest spells',cha:'Charisma: henchmen, loyalty, and reaction'}).map(([ability, title]) => `<article><h3>${title}</h3><p>${esc(abilityTooltip(ability, data.abilities[ability]))}</p></article>`).join('')}</div>`;
    section.innerHTML = `<h2>Class requirements and ability benefits</h2><div class="reference-table-grid"><article><h3>Class minimum requirements</h3><table class="reference-table"><thead><tr><th>Class</th><th>STR</th><th>DEX</th><th>CON</th><th>INT</th><th>WIS</th><th>CHA</th></tr></thead><tbody>${[['Fighter','9','','','','',''],['Paladin','12','', '9','', '13','17'],['Ranger','13','13','14','','14',''],['Wizard','','','','9','',''],['Specialist Wizard','','','','9','',''],['Priest','','','','','9',''],['Druid','','','','','12','15'],['Thief','','9','','','',''],['Bard','','12','','','','13'],['Psionicist','','15','15','','15','']].map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table><small>These are minimum ability scores from the supplied reference. Custom classes and campaign-specific requirements remain manual.</small></article><article><h3>Prime requisites</h3><table class="reference-table"><thead><tr><th>Class</th><th>Prime requisite(s)</th></tr></thead><tbody>${Object.entries(classPrimeRequisites).map(([name, requisites]) => `<tr><td>${esc(name)}</td><td>${esc(requisites)}</td></tr>`).join('')}</tbody></table><small>Characters with all prime requisites at 16+ typically receive a 10% XP bonus.</small></article></div><div class="ability-reference-grid">${Object.entries({str:'Strength: hit and damage adjustments',dex:'Dexterity: missile and AC adjustments',con:'Constitution: hit-point adjustments',int:'Intelligence: spell level and learning chance',wis:'Wisdom: magical defense and bonus priest spells',cha:'Charisma: henchmen, loyalty, and reaction'}).map(([ability, title]) => `<article><h3>${title}</h3><p>${esc(abilityTooltip(ability, data.abilities[ability]))}</p></article>`).join('')}</div>`;
    const experienceReference = document.createElement('article');
    experienceReference.innerHTML = `<h3>Experience to next level</h3>${Object.entries(experienceTables).map(([id, values]) => `<div class="experience-table"><h4>${id === 'paladinRanger' ? 'Paladin / Ranger' : id[0].toUpperCase() + id.slice(1)}</h4><table class="reference-table"><thead><tr><th>Level</th><th>XP</th></tr></thead><tbody>${values.slice(1).map((xp, index) => `<tr><td>${index + 1}</td><td>${formatExperience(xp)}</td></tr>`).join('')}</tbody></table></div>`).join('')}<small>Custom class progressions remain manual. Barbarian uses Fighter XP, and Ninja uses Thief-style XP.</small>`;
    experienceReference.className = 'experience-reference';
    section.querySelector('.reference-table-grid').append(experienceReference);
    document.querySelector('.grid').append(section);
}

function setupSurpriseReferenceSection() {
    const section = document.createElement('section');
    section.className = 'card wide surprise-reference-section';
    section.innerHTML = '<h2>Surprise and ambush reference</h2><div class="thac0-reference-grid"><article><h3>Enemy surprise modifier</h3><p>Use the full modifier when all listed conditions are satisfied. Use the reduced modifier when only some conditions apply.</p><p class="formula"><strong>Enemy surprise roll + modifier</strong></p></article><article><h3>Suggested conditions</h3><p>Non-metal armor; the party consists only of halflings, elves, or half-elves; or the character is at least 90 feet from others.</p><p>The supplied race cards commonly use -4 and -2 for these conditions.</p></article><article><h3>Keep rolls distinct</h3><p><strong>Character surprise modifier:</strong> modifies the character\'s own roll.</p><p><strong>Enemy surprise modifier:</strong> modifies an opponent\'s roll.</p></article><article><h3>Tracker fields</h3><p>Target: Enemy<br>Roll: Surprise<br>Full modifier: -4<br>Reduced modifier: -2<br>Source: Racial</p><p>Use the active toggle and notes to record exceptions for the current encounter.</p></article></div>';
    document.querySelector('.grid').append(section);
}

function setupBladesingerReferenceSection() {
    const section = document.createElement('section');
    section.className = 'card wide bladesinger-reference-section';
    section.innerHTML = `<h2>Bladesinger reference</h2><div class="thac0-reference-grid"><article><h3>Normal AC</h3><p>Keep armor, shield, Dexterity, magical, and other defensive modifiers in the normal AC calculation.</p><p class="formula"><strong>Normal AC = base AC + DEX defense + active AC adjustments</strong></p><p>Example: unarmored base AC 10, DEX 18 defense -4, and Ring of Protection +1 -1 gives normal AC 5.</p></article><article><h3>Casting defense</h3><p>When the Bladesinger casting-defense toggle is active, calculate a separate melee AC improvement.</p><p class="formula"><strong>Casting adjustment = -(floor(Bladesinger level / 2) + 1)</strong></p><p>At level 6, the adjustment is -4. Normal AC 1 becomes Casting Melee AC -3.</p></article><article><h3>When it applies</h3><p>The casting defense applies while casting and defending against incoming melee attacks from the front or sides.</p><p>Use the Combat toggle only for the rounds or situations in which the character is actively casting.</p></article><article><h3>When it does not apply</h3><p>Do not apply this conditional adjustment against missile attacks or rear attacks. It does not change the standard AC, Shieldless AC, Surprised AC, or Rear AC fields.</p><p>The Combat tooltip shows the exact values used in the calculation.</p></article></div>`;
    document.querySelector('.grid').append(section);
}

function referenceRecords() {
    const equipment = equipmentCatalogue.map(record => ({ ...record, referenceType: 'equipment', referenceLabel: 'Equipment' }));
    const ranges = missileRangeProfiles.map(record => ({ ...record, name: record.name || record.id, referenceType: 'range', referenceLabel: 'Ranges' }));
    const rules = [
        ...Object.entries(classRequirements).map(([name, requirements]) => ({ id: `class-requirements-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, name: `${name} requirements`, requirements, referenceType: 'rule', referenceLabel: 'Rules', source: 'PHB' })),
        ...Object.entries(experienceTables).map(([id, values]) => ({ id: `experience-${id}`, name: `${id === 'paladinRanger' ? 'Paladin / Ranger' : id} experience`, levels: values.slice(1), referenceType: 'rule', referenceLabel: 'Rules', source: 'PHB' }))
    ];
    const abilityReferences = Object.entries({ str: 'Strength', dex: 'Dexterity', con: 'Constitution', int: 'Intelligence', wis: 'Wisdom', cha: 'Charisma' }).map(([ability, name]) => ({ id: `ability-reference-${ability}`, name: `${name} benefits`, description: abilityTooltip(ability, data.abilities[ability]), referenceType: 'ability', referenceLabel: 'Ability benefits', source: 'AD&D 2E PHB' }));
    return [
        ...spellCatalogRecords.map(record => ({ ...record, referenceType: 'spell', referenceLabel: 'Spells' })),
        ...classAbilityRecords.map(record => ({ ...record, referenceType: 'ability', referenceLabel: 'Abilities' })),
        ...abilityReferences,
        ...nonweaponCatalog.map(record => ({ ...record, referenceType: 'proficiency', referenceLabel: 'Proficiencies' })),
        ...languageRecords.map(record => ({ ...record, referenceType: 'language', referenceLabel: 'Languages' })),
        ...equipment,
        ...ranges,
        ...rules
    ];
}

function referenceValueText(value) {
    return Array.isArray(value) ? value.join(', ') : typeof value === 'object' && value !== null ? JSON.stringify(value) : value;
}

function referenceTooltip(record) {
    const fields = [record.referenceLabel, record.source, record.abilityType, record.category, record.level != null ? `Level ${record.level}` : '', record.materialComponents ? `Material: ${record.materialComponents}` : '', record.description || record.effect, Array.isArray(record.notes) ? record.notes.join('; ') : record.notes];
    return fields.filter(Boolean).map(referenceValueText).join(' | ');
}

function setupReferenceLibrary() {
    const grid = document.querySelector('.grid');
    if (!grid) return;
    let section = document.querySelector('.reference-library-section');
    if (!section) {
        section = document.createElement('section');
        section.className = 'card wide reference-library-section';
        grid.append(section);
    }
    const allRecords = referenceRecords();
    const modes = {
        all: { label: 'All', records: allRecords },
        spells: { label: 'Spells', records: allRecords.filter(record => record.referenceType === 'spell') },
        abilities: { label: 'Abilities', records: allRecords.filter(record => record.referenceType === 'ability') },
        proficiencies: { label: 'Proficiencies', records: allRecords.filter(record => record.referenceType === 'proficiency') },
        languages: { label: 'Languages', records: allRecords.filter(record => record.referenceType === 'language') },
        equipment: { label: 'Equipment', records: allRecords.filter(record => record.referenceType === 'equipment') },
        rules: { label: 'Rules', records: allRecords.filter(record => record.referenceType === 'rule') }
    };
    const mode = section.dataset.mode || 'spells';
    const active = modes[mode] || modes.spells;
    const records = active.records || [];
    const sources = [...new Set(records.flatMap(record => Array.isArray(record.source) ? record.source : [record.source]).filter(Boolean))].sort();
    const classes = [...new Set(records.flatMap(record => record.classLists || record.classes || []).filter(Boolean))].sort();
    const groups = [...new Set(records.map(record => record.category || record.group || record.abilityType).filter(Boolean))].sort();
    section.innerHTML = `<h2>Reference library</h2><div class="reference-library-tabs" role="tablist">${Object.entries(modes).map(([key, value]) => `<button type="button" class="reference-library-tab${key === mode ? ' active' : ''}" data-reference-mode="${key}" role="tab" aria-selected="${key === mode}">${value.label}</button>`).join('')}</div><div class="reference-library-filters"><label>Search<input type="search" data-reference-search placeholder="Name or source"></label>${classes.length ? `<label>Class<select data-reference-class><option value="">All classes</option>${classes.map(value => `<option value="${esc(value)}">${esc(value)}</option>`).join('')}</select></label>` : ''}${groups.length ? `<label>Category<select data-reference-group><option value="">All categories</option>${groups.map(value => `<option value="${esc(value)}">${esc(value)}</option>`).join('')}</select></label>` : ''}${sources.length ? `<label>Source<select data-reference-source><option value="">All sources</option>${sources.map(value => `<option value="${esc(value)}">${esc(value)}</option>`).join('')}</select></label>` : ''}</div><div class="reference-library-results" data-reference-results></div><div class="reference-library-detail" data-reference-detail aria-live="polite"><small>Select a result to inspect its available metadata.</small></div>`;
    const search = section.querySelector('[data-reference-search]');
    const classFilter = section.querySelector('[data-reference-class]');
    const groupFilter = section.querySelector('[data-reference-group]');
    const sourceFilter = section.querySelector('[data-reference-source]');
    const results = section.querySelector('[data-reference-results]');
    const detail = section.querySelector('[data-reference-detail]');
    const paginationControls = document.createElement('div');
    paginationControls.dataset.referencePagination = '';
    results.after(paginationControls);
    let referencePage = 0;
    const getName = record => record.name || record.spellName || record.proficiencyName || record.languageName || 'Unnamed record';
    const renderDetail = record => {
        const fields = record.referenceType === 'spell'
            ? [['Level', record.level], ['Class', (record.classLists || []).join(', ')], ['School / sphere', record.school || record.spellGroup || (record.sphere || []).join(', ')], ['Components', [record.verbal ? 'V' : '', record.somatic ? 'S' : '', record.material ? 'M' : ''].filter(Boolean).join(', ')], ['Material', record.materialComponents], ['Range', record.range], ['Casting time', record.castingTime], ['Duration', record.duration], ['Area', record.areaOfEffect], ['Saving throw', record.savingThrow], ['Description', record.description || record.effect], ['Notes', Array.isArray(record.notes) ? record.notes.join('; ') : record.notes], ['Source', record.source], ['Occurrence', record.sourceRecordId]]
            : [['Description', record.description || record.effect], ['Notes', Array.isArray(record.notes) ? record.notes.join('; ') : record.notes], ...Object.entries(record).filter(([key]) => !['id', 'name', 'spellName', 'description', 'effect', 'notes', 'referenceType', 'referenceLabel'].includes(key)).slice(0, 8).map(([key, value]) => [key, referenceValueText(value)])];
        detail.innerHTML = `<strong>${esc(getName(record))}</strong><dl>${fields.filter(([, value]) => value !== undefined && value !== null && value !== '').map(([label, value]) => `<dt>${esc(label)}</dt><dd>${esc(value)}</dd>`).join('')}</dl>`;
    };
    const renderResults = (resetPage = false) => {
        if (resetPage) referencePage = 0;
        const needle = String(search?.value || '').trim().toLowerCase();
        const matches = records.filter(record => {
            const name = getName(record).toLowerCase();
            const source = referenceValueText(record.source || '').toLowerCase();
            const recordClasses = record.classLists || record.classes || [];
            const group = record.category || record.group || record.abilityType || '';
            return (!needle || name.includes(needle) || source.includes(needle)) && (!classFilter || !classFilter.value || recordClasses.includes(classFilter.value)) && (!groupFilter || !groupFilter.value || group === groupFilter.value) && (!sourceFilter || !sourceFilter.value || spellSources(record).includes(sourceFilter.value));
        });
        const pagination = paginateCatalog(matches, referencePage, 40);
        referencePage = pagination.currentPage;
        const visibleMatches = pagination.records;
        const loadingMessage = mode === 'spells' && spellCatalogStatus === 'loading'
            ? 'Loading spell reference records...'
            : mode === 'languages' && languageCatalogStatus === 'loading'
                ? 'Loading language reference records...'
                : '';
        const unavailableMessage = mode === 'spells' && spellCatalogStatus === 'error'
            ? 'Spell reference records unavailable.'
            : mode === 'languages' && languageCatalogStatus === 'error'
                ? 'Language reference records unavailable.'
                : '';
        const emptyMessage = loadingMessage || unavailableMessage || 'No matching reference records.';
        results.innerHTML = visibleMatches.map((record, index) => `<button type="button" class="reference-library-result" title="${esc(referenceTooltip(record))}" data-reference-result="${index}"><strong>${esc(getName(record))}</strong><small>${esc(record.referenceLabel || record.abilityType || record.category || '')} · ${esc(readableSourceSummary(record.source))}</small></button>`).join('') || `<small>${esc(emptyMessage)}</small>`;
        paginationControls.innerHTML = catalogPaginationMarkup(pagination, 'reference');
        results.querySelectorAll('[data-reference-result]').forEach(button => button.onclick = () => renderDetail(visibleMatches[+button.dataset.referenceResult]));
        paginationControls.querySelectorAll('[data-reference-page]').forEach(button => button.onclick = () => { referencePage = Number(button.dataset.referencePage); renderResults(); });
    };
    section.querySelectorAll('[data-reference-mode]').forEach(button => button.onclick = () => { section.dataset.mode = button.dataset.referenceMode; setupReferenceLibrary(); });
    [search, classFilter, groupFilter, sourceFilter].filter(Boolean).forEach(control => control.oninput = () => renderResults(true));
    renderResults();
}

function setupSpellSectionPosition() {
    const combat = [...document.querySelectorAll('.grid > .card')].find(card => card.querySelector(':scope > h2')?.textContent.includes('Combat'));
    const spells = [...document.querySelectorAll('.grid > .card')].find(card => card.querySelector(':scope > h2')?.textContent.includes('Spells'));
    if (combat && spells) combat.after(spells);
}

let spellCatalog = [];
let spellCatalogRecords = [];
let spellCatalogValidation = [];
let spellCatalogConflicts = [];
let spellCatalogSourceRecords = [];
let spellReconciliationArtifacts = null;
let spellMaterialEnrichmentRecords = [];
let spellMaterialEnrichmentConflicts = [];
let spellPscManualReviewCandidates = 0;

function normalizePscMaterialEnrichments(batch, volume) {
    return Object.values(batch || {}).map(record => ({
        ...record,
        source: `Priest Spell Compendium Volume ${volume}`,
        sourceCategory: 'Priest',
        sourceBook: 'Priest Spell Compendium',
        sourceVolume: volume,
        sourceAuthority: 'PSC'
    }));
}

function applySpellMaterialEnrichments(records, enrichments) {
    const conflicts = [];
    const enrichedRecords = records.map(record => ({ ...record }));
    enrichments.forEach(enrichment => {
        const match = enrichedRecords.find(record => record.sourceRecordId === enrichment.sourceRecordId);
        if (!match) {
            conflicts.push({ sourceRecordId: enrichment.sourceRecordId, type: 'missing-source-occurrence', conflictingFields: ['sourceRecordId'] });
            return;
        }
        const consistencyFields = ['id', 'source'];
        const inconsistentFields = consistencyFields.filter(field => enrichment[field] !== match[field]);
        if (inconsistentFields.length) {
            conflicts.push({ sourceRecordId: enrichment.sourceRecordId, type: 'source-consistency-conflict', conflictingFields: inconsistentFields });
            return;
        }
        if (match.materialComponents == null) {
            match.materialComponents = enrichment.materialComponents;
        } else if (match.materialComponents !== enrichment.materialComponents) {
            conflicts.push({ sourceRecordId: enrichment.sourceRecordId, type: 'material-components-conflict', conflictingFields: ['materialComponents'], existingValue: match.materialComponents, incomingValue: enrichment.materialComponents });
        }
    });
    return { records: enrichedRecords, conflicts };
}

async function loadSpellMaterialEnrichments() {
    try {
        const [batchOneResponse, batchTwoResponse, batchThreeResponse, batchFourResponse, batchFiveResponse, batchSixResponse, pscFinalResponse] = await Promise.all([
            fetch('data/spell-material-components-wsc-batch-1.json'),
            fetch('data/spell-material-components-batch-2.json'),
            fetch('data/spell-material-components-wsc-v1-batch-3.json'),
            fetch('data/spell-material-components-wsc-v2-batch-4.json'),
            fetch('data/spell-material-components-wsc-v3-batch-5.json'),
            fetch('data/spell-material-components-wsc-v4-batch-6.json'),
            fetch('data/PSC-MC-1.0.json')
        ]);
        if (![batchOneResponse, batchTwoResponse, batchThreeResponse, batchFourResponse, batchFiveResponse, batchSixResponse, pscFinalResponse].every(response => response.ok)) throw new Error('Spell material enrichment unavailable');
        const [batchOne, batchTwo, batchThree, batchFour, batchFive, batchSix, pscFinal] = await Promise.all([
            batchOneResponse.json(), batchTwoResponse.json(), batchThreeResponse.json(), batchFourResponse.json(), batchFiveResponse.json(), batchSixResponse.json(), pscFinalResponse.json()
        ]);
        spellPscManualReviewCandidates = 0;
        spellMaterialEnrichmentRecords = [...batchOne, ...batchTwo, ...batchThree, ...batchFour, ...batchFive, ...batchSix, ...pscFinal.records.map(record => ({ ...record, source: `${record.sourceBook} Volume ${record.sourceVolume}`, sourceCategory: 'Priest', sourceAuthority: record.sourceAuthority }))];
    } catch {
        spellMaterialEnrichmentRecords = [];
    }
}

function validatePartialSpellReconciliation(index, conflicts, report) {
    const errors = [];
    if (!Array.isArray(index)) errors.push('Canonical index must be an array.');
    if (!Array.isArray(conflicts)) errors.push('Conflict report must be an array.');
    if (!report || typeof report !== 'object') errors.push('Reconciliation report must be an object.');
    if (report && !String(report.scopeLimitation || '').toLowerCase().includes('not included')) errors.push('Reconciliation report must document its partial scope.');
    if (report && report.duplicateSourceRecordIds?.length) errors.push('Reconciliation report contains duplicate sourceRecordIds.');
    return errors;
}

function setupSpellTracking() {
    const section = [...document.querySelectorAll('.grid > .card')].find(card => card.querySelector(':scope > h2')?.textContent.includes('Spells'));
    if (!section) return;
    section.innerHTML = `<h2>Spells and abilities</h2><div class="spell-slots"><h3>Spell slots</h3><table class="spell-slots-table"><thead><tr><th>Level</th><th>Available</th><th>Used</th><th>Remaining</th></tr></thead><tbody>${data.spellSlots.map((slot, index) => `<tr><th>${esc(slot.level)}</th><td><input type="number" min="0" step="1" data-spell-slot="${index}" data-spell-slot-key="available" value="${esc(slot.available)}"></td><td><input type="number" min="0" step="1" data-spell-slot="${index}" data-spell-slot-key="used" value="${esc(slot.used)}"></td><td><output data-spell-remaining="${index}">-</output></td></tr>`).join('')}</tbody></table><small>Enter the slots available for this character. Used slots are tracked separately and never exceed the available count.</small></div><div class="manual-spells"><h3>Manual spells and abilities</h3><div class="tableWrap"><table class="spells-table"><thead><tr><th>Name</th><th>Level</th><th>Type</th><th>School / sphere</th><th>Known</th><th>Memorized</th><th>Cast / used</th><th>Notes</th><th></th></tr></thead><tbody>${data.spells.map((spell, index) => { const preset = spellCatalog.some(item => item.name === spell.name); return `<tr><td><select data-spell-preset="${index}"><option value="Other" ${preset ? '' : 'selected'}>Other</option><optgroup label="Wizard 1st level">${spellCatalog.filter(item => item.source === 'Wizard').map(item => `<option value="${esc(item.name)}" ${spell.name === item.name ? 'selected' : ''}>${esc(item.name)}</option>`).join('')}</optgroup><optgroup label="Priest 1st level">${spellCatalog.filter(item => item.source === 'Priest').map(item => `<option value="${esc(item.name)}" ${spell.name === item.name ? 'selected' : ''}>${esc(item.name)}</option>`).join('')}</optgroup></select><input data-spell-item="${index}" data-spell-key="name" value="${esc(spell.name)}" placeholder="Spell or ability" ${preset ? 'hidden' : ''}></td><td><input data-spell-item="${index}" data-spell-key="level" value="${esc(spell.level)}" placeholder="1st"></td><td><select data-spell-item="${index}" data-spell-key="type"><option ${spell.type === 'Spell' ? 'selected' : ''}>Spell</option><option ${spell.type === 'Racial ability' ? 'selected' : ''}>Racial ability</option><option ${spell.type === 'Class ability' ? 'selected' : ''}>Class ability</option><option ${spell.type === 'Other' ? 'selected' : ''}>Other</option></select></td><td><input data-spell-item="${index}" data-spell-key="school" value="${esc(spell.school)}" placeholder="School / sphere"></td><td><input data-spell-item="${index}" data-spell-key="known" value="${esc(spell.known)}"></td><td><input data-spell-item="${index}" data-spell-key="memorizedQty" value="${esc(spell.memorizedQty)}" type="number" min="0" step="1"></td><td><input data-spell-item="${index}" data-spell-key="castQty" value="${esc(spell.castQty)}" type="number" min="0" step="1"></td><td><input data-spell-item="${index}" data-spell-key="notes" value="${esc(spell.notes)}"></td><td><button type="button" class="remove" data-spell-remove="${index}" aria-label="Remove spell or ability">×</button></td></tr>`; }).join('')}</tbody></table></div><button type="button" class="add" data-spell-add>Add spell or ability</button></div>`;
    const spellSlots = section.querySelector('.spell-slots');
    const sourceNames = { priest: 'Priest', wizard: 'Wizard', bard: 'Bard', ranger: 'Ranger', paladin: 'Paladin' };
    const slotSources = availableCastingSources();
    const primarySlotTable = section.querySelector('.spell-slots-table');
    const slotTableTemplate = primarySlotTable.cloneNode(true);
    spellSlots.querySelectorAll('.spell-slots-table').forEach(table => table.remove());
    const sourceGrid = document.createElement('div');
    sourceGrid.className = 'spell-slot-sources';
    slotSources.forEach((source, sourceIndex) => {
        const table = sourceIndex === 0 ? primarySlotTable : slotTableTemplate.cloneNode(true);
        const pool = spellSlotPool(source);
        const wrapper = document.createElement('div');
        wrapper.className = 'spell-slot-source';
        wrapper.innerHTML = `<h4>${esc(sourceNames[source] || source)} spell slots</h4>`;
        table.querySelectorAll('[data-spell-slot]').forEach(input => {
            input.dataset.spellSlotSource = source;
            const slot = pool[+input.dataset.spellSlot];
            if (input.dataset.spellSlotKey === 'available') input.value = slot.available;
            if (input.dataset.spellSlotKey === 'used') input.value = slot.used;
        });
        table.querySelectorAll('[data-spell-remaining]').forEach(output => output.dataset.spellRemainingSource = source);
        wrapper.append(table);
        sourceGrid.append(wrapper);
    });
    if (slotSources.length) spellSlots.append(sourceGrid);
    else spellSlots.insertAdjacentHTML('beforeend', '<p class="spell-slot-empty">Set a supported casting class to display spell slots.</p>');
    const slotSummary = document.createElement('div');
    slotSummary.className = 'spell-slot-summary';
    slotSummary.innerHTML = '<strong>Spell slot summary</strong><button type="button" class="set-spell-slots">Set from class progression</button><div class="spell-slot-summary-details"></div><div class="spell-slot-session"></div>';
    slotSummary.querySelector('.set-spell-slots').disabled = !slotSources.length;
    slotSummary.querySelector('.set-spell-slots').title = slotSources.length ? 'Set each active source from its class progression.' : 'Set a supported casting class first.';
    section.querySelector('.spell-slots').prepend(slotSummary);
    const updateSlotSummary = () => {
        const context = spellSlotProgressionContext();
        const recommendations = spellSlotRecommendations();
        const details = slotSummary.querySelector('.spell-slot-summary-details');
        const session = slotSummary.querySelector('.spell-slot-session');
        if (!context || !recommendations) {
            details.textContent = 'No supported class progression detected. Set slots manually.';
        } else {
            const className = context.selectedEntry.className || 'Class';
            const progressionName = context.progressionCatalog.name || 'Class progression';
            details.textContent = `${className} level ${context.selectedLevel} · ${progressionName} · Suggested available: ${recommendations.join(' / ')}`;
        }
        const pools = slotSources.map(source => spellSlotPool(source));
        const used = pools.flat().reduce((total, slot) => total + (Number.parseInt(slot.used, 10) || 0), 0);
        const remaining = pools.flat().reduce((total, slot) => total + Math.max(0, (Number.parseInt(slot.available, 10) || 0) - (Number.parseInt(slot.used, 10) || 0)), 0);
        session.textContent = `Session usage: ${used} used · ${remaining} remaining across ${slotSources.length} source${slotSources.length === 1 ? '' : 's'}`;
    };
    slotSummary.querySelector('.set-spell-slots').onclick = () => {
        const updated = slotSources.reduce((changed, source) => setSpellSlotsFromProgression(source) || changed, false);
        if (updated) {
            changed();
            render();
        }
    };
    const usageLog = document.createElement('div');
    usageLog.className = 'spell-usage-log';
    usageLog.innerHTML = '<strong>Session spell usage</strong><div class="spell-usage-log-entries"></div>';
    section.querySelector('.spell-slots').append(usageLog);
    const renderUsageLog = () => {
        const entries = usageLog.querySelector('.spell-usage-log-entries');
        entries.innerHTML = data.spellUsageLog.length ? data.spellUsageLog.map((entry, index) => `<div class="spell-usage-entry"><span>${esc(entry.spellName)} · ${esc(entry.spellLevel)} · ${esc(entry.purpose || 'No purpose recorded')}${entry.target ? ` · Target: ${esc(entry.target)}` : ''}</span><button type="button" data-spell-usage-remove="${index}" aria-label="Undo spell cast">Undo</button></div>`).join('') : '<small>No spells cast this session.</small>';
        entries.querySelectorAll('[data-spell-usage-remove]').forEach(button => button.onclick = () => {
            const entry = data.spellUsageLog[+button.dataset.spellUsageRemove];
            const slot = spellSlotPool(entry?.castingSource).find(item => item.level === entry?.slotLevel);
            if (slot) slot.used = String(Math.max(0, (Number.parseInt(slot.used, 10) || 0) - 1));
            data.spellUsageLog.splice(+button.dataset.spellUsageRemove, 1);
            changed();
            render();
        });
    };
    renderUsageLog();
    const castToolbar = document.createElement('div');
    castToolbar.className = 'spell-cast-toolbar';
    castToolbar.innerHTML = '<div class="spell-cast-picker"><img class="casting-source-icon" data-casting-source-icon src="wand-icon.svg" alt=""><label>Cast from<select data-configured-source></select></label><label>Cast configured spell<select data-configured-spell><option value="">Choose a spell</option></select><span data-configured-spell-info>Select a spell to see its slot.</span></label><button type="button" class="spell-cast-button" data-configured-cast aria-label="Cast selected spell" title="Cast selected spell"><img src="wand-icon.svg" alt=""></button></div>';
    slotSummary.after(castToolbar);
    const configuredSpell = castToolbar.querySelector('[data-configured-spell]');
    const configuredSource = castToolbar.querySelector('[data-configured-source]');
    const configuredInfo = castToolbar.querySelector('[data-configured-spell-info]');
    const sourceIcon = castToolbar.querySelector('[data-casting-source-icon]');
    const sourceIcons = { wizard: 'wizard-hat-icon.svg', priest: 'holy-symbol-icon.svg' };
    const updateSourceIcon = () => {
        const source = configuredSource.value;
        sourceIcon.src = sourceIcons[source] || 'wand-icon.svg';
        sourceIcon.alt = source === 'wizard' ? 'Wizard source' : source === 'priest' ? 'Priest source' : 'Cast source';
    };
    availableCastingSources().forEach(source => configuredSource.insertAdjacentHTML('beforeend', `<option value="${source}">${esc(source)}</option>`));
    const refreshConfiguredSpells = () => {
        configuredSpell.innerHTML = '<option value="">Choose a spell</option>';
        data.spells.forEach((spell, index) => { if (spellCanBeCast(spell, configuredSource.value || inferredCastingSource(spell)) && (!spell.castingSource || inferredCastingSource(spell) === configuredSource.value)) configuredSpell.insertAdjacentHTML('beforeend', `<option value="${index}">${esc(spell.name || 'Unnamed spell')} · ${esc(spell.level || '?')}</option>`); });
        updateConfiguredSpell();
    };
    const updateConfiguredSpell = () => {
        const spell = data.spells[Number.parseInt(configuredSpell.value, 10)];
        const level = normalizeSpellLevel(spell?.level);
        const slot = spellSlotPool(configuredSource.value || inferredCastingSource(spell)).find(item => normalizeSpellLevel(item.level) === level);
        const available = Number.parseInt(slot?.available, 10) || 0;
        const used = Number.parseInt(slot?.used, 10) || 0;
        configuredInfo.textContent = spell && slot ? `Level ${level} · Slot cost 1 · Available ${available} · Used ${used} · Remaining ${Math.max(0, available - used)}` : 'Select a spell with a matching available slot.';
        castToolbar.querySelector('[data-configured-cast]').disabled = !spell || !spellCanBeCast(spell, configuredSource.value);
    };
    configuredSpell.onchange = updateConfiguredSpell;
    configuredSource.onchange = () => { updateSourceIcon(); refreshConfiguredSpells(); };
    configuredSource.value = availableCastingSources()[0] || '';
    updateSourceIcon();
    refreshConfiguredSpells();
    updateConfiguredSpell();
    castToolbar.querySelector('[data-configured-cast]').onclick = async () => {
        const index = Number.parseInt(configuredSpell.value, 10);
        const spell = data.spells[index];
        if (!spell || !spellCanBeCast(spell, configuredSource.value)) return;
        const details = await showSpellCastDialog(spell);
        if (!details) return;
        const level = normalizeSpellLevel(spell.level);
        const slot = spellSlotPool(configuredSource.value).find(item => normalizeSpellLevel(item.level) === level);
        slot.used = String((Number.parseInt(slot.used, 10) || 0) + 1);
        data.spellUsageLog.push({ timestamp: new Date().toISOString(), castingSource: configuredSource.value, spellName: spell.name || 'Unnamed spell', spellLevel: spell.level || `${level}th`, slotLevel: slot.level, ...details });
        changed();
        render();
    };
    const trackedTableHeading = section.querySelector('.manual-spells > h3');
    if (trackedTableHeading) trackedTableHeading.textContent = 'Spells and abilities';
    section.querySelectorAll('[data-spell-preset]').forEach(select => select.remove());
    section.querySelectorAll('[data-spell-key="name"]').forEach(input => input.hidden = false);
    const spellHeader = section.querySelector('.spells-table thead tr');
    const castHeader = [...spellHeader.children].find(cell => cell.textContent.trim() === 'Cast / used');
    if (castHeader) castHeader.textContent = 'Uses';
    if (castHeader) {
        const headerAnchor = castHeader.nextSibling;
        ['V', 'S', 'M', 'Materials'].forEach(label => { const header = document.createElement('th'); header.textContent = label; spellHeader.insertBefore(header, headerAnchor); });
        section.querySelectorAll('.spells-table tbody tr').forEach((row, index) => {
            const anchor = row.children[castHeader.cellIndex + 1];
            [['verbal', 'Verbal component'], ['somatic', 'Somatic component'], ['material', 'Material component']].forEach(([key, label]) => { const cell = document.createElement('td'); cell.innerHTML = `<input type="checkbox" data-spell-item="${index}" data-spell-key="${key}" aria-label="${label}" ${data.spells[index][key] ? 'checked' : ''}>`; row.insertBefore(cell, anchor); });
            const materials = document.createElement('td');
            materials.innerHTML = `<input data-spell-item="${index}" data-spell-key="materialComponents" value="${esc(data.spells[index].materialComponents)}" placeholder="Required materials" title="${esc(data.spells[index].materialComponents || 'No material requirements recorded')}">`;
            row.insertBefore(materials, anchor);
        });
    }
    const knownColumnIndex = [...spellHeader.children].findIndex(cell => cell.textContent.trim() === 'Known');
    if (knownColumnIndex >= 0) {
        spellHeader.children[knownColumnIndex].remove();
        section.querySelectorAll('.spells-table tbody tr').forEach(row => row.children[knownColumnIndex]?.remove());
    }
    const sourceLabels = { priest: 'Priest table', wizard: 'Wizard table', bard: 'Bard table', ranger: 'Ranger table', paladin: 'Paladin table' };
    section.querySelectorAll('[data-spell-key="school"]').forEach(input => {
        const sourceLabel = document.createElement('small');
        sourceLabel.className = 'spell-source-label';
        sourceLabel.textContent = sourceLabels[inferredCastingSource(data.spells[+input.dataset.spellItem])] || 'Manual / item source';
        input.closest('td')?.append(sourceLabel);
    });
    const memorizedHeader = [...spellHeader.children].find(cell => cell.textContent.trim() === 'Memorized');
    if (memorizedHeader) memorizedHeader.textContent = 'Prep.';
    section.querySelectorAll('[data-spell-key="memorizedQty"]').forEach(input => {
        const spell = data.spells[+input.dataset.spellItem];
        input.dataset.spellKey = 'memorized';
        input.type = 'checkbox';
        input.checked = spell.memorized === true || (Number.parseInt(spell.memorizedQty, 10) || 0) > 0;
        input.value = 'true';
    });
    section.querySelectorAll('[data-spell-key="castQty"]').forEach(input => {
        input.dataset.spellKey = 'uses';
        input.type = 'number';
        input.min = '0';
        input.step = '1';
        input.value = data.spells[+input.dataset.spellItem].uses;
    });
    const spellCastHeader = document.createElement('th');
    spellCastHeader.textContent = 'Cast';
    spellHeader.insertBefore(spellCastHeader, spellHeader.firstElementChild);
    const updateSlots = () => section.querySelectorAll('[data-spell-remaining]').forEach(output => {
        const slot = spellSlotPool(output.dataset.spellRemainingSource)[+output.dataset.spellRemaining];
        const available = Number.parseInt(slot.available, 10);
        const used = Math.max(0, Number.parseInt(slot.used, 10) || 0);
        output.textContent = Number.isInteger(available) ? Math.max(0, available - used) : '-';
        output.title = Number.isInteger(available) ? `Remaining slots = available ${available} - used ${used} = ${Math.max(0, available - used)}.` : 'Remaining slots = available slots - used slots.';
    });
    section.querySelectorAll('[data-spell-slot]').forEach(input => input.oninput = () => {
        const slot = spellSlotPool(input.dataset.spellSlotSource)[+input.dataset.spellSlot];
        slot[input.dataset.spellSlotKey] = input.value;
        if (input.dataset.spellSlotKey === 'available') {
            const used = Number.parseInt(slot.used, 10);
            if (Number.isInteger(used) && Number.isInteger(Number.parseInt(slot.available, 10)) && used > Number.parseInt(slot.available, 10)) slot.used = slot.available;
        }
        updateSlots();
        updateSlotSummary();
        changed();
    });
    section.querySelectorAll('[data-spell-item]').forEach(input => input.oninput = () => {
        data.spells[+input.dataset.spellItem][input.dataset.spellKey] = input.type === 'checkbox' ? input.checked : input.value;
        if (['notes', 'materialComponents'].includes(input.dataset.spellKey)) input.title = input.value;
        changed();
    });
    section.querySelectorAll('[data-spell-key="notes"]').forEach(input => input.title = input.value || 'No notes');
    section.querySelectorAll('[data-spell-key="materialComponents"]').forEach(input => input.title = input.value || 'No material requirements recorded');
    section.querySelectorAll('.spells-table tbody tr').forEach((row, index) => {
        row.dataset.spellSource = inferredCastingSource(data.spells[index]) || availableCastingSources()[0] || 'priest';
        const actionCell = document.createElement('td');
        const castButton = document.createElement('button');
        castButton.type = 'button';
        castButton.className = 'spell-cast-button';
        castButton.innerHTML = '<img src="wand-icon.svg" alt="">';
        castButton.setAttribute('aria-label', `Cast ${data.spells[index].name || 'spell'}`);
        castButton.disabled = !spellCanBeCast(data.spells[index], row.dataset.spellSource);
        castButton.title = castButton.disabled ? 'Spell must be known, prepared when required, and have a matching available slot.' : 'Consume one matching spell slot and record the casting.';
        castButton.onclick = async () => {
            const spell = data.spells[index];
            if (!spellCanBeCast(spell, row.dataset.spellSource)) return;
            const details = await showSpellCastDialog(spell);
            if (!details) return;
            const level = normalizeSpellLevel(spell.level);
            const slot = spellSlotPool(inferredCastingSource(spell)).find(item => normalizeSpellLevel(item.level) === level);
            slot.used = String((Number.parseInt(slot.used, 10) || 0) + 1);
            data.spellUsageLog.push({ timestamp: new Date().toISOString(), castingSource: row.dataset.spellSource, spellName: spell.name || 'Unnamed spell', spellLevel: spell.level || `${level}th`, slotLevel: slot.level, ...details });
            changed();
            render();
        };
        actionCell.append(castButton);
        row.insertBefore(actionCell, row.firstElementChild);
    });
    section.querySelector('[data-spell-add]').onclick = () => {
        data.spells.push({ name: '', level: '', type: 'Spell', school: '', known: '', memorizedQty: '', uses: '', verbal: false, somatic: false, material: false, materialComponents: '', notes: '' });
        changed();
        render();
    };
    section.querySelectorAll('[data-spell-remove]').forEach(button => button.onclick = () => {
        data.spells.splice(+button.dataset.spellRemove, 1);
        changed();
        render();
    });
    updateSlots();
    updateSlotSummary();
}

function setupCampRecoverySection() {
    const target = document.querySelector('.hit-points-section');
    if (!target) return;
    const section = document.createElement('section');
    section.className = 'camp-recovery-section';
    section.innerHTML = '<h3>Camp & Recovery</h3><div class="camp-recovery-layout"><img class="campfire-pixel" src="campfire-pixel.svg" alt="Pixel-art campfire"><div><div class="camp-recovery-actions"><button type="button" data-recovery-action="spells">Recover spells</button><button type="button" data-recovery-action="rest">Rest 8 hours</button><button type="button" data-recovery-action="day">New day</button><label>HP healed<input type="number" min="0" step="1" data-recovery-healing value="0"></label></div><div class="camp-recovery-summary"></div><div class="camp-recovery-log"></div></div></div>';
    target.append(section);
    const promptDetails = title => new Promise(resolve => {
        const modal = document.createElement('div');
        modal.className = 'recovery-modal';
        modal.innerHTML = `<form class="recovery-dialog"><h3>${esc(title)}</h3><label>Enter the location where you are resting<input name="location" autocomplete="off"></label><label>Enter any notes for this recovery<input name="notes" autocomplete="off"></label><div class="recovery-dialog-actions"><button type="button" data-recovery-cancel>Cancel</button><button type="submit" class="primary">Confirm</button></div></form>`;
        const close = value => { modal.remove(); resolve(value); };
        modal.querySelector('[data-recovery-cancel]').onclick = () => close(null);
        modal.querySelector('form').onsubmit = event => { event.preventDefault(); close({ location: modal.querySelector('[name="location"]').value.trim(), notes: modal.querySelector('[name="notes"]').value.trim() }); };
        document.body.append(modal);
        modal.querySelector('[name="location"]').focus();
    });
    const recordRecovery = (eventType, hours, details) => {
        const healing = Math.max(0, Number.parseInt(section.querySelector('[data-recovery-healing]').value, 10) || 0);
        if (healing) data.combat.hpCurrent = String(Math.min(Number.parseInt(data.combat.hpMax, 10) || 0, (Number.parseInt(data.combat.hpCurrent, 10) || 0) + healing));
        data.recoveryLog.push({ timestamp: new Date().toISOString(), eventType, hours, location: details.location, notes: details.notes });
        return true;
    };
    const recoverSpells = resetCastCounters => {
        Object.values(data.spellSlotPools).forEach(pool => pool.forEach(slot => slot.used = ''));
        if (resetCastCounters) data.spells.forEach(spell => { spell.uses = ''; spell.castQty = ''; });
    };
    section.querySelectorAll('[data-recovery-action]').forEach(button => button.onclick = async () => {
        const action = button.dataset.recoveryAction;
        const labels = { spells: 'Recover spells', rest: 'Rest 8 hours', day: 'Start a new day' };
        const details = await promptDetails(labels[action]);
        if (!details) return;
        if (action === 'spells') recoverSpells(false);
        if (action === 'day') {
            recoverSpells(true);
            data.spellUsageLog = [];
        }
        recordRecovery(action === 'day' ? 'new-day' : action === 'spells' ? 'spell-recovery' : 'rest', action === 'rest' ? 8 : '', details);
        changed();
        render();
    });
    updateCampRecoverySummary();
    const recoveryLog = section.querySelector('.camp-recovery-log');
    recoveryLog.innerHTML = data.recoveryLog.slice(-5).reverse().map(entry => `<div>${esc(entry.eventType)}${entry.hours ? ` · ${esc(entry.hours)} hours` : ''}${entry.location ? ` · ${esc(entry.location)}` : ''}${entry.notes ? ` · ${esc(entry.notes)}` : ''}</div>`).join('') || '<small>No recovery events recorded.</small>';
}

const resistancePresets = [
    ['Elf: Sleep and Charm', 'Spell immunity', 'Sleep and Charm', '90%', 'Racial'], ['Half-Elf: Sleep and Charm', 'Spell immunity', 'Sleep and Charm', '30%', 'Racial'],
    ['Dwarf: saving throw bonus', 'Saving throw bonus', 'Wands, staves, rods, spells, poison', 'CON-based', 'Racial'], ['Halfling: saving throw bonus', 'Saving throw bonus', 'Wands, staves, rods, spells, poison', 'CON-based', 'Racial'],
    ['Goblin: enemy attack penalty', 'Enemy attack penalty', 'Ogre, troll, and giant attacks', '-4 to hit', 'Racial'], ['Lizardfolk: hold breath', 'Environmental resistance', 'Holding breath', '1 round + 2/3 CON', 'Racial'],
    ['Magic resistance', 'Magic resistance', 'Magical effects', '10%', 'Item'], ['Fire resistance', 'Damage resistance', 'Fire damage', 'Half damage', 'Spell / item']
];

function setupResistanceSection() {
    const section = document.createElement('section');
    section.className = 'resistance-section';
    section.innerHTML = `<h2>Resistances and immunities</h2><div class="tableWrap"><table class="resistance-table"><thead><tr><th>Active</th><th>Preset / type</th><th>Applies to</th><th>Value</th><th>Source</th><th>Notes</th><th></th></tr></thead><tbody>${data.resistances.map((item, index) => `<tr><td><input type="checkbox" data-resistance-item="${index}" data-resistance-key="active" ${item.active !== false ? 'checked' : ''} aria-label="Active resistance"></td><td><select data-resistance-preset="${index}"><option value="Other" ${resistancePresets.some(preset => preset[1] === item.type && preset[2] === item.appliesTo && preset[3] === item.value) ? '' : 'selected'}>Other</option>${resistancePresets.map(preset => `<option value="${esc(preset[0])}" ${item.appliesTo === preset[2] && item.value === preset[3] && item.source === preset[4] ? 'selected' : ''}>${esc(preset[0])}</option>`).join('')}</select><input data-resistance-item="${index}" data-resistance-key="type" value="${esc(item.type)}" placeholder="Resistance type"></td><td><input data-resistance-item="${index}" data-resistance-key="appliesTo" value="${esc(item.appliesTo)}"></td><td><input data-resistance-item="${index}" data-resistance-key="value" value="${esc(item.value)}"></td><td><input data-resistance-item="${index}" data-resistance-key="source" value="${esc(item.source)}"></td><td><input data-resistance-item="${index}" data-resistance-key="notes" value="${esc(item.notes)}"></td><td><button type="button" class="remove" data-resistance-remove="${index}" aria-label="Remove resistance">×</button></td></tr>`).join('')}</tbody></table></div><button type="button" class="add" data-resistance-add>Add resistance</button><small class="resistance-note">Active entries are recorded for reference. Apply percentage resistance, immunity, damage reduction, save bonuses, and enemy penalties according to the listed effect.</small>`;
    const heading = section.querySelector('h2');
    if (heading) heading.outerHTML = '<h3>Resistances and immunities</h3>';
    const target = document.querySelector('.hit-points-section');
    if (target) target.append(section); else document.querySelector('.grid').append(section);
    section.querySelector('[data-resistance-add]').onclick = () => { data.resistances.push({ type: 'Other', appliesTo: '', value: '', source: '', active: true, notes: '' }); changed(); render(); };
    section.querySelectorAll('[data-resistance-item]').forEach(input => input.oninput = () => { const item = data.resistances[+input.dataset.resistanceItem]; item[input.dataset.resistanceKey] = input.type === 'checkbox' ? input.checked : input.value; changed(); });
    section.querySelectorAll('[data-resistance-preset]').forEach(select => select.onchange = () => { const preset = resistancePresets.find(item => item[0] === select.value); if (!preset) return; data.resistances[+select.dataset.resistancePreset] = { type: preset[1], appliesTo: preset[2], value: preset[3], source: preset[4], active: true, notes: '' }; changed(); render(); });
    section.querySelectorAll('[data-resistance-remove]').forEach(button => button.onclick = () => { data.resistances.splice(+button.dataset.resistanceRemove, 1); changed(); render(); });
}

function setupGlobalModifiersSection() {
    const section = document.createElement('section');
    section.className = 'global-modifiers-section';
    const categories = ['Hit', 'Damage', 'Missile Hit', 'Missile Damage', 'THAC0', 'Armor Class', 'Initiative', 'Saving Throws', 'Spell Slots', 'Surprise', 'Enemy Surprise', 'Resistance', 'Magic Resistance', 'Movement', 'Extra Attacks', 'Other'];
    section.innerHTML = `<h2>Global modifiers</h2><div class="tableWrap"><table class="global-modifiers-table"><thead><tr><th>Active</th><th>Category</th><th>Value</th><th>Applies to</th><th>Source</th><th>Condition</th><th>Notes</th><th></th></tr></thead><tbody>${data.globalModifiers.map((item, index) => `<tr><td><input type="checkbox" data-global-modifier="${index}" data-global-key="active" ${item.active !== false ? 'checked' : ''} aria-label="Active global modifier"></td><td><select data-global-modifier="${index}" data-global-key="category">${categories.map(category => `<option ${item.category === category ? 'selected' : ''}>${category}</option>`).join('')}</select></td><td><input type="number" data-global-modifier="${index}" data-global-key="value" value="${esc(item.value)}" step="1"></td><td><input data-global-modifier="${index}" data-global-key="appliesTo" value="${esc(item.appliesTo)}" placeholder="All or weapon name"></td><td><input data-global-modifier="${index}" data-global-key="source" value="${esc(item.source)}"></td><td><input data-global-modifier="${index}" data-global-key="condition" value="${esc(item.condition)}"></td><td><input data-global-modifier="${index}" data-global-key="notes" value="${esc(item.notes)}"></td><td><button type="button" class="remove" data-global-remove="${index}" aria-label="Remove global modifier">×</button></td></tr>`).join('')}</tbody></table></div><button type="button" class="add" data-global-add>Add modifier</button><small>Active global modifiers feed supported calculations. Use negative values to improve lower-is-better results such as AC, THAC0, and saves; use positive values for bonuses to hit or damage.</small>`;
    const target = [...document.querySelectorAll('.grid > .card')].find(card => card.querySelector(':scope > h2')?.textContent.includes('ABILITIES'));
    if (target) target.append(section); else document.querySelector('.grid')?.append(section);
    section.querySelector('[data-global-add]').onclick = () => { data.globalModifiers.push({ category: 'Other', value: '', appliesTo: '', source: '', condition: '', active: true, notes: '' }); changed(); render(); };
    section.querySelectorAll('[data-global-modifier]').forEach(input => input.oninput = () => { const item = data.globalModifiers[+input.dataset.globalModifier]; item[input.dataset.globalKey] = input.type === 'checkbox' ? input.checked : input.value; updateThac0(); updateSavingThrows(); updateAcTotal(); updateWeaponThac0(); changed(); });
    section.querySelectorAll('[data-global-remove]').forEach(button => button.onclick = () => { data.globalModifiers.splice(+button.dataset.globalRemove, 1); changed(); render(); });
}

function setupSurpriseSection() {
    if (document.querySelector('.surprise-section')) return;
    const section = document.createElement('section');
    section.className = 'surprise-section';
    const bonus = data.surpriseBonus;
    section.innerHTML = `<h2>Surprise and ambush</h2><div class="surprise-layout"><div class="surprise-summary"><strong>AMBUSH</strong><span>Enemy surprise: ${esc(bonus.fullModifier)} / ${esc(bonus.reducedModifier)}</span></div><div class="surprise-fields"><label><input type="checkbox" data-surprise-key="active" ${bonus.active !== false ? 'checked' : ''}> Active</label><label>Target<select data-surprise-key="target"><option ${bonus.target === 'Enemy' ? 'selected' : ''}>Enemy</option><option ${bonus.target === 'Character' ? 'selected' : ''}>Character</option></select></label><label>Roll<input data-surprise-key="roll" value="${esc(bonus.roll)}"></label><label>Full modifier<input data-surprise-key="fullModifier" value="${esc(bonus.fullModifier)}"></label><label>Reduced modifier<input data-surprise-key="reducedModifier" value="${esc(bonus.reducedModifier)}"></label><label>Source<input data-surprise-key="source" value="${esc(bonus.source)}"></label><label class="surprise-wide">Conditions<textarea data-surprise-key="conditions">${esc(bonus.conditions)}</textarea></label><label class="surprise-wide">Notes<textarea data-surprise-key="notes">${esc(bonus.notes)}</textarea></label></div></div><small>Enemy modifiers affect the opponent's surprise roll. This tracker does not change character initiative automatically.</small>`;
    const activeControl = section.querySelector('[data-surprise-key="active"]')?.closest('label');
    if (activeControl) {
        activeControl.className = 'surprise-active-control';
        section.querySelector('.surprise-summary').append(activeControl);
    }
    section.hidden = !['Elves', 'Half-Elf', 'Halfling'].includes(data.raceSelection);
    const target = document.querySelector('.race-rules-content');
    if (target) target.append(section); else document.querySelector('.grid')?.append(section);
    section.querySelectorAll('[data-surprise-key]').forEach(input => input.oninput = () => {
        data.surpriseBonus[input.dataset.surpriseKey] = input.type === 'checkbox' ? input.checked : input.value;
        section.querySelector('.surprise-summary span').textContent = `Enemy surprise: ${data.surpriseBonus.fullModifier} / ${data.surpriseBonus.reducedModifier}`;
        changed();
    });
}

function updateHitPointDisplay() {
    const display = document.querySelector('.hp-total');
    if (!display) return;
    const maximum = Math.max(0, Number.parseInt(data.combat.hpMax, 10) || 0);
    const current = Math.max(0, Number.parseInt(data.combat.hpCurrent, 10) || 0);
    const bonus = Math.max(0, Number.parseInt(data.combat.hpBonus, 10) || 0);
    display.textContent = `${current + bonus} / ${maximum + bonus}`;
    const fill = maximum + bonus ? Math.max(0, Math.min(100, ((current + bonus) / (maximum + bonus)) * 100)) : 0;
    const heart = document.querySelector('.hp-heart');
    if (heart) heart.className = `hp-heart health-quarters-${Math.floor(fill / 25)}`;
}

function fields(section, names) {
    return `<div class="fields">${names.map(([k,l])=>`<div class="field"><label>${l}</label><input data-section="${section}" data-key="${k}" value="${esc(data[section][k])}"></div>`).join('')}</div>`
}

function table(key, cols) {
    return `<div class="tableWrap"><table><thead><tr>${cols.map(c=>`<th>${c[1]}</th>`).join('')}<th></th></tr></thead><tbody>${data[key].map((r,i)=>`<tr>${cols.map(c=>`<td><input data-array="${key}" data-index="${i}" data-key="${c[0]}" value="${esc(r[c[0]])}"></td>`).join('')}<td><button class="remove" data-remove="${key}" data-index="${i}">×</button></td></tr>`).join('')}</tbody></table></div><button class="add" data-add="${key}">Add row</button>`
}

const encumbranceBands = {
    '1': [1, 2, 3, 5, 10, 10], '2': [1, 2, 3, 5, 10, 10], '3': [5, 10, 20, 30, 50, 50],
    '4-5': [10, 20, 30, 40, 50, 50], '6-7': [20, 30, 50, 60, 90, 90], '8-9': [30, 50, 70, 90, 120, 120],
    '10-11': [40, 50, 70, 90, 110, 110], '12-13': [45, 65, 95, 115, 140, 140], '14-15': [55, 85, 115, 145, 170, 170],
    '16': [70, 105, 155, 185, 195, 195], '17': [85, 121, 157, 193, 220, 220], '18': [110, 149, 187, 227, 255, 255],
    '18/01-50': [135, 174, 213, 252, 280, 280], '18/51-75': [160, 199, 239, 278, 305, 305],
    '18/76-90': [185, 224, 263, 302, 330, 330], '18/91-99': [235, 274, 313, 352, 380, 380], '18/00': [335, 374, 413, 452, 480, 480],
    '19': [485, 524, 563, 602, 640, 640], '20': [535, 574, 613, 652, 700, 700], '21': [535, 574, 613, 652, 700, 700],
    '22': [635, 674, 713, 752, 810, 810], '23': [785, 824, 863, 902, 970, 970], '24': [935, 974, 1013, 1052, 1130, 1130],
    '25': [1535, 1574, 1613, 1652, 1750, 1750]
};

function encumbranceStrengthKey(score) {
    const text = String(score ?? '').trim();
    if (encumbranceBands[text]) return text;
    const value = Number.parseInt(text, 10);
    if (!Number.isInteger(value)) return '10-11';
    if (value >= 25) return '25';
    if (value >= 19) return String(value);
    if (value >= 18) return '18';
    if (value >= 16) return String(value);
    if (value >= 14) return '14-15';
    if (value >= 12) return '12-13';
    if (value >= 10) return '10-11';
    if (value >= 8) return '8-9';
    if (value >= 6) return '6-7';
    if (value >= 4) return '4-5';
    return String(Math.max(1, value));
}

function inventoryWeight() {
    return data.inventory.reduce((total, item) => item.location === 'stored' ? total : total + (Number.parseFloat(item.quantity) || 0) * itemWeight(item), 0);
}

function inventoryTotalWeight() {
    return data.inventory.reduce((total, item) => total + (Number.parseFloat(item.quantity) || 0) * itemWeight(item), 0);
}

function encumbranceSummary() {
    const strength = encumbranceStrengthKey(data.abilities.str);
    const bands = encumbranceBands[strength];
    const total = inventoryWeight();
    const labels = ['Unencumbered', 'Light', 'Moderate', 'Heavy', 'Severe'];
    const index = bands.findIndex(limit => total <= limit);
    const category = index < 0 ? 'Over max carried weight' : labels[index];
    const allWeight = inventoryTotalWeight();
    return `<div class="encumbrance-summary"><strong>Carried weight: ${total % 1 ? total.toFixed(2) : total} lb</strong><span>Total weight: ${allWeight % 1 ? allWeight.toFixed(2) : allWeight} lb</span><span>Strength ${esc(strength)} | ${category}</span><span>Unencumbered through ${bands[0]} lb | Max carried ${bands[5]} lb</span></div>`;
}

function updateEncumbranceSummary() {
    const summary = document.querySelector('.encumbrance-summary');
    if (summary) summary.outerHTML = encumbranceSummary();
}

function inventoryCatalogueOptions(search = '', category = '') {
    const query = search.trim().toLowerCase();
    return equipmentCatalogue.filter(item => (!category || item.category === category) && (!query || [item.name, ...(item.aliases || [])].join(' ').toLowerCase().includes(query)));
}

function inventoryMarkup() {
    const categories = [...new Set(equipmentCatalogue.map(item => item.category).filter(Boolean))].sort();
    const validation = catalogueValidation.length ? `<div class="catalogue-validation">${catalogueValidation.map(error => `<div>${esc(error)}</div>`).join('')}</div>` : '';
    return `<div class="inventory-controls"><label>Search catalogue<input id="inventory-search" type="search" placeholder="Search name or alias"></label><label>Category<select id="inventory-category"><option value="">All categories</option>${categories.map(category => `<option value="${esc(category)}">${esc(category)}</option>`).join('')}</select></label></div>${validation}<div id="inventory-results" class="inventory-results" aria-live="polite"></div><div class="tableWrap"><table class="inventory-table"><thead><tr><th>Item</th><th>Category</th><th>Subcategory</th><th>Qty</th><th>Status</th><th>Weight lb</th><th>Value</th><th>Notes</th><th></th></tr></thead><tbody>${data.inventory.map((item, index) => { const record = catalogueItem(item); return `<tr><td><input list="equipment-options" data-array="inventory" data-index="${index}" data-key="item" value="${esc(itemName(item))}" placeholder="Custom item"><input type="hidden" data-array="inventory" data-index="${index}" data-key="itemId" value="${esc(item.itemId)}"></td><td>${esc(record?.category || 'custom')}</td><td>${esc(record?.subcategory || '-')}</td><td><input type="number" min="0" step="1" data-array="inventory" data-index="${index}" data-key="quantity" value="${esc(item.quantity)}"></td><td><select data-array="inventory" data-index="${index}" data-key="location"><option value="carried"${item.location === 'carried' ? ' selected' : ''}>Carried</option><option value="stored"${item.location === 'stored' ? ' selected' : ''}>Stored</option></select></td><td><input type="number" min="0" step="0.01" data-array="inventory" data-index="${index}" data-key="weightOverride" value="${item.weightOverride ?? ''}" placeholder="${itemWeight(item)}"></td><td>${esc(formatCost(record?.cost))}</td><td><input data-array="inventory" data-index="${index}" data-key="notes" value="${esc(item.notes)}"></td><td><button class="remove" data-remove="inventory" data-index="${index}" aria-label="Remove item">×</button></td></tr>`; }).join('')}</tbody></table></div><datalist id="equipment-options">${equipmentCatalogue.map(item => `<option value="${esc(item.name)}">${esc(item.category || '')}</option>`).join('')}</datalist><button class="add" data-add="inventory">Add custom item</button>`;
}

const nwpAcquisitionLabels = { purchased: 'Purchased', class: 'Class Bonuses', kit: 'Kit Bonuses', race: 'Racial Bonuses', language: 'Languages', campaign: 'Campaign Awards', 'ranger-granted': 'Ranger Outdoor Grant', 'barbarian-homeland': 'Barbarian Homeland Grant', 'barbarian-expertise': 'Barbarian Two-Slot Expertise', custom: 'Custom' };
function nwpUsesSlot(item) {
    return item.usesNwpSlot !== false && item.exemptFromNwpLimits !== true && !['ranger-granted', 'barbarian-homeland'].includes(item.acquisition) && !(data.nwpSettings.exemptBonusProficiencies && ['class', 'kit', 'race', 'language', 'campaign'].includes(item.acquisition));
}
function nwpAvailableSlots() {
    if (!data.nwpSettings.autoCalculate) return Number.parseInt(data.nwpSettings.availableSlots, 10) || 0;
    const entry = data.identity.classEntries?.[0] || {};
    const className = String(entry.className || data.identity.className || '').toLowerCase();
    const classKey = className.includes('specialist mage') ? 'mage' : className.split(/\s|\//)[0];
    const group = nonweaponClassCrossovers[classKey]?.find(value => value !== 'general') || (className.includes('fighter') || className.includes('ranger') || className.includes('paladin') ? 'warrior' : className.includes('mage') || className.includes('wizard') ? 'wizard' : className.includes('cleric') || className.includes('priest') || className.includes('druid') ? 'priest' : className.includes('thief') || className.includes('bard') ? 'rogue' : '');
    const progression = nonweaponRules[group];
    const level = Number.parseInt(entry.level || data.identity.level, 10);
    if (!progression || !Number.isInteger(level) || level < 1) return 0;
    return progression.initial + Math.floor((level - 1) / progression.additionalEveryLevels);
}
function nwpSummaryMarkup() {
    const used = data.proficiencies.reduce((total, item) => total + (nwpUsesSlot(item) ? Number(item.slotCost) || 0 : 0), 0);
    const available = nwpAvailableSlots();
    const remaining = available - used;
    const counts = Object.fromEntries(Object.keys(nwpAcquisitionLabels).map(key => [key, data.proficiencies.filter(item => item.acquisition === key).length]));
    return `<div class="nwp-summary"><h3>NWP Summary</h3><div class="nwp-summary-totals"><strong>Available Slots: ${available}</strong><strong>Used Slots: ${used}</strong><strong class="nwp-remaining nwp-remaining-${remaining < 0 ? 'negative' : remaining === 1 ? 'warning' : 'positive'}">Remaining Slots: ${remaining}</strong></div><div class="nwp-acquisition-counts">${Object.entries(nwpAcquisitionLabels).map(([key, label]) => `<span>${label}: <strong>${counts[key]}</strong></span>`).join('')}</div><div class="nwp-settings"><label><input id="nwp-auto-calculate" type="checkbox" ${data.nwpSettings.autoCalculate ? 'checked' : ''}> Automatically Calculate NWP Slots</label><label><input id="nwp-exempt-bonuses" type="checkbox" ${data.nwpSettings.exemptBonusProficiencies ? 'checked' : ''}> Exempt bonus proficiencies from NWP limits</label>${data.nwpSettings.autoCalculate ? '' : '<label>Available Slots<input id="nwp-available-slots" type="number" min="0" step="1" value="' + esc(data.nwpSettings.availableSlots || 0) + '"></label>'}</div></div>`;
}

function updateNwpTargets() {
    document.querySelectorAll('[data-nwp-target]').forEach(output => {
        const item = data.proficiencies[+output.dataset.nwpTarget];
        const ability = String(item?.ability || '').toLowerCase();
        const abilityKey = Object.entries(abilityAbbreviations).find(([name, abbreviation]) => ability === name || ability === abbreviation.toLowerCase())?.[0];
        const score = Number.parseInt(abilityKey ? data.abilities[abilityKey.slice(0, 3)] : '', 10);
        const modifier = Number.parseInt(item?.checkModifier, 10);
        output.textContent = Number.isInteger(score) && Number.isInteger(modifier) ? `Target: ${score + modifier}` : 'Target: Special';
    });
}
function trackingRowKey(index) { return `tracking:${index}`; }
function isTrackingProficiency(item) { return item?.id === 'tracking' || String(item?.name || '').trim().toLowerCase() === 'tracking'; }
function trackingCharacter() {
    const classes = (data.identity.classEntries || []).map(entry => String(entry.className || '')).join(' ').toLowerCase();
    const race = `${data.raceSelection || ''} ${data.identity.race || ''}`.toLowerCase();
    return { wisdom: Number.parseInt(data.abilities.wis, 10), isRanger: /ranger/.test(classes), isBarbarian: /barbarian/.test(classes), isDragon: /dragon/.test(race) };
}
function trackingCalculatorMarkup(index) {
    if (!trackingProficiencyRule) return '<small class="tracking-warning">Tracking Calculator rules could not be loaded.</small>';
    const key = trackingRowKey(index);
    const session = data.trackingCalculator.sessions[key] ||= TrackingCalculator.defaults();
    const result = TrackingCalculator.calculate(trackingProficiencyRule, session, trackingCharacter());
    const field = (label, keyName, type = 'number', extra = '') => `<label>${label}<input type="${type}" data-tracking-input="${keyName}" ${extra} value="${esc(session[keyName] ?? '')}"></label>`;
    const check = (label, keyName) => `<label class="tracking-check"><input type="checkbox" data-tracking-input="${keyName}" ${session[keyName] ? 'checked' : ''}>${label}</label>`;
    const terrainOptions = Object.keys(trackingProficiencyRule.calculator.modifierRules.terrain).map(value => `<option value="${value}"${session.terrain === value ? ' selected' : ''}>${value.replaceAll('-', ' ')}</option>`).join('');
    const environmentOptions = ['outdoor-land', 'urban', 'man-made', 'aquatic', 'kit-alternative', 'other'].map(value => `<option value="${value}"${session.environment === value ? ' selected' : ''}>${value.replaceAll('-', ' ')}</option>`).join('');
    return `<section class="tracking-calculator" data-tracking-row="${index}"><header><h3>Tracking Calculator</h3><button type="button" data-tracking-close title="Close Tracking Calculator" aria-label="Close Tracking Calculator">×</button></header><div class="tracking-settings"><label>Rules mode<select data-tracking-input="rulesMode"><option value="core"${session.rulesMode === 'core' ? ' selected' : ''}>Core</option><option value="skills-and-powers"${session.rulesMode === 'skills-and-powers' ? ' selected' : ''}>Skills & Powers</option></select></label>${field('Tracking rating', 'trackingProficiencyRating', 'number', 'min="0"')}<label>Terrain<select data-tracking-input="terrain">${terrainOptions}</select></label><label>Environment<select data-tracking-input="environment">${environmentOptions}</select></label>${field('Creature count', 'trackedCreatureCount', 'number', 'min="1"')}${field('Group override', 'groupSizeOverride', 'number', 'placeholder="floor(count / 2)"')}${field('Trail age hours', 'trailAgeHours', 'number', 'min="0" step="0.5"')}${field('Precipitation hours', 'precipitationHours', 'number', 'min="0" step="0.5"')}${field('DM modifier', 'manualModifierOverride', 'number', 'placeholder="Calculated other modifier"')}${field('Other modifier', 'otherModifiers', 'number')}<label>Halving rounding<select data-tracking-input="environmentRounding"><option value="floor"${session.environmentRounding === 'floor' ? ' selected' : ''}>Floor</option><option value="ceil"${session.environmentRounding === 'ceil' ? ' selected' : ''}>Ceil</option><option value="round"${session.environmentRounding === 'round' ? ' selected' : ''}>Round</option></select></label><label>Movement at 14<select data-tracking-input="trackingMovementAt14"><option value=""${!session.trackingMovementAt14 ? ' selected' : ''}>Unresolved</option><option value="half"${session.trackingMovementAt14 === 'half' ? ' selected' : ''}>Half movement</option><option value="three-quarters"${session.trackingMovementAt14 === 'three-quarters' ? ' selected' : ''}>Three-quarter movement</option></select></label></div><div class="tracking-checks">${check('Poor lighting', 'poorLighting')}${check('Trail hidden', 'trackedPartyHidingTrail')}${check('Animal Empathy: non-domesticated animal', 'animalEmpathyApplies')}${check('Animal Lore: animal', 'animalLoreApplies')}${check('Kit overrides terrain penalty', 'kitOverridesEnvironmentPenalty')}${check('Indoor tracking', 'indoor')}${check('Saw creature within 30 minutes', 'sawCreatureRecently')}${check('Begin where last seen', 'beginsWhereLastSeen')}${check('Outdoor evidence available', 'outdoorEvidence')}${check('Physical trail exists', 'physicalTrail')}${check('Flying or noncorporeal target', 'flyingOrNoncorporeal')}${check('Use identification check', 'identificationCheck')}${check('This is the lead (most adept) tracker', 'leadTracker')}${field('Additional trackers', 'additionalTrackers', 'number', 'min="0"')}</div><div class="tracking-result"><strong>Target: ${result.finalTargetNumber}</strong><span>${result.trailStatus === 'permanently-lost' ? 'Trail permanently lost; no roll.' : result.eligible ? session.rulesMode === 'core' ? 'd20 succeeds at or below target; natural 20 fails.' : 'Resolve using the campaign Skills & Powers rule.' : 'Eligibility conditions are not met.'}</span><span>Movement: ${result.movementMultiplier == null ? 'Configure target 14 setting' : `x${result.movementMultiplier}`}</span><span>Trail status: ${result.trailStatus}</span><span>Next check: ${esc(session.nextCheckTrigger || 'When conditions worsen, another track crosses, or tracking resumes after a halt.')}</span><span>${esc(result.rerollAvailability)}</span><small>${esc(result.breakdown.join('; '))}</small>${result.warnings.map(warning => `<small class="tracking-warning">${esc(warning)}</small>`).join('')}<div class="tracking-actions"><button type="button" data-tracking-found>Record successful check</button><button type="button" data-tracking-failure ${result.trailStatus !== 'found' ? 'disabled' : ''}>Record failed follow check</button><button type="button" data-tracking-new-sign ${result.trailStatus !== 'lost' || Number(session.newSignSearchHours) >= 1 ? 'disabled' : ''}>Record one hour new-sign search</button><button type="button" data-tracking-reset>Reset to rules</button></div></div><small>Acquisition: ${esc(data.proficiencies[index].acquisition)}; ${data.proficiencies[index].usesNwpSlot === false ? 'does not use an NWP slot' : 'uses its recorded NWP slot cost'}. Ranger grants and barbarian homeland/expertise remain separate acquisition choices on the proficiency row.</small></section>`;
}
function setupTrackingCalculator(classAbilitiesSection) {
    const trackers = data.proficiencies.map((item, index) => isTrackingProficiency(item) ? index : -1).filter(index => index >= 0);
    classAbilitiesSection.querySelector('.tracking-calculator')?.remove();
    const hasRanger = (data.identity.classEntries || []).some(entry => /ranger/i.test(entry.className || ''));
    const hasTrackingClassAbility = data.spells.some(item => item?.classAbilityId === 'tracking' || (item?.type === 'Class ability' && String(item.name || '').trim().toLowerCase() === 'tracking'));
    if (!trackers.length && hasTrackingClassAbility) {
        trackers.push(-1);
        data.proficiencies[-1] = { acquisition: 'class ability', usesNwpSlot: false };
    }
    if (!hasRanger || !trackers.length) return;
    const active = data.trackingCalculator.activeTrackingRow;
    const trackingIndex = trackers.includes(active) ? active : trackers[0];
    if (data.trackingCalculator.activeTrackingRow !== trackingIndex) data.trackingCalculator.activeTrackingRow = trackingIndex;
    classAbilitiesSection.querySelector('.class-abilities-grid')?.insertAdjacentHTML('beforeend', trackingCalculatorMarkup(trackingIndex));
    const panel = classAbilitiesSection.querySelector('.tracking-calculator');
    if (!panel) return;
    const session = data.trackingCalculator.sessions[trackingRowKey(data.trackingCalculator.activeTrackingRow)];
    panel.querySelectorAll('[data-tracking-input]').forEach(input => input.onchange = () => { const key = input.dataset.trackingInput; session[key] = input.type === 'checkbox' ? input.checked : input.type === 'number' ? (input.value === '' ? null : Number(input.value)) : (input.value || null); changed(); render(); });
    panel.querySelector('[data-tracking-close]').onclick = () => { data.trackingCalculator.activeTrackingRow = null; panel.remove(); changed(); };
    panel.querySelector('[data-tracking-reset]').onclick = () => { data.trackingCalculator.sessions[trackingRowKey(data.trackingCalculator.activeTrackingRow)] = TrackingCalculator.defaults(); changed(); render(); };
    panel.querySelector('[data-tracking-found]').onclick = () => { session.trailStatus = 'found'; session.failureCount = 0; session.newSignSearchHours = 0; changed(); render(); };
    panel.querySelector('[data-tracking-new-sign]').onclick = () => { session.newSignSearchHours = Math.max(1, Number(session.newSignSearchHours) || 0); session.trailStatus = 'found'; changed(); render(); };
    panel.querySelector('[data-tracking-failure]').onclick = () => { if (session.trailStatus !== 'found') return; session.failureCount = Math.min(2, (Number(session.failureCount) || 0) + 1); session.trailStatus = session.failureCount >= 2 ? 'ended' : 'lost'; changed(); render(); };
}
function languagesMarkup() {
    const intelligence = Number.parseInt(data.abilities.int, 10);
    const available = Number.isInteger(intelligence) && intelligence >= 1 ? intelligenceBonusLanguages[intelligence - 1] || 0 : 0;
    const used = data.languages.filter(language => language.sourceType === 'bonus' || language.source === 'bonus').length;
    const remaining = available - used;
    return `<section class="card wide languages-section"><h2>Languages</h2><div class="language-summary"><strong>Known Languages: ${data.languages.length}</strong><span>Available Bonus Languages: ${available}</span><span>Used Bonus Languages: ${used}</span><strong>Remaining Bonus Languages: ${remaining}</strong></div><div class="language-picker"><label for="language-search">Search language catalogue</label><input id="language-search" type="search" placeholder="Search language name"><div class="language-filters"><label>Category<select id="language-category-filter"><option value="">All categories</option>${[...new Set(languageRecords.map(item => item.category))].sort().map(value => `<option value="${esc(value)}">${esc(value)}</option>`).join('')}</select></label><label>Source<select id="language-source-filter"><option value="">All sources</option>${[...new Set(languageRecords.map(item => item.source).filter(Boolean))].sort().map(value => `<option value="${esc(value)}">${esc(value)}</option>`).join('')}</select></label><label>Literacy<select id="language-literacy-filter"><option value="">Any literacy</option><option value="true">Supported</option><option value="false">Not supported</option></select></label></div><div id="language-results" class="language-results"></div></div><div class="tableWrap"><table class="languages-table"><thead><tr><th>Language</th><th>Category</th><th>Source</th><th>Speaks</th><th>Reads</th><th>Writes</th><th>Uses Language Slot</th><th>Notes</th><th></th></tr></thead><tbody>${data.languages.map((language, index) => `<tr><td><input data-array="languages" data-index="${index}" data-key="name" value="${esc(language.name)}"></td><td><input data-array="languages" data-index="${index}" data-key="category" value="${esc(language.category || '')}"></td><td><select data-array="languages" data-index="${index}" data-key="sourceType">${languageSourceTypes.map(source => `<option value="${source}"${language.sourceType === source ? ' selected' : ''}>${source}</option>`).join('')}</select></td><td><input type="checkbox" data-array="languages" data-index="${index}" data-key="speaks" ${language.speaks ? 'checked' : ''}></td><td><input type="checkbox" data-array="languages" data-index="${index}" data-key="reads" ${language.reads ? 'checked' : ''}></td><td><input type="checkbox" data-array="languages" data-index="${index}" data-key="writes" ${language.writes ? 'checked' : ''}></td><td><input type="checkbox" data-array="languages" data-index="${index}" data-key="usesLanguageSlot" ${language.usesLanguageSlot ? 'checked' : ''}></td><td><input data-array="languages" data-index="${index}" data-key="notes" value="${esc(language.notes)}"></td><td><button class="remove" data-remove="languages" data-index="${index}" aria-label="Remove language">×</button></td></tr>`).join('')}</tbody></table></div><button class="add" data-add="languages">Add custom language</button></section>`;
}

function updateLanguageSummary() {
    const summary = document.querySelector('.language-summary');
    if (!summary) return;
    const intelligence = Number.parseInt(data.abilities.int, 10);
    const available = Number.isInteger(intelligence) && intelligence >= 1 ? intelligenceBonusLanguages[intelligence - 1] || 0 : 0;
    const used = data.languages.filter(language => language.sourceType === 'bonus' || language.source === 'bonus').length;
    summary.children[0].textContent = `Known Languages: ${data.languages.length}`;
    summary.children[1].textContent = `Available Bonus Languages: ${available}`;
    summary.children[2].textContent = `Used Bonus Languages: ${used}`;
    summary.children[3].textContent = `Remaining Bonus Languages: ${available - used}`;
}

function syncAutomaticLanguages(race) {
    const raceKey = { Humans: 'human', Dwarf: 'dwarf', Elves: 'elf', Gnome: 'gnome', Goblins: 'goblin', 'Half-Elf': 'half-elf', Halfling: 'halfling' }[race];
    const automaticIds = languageRaceRules[raceKey]?.automatic || [];
    data.languages = data.languages.filter(language => !language.isAutomatic);
    automaticIds.forEach(id => {
        const catalog = languageLookup(id);
        if (!catalog) return;
        const existing = data.languages.find(language => language.id === id || language.name.toLowerCase() === catalog.name.toLowerCase());
        const language = existing || { id: catalog.id, name: catalog.name, category: catalog.category || null, sourceType: 'racial', speaks: catalog.speaks !== false, reads: catalog.reads === true, writes: catalog.writes === true, usesLanguageSlot: false, notes: '' };
        language.id = catalog.id;
        language.name = catalog.name;
        language.isAutomatic = true;
        language.usesLanguageSlot = false;
        language.sourceType = 'racial';
        if (!existing) data.languages.push(language);
    });
}

function setupWeaponProficiencySection() {
    const nwpCard = [...document.querySelectorAll('.grid > .card')].find(card => card.querySelector(':scope > h2')?.textContent.includes('Proficiencies'));
    if (!nwpCard) return;
    document.querySelector('.weapon-proficiencies-section')?.remove();
    const section = document.createElement('section');
    section.className = 'card wide weapon-proficiencies-section';
    const available = data.weaponProficiencySettings.autoCalculate ? (() => { const entry = data.identity.classEntries?.[0] || {}; const key = String(entry.className || '').toLowerCase().split(/\s|\//)[0]; const group = proficiencyRules.classMappings?.[key]; const rules = proficiencyRules.groups?.[group]?.weaponProficiencies; const level = Number.parseInt(entry.level || data.identity.level, 10); return rules && Number.isInteger(level) && level >= 1 ? rules.initialSlots + Math.floor((level - 1) / rules.additionalSlotEveryLevels) : 0; })() : Number(data.weaponProficiencySettings.availableSlots) || 0;
    const used = data.weaponProficiencies.filter(item => item.proficient).length;
    section.innerHTML = `<h2>Weapon Proficiencies</h2><div class="weapon-proficiency-summary"><strong>Available Slots: ${available}</strong><strong>Used Slots: ${used}</strong><strong>Remaining Slots: ${available - used}</strong><label><input id="weapon-auto-calculate" type="checkbox" ${data.weaponProficiencySettings.autoCalculate ? 'checked' : ''}> Automatically Calculate Weapon Proficiency Slots</label>${data.weaponProficiencySettings.autoCalculate ? '' : '<label>Available Slots <input id="weapon-available-slots" type="number" min="0" step="1" value="' + esc(data.weaponProficiencySettings.availableSlots || 0) + '"></label>'}</div><div class="weapon-proficiency-picker"><label for="weapon-proficiency-search">Search weapon proficiencies</label><input id="weapon-proficiency-search" type="search" placeholder="Search by weapon name"><div id="weapon-proficiency-results" class="weapon-proficiency-results"></div></div><div class="tableWrap"><table class="weapon-proficiencies-table"><thead><tr><th>Weapon</th><th>Catalog data</th><th>Proficient</th><th>Specialization</th><th></th></tr></thead><tbody>${data.weaponProficiencies.map((state, index) => { const entry = weaponProficiencyCatalog.find(item => (state.proficiencyId && item.proficiencyId === state.proficiencyId) || (state.weaponId && item.weaponId === state.weaponId) || (state.name && item.name?.toLowerCase() === state.name?.toLowerCase())); const record = equipmentCatalogue.find(item => (state.weaponId && item.id === state.weaponId) || (state.name && item.name?.toLowerCase() === state.name?.toLowerCase())); return `<tr><td><input data-weapon-proficiency-index="${index}" data-weapon-proficiency-key="name" value="${esc(entry?.name || record?.name || state.name || state.weaponId || '')}" placeholder="Custom proficiency"></td><td>${esc(record ? [record.category, record.size, record.damage?.smallMedium, record.damage?.large].filter(Boolean).join(' / ') : 'Manual')}</td><td><input type="checkbox" data-weapon-proficiency-index="${index}" data-weapon-proficiency-key="proficient" ${state.proficient ? 'checked' : ''} aria-label="${esc(entry?.name || state.name || 'Weapon')} proficient"></td><td><select data-weapon-proficiency-index="${index}" data-weapon-proficiency-key="specialization"><option value="none"${state.specialization === 'none' ? ' selected' : ''}>None</option><option value="specialized"${state.specialization === 'specialized' ? ' selected' : ''}>Specialized</option></select></td><td><button type="button" class="remove" data-weapon-proficiency-remove="${index}" aria-label="Remove weapon proficiency">×</button></td></tr>`; }).join('')}</tbody></table></div><button type="button" class="add" data-weapon-proficiency-custom>Add custom proficiency</button><small>Weapon proficiency state is stored separately from weapons. Statistics are read from the equipment catalogue.</small>`;
    nwpCard.after(section);
    const picker = section.querySelector('#weapon-proficiency-search');
    const results = section.querySelector('#weapon-proficiency-results');
    const renderPicker = () => { const query = picker.value.trim().toLowerCase(); const matches = weaponProficiencyCatalog.filter(item => !query || item.name.toLowerCase().includes(query)); results.innerHTML = matches.map(item => `<button type="button" data-weapon-proficiency-add="${esc(item.proficiencyId || item.weaponId)}">${esc(item.name)}</button>`).join(''); results.querySelectorAll('[data-weapon-proficiency-add]').forEach(button => button.onclick = () => { const entry = weaponProficiencyCatalog.find(item => (item.proficiencyId || item.weaponId) === button.dataset.weaponProficiencyAdd); if (!entry) return; data.weaponProficiencies.push({ proficiencyId: entry.proficiencyId || null, weaponId: entry.weaponId || null, proficient: false, specialization: 'none', notes: '' }); changed(); render(); }); };
    picker.oninput = renderPicker;
    renderPicker();
    section.querySelector('[data-weapon-proficiency-custom]').onclick = () => { data.weaponProficiencies.push({ proficiencyId: null, weaponId: null, name: '', proficient: false, specialization: 'none', notes: '' }); changed(); render(); };
    const proficiencyTable = section.querySelector('.weapon-proficiencies-table');
    const proficiencyHeader = proficiencyTable?.querySelector('thead tr');
    if (proficiencyHeader && !proficiencyHeader.textContent.includes('Notes')) {
        const notesHeader = document.createElement('th');
        notesHeader.textContent = 'Notes';
        proficiencyHeader.insertBefore(notesHeader, proficiencyHeader.lastElementChild);
        proficiencyTable.querySelectorAll('tbody tr').forEach((row, index) => {
            const notesCell = document.createElement('td');
            notesCell.innerHTML = `<input data-weapon-proficiency-index="${index}" data-weapon-proficiency-key="notes" value="${esc(data.weaponProficiencies[index]?.notes || '')}">`;
            row.insertBefore(notesCell, row.lastElementChild);
        });
    }
    section.querySelectorAll('[data-weapon-proficiency-index]').forEach(input => input.onchange = () => {
        const state = data.weaponProficiencies[+input.dataset.weaponProficiencyIndex];
        state[input.dataset.weaponProficiencyKey] = input.type === 'checkbox' ? input.checked : input.value;
        const summary = section.querySelector('.weapon-proficiency-summary');
        if (summary) {
            const used = data.weaponProficiencies.filter(item => item.proficient).length;
            const available = data.weaponProficiencySettings.autoCalculate ? (() => { const entry = data.identity.classEntries?.[0] || {}; const key = String(entry.className || '').toLowerCase().split(/\s|\//)[0]; const group = proficiencyRules.classMappings?.[key]; const rules = proficiencyRules.groups?.[group]?.weaponProficiencies; const level = Number.parseInt(entry.level || data.identity.level, 10); return rules && Number.isInteger(level) && level >= 1 ? rules.initialSlots + Math.floor((level - 1) / rules.additionalSlotEveryLevels) : 0; })() : Number(data.weaponProficiencySettings.availableSlots) || 0;
            summary.querySelector('strong:nth-child(1)').textContent = `Available Slots: ${available}`;
            summary.querySelector('strong:nth-child(2)').textContent = `Used Slots: ${used}`;
            summary.querySelector('strong:nth-child(3)').textContent = `Remaining Slots: ${available - used}`;
        }
        changed();
    });
    section.querySelectorAll('[data-weapon-proficiency-remove]').forEach(button => button.onclick = () => { data.weaponProficiencies.splice(+button.dataset.weaponProficiencyRemove, 1); changed(); render(); });
    section.querySelector('#weapon-auto-calculate').onchange = event => { data.weaponProficiencySettings.autoCalculate = event.target.checked; changed(); render(); };
    section.querySelector('#weapon-available-slots')?.addEventListener('input', event => { data.weaponProficiencySettings.availableSlots = event.target.value; changed(); });
}

function setupProficiencyAndInventorySections() {
    const cards = [...document.querySelectorAll('.grid > .card')];
    const proficiencyCard = cards.find(card => card.querySelector(':scope > h2')?.textContent.includes('Proficiencies'));
    if (proficiencyCard) {
        proficiencyCard.classList.remove('half');
        proficiencyCard.classList.add('wide');
        proficiencyCard.innerHTML = `<h2>Proficiencies</h2><div class="tableWrap"><table class="proficiencies-table"><thead><tr><th>Proficiency</th><th>Slots</th><th>Ability</th><th>Type</th><th>Source</th><th>Notes</th><th></th></tr></thead><tbody>${data.proficiencies.map((row, index) => `<tr>${[['name','Proficiency'],['slots','Slots'],['score','Score'],['type','Type'],['source','Source'],['notes','Notes']].map(([key]) => `<td><input data-array="proficiencies" data-index="${index}" data-key="${key}" value="${esc(row[key])}"></td>`).join('')}<td><button class="remove" data-remove="proficiencies" data-index="${index}" aria-label="Remove proficiency">×</button></td></tr>`).join('')}</tbody></table></div><button class="add" data-add="proficiencies">Add proficiency</button>`;
        const table = proficiencyCard.querySelector('.proficiencies-table');
        table.innerHTML = `<thead><tr><th>Proficiency</th><th>Slot Cost</th><th>Ability</th><th>Modifier</th><th>Acquisition</th><th>Uses NWP Slot</th><th>Notes</th><th></th></tr></thead><tbody>${data.proficiencies.map((item, index) => `<tr><td><input data-array="proficiencies" data-index="${index}" data-key="name" value="${esc(item.name)}"></td><td><input type="number" min="0" step="1" data-array="proficiencies" data-index="${index}" data-key="slotCost" value="${esc(item.slotCost)}"></td><td><input data-array="proficiencies" data-index="${index}" data-key="ability" value="${esc(abilityAbbreviation(item.ability))}"></td><td>${item.checkModifier == null ? 'N/A' : `<input type="number" data-array="proficiencies" data-index="${index}" data-key="checkModifier" value="${esc(item.checkModifier)}" step="1">`}<output data-nwp-target="${index}">${item.checkModifier == null ? 'Target: Special' : ''}</output></td><td><select data-array="proficiencies" data-index="${index}" data-key="acquisition">${Object.entries(nwpAcquisitionLabels).map(([key, label]) => `<option value="${key}"${item.acquisition === key ? ' selected' : ''}>${label.replace(' Bonuses', '')}</option>`).join('')}</select></td><td><select data-array="proficiencies" data-index="${index}" data-key="usesNwpSlot"><option value="true"${item.usesNwpSlot !== false ? ' selected' : ''}>Yes</option><option value="false"${item.usesNwpSlot === false ? ' selected' : ''}>No</option></select></td><td><input data-array="proficiencies" data-index="${index}" data-key="notes" value="${esc(item.notes)}"></td><td><button class="remove" data-remove="proficiencies" data-index="${index}" aria-label="Remove proficiency">×</button></td></tr>`).join('')}</tbody>`;
        const headerRow = table.querySelector('thead tr');
        const targetHeader = document.createElement('th');
        targetHeader.textContent = 'Target';
        headerRow.insertBefore(targetHeader, headerRow.children[4]);
        table.querySelectorAll('tbody tr').forEach(row => {
            const targetCell = document.createElement('td');
            const target = row.querySelector('[data-nwp-target]');
            if (target) targetCell.append(target);
            row.insertBefore(targetCell, row.children[4]);
            const usesSelect = row.querySelector('[data-key="usesNwpSlot"]');
            if (usesSelect) {
                const usesCheckbox = document.createElement('input');
                usesCheckbox.type = 'checkbox';
                usesCheckbox.checked = usesSelect.value !== 'false';
                usesCheckbox.dataset.array = 'proficiencies';
                usesCheckbox.dataset.index = usesSelect.dataset.index;
                usesCheckbox.dataset.key = 'usesNwpSlot';
                usesCheckbox.setAttribute('aria-label', 'Uses NWP Slot');
                usesSelect.replaceWith(usesCheckbox);
            }
        });
        const exemptHeader = document.createElement('th');
        exemptHeader.textContent = 'Exempt';
        table.querySelector('thead tr').insertBefore(exemptHeader, table.querySelector('thead tr').children[7]);
        table.querySelectorAll('tbody tr').forEach((row, index) => {
            const cell = document.createElement('td');
            cell.innerHTML = `<label class="nwp-exempt-control"><input type="checkbox" data-array="proficiencies" data-index="${index}" data-key="exemptFromNwpLimits" ${data.proficiencies[index].exemptFromNwpLimits ? 'checked' : ''} aria-label="Exempt bonus proficiencies from NWP limits"></label>`;
            row.insertBefore(cell, row.children[7]);
        });
        const summary = document.createElement('div');
        summary.id = 'nwp-summary';
        summary.innerHTML = nwpSummaryMarkup();
        proficiencyCard.insertBefore(summary, proficiencyCard.querySelector('.tableWrap'));
    }
    if (proficiencyCard) {
        const picker = document.createElement('div');
        picker.className = 'proficiency-picker';
        const groups = [...new Set(nonweaponCatalog.flatMap(item => item.groups || []))].sort();
        const abilities = [...new Set(nonweaponCatalog.map(item => item.relevantAbility).filter(Boolean))].sort();
        const sources = [...new Set(nonweaponCatalog.map(item => item.source).filter(Boolean))].sort();
        const slotCosts = [...new Set(nonweaponCatalog.map(item => item.slotCost == null ? 'unknown' : String(item.slotCost)))].sort((left, right) => left === 'unknown' ? 1 : right === 'unknown' ? -1 : Number(left) - Number(right));
        picker.innerHTML = `<label for="proficiency-search">Find proficiency</label><input id="proficiency-search" type="search" placeholder="Type a name to search"><div class="proficiency-filters"><label>Group<select id="proficiency-group-filter"><option value="">All groups</option>${groups.map(group => `<option value="${esc(group)}">${esc(group)}</option>`).join('')}</select></label><label>Ability<select id="proficiency-ability-filter"><option value="">All abilities</option>${abilities.map(ability => `<option value="${esc(ability)}">${esc(ability)}</option>`).join('')}</select></label><label>Source<select id="proficiency-source-filter"><option value="">All sources</option>${sources.map(source => `<option value="${esc(source)}">${esc(source)}</option>`).join('')}</select></label><label>Slot cost<select id="proficiency-slot-cost-filter"><option value="">All costs</option>${slotCosts.map(cost => `<option value="${cost}">${cost === 'unknown' ? 'Unknown' : `${esc(cost)} slot${cost === '1' ? '' : 's'}`}</option>`).join('')}</select></label></div><div id="proficiency-results" class="proficiency-results" aria-live="polite"></div>`;
        proficiencyCard.insertBefore(picker, proficiencyCard.querySelector('.tableWrap'));
        const search = picker.querySelector('#proficiency-search');
        const groupFilter = picker.querySelector('#proficiency-group-filter');
        const abilityFilter = picker.querySelector('#proficiency-ability-filter');
        const sourceFilter = picker.querySelector('#proficiency-source-filter');
        const slotCostFilter = picker.querySelector('#proficiency-slot-cost-filter');
        const results = picker.querySelector('#proficiency-results');
        const paginationControls = document.createElement('div');
        paginationControls.dataset.proficiencyPagination = '';
        results.after(paginationControls);
        let proficiencyPage = 0;
        const renderProficiencyResults = (resetPage = false) => {
            if (resetPage) proficiencyPage = 0;
            const query = search.value.trim().toLowerCase();
            const matches = nonweaponCatalog.filter(item => (!query || item.name.toLowerCase().includes(query)) && (!groupFilter.value || item.groups?.includes(groupFilter.value)) && (!abilityFilter.value || item.relevantAbility === abilityFilter.value) && (!sourceFilter.value || item.source === sourceFilter.value) && (!slotCostFilter.value || (slotCostFilter.value === 'unknown' ? item.slotCost == null : String(item.slotCost) === slotCostFilter.value)));
            const pagination = paginateCatalog(matches, proficiencyPage, 30);
            proficiencyPage = pagination.currentPage;
            results.innerHTML = `${matches.length} result${matches.length === 1 ? '' : 's'}${pagination.records.map(item => `<button type="button" class="proficiency-result" data-proficiency-id="${esc(item.id)}"><strong>${esc(item.name)}</strong><small>${esc((item.groups || []).join(', '))} · ${esc(item.relevantAbility || 'N/A')} · ${item.checkModifier == null ? 'N/A' : `check ${item.checkModifier >= 0 ? '+' : ''}${item.checkModifier}`} · ${item.slotCost == null ? 'slot cost unknown' : `${item.slotCost} slot${item.slotCost === 1 ? '' : 's'}`} · ${esc(item.source || 'Source unknown')}</small></button>`).join('')}`;
            paginationControls.innerHTML = catalogPaginationMarkup(pagination, 'proficiency');
            results.querySelectorAll('[data-proficiency-id]').forEach(button => button.onclick = () => {
                const item = nonweaponCatalog.find(record => record.id === button.dataset.proficiencyId);
                if (!item) return;
                data.proficiencies.push({ id: item.id, name: item.name, slotCost: item.slotCost ?? item.slotsRequired ?? 1, acquisition: 'purchased', usesNwpSlot: true, exemptFromNwpLimits: false, ability: abilityAbbreviation(item.relevantAbility), checkModifier: item.checkModifier, notes: Array.isArray(item.notes) ? item.notes.join('; ') : item.notes || '' });
                changed();
                render();
            });
            paginationControls.querySelectorAll('[data-proficiency-page]').forEach(button => button.onclick = () => { proficiencyPage = Number(button.dataset.proficiencyPage); renderProficiencyResults(); });
        };
        search.oninput = () => renderProficiencyResults(true);
        [groupFilter, abilityFilter, sourceFilter, slotCostFilter].forEach(filter => filter.onchange = () => renderProficiencyResults(true));
        renderProficiencyResults();
        const datalist = document.createElement('datalist');
        datalist.id = 'nonweapon-proficiency-options';
        datalist.innerHTML = nonweaponCatalog.map(item => `<option value="${esc(item.name)}">${esc((item.groups || []).join(', '))}</option>`).join('');
        proficiencyCard.append(datalist);
        proficiencyCard.querySelectorAll('[data-array="proficiencies"][data-key="name"]').forEach(input => {
            input.setAttribute('list', datalist.id);
            input.onchange = () => {
                const preset = nonweaponCatalog.find(item => item.name.toLowerCase() === input.value.trim().toLowerCase());
                if (!preset) return;
                const row = data.proficiencies[+input.dataset.index];
                row.name = preset.name;
                row.slotCost = preset.slotCost ?? preset.slotsRequired ?? 1;
                row.ability = abilityAbbreviation(preset.relevantAbility);
                row.acquisition = 'purchased';
                row.usesNwpSlot = true;
                row.checkModifier = preset.checkModifier;
                changed();
                render();
            };
        });
    }
    if (proficiencyCard) {
        const autoCalculate = proficiencyCard.querySelector('#nwp-auto-calculate');
        const exemptBonuses = proficiencyCard.querySelector('#nwp-exempt-bonuses');
        if (autoCalculate) autoCalculate.onchange = () => { data.nwpSettings.autoCalculate = autoCalculate.checked; changed(); render(); };
        if (exemptBonuses) exemptBonuses.onchange = () => { data.nwpSettings.exemptBonusProficiencies = exemptBonuses.checked; changed(); render(); };
        const availableSlots = proficiencyCard.querySelector('#nwp-available-slots');
        if (availableSlots) availableSlots.oninput = () => { data.nwpSettings.availableSlots = availableSlots.value; const summary = proficiencyCard.querySelector('#nwp-summary'); summary.innerHTML = nwpSummaryMarkup(); changed(); };
        updateNwpTargets();
        const existingLanguageSection = document.querySelector('.languages-section');
        if (existingLanguageSection) existingLanguageSection.remove();
        const languageWrapper = document.createElement('div');
        languageWrapper.innerHTML = languagesMarkup();
        const languageSection = languageWrapper.firstElementChild;
        proficiencyCard.after(languageSection);
        const languageSearch = languageSection.querySelector('#language-search');
        const languageCategory = languageSection.querySelector('#language-category-filter');
        const languageSource = languageSection.querySelector('#language-source-filter');
        const languageLiteracy = languageSection.querySelector('#language-literacy-filter');
        const languageResults = languageSection.querySelector('#language-results');
        const languagePaginationControls = document.createElement('div');
        languagePaginationControls.dataset.languagePagination = '';
        languageResults.after(languagePaginationControls);
        let languagePage = 0;
        const renderLanguageResults = (resetPage = false) => {
            if (resetPage) languagePage = 0;
            const query = languageSearch.value.trim().toLowerCase();
            const literacy = languageLiteracy.value;
            const matches = languageRecords.filter(item => (!query || item.name.toLowerCase().includes(query)) && (!languageCategory.value || item.category === languageCategory.value) && (!languageSource.value || item.source === languageSource.value) && (!literacy || String(item.literacySupported) === literacy));
            const pagination = paginateCatalog(matches, languagePage, 30);
            languagePage = pagination.currentPage;
            languageResults.innerHTML = pagination.records.map(item => `<button type="button" data-language-add="${esc(item.id)}">${esc(item.name)} <small>${esc(item.category || '')} / ${esc(item.source || '')} / ${item.literacySupported ? 'literacy supported' : 'no literacy'}</small></button>`).join('') || '<small>No matching languages.</small>';
            languagePaginationControls.innerHTML = catalogPaginationMarkup(pagination, 'language');
            languageResults.querySelectorAll('[data-language-add]').forEach(button => button.onclick = () => { const item = languageLookup(button.dataset.languageAdd); if (!item) return; data.languages.push({ id: item.id, name: item.name, category: item.category || null, sourceType: 'native', speaks: true, reads: item.literacySupported === true, writes: item.literacySupported === true, usesLanguageSlot: false, notes: Array.isArray(item.notes) ? item.notes.join('; ') : item.notes || '' }); changed(); render(); });
            languagePaginationControls.querySelectorAll('[data-language-page]').forEach(button => button.onclick = () => { languagePage = Number(button.dataset.languagePage); renderLanguageResults(); });
        };
        const renderLanguageResultsWithStatus = (resetPage = false) => {
            renderLanguageResults(resetPage);
            if (languageCatalogStatus === 'loading') languageResults.innerHTML = '<small>Loading language catalogue...</small>';
            if (languageCatalogStatus === 'error') languageResults.innerHTML = '<small>Language catalogue unavailable.</small>';
        };
        languageSearch.oninput = () => renderLanguageResultsWithStatus(true);
        languageCategory.onchange = () => renderLanguageResultsWithStatus(true);
        languageSource.onchange = () => renderLanguageResultsWithStatus(true);
        languageLiteracy.onchange = () => renderLanguageResultsWithStatus(true);
        renderLanguageResultsWithStatus();
    }
    const inventoryCard = cards.find(card => card.querySelector(':scope > h2')?.textContent.includes('Inventory'));
    const currencyCard = cards.find(card => card.querySelector(':scope > h2')?.textContent.includes('Currency'));
    const currencyFields = currencyCard?.querySelector(':scope > .fields');
    if (inventoryCard && currencyCard) currencyCard.remove();
    if (inventoryCard) {
        inventoryCard.innerHTML = `<h2>Inventory</h2>${encumbranceSummary()}<div class="inventory-total">Catalogue value: <strong>${esc(inventoryValue())}</strong></div><div class="wealth-total">Wealth: <strong>${esc(copperBreakdown(wealthInCopper()))}</strong></div>${inventoryMarkup()}`;
        if (currencyFields) {
            const currencyHeading = document.createElement('h3');
            currencyHeading.className = 'inventory-currency-heading';
            currencyHeading.textContent = 'Currency';
            inventoryCard.insertBefore(currencyHeading, inventoryCard.children[4]);
            inventoryCard.insertBefore(currencyFields, inventoryCard.children[5]);
        }
        const search = inventoryCard.querySelector('#inventory-search');
        const category = inventoryCard.querySelector('#inventory-category');
        let inventoryPage = 0;
        const refreshOptions = (resetPage = false) => {
            if (resetPage) inventoryPage = 0;
            const matches = inventoryCatalogueOptions(search.value, category.value);
            const pagination = paginateCatalog(matches, inventoryPage, 25);
            inventoryPage = pagination.currentPage;
            const list = inventoryCard.querySelector('#equipment-options');
            list.innerHTML = matches.map(item => `<option value="${esc(item.name)}">${esc(item.category || '')}</option>`).join('');
            const results = inventoryCard.querySelector('#inventory-results');
            const paginationControls = inventoryCard.querySelector('[data-inventory-pagination]') || document.createElement('div');
            if (!paginationControls.parentElement) {
                paginationControls.dataset.inventoryPagination = '';
                results.after(paginationControls);
            }
            results.innerHTML = `<strong>${matches.length} catalogue result${matches.length === 1 ? '' : 's'}</strong>${pagination.records.map(item => `<button type="button" class="inventory-result" data-catalogue-id="${esc(item.id)}"><span>${esc(item.name)}</span><small>${esc(item.category || '')} · ${esc(item.subcategory || '-')} · ${esc(formatCost(item.cost))} · ${item.weightLb == null ? 'weight unknown' : `${item.weightLb} lb`}</small></button>`).join('')}`;
            paginationControls.innerHTML = catalogPaginationMarkup(pagination, 'inventory');
            inventoryCard.querySelectorAll('[data-catalogue-id]').forEach(button => button.onclick = () => {
                const item = equipmentCatalogue.find(record => record.id === button.dataset.catalogueId);
                if (!item) return;
                data.inventory.push({ catalogType: item.catalogType || 'equipment', catalogItemId: item.id, itemId: item.id, item: '', location: 'carried', equipped: true, customName: null, weightOverride: null, quantity: item.quantity || 1, notes: '' });
                changed();
                render();
            });
            paginationControls.querySelectorAll('[data-inventory-page]').forEach(button => button.onclick = () => { inventoryPage = Number(button.dataset.inventoryPage); refreshOptions(); });
        };
        search.oninput = () => refreshOptions(true);
        category.onchange = () => refreshOptions(true);
        refreshOptions();
    }
}

function render() {
    document.querySelector('#app').innerHTML = `<section class="hero"><div class="card wide"><h1>Advanced Dungeons & Dragons 2e</h1>${fields('identity',[['name','Character name'],['player','Player'],['className','Class'],['level','Level'],['race','Race'],['alignment','Alignment'],['xp','Experience'],['nextLevel','Next level'],['deity','Deity']])}</div><img class="portrait" src="${esc(data.portraitUrl)||'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22180%22%3E%3Crect width=%22100%25%22 height=%22100%25%22 fill=%22%23e9dfcc%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%23756b5d%22%3EPortrait URL%3C/text%3E%3C/svg%3E'}"></section><div class="grid"><section class="card wide"><h2>Abilities</h2><div class="stats">${Object.keys(labels).map(k=>`<div class="stat"><label>${labels[k]}</label><input data-section="abilities" data-key="${k}" value="${esc(data.abilities[k])}"></div>`).join('')}</div></section><section class="card half"><h2>Combat</h2>${fields('combat',[['hpMax','HP max'],['hpCurrent','HP current'],['ac','Armor class'],['thac0','THAC0'],['initiative','Initiative'],['movement','Movement'],['surprisedAc','Surprised AC'],['shieldlessAc','Shieldless AC'],['rearAc','Rear AC']])}</section><section class="card half"><h2>Saving throws</h2>${fields('saves',[['paralyzationPoison','Paralyzation / Poison'],['rodStaffWand','Rod / Staff / Wand'],['petrificationPolymorph','Petrification / Polymorph'],['breathWeapon','Breath Weapon'],['spell','Spell']])}</section><section class="card wide"><h2>Weapons</h2>${table('weapons',[['name','Weapon'],['attacks','AT'],['attackAdj','Attack adj'],['damageAdj','Damage adj'],['thac0','THAC0'],['damage','Damage S/M-L'],['range','Range'],['weight','Weight'],['speed','Speed']])}</section><section class="card half"><h2>Proficiencies</h2>${table('proficiencies',[['name','Name'],['slots','Slots'],['score','Score'],['type','Type']])}</section><section class="card half"><h2>Currency</h2>${fields('currency',[['platinum','Platinum'],['gold','Gold'],['electrum','Electrum'],['silver','Silver'],['copper','Copper'],['gems','Gems']])}</section><section class="card wide"><h2>Inventory</h2>${table('inventory',[['item','Item'],['location','Location'],['quantity','Qty'],['weight','Weight']])}</section><section class="card wide"><h2>Spells</h2>${table('spells',[['name','Spell'],['level','Level'],['school','School'],['memorized','Memorized'],['notes','Notes']])}</section><section class="card half"><h2>Special abilities</h2><textarea data-root="specialAbilities">${esc(data.specialAbilities)}</textarea></section><section class="card half"><h2>Notes</h2><textarea data-root="notes">${esc(data.notes)}</textarea><div class="field"><label>Portrait image URL (optional)</label><input data-root="portraitUrl" value="${esc(data.portraitUrl)}"></div></section></div>`;
    const abilitiesHeading = [...document.querySelectorAll('.grid > .card')].find(card => card.querySelector(':scope > h2')?.textContent === 'Abilities')?.querySelector(':scope > h2');
    if (abilitiesHeading) {
        abilitiesHeading.textContent = 'ABILITIES & MODIFIERS';
        const minimums = document.createElement('div');
        minimums.className = 'class-minimums';
        minimums.innerHTML = '<h3>Class minimums</h3><div class="class-minimums-content"></div>';
        minimums.querySelector('.class-minimums-content').innerHTML = classMinimumsHTML();
        abilitiesHeading.after(minimums);
    }
    setupStrengthControl();
    setupVisionInput();
    setupClassInputs();
    data.identity.classEntries.forEach((entry, index) => updateNextLevel(index));
    updateThac0();
    setupRaceSystem();
    setupAbilitySummary();
    setupHitPointsSection();
    updateSavingThrows();
    setupMovementSection();
    setupHenchmenSection();
    setupActionReferenceSection();
    setupThac0ReferenceSection();
    setupAcReferenceSection();
    setupClassRequirementsReferenceSection();
    setupAcSection();
    setupMissileAcField();
    updateAcTotal();
    setupWeaponSection();
    setupSpellSectionPosition();
    setupSpellTracking();
    setupCampRecoverySection();
    setupClassAbilitiesSection();
    setupSpecialNotesPosition();
    setupResistanceSection();
    setupSurpriseSection();
    setupGlobalModifiersSection();
    setupProficiencyAndInventorySections();
    setupWeaponProficiencySection();
    setupSurpriseReferenceSection();
    setupBladesingerReferenceSection();
    setupReferenceLibrary();
    setupCharacterHeader();
    setupNotesDrawer();
    setupSurpriseSection();
    setupSectionToggles();
    setupSectionOrdering();
    setupTableOfContents();
    setupQuickFactsFooter();
    setupGoblinAdviser();
    bind()
}

function changed() {
    localStorage.setItem('adnd2e-sheet-v1', JSON.stringify(data));
    document.querySelector('#status').textContent = 'Saved locally at ' + new Date().toLocaleTimeString();
}

function syncToolbarOffset() {
    const toolbar = document.querySelector('.toolbar');
    if (toolbar) document.body.style.paddingTop = `${toolbar.offsetHeight}px`;
}

window.addEventListener('resize', syncToolbarOffset);
syncToolbarOffset();
const navPin = document.querySelector('#navPinBtn');
const mobileMenuButton = document.querySelector('#mobileMenuBtn');
const toolbar = document.querySelector('.toolbar');
const sheetSearch = document.querySelector('#sheetSearch');
if (sheetSearch) sheetSearch.oninput = () => {
    const query = sheetSearch.value.trim().toLowerCase();
    const cards = document.querySelectorAll('#app .card');
    let firstMatch = null;
    cards.forEach(card => {
        const values = [...card.querySelectorAll('input, textarea, select')].map(input => input.value).join(' ');
        const matches = !query || `${card.textContent} ${values}`.toLowerCase().includes(query);
        card.classList.toggle('sheet-search-match', Boolean(query && matches));
        if (matches && query && !firstMatch) firstMatch = card;
    });
    if (firstMatch) firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const status = document.querySelector('#status');
    if (status) status.textContent = query ? `${[...cards].filter(card => card.classList.contains('sheet-search-match')).length} matching sections` : 'Autosaves locally in this browser.';
};

function closeMobileMenu() {
    if (!toolbar || !mobileMenuButton) return;
    toolbar.classList.remove('mobile-menu-open');
    mobileMenuButton.setAttribute('aria-expanded', 'false');
    mobileMenuButton.setAttribute('aria-label', 'Open menu');
}

navPin.onclick = () => {
    const collapsed = toolbar.classList.toggle('toolbar-nav-collapsed');
    navPin.classList.toggle('tooltip-pin-muted', collapsed);
    navPin.setAttribute('aria-pressed', String(collapsed));
    navPin.setAttribute('aria-label', `${collapsed ? 'Show' : 'Hide'} navigation bar`);
    navPin.title = `${collapsed ? 'Show' : 'Hide'} navigation bar`;
    if (collapsed) closeMobileMenu();
    syncToolbarOffset();
};
if (mobileMenuButton) {
    mobileMenuButton.onclick = () => {
        const expanded = toolbar.classList.toggle('mobile-menu-open');
        mobileMenuButton.setAttribute('aria-expanded', String(expanded));
        mobileMenuButton.setAttribute('aria-label', `${expanded ? 'Close' : 'Open'} menu`);
    };
    toolbar.querySelectorAll('.actions button, .actions .button').forEach(control => {
        control.addEventListener('click', () => {
            if (window.matchMedia('(max-width: 700px)').matches) closeMobileMenu();
        });
    });
    window.addEventListener('resize', () => {
        if (!window.matchMedia('(max-width: 700px)').matches) closeMobileMenu();
    });
}
const resetOrderButton = document.querySelector('#resetOrderBtn');
if (resetOrderButton) resetOrderButton.onclick = () => {
    data.sectionOrder = [];
    changed();
    render();
};

function bind() {
    document.querySelectorAll('[data-section]').forEach(e => e.oninput = () => {
        data[e.dataset.section][e.dataset.key] = e.value;
        if (e.dataset.section === 'abilities') {
            document.querySelector('.ability-total').textContent = `Total: ${abilityTotal()}`;
            updateClassMinimums();
            updateAbilitySummary();
            if (e.dataset.key === 'dex') updateAcTotal();
            if (e.dataset.key === 'str') updateWeaponThac0();
            updateClassRequirementNotice();
            if (e.dataset.key === 'str') updateEncumbranceSummary();
            if (e.dataset.key === 'int') updateLanguageSummary();
            updateNwpTargets();
        }
        if (e.dataset.section === 'combat' && e.dataset.key === 'ac') {
            const armor = data.combat.acItems?.find(item => item.type === 'armor');
            if (armor) armor.value = e.value;
            updateAcTotal();
        }
        if (e.dataset.section === 'combat' && ['hpMax', 'hpCurrent', 'hpBonus'].includes(e.dataset.key)) {
            const maximumHitPoints = Number.parseInt(data.combat.hpMax, 10);
            const currentHitPoints = Number.parseInt(data.combat.hpCurrent, 10);
            if (Number.isInteger(maximumHitPoints) && Number.isInteger(currentHitPoints) && currentHitPoints > maximumHitPoints) {
                data.combat.hpCurrent = String(maximumHitPoints);
                const currentInput = document.querySelector('[data-section="combat"][data-key="hpCurrent"]');
                if (currentInput) {
                    currentInput.setAttribute('value', data.combat.hpCurrent);
                    currentInput.value = data.combat.hpCurrent;
                }
            }
            updateHitPointDisplay();
            updateCampRecoverySummary();
        }
        if (e.dataset.section === 'combat' && e.dataset.key === 'movement') updateMovementSection();
        if (e.dataset.section === 'currency') {
            const wealthTotal = document.querySelector('.wealth-total strong');
            if (wealthTotal) wealthTotal.textContent = copperBreakdown(wealthInCopper());
        }
        changed()
    });
    document.querySelectorAll('[data-root]').forEach(e => e.oninput = () => {
        data[e.dataset.root] = e.value;
        changed()
    });
    document.querySelectorAll('[data-array]').forEach(e => e.oninput = () => {
        const item = data[e.dataset.array][+e.dataset.index];
        item[e.dataset.key] = e.type === 'checkbox' ? e.checked : e.dataset.key === 'usesNwpSlot' ? e.value === 'true' : e.value;
        if (e.dataset.array === 'proficiencies') {
            document.querySelector('#nwp-summary').innerHTML = nwpSummaryMarkup();
            updateNwpTargets();
        }
        if (e.dataset.array === 'languages') updateLanguageSummary();
        if (e.dataset.array === 'inventory') {
            if (e.dataset.key === 'item') {
                const match = equipmentCatalogue.find(record => record.name.toLowerCase() === e.value.trim().toLowerCase());
                item.itemId = match?.id || '';
                item.catalogItemId = item.itemId;
                item.catalogType = match?.catalogType || item.catalogType || 'equipment';
                item.item = match ? '' : e.value;
                e.closest('td').querySelector('[data-key="itemId"]').value = item.itemId;
                e.closest('tr').children[4].textContent = formatCost(match?.cost);
            }
            updateEncumbranceSummary();
            document.querySelector('.inventory-total strong').textContent = inventoryValue();
        }
        changed()
    });
    document.querySelectorAll('[data-array="inventory"]').forEach(e => e.onchange = e.oninput);
    document.querySelectorAll('[data-add]').forEach(b => b.onclick = () => {
        const templates = {
            henchmen: {
                type: 'NPC',
                name: '',
                levelOrHd: '',
                role: '',
                loyalty: '',
                notes: ''
            },
            weapons: {
                name: '',
                attackType: '',
                attackAdj: '',
                damageAdj: '',
                thac0Adj: '',
                damageSM: '',
                damageL: '',
                range: '',
                weight: '',
                speed: '',
                equipped: true
            },
            proficiencies: {
                name: '',
                slots: '',
                score: '',
                type: '',
                source: '',
                checkModifier: null,
                exemptFromNwpLimits: false,
                notes: ''
            },
            languages: {
                name: '',
                sourceType: 'native',
                category: '',
                id: '',
                speaks: true,
                reads: false,
                writes: false,
                usesLanguageSlot: false,
                countsAgainstLanguageLimit: false
            },
            inventory: {
                itemId: '',
                item: '',
                location: 'carried',
                equipped: true,
                customName: null,
                weightOverride: null,
                quantity: 1,
                notes: ''
            },
            spells: {
                name: '',
                level: '',
                school: '',
                memorized: '',
                notes: ''
            }
        };
        data[b.dataset.add].push(templates[b.dataset.add]);
        changed();
        render()
    });
    document.querySelectorAll('[data-remove]').forEach(b => b.onclick = () => {
        data[b.dataset.remove].splice(+b.dataset.index, 1);
        changed();
        render()
    })
}
document.querySelector('#saveBtn').onclick = () => {
    const blob = new Blob([JSON.stringify(normalize(data), null, 2)], {
            type: 'application/json'
        }),
        a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (data.identity.name || 'character').replace(/[^a-z0-9_-]+/gi, '_') + '.json';
    a.click();
    URL.revokeObjectURL(a.href)
};
document.querySelector('#loadInput').onchange = async e => {
    try {
        data = normalize(JSON.parse(await e.target.files[0].text()));
        changed();
        render();
        document.querySelector('#status').textContent = 'JSON loaded successfully.'
    } catch (err) {
        alert('Could not load that JSON file: ' + err.message)
    }
    e.target.value = ''
};
document.querySelector('#newBtn').onclick = () => {
    if (confirm('Clear this character and start a new sheet?')) {
        data = clone(FIXED);
        changed();
        render()
    }
};
document.querySelector('#printBtn').onclick = () => print();
function setAllSections(collapsed) {
    document.querySelectorAll('.grid > .card, .character-details').forEach(section => {
        section.classList.toggle('section-collapsed', collapsed);
        data.sectionStates[section.dataset.sectionKey] = collapsed;
        const toggle = section.querySelector(':scope > h2 .section-toggle');
        if (toggle) {
            toggle.textContent = collapsed ? '+' : '-';
            toggle.setAttribute('aria-expanded', String(!collapsed));
        }
    });
    changed();
}
document.querySelector('#expandAllBtn').onclick = () => setAllSections(false);
document.querySelector('#collapseAllBtn').onclick = () => setAllSections(true);
document.querySelector('#topBtn').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
function setupFiligreeParallax() {
    let currentOffset = 0;
    let targetOffset = 0;
    let frameId = 0;
    const animate = () => {
        currentOffset += (targetOffset - currentOffset) * 0.08;
        if (Math.abs(targetOffset - currentOffset) < 0.05) currentOffset = targetOffset;
        document.documentElement.style.setProperty('--filigree-offset', `${currentOffset.toFixed(2)}px`);
        frameId = currentOffset === targetOffset ? 0 : window.requestAnimationFrame(animate);
    };
    window.addEventListener('scroll', () => {
        targetOffset = window.scrollY * -0.18;
        if (!frameId) frameId = window.requestAnimationFrame(animate);
    }, { passive: true });
    animate();
}

function goblinAdviceRules() {
    const advice = [];
    const identity = data.identity;
    const classes = identity.classEntries || [];
    if (!String(identity.name || '').trim()) advice.push({ id: 'identity-name', priority: 10, message: 'Add a character name so the sheet is easy to identify.', target: '.hero', actionLabel: 'Go to identity' });
    if (!String(data.raceSelection || identity.race || '').trim()) advice.push({ id: 'identity-race', priority: 11, message: 'Choose a race to unlock the matching racial rules.', target: '.race-rules', actionLabel: 'Go to race rules' });
    if (!String(identity.alignment || '').trim()) advice.push({ id: 'identity-alignment', priority: 12, message: 'Record an alignment for this character.', target: '.hero', actionLabel: 'Go to identity' });
    if (!classes.length || classes.some(entry => !String(entry.className || '').trim() || !Number.isInteger(Number.parseInt(entry.level, 10)) || Number.parseInt(entry.level, 10) < 1)) advice.push({ id: 'identity-class-level', priority: 13, message: 'Complete each class and level before relying on derived values.', target: '.hero', actionLabel: 'Go to classes' });
    const missingAbilities = Object.entries(data.abilities).filter(([, value]) => !Number.isInteger(Number.parseInt(value, 10))).map(([key]) => key.toUpperCase());
    if (missingAbilities.length) advice.push({ id: 'missing-abilities', priority: 20, message: `Enter ability scores for ${missingAbilities.join(', ')}.`, target: '.abilities-modifiers-card', actionLabel: 'Go to abilities' });
    if (!String(data.combat.hpMax || '').trim()) advice.push({ id: 'missing-hit-points', priority: 30, message: 'Add maximum hit points before tracking recovery.', target: '.hit-points-section', actionLabel: 'Go to hit points' });
    if (!String(data.combat.thac0 || '').trim()) advice.push({ id: 'missing-thac0', priority: 31, message: 'Enter a base THAC0 so weapon attack values can be calculated.', target: '.combat-card', actionLabel: 'Go to combat' });
    const availableNwp = data.nwpSettings.autoCalculate ? null : Number(data.nwpSettings.availableSlots) || 0;
    const usedNwp = data.proficiencies.filter(item => item.usesNwpSlot !== false && item.exemptFromNwpLimits !== true).reduce((total, item) => total + (Number(item.slotCost) || 1), 0);
    if (availableNwp !== null && availableNwp > usedNwp) advice.push({ id: 'unspent-nwp-slots', priority: 40, message: `You still have ${availableNwp - usedNwp} nonweapon proficiency slot${availableNwp - usedNwp === 1 ? '' : 's'} to spend.`, target: '.nwp-summary', actionLabel: 'Go to skills' });
    const availableWeapon = data.weaponProficiencySettings.autoCalculate ? null : Number(data.weaponProficiencySettings.availableSlots) || 0;
    const usedWeapon = data.weaponProficiencies.filter(item => item.proficient).length;
    if (availableWeapon !== null && availableWeapon > usedWeapon) advice.push({ id: 'unspent-weapon-slots', priority: 41, message: `You still have ${availableWeapon - usedWeapon} weapon proficiency slot${availableWeapon - usedWeapon === 1 ? '' : 's'} to spend.`, target: '.weapon-proficiencies-section', actionLabel: 'Go to weapon proficiencies' });
    if (classes.some(entry => /ranger/i.test(entry.className || '')) && Object.values(data.rangerThiefCalculations || {}).some(item => item.available === false)) advice.push({ id: 'ranger-stealth-review', priority: 60, message: 'Review the Ranger stealth calculation warnings in Thief Skills.', target: '.ranger-thief-calculations', actionLabel: 'Review Ranger skills' });
    if (!String(data.notes || '').trim()) advice.push({ id: 'missing-notes', priority: 90, message: 'Add a short session summary to keep the character’s story close at hand.', target: '.notes-section', actionLabel: 'Go to notes' });
    if (!advice.length) advice.push({ id: 'sheet-review', priority: 100, message: 'The sheet has no obvious entry gaps. Give the rules and equipment a quick review.', target: '#app', actionLabel: 'Review sheet' });
    return advice.sort((left, right) => left.priority - right.priority || left.id.localeCompare(right.id));
}

function setupGoblinAdviser(entrance = false) {
    const existingAdviser = document.querySelector('.goblin-adviser');
    existingAdviser?._goblinCleanup?.();
    existingAdviser?.remove();
    document.querySelector('.goblin-adviser-summon')?.remove();
    if (!data.adviserSettings.enabled) return;
    if (data.adviserSettings.dismissed) {
        const summon = document.createElement('button');
        summon.type = 'button';
        summon.className = 'goblin-adviser-summon';
        summon.setAttribute('aria-label', 'summon advisor goblin');
        summon.title = 'summon advisor goblin';
        summon.innerHTML = '<img src="goblin_hut_transparent.png" alt="summon advisor goblin">';
        summon.onclick = () => { data.adviserSettings.dismissed = false; changed(); setupGoblinAdviser(true); };
        document.body.append(summon);
        return;
    }
    const advice = goblinAdviceRules();
    const currentIndex = Math.max(0, advice.findIndex(item => item.id === data.adviserSettings.currentAdviceId));
    const widget = document.createElement('aside');
    widget.className = 'goblin-adviser';
    widget.innerHTML = `<div class="goblin-adviser-bubble" role="status" aria-live="polite" hidden><strong>GOBLIN SHEET ADVISER</strong><p></p><div class="goblin-adviser-actions"><button type="button" class="goblin-adviser-go"></button></div></div><button type="button" class="goblin-adviser-toggle" aria-label="Get character sheet advice"><img src="${entrance ? 'goblin-adviser-knife-left-clean-v2.png' : 'goblin-adviser-idle-left-clean.png'}" alt="Goblin sheet adviser"></button><button type="button" class="goblin-adviser-dismiss-adviser" aria-label="Dismiss advice" title="Dismiss advice">×</button>`;
    const bubble = widget.querySelector('.goblin-adviser-bubble');
    const message = widget.querySelector('p');
    const go = widget.querySelector('.goblin-adviser-go');
    const dismissAdviser = widget.querySelector('.goblin-adviser-dismiss-adviser');
    const sprite = widget.querySelector('.goblin-adviser-toggle img');
    let spriteTimer;
    let blinkTimer;
    let entranceTimer;
    let fadeExitTimer;
    let fadeTimer;
    widget._goblinCleanup = () => { clearTimeout(fadeTimer); clearTimeout(fadeExitTimer); clearTimeout(spriteTimer); clearTimeout(entranceTimer); clearInterval(blinkTimer); };
    let index = currentIndex;
    const show = () => { clearTimeout(entranceTimer); const item = advice[index]; data.adviserSettings.currentAdviceId = item.id; message.textContent = item.message; go.textContent = item.actionLabel; go.hidden = !item.target; bubble.hidden = false; sprite.src = 'goblin-adviser-talk-point-left-clean-v2.png'; clearTimeout(spriteTimer); spriteTimer = setTimeout(() => { startIdleLoop(); }, 1400); clearTimeout(fadeTimer); clearTimeout(fadeExitTimer); fadeTimer = setTimeout(() => { bubble.classList.add('goblin-adviser-fading'); fadeExitTimer = setTimeout(() => { bubble.hidden = true; bubble.classList.remove('goblin-adviser-fading'); }, 300); }, 5000); };
    const advance = () => { index = (index + 1) % advice.length; show(); };
    const startIdleLoop = () => { clearTimeout(entranceTimer); clearInterval(blinkTimer); sprite.src = 'goblin-adviser-idle-left-clean.png'; blinkTimer = setInterval(() => { sprite.src = 'goblin-adviser-think-left-clean.png'; clearTimeout(spriteTimer); spriteTimer = setTimeout(() => { sprite.src = 'goblin-adviser-idle-left-clean.png'; }, 1200); }, 8000); };
    widget.querySelector('.goblin-adviser-toggle').onclick = () => { bubble.hidden = false; advance(); };
    dismissAdviser.onclick = () => {
        clearTimeout(fadeTimer);
        if (!bubble.hidden) {
            bubble.hidden = true;
            return;
        }
        data.adviserSettings.dismissed = true;
        changed();
        setupGoblinAdviser();
    };
    if (entrance) { sprite.src = 'goblin-adviser-knife-left-clean-v2.png'; entranceTimer = setTimeout(() => { sprite.src = 'goblin-adviser-think-left-clean.png'; entranceTimer = setTimeout(startIdleLoop, 1200); }, 2000); } else startIdleLoop();
    go.onclick = () => { const target = document.querySelector(advice[index].target); target?.scrollIntoView({ behavior: 'smooth', block: 'center' }); target?.animate([{ outline: '2px solid #c69c3a' }, { outline: '2px solid transparent' }], { duration: 900 }); };
    document.body.append(widget);
}
try {
    data = normalize(JSON.parse(localStorage.getItem('adnd2e-sheet-v1') || '{}'))
} catch {}
setupFiligreeParallax();
render();
Promise.all([loadEquipmentCatalogue(), loadNonweaponCatalog(), loadSpellCatalog(), loadPriestSpellProgression(), loadWizardSpellProgression(), loadRangerSpellProgression(), loadDruidSphereAccess(), loadRangerSpellAccess(), loadPaladinSpellData(), loadBardSpellProgression(), loadShamanSpellcasting(), loadRangerThiefAbilities(), loadSpellMaterialEnrichments(), loadClassAbilitiesCatalog(), loadWeaponProficiencyCatalog(), loadProficiencyRules(), loadTrackingProficiencyRule(), loadLanguageCatalog(), loadRaceCards()]).then(() => {
    const enrichmentResult = applySpellMaterialEnrichments(spellCatalogSourceRecords, spellMaterialEnrichmentRecords);
    spellCatalogSourceRecords = enrichmentResult.records;
    spellMaterialEnrichmentConflicts = enrichmentResult.conflicts;
    spellCatalogRecords = spellCatalogRecords.map(record => {
        const sourceRecord = spellCatalogSourceRecords.find(candidate => candidate.sourceRecordId === record.sourceRecordId);
        return sourceRecord ? { ...record, materialComponents: sourceRecord.materialComponents } : record;
    });
    spellCatalogRecords = mergeSpellCatalogRecords(spellCatalogRecords, spellCatalogSourceRecords).merged;
    spellCatalog = spellCatalogRecords.map(item => ({
        ...item,
        source: spellSources(item).length ? spellSources(item) : [item.spellGroup ? normalizeLegacySpellSource(item.spellGroup) : 'Unknown'],
        school: item.school || item.spellGroup || (Array.isArray(item.schools) ? item.schools[0] : Array.isArray(item.sphere) ? item.sphere[0] : ''),
        level: String(item.level),
        type: 'Spell',
        notes: Array.isArray(item.notes) ? item.notes : []
    }));
    render();
});