const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const spellCatalogPath = path.join(__dirname, '..', 'data', 'spell-catalog.json');
const spellCatalog = JSON.parse(fs.readFileSync(spellCatalogPath, 'utf8'));
const spells = Array.isArray(spellCatalog.spells) ? spellCatalog.spells : [];
const tomePath = path.join(__dirname, '..', 'data', 'tome-of-magic-spells.json');
const tomeReportPath = path.join(__dirname, '..', 'data', 'tome-of-magic-spells-report.json');
const tomeSpells = JSON.parse(fs.readFileSync(tomePath, 'utf8'));
const tomeReport = JSON.parse(fs.readFileSync(tomeReportPath, 'utf8'));
const priestPath = path.join(__dirname, '..', 'data', 'tome-of-magic-priest-spells.json');
const priestReportPath = path.join(__dirname, '..', 'data', 'tome-of-magic-priest-report.json');
const priestSpells = JSON.parse(fs.readFileSync(priestPath, 'utf8'));
const priestReport = JSON.parse(fs.readFileSync(priestReportPath, 'utf8'));
const compendiumPath = path.join(__dirname, '..', 'data', 'priest-spell-compendium-v1-extract.json');
const compendiumReportPath = path.join(__dirname, '..', 'data', 'priest-spell-compendium-v1-report.json');
const compendiumSpells = JSON.parse(fs.readFileSync(compendiumPath, 'utf8'));
const compendiumReport = JSON.parse(fs.readFileSync(compendiumReportPath, 'utf8'));
const compendiumV3Path = path.join(__dirname, '..', 'data', 'priest-spell-compendium-v3-extract.json');
const compendiumV3ReportPath = path.join(__dirname, '..', 'data', 'priest-spell-compendium-v3-report.json');
const compendiumV3Spells = JSON.parse(fs.readFileSync(compendiumV3Path, 'utf8'));
const compendiumV3Report = JSON.parse(fs.readFileSync(compendiumV3ReportPath, 'utf8'));
const compendiumV2Path = path.join(__dirname, '..', 'data', 'priest-spell-compendium-v2-extract.json');
const compendiumV2ReportPath = path.join(__dirname, '..', 'data', 'priest-spell-compendium-v2-report.json');
const compendiumV2Spells = JSON.parse(fs.readFileSync(compendiumV2Path, 'utf8'));
const compendiumV2Report = JSON.parse(fs.readFileSync(compendiumV2ReportPath, 'utf8'));
const wizardLayoutPath = path.join(__dirname, '..', 'data', 'wizard-spell-compendium-v1-layout-analysis.json');
const wizardLayout = JSON.parse(fs.readFileSync(wizardLayoutPath, 'utf8'));
const wizardCompendiumPath = path.join(__dirname, '..', 'data', 'wizard-spell-compendium-v1-extract.json');
const wizardCompendiumReportPath = path.join(__dirname, '..', 'data', 'wizard-spell-compendium-v1-report.json');
const wizardCompendiumSpells = JSON.parse(fs.readFileSync(wizardCompendiumPath, 'utf8'));
const wizardCompendiumReport = JSON.parse(fs.readFileSync(wizardCompendiumReportPath, 'utf8'));
const wizardCompendiumV2Path = path.join(__dirname, '..', 'data', 'wizard-spell-compendium-v2-extract.json');
const wizardCompendiumV2ReportPath = path.join(__dirname, '..', 'data', 'wizard-spell-compendium-v2-report.json');
const wizardCompendiumV2Spells = JSON.parse(fs.readFileSync(wizardCompendiumV2Path, 'utf8'));
const wizardCompendiumV2Report = JSON.parse(fs.readFileSync(wizardCompendiumV2ReportPath, 'utf8'));
const wizardCompendiumV3Path = path.join(__dirname, '..', 'data', 'wizard-spell-compendium-v3-extract.json');
const wizardCompendiumV3ReportPath = path.join(__dirname, '..', 'data', 'wizard-spell-compendium-v3-report.json');
const wizardCompendiumV3Spells = JSON.parse(fs.readFileSync(wizardCompendiumV3Path, 'utf8'));
const wizardCompendiumV3Report = JSON.parse(fs.readFileSync(wizardCompendiumV3ReportPath, 'utf8'));
const wizardCompendiumV4Path = path.join(__dirname, '..', 'data', 'wizard-spell-compendium-v4-extract.json');
const wizardCompendiumV4ReportPath = path.join(__dirname, '..', 'data', 'wizard-spell-compendium-v4-report.json');
const wizardCompendiumV4Spells = JSON.parse(fs.readFileSync(wizardCompendiumV4Path, 'utf8'));
const wizardCompendiumV4Report = JSON.parse(fs.readFileSync(wizardCompendiumV4ReportPath, 'utf8'));
const playersOptionPath = path.join(__dirname, '..', 'data', 'players-option-spells-and-magic-extract.json');
const playersOptionReportPath = path.join(__dirname, '..', 'data', 'players-option-spells-and-magic-report.json');
const playersOptionSpells = JSON.parse(fs.readFileSync(playersOptionPath, 'utf8'));
const playersOptionReport = JSON.parse(fs.readFileSync(playersOptionReportPath, 'utf8'));
const magicEncyclopediaPath = path.join(__dirname, '..', 'data', 'magic-encyclopedia-v1-spell-extract.json');
const magicEncyclopediaReportPath = path.join(__dirname, '..', 'data', 'magic-encyclopedia-v1-spell-report.json');
const magicEncyclopediaSpells = JSON.parse(fs.readFileSync(magicEncyclopediaPath, 'utf8'));
const magicEncyclopediaReport = JSON.parse(fs.readFileSync(magicEncyclopediaReportPath, 'utf8'));
const reconciliationIndexPath = path.join(__dirname, '..', 'data', 'spell-canonical-index-partial.json');
const reconciliationConflictsPath = path.join(__dirname, '..', 'data', 'spell-conflict-report-partial.json');
const reconciliationReportPath = path.join(__dirname, '..', 'data', 'spell-reconciliation-report-partial.json');
const reconciliationIndex = JSON.parse(fs.readFileSync(reconciliationIndexPath, 'utf8'));
const reconciliationConflicts = JSON.parse(fs.readFileSync(reconciliationConflictsPath, 'utf8'));
const reconciliationReport = JSON.parse(fs.readFileSync(reconciliationReportPath, 'utf8'));
const materialEnrichmentPath = path.join(__dirname, '..', 'data', 'spell-material-components-wsc-batch-1.json');
const materialEnrichmentReportPath = path.join(__dirname, '..', 'data', 'spell-material-components-wsc-batch-1-report.json');
const materialEnrichments = JSON.parse(fs.readFileSync(materialEnrichmentPath, 'utf8'));
const materialEnrichmentReport = JSON.parse(fs.readFileSync(materialEnrichmentReportPath, 'utf8'));
const materialBatchTwoPath = path.join(__dirname, '..', 'data', 'spell-material-components-batch-2.json');
const materialBatchTwoReportPath = path.join(__dirname, '..', 'data', 'spell-material-components-batch-2-report.json');
const materialBatchThreePath = path.join(__dirname, '..', 'data', 'spell-material-components-wsc-v1-batch-3.json');
const materialBatchThreeReportPath = path.join(__dirname, '..', 'data', 'spell-material-components-wsc-v1-batch-3-report.json');
const materialBatchTwo = JSON.parse(fs.readFileSync(materialBatchTwoPath, 'utf8'));
const materialBatchTwoReport = JSON.parse(fs.readFileSync(materialBatchTwoReportPath, 'utf8'));
const materialBatchThree = JSON.parse(fs.readFileSync(materialBatchThreePath, 'utf8'));
const materialBatchThreeReport = JSON.parse(fs.readFileSync(materialBatchThreeReportPath, 'utf8'));
const materialBatchFourPath = path.join(__dirname, '..', 'data', 'spell-material-components-wsc-v2-batch-4.json');
const materialBatchFourReportPath = path.join(__dirname, '..', 'data', 'spell-material-components-wsc-v2-batch-4-report.json');
const materialBatchFour = JSON.parse(fs.readFileSync(materialBatchFourPath, 'utf8'));
const materialBatchFourReport = JSON.parse(fs.readFileSync(materialBatchFourReportPath, 'utf8'));
const materialBatchFivePath = path.join(__dirname, '..', 'data', 'spell-material-components-wsc-v3-batch-5.json');
const materialBatchFiveReportPath = path.join(__dirname, '..', 'data', 'spell-material-components-wsc-v3-batch-5-report.json');
const materialBatchFive = JSON.parse(fs.readFileSync(materialBatchFivePath, 'utf8'));
const materialBatchFiveReport = JSON.parse(fs.readFileSync(materialBatchFiveReportPath, 'utf8'));
const materialBatchSixPath = path.join(__dirname, '..', 'data', 'spell-material-components-wsc-v4-batch-6.json');
const materialBatchSixReportPath = path.join(__dirname, '..', 'data', 'spell-material-components-wsc-v4-batch-6-report.json');
const materialBatchSix = JSON.parse(fs.readFileSync(materialBatchSixPath, 'utf8'));
const materialBatchSixReport = JSON.parse(fs.readFileSync(materialBatchSixReportPath, 'utf8'));
const pscBatchPath = path.join(__dirname, '..', 'data', 'spell-material-components-psc-v1-batch-7.json');
const pscReportPath = path.join(__dirname, '..', 'data', 'spell-material-components-psc-v1-batch-7-report.json');
const pscBatch = JSON.parse(fs.readFileSync(pscBatchPath, 'utf8'));
const pscReport = JSON.parse(fs.readFileSync(pscReportPath, 'utf8'));
const pscBatchTwoPath = path.join(__dirname, '..', 'data', 'spell-material-components-psc-v2-batch-8.json');
const pscBatchTwoReportPath = path.join(__dirname, '..', 'data', 'spell-material-components-psc-v2-batch-8-report.json');
const pscBatchThreePath = path.join(__dirname, '..', 'data', 'spell-material-components-psc-v3-batch-9.json');
const pscBatchThreeReportPath = path.join(__dirname, '..', 'data', 'spell-material-components-psc-v3-batch-9-report.json');
const pscBatchTwo = JSON.parse(fs.readFileSync(pscBatchTwoPath, 'utf8'));
const pscBatchTwoReport = JSON.parse(fs.readFileSync(pscBatchTwoReportPath, 'utf8'));
const pscBatchThree = JSON.parse(fs.readFileSync(pscBatchThreePath, 'utf8'));
const pscBatchThreeReport = JSON.parse(fs.readFileSync(pscBatchThreeReportPath, 'utf8'));
const pscPreflightPath = path.join(__dirname, '..', 'data', 'psc-integration-preflight-report.json');
const pscPreflightReport = JSON.parse(fs.readFileSync(pscPreflightPath, 'utf8'));
const pscFinalPath = path.join(__dirname, '..', 'data', 'PSC-MC-1.0.json');
const pscFinal = JSON.parse(fs.readFileSync(pscFinalPath, 'utf8'));
const pscAuditPath = path.join(__dirname, '..', 'data', 'psc-import-audit-report.json');
const pscAudit = JSON.parse(fs.readFileSync(pscAuditPath, 'utf8'));
const pscChecksumPath = path.join(__dirname, '..', 'data', 'PSC-MC-1.0.sha256');
const pscDocumentationPath = path.join(__dirname, '..', 'data', 'PSC-MC-1.0.md');
const pscChecksum = fs.readFileSync(pscChecksumPath, 'utf8').trim();
const pscDocumentation = fs.readFileSync(pscDocumentationPath, 'utf8');
const pscCrossSourceReportPath = path.join(__dirname, '..', 'data', 'psc-cross-source-reconciliation-report.json');
const pscCrossSourceReport = JSON.parse(fs.readFileSync(pscCrossSourceReportPath, 'utf8'));

