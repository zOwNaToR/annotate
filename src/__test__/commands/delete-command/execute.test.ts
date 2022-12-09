import { getDefaultEditorState } from '../../testUtils';
import { DeleteCommand } from '../../../lib/commands/DeleteCommand';
import { EditorState } from '../../../lib/editor-state/EditorState';

type DeleteSetupOptions = {
	editorState: EditorState;
};

const getDefaultDeleteOptions = (): DeleteSetupOptions => ({
	editorState: getDefaultEditorState(),
});

const setup = (options: DeleteSetupOptions = getDefaultDeleteOptions()) => {
	return {
		editorState: options.editorState,
	};
};

it('should do nothing when there is no selection', () => {
	const { editorState } = setup();
	const deleteCommand = new DeleteCommand(editorState);

	const executed = deleteCommand.execute();

	expect(executed).toBe(false);
	expect(editorState.nodes[0].text).toBe('Lorem ipsum');
	expect(editorState.selection.anchor).toEqual(null);
	expect(editorState.selection.focus).toEqual(null);
});
