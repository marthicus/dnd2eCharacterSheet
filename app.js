const SCHEMA_VERSION = 1;
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
        level: '',
        xp: '',
        nextLevel: '',
        deity: '',
        classEntries: [{ className: '', level: '', xp: '', nextLevel: '' }]
    },
    raceSelection: '',
    manualRace: '',
    racialBonuses: {},
    selectedBackground: '',
    racialFeatures: '',
    racialBonusChoice: '',
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
        rearAc: ''
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
    proficiencies: [],
    inventory: [],
    spells: [],
    specialAbilities: '',
    wounds: '',
    notes: '',
    sectionStates: {}
};
const clone = o => JSON.parse(JSON.stringify(o));
let data = clone(FIXED);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
} [c]));

function normalize(x = {}) {
    const d = clone(FIXED);
    for (const section of ['identity', 'abilities', 'details', 'combat', 'saves', 'currency']) Object.assign(d[section], x[section] || {});
    d.identity.multiClass = Array.isArray(d.identity.multiClass) ? d.identity.multiClass : [];
    d.identity.classKit = typeof d.identity.classKit === 'string' ? d.identity.classKit : '';
    d.identity.manualClass = typeof d.identity.manualClass === 'string' ? d.identity.manualClass : '';
    d.identity.manualMultiClass = typeof d.identity.manualMultiClass === 'string' ? d.identity.manualMultiClass : '';
    const inspiration = Number.parseInt(d.identity.inspiration, 10);
    d.identity.inspiration = Number.isInteger(inspiration) ? Math.max(0, inspiration) : 0;
        d.identity.classEntries = Array.isArray(d.identity.classEntries) && d.identity.classEntries.length ? d.identity.classEntries : [{ className: d.identity.className, level: d.identity.level, xp: d.identity.xp, nextLevel: d.identity.nextLevel, specialization: '' }];
        d.identity.classEntries = d.identity.classEntries.map(entry => ({ ...entry, specialization: typeof entry.specialization === 'string' ? entry.specialization : '' }));
        d.combat.acItems = Array.isArray(d.combat.acItems) ? d.combat.acItems.map(item => ({ name: typeof item.name === 'string' ? item.name : '', type: typeof item.type === 'string' ? item.type : 'other', value: item.value ?? '', equipped: item.equipped !== false })) : [];
    for (const k of ['portraitUrl', 'specialAbilities', 'wounds', 'notes']) d[k] = typeof x[k] === 'string' ? x[k] : '';
    for (const k of ['raceSelection', 'manualRace', 'selectedBackground', 'racialFeatures', 'racialBonusChoice']) d[k] = typeof x[k] === 'string' ? x[k] : '';
    d.racialBonuses = x.racialBonuses && typeof x.racialBonuses === 'object' && !Array.isArray(x.racialBonuses) ? x.racialBonuses : {};
    d.sectionStates = x.sectionStates && typeof x.sectionStates === 'object' && !Array.isArray(x.sectionStates) ? x.sectionStates : {};
    for (const k of ['weapons', 'henchmen', 'proficiencies', 'inventory', 'spells']) d[k] = Array.isArray(x[k]) ? x[k] : [];
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

const raceCatalog = {
    Humans: { classes: ['Fighter', 'Ranger', 'Paladin', 'Cleric', 'Druid', 'Thief', 'Bard', 'Mage', 'Specialist Mage', 'Dual-Class'], bonuses: {}, choiceAbilities: ['str', 'dex', 'con', 'int', 'wis', 'cha'], backgrounds: { 'Saltwind Soul': 'Weather Sense or Navigation; Swimming; Rope Use', 'Silver Halls Noble': 'Etiquette or Dancing; Reading / Writing; 150 starting gold', 'Heart of Harvestfall': 'Agriculture; Animal Handling; Cooking or Brewing', 'Autumn Line Vanguard': 'Survival or Tracking; Fire Building', 'Child of Flame': 'Healing or Herbalism; Religion', 'Oldcraft Disciple': 'Ancient History or Languages; Engineering' }, features: '+1 starting language; +1 non-weapon proficiency; +1 encounter rolls with intelligent creatures.', activeSkill: { name: 'Manifest Destiny', condition: 'One time use only, during character creation.', description: 'Roll 9 sets of ability scores and keep the highest 6.' } },
    Elves: { classes: ['Fighter', 'Ranger', 'Cleric', 'Druid', 'Thief', 'Mage', 'Specialist Mage: Diviner', 'Specialist Mage: Enchanter', 'Specialist Mage: Wild Mage', 'Fighter / Mage', 'Fighter / Thief', 'Mage / Thief', 'Fighter / Mage / Thief'], bonuses: {}, choiceAbilities: ['dex', 'con', 'int', 'cha'], backgrounds: { 'Bone Reef Bred': 'Weapon Proficiency; Navigation or Rope Use; Swimming', 'Obsidian Shaped': 'Fast Talking or Bartering; Blacksmithing; 150 starting gold', 'Vel’seraak Pit Caste': 'Animal Handling or Training; Intimidation; Dirty Tricks', 'Black Forest Faithful': 'Herbalism or Healing; Religion', 'Vel’seran Loreborn': 'Ancient History or Languages; Reading / Writing; Agriculture', 'Deadwind Exile': 'Survival or Tracking; Alertness; Hunting' }, features: 'Infravision 60’; 90% immunity to Sleep and Charm spells; enemies receive -4 / -2 to surprise rolls in the listed conditions; +1 to hit/damage with axes and throwing weapons; detect secret doors.', activeSkill: { name: 'Blood-Tide Frenzy', condition: 'Once per adventure; lasts 2 rounds plus 1 round per 3 levels.', description: 'Suffer the listed AC penalty and gain the listed attack benefits against spells, melee, and thrown weapons.' } },
    Goblins: { classes: ['Fighter', 'Cleric', 'Thief', 'Witchdoctor', 'Fighter / Cleric', 'Fighter / Thief', 'Witchdoctor / Thief'], bonuses: {}, choiceAbilities: ['str', 'dex', 'wis', 'cha'], backgrounds: { 'Shallows Scallywag': 'Fishing; Rope Use; Weather Sense or Navigation', 'Underhill Highborn': 'Heraldry or Etiquette; +1 Bonus Language; Dancing or Singing', 'Grublight Devoted': 'Religion; Soothsaying or Herbalism', 'Glitterdeep Stray': 'Gem Cutting or Mining; Direction Sense', 'Rokpokkít Wanderer': 'Gaming or Drinking; Fast Talking; 150 starting gold', 'Gristleborn': 'Weapon Proficiency; Blind-Fighting or Wild Fighting' }, features: 'Infravision 60’; Ogres, Trolls, and Giants receive -4 to hit when targeting goblins; detect underground construction, stonework traps, and nearby crystals/gems.', activeSkill: { name: 'Grabby Lil’ Gremlins', condition: 'Once per adventure, when treasure is found.', description: 'Secretly tell the DM to roll 1d6 for the listed gold, gem, or item outcome.' } },
    Dwarf: { classes: ['Fighter', 'Paladin', 'Cleric', 'Thief', 'Specialist Mage: Illusionist', 'Fighter / Cleric', 'Fighter / Thief', 'Thief / Illusionist'], bonuses: { con: 1, cha: -1 }, backgrounds: { 'Treeline Tactician': 'Survival or Danger Sense; Danger Sense', 'Stonesail Explorer': 'Swimming; Rope Use; Slow Respiration or Deep Diving', 'Oathbound Defender': 'Endurance or Armorer; Weapon Proficiency', 'Deepvein Touched': 'Stonemasonry or Blacksmithing; Mining or Engineering', 'Stonefaith Devotee': 'Religion; Dwarf Runes; Chanting or Brewing', 'Deephold Ascendant': 'Etiquette or Reading / Writing; Heraldry; 2 gems worth 80 gp each' }, features: 'Infravision 60’; +1 saves per 3.5 points of CON; Ogres, Trolls, and Giants receive -4 to hit; +1 to hit listed humanoids; 20% chance of non-class magic item malfunction; stonework detection.', activeSkill: { name: 'Tough as Rocks', condition: 'Once per adventure, when reduced to 0 hit points or below.', description: 'Roll 1d6 to determine whether you remain unconscious at 0 hit points or survive at 1 hit point.' } },
    Halfling: { classes: ['Fighter', 'Cleric', 'Thief', 'Bard', 'Fighter / Cleric', 'Fighter / Thief', 'Cleric / Thief'], bonuses: {}, choiceAbilities: ['con', 'int', 'wis', 'cha'], backgrounds: { 'Hearthland Tender': 'Etiquette; Cooking; Brewing or Winemaking', 'Lord of the Fields': 'Weapon Proficiency; Leadership or Oratory; Local History', 'Deep Lake Seeker': 'Fishing or Swimming; Ancient History; Arcanology', 'Woodspirit Watcher': 'Running; Signaling; Alertness or Camouflage', 'Harvest-Rite Follower': 'Religion; Agriculture; Animal Handling or Animal Lore', 'Silver-Tongued Arbiter': 'Fast Talking or Bartering; Gaming; 150 starting gold' }, features: 'Infravision 60’; +1 saves per 3.5 points of CON; Ogres, Trolls, and Giants receive -4 to hit; +1 to hit and damage with thrown weapons or slings; enemies receive -4 / -2 to surprise rolls in listed conditions.', activeSkill: { name: 'Fortune’s Favor', condition: 'At the start of the adventure.', description: 'Gain 1d4 adventure points; these temporary points do not carry over to the next adventure.' } },
    'Half-Elf': { classes: ['Fighter', 'Ranger', 'Paladin', 'Cleric', 'Druid', 'Thief', 'Bard', 'Mage', 'Specialist Mage', 'Fighter / Mage', 'Fighter / Thief', 'Mage / Thief', 'Every combination but the kitchen sink'], bonuses: {}, choiceAbilities: ['str', 'dex', 'con', 'int', 'wis', 'cha'], backgrounds: { 'Ink-Stained Scion': 'Ancient History or Arcanology; +1 Bonus Language; Reading / Writing', 'Twice-Scarred Drifter': 'Weapon Proficiency; Survival or Endurance', 'Rust Shallows Outcast': 'Swimming; Rope Use; Weather Sense or Navigation', 'Forged by the Forest': 'Alertness; Fire Building; Foraging or Weather Sense', 'Open-Hand Pilgrim': 'Religion; Cartography or Cryptography; Reading / Writing', 'Wayward Ward': 'Etiquette; Musical Instrument or Singing; 150 starting gold' }, features: 'Infravision 60’; 30% immunity to Sleep and Charm spells; enemies receive -4 / -2 to surprise rolls in listed conditions; +1 to hit with a chosen weapon group; detect secret doors.', activeSkill: { name: 'Pilgrim’s Cache', condition: 'Once per adventure.', description: 'Spend 1d4+1 rounds searching your pack to produce one tool or supply worth 5 sp or less; it is used immediately and consumed.' } },
    Lizardfolk: { classes: ['Fighter', 'Ranger', 'Druid', 'Witchdoctor', 'Thief', 'Fighter / Thief', 'Druid / Thief'], bonuses: {}, choiceAbilities: ['str', 'dex', 'wis', 'cha'], backgrounds: { 'Broken Coast Castaway': 'Survival or Endurance; Swimming', 'Wyrm-Blood Noble': 'Ancient History; Dancing or Singing; 150 starting gold', 'Fringe-Crest Savage': 'Tracking or Survival; Weapon Proficiency', 'Ophidian Acolyte': 'Astrology or Soothsaying; Religion', 'Marsh Warden': 'Set Snares; Hunting; Local History or Animal Lore' }, features: 'Movement rate of 12 in water; natural AC 5 while unarmored; may hold breath; +1 attack every 2 rounds for 1d6 damage; must wet entire body once per day.', activeSkill: { name: 'Apex Predator', condition: 'Once per adventure; remain perfectly still for 1 turn.', description: 'Become invisible while silent and unmoving, then gain the listed attack and surprise benefits.' } }
};

const classRequirements = {
    Fighter: { str: 9 }, Paladin: { str: 12, con: 9, wis: 13, cha: 17 }, Ranger: { str: 13, dex: 13, con: 14, wis: 14 },
    Wizard: { int: 9 }, 'Specialist Wizard': { int: 9 }, Priest: { wis: 9 }, Druid: { wis: 12, cha: 15 },
    Thief: { dex: 9 }, Bard: { dex: 12, cha: 13 }, Psionicist: { wis: 15, con: 15 }
};
const classPrimeRequisites = {
    Fighter: 'Strength', Paladin: 'Strength, Wisdom', Ranger: 'Strength, Dexterity, Wisdom', Wizard: 'Intelligence',
    'Specialist Wizard': 'Intelligence', Priest: 'Wisdom', Druid: 'Wisdom, Charisma', Thief: 'Dexterity', Bard: 'Dexterity, Charisma', Psionicist: 'Wisdom, Constitution'
};

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

function selectedRaceData() {
    return data.raceSelection && raceCatalog[data.raceSelection] ? raceCatalog[data.raceSelection] : null;
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
        data.racialBonuses = { ...(preset?.bonuses || {}) };
        if (preset?.choiceAbilities?.includes(data.racialBonusChoice)) data.racialBonuses[data.racialBonusChoice] = 1;
        data.racialFeatures = preset?.features || '';
        data.selectedBackground = preset ? data.selectedBackground : '';
        classList.innerHTML = (preset?.classes || []).map(className => `<option value="${esc(className)}"></option>`).join('');
        const backgrounds = preset ? Object.entries(preset.backgrounds) : [];
        rules.querySelector('.race-rules-content').innerHTML = preset
            ? `<div class="race-rule-columns"><div><h3>${esc(race)}</h3><p>${esc(preset.features)}</p><p><strong>Ability bonuses:</strong> ${Object.entries(preset.bonuses).map(([ability, bonus]) => `${ability.toUpperCase()} ${bonus >= 0 ? '+' : ''}${bonus}`).join(', ') || (preset.choiceAbilities ? `+1 to ${preset.choiceAbilities.map(ability => ability.toUpperCase()).join(', ')}` : 'None listed')}</p><p><strong>Legal classes:</strong> ${preset.classes.map(esc).join(', ')}</p>${preset.activeSkill ? `<div class="racial-ability-skill"><h3>Racial Ability Skill</h3><p><strong>${esc(preset.activeSkill.name)}</strong></p><p><strong>Condition:</strong> ${esc(preset.activeSkill.condition)}</p><p><strong>Effect:</strong> ${esc(preset.activeSkill.description)}</p></div>` : ''}</div><div>${preset.choiceAbilities ? `<label for="racial-bonus-choice">Choose +1 ability bonus</label><select id="racial-bonus-choice"><option value="">Choose an ability</option>${preset.choiceAbilities.map(ability => `<option value="${ability}">${ability.toUpperCase()}</option>`).join('')}</select>` : ''}<label for="background-select">Background</label><select id="background-select"><option value="">Choose a background</option>${backgrounds.map(([name]) => `<option value="${esc(name)}">${esc(name)}</option>`).join('')}</select><p class="background-benefits"></p><p class="class-validity"></p><p class="class-requirements-note"></p></div></div>`
            : '<p>Custom race. Enter the race name manually; class legality, bonuses, and background rules must be entered manually.</p>';
        const background = rules.querySelector('#background-select');
        const bonusChoice = rules.querySelector('#racial-bonus-choice');
        if (bonusChoice) {
            bonusChoice.value = data.racialBonusChoice;
            bonusChoice.onchange = () => {
                data.racialBonusChoice = bonusChoice.value;
                update();
            };
        } else if (!preset?.choiceAbilities) data.racialBonusChoice = '';
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
    classTableField.innerHTML = `<label for="class-entries">Classes</label><table id="class-entries" class="class-entries-table"><thead><tr><th>Class</th><th>Level</th><th>Experience</th><th>Next level</th><th></th></tr></thead><tbody></tbody></table><button type="button" class="add" id="add-class-entry">Add class</button>`;
    const body = classTableField.querySelector('tbody');
    const addRow = entry => {
        const index = entry ? data.identity.classEntries.indexOf(entry) : data.identity.classEntries.push({ className: '', level: '', xp: '', nextLevel: '', specialization: '' }) - 1;
        const row = document.createElement('tr');
                row.innerHTML = `<td><select data-class-entry="${index}" ${index === 0 ? 'data-section="identity" data-key="className"' : 'data-key="className"'}><option value="">Choose a class</option>${classOptions.map(className => `<option value="${className}">${className}</option>`).join('')}<option value="Other">Other</option></select><input class="manual-entry-class" placeholder="Enter custom class" hidden><input class="class-specialization" placeholder="Wizard specialization" data-class-entry="${index}" data-key="specialization" hidden></td><td><input data-class-entry="${index}" data-key="level"></td><td><input data-class-entry="${index}" data-key="xp"></td><td><input data-class-entry="${index}" data-key="nextLevel"></td><td><button type="button" class="remove-class-entry" aria-label="Remove class">×</button></td>`;
        body.append(row);
        row.querySelectorAll('[data-class-entry]').forEach(input => {
            const key = input.dataset.key;
            input.value = data.identity.classEntries[index][key];
            input.oninput = () => { data.identity.classEntries[index][key] = input.value; if (index === 0 && key !== 'className') data.identity[key] = input.value; updateThac0(); updateSavingThrows(); updateClassRequirementNotice(); changed(); };
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
        select.onchange = () => { manual.hidden = select.value !== 'Other'; specialization.hidden = select.value !== 'Wizard'; data.identity.classEntries[index].className = select.value === 'Other' ? manual.value : select.value; if (index === 0) { data.identity.className = data.identity.classEntries[index].className; data.identity.manualClass = select.value === 'Other' ? manual.value : ''; } updateThac0(); updateSavingThrows(); updateClassRequirementNotice(); changed(); };
        manual.oninput = () => { data.identity.classEntries[index].className = manual.value; if (index === 0) { data.identity.className = manual.value; data.identity.manualClass = manual.value; } updateThac0(); updateSavingThrows(); updateClassRequirementNotice(); changed(); };
        specialization.oninput = () => { data.identity.classEntries[index].specialization = specialization.value; changed(); };
        row.querySelector('.remove-class-entry').onclick = () => { if (data.identity.classEntries.length === 1) return; data.identity.classEntries.splice(index, 1); render(); };
    };
    const initialEntries = data.identity.classEntries.slice();
    initialEntries.forEach(entry => addRow(entry));
    classTableField.querySelector('#add-class-entry').onclick = () => { addRow(); changed(); };
    const kitField = document.createElement('div');
    kitField.className = 'field class-kit-field';
    kitField.innerHTML = `<label for="class-kit">Class kit</label><input id="class-kit" data-section="identity" data-key="classKit" value="${esc(data.identity.classKit)}">`;
    classField.replaceWith(kitField);
    const inspirationField = document.createElement('div');
    inspirationField.className = 'field inspiration-field';
    inspirationField.innerHTML = `<label for="inspiration-count">Inspiration</label><div class="inspiration-controls"><button type="button" data-inspiration-change="-1" aria-label="Decrease inspiration">-</button><input id="inspiration-count" data-section="identity" data-key="inspiration" type="number" min="0" step="1" value="${data.identity.inspiration}"><button type="button" data-inspiration-change="1" aria-label="Increase inspiration">+</button></div>`;
    inspirationField.querySelectorAll('[data-inspiration-change]').forEach(button => button.onclick = () => {
        data.identity.inspiration = Math.max(0, (Number.parseInt(data.identity.inspiration, 10) || 0) + Number(button.dataset.inspirationChange));
        inspirationField.querySelector('input').value = data.identity.inspiration;
        changed();
    });
    identityCard.append(inspirationField, classTableField);
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
    if (/priest|cleric|druid|witchdoctor/.test(name)) families.push('priest');
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
    data.combat.thac0 = String(Math.min(...values));
    document.querySelectorAll('[data-section="combat"][data-key="thac0"]').forEach(input => input.value = data.combat.thac0);
    document.querySelectorAll('.thac0-summary-value').forEach(output => output.textContent = data.combat.thac0);
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
    saveKeys.forEach((key, index) => {
        data.saves[key] = String(best[index]);
        document.querySelectorAll(`[data-section="saves"][data-key="${key}"]`).forEach(input => input.value = data.saves[key]);
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
    const segment = currentBenefitText(ability, score).split('; ').find(item => item.toLowerCase().startsWith(key));
    return `${label}: ${segment ? segment.slice(segment.indexOf(' ') + 1) : '-'}`;
}

function updateCarousel(stat, ability, score) {
    stat.querySelector('.modifier').textContent = carouselText(ability, score);
    stat.querySelector('.bonus-position').textContent = `${(bonusIndex[ability] || 0) + 1}/${bonusViews[ability].length}`;
}

function createCarousel(stat, ability) {
    const carousel = document.createElement('div');
    carousel.className = 'bonus-carousel';
    const previous = document.createElement('button');
    previous.type = 'button';
    previous.className = 'bonus-nav';
    previous.textContent = '<';
    previous.title = 'Previous ability benefit';
    previous.setAttribute('aria-label', 'Previous ability benefit');
    previous.dataset.bonusPrev = ability;
    const output = stat.querySelector('.modifier');
    const position = document.createElement('span');
    position.className = 'bonus-position';
    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'bonus-nav';
    next.textContent = '>';
    next.title = 'Next ability benefit';
    next.setAttribute('aria-label', 'Next ability benefit');
    next.dataset.bonusNext = ability;
    carousel.append(previous, output, position, next);
    stat.append(carousel);
    updateCarousel(stat, ability, data.abilities[ability]);
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
        image.src = data.portraitUrl || '';
        hero.append(image);
        return image;
    })();
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
        const source = data.portraitUrl || portrait.src;
        portrait.src = '';
        portrait.src = source;
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
    controls.append(portraitField, refresh, expand);
    portraitArea.append(portraitFrame, controls);

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
        [1, '0 languages; no spell level, spell learning, or additional spells'], [9, '2 languages; spells up to 4th level; 35% chance to learn; 7 spells per level'],
        [10, '2 languages; spells up to 5th level; 40% chance to learn; 7 spells per level'], [11, '3 languages; spells up to 6th level; 50% chance to learn; 9 spells per level'],
        [12, '3 languages; spells up to 6th level; 55% chance to learn; 9 spells per level'], [13, '4 languages; spells up to 7th level; 60% chance to learn; 9 spells per level'],
        [14, '4 languages; spells up to 7th level; 65% chance to learn; 11 spells per level'], [15, '5 languages; spells up to 8th level; 70% chance to learn; 11 spells per level'],
        [16, '5 languages; spells up to 8th level; 75% chance to learn; 11 spells per level'], [17, '6 languages; spells up to 9th level; 85% chance to learn; all spells per level'],
        [18, '7 languages; spells up to 9th level; 90% chance to learn; all spells per level'], [19, '8 languages; spells up to 9th level; 95% chance to learn; all spells; immune to 1st-level illusions'],
        [20, '9 languages; spells up to 9th level; 96% chance to learn; all spells; immune to 1st- and 2nd-level illusions'],
        [21, '10 languages; spells up to 9th level; 97% chance to learn; all spells; immune through 3rd-level illusions'],
        [22, '11 languages; spells up to 9th level; 98% chance to learn; all spells; immune through 4th-level illusions'],
        [23, '12 languages; spells up to 9th level; 99% chance to learn; all spells; immune through 5th-level illusions'],
        [24, '15 languages; spells up to 9th level; 100% chance to learn; all spells; immune through 6th-level illusions'],
        [25, '20 languages; spells up to 9th level; 100% chance to learn; all spells; immune through 7th-level illusions']
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

function abilityTooltip(ability, score) {
    const value = Number.parseInt(score, 10);
    const points = abilityBenefits[ability].map(([threshold, text]) => ({ score: threshold, text }));
    const active = Number.isInteger(value) && value >= 1 && value <= 25
        ? points.filter(point => point.score <= value).pop()
        : null;
    const future = points.filter(point => !active || point.score > value);
    const lines = ['Ability scores show strengths and weaknesses; class, race, and roleplay also matter.', ''];
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
    const activeScore = Number.isInteger(value) && value >= 1 && value <= 25
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
    return `<p class="tooltip-intro">Ability scores show strengths and weaknesses; class, race, and roleplay also matter.</p><table class="tooltip-table"><thead><tr><th scope="col">Score</th>${headers}</tr></thead><tbody>${rows}</tbody></table>${ability === 'str' ? `<p class="tooltip-note"><strong>Exceptional Strength:</strong> ${esc(exceptionalStrengthNote.replace('Exceptional Strength (fighters only): ', ''))}</p>` : ''}`;
}

function currentBenefitValues(ability, score) {
    const value = Number.parseInt(score, 10);
    const active = Number.isInteger(value) && value >= 1 && value <= 25
        ? abilityBenefits[ability].filter(([threshold]) => threshold <= value).pop()
        : null;
    if (!active) return { score: '-', values: benefitColumns[ability].map(() => '-') };
    const text = active[1];
    const segments = text.split('; ');
    const values = benefitColumns[ability].map(([, key]) => {
        const segment = segments.find(item => item.toLowerCase().includes(key));
        if (!segment) return '-';
        const start = segment.toLowerCase().indexOf(key);
        return segment.slice(start + key.length).trim() || segment;
    });
    return { score: value, values };
}

function abilitySummaryHTML() {
    return Object.keys(labels).map(ability => {
        const columns = benefitColumns[ability];
        const current = currentBenefitValues(ability, data.abilities[ability]);
        return `<div class="ability-summary-row"><div class="ability-summary-name">${labels[ability]}<span>${current.score}</span></div><table class="ability-summary-table"><thead><tr>${columns.map(([label]) => `<th>${label}</th>`).join('')}</tr></thead><tbody><tr>${current.values.map(value => `<td>${esc(value)}</td>`).join('')}</tr></tbody></table></div>`;
    }).join('');
}

function updateAbilitySummary() {
    const summary = document.querySelector('.ability-summary-content');
    if (summary) summary.innerHTML = abilitySummaryHTML();
}

function setupAbilitySummary() {
    const section = document.createElement('section');
    section.className = 'card wide ability-summary';
    section.innerHTML = '<h2>Current ability benefits</h2><div class="ability-summary-content"></div>';
    section.querySelector('.ability-summary-content').innerHTML = abilitySummaryHTML();
    const abilities = [...document.querySelectorAll('.grid > .card')].find(card => card.querySelector(':scope > h2')?.textContent === 'Abilities');
    (abilities || document.querySelector('.grid > .card')).after(section);
}

function defensiveAdjustment(score) {
    const value = Number.parseInt(score, 10);
    if (!Number.isInteger(value) || value < 1 || value > 25) return '';
    const adjustments = [5, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, -2, -3, -4, -4, -4, -5, -5, -6, -6, -6];
    return adjustments[value - 1];
}

function updateAcTotal() {
    const total = document.querySelector('.ac-total-value');
    const baseValue = document.querySelector('.ac-base-value');
    const adjustment = document.querySelector('.ac-defensive-adjustment');
    if (!total || !baseValue || !adjustment) return;
    const rows = data.combat.acItems || [];
    const activeRows = rows.filter(item => item.equipped !== false);
    const armor = activeRows.find(item => item.type === 'armor');
    const armorValue = Number.parseInt(armor?.value, 10);
    const legacyBase = Number.parseInt(data.combat.ac, 10);
    const base = Number.isInteger(armorValue) ? armorValue : rows.length ? '' : legacyBase;
    const dexAdjustment = defensiveAdjustment(data.abilities.dex);
    const itemAdjustment = activeRows.filter(item => item.type !== 'armor').reduce((sum, item) => {
        const value = Number.parseInt(item.value, 10);
        return sum + (Number.isInteger(value) ? value : 0);
    }, 0);
    const shieldAdjustment = activeRows.filter(item => item.type === 'shield').reduce((sum, item) => sum + (Number.parseInt(item.value, 10) || 0), 0);
    const totalValue = Number.isInteger(base) && dexAdjustment !== '' ? base + dexAdjustment + itemAdjustment : '';
    baseValue.textContent = Number.isInteger(base) ? base : '-';
    total.textContent = totalValue === '' ? '-' : totalValue;
    adjustment.textContent = dexAdjustment === '' ? '-' : formatModifier(dexAdjustment);
    const values = {
        ac: Number.isInteger(base) ? String(base) : '',
        surprisedAc: totalValue === '' || !Number.isInteger(dexAdjustment) ? '' : String(base + itemAdjustment),
        shieldlessAc: totalValue === '' ? '' : String(totalValue - shieldAdjustment),
        rearAc: totalValue === '' ? '' : String(totalValue + 2)
    };
    Object.entries(values).forEach(([key, value]) => {
        data.combat[key] = value;
        document.querySelectorAll(`[data-section="combat"][data-key="${key}"]`).forEach(input => input.value = value);
    });
}

const acItemPresets = [
    ['None / unarmored', 'armor', 10], ['Leather / padded', 'armor', 8], ['Studded leather', 'armor', 7], ['Ring mail', 'armor', 7], ['Brigandine', 'armor', 6], ['Scale mail', 'armor', 6], ['Hide', 'armor', 6], ['Chain mail', 'armor', 5], ['Splint mail', 'armor', 4], ['Banded mail', 'armor', 4], ['Bronze plate mail', 'armor', 4], ['Plate mail', 'armor', 3], ['Field plate', 'armor', 2], ['Full plate', 'armor', 1],
    ['Small shield', 'shield', -1], ['Medium shield', 'shield', -1], ['Large / body shield', 'shield', -1], ['Shield +1', 'shield', -2], ['Ring of protection +1', 'magic', -1], ['Cloak of protection +1', 'magic', -1], ['Armor +1', 'magic', -1], ['Blur', 'spell', -3], ['Cover', 'cover', -2], ['Natural armor', 'natural', 10]
];

function acItemRowsHTML() {
    const types = [['shield', 'Shield'], ['magic', 'Magic item'], ['spell', 'Spell'], ['cover', 'Cover'], ['natural', 'Natural armor'], ['other', 'Other']];
    return (data.combat.acItems || []).map((item, index) => {
        const presetItem = acItemPresets.some(([name]) => name === item.name);
        return `<tr><td><input class="ac-active" type="checkbox" data-ac-item="${index}" data-ac-key="equipped" aria-label="Equipped or active" title="Equipped or active" ${item.equipped !== false ? 'checked' : ''}></td><td><select data-ac-preset="${index}"><option value="Other" ${presetItem ? '' : 'selected'}>Other</option>${acItemPresets.map(([name, type, value]) => `<option value="${esc(name)}" ${item.name === name ? 'selected' : ''}>${esc(name)}</option>`).join('')}</select><input data-ac-item="${index}" data-ac-key="name" value="${esc(item.name)}" placeholder="Item or defense" ${presetItem ? 'hidden' : ''}></td><td><select data-ac-item="${index}" data-ac-key="type"><option value="armor" ${item.type === 'armor' ? 'selected' : ''}>Armor</option>${types.map(([value, label]) => `<option value="${value}" ${item.type === value ? 'selected' : ''}>${label}</option>`).join('')}</select></td><td><input class="ac-item-value" type="number" data-ac-item="${index}" data-ac-key="value" value="${esc(item.value)}" step="1" placeholder="0"></td><td><button type="button" class="remove" data-ac-remove="${index}" aria-label="Remove defense">×</button></td></tr>`;
    }).join('');
}

function setupAcSection() {
    const section = document.createElement('div');
    section.className = 'ac-section';
    section.innerHTML = `<div class="ac-layout"><div class="ac-shield" aria-label="Armor class total"><span class="ac-shield-label">AC</span><strong class="ac-total-value">-</strong></div><div class="thac0-mark" aria-label="THAC0 total"><span class="thac0-mark-blade thac0-mark-blade-one"></span><span class="thac0-mark-blade thac0-mark-blade-two"></span><span class="thac0-mark-label">THAC0</span><strong class="thac0-summary-value">${esc(data.combat.thac0 || '-')}</strong></div><div class="ac-breakdown"><p><span>Armor class</span><strong class="ac-base-value">-</strong></p><p><span>DEX defense</span><strong class="ac-defensive-adjustment">-</strong></p><small>Lower AC is better.</small><nav class="combat-reference-links" aria-label="Combat breakdown references"><a href="#ac-reference">AC breakdown</a><a href="#thac0-reference">THAC0 breakdown</a></nav></div><div class="ac-items"><h3>Defenses and equipment</h3><table class="ac-items-table"><thead><tr><th>Active</th><th>Item / defense</th><th>Type</th><th>AC change</th><th></th></tr></thead><tbody>${acItemRowsHTML()}</tbody></table><button type="button" class="add" data-ac-add>Add defense</button><small>Only equipped / active entries apply. Armor supplies the base AC; protective bonuses use negative numbers.</small></div></div>`;
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
        data.combat.acItems.push({ name: '', type: 'other', value: '', equipped: true });
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
        data.combat.acItems[+select.dataset.acPreset] = { name: preset[0], type: preset[1], value: String(preset[2]), equipped: true };
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

function setupHitPointsSection() {
    const section = document.createElement('section');
    section.className = 'card wide hit-points-section';
    section.innerHTML = `<h2>Hit points and wounds</h2><div class="hit-points-layout"><div class="hit-points-fields"><div class="hp-heart health-quarters-0" aria-live="polite"><span class="heart-quarter heart-quarter-tl" aria-hidden="true"></span><span class="heart-quarter heart-quarter-bl" aria-hidden="true"></span><span class="heart-quarter heart-quarter-tr" aria-hidden="true"></span><span class="heart-quarter heart-quarter-br" aria-hidden="true"></span><span class="heart-shine heart-shine-one" aria-hidden="true"></span><span class="heart-shine heart-shine-two" aria-hidden="true"></span><span class="heart-shine heart-shine-three" aria-hidden="true"></span><strong class="hp-total">0 / 0</strong><small>Total HP</small></div>${fields('combat', [['hpMax', 'Maximum'], ['hpCurrent', 'Current'], ['hpBonus', 'Bonus']])}<div class="hp-actions"><label>Amount</label><input class="hp-action-amount" type="number" min="0" step="1" value="1"><button type="button" class="hp-action" data-hp-action="damage">Take damage</button><button type="button" class="hp-action" data-hp-action="heal">Heal</button></div></div><div class="wounds-field"><label>Wounds</label><textarea data-root="wounds">${esc(data.wounds)}</textarea></div></div>`;
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
        const currentTotal = current + bonus;
        const effectiveMaximum = maximum + bonus;
        if (button.dataset.hpAction === 'damage' && effectiveMaximum > 0 && currentTotal < previousTotal && currentTotal / effectiveMaximum < 0.25) flashHeart('damage');
        if (button.dataset.hpAction === 'heal' && current > previousCurrent) flashHeart('heal');
        changed();
    });
    document.querySelector('.ability-summary').after(section);
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
    heart.classList.remove('hp-damage-flash', 'hp-heal-flash');
    void heart.offsetWidth;
    heart.classList.add(type === 'damage' ? 'hp-damage-flash' : 'hp-heal-flash');
    setTimeout(() => heart.classList.remove('hp-damage-flash', 'hp-heal-flash'), 2200);
}

function movementRate(base, multiplier) {
    const value = Number.parseInt(base, 10);
    return Number.isInteger(value) && value >= 0 ? Math.floor(value * multiplier) : '-';
}

function setupMovementSection() {
    const section = document.createElement('section');
    section.className = 'card wide movement-section';
    section.innerHTML = `<h2>Movement speed</h2><div class="movement-layout"><div class="movement-base"><label>Base rate</label><input data-section="combat" data-key="movement" value="${esc(data.combat.movement)}" inputmode="numeric"><small>Adjust for race, class, armor, and encumbrance as needed.</small></div><table class="movement-table"><thead><tr><th>Rate</th><th>Multiplier</th><th>Speed</th></tr></thead><tbody><tr><th>Light</th><td>2/3</td><td data-movement-rate="light"></td></tr><tr><th>Moderate</th><td>1/2</td><td data-movement-rate="moderate"></td></tr><tr><th>Heavy</th><td>1/3</td><td data-movement-rate="heavy"></td></tr><tr><th>Severe</th><td>1/6</td><td data-movement-rate="severe"></td></tr><tr><th>Jog</th><td>×2</td><td data-movement-rate="jog"></td></tr><tr><th>Run</th><td>×3</td><td data-movement-rate="run3"></td></tr><tr><th>Run</th><td>×4</td><td data-movement-rate="run4"></td></tr><tr><th>Run</th><td>×5</td><td data-movement-rate="run5"></td></tr></tbody></table></div>`;
    const combatCard = [...document.querySelectorAll('.grid > .card')].find(card => card.querySelector(':scope > h2')?.textContent === 'Combat');
    (combatCard || document.querySelector('.hit-points-section')).after(section);
    updateMovementSection();
}

function updateMovementSection() {
    const section = document.querySelector('.movement-section');
    if (!section) return;
    const base = data.combat.movement;
    const rates = { light: 2 / 3, moderate: 1 / 2, heavy: 1 / 3, severe: 1 / 6, jog: 2, run3: 3, run4: 4, run5: 5 };
    Object.entries(rates).forEach(([key, multiplier]) => {
        section.querySelector(`[data-movement-rate="${key}"]`).textContent = movementRate(base, multiplier);
    });
}

function namedInputTable(key, heading, valueLabel) {
    return `<div class="class-ability-group"><h3>${heading}</h3><table class="class-ability-table"><thead><tr><th>Ability</th><th>${valueLabel}</th></tr></thead><tbody>${data[key].map((row, index) => `<tr><th scope="row">${row.name}</th><td><input data-array="${key}" data-index="${index}" data-key="value" value="${esc(row.value)}"></td></tr>`).join('')}</tbody></table></div>`;
}

function setupClassAbilitiesSection() {
    const section = document.createElement('section');
    section.className = 'card wide class-abilities-section';
    section.innerHTML = `<h2>Class abilities</h2><div class="class-abilities-grid">${namedInputTable('thiefSkills', 'Thief skills', 'Percent')} ${namedInputTable('undeadTurning', 'Undead turning', 'Result')} ${namedInputTable('spellLevels', 'Spell levels', 'Value')}</div>`;
    document.querySelector('.movement-section').after(section);
}

function setupHenchmenSection() {
    const section = document.createElement('section');
    section.className = 'card wide henchmen-section';
    section.innerHTML = `<h2>Henchmen</h2><div class="tableWrap"><table class="henchmen-table"><thead><tr><th>Type</th><th>Name</th><th>Level / HD</th><th>Role or species</th><th>Loyalty</th><th>Notes</th><th></th></tr></thead><tbody>${data.henchmen.map((row, index) => `<tr><td><select data-array="henchmen" data-index="${index}" data-key="type"><option value="NPC" ${row.type === 'NPC' ? 'selected' : ''}>NPC</option><option value="Animal" ${row.type === 'Animal' ? 'selected' : ''}>Animal</option></select></td><td><input data-array="henchmen" data-index="${index}" data-key="name" value="${esc(row.name)}"></td><td><input data-array="henchmen" data-index="${index}" data-key="levelOrHd" value="${esc(row.levelOrHd)}"></td><td><input data-array="henchmen" data-index="${index}" data-key="role" value="${esc(row.role)}"></td><td><input data-array="henchmen" data-index="${index}" data-key="loyalty" value="${esc(row.loyalty)}"></td><td><input data-array="henchmen" data-index="${index}" data-key="notes" value="${esc(row.notes)}"></td><td><button class="remove" data-remove="henchmen" data-index="${index}">×</button></td></tr>`).join('')}</tbody></table></div><button class="add" data-add="henchmen">Add henchman</button>`;
    document.querySelector('.class-abilities-section').after(section);
}

const weaponCatalog = [
    ['Battle Axe', 'M', '1d8', '1d8', '-', '7', '7'], ['Hand Axe', 'M/T', '1d6', '1d4', '10/20/30', '5', '4'], ['Throwing Axe', 'T', '1d6', '1d4', '10/20/30', '3', '4'], ['Club', 'M', '1d6', '1d3', '-', '3', '4'],
    ['Dagger', 'M/T', '1d4', '1d3', '10/20/30', '1', '2'], ['Dirk', 'M/T', '1d4', '1d3', '5/15/25', '1', '2'], ['Knife', 'M/T', '1d3', '1d2', '5/10/20', '0.5', '2'], ['Javelin', 'M/T', '1d6', '1d6', '20/40/60', '2', '4'],
    ['Spear', 'M/T', '1d6', '1d8', '20/40/60', '5', '6'], ['Short Sword', 'M', '1d6', '1d8', '-', '3', '3'], ['Long Sword', 'M', '1d8', '1d12', '-', '4', '5'], ['Bastard Sword', 'M', '2d4', '2d8', '-', '6', '8'],
    ['Two-Handed Sword', 'M', '1d10', '3d6', '-', '15', '10'], ['Scimitar', 'M', '1d8', '1d8', '-', '4', '4'], ['Sabre', 'M', '1d6', '1d8', '-', '3', '4'], ['Broad Sword', 'M', '2d4', '1d6+1', '-', '4', '6'],
    ['Falchion', 'M', '2d4', '2d4', '-', '15', '8'], ['Rapier', 'M', '1d6', '1d4', '-', '2', '3'], ['Mace', 'M', '1d6+1', '1d6', '-', '8', '7'], ['Morning Star', 'M', '2d4', '1d6+1', '-', '6', '7'],
    ['Flail', 'M', '1d6+1', '2d4', '-', '15', '7'], ['War Hammer', 'M/T', '1d4+1', '1d4', '10/20/30', '5', '4'], ['Quarterstaff', 'M', '1d6', '1d6', '-', '4', '4'], ['Halberd', 'M', '1d10', '2d6', '-', '15', '9'],
    ['Polearm', 'M', '1d6', '1d6', '-', '15', '7'], ['Glaive', 'M', '1d6', '1d10', '-', '8', '8'], ['Trident', 'M/T', '1d6+1', '3d4', '10/20/30', '5', '7'], ['Bow, Short', 'M', '1d6', '1d6', '50/100/150', '2', '6'],
    ['Bow, Long', 'M', '1d6', '1d6', '70/140/210', '3', '7'], ['Composite Short Bow', 'M', '1d6', '1d6', '50/100/150', '3', '6'], ['Composite Long Bow', 'M', '1d6', '1d6', '70/140/210', '4', '7'],
    ['Crossbow, Light', 'M', '1d4+1', '1d4+1', '60/120/180', '5', '7'], ['Crossbow, Heavy', 'M', '1d6+1', '1d10+1', '80/160/240', '16', '10'], ['Crossbow, Hand', 'M', '1d3', '1d2', '20/40/60', '3', '4'], ['Sling', 'M', '1d4', '1d6', '40/80/160', '0', '6'], ['Dart', 'T', '1d3', '1d2', '15/30/60', '0.25', '2']
];

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
        const attackAdjustment = Number.parseInt(weapon?.attackAdj, 10) || 0;
        const thac0Adjustment = Number.parseInt(weapon?.thac0Adj, 10) || 0;
        output.textContent = Number.isInteger(base) && weapon?.equipped !== false ? base - attackAdjustment + thac0Adjustment : '-';
    });
}

