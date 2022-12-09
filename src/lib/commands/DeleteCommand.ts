import { EditorUpdater } from '../editor-updater/EditorUpdater';
import { WriteBackup } from '../editor-updater/types';
import { EditorState } from '../editor-state/EditorState';
import { BaseCommand } from './BaseCommand';

export class DeleteCommand extends BaseCommand {
	public undoable: boolean = true;

	private editorState: EditorState;
	private editorUpdater: EditorUpdater;

	private backup: WriteBackup | null = null;

	constructor(editorState: EditorState) {
		super();

		this.editorState = editorState;
		this.editorUpdater = new EditorUpdater(editorState);
	}

	public override execute(): boolean {
		if (!this.editorState.selection.isSet()) return false;

		// this.backup = {
		// 	selectedNodes: this.editorState.getSelectedNodes(),
		// 	selection: {
		// 		anchor: this.editorState.selection.anchor!,
		// 		focus: this.editorState.selection.focus!,
		// 	},
		// };

		if (this.editorState.selection.type === 'Range') {
			return this.editorUpdater.deleteSelection();
		}

		return this.editorUpdater.deleteChar();
	}

	public override undo(): boolean {
		if (!this.undoable || !this.backup) return false;

		this.undoed = true;

		return true;
	}
}
