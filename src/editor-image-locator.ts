import type { EditorView } from '@codemirror/view';
import { matchSourceTagAt, type SourceTagMatch } from './source-tag.ts';

export interface LocatedImage {
	from: number;
	to: number;
	match: SourceTagMatch;
}

/*
 * posAtDOM resolves to the start of a clicked image's own source range for
 * both an atomic embed widget (![[wikilink]]) and plain inline HTML (a raw
 * <img> tag), confirmed live against the running app for both cases,
 * including with trailing prose text on the same line. The regex match is
 * anchored at that resolved offset rather than searching the whole line,
 * so unrelated content elsewhere on the line is never touched.
 */
export function locateImageSource(view: EditorView, domNode: Node): LocatedImage | null {
	let pos: number;
	try {
		pos = view.posAtDOM(domNode);
	} catch {
		return null;
	}

	const line = view.state.doc.lineAt(pos);
	const offset = pos - line.from;
	const match = matchSourceTagAt(line.text, offset);
	if (!match) {
		return null;
	}

	return { from: pos, to: pos + match.length, match };
}
