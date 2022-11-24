import { EditorState } from '../editor-state/EditorState';
import { AnnotateNodeWithIndexInfo } from '../types';
import { replaceText } from '../utils';

export class EditorUpdater {
	private state: EditorState;

	constructor(state: EditorState) {
		this.state = state;
	}

	public setSelection = (options: Parameters<typeof this.state.selection.set>[0]) =>
		this.state.selection.set(options);

	public replaceNodes = (newNodes: AnnotateNodeWithIndexInfo[]) => {
		newNodes.forEach((newNode) => {
			let node = this.state.findNode(newNode.key);

			if (!node) {
				this.state.nodes.splice(newNode.index, 0, newNode);

				return;
			}

			node.text = newNode.text;
			node.type = newNode.type;
		});
	};

	public write = (text: string): boolean => {
		const anchor = this.state.selection.anchor;
		const focus = this.state.selection.focus;

		if (!anchor || !focus) return false;

		const anchorNode = this.state.findNode(anchor.key);
		if (!anchorNode) return false;

		const startOffset = Math.min(anchor.offset ?? 0, focus.offset ?? 0);
		const endOffset = Math.max(anchor.offset ?? 0, focus.offset ?? 0);

		anchorNode.text = replaceText(anchorNode.text ?? '', startOffset, endOffset, text);

		this.state.selection.set({
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
	};

	public deleteSelectionRange = (): boolean => {
		if (!this.state.canDeleteSelection()) return false;

		const nodesInfo = this.state.getNodesSelectionInfo();
		const isMultipleRows = nodesInfo.filter((x) => x.isSelected).length > 1;
		const startNode = nodesInfo.find((x) => x.isFirstRow)!;
		const endNode = nodesInfo.find((x) => x.isLastRow)!;

		const shouldDeleteLastNode = isMultipleRows && endNode.offsetEnd === endNode!.text?.length;
		const shouldDeleteFirstNode =
			!shouldDeleteLastNode && isMultipleRows && startNode.offsetStart === 0;

		const shouldMergeFirstAndLastNodes =
			isMultipleRows && !shouldDeleteFirstNode && !shouldDeleteLastNode;

		nodesInfo.forEach((node) => {
			const isMiddleRow = node.isSelected && !node.isFirstRow && !node.isLastRow;

			const shouldDeleteNode =
				isMultipleRows &&
				(isMiddleRow ||
					(shouldDeleteFirstNode && node.isFirstRow) ||
					(shouldDeleteLastNode && node.isLastRow));

			if (shouldDeleteNode) {
				this.state.deleteNode(node.key);
			} else if (node.isSelected) {
				this.state.deleteNodeText(node.key, node.offsetStart!, node.offsetEnd!);
			}
		});

		if (shouldMergeFirstAndLastNodes) {
			this.state.mergeNodes(startNode.key, endNode.key);
		}

		const newSelection = shouldDeleteFirstNode ? endNode : startNode;

		this.state.selection.set({
			anchor: {
				key: newSelection.key,
				offset: newSelection.offsetStart!,
			},
			focus: {
				key: newSelection.key,
				offset: newSelection.offsetStart!,
			},
		});

		return true;
	};
}
