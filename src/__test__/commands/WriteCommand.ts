import { BaseCommand } from '../../lib/commands/BaseCommand';
import { WriteCommandParams } from '../../lib/commands/commandTypes';
import { EditorState } from '../../lib/editor-state/EditorState';
import { replaceText } from '../../lib/utils';

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
		if (!this.editorState.selection.isSet()) return false;

		const { text } = this.params;
		const anchor = this.editorState.selection.anchor!;
		const focus = this.editorState.selection.focus!;

		const anchorNode = this.editorState.nodes.get(anchor.key);
		if (!anchorNode) return false;

		const startOffset = Math.min(anchor.offset ?? 0, focus.offset ?? 0);
		const endOffset = Math.max(anchor.offset ?? 0, focus.offset ?? 0);

		anchorNode.text = replaceText(anchorNode.text ?? '', startOffset, endOffset, text);

		this.editorState.selection.set({
			anchor: {
				key: anchor.key,
				offset: startOffset + text.length,
			},
			focus: {
				key: anchor.key,
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
