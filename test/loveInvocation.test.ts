import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildLoveInvocation } from '../src/loveInvocation';

test('buildLoveInvocation: keeps lovePath as its own argv element', () => {
  const { command, args } = buildLoveInvocation('love', '/tmp/build/game.love');
  assert.equal(command, 'love');
  assert.deepEqual(args, ['/tmp/build/game.love']);
});

test('buildLoveInvocation: shell metacharacters in binaryPath or lovePath are never merged into one string', () => {
  // A malicious love.binaryPath or a project path containing shell syntax must
  // stay isolated in its own argv slot — execFile never hands this to a shell,
  // so these characters are inert regardless of their content.
  const maliciousBinary = 'love; rm -rf ~ #';
  const maliciousPath = '/tmp/"; touch pwned; echo "/game.love';
  const { command, args } = buildLoveInvocation(maliciousBinary, maliciousPath);
  assert.equal(command, maliciousBinary);
  assert.deepEqual(args, [maliciousPath]);
  // The two must never be concatenated into a single string — that's the
  // property that made the old `exec(`"${loveBinary}" "${lovePath}"`)` unsafe.
  assert.equal(args.length, 1);
});
