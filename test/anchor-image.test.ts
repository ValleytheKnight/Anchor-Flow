import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildAnchorImageTag, isAnchorManaged, readAnchorState } from '../src/anchor-image.ts';
import { ANCHOR_IMAGE_CLASS, ANCHOR_POSITION_ATTR } from '../src/types.ts';

function fakeImg(attrs: Record<string, string>, classes: string[]): HTMLImageElement {
	const classSet = new Set(classes);
	return {
		classList: {
			contains: (name: string) => classSet.has(name),
		},
		getAttribute: (name: string) => (Object.prototype.hasOwnProperty.call(attrs, name) ? attrs[name] : null),
	} as unknown as HTMLImageElement;
}

void test('buildAnchorImageTag produces the expected markup for a left-floated image', () => {
	const html = buildAnchorImageTag('app://resource/path.png', { position: 'left', width: 220 });
	assert.match(html, /<img /);
	assert.match(html, /src="app:\/\/resource\/path\.png"/);
	assert.match(html, new RegExp(`class="${ANCHOR_IMAGE_CLASS}"`));
	assert.match(html, new RegExp(`${ANCHOR_POSITION_ATTR}="left"`));
	assert.match(html, /data-anchor-flow-width="220"/);
});

void test('buildAnchorImageTag rounds a fractional width and floors it at 1', () => {
	assert.match(buildAnchorImageTag('src.png', { position: 'right', width: 199.6 }), /data-anchor-flow-width="200"/);
	assert.match(buildAnchorImageTag('src.png', { position: 'right', width: -5 }), /data-anchor-flow-width="1"/);
});

void test('buildAnchorImageTag escapes a quote or ampersand in the resource path', () => {
	const html = buildAnchorImageTag('a&b"c.png', { position: 'full', width: 300 });
	assert.match(html, /src="a&amp;b&quot;c\.png"/);
});

void test('isAnchorManaged is true only when the marker class is present', () => {
	assert.equal(isAnchorManaged(fakeImg({}, [ANCHOR_IMAGE_CLASS])), true);
	assert.equal(isAnchorManaged(fakeImg({}, ['some-other-class'])), false);
});

void test('readAnchorState reads a valid managed image back correctly', () => {
	const img = fakeImg({ [ANCHOR_POSITION_ATTR]: 'right', 'data-anchor-flow-width': '340' }, [ANCHOR_IMAGE_CLASS]);
	assert.deepEqual(readAnchorState(img), { position: 'right', width: 340 });
});

void test('readAnchorState returns null for an image missing the marker class', () => {
	const img = fakeImg({ [ANCHOR_POSITION_ATTR]: 'left', 'data-anchor-flow-width': '200' }, []);
	assert.equal(readAnchorState(img), null);
});

void test('readAnchorState returns null for an invalid or missing position', () => {
	const bogus = fakeImg({ [ANCHOR_POSITION_ATTR]: 'diagonal', 'data-anchor-flow-width': '200' }, [ANCHOR_IMAGE_CLASS]);
	assert.equal(readAnchorState(bogus), null);

	const missing = fakeImg({ 'data-anchor-flow-width': '200' }, [ANCHOR_IMAGE_CLASS]);
	assert.equal(readAnchorState(missing), null);
});

void test('readAnchorState returns null for a missing, non-numeric, or non-positive width', () => {
	const missing = fakeImg({ [ANCHOR_POSITION_ATTR]: 'left' }, [ANCHOR_IMAGE_CLASS]);
	assert.equal(readAnchorState(missing), null);

	const nonNumeric = fakeImg({ [ANCHOR_POSITION_ATTR]: 'left', 'data-anchor-flow-width': 'wide' }, [ANCHOR_IMAGE_CLASS]);
	assert.equal(readAnchorState(nonNumeric), null);

	const zero = fakeImg({ [ANCHOR_POSITION_ATTR]: 'left', 'data-anchor-flow-width': '0' }, [ANCHOR_IMAGE_CLASS]);
	assert.equal(readAnchorState(zero), null);
});
