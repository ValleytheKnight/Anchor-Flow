import { ANCHOR_IMAGE_CLASS, ANCHOR_POSITION_ATTR, type AnchorImageState, type AnchorPosition } from './types.ts';

const VALID_POSITIONS: readonly AnchorPosition[] = ['left', 'right', 'full'];

function escapeAttribute(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

export function buildAnchorImageTag(resourcePath: string, state: AnchorImageState): string {
	const width = Math.max(1, Math.round(state.width));
	return (
		`<img src="${escapeAttribute(resourcePath)}" class="${ANCHOR_IMAGE_CLASS}" ` +
		`${ANCHOR_POSITION_ATTR}="${state.position}" data-anchor-flow-width="${width}" />`
	);
}

export function isAnchorManaged(img: Pick<HTMLImageElement, 'classList'>): boolean {
	return img.classList.contains(ANCHOR_IMAGE_CLASS);
}

export function readAnchorState(img: HTMLImageElement): AnchorImageState | null {
	if (!isAnchorManaged(img)) {
		return null;
	}

	const position = img.getAttribute(ANCHOR_POSITION_ATTR);
	const widthRaw = img.getAttribute('data-anchor-flow-width');
	const width = widthRaw === null ? Number.NaN : Number.parseInt(widthRaw, 10);

	if (!position || !VALID_POSITIONS.includes(position as AnchorPosition) || Number.isNaN(width) || width <= 0) {
		return null;
	}

	return { position: position as AnchorPosition, width };
}
