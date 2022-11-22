import { BaseCommand } from '../../lib/commands/BaseCommand';
import { WriteCommandParams } from '../../lib/commands/commandTypes';
import { EditorState } from '../../lib/editor-state/EditorState';
import { addTextAtIndex, isUndefined, replaceText } from '../../lib/utils';

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
		const { nodeKey, text } = this.params;
		const anchorOffset = this.editorState.selection.anchor?.offset
		const focusOffset = this.editorState.selection.focus?.offset

		const node = this.editorState.nodes.get(nodeKey);
		if (!node || !this.editorState.selection.isSet()) return false;

		const startOffset = Math.min(anchorOffset ?? 0, focusOffset ?? 0)
		const endOffset = Math.max(anchorOffset ?? 0, focusOffset ?? 0)

		node.text = replaceText(node.text ?? '', startOffset, endOffset, text);

		this.editorState.selection.set({
			anchor: {
				key: nodeKey,
				offset: startOffset + text.length,
			},
			focus: {
				key: nodeKey,
				offset: startOffset + text.length,
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
