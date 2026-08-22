const SCHEMA_VERSION = 1;
const FIXED = {
    schemaVersion: SCHEMA_VERSION,
    identity: {
        name: '',
        player: '',
        alignment: '',
        race: '',
        className: '',
        level: '',
        xp: '',
        nextLevel: '',
        deity: ''
    },
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
    for (const k of ['portraitUrl', 'specialAbilities', 'wounds', 'notes']) d[k] = typeof x[k] === 'string' ? x[k] : '';
    d.sectionStates = x.sectionStates && typeof x.sectionStates === 'object' && !Array.isArray(x.sectionStates) ? x.sectionStates : {};
    for (const k of ['weapons', 'henchmen', 'proficiencies', 'inventory', 'spells']) d[k] = Array.isArray(x[k]) ? x[k] : [];
    for (const k of ['thiefSkills', 'undeadTurning', 'spellLevels']) d[k] = Array.isArray(x[k]) && x[k].length ? x[k] : d[k];
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
    details.innerHTML = `<h2>Character details</h2>${fields('details', [['age', 'Age'], ['gender', 'Gender'], ['height', 'Height'], ['build', 'Build'], ['complexion', 'Complexion'], ['hair', 'Hair'], ['eyes', 'Eyes'], ['birthplace', 'Birthplace']])}<div class="detail-notes"><label>Personality</label><textarea data-section="details" data-key="personality">${esc(data.details.personality)}</textarea><label>Appearance</label><textarea data-section="details" data-key="appearance">${esc(data.details.appearance)}</textarea><label>Background</label><textarea data-section="details" data-key="background">${esc(data.details.background)}</textarea><label>Goals</label><textarea data-section="details" data-key="goals">${esc(data.details.goals)}</textarea><label>Fears</label><textarea data-section="details" data-key="fears">${esc(data.details.fears)}</textarea><label>Allies</label><textarea data-section="details" data-key="allies">${esc(data.details.allies)}</textarea><label>Enemies</label><textarea data-section="details" data-key="enemies">${esc(data.details.enemies)}</textarea></div>`;
    document.querySelector('.grid').after(details);

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
        const id = `section-${index}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
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
        [4, 'Hit -2; damage -1; weight 10; max press 20; open doors 3; bend bars 0%'],
        [6, 'Hit -1; damage None; weight 20; max press 55; open doors 4; bend bars 0%'],
        [8, 'Hit Normal; damage None; weight 35; max press 90; open doors 5; bend bars 1%'],
        [10, 'Hit Normal; damage None; weight 40; max press 110; open doors 6; bend bars 2%'],
        [12, 'Hit Normal; damage None; weight 45; max press 140; open doors 7; bend bars 4%'],
        [14, 'Hit Normal; damage None; weight 55; max press 170; open doors 8; bend bars 7%'],
        [16, 'Hit +1; damage +1; weight 70; max press 195; open doors 9; bend bars 10%'],
        [17, 'Hit +1; damage +1; weight 85; max press 220; open doors 10; bend bars 13%'],
        [18, 'Exceptional Strength 18/01-00 changes hit, damage, max press, and bend bars; enter the percentile as 18/xx'],
        [19, 'Hit +3; damage +7; weight 485; max press 640; open doors 16(8); bend bars 50% (Hill Giant)'],
        [21, 'Hit +4; damage +8; weight 535; max press 700; open doors 17(10); bend bars 60% (Stone Giant)'],
        [22, 'Hit +5; damage +9; weight 635; max press 810; open doors 17(12); bend bars 70% (Frost Giant)'],
        [23, 'Hit +5; damage +10; weight 785; max press 970; open doors 18(14); bend bars 80% (Fire Giant)'],
        [24, 'Hit +5; damage +11; weight 935; max press 1,130; open doors 18(16); bend bars 90% (Cloud Giant)'],
        [25, 'Hit +7; damage +14; weight 1,535; max press 1,750; open doors 19(17); bend bars 99% (Titan)']
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
    return `<p class="tooltip-intro">Ability scores show strengths and weaknesses; class, race, and roleplay also matter.</p><table class="tooltip-table"><thead><tr><th scope="col">Score</th>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
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
    document.querySelector('.grid > .card').after(section);
}

