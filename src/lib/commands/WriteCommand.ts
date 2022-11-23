import { EditorStateManager } from '../editor-state-manager/EditorStateManager';
import { EditorState, WriteBackup } from '../editor-state-manager/types';
import { BaseCommand } from './BaseCommand';
import { WriteCommandParams } from './commandTypes';

export class WriteCommand extends BaseCommand {
	public undoable: boolean = true;

	private editorStateManager: EditorStateManager;
	private params: WriteCommandParams;
	private writeBackup: WriteBackup | null = null;

	constructor(editorState: EditorState, params: WriteCommandParams) {
		super();

		this.editorStateManager = new EditorStateManager(editorState);
		this.params = params;
	}

	public override execute(): boolean {
		if (this.editorStateManager.state.selection.type === 'Range') {
			this.editorStateManager.deleteSelectionRange();
		}

		this.writeBackup = this.editorStateManager.write(this.params.text);

		return this.writeBackup != null;
	}

	public override undo(): boolean {
		if (!this.writeBackup) return false;

		const result = this.editorStateManager.deleteNodeText(
			this.writeBackup.nodeKey,
			this.writeBackup.offset,
			this.writeBackup.offset + this.writeBackup.text.length
		);

		this.undoed = result;

		return result;
	}
}
