import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'fs';
import * as path from 'path';

// __dirname at runtime is test-out/test/ (see tsconfig.test.json), so the repo
// root is two levels up.
const ROOT = path.join(__dirname, '..', '..');
const packageJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const extensionSrc = fs.readFileSync(path.join(ROOT, 'src', 'extension.ts'), 'utf8');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');

test('package.json description does not claim to run arbitrary Lua scripts', () => {
  assert.doesNotMatch(packageJson.description, /run lua/i);
});

test('package.json has no explorer/context menu entry (the command always runs workspaceFolders[0], regardless of what was right-clicked)', () => {
  const menus = packageJson.contributes.menus;
  assert.equal(menus['explorer/context'], undefined);
});

test('README does not advertise an Explorer context menu launch path', () => {
  assert.doesNotMatch(readme, /explorer context menu/i);
});

test('README documents that LÖVE Runner does not run standalone Lua scripts', () => {
  assert.match(readme, /does not run standalone Lua scripts/i);
});

test('extension.ts runs the LÖVE binary via execFile with a separate argv, not a shell string', () => {
  assert.doesNotMatch(extensionSrc, /execAsync\(`"\$\{loveBinary\}/);
  assert.match(extensionSrc, /buildLoveInvocation\(loveBinary, lovePath\)/);
  assert.match(extensionSrc, /execFileAsync\(command, args/);
});
