import { MarkdownView, type App } from 'obsidian';
import type { EditorView } from '@codemirror/view';

/*
 * EditorView.findFromDOM does not reliably resolve a node inside
 * Obsidian's own native embed widget (confirmed live: it returns null for
 * an image inside an internal embed even though the node is genuinely
 * connected and part of a live CodeMirror editor). Walking up to the
 * view's own container element and matching it against the workspace's
 * markdown leaves is the reliable way to recover the owning view instead.
 */
export function findMarkdownViewContaining(app: App, node: Node): MarkdownView | null {
	const el = node.instanceOf(Element) ? node : node.parentElement;
	const container = el?.closest('.workspace-leaf-content');
	if (!container) {
		return null;
	}

	const leaves = app.workspace.getLeavesOfType('markdown');
	const match = leaves.find((leaf) => leaf.view.containerEl === container);
	return match ? (match.view as MarkdownView) : null;
}

/*
 * Editor.cm is not part of the public Editor abstract class in
 * obsidian.d.ts, only on the concrete implementation Obsidian actually
 * provides, but it is the standard, reliable way plugins reach the
 * underlying CodeMirror 6 EditorView, confirmed live throughout this
 * project's own investigation.
 */
export function getCmView(view: MarkdownView): EditorView | null {
	const withCm = view.editor as unknown as { cm?: EditorView };
	return withCm.cm ?? null;
}
