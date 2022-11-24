import { AnnotateSelection } from '../lib/editor-state/AnnotateSelection';
import { EditorState } from '../lib/editor-state/EditorState';
import { AnnotateNode } from '../lib/types';

const getDefaultNodes = (): AnnotateNode[] => [
	{ key: 'first', text: 'Lorem ipsum', type: 'text' },
	{ key: 'second', text: 'dolor sit', type: 'text' },
	{ key: 'third', text: 'bye bye', type: 'text' },
	{ key: 'fourth', text: '', type: 'linebreak' },
	{ key: 'fifth', text: 'Hi how are you?', type: 'text' },
];

const getDefaultSelection = () => new AnnotateSelection();

export const getDefaultEditorState = (): EditorState =>
	new EditorState(getDefaultNodes(), getDefaultSelection());
