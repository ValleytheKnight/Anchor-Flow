import { Plugin } from 'obsidian';

export default class AnchorFlowPlugin extends Plugin {
	async onload(): Promise<void> {
		// Scaffold only. Toolbar/positioning logic is gated on the
		// image-selection-detection risk test's result.
	}

	onunload(): void {}
}
