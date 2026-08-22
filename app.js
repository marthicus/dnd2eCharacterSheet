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
    combat: {
        hpMax: '',
        hpCurrent: '',
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
    proficiencies: [],
    inventory: [],
    spells: [],
    specialAbilities: '',
    notes: ''
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
    for (const section of ['identity', 'abilities', 'combat', 'saves', 'currency']) Object.assign(d[section], x[section] || {});
    for (const k of ['portraitUrl', 'specialAbilities', 'notes']) d[k] = typeof x[k] === 'string' ? x[k] : '';
    for (const k of ['weapons', 'proficiencies', 'inventory', 'spells']) d[k] = Array.isArray(x[k]) ? x[k] : [];
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

function fields(section, names) {
    return `<div class="fields">${names.map(([k,l])=>`<div class="field"><label>${l}</label><input data-section="${section}" data-key="${k}" value="${esc(data[section][k])}"></div>`).join('')}</div>`
}

function table(key, cols) {
    return `<div class="tableWrap"><table><thead><tr>${cols.map(c=>`<th>${c[1]}</th>`).join('')}<th></th></tr></thead><tbody>${data[key].map((r,i)=>`<tr>${cols.map(c=>`<td><input data-array="${key}" data-index="${i}" data-key="${c[0]}" value="${esc(r[c[0]])}"></td>`).join('')}<td><button class="remove" data-remove="${key}" data-index="${i}">×</button></td></tr>`).join('')}</tbody></table></div><button class="add" data-add="${key}">Add row</button>`
}

function render() {
    document.querySelector('#app').innerHTML = `<section class="hero"><div class="card wide"><h1>Advanced Dungeons & Dragons 2e</h1>${fields('identity',[['name','Character name'],['player','Player'],['className','Class'],['level','Level'],['race','Race'],['alignment','Alignment'],['xp','Experience'],['nextLevel','Next level'],['deity','Deity']])}</div><img class="portrait" src="${esc(data.portraitUrl)||'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22180%22%3E%3Crect width=%22100%25%22 height=%22100%25%22 fill=%22%23e9dfcc%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%23756b5d%22%3EPortrait URL%3C/text%3E%3C/svg%3E'}"></section><div class="grid"><section class="card wide"><h2>Abilities</h2><div class="stats">${Object.keys(labels).map(k=>`<div class="stat"><label>${labels[k]}</label><input data-section="abilities" data-key="${k}" value="${esc(data.abilities[k])}"></div>`).join('')}</div></section><section class="card half"><h2>Combat</h2>${fields('combat',[['hpMax','HP max'],['hpCurrent','HP current'],['ac','Armor class'],['thac0','THAC0'],['initiative','Initiative'],['movement','Movement'],['surprisedAc','Surprised AC'],['shieldlessAc','Shieldless AC'],['rearAc','Rear AC']])}</section><section class="card half"><h2>Saving throws</h2>${fields('saves',[['paralyzationPoison','Paralyzation / Poison'],['rodStaffWand','Rod / Staff / Wand'],['petrificationPolymorph','Petrification / Polymorph'],['breathWeapon','Breath Weapon'],['spell','Spell']])}</section><section class="card wide"><h2>Weapons</h2>${table('weapons',[['name','Weapon'],['attacks','AT'],['attackAdj','Attack adj'],['damageAdj','Damage adj'],['thac0','THAC0'],['damage','Damage S/M-L'],['range','Range'],['weight','Weight'],['speed','Speed']])}</section><section class="card half"><h2>Proficiencies</h2>${table('proficiencies',[['name','Name'],['slots','Slots'],['score','Score'],['type','Type']])}</section><section class="card half"><h2>Currency</h2>${fields('currency',[['platinum','Platinum'],['gold','Gold'],['electrum','Electrum'],['silver','Silver'],['copper','Copper'],['gems','Gems']])}</section><section class="card wide"><h2>Inventory</h2>${table('inventory',[['item','Item'],['location','Location'],['quantity','Qty'],['weight','Weight']])}</section><section class="card wide"><h2>Spells</h2>${table('spells',[['name','Spell'],['level','Level'],['school','School'],['memorized','Memorized'],['notes','Notes']])}</section><section class="card half"><h2>Special abilities</h2><textarea data-root="specialAbilities">${esc(data.specialAbilities)}</textarea></section><section class="card half"><h2>Notes</h2><textarea data-root="notes">${esc(data.notes)}</textarea><div class="field"><label>Portrait image URL (optional)</label><input data-root="portraitUrl" value="${esc(data.portraitUrl)}"></div></section></div>`;
    bind()
}

function changed() {
    localStorage.setItem('adnd2e-sheet-v1', JSON.stringify(data));
    document.querySelector('#status').textContent = 'Saved locally at ' + new Date().toLocaleTimeString()
}

function bind() {
    document.querySelectorAll('[data-section]').forEach(e => e.oninput = () => {
        data[e.dataset.section][e.dataset.key] = e.value;
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
    document.querySelectorAll('[data-add]').forEach(b => b.onclick = () => {
        const templates = {
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
try {
    data = normalize(JSON.parse(localStorage.getItem('adnd2e-sheet-v1') || '{}'))
} catch {}
render();