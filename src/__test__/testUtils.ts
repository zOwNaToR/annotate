import { AnnotateSelection } from '../lib/editor-state-manager/AnnotateSelection';
import { EditorState } from '../lib/editor-state-manager/types';
import { AnnotateNode, AnnotateNodes } from '../lib/types';

const getDefaultNodes = (): AnnotateNodes =>
	new Map<string, AnnotateNode>([
		['first', { text: 'Lorem ipsum', type: 'text' }],
		['second', { text: 'dolor sit', type: 'text' }],
		['third', { text: 'bye bye', type: 'text' }],
		['fourth', { text: '', type: 'linebreak' }],
		['fifth', { text: 'Hi how are you?', type: 'text' }],
	]);

const getDefaultSelection = () => new AnnotateSelection();

export const getDefaultEditorState = (): EditorState => ({
	nodes: getDefaultNodes(),
	selection: getDefaultSelection(),
});
