import { EditorState } from '../../lib/editor-state/EditorState';
import { getDefaultEditorState } from '../testUtils';
import { WriteCommand } from './WriteCommand';

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

describe('execute method', () => {
	describe('nothing selected', () => {
		it('should do nothing when there is no selection', () => {
			const { editorState } = setup();
			const writeCommand = new WriteCommand(editorState, { text: 'Z' });

			const executed = writeCommand.execute();

			const nodesArray = [...editorState.nodes];
			expect(executed).toBe(false);
			expect(nodesArray[0][1].text).toBe('Lorem ipsum');
			expect(editorState.selection.anchor).toEqual(null);
			expect(editorState.selection.focus).toEqual(null);
		});

		it('should add text at the begging of first line', () => {
			const { editorState } = setup();
			const writeCommand = new WriteCommand(editorState, { text: 'Z' });
			editorState.selection.set({
				anchor: { key: 'first', offset: 0 },
				focus: { key: 'first', offset: 0 },
			});

			const executed = writeCommand.execute();

			const nodesArray = [...editorState.nodes];
			expect(executed).toBe(true);
			expect(nodesArray[0][1].text).toBe('ZLorem ipsum');
			expect(editorState.selection.anchor).toEqual({ key: 'first', offset: 1 });
			expect(editorState.selection.focus).toEqual({ key: 'first', offset: 1 });
		});

		it('should add text in middle of second line', () => {
			const { editorState } = setup();
			const writeCommand = new WriteCommand(editorState, { text: 'Z' });
			editorState.selection.set({
				anchor: { key: 'second', offset: 5 },
				focus: { key: 'second', offset: 5 },
			});

			const executed = writeCommand.execute();

			const nodesArray = [...editorState.nodes];
			expect(executed).toBe(true);
			expect(nodesArray[1][1].text).toBe('dolorZ sit');
			expect(editorState.selection.anchor).toEqual({ key: 'second', offset: 6 });
			expect(editorState.selection.focus).toEqual({ key: 'second', offset: 6 });
		});

		it('should add text at the end of first line', () => {
			const { editorState } = setup();
			const writeCommand = new WriteCommand(editorState, { text: 'Z' });
			editorState.selection.set({
				anchor: { key: 'first', offset: 11 },
				focus: { key: 'first', offset: 11 },
			});

			const executed = writeCommand.execute();

			const nodesArray = [...editorState.nodes];
			expect(executed).toBe(true);
			expect(nodesArray[0][1].text).toBe('Lorem ipsumZ');
			expect(editorState.selection.anchor).toEqual({ key: 'first', offset: 12 });
			expect(editorState.selection.focus).toEqual({ key: 'first', offset: 12 });
		});

		it('should add text multiple times', () => {
			const { editorState } = setup();
			const writeCommand = new WriteCommand(editorState, { text: ' ' });
			const writeCommand2 = new WriteCommand(editorState, { text: 'Y' });
			const writeCommand3 = new WriteCommand(editorState, { text: 'e' });
			const writeCommand4 = new WriteCommand(editorState, { text: 's' });
			editorState.selection.set({
				anchor: { key: 'first', offset: 11 },
				focus: { key: 'first', offset: 11 },
			});

			const executed = writeCommand.execute();
			const executed2 = writeCommand2.execute();
			const executed3 = writeCommand3.execute();
			const executed4 = writeCommand4.execute();

			const nodesArray = [...editorState.nodes];
			expect(executed).toBe(true);
			expect(executed2).toBe(true);
			expect(executed3).toBe(true);
			expect(executed4).toBe(true);
			expect(nodesArray[0][1].text).toBe('Lorem ipsum Yes');
			expect(editorState.selection.anchor).toEqual({ key: 'first', offset: 15 });
			expect(editorState.selection.focus).toEqual({ key: 'first', offset: 15 });
		});
	});

	describe('text in one line selected', () => {
		it('should delete text selection and add text in its place', () => {
			const { editorState } = setup();
			const writeCommand = new WriteCommand(editorState, { text: 'Z' });
			editorState.selection.set({
				anchor: { key: 'first', offset: 6 },
				focus: { key: 'first', offset: 11 },
			});

			const executed = writeCommand.execute();

			const nodesArray = [...editorState.nodes];
			expect(executed).toBe(true);
			expect(nodesArray[0][1].text).toBe('Lorem Z');
			expect(editorState.selection.anchor).toEqual({ key: 'first', offset: 7 });
			expect(editorState.selection.focus).toEqual({ key: 'first', offset: 7 });
		});

		it('should delete text selection and add text in its place multiple times', () => {
			const { editorState } = setup();
			const writeCommand = new WriteCommand(editorState, { text: ' ' });
			const writeCommand2 = new WriteCommand(editorState, { text: 'Y' });
			const writeCommand3 = new WriteCommand(editorState, { text: 'e' });
			const writeCommand4 = new WriteCommand(editorState, { text: 's' });
			const writeCommand5 = new WriteCommand(editorState, { text: '-' });
			editorState.selection.set({
				anchor: { key: 'first', offset: 3 },
				focus: { key: 'first', offset: 8 },
			});

			const executed = writeCommand.execute();
			const executed2 = writeCommand2.execute();
			const executed3 = writeCommand3.execute();
			editorState.selection.set({
				anchor: { key: 'first', offset: 6 },
				focus: { key: 'first', offset: 9 },
			});
			const executed4 = writeCommand4.execute();
			const executed5 = writeCommand5.execute();

			const nodesArray = [...editorState.nodes];
			expect(executed).toBe(true);
			expect(executed2).toBe(true);
			expect(executed3).toBe(true);
			expect(executed4).toBe(true);
			expect(executed5).toBe(true);
			expect(nodesArray[0][1].text).toBe('Lor Yes-');
			expect(editorState.selection.anchor).toEqual({ key: 'first', offset: 8 });
			expect(editorState.selection.focus).toEqual({ key: 'first', offset: 8 });
		});
	});
});
