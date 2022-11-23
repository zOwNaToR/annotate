import { BaseCommand } from './BaseCommand';
import { WriteCommandParams } from './commandTypes';
import { EditorStateManager } from '../editor-state-manager/EditorStateManager';
import { EditorState, WriteBackup } from '../editor-state-manager/types';
import { replaceText } from '../utils';

export class WriteCommand extends BaseCommand {
	public undoable: boolean = true;
	public editorStateManager: EditorStateManager;
	public params: WriteCommandParams;
	private writeBackup: WriteBackup | null = null;

	constructor(editorState: EditorState, params: WriteCommandParams) {
		super();

		this.editorStateManager = new EditorStateManager(editorState);
		this.params = params;
	}

	public execute(): boolean {
		if (this.editorStateManager.state.selection.type === 'Range') {
			this.editorStateManager.deleteSelectionRange();
		}

		this.writeBackup = this.editorStateManager.write(this.params.text);

		return this.writeBackup != null;
	}

	public undo(): boolean {
		if (!this.writeBackup) return false;

		const node = this.editorStateManager.state.nodes.get(this.writeBackup.nodeKey);
		if (!node) return false;

		node.text = replaceText(
			node.text ?? '',
			this.writeBackup.offset,
			this.writeBackup.offset + this.writeBackup.text.length,
			''
		);

		this.undoed = true;

		return true;
	}
}
