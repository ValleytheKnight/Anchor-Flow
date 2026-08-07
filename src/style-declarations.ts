import type { AnchorImageState } from './types.ts';

export type StyleDeclaration = Partial<CSSStyleDeclaration>;

/*
 * position:relative plus a positive z-index is not cosmetic here. Without
 * it, a floated image loses pointer hit-testing to a later, non-floated
 * sibling block box wherever the two overlap (confirmed in the Toolbar
 * Selection Risk Test: a CodeMirror .cm-line for wrapped text always
 * spans the full editor width regardless of a preceding float, and being
 * later in DOM order wins the browser's default hit-test priority there).
 */
export function computeAnchorStyleDeclarations(state: AnchorImageState): StyleDeclaration {
	const widthPx = `${state.width}px`;

	if (state.position === 'full') {
		return {
			display: 'block',
			width: '100%',
			float: 'none',
			position: 'relative',
			zIndex: '1',
			margin: 'var(--size-4-2) 0',
		};
	}

	const base: StyleDeclaration = {
		width: widthPx,
		position: 'relative',
		zIndex: '1',
		float: state.position,
	};

	if (state.position === 'left') {
		base.margin = '0 var(--size-4-3) var(--size-4-2) 0';
	} else {
		base.margin = '0 0 var(--size-4-2) var(--size-4-3)';
	}

	return base;
}