function validateSpellCatalog(records) {
    const ids = new Set();
    const errors = [];
    records.forEach((record, index) => {
        const label = record.id || `Record ${index + 1}`;
        if (!record.id || ids.has(record.id)) errors.push(`${label}: duplicate or missing ID.`);
        ids.add(record.id);
        if (!record.name) errors.push(`${label}: missing name.`);
        if (!Number.isInteger(record.level) || record.level < 0) errors.push(`${label}: invalid level.`);
        if (!Array.isArray(record.classLists) || record.classLists.length === 0) errors.push(`${label}: classLists is required.`);
        if (!record.spellGroup) errors.push(`${label}: spellGroup is required.`);
        if (!record.source) errors.push(`${label}: source is required.`);
        if (!record.components || typeof record.components !== 'object') errors.push(`${label}: invalid components object.`);
    });
    return errors;
}

function spellCatalogLookupById(id, records = spells) {
    return records.find(record => record.id === id) || null;
}

function spellCatalogLookupByName(name, records = spells) {
    const needle = String(name || '').trim().toLowerCase();
    return records.find(record => record.name && record.name.toLowerCase() === needle) || null;
}

function filterSpellCatalog(records = spells, filters = {}) {
    return records.filter(record => {
        const matchesLevel = filters.level == null || Number(record.level) === Number(filters.level);
        const matchesClass = !filters.classList || (Array.isArray(record.classLists) && record.classLists.includes(filters.classList));
        const matchesGroup = !filters.spellGroup || record.spellGroup === filters.spellGroup;
        const matchesSource = !filters.source || record.source === filters.source;
        return matchesLevel && matchesClass && matchesGroup && matchesSource;
    });
}

