import { AnnotateNodes, AnnotateNodeWithSelectionInfo } from '../types';
import { isBetween, replaceText } from '../utils';
import { AnnotateSelection } from './AnnotateSelection';
import { Direction } from './EditorState.types';

export type EditorState = {
	nodes: AnnotateNodes;
	selection: AnnotateSelection;
};

export class EditorStateManager {
	public state: EditorState;

	constructor(state: EditorState) {
		this.state = state;
	}

	public write = (text: string): boolean => {
		const anchor = this.state.selection.anchor;
		const focus = this.state.selection.focus;

		if (!anchor || !focus) return false;

		const anchorNode = this.state.nodes.get(anchor.key);
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
		if (!this.canDeleteSelectionRange()) return false;

		const nodesInfo = this.getNodesSelectionInfo();
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
				this.deleteNode(node.key);
			} else if (node.isSelected) {
				this.deleteNodeText(node.key, node.offsetStart!, node.offsetEnd!);
			}
		});

		if (shouldMergeFirstAndLastNodes) {
			this.mergeNodes(startNode.key, endNode.key);
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

	private getDirection = (): Direction => {
		if (!this.state.selection.isSet()) return 'normal';

		const { anchor, focus } = this.state.selection;

		const anchorIndex = this.findNodeIndex(anchor!.key);
		const focusIndex = this.findNodeIndex(focus!.key);

		const isFocusBeforeAnchor =
			focusIndex < anchorIndex || (anchorIndex === focusIndex && focus!.offset < anchor!.offset);

		if (isFocusBeforeAnchor) return 'reverse';

		return 'normal';
	};

	private mergeNodes = (startNodeKey: string, endNodeKey: string) => {
		const startNode = this.state.nodes.get(startNodeKey);
		const endNode = this.state.nodes.get(endNodeKey);

		if (!startNode || !endNode) return;

		if (endNode.type === 'text') {
			startNode.type = 'text';

			startNode.text = (startNode.text ?? '') + (endNode.text ?? '');
		}

		this.deleteNode(endNodeKey);
	};

	private deleteNode = (nodeKey: string) => this.state.nodes.delete(nodeKey);

	private deleteNodeText = (nodeKey: string, from: number, to: number) => {
		const node = this.state.nodes.get(nodeKey);
		if (!node || !node.text) return;

		node.text = replaceText(node.text, from, to, '');
	};

	private getNodesSelectionInfo = (): AnnotateNodeWithSelectionInfo[] => {
		if (!this.state.selection.isSet()) return [];

		const direction = this.getDirection();
		const startElement =
			direction === 'normal' ? this.state.selection.anchor! : this.state.selection.focus!;
		const endElement =
			direction === 'normal' ? this.state.selection.focus! : this.state.selection.anchor!;

		const anchorIndex = this.findNodeIndex(this.state.selection.anchor!.key);
		const focusIndex = this.findNodeIndex(this.state.selection.focus!.key);

		return [...this.state.nodes].map(([nodeKey, node], index) => {
			const isFirstRow = startElement.key === nodeKey;
			const isLastRow = endElement.key === nodeKey;

			return {
				...node,
				key: nodeKey,
				isFirstRow,
				isLastRow,
				isSelected: this.isNodeSelected(index, anchorIndex, focusIndex),
				offsetStart: isFirstRow ? startElement.offset : 0,
				offsetEnd: isLastRow ? endElement.offset : node.text?.length ?? 0,
			};
		});
	};

	private isNodeSelected = (nodeIndex: number, anchorIndex: number, focusIndex: number) => {
		if (nodeIndex === -1) return false;

		return isBetween(nodeIndex, anchorIndex, focusIndex);
	};

	private findNodeIndex = (key: string) =>
		[...this.state.nodes.keys()].findIndex((k) => k === key);

	private canDeleteSelectionRange = (): boolean =>
		this.state.selection.isSet() && this.state.selection.type === 'Range';
}
