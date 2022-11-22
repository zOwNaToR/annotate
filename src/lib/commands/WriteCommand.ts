import { BaseCommand } from './BaseCommand';
import { WriteCommandParams } from './commandTypes';
import { EditorStateManager } from '../editor-state-manager/EditorStateManager';
import { EditorState } from '../editor-state-manager/types';

export class WriteCommand extends BaseCommand {
	public undoable: boolean = true;
	public editorStateManager: EditorStateManager;
	public params: WriteCommandParams;

	constructor(editorState: EditorState, params: WriteCommandParams) {
		super();

		this.editorStateManager = new EditorStateManager(editorState);
		this.params = params;
	}

	public execute(): boolean {
		if (this.editorStateManager.state.selection.type === 'Range') {
			this.editorStateManager.deleteSelectionRange();
		}

		return this.editorStateManager.write(this.params.text);
	}

	public undo(): boolean {
		try {
			return true;
		} catch {
			return false;
		}
	}
}