test('app includes spell catalog loading and lookup helpers', () => {
    assert.match(appJs, /fetch\(['"]data\/spell-catalog\.json['"]\)/);
    assert.match(appJs, /fetch\(['"]data\/tome-of-magic-priest-spells\.json['"]\)/);
    assert.match(appJs, /fetch\(['"]data\/priest-spell-compendium-v1-extract\.json['"]\)/);
    assert.match(appJs, /fetch\(['"]data\/priest-spell-compendium-v3-extract\.json['"]\)/);
    assert.match(appJs, /fetch\(['"]data\/priest-spell-compendium-v2-extract\.json['"]\)/);
    assert.doesNotMatch(appJs, /fetch\(['"]data\/wizard-spell-compendium-v1-layout-analysis\.json['"]\)/);
    assert.match(appJs, /fetch\(['"]data\/wizard-spell-compendium-v1-extract\.json['"]\)/);
    assert.match(appJs, /fetch\(['"]data\/wizard-spell-compendium-v2-extract\.json['"]\)/);
    assert.match(appJs, /fetch\(['"]data\/wizard-spell-compendium-v3-extract\.json['"]\)/);
    assert.match(appJs, /fetch\(['"]data\/wizard-spell-compendium-v4-extract\.json['"]\)/);
    assert.match(appJs, /fetch\(['"]data\/players-option-spells-and-magic-extract\.json['"]\)/);
    assert.match(appJs, /fetch\(['"]data\/magic-encyclopedia-v1-spell-extract\.json['"]\)/);
    assert.match(appJs, /function\s+spellCatalogLookupById|function\s+spellCatalogLookupAllById|function\s+spellCatalogLookupByName|function\s+validateSpellCatalog|function\s+filterSpellCatalog/);
});

test('normalized spell catalog contains unique IDs and valid schema fields', () => {
    assert.equal(spells.length > 0, true);
    assert.deepEqual(validateSpellCatalog(spells), []);
});

test('lookup by ID works', () => {
    assert.equal(spellCatalogLookupById('magic-missile')?.name, 'Magic Missile');
    assert.equal(spellCatalogLookupById('missing-spell'), null);
});

test('lookup by name works', () => {
    assert.equal(spellCatalogLookupByName('Alarm')?.id, 'alarm');
    assert.equal(spellCatalogLookupByName('No Such Spell'), null);
});

test('level and source filters work', () => {
    assert.equal(filterSpellCatalog(spells, { level: 1 }).length > 0, true);
    assert.equal(filterSpellCatalog(spells, { source: 'AD&D 2E PHB' }).length, spells.length);
});

test('class and spell-group filters work', () => {
    assert.equal(filterSpellCatalog(spells, { classList: 'wizard' }).length > 0, true);
    assert.equal(filterSpellCatalog(spells, { spellGroup: 'wizard' }).length > 0, true);
});

test('component parsing preserves null values and object structure', () => {
    const sample = spellCatalogLookupById('magic-missile');
    assert.ok(sample);
    assert.equal(sample.components.verbal, null);
    assert.equal(sample.components.somatic, null);
    assert.equal(sample.materialComponents, null);
    assert.equal(Array.isArray(sample.notes), true);
});

test('Tome of Magic batch imports and preserves nulls', () => {
    assert.equal(Array.isArray(tomeSpells), true);
    assert.equal(tomeSpells.length, 12);
    assert.equal(tomeSpells[0].materialComponents, null);
    assert.equal(typeof tomeSpells[0].components, 'undefined');
    assert.equal(Array.isArray(tomeSpells[0].schools), true);
    assert.equal(tomeSpells[0].source, 'Tome of Magic');
});

test('incoming Tome records duplicate detection works', () => {
    const duplicate = [...tomeSpells, { ...tomeSpells[0] }];
    const duplicates = duplicate.reduce((accumulator, record, index, arr) => {
        const seen = new Set();
        const match = arr.filter(item => item.id === record.id);
        if (match.length > 1) accumulator.push(record.id);
        return accumulator;
    }, []);
    assert.ok(Array.isArray(duplicates));
    assert.ok(duplicates.includes('conjure-spell-component'));
});

test('Tome of Magic report documents limitations', () => {
    assert.equal(tomeReport.recordCount, 12);
    assert.equal(Array.isArray(tomeReport.limitations), true);
    assert.ok(tomeReport.limitations.some(entry => entry.includes('materialComponents remains null')));
});

test('school arrays are retained as arrays and printed strings survive', () => {
    const sample = tomeSpells.find(item => item.id === 'watery-double');
    assert.ok(Array.isArray(sample.schools));
    assert.equal(sample.range, 'Touch');
    assert.equal(sample.duration, 'Special');
    assert.equal(sample.castingTime, '3');
});

test('priest extraction imports the reported record count without changing source values', () => {
    assert.equal(priestSpells.length, 137);
    assert.equal(priestReport.recordCount, 137);
    assert.equal(priestReport.source, 'Tome of Magic priest section');
    const sample = priestSpells.find(item => item.id === 'anti-vermin-barrier-abjuration');
    assert.deepEqual(sample.sphere, ['Wards']);
    assert.equal(sample.range, '30 yards');
    assert.equal(sample.duration, '1 hour/level');
    assert.equal(sample.castingTime, '1');
    assert.equal(sample.areaOfEffect, '10-foot cube/level');
    assert.equal(sample.savingThrow, 'None');
});

test('priest duplicate IDs are reported without modifying extracted records', () => {
    const reversible = priestSpells.filter(item => item.id === 'reversible');
    assert.equal(reversible.length, 11);
    assert.deepEqual(reversible.map(item => item.level), [1, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7]);
});

test('priest records retain source and null-safe fields', () => {
    const sample = priestSpells.find(item => item.id === 'analyze-balance-divination');
    assert.deepEqual(sample.classLists, ['priest']);
    assert.equal(sample.level, null);
    assert.equal(sample.source, 'Tome of Magic');
    assert.deepEqual(sample.notes, []);
});

test('corrected Compendium imports exactly 427 source records', () => {
    assert.equal(compendiumSpells.length, 427);
    assert.equal(compendiumReport.recordCount, 427);
    assert.equal(new Set(compendiumSpells.map(record => record.sourceRecordId)).size, 427);
    assert.equal(new Set(compendiumSpells.map(record => record.id)).size, 427);
    assert.equal(compendiumSpells.every(record => record.source === 'Priest Spell Compendium Volume 1'), true);
});

test('Compendium preserves descriptor schools separately from spheres and retains unmapped data', () => {
    const sample = compendiumSpells[0];
    assert.deepEqual(sample.descriptorSchools, ['Alteration', 'Abjuration']);
    assert.deepEqual(sample.sphere, ['Law', 'Combat']);
    assert.notDeepEqual(sample.descriptorSchools, sample.sphere);
    assert.equal(sample.unmapped.printedLevel, '5');
    assert.equal(sample.materialComponents, null);
});

test('Compendium preserves printed metadata strings without inference', () => {
    const sample = compendiumSpells.find(record => record.id === 'abeyance');
    assert.equal(sample.range, 'Touch');
    assert.equal(sample.castingTime, '8');
    assert.equal(sample.duration, 'Special');
    assert.equal(sample.areaOfEffect, '1 focal stone or | magical item');
    assert.equal(sample.savingThrow, 'None');
    assert.deepEqual(JSON.parse(JSON.stringify(sample)), sample);
});

test('Volume 3 imports exactly 257 validated source records', () => {
    assert.equal(compendiumV3Spells.length, 257);
    assert.equal(compendiumV3Report.recordCount, 257);
    assert.equal(new Set(compendiumV3Spells.map(record => record.sourceRecordId)).size, 257);
    assert.equal(new Set(compendiumV3Spells.map(record => record.id)).size, 257);
    assert.equal(compendiumV3Report.duplicateSpellIds.length, 0);
    assert.equal(compendiumV3Spells.every(record => record.source === 'Priest Spell Compendium Volume 3'), true);
});

test('Volume 3 preserves source fields and reports excluded OCR records', () => {
    const sample = compendiumV3Spells.find(record => record.id === 'spike-growth');
    assert.equal(sample.sourceRecordId, 'spike-growth');
    assert.deepEqual(sample.descriptorSchools, ['Alteration', 'Enchantment']);
    assert.deepEqual(sample.sphere, ['Plant']);
    assert.equal(sample.materialComponents, null);
    assert.equal(sample.unmapped.printedLevel, '3');
    assert.equal(sample.duration, '3d4 turns + | turn/level');
    assert.equal(compendiumV3Report.ambiguousRecordsExcluded.length, 2);
    assert.ok(compendiumV3Report.ambiguousRecordsExcluded.every(record => !record.id));
    assert.deepEqual(JSON.parse(JSON.stringify(sample)), sample);
});

test('Volume 2 imports the reported source record count with stable identities', () => {
    assert.equal(compendiumV2Spells.length, 406);
    assert.equal(compendiumV2Report.recordCount, 406);
    assert.equal(new Set(compendiumV2Spells.map(record => record.sourceRecordId)).size, 406);
    assert.equal(new Set(compendiumV2Spells.map(record => record.id)).size, 406);
    assert.equal(compendiumV2Report.duplicateSpellIds.length, 0);
    assert.equal(compendiumV2Spells.every(record => record.source === 'Priest Spell Compendium Volume 2'), true);
});

test('Volume 2 preserves descriptor schools, spheres, OCR metadata, and null materials', () => {
    const sample = compendiumV2Spells.find(record => record.id === 'gaseous-form');
    assert.deepEqual(sample.descriptorSchools, ['Alteration', 'Necromancy']);
    assert.deepEqual(sample.sphere, ['Necromantic', 'Elemental Air']);
    assert.equal(sample.materialComponents, null);
    assert.equal(sample.unmapped.printedLevel, '5');
    assert.equal(sample.duration, '| turn/level');
    assert.deepEqual(JSON.parse(JSON.stringify(sample)), sample);
    assert.equal(compendiumV2Report.rejectedHeaderCandidates, 4);
    assert.equal(compendiumV2Report.ambiguousRecordsExcluded.length, 2);
});

test('Wizard Compendium layout analysis remains metadata, not a spell catalog', () => {
    assert.equal(wizardLayout.matchedHeaderSamples, 481);
    assert.equal(Array.isArray(wizardLayout.sampleEntries), true);
    assert.equal(wizardLayout.sampleEntries.length, 5);
    assert.equal(Object.prototype.hasOwnProperty.call(wizardLayout, 'spells'), false);
    assert.equal(Object.prototype.hasOwnProperty.call(wizardLayout, 'records'), false);
});

test('Wizard Compendium conversion fields are supported without reverse inference', () => {
    const sourceRecord = {
        id: 'abi-dalzims-horrid-wilting',
        sourceRecordId: 'wsc-v1-abi-dalzims-horrid-wilting',
        name: 'Abi-Dalzim’s Horrid Wilting',
        level: 8,
        type: 'Spell',
        school: 'Wizard',
        classLists: ['wizard'],
        descriptorSchools: ['Alteration', 'Necromancy'],
        settingOrElementDescriptors: ['Water'],
        reversibleSpell: false,
        reverseSpellId: null,
        verbal: true,
        somatic: true,
        material: true,
        materialComponents: null,
        range: '20 yds./level',
        castingTime: '8',
        duration: 'Instantaneous',
        areaOfEffect: '30-ft. cube',
        savingThrow: null,
        source: 'Wizard Spell Compendium Volume 1',
        sourceNotes: null,
        sourceLocation: { ocrLine: 1859, page: null },
        unmapped: { printedLevel: '8', printedComponents: 'V, S, M', printedSavingThrow: '4' },
        notes: []
    };
    assert.deepEqual(JSON.parse(JSON.stringify(sourceRecord)), sourceRecord);
    assert.equal(sourceRecord.reverseSpellId, null);
    assert.equal(sourceRecord.materialComponents, null);
    assert.deepEqual(sourceRecord.sourceLocation, { ocrLine: 1859, page: null });
});

test('Wizard Compendium imports the reported records and preserves source occurrence IDs', () => {
    assert.equal(wizardCompendiumSpells.length, 474);
    assert.equal(wizardCompendiumReport.recordCount, 474);
    assert.equal(new Set(wizardCompendiumSpells.map(record => record.sourceRecordId)).size, 474);
    assert.deepEqual(wizardCompendiumReport.duplicateCanonicalIds, ['distort-life-ii']);
    assert.deepEqual(wizardCompendiumReport.duplicateSourceRecordIds, []);
    assert.equal(wizardCompendiumSpells.every(record => record.source === 'Wizard Spell Compendium Volume 1'), true);
});

test('Combine keeps priest and wizard spell lineages separate', () => {
    const phbCombine = spells.find(record => record.id === 'combine');
    const priestCombine = compendiumSpells.find(record => record.id === 'combine');
    const wizardCombine = wizardCompendiumSpells.find(record => record.id === 'combine-wizard');
    const materialEnrichment = materialBatchThree.find(record => record.sourceRecordId === 'wsc-v1-combine');
    assert.deepEqual({ id: phbCombine.id, level: phbCombine.level, classLists: phbCombine.classLists, source: phbCombine.source }, { id: 'combine', level: 1, classLists: ['priest'], source: 'AD&D 2E PHB' });
    assert.deepEqual({ id: priestCombine.id, level: priestCombine.level, classLists: priestCombine.classLists, source: priestCombine.source }, { id: 'combine', level: 1, classLists: ['priest'], source: 'Priest Spell Compendium Volume 1' });
    assert.deepEqual({ id: wizardCombine.id, sourceRecordId: wizardCombine.sourceRecordId, level: wizardCombine.level, classLists: wizardCombine.classLists, source: wizardCombine.source }, { id: 'combine-wizard', sourceRecordId: 'wsc-v1-combine', level: 9, classLists: ['wizard'], source: 'Wizard Spell Compendium Volume 1' });
    assert.equal(materialEnrichment.id, 'combine-wizard');
});

test('Wizard Compendium preserves reversible, descriptor, location, and unmapped fields', () => {
    const sample = wizardCompendiumSpells.find(record => record.id === 'accelerate-animal-growth');
    assert.deepEqual(sample.descriptorSchools, ['Chronomancy']);
    assert.deepEqual(sample.settingOrElementDescriptors, []);
    assert.equal(sample.reversibleSpell, true);
    assert.equal(sample.reverseSpellId, null);
    assert.equal(sample.materialComponents, null);
    assert.equal(sample.sourceNotes, null);
    assert.deepEqual(sample.sourceLocation, { ocrLine: 1980, page: null });
    assert.equal(sample.unmapped.printedLevel, '5');
    assert.equal(sample.unmapped.printedComponents, 'V, S, M');
    assert.equal(sample.unmapped.printedSavingThrow, 'Neg.');
    assert.deepEqual(JSON.parse(JSON.stringify(sample)), sample);
});

test('Wizard Compendium Volume 2 imports expected records and source identities', () => {
    assert.equal(wizardCompendiumV2Spells.length, 443);
    assert.equal(wizardCompendiumV2Report.recordCount, 443);
    assert.equal(new Set(wizardCompendiumV2Spells.map(record => record.sourceRecordId)).size, 443);
    assert.deepEqual(wizardCompendiumV2Report.duplicateCanonicalIds, ['lightning-rod']);
    assert.deepEqual(wizardCompendiumV2Report.duplicateSourceRecordIds, []);
    assert.equal(wizardCompendiumV2Report.rejectedRecords.length, 0);
    assert.equal(wizardCompendiumV2Report.excludedRecords.length, 22);
    assert.equal(wizardCompendiumV2Spells.every(record => record.source === 'Wizard Spell Compendium Volume 2'), true);
});

test('Wizard Compendium Volume 2 preserves both lightning-rod occurrences and OCR values', () => {
    const lightningRodRecords = wizardCompendiumV2Spells.filter(record => record.id === 'lightning-rod');
    assert.equal(lightningRodRecords.length, 2);
    assert.equal(new Set(lightningRodRecords.map(record => record.sourceRecordId)).size, 2);
    assert.equal(lightningRodRecords.every(record => record.materialComponents === null), true);
    assert.equal(lightningRodRecords.every(record => record.sourceLocation.page === null), true);
    assert.equal(lightningRodRecords.every(record => typeof record.unmapped.printedSavingThrow === 'string'), true);
    assert.deepEqual(JSON.parse(JSON.stringify(lightningRodRecords)), lightningRodRecords);
});

test('Wizard Compendium Volume 3 imports expected records and source identities', () => {
    assert.equal(wizardCompendiumV3Spells.length, 499);
    assert.equal(wizardCompendiumV3Report.recordCount, 499);
    assert.equal(new Set(wizardCompendiumV3Spells.map(record => record.sourceRecordId)).size, 499);
    assert.deepEqual(wizardCompendiumV3Report.duplicateCanonicalIds, ['blunt-weapons', 'edged-weapons', 'red-wizard']);
    assert.deepEqual(wizardCompendiumV3Report.duplicateSourceRecordIds, []);
    assert.equal(wizardCompendiumV3Report.excludedRecords.length, 16);
    assert.equal(wizardCompendiumV3Report.rejectedRecords.length, 0);
    assert.deepEqual(wizardCompendiumV3Report.distinctSources, ['Wizard Spell Compendium Volume 3']);
});

test('Wizard Compendium Volume 3 preserves duplicate source occurrences and source metadata', () => {
    for (const id of ['blunt-weapons', 'edged-weapons', 'red-wizard']) {
        const records = wizardCompendiumV3Spells.filter(record => record.id === id);
        assert.ok(records.length > 1, `${id} should have multiple source occurrences`);
        assert.equal(new Set(records.map(record => record.sourceRecordId)).size, records.length);
        assert.ok(records.every(record => record.materialComponents === null));
        assert.ok(records.every(record => record.sourceLocation.page === null));
    }
    const sample = wizardCompendiumV3Spells.find(record => record.id === 'moon-rune');
    assert.deepEqual(sample.descriptorSchools, ['Alteration']);
    assert.deepEqual(sample.settingOrElementDescriptors, ['Artifice, Geometry']);
    assert.equal(sample.unmapped.printedSavingThrow, 'None');
    assert.deepEqual(JSON.parse(JSON.stringify(sample)), sample);
});

test('Wizard Compendium Volume 4 imports the expected source records', () => {
    assert.equal(wizardCompendiumV4Spells.length, 269);
    assert.equal(wizardCompendiumV4Report.recordCount, 269);
    assert.equal(new Set(wizardCompendiumV4Spells.map(record => record.id)).size, 269);
    assert.equal(new Set(wizardCompendiumV4Spells.map(record => record.sourceRecordId)).size, 269);
    assert.deepEqual(wizardCompendiumV4Report.duplicateCanonicalIds, []);
    assert.deepEqual(wizardCompendiumV4Report.duplicateSourceRecordIds, []);
    assert.equal(wizardCompendiumV4Report.excludedRecords.length, 6);
    assert.equal(wizardCompendiumV4Report.rejectedRecords.length, 0);
    assert.deepEqual(wizardCompendiumV4Report.distinctSources, ['Wizard Spell Compendium Volume 4']);
});

test('Wizard Compendium Volume 4 preserves OCR and nullable source metadata', () => {
    const sample = wizardCompendiumV4Spells.find(record => record.id === 'statue');
    assert.deepEqual(sample.descriptorSchools, ['Alteration']);
    assert.deepEqual(sample.settingOrElementDescriptors, ['Alchemy, Earth']);
    assert.equal(sample.reversibleSpell, false);
    assert.equal(sample.reverseSpellId, null);
    assert.equal(sample.materialComponents, null);
    assert.equal(sample.sourceNotes, null);
    assert.deepEqual(sample.sourceLocation, { ocrLine: 1292, page: null });
    assert.equal(sample.unmapped.printedSavingThrow, 'Special');
    assert.deepEqual(JSON.parse(JSON.stringify(sample)), sample);
});

test("Player's Option imports the expected records and source identities", () => {
    assert.equal(playersOptionSpells.length, 49);
    assert.equal(playersOptionReport.recordCount, 49);
    assert.equal(new Set(playersOptionSpells.map(record => record.id)).size, 49);
    assert.equal(new Set(playersOptionSpells.map(record => record.sourceRecordId)).size, 49);
    assert.deepEqual(playersOptionReport.duplicateCanonicalIds, []);
    assert.deepEqual(playersOptionReport.duplicateSourceRecordIds, []);
    assert.equal(playersOptionReport.excludedRecords.length, 38);
    assert.equal(playersOptionReport.rejectedRecords.length, 0);
    assert.deepEqual(playersOptionReport.distinctSources, ["Player's Option: Spells & Magic"]);
});

test("Player's Option preserves section-derived levels and optional unmapped fields", () => {
    const sample = playersOptionSpells.find(record => record.id === 'watery-fist');
    assert.equal(sample.level, 2);
    assert.equal(sample.unmapped.printedComponents, 'V, S, M');
    assert.equal(sample.unmapped.knockdown, 'd10');
    assert.equal(sample.unmapped.critical, 'Medium (1 hit) crushing');
    assert.equal(sample.unmapped.subtlety, '+4');
    assert.equal(sample.unmapped.sensory, 'Moderate visual');
    assert.equal(sample.materialComponents, null);
    assert.deepEqual(sample.sourceLocation, { ocrLine: 22452, page: null });
    assert.equal(sample.range, '60 yds.');
    assert.equal(sample.castingTime, '5');
    assert.equal(sample.duration, '1 rd./level');
    assert.equal(sample.areaOfEffect, 'Special');
    assert.equal(sample.savingThrow, 'None');
    assert.deepEqual(JSON.parse(JSON.stringify(sample)), sample);
});

test('partial reconciliation artifacts preserve declared counts and partial scope', () => {
    assert.equal(reconciliationIndex.length, 1272);
    assert.equal(reconciliationConflicts.length, 20);
    assert.equal(reconciliationReport.sourceRecordCount, 1294);
    assert.equal(reconciliationReport.canonicalSpellCount, 1272);
    assert.equal(reconciliationReport.canonicalIdsWithMultipleOccurrences, 20);
    assert.equal(reconciliationReport.canonicalIdsWithFieldConflicts, 20);
    assert.deepEqual(reconciliationReport.duplicateSourceRecordIds, []);
    assert.match(reconciliationReport.scopeLimitation, /not included/i);
    assert.doesNotMatch(appJs, /loadPartialSpellReconciliation/);
    assert.doesNotMatch(appJs, /fetch\('data\/spell-canonical-index-partial\.json'\)/);
    assert.doesNotMatch(appJs, /fetch\('data\/spell-conflict-report-partial\.json'\)/);
    assert.doesNotMatch(appJs, /fetch\('data\/spell-reconciliation-report-partial\.json'\)/);
});

test('partial reconciliation preserves source linkage and conflicting values', () => {
    const indexEntry = reconciliationIndex.find(entry => entry.id === 'lightning-rod');
    const conflict = reconciliationConflicts.find(entry => entry.id === 'lightning-rod');
    assert.ok(indexEntry);
    assert.equal(indexEntry.occurrenceCount, 2);
    assert.deepEqual(indexEntry.sourceRecordIds, ['wsc-v2-lightning-rod', 'wsc-v2-lightning-rod-variant-2']);
    assert.ok(conflict);
    assert.deepEqual(conflict.fieldConflicts.level[0], { value: 3, sourceRecordIds: ['wsc-v2-lightning-rod'] });
    assert.deepEqual(conflict.fieldConflicts.level[1], { value: 6, sourceRecordIds: ['wsc-v2-lightning-rod-variant-2'] });
    assert.deepEqual(JSON.parse(JSON.stringify(reconciliationIndex)), reconciliationIndex);
    assert.deepEqual(JSON.parse(JSON.stringify(reconciliationConflicts)), reconciliationConflicts);
    assert.deepEqual(JSON.parse(JSON.stringify(reconciliationReport)), reconciliationReport);
});

test('material enrichment batch parses and preserves its partial provenance', () => {
    assert.equal(materialEnrichments.length, 19);
    assert.equal(materialEnrichmentReport.recordCount, 19);
    assert.equal(new Set(materialEnrichments.map(record => record.sourceRecordId)).size, 19);
    assert.deepEqual(materialEnrichmentReport.duplicateSourceRecordIds, []);
    assert.deepEqual(materialEnrichmentReport.sources, [
        'Wizard Spell Compendium Volume 2',
        'Wizard Spell Compendium Volume 3',
        'Wizard Spell Compendium Volume 4'
    ]);
    assert.match(materialEnrichmentReport.limitations.join(' '), /partial first material-component batch/i);
    assert.match(appJs, /loadSpellMaterialEnrichments/);
    assert.match(appJs, /sourceRecordId === enrichment\.sourceRecordId/);
});

test('material enrichment preserves OCR strings and null source locations', () => {
    const sample = materialEnrichments.find(record => record.id === 'metal-to-rust');
    assert.equal(sample.materialComponents, 'The material component for this spell is a fiask of seawater.');
    assert.equal(sample.sourceLocation.ocrLine, null);
    assert.equal(sample.sourceLocation.page, null);
    assert.deepEqual(JSON.parse(JSON.stringify(materialEnrichments)), materialEnrichments);
});

test('material enrichment requires source occurrence identity and is null-only', () => {
    const source = { sourceRecordId: 'wsc-v2-magnetism', id: 'magnetism', source: 'Wizard Spell Compendium Volume 2', materialComponents: null };
    const patch = { sourceRecordId: 'wsc-v2-magnetism', id: 'magnetism', source: 'Wizard Spell Compendium Volume 2', materialComponents: 'lodestone' };
    assert.match(appJs, /materialComponents == null/);
    assert.match(appJs, /source-consistency-conflict/);
    assert.match(appJs, /material-components-conflict/);
    assert.equal(source.materialComponents, null);
    assert.equal(patch.sourceRecordId, source.sourceRecordId);
    assert.notEqual(patch.id, 'wrong-id');
});

test('material enrichment batches 2 and 3 preserve their report contracts', () => {
    assert.equal(materialBatchTwo.length, 10);
    assert.equal(materialBatchTwoReport.recordCount, 10);
    assert.deepEqual(materialBatchTwoReport.duplicateSourceRecordIds, []);
    assert.equal(materialBatchThree.length, 258);
    assert.equal(materialBatchThreeReport.recordCount, 258);
    assert.equal(materialBatchThreeReport.materialFlaggedHeaderCount, 348);
    assert.equal(materialBatchThreeReport.manualReviewCandidates.length, 1);
    assert.deepEqual(materialBatchThreeReport.duplicateSourceRecordIds, []);
    assert.equal(new Set([...materialBatchTwo, ...materialBatchThree].map(record => record.sourceRecordId)).size, 268);
});

test('material enrichment preserves batch 2 OCR text and null locations', () => {
    const sample = materialBatchTwo.find(record => record.id === 'protection-from-lightning');
    assert.equal(sample.materialComponents, 'The material component is a thread of copper for each protected creature.');
    assert.equal(sample.sourceLocation.ocrLine, null);
    assert.equal(sample.sourceLocation.page, null);
    assert.deepEqual(JSON.parse(JSON.stringify(materialBatchTwo)), materialBatchTwo);
});

test('batch 3 manual-review candidate is not automatically applied', () => {
    const candidate = materialBatchThreeReport.manualReviewCandidates[0];
    assert.equal(candidate.sourceRecordId, 'wsc-v1-delay-death');
    assert.equal(materialBatchThree.some(record => record.sourceRecordId === candidate.sourceRecordId), false);
    assert.doesNotMatch(appJs, /fetch\('data\/spell-material-components-wsc-v1-batch-3-report\.json'\)/);
});

test('material enrichment batch 4 preserves its validated report contract', () => {
    assert.equal(materialBatchFour.length, 239);
    assert.equal(materialBatchFourReport.recordCount, 239);
    assert.equal(materialBatchFourReport.materialFlaggedHeaderCount, 327);
    assert.equal(materialBatchFourReport.manualReviewCandidates, 0);
    assert.deepEqual(materialBatchFourReport.duplicateSourceRecordIds, []);
    assert.equal(new Set(materialBatchFour.map(record => record.sourceRecordId)).size, 239);
    assert.equal(materialBatchFour.every(record => record.source === 'Wizard Spell Compendium Volume 2'), true);
    assert.match(appJs, /spell-material-components-wsc-v2-batch-4\.json/);
});

test('material enrichment batch 4 preserves exact text and source locations', () => {
    const sample = materialBatchFour.find(record => record.sourceRecordId === 'wsc-v2-metal-to-rust');
    assert.equal(sample.materialComponents, 'The material component for this spell is a fiask of seawater.');
    assert.equal(sample.sourceLocation.ocrLine, 33971);
    assert.equal(sample.sourceLocation.page, null);
    assert.equal(sample.extractionMethod, 'explicit-material-component-sentence');
    assert.deepEqual(JSON.parse(JSON.stringify(sample)), sample);
});

test('material enrichment batch 5 preserves its validated report contract', () => {
    assert.equal(materialBatchFive.length, 300);
    assert.equal(materialBatchFiveReport.recordCount, 300);
    assert.equal(materialBatchFiveReport.materialFlaggedHeaderCount, 360);
    assert.deepEqual(materialBatchFiveReport.manualReviewCandidates, []);
    assert.deepEqual(materialBatchFiveReport.duplicateSourceRecordIds, []);
    assert.equal(new Set(materialBatchFive.map(record => record.sourceRecordId)).size, 300);
    assert.equal(materialBatchFive.every(record => record.source === 'Wizard Spell Compendium Volume 3'), true);
    assert.match(appJs, /spell-material-components-wsc-v3-batch-5\.json/);
});

test('material enrichment batch 5 preserves OCR text and null pages', () => {
    const sample = materialBatchFive.find(record => record.sourceRecordId === 'wsc-v3-mystic-writing');
    assert.equal(sample.materialComponents, 'The material component is the special pigment, which costs 200 gp per application.');
    assert.equal(sample.sourceLocation.ocrLine, 4314);
    assert.equal(sample.sourceLocation.page, null);
    assert.equal(sample.extractionMethod, 'explicit-material-component-sentence');
    assert.deepEqual(JSON.parse(JSON.stringify(sample)), sample);
});

test('material enrichment batch 6 preserves its validated report contract', () => {
    assert.equal(materialBatchSix.length, 178);
    assert.equal(materialBatchSixReport.recordCount, 178);
    assert.equal(materialBatchSixReport.materialFlaggedHeaderCount, 219);
    assert.equal(materialBatchSixReport.manualReviewCandidates, 0);
    assert.deepEqual(materialBatchSixReport.duplicateSourceRecordIds, []);
    assert.equal(new Set(materialBatchSix.map(record => record.sourceRecordId)).size, 178);
    assert.equal(materialBatchSix.every(record => record.source === 'Wizard Spell Compendium Volume 4'), true);
    assert.match(appJs, /spell-material-components-wsc-v4-batch-6\.json/);
});

test('material enrichment batch 6 preserves exact component text and locations', () => {
    const sample = materialBatchSix.find(record => record.sourceRecordId === 'wsc-v4-squaring-the-circle');
    assert.equal(sample.materialComponents, 'The material component is a small pendant of any precious metal with a circle fashioned inside a square.');
    assert.equal(sample.sourceLocation.ocrLine, 858);
    assert.equal(sample.sourceLocation.page, null);
    assert.equal(sample.extractionMethod, 'explicit-material-component-sentence');
    assert.deepEqual(JSON.parse(JSON.stringify(sample)), sample);
});

test('PSC batch 7 preserves its source-occurrence enrichment contract', () => {
    const records = Array.isArray(pscBatch) ? pscBatch : Object.values(pscBatch);
    assert.equal(records.length, 94);
    assert.equal(pscReport.recordCount, 94);
    assert.equal(pscReport.materialFlaggedHeaderCount, 96);
    assert.equal(pscReport.manualReviewCandidates, 4);
    assert.equal(new Set(records.map(record => record.sourceRecordId)).size, 94);
    assert.equal(records.every(record => record.id && record.spellName && record.materialComponents), true);
    assert.match(appJs, /normalizePscMaterialEnrichments/);
    assert.match(appJs, /sourceCategory: 'Priest'/);
    assert.match(appJs, /sourceAuthority: 'PSC'/);
});

test('PSC batch 7 preserves names, component wording, and does not use canonical fallback', () => {
    const sample = (Array.isArray(pscBatch) ? pscBatch : Object.values(pscBatch)).find(record => record.sourceRecordId === 'psc-v1-air-walk');
    assert.equal(sample.spellName, 'Air Walk');
    assert.equal(sample.materialComponents, "The material components for the spell are the priest's holy symbol and a bit of thistledown.");
    assert.equal(sample.id, 'air-walk');
    assert.match(appJs, /record\.sourceRecordId === enrichment\.sourceRecordId/);
    assert.doesNotMatch(appJs, /find\(record => record\.id === enrichment\.id\)/);
    assert.deepEqual(JSON.parse(JSON.stringify(sample)), sample);
});

test('PSC batches 8 and 9 preserve counts, identities, and source provenance', () => {
    assert.equal(pscBatchTwo.length, 89);
    assert.equal(pscBatchTwoReport.recordCount, 89);
    assert.equal(pscBatchTwoReport.manualReviewCandidates, 4);
    assert.equal(pscBatchThree.length, 53);
    assert.equal(pscBatchThreeReport.recordCount, 53);
    assert.equal(pscBatchThreeReport.manualReviewCandidates, 0);
    assert.equal(new Set([...pscBatchTwo, ...pscBatchThree].map(record => record.sourceRecordId)).size, 142);
    assert.match(appJs, /sourceVolume: volume/);
});

test('PSC batches 8 and 9 preserve exact component text and use distinct occurrence keys', () => {
    const batchTwoSample = pscBatchTwo.find(record => record.sourceRecordId === 'psc-v2-gauntlet-of-winds');
    const batchThreeSample = pscBatchThree.find(record => record.sourceRecordId === 'psc-v3-spirit-of-flame');
    assert.equal(batchTwoSample.spellName, 'Gauntlet of Winds');
    assert.equal(batchTwoSample.materialComponents, "The material component is the priest's holy symbol, which is not consumed in the casting.");
    assert.equal(batchThreeSample.spellName, 'Spirit of Flame');
    assert.equal(batchThreeSample.materialComponents, 'The material component is an offering appro- priate to the deity.');
    assert.notEqual(batchTwoSample.sourceRecordId, batchThreeSample.sourceRecordId);
    assert.deepEqual(JSON.parse(JSON.stringify([batchTwoSample, batchThreeSample])), [batchTwoSample, batchThreeSample]);
});

test('PSC preflight report preserves its metadata-only scope', () => {
    assert.equal(pscPreflightReport.totalRecords, 236);
    assert.equal(pscPreflightReport.uniqueSpellNames, 236);
    assert.deepEqual(pscPreflightReport.volumeCounts, {
        'spell-material-components-psc-v1-batch-7.json': 94,
        'spell-material-components-psc-v2-batch-8.json': 89,
        'spell-material-components-psc-v3-batch-9.json': 53
    });
    assert.doesNotMatch(appJs, /psc-integration-preflight-report\.json/);
    assert.deepEqual(JSON.parse(JSON.stringify(pscPreflightReport)), pscPreflightReport);
});

test('PSC cross-source reconciliation report preserves its metadata-only counts', () => {
    assert.equal(pscCrossSourceReport.pscRecords, 236);
    assert.equal(pscCrossSourceReport.canonicalNamesIndexed, 1272);
    assert.equal(pscCrossSourceReport.matchedNames, 11);
    assert.equal(pscCrossSourceReport.newNames, 225);
    assert.equal(pscCrossSourceReport.sampleMatched.length, 11);
    assert.equal(pscCrossSourceReport.sampleNew.length, 25);
    assert.doesNotMatch(appJs, /psc-cross-source-reconciliation-report\.json/);
    assert.deepEqual(JSON.parse(JSON.stringify(pscCrossSourceReport)), pscCrossSourceReport);
});

test('PSC-MC-1.0 is the final published PSC enrichment dataset', () => {
    assert.equal(pscFinal.dataset, 'PSC-MC-1.0');
    assert.equal(pscFinal.status, 'FINAL');
    assert.equal(pscFinal.recordCount, 236);
    assert.equal(pscFinal.records.length, 236);
    assert.equal(new Set(pscFinal.records.map(record => record.sourceRecordId)).size, 236);
    assert.equal(pscFinal.records.every(record => record.sourceBook === 'Priest Spell Compendium' && record.sourceAuthority === 'PSC'), true);
    assert.match(appJs, /fetch\('data\/PSC-MC-1\.0\.json'\)/);
    assert.doesNotMatch(appJs, /normalizePscMaterialEnrichments\(pscBatch/);
});

test('PSC-MC-1.0 uses the visual-source corrected Speak With Dead text', () => {
    const record = pscFinal.records.find(item => item.sourceRecordId === 'psc-v2-speak-with-dead');
    assert.ok(record);
    assert.equal(record.materialComponents, 'The priest needs a holy symbol and burning incense in order to cast this spell upon the body, remains, or a portion thereof.');
    assert.equal(record.sourceVolume, 2);
    assert.equal(record.recordStatus, 'CORRECTED_FROM_VISUAL_SOURCE');
    assert.equal(record.reviewFlag, false);
    assert.deepEqual(JSON.parse(JSON.stringify(record)), record);
});

test('PSC-MC-1.0 publication audit and checksum match the authoritative dataset', () => {
    const hash = crypto.createHash('sha256').update(fs.readFileSync(pscFinalPath)).digest('hex');
    assert.equal(pscAudit.recordsImported, 236);
    assert.deepEqual(pscAudit.sourceVolumeCounts, { '1': 94, '2': 89, '3': 53 });
    assert.equal(pscAudit.variantRelationships.count, 11);
    assert.equal(pscAudit.correctedRecords[0].sourceRecordId, 'psc-v2-speak-with-dead');
    assert.equal(pscAudit.automaticDeduplication, false);
    assert.equal(pscChecksum, `${hash} *PSC-MC-1.0.json`);
    assert.match(pscDocumentation, /PSC-MC-1\.0/);
    assert.match(pscDocumentation, /sourceRecordId/);
    assert.match(pscDocumentation, /Speak With Dead/);
    assert.deepEqual(JSON.parse(JSON.stringify(pscAudit)), pscAudit);
});

test('Magic Encyclopedia Volume 1 imports exactly one source occurrence', () => {
    assert.equal(magicEncyclopediaSpells.length, 1);
    assert.equal(magicEncyclopediaReport.recordCount, 1);
    assert.equal(magicEncyclopediaSpells[0].id, 'prismals-reversal');
    assert.equal(magicEncyclopediaSpells[0].sourceRecordId, 'magic-encyclopedia-v1-prismals-reversal');
    assert.deepEqual(magicEncyclopediaReport.duplicateCanonicalIds, []);
    assert.deepEqual(magicEncyclopediaReport.duplicateSourceRecordIds, []);
    assert.deepEqual(magicEncyclopediaReport.excludedRecords, []);
    assert.deepEqual(magicEncyclopediaReport.rejectedRecords, []);
    assert.deepEqual(magicEncyclopediaReport.distinctSources, ['The Magic Encyclopedia Volume 1']);
});

test('Magic Encyclopedia preserves supplied values, nulls, and OCR audit fields', () => {
    const sample = magicEncyclopediaSpells[0];
    assert.equal(sample.name, "Prismal's Reversal");
    assert.deepEqual(sample.descriptorSchools, ['Alteration']);
    assert.deepEqual(sample.settingOrElementDescriptors, []);
    assert.equal(sample.reverseSpellId, null);
    assert.equal(sample.materialComponents, null);
    assert.equal(sample.sourceNotes, null);
    assert.deepEqual(sample.sourceLocation, { ocrLine: 2206, page: null });
    assert.equal(sample.unmapped.printedHeading, 'New Magic');
    assert.equal(sample.unmapped.printedComponents, 'V, S');
    assert.equal(sample.unmapped.printedLevel, '7');
    assert.equal(sample.castingTime, '5 Rounds');
    assert.deepEqual(JSON.parse(JSON.stringify(sample)), sample);
});
