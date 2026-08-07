export interface Rect {
	top: number;
	left: number;
	right: number;
	bottom: number;
	width: number;
	height: number;
}

export interface Size {
	width: number;
	height: number;
}

export interface Point {
	top: number;
	left: number;
}

/*
 * Prefers sitting above the image, clear of the top-right corner where
 * Obsidian renders its own native embed controls when they're visible.
 * Those controls must stay usable and untouched, so this toolbar's job is
 * to find a position that stays out of their way, not to override them.
 */
export function computeToolbarPosition(imageRect: Rect, toolbarSize: Size, viewport: Size, gap = 6): Point {
	let top = imageRect.top - toolbarSize.height - gap;
	if (top < 0) {
		top = imageRect.bottom + gap;
	}

	let left = imageRect.left;
	const maxLeft = viewport.width - toolbarSize.width - 4;
	if (left > maxLeft) {
		left = maxLeft;
	}
	if (left < 4) {
		left = 4;
	}

	return { top, left };
}
