export type AnnotateNode = Map<string, {
	type: 'text' | 'linebreak';
	text?: string;
}>
