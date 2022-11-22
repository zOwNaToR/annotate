export type AnnotateNode = {
	type: 'text' | 'linebreak';
	text?: string;
};

export type AnnotateNodes = Map<string, AnnotateNode>;

export type AnnotateNodeWithSelectionInfo = AnnotateNode & {
	key: string;
	isSelected: boolean;
	isFirstRow: boolean;
	isLastRow: boolean;
	offsetStart?: number;
	offsetEnd?: number;
};

export type AnnotateNodesWithSelectionInfo = Map<string, AnnotateNodeWithSelectionInfo>;
