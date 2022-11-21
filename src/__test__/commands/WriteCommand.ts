import { BaseCommand } from '../../lib/commands/BaseCommand';
import { WriteCommandParams } from '../../lib/commands/commandTypes';
import { EditorState } from '../../lib/editor-state/EditorState';
import { addTextAtIndex } from '../../lib/utils';

export class WriteCommand extends BaseCommand {
	public undoable: boolean = true;
	public editorState: EditorState;
	public params: WriteCommandParams;

	constructor(editorState: EditorState, params: WriteCommandParams) {
		super();

		this.editorState = editorState;
		this.params = params;
	}

	public execute(): boolean {
		const { nodeKey, nodeOffset, text } = this.params;

		const node = this.editorState.nodes.get(nodeKey);
		if (!node) return false;

		node.text = addTextAtIndex(node.text ?? '', nodeOffset, text);

		this.editorState.selection.set({
			anchor: {
				key: nodeKey,
				offset: nodeOffset + text.length,
			},
			focus: {
				key: nodeKey,
				offset: nodeOffset + text.length,
			},
		});

		return true;
	}

	public undo(): boolean {
		try {
			return true;
		} catch {
			return false;
		}
	}
}
