import { EditorState } from '../../../lib/editor-state/EditorState';
import { getDefaultEditorState } from '../../testUtils';
import { WriteCommand } from '../../../lib/commands/WriteCommand';

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

// it('should do nothing when there is no selection', () => {
// 	const { editorState } = setup();
// 	const writeCommand = new WriteCommand(editorState, { text: 'Z' });

// 	const executed = writeCommand.execute();

// 	const nodesArray = [...editorState.nodes];
// 	expect(executed).toBe(false);
// 	expect(nodesArray[0][1].text).toBe('Lorem ipsum');
// 	expect(editorState.selection.anchor).toEqual(null);
// 	expect(editorState.selection.focus).toEqual(null);
// });