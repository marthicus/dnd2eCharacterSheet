const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const catalogPath = path.join(__dirname, '..', 'data', 'language-catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const languageRules = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'languages.json'), 'utf8'));
const languages = catalog.languages;
const validCategories = new Set(['common', 'racial', 'humanoid', 'secret-tongue']);

function validateLanguageCatalog(records) {
    const ids = new Set();
    return records.flatMap((record, index) => {
        const label = record.id || `Record ${index + 1}`;
        const errors = [];
        if (!record.id || ids.has(record.id)) errors.push(`${label}: duplicate or missing ID.`);
        ids.add(record.id);
        if (!validCategories.has(record.category)) errors.push(`${label}: invalid category.`);
        if (!record.source) errors.push(`${label}: source is required.`);
        return errors;
    });
}

function languageLookup(id) {
    return languages.find(language => language.id === id) || null;
}

function filterLanguages({ category = '', source = '', literacySupported } = {}) {
    return languages.filter(language => (!category || language.category === category) && (!source || language.source === source) && (literacySupported === undefined || language.literacySupported === literacySupported));
}

test('catalog loads the supplied records', () => {
    assert.equal(languages.length, 10);
    assert.equal(catalog.schemaVersion, 1);
});

test('duplicate IDs are rejected', () => {
    const duplicate = [...languages, { ...languages[0] }];
    assert.match(validateLanguageCatalog(duplicate).join('\n'), /duplicate or missing ID/);
});

test('language lookup finds records by ID', () => {
    assert.equal(languageLookup('dwarven').name, 'Dwarven');
    assert.equal(languageLookup('missing'), null);
});

test('filters languages by category', () => {
    assert.deepEqual(filterLanguages({ category: 'racial' }).map(language => language.id), ['dwarven', 'elven', 'gnomish', 'halfling']);
});

test('filters languages by literacy support', () => {
    assert.deepEqual(filterLanguages({ literacySupported: false }).map(language => language.id), ['orc', 'goblin', 'hobgoblin', 'kobold', 'druidic']);
});

test('filters languages by source', () => {
    assert.deepEqual(filterLanguages({ source: 'PHBR10' }).map(language => language.id), ['orc', 'goblin', 'hobgoblin', 'kobold']);
});

test('Intelligence 6 grants no bonus languages', () => {
    assert.equal(languageRules.intelligenceBonusLanguages[5], 0);
});