function setupHitPointsSection() {
    const section = document.createElement('section');
    section.className = 'card wide hit-points-section';
    section.innerHTML = `<h2>Hit points and wounds</h2><div class="hit-points-layout"><div class="hit-points-fields"><div class="hp-heart" aria-live="polite"><span class="heart-symbol" aria-hidden="true">♥</span><strong class="hp-total">0 / 0</strong><small>Total HP</small></div>${fields('combat', [['hpMax', 'Maximum'], ['hpCurrent', 'Current'], ['hpBonus', 'Bonus']])}<div class="hp-actions"><label>Amount</label><input class="hp-action-amount" type="number" min="0" step="1" value="1"><button type="button" class="hp-action" data-hp-action="damage">Take damage</button><button type="button" class="hp-action" data-hp-action="heal">Heal</button></div></div><div class="wounds-field"><label>Wounds</label><textarea data-root="wounds">${esc(data.wounds)}</textarea></div></div>`;
    section.querySelectorAll('[data-hp-action]').forEach(button => button.onclick = () => {
        const amount = Math.max(0, Number.parseInt(section.querySelector('.hp-action-amount').value, 10) || 0);
        let bonus = Math.max(0, Number.parseInt(data.combat.hpBonus, 10) || 0);
        let current = Math.max(0, Number.parseInt(data.combat.hpCurrent, 10) || 0);
        if (button.dataset.hpAction === 'damage') {
            const bonusDamage = Math.min(bonus, amount);
            bonus -= bonusDamage;
            current = Math.max(0, current - (amount - bonusDamage));
        } else {
            const maximum = Math.max(0, Number.parseInt(data.combat.hpMax, 10) || 0);
            current = Math.min(maximum, current + amount);
        }
        data.combat.hpBonus = String(bonus);
        data.combat.hpCurrent = String(current);
        section.querySelector('[data-key="hpBonus"]').value = data.combat.hpBonus;
        section.querySelector('[data-key="hpCurrent"]').value = data.combat.hpCurrent;
        updateHitPointDisplay();
        changed();
    });
    document.querySelector('.ability-summary').after(section);
    updateHitPointDisplay();
}

function movementRate(base, multiplier) {
    const value = Number.parseInt(base, 10);
    return Number.isInteger(value) && value >= 0 ? Math.floor(value * multiplier) : '-';
}

function setupMovementSection() {
    const section = document.createElement('section');
    section.className = 'card wide movement-section';
    section.innerHTML = `<h2>Movement speed</h2><div class="movement-layout"><div class="movement-base"><label>Base rate</label><input data-section="combat" data-key="movement" value="${esc(data.combat.movement)}" inputmode="numeric"><small>Adjust for race, class, armor, and encumbrance as needed.</small></div><table class="movement-table"><thead><tr><th>Rate</th><th>Multiplier</th><th>Speed</th></tr></thead><tbody><tr><th>Light</th><td>2/3</td><td data-movement-rate="light"></td></tr><tr><th>Moderate</th><td>1/2</td><td data-movement-rate="moderate"></td></tr><tr><th>Heavy</th><td>1/3</td><td data-movement-rate="heavy"></td></tr><tr><th>Severe</th><td>1/6</td><td data-movement-rate="severe"></td></tr><tr><th>Jog</th><td>×2</td><td data-movement-rate="jog"></td></tr><tr><th>Run</th><td>×3</td><td data-movement-rate="run3"></td></tr><tr><th>Run</th><td>×4</td><td data-movement-rate="run4"></td></tr><tr><th>Run</th><td>×5</td><td data-movement-rate="run5"></td></tr></tbody></table></div>`;
    document.querySelector('.hit-points-section').after(section);
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

function updateHitPointDisplay() {
    const display = document.querySelector('.hp-total');
    if (!display) return;
    const maximum = Math.max(0, Number.parseInt(data.combat.hpMax, 10) || 0);
    const current = Math.max(0, Number.parseInt(data.combat.hpCurrent, 10) || 0);
    const bonus = Math.max(0, Number.parseInt(data.combat.hpBonus, 10) || 0);
    display.textContent = `${current + bonus} / ${maximum + bonus}`;
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
    setupAbilitySummary();
    setupHitPointsSection();
    setupMovementSection();
    setupClassAbilitiesSection();
    setupHenchmenSection();
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
        }
        if (e.dataset.section === 'combat' && ['hpMax', 'hpCurrent', 'hpBonus'].includes(e.dataset.key)) updateHitPointDisplay();
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
                attacks: '',
                attackAdj: '',
                damageAdj: '',
                thac0: '',
                damage: '',
                range: '',
                weight: '',
                speed: ''
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