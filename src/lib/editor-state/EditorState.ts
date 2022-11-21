import { AnnotateNodes } from "../types";
import { AnnotateSelection } from "./AnnotateSelection";

export type EditorState = {
   nodes: AnnotateNodes
   selection: AnnotateSelection
}

export type AnnotateNode = {
   key: string;
	type: 'text' | 'linebreak';
	text?: string;
}
