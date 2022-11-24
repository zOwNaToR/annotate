import { EditorUpdater } from '../editor-updater/EditorUpdater';
import { WriteBackup } from '../editor-updater/types';
import { EditorState } from '../editor-state/EditorState';
import { BaseCommand } from './BaseCommand';
import { WriteCommandParams } from './commandTypes';

export class WriteCommand extends BaseCommand {
	public undoable: boolean = true;

	private editorState: EditorState;
	private editorUpdater: EditorUpdater;

	private params: WriteCommandParams;
	private backup: WriteBackup | null = null;

	constructor(editorState: EditorState, params: WriteCommandParams) {
		super();

		this.editorState = editorState;
		this.editorUpdater = new EditorUpdater(editorState);
		this.params = params;
	}

	public override execute(): boolean {
		if (!this.editorState.selection.isSet()) return false;

		this.backup = {
			selectedNodes: this.editorState.getSelectedNodes(),
			selection: {
				anchor: this.editorState.selection.anchor!,
				focus: this.editorState.selection.focus!,
			},
		};

		if (this.editorState.selection.type === 'Range') {
			this.editorUpdater.deleteSelectionRange();
		}

		return this.editorUpdater.write(this.params.text);
	}

	public override undo(): boolean {
		if (!this.undoable || !this.backup) return false;

		this.editorUpdater.setSelection(this.backup.selection);
		this.editorUpdater.replaceNodes(this.backup.selectedNodes);

		this.undoed = true;

		return true;
	}
}
