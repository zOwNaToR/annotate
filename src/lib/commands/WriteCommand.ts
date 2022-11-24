import { EditorStateManager } from '../editor-state-manager/EditorStateManager';
import { EditorState, WriteBackup } from '../editor-state-manager/types';
import { BaseCommand } from './BaseCommand';
import { WriteCommandParams } from './commandTypes';

export class WriteCommand extends BaseCommand {
	public undoable: boolean = true;

	private editorStateManager: EditorStateManager;
	private params: WriteCommandParams;
	private backup: WriteBackup | null = null;

	constructor(editorState: EditorState, params: WriteCommandParams) {
		super();

		this.editorStateManager = new EditorStateManager(editorState);
		this.params = params;
	}

	public override execute(): boolean {
		if (!this.editorStateManager.state.selection.isSet()) return false

		this.backup = {
			selectedNodes: this.editorStateManager.getSelectedNodes(),
			selection: {
				anchor: this.editorStateManager.state.selection.anchor!,
				focus: this.editorStateManager.state.selection.focus!,
			},
		};

		if (this.editorStateManager.state.selection.type === 'Range') {
			this.editorStateManager.deleteSelectionRange();
		}

		return this.editorStateManager.write(this.params.text);
	}

	public override undo(): boolean {
		if (!this.undoable || !this.backup) return false;

		this.editorStateManager.setSelection(this.backup.selection)
		this.editorStateManager.replaceNodes(this.backup.selectedNodes)
		
		this.undoed = true;

		return true;
	}
}

/*

beforeWrite: 1 offset 8 - 3 offset 3
afterWrite: 1 ofset 9

Hi
how are you?
I'm fine
thanks
=>
Hi
how are Znks

--- Mi devo salvare la selection e questi nodi:
you?
I'm fine
tha

---Oppure potrei salvare la selection e tutti i nodi selected
*/