function setupWeaponSection() {
    const section = [...document.querySelectorAll('.grid > .card')].find(card => card.querySelector(':scope > h2')?.textContent.includes('Weapons'));
    if (!section) return;
    section.innerHTML = `<h2>Weapons</h2><div class="weapon-best-thac0">Best equipped THAC0: <output>-</output></div><div class="tableWrap"><table class="weapons-table"><thead><tr><th>Active</th><th>Weapon</th><th>AT</th><th>Attack adj</th><th>Damage adj</th><th>THAC0 adj</th><th>Damage S/M</th><th>Damage L</th><th>Range</th><th>Weight</th><th>Speed</th><th>THAC0</th><th></th></tr></thead><tbody>${weaponRowsHTML()}</tbody></table></div><button type="button" class="add" data-weapon-add>Add weapon</button><small class="weapon-key">M = melee, T = thrown, M/T = melee or thrown. Positive attack adjustments improve THAC0.</small>`;
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
    document.querySelector('.grid').append(section);
}

function setupSpellSectionPosition() {
    const combat = [...document.querySelectorAll('.grid > .card')].find(card => card.querySelector(':scope > h2')?.textContent.includes('Combat'));
    const spells = [...document.querySelectorAll('.grid > .card')].find(card => card.querySelector(':scope > h2')?.textContent.includes('Spells'));
    if (combat && spells) combat.after(spells);
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

function render() {
    document.querySelector('#app').innerHTML = `<section class="hero"><div class="card wide"><h1>Advanced Dungeons & Dragons 2e</h1>${fields('identity',[['name','Character name'],['player','Player'],['className','Class'],['level','Level'],['race','Race'],['alignment','Alignment'],['xp','Experience'],['nextLevel','Next level'],['deity','Deity']])}</div><img class="portrait" src="${esc(data.portraitUrl)||'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22180%22%3E%3Crect width=%22100%25%22 height=%22100%25%22 fill=%22%23e9dfcc%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%23756b5d%22%3EPortrait URL%3C/text%3E%3C/svg%3E'}"></section><div class="grid"><section class="card wide"><h2>Abilities</h2><div class="stats">${Object.keys(labels).map(k=>`<div class="stat"><label>${labels[k]}</label><input data-section="abilities" data-key="${k}" value="${esc(data.abilities[k])}"></div>`).join('')}</div></section><section class="card half"><h2>Combat</h2>${fields('combat',[['hpMax','HP max'],['hpCurrent','HP current'],['ac','Armor class'],['thac0','THAC0'],['initiative','Initiative'],['movement','Movement'],['surprisedAc','Surprised AC'],['shieldlessAc','Shieldless AC'],['rearAc','Rear AC']])}</section><section class="card half"><h2>Saving throws</h2>${fields('saves',[['paralyzationPoison','Paralyzation / Poison'],['rodStaffWand','Rod / Staff / Wand'],['petrificationPolymorph','Petrification / Polymorph'],['breathWeapon','Breath Weapon'],['spell','Spell']])}</section><section class="card wide"><h2>Weapons</h2>${table('weapons',[['name','Weapon'],['attacks','AT'],['attackAdj','Attack adj'],['damageAdj','Damage adj'],['thac0','THAC0'],['damage','Damage S/M-L'],['range','Range'],['weight','Weight'],['speed','Speed']])}</section><section class="card half"><h2>Proficiencies</h2>${table('proficiencies',[['name','Name'],['slots','Slots'],['score','Score'],['type','Type']])}</section><section class="card half"><h2>Currency</h2>${fields('currency',[['platinum','Platinum'],['gold','Gold'],['electrum','Electrum'],['silver','Silver'],['copper','Copper'],['gems','Gems']])}</section><section class="card wide"><h2>Inventory</h2>${table('inventory',[['item','Item'],['location','Location'],['quantity','Qty'],['weight','Weight']])}</section><section class="card wide"><h2>Spells</h2>${table('spells',[['name','Spell'],['level','Level'],['school','School'],['memorized','Memorized'],['notes','Notes']])}</section><section class="card half"><h2>Special abilities</h2><textarea data-root="specialAbilities">${esc(data.specialAbilities)}</textarea></section><section class="card half"><h2>Notes</h2><textarea data-root="notes">${esc(data.notes)}</textarea><div class="field"><label>Portrait image URL (optional)</label><input data-root="portraitUrl" value="${esc(data.portraitUrl)}"></div></section></div>`;
    document.querySelectorAll('.stat').forEach((stat, index) => {
        const ability = Object.keys(labels)[index];
        const output = document.createElement('output');
        output.className = 'modifier';
        output.dataset.modifier = ability;
        output.textContent = attributeBonus(ability, data.abilities[ability]);
        stat.dataset.tooltip = abilityTooltip(ability, data.abilities[ability]);
        stat.setAttribute('tabindex', '0');
        stat.append(output);
        createCarousel(stat, ability);
    });
    setupClassInputs();
    updateThac0();
    setupRaceSystem();
    setupAbilitySummary();
    setupHitPointsSection();
    updateSavingThrows();
    setupMovementSection();
    setupClassAbilitiesSection();
    setupHenchmenSection();
    setupActionReferenceSection();
    setupThac0ReferenceSection();
    setupAcReferenceSection();
    setupClassRequirementsReferenceSection();
    setupAcSection();
    setupWeaponSection();
    setupSpellSectionPosition();
    setupAbilityTooltips();
    setupCharacterHeader();
    setupSectionToggles();
    setupTableOfContents();
    bind()
}

function changed() {
    localStorage.setItem('adnd2e-sheet-v1', JSON.stringify(data));
    document.querySelector('#status').textContent = 'Saved locally at ' + new Date().toLocaleTimeString()
}

function syncToolbarOffset() {
    const toolbar = document.querySelector('.toolbar');
    if (toolbar) document.body.style.paddingTop = `${toolbar.offsetHeight}px`;
}

window.addEventListener('resize', syncToolbarOffset);
syncToolbarOffset();
const navPin = document.querySelector('#navPinBtn');
navPin.onclick = () => {
    const toolbar = document.querySelector('.toolbar');
    const collapsed = toolbar.classList.toggle('toolbar-nav-collapsed');
    navPin.classList.toggle('tooltip-pin-muted', collapsed);
    navPin.setAttribute('aria-pressed', String(collapsed));
    navPin.setAttribute('aria-label', `${collapsed ? 'Show' : 'Hide'} navigation bar`);
    navPin.title = `${collapsed ? 'Show' : 'Hide'} navigation bar`;
    syncToolbarOffset();
};

function bind() {
    document.querySelectorAll('[data-section]').forEach(e => e.oninput = () => {
        data[e.dataset.section][e.dataset.key] = e.value;
        if (e.dataset.section === 'abilities') {
            updateCarousel(e.parentElement, e.dataset.key, e.value);
            e.parentElement.dataset.tooltip = abilityTooltip(e.dataset.key, e.value);
            e.parentElement.querySelector('.stat-tooltip-text').innerHTML = abilityTooltipTable(e.dataset.key, e.value);
            document.querySelector('.ability-total').textContent = `Total: ${abilityTotal()}`;
            updateAbilitySummary();
            if (e.dataset.key === 'dex') updateAcTotal();
            updateClassRequirementNotice();
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
        }
        if (e.dataset.section === 'combat' && e.dataset.key === 'movement') updateMovementSection();
        changed()
    });
    document.querySelectorAll('[data-root]').forEach(e => e.oninput = () => {
        data[e.dataset.root] = e.value;
        changed()
    });
    document.querySelectorAll('[data-array]').forEach(e => e.oninput = () => {
        data[e.dataset.array][+e.dataset.index][e.dataset.key] = e.value;
        changed()
    });
    document.querySelectorAll('[data-bonus-prev], [data-bonus-next]').forEach(button => button.onclick = () => {
        const ability = button.dataset.bonusPrev || button.dataset.bonusNext;
        const direction = button.dataset.bonusNext ? 1 : -1;
        const total = bonusViews[ability].length;
        bonusIndex[ability] = ((bonusIndex[ability] || 0) + direction + total) % total;
        updateCarousel(button.closest('.stat'), ability, data.abilities[ability]);
    });
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
                type: ''
            },
            inventory: {
                item: '',
                location: '',
                quantity: '',
                weight: ''
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
try {
    data = normalize(JSON.parse(localStorage.getItem('adnd2e-sheet-v1') || '{}'))
} catch {}
render();