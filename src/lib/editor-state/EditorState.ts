import { AnnotateSelection } from "./AnnotateSelection";

export type EditorState = {
   nodes: AnnotateNode[]
   selection: AnnotateSelection
}

export type AnnotateNode = {
   key: string;
	type: 'text' | 'linebreak';
	text?: string;
}
