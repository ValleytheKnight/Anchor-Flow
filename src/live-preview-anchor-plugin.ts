import { ViewPlugin, type EditorView, type ViewUpdate } from '@codemirror/view';
import { applyAnchorStyles } from './anchor-style-applier.ts';

/*
 * registerMarkdownPostProcessor only covers Reading mode, not Live
 * Preview, so the same style application needs its own CodeMirror
 * ViewPlugin here, re-run on load and on every doc/viewport change.
 */
export function createLivePreviewAnchorPlugin() {
	return ViewPlugin.fromClass(
		class {
			constructor(view: EditorView) {
				applyAnchorStyles(view.dom);
			}

			update(update: ViewUpdate): void {
				if (update.docChanged || update.viewportChanged || update.geometryChanged) {
					applyAnchorStyles(update.view.dom);
				}
			}
		},
	);
}
