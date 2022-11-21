export type AnnotateNode = {
	type: 'text' | 'linebreak';
	text?: string;
}

export type AnnotateNodes = Map<string, AnnotateNode>
