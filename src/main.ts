import { Plugin, Notice, type TFile } from 'obsidian';
import { DEFAULT_ANCHOR_STATE, type AnchorImageState } from './types.ts';
import { buildAnchorImageTag, readAnchorState } from './anchor-image.ts';
import { applyAnchorStyles } from './anchor-style-applier.ts';
import { locateImageSource, type LocatedImage } from './editor-image-locator.ts';
import { findMarkdownViewContaining, getCmView } from './editor-view-lookup.ts';
import { AnchorToolbar } from './toolbar-view.ts';
import { createLivePreviewAnchorPlugin } from './live-preview-anchor-plugin.ts';

export default class AnchorFlowPlugin extends Plugin {
	private toolbar = new AnchorToolbar();

	async onload(): Promise<void> {
		this.registerMarkdownPostProcessor((el) => applyAnchorStyles(el));
		this.registerEditorExtension(createLivePreviewAnchorPlugin());

		this.registerDomEvent(document, 'click', (evt) => this.handleClick(evt), true);
		this.registerDomEvent(window, 'scroll', () => this.dismissToolbar(), true);
		this.registerDomEvent(document, 'keydown', (evt) => {
			if (evt.key === 'Escape') this.dismissToolbar();
		});
		this.registerEvent(this.app.workspace.on('active-leaf-change', () => this.dismissToolbar()));

		this.register(() => this.dismissToolbar());
	}

	onunload(): void {
		this.dismissToolbar();
	}

	private handleClick(evt: MouseEvent): void {
		const target = evt.target;
		if (!(target instanceof Node)) {
			return;
		}

		if (this.toolbar.contains(target)) {
			return;
		}

		if (target.instanceOf(HTMLImageElement)) {
			this.openToolbarFor(target);
			return;
		}

		this.dismissToolbar();
	}

	private openToolbarFor(img: HTMLImageElement): void {
		const state = readAnchorState(img) ?? DEFAULT_ANCHOR_STATE;
		const rect = img.getBoundingClientRect();
		this.toolbar.show(rect, state, {
			onPositionChange: (position) => this.applyChange(img, { ...state, position }),
			onWidthChange: (width) => this.applyChange(img, { ...state, width }),
			onDismiss: () => this.dismissToolbar(),
		});
	}

	private applyChange(img: HTMLImageElement, nextState: AnchorImageState): void {
		const view = findMarkdownViewContaining(this.app, img);
		if (!view) {
			new Notice('Anchor flow: could not find this note in the editor.');
			return;
		}

		const cmView = getCmView(view);
		if (!cmView) {
			new Notice('Anchor flow: could not find this image in the editor.');
			return;
		}

		const located = locateImageSource(cmView, img);
		if (!located) {
			new Notice('Anchor flow: could not find this image in the note to update it.');
			return;
		}

		const resourcePath = this.resolveResourcePath(img, located, view.file);
		if (!resourcePath) {
			new Notice('Anchor flow: could not resolve this image file.');
			return;
		}

		const html = buildAnchorImageTag(resourcePath, nextState);
		const from = view.editor.offsetToPos(located.from);
		const to = view.editor.offsetToPos(located.to);
		view.editor.replaceRange(html, from, to);

		this.dismissToolbar();
	}

	private resolveResourcePath(img: HTMLImageElement, located: LocatedImage, sourceFile: TFile | null): string | null {
		if (located.match.kind === 'anchor-image') {
			return img.getAttribute('src');
		}

		const filename = located.match.filename;
		if (!filename || !sourceFile) {
			return null;
		}

		const dest = this.app.metadataCache.getFirstLinkpathDest(filename, sourceFile.path);
		if (!dest) {
			return null;
		}

		return this.app.vault.getResourcePath(dest);
	}

	private dismissToolbar(): void {
		this.toolbar.remove();
	}
}
