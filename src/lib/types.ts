export type AnnotateNode = {
	key: string;
	type: 'text' | 'linebreak';
	text?: string;
};

export type AnnotateNodeWithSelectionInfo = AnnotateNode & {
	isSelected: boolean;
	isFirstRow: boolean;
	isLastRow: boolean;
	offsetStart?: number;
	offsetEnd?: number;
};

export type AnnotateNodeWithIndexInfo = AnnotateNode & {
	index: number;
};
