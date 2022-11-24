import { AnnotateNodeWithIndexInfo } from '../types';

export type SelectionType = 'Caret' | 'Range';

export type SelectionElement = {
	key: string;
	offset: number;
};

export type SetSelectionOptions = {
	anchor: SelectionElement;
	focus: SelectionElement;
};

export type WriteBackup = {
	selectedNodes: AnnotateNodeWithIndexInfo[];
	selection: SetSelectionOptions;
};
