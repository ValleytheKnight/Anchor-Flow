export type AnchorPosition = 'left' | 'right' | 'full';

export interface AnchorImageState {
	position: AnchorPosition;
	width: number;
}

export const DEFAULT_ANCHOR_STATE: AnchorImageState = {
	position: 'left',
	width: 220,
};

export const ANCHOR_IMAGE_CLASS = 'anchor-flow-img';
export const ANCHOR_POSITION_ATTR = 'data-anchor-flow-position';
