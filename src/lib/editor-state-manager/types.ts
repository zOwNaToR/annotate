import { AnnotateNodes } from "../types";
import { AnnotateSelection } from "./AnnotateSelection";

export type Direction = 'normal' | 'reverse';

export type SelectionType = 'Caret' | 'Range';

export type SelectionElement = {
   key: string,
	offset: number;
};

export type SetSelectionOptions = {
	anchor: SelectionElement;
	focus: SelectionElement;
};

export type EditorState = {
	nodes: AnnotateNodes;
	selection: AnnotateSelection;
};