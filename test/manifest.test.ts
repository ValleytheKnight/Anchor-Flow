import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

void test('manifest.json has the expected identity fields', () => {
	const manifest = JSON.parse(readFileSync('manifest.json', 'utf8')) as Record<string, unknown>;

	assert.equal(manifest.id, 'anchor-flow');
	assert.equal(manifest.name, 'Anchor Flow');
	assert.match(manifest.version as string, /^\d+\.\d+\.\d+$/);
	assert.equal(manifest.author, 'ValleytheKnight');
});
