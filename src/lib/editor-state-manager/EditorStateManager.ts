import { AnnotateNodeWithIndexInfo, AnnotateNodeWithSelectionInfo } from '../types';
import { isBetween, replaceText } from '../utils';
import { Direction, EditorState } from './types';

export class EditorStateManager {
	public state: EditorState;

	constructor(state: EditorState) {
		this.state = state;
	}

	public setSelection = (options: Parameters<typeof this.state.selection.set>[0]) =>
		this.state.selection.set(options);

	public replaceNodes = (newNodes: AnnotateNodeWithIndexInfo[]) => {
		newNodes.forEach((newNode) => {
			let node = this.findNode(newNode.key);

			if (!node) {
				this.state.nodes.splice(newNode.index, 0, newNode);

				return;
			}

			node.text = newNode.text;
			node.type = newNode.type;
		});
	};

	public getSelectedNodes = (): AnnotateNodeWithIndexInfo[] => {
		if (!this.state.selection.isSet()) return [];

		if (this.state.selection.type === 'Caret') {
			const anchorKey = this.state.selection.anchor!.key;
			const anchorNodeIndex = this.findNodeIndex(anchorKey);
			const anchorNode = this.state.nodes[anchorNodeIndex];

			if (!anchorNode) return [];

			return [{ ...anchorNode, index: anchorNodeIndex }];
		}

		const anchorIndex = this.findNodeIndex(this.state.selection.anchor!.key);
		const focusIndex = this.findNodeIndex(this.state.selection.focus!.key);

		return this.state.nodes
			.map((node, index) => ({
				...node,
				index,
			}))
			.filter((node) => this.isNodeSelected(node.index, anchorIndex, focusIndex));
	};

	public write = (text: string): boolean => {
		const anchor = this.state.selection.anchor;
		const focus = this.state.selection.focus;

		if (!anchor || !focus) return false;

		const anchorNode = this.findNode(anchor.key);
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
		const startNode = this.findNode(startNodeKey);
		const endNode = this.findNode(endNodeKey);

		if (!startNode || !endNode) return;

		if (endNode.type === 'text') {
			startNode.type = 'text';

			startNode.text = (startNode.text ?? '') + (endNode.text ?? '');
		}

		this.deleteNode(endNodeKey);
	};

	private deleteNode = (nodeKey: string) => {
		const index = this.findNodeIndex(nodeKey);
		this.state.nodes.splice(index, 1);
	};

	public deleteNodeText = (nodeKey: string, from: number, to: number): boolean => {
		const node = this.findNode(nodeKey);
		if (!node || !node.text) return false;

		node.text = replaceText(node.text, from, to, '');

		return true;
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

		return this.state.nodes.map((node, index) => {
			const isFirstRow = startElement.key === node.key;
			const isLastRow = endElement.key === node.key;

			return {
				...node,
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

		if (this.getDirection() === 'reverse') return isBetween(nodeIndex, focusIndex, anchorIndex);

		return isBetween(nodeIndex, anchorIndex, focusIndex);
	};

	private findNode = (key: string) => this.state.nodes.find((x) => x.key === key);

	private findNodeIndex = (key: string) => this.state.nodes.findIndex((x) => x.key === key);

	private canDeleteSelectionRange = (): boolean =>
		this.state.selection.isSet() && this.state.selection.type === 'Range';
}
