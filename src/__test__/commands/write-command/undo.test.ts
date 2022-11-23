import { WriteCommand } from '../../../lib/commands/WriteCommand';
import { EditorState } from '../../../lib/editor-state-manager/types';
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