const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const app = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const styles = fs.readFileSync(path.join(__dirname, '..', 'styles.css'), 'utf8');

test('goblin adviser has persisted settings and deterministic advice rules', () => {
    assert.match(app, /adviserSettings: \{ enabled: true, dismissed: false, currentAdviceId: null \}/);
    assert.match(app, /function goblinAdviceRules\(\)/);
    assert.match(app, /id: 'identity-name'/);
    assert.match(app, /id: 'unspent-nwp-slots'/);
    assert.match(app, /id: 'sheet-review'/);
    assert.match(app, /title = 'summon advisor goblin'/);
    assert.doesNotMatch(app, /class="goblin-adviser-setting"/);
});

test('goblin adviser is keyboard-accessible and uses a transparent sprite', () => {
    assert.match(app, /class="goblin-adviser-toggle" aria-label="Get character sheet advice"/);
    assert.match(app, /goblin-adviser-idle-left-clean\.png/);
    assert.match(app, /goblin-adviser-talk-point-left-clean-v2\.png/);
    assert.match(app, /goblin-adviser-knife-left-clean-v2\.png/);
    assert.match(app, /goblin-adviser-think-left-clean\.png/);
    assert.match(app, /setTimeout\(\(\) => \{ sprite\.src = 'goblin-adviser-think-left-clean\.png'/);
    assert.match(app, /goblin_hut_transparent\.png/);
    assert.match(app, /setAttribute\('aria-label', 'summon advisor goblin'\)/);
    assert.match(html, /app\.js\?v=goblin-adviser-33/);
    ['goblin-adviser-idle-left-clean.png', 'goblin-adviser-talk-point-left-clean-v2.png', 'goblin-adviser-knife-left-clean-v2.png', 'goblin-adviser-think-left-clean.png'].forEach(file => assert.ok(fs.existsSync(path.join(__dirname, '..', file)), `${file} should exist`));
    assert.match(styles, /\.goblin-adviser-bubble\{[^}]*background:#fffaf0/);
    assert.match(styles, /\.goblin-adviser-toggle:focus-visible/);
});
