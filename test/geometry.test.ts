import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeToolbarPosition } from '../src/geometry.ts';

const viewport = { width: 1000, height: 800 };

void test('positions above the image when there is room', () => {
	const imageRect = { top: 200, left: 100, right: 300, bottom: 400, width: 200, height: 200 };
	const point = computeToolbarPosition(imageRect, { width: 150, height: 40 }, viewport);
	assert.equal(point.top, 200 - 40 - 6);
	assert.equal(point.left, 100);
});

void test('flips below the image when there is no room above', () => {
	const imageRect = { top: 10, left: 100, right: 300, bottom: 210, width: 200, height: 200 };
	const point = computeToolbarPosition(imageRect, { width: 150, height: 40 }, viewport);
	assert.equal(point.top, 210 + 6);
});

void test('clamps left within the viewport when the image sits near the right edge', () => {
	const imageRect = { top: 200, left: 950, right: 1150, bottom: 400, width: 200, height: 200 };
	const point = computeToolbarPosition(imageRect, { width: 150, height: 40 }, viewport);
	assert.equal(point.left, viewport.width - 150 - 4);
});

void test('clamps left to the minimum margin when the image sits near the left edge', () => {
	const imageRect = { top: 200, left: -20, right: 180, bottom: 400, width: 200, height: 200 };
	const point = computeToolbarPosition(imageRect, { width: 150, height: 40 }, viewport);
	assert.equal(point.left, 4);
});
