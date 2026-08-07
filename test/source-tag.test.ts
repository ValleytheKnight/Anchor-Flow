import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matchSourceTagAt } from '../src/source-tag.ts';

void test('matches a wikilink embed alone on its own line', () => {
	const match = matchSourceTagAt('![[test-image.png]]', 0);
	assert.equal(match?.kind, 'wikilink-embed');
	assert.equal(match?.text, '![[test-image.png]]');
	assert.equal(match?.filename, 'test-image.png');
});

void test('matches a wikilink embed with a display alias, filename excludes the alias', () => {
	const match = matchSourceTagAt('![[test-image.png|a caption]] some trailing text', 0);
	assert.equal(match?.kind, 'wikilink-embed');
	assert.equal(match?.text, '![[test-image.png|a caption]]');
	assert.equal(match?.filename, 'test-image.png');
});

void test('matches a raw anchor img tag with trailing prose on the same line', () => {
	const line = '<img src="app://x/y.png" class="anchor-flow-img" /> Lorem ipsum dolor sit amet.';
	const match = matchSourceTagAt(line, 0);
	assert.equal(match?.kind, 'anchor-image');
	assert.equal(match?.text, '<img src="app://x/y.png" class="anchor-flow-img" />');
});

void test('matches an img tag preceded by other text, anchored at the given offset', () => {
	const line = 'Some heading text <img src="a.png" />';
	const offset = line.indexOf('<img');
	const match = matchSourceTagAt(line, offset);
	assert.equal(match?.kind, 'anchor-image');
	assert.equal(match?.text, '<img src="a.png" />');
});

void test('returns null when the offset does not point at a recognized tag', () => {
	assert.equal(matchSourceTagAt('just some plain paragraph text', 0), null);
	assert.equal(matchSourceTagAt('![[test-image.png]]', 1), null);
});

void test('does not match a markdown-style image link, only wikilink embeds and raw img tags', () => {
	assert.equal(matchSourceTagAt('![alt text](path/to/image.png)', 0), null);
});
