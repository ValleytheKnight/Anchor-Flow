import { ANCHOR_IMAGE_CLASS } from './types.ts';
import { readAnchorState } from './anchor-image.ts';
import { computeAnchorStyleDeclarations } from './style-declarations.ts';

/*
 * eslint-plugin-obsidianmd's no-forbidden-elements rule blocks creating and
 * attaching a <style> element, the same finding already carried forward
 * from Linked Text Styles' rendering layer. setCssStyles per managed
 * element is the sanctioned mechanism instead of a shared stylesheet.
 */
export function applyAnchorStyles(root: HTMLElement): void {
	const images = root.querySelectorAll<HTMLImageElement>(`img.${ANCHOR_IMAGE_CLASS}`);
	images.forEach((img) => {
		const state = readAnchorState(img);
		if (!state) {
			return;
		}
		img.setCssStyles(computeAnchorStyleDeclarations(state));
	});
}
