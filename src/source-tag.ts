export type SourceTagKind = 'wikilink-embed' | 'anchor-image';

export interface SourceTagMatch {
	kind: SourceTagKind;
	text: string;
	length: number;
	filename?: string;
}

const WIKILINK_EMBED_RE = /^!\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/;
const ANCHOR_IMG_RE = /^<img\b[^>]*?\/?>/;

/*
 * Anchored at a known offset (the start of a clicked image's own source
 * range, from posAtDOM), not a whole-line search, since the same line can
 * legitimately contain other content before or after the tag this needs to
 * isolate.
 */
export function matchSourceTagAt(lineText: string, offset: number): SourceTagMatch | null {
	const remainder = lineText.slice(offset);

	const wikilinkMatch = remainder.match(WIKILINK_EMBED_RE);
	if (wikilinkMatch) {
		return {
			kind: 'wikilink-embed',
			text: wikilinkMatch[0],
			length: wikilinkMatch[0].length,
			filename: wikilinkMatch[1],
		};
	}

	const imgMatch = remainder.match(ANCHOR_IMG_RE);
	if (imgMatch) {
		return { kind: 'anchor-image', text: imgMatch[0], length: imgMatch[0].length };
	}

	return null;
}
