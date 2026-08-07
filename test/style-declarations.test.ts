import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeAnchorStyleDeclarations } from '../src/style-declarations.ts';

void test('left position sets a left float, explicit width, and the stacking-context fix', () => {
	const decl = computeAnchorStyleDeclarations({ position: 'left', width: 220 });
	assert.equal(decl.float, 'left');
	assert.equal(decl.width, '220px');
	assert.equal(decl.position, 'relative');
	assert.equal(decl.zIndex, '1');
	assert.match(decl.margin as string, /var\(--size-4-3\)/);
});

void test('right position sets a right float and mirrors the margin', () => {
	const decl = computeAnchorStyleDeclarations({ position: 'right', width: 180 });
	assert.equal(decl.float, 'right');
	assert.equal(decl.width, '180px');
	assert.match(decl.margin as string, /0 0 var\(--size-4-2\) var\(--size-4-3\)/);
});

void test('full position stretches to 100 percent width and clears any float', () => {
	const decl = computeAnchorStyleDeclarations({ position: 'full', width: 400 });
	assert.equal(decl.display, 'block');
	assert.equal(decl.width, '100%');
	assert.equal(decl.float, 'none');
	assert.equal(decl.position, 'relative');
	assert.equal(decl.zIndex, '1');
});
