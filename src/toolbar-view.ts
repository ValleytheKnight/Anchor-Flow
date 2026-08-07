import type { AnchorImageState, AnchorPosition } from './types.ts';
import { computeToolbarPosition, type Rect } from './geometry.ts';

export interface ToolbarCallbacks {
	onPositionChange: (position: AnchorPosition) => void;
	onWidthChange: (width: number) => void;
	onDismiss: () => void;
}

const POSITION_LABELS: Record<AnchorPosition, string> = {
	left: 'Left',
	right: 'Right',
	full: 'Full-width',
};

export class AnchorToolbar {
	private el: HTMLElement | null = null;

	get element(): HTMLElement | null {
		return this.el;
	}

	show(imageRect: Rect, state: AnchorImageState, callbacks: ToolbarCallbacks): void {
		this.remove();

		const el = document.body.createDiv({ cls: 'anchor-flow-toolbar' });

		(Object.keys(POSITION_LABELS) as AnchorPosition[]).forEach((position) => {
			const btn = el.createEl('button', {
				text: POSITION_LABELS[position],
				cls: position === state.position ? 'anchor-flow-toolbar-btn is-active' : 'anchor-flow-toolbar-btn',
			});
			btn.addEventListener('click', (evt) => {
				evt.preventDefault();
				evt.stopPropagation();
				callbacks.onPositionChange(position);
			});
		});

		if (state.position !== 'full') {
			const widthInput = el.createEl('input', {
				type: 'text',
				cls: 'anchor-flow-toolbar-width',
				attr: { inputmode: 'numeric', 'aria-label': 'Image width in pixels' },
			});
			widthInput.value = String(state.width);
			widthInput.addEventListener('click', (evt) => evt.stopPropagation());
			widthInput.addEventListener('change', () => {
				const parsed = Number.parseInt(widthInput.value, 10);
				if (!Number.isNaN(parsed) && parsed > 0) {
					callbacks.onWidthChange(parsed);
				}
			});
		}

		document.body.appendChild(el);
		this.el = el;

		const toolbarRect = el.getBoundingClientRect();
		const point = computeToolbarPosition(
			imageRect,
			{ width: toolbarRect.width, height: toolbarRect.height },
			{ width: window.innerWidth, height: window.innerHeight },
		);
		el.setCssStyles({ top: `${point.top}px`, left: `${point.left}px` });
	}

	contains(node: Node): boolean {
		return this.el ? this.el.contains(node) : false;
	}

	remove(): void {
		if (this.el) {
			this.el.remove();
			this.el = null;
		}
	}
}
