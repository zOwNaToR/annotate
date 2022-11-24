import { WriteCommand } from '../../../lib/commands/WriteCommand';
import { EditorState } from '../../../lib/editor-state/EditorState';
import { getDefaultEditorState } from '../../testUtils';

type WriterSetupOptions = {
	editorState: EditorState;
};

const getDefaultWriteOptions = (): WriterSetupOptions => ({
	editorState: getDefaultEditorState(),
});

const setup = (options: WriterSetupOptions = getDefaultWriteOptions()) => {
	return {
		editorState: options.editorState,
	};
};

it('should do nothing when there is no selection', () => {
	const { editorState } = setup();
	const writeCommand = new WriteCommand(editorState, { text: 'Z' });

	writeCommand.execute();
	const executed = writeCommand.undo();

	expect(executed).toBe(false);
	expect(editorState.selection.anchor).toEqual(null);
	expect(editorState.selection.focus).toEqual(null);
});

it('should delete text inserted by execute and restore selection Caret', () => {
	const { editorState } = setup();
	const writeCommand = new WriteCommand(editorState, { text: 'Z' });
	editorState.selection.set({
		anchor: { key: 'first', offset: 0 },
		focus: { key: 'first', offset: 0 },
	});

	writeCommand.execute();
	const executed = writeCommand.undo();

	expect(executed).toBe(true);
	expect(writeCommand.undoed).toBe(true);
	expect(editorState.nodes[0].text).toBe('Lorem ipsum');
	expect(editorState.selection.anchor).toEqual({ key: 'first', offset: 0 });
	expect(editorState.selection.focus).toEqual({ key: 'first', offset: 0 });
});

describe('selection Range', () => {
	it('should delete text inserted by execute, restore text and selection', () => {
		const { editorState } = setup();
		const writeCommand = new WriteCommand(editorState, { text: 'Z' });
		editorState.selection.set({
			anchor: { key: 'first', offset: 6 },
			focus: { key: 'first', offset: 11 },
		});

		writeCommand.execute();
		const executed = writeCommand.undo();

		expect(executed).toBe(true);
		expect(writeCommand.undoed).toBe(true);
		expect(editorState.nodes[0].text).toBe('Lorem ipsum');
		expect(editorState.selection.anchor).toEqual({ key: 'first', offset: 6 });
		expect(editorState.selection.focus).toEqual({ key: 'first', offset: 11 });
	});

	it('should delete text inserted by execute, restore text and selection on multiple lines', () => {
		const { editorState } = setup();
		const writeCommand = new WriteCommand(editorState, { text: 'Z' });
		editorState.selection.set({
			anchor: { key: 'first', offset: 6 },
			focus: { key: 'third', offset: 4 },
		});

		writeCommand.execute();
		const executed = writeCommand.undo();

		expect(executed).toBe(true);
		expect(writeCommand.undoed).toBe(true);
		expect(editorState.nodes.length).toBe(5);
		expect(editorState.nodes[0].text).toBe('Lorem ipsum');
		expect(editorState.nodes[1].text).toBe('dolor sit');
		expect(editorState.nodes[2].text).toBe('bye bye');
		expect(editorState.selection.anchor).toEqual({ key: 'first', offset: 6 });
		expect(editorState.selection.focus).toEqual({ key: 'third', offset: 4 });
	});

	it('should delete text inserted by execute, restore text and selection on multiple lines (first line completely deleted)', () => {
		const { editorState } = setup();
		const writeCommand = new WriteCommand(editorState, { text: 'Z' });
		editorState.selection.set({
			anchor: { key: 'first', offset: 0 },
			focus: { key: 'third', offset: 4 },
		});

		writeCommand.execute();
		const executed = writeCommand.undo();

		expect(executed).toBe(true);
		expect(writeCommand.undoed).toBe(true);
		expect(editorState.nodes.length).toBe(5);
		expect(editorState.nodes[0].text).toBe('Lorem ipsum');
		expect(editorState.nodes[1].text).toBe('dolor sit');
		expect(editorState.nodes[2].text).toBe('bye bye');
		expect(editorState.selection.anchor).toEqual({ key: 'first', offset: 0 });
		expect(editorState.selection.focus).toEqual({ key: 'third', offset: 4 });
	});
});
