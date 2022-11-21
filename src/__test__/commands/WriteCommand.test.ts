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
	it('should add text at the begging of first line', () => {
		const { editorState } = setup();
		const writeCommand = new WriteCommand(editorState, {
			nodeKey: 'first',
			nodeOffset: 0,
			text: 'Z',
		});

		writeCommand.execute();

      const nodesArray = [...editorState.nodes]
		expect(nodesArray[0][1].text).toBe('ZLorem ipsum');
		expect(editorState.selection.anchor).toEqual({ key: 'first', offset: 1 });
		expect(editorState.selection.focus).toEqual({ key: 'first', offset: 1 });
	});
});
