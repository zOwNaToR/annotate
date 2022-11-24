import { SetSelectionOptions } from '../editor-state/types';
import { AnnotateNodeWithIndexInfo } from '../types';

export type WriteBackup = {
	selectedNodes: AnnotateNodeWithIndexInfo[];
	selection: SetSelectionOptions;
};
