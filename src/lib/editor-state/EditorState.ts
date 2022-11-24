import { AnnotateSelection } from '../editor-state-manager/AnnotateSelection';
import { AnnotateNode, AnnotateNodeWithSelectionInfo } from '../types';
import { isBetween, replaceText } from '../utils';
import { Direction } from './types';

export class EditorState {
	public nodes: AnnotateNode[];
	public selection: AnnotateSelection;

	constructor(nodes: AnnotateNode[], selection: AnnotateSelection) {
		this.nodes = nodes;
		this.selection = selection;
	}

	public findNode = (key: string) => this.nodes.find((x) => x.key === key);

	public findNodeIndex = (key: string) => this.nodes.findIndex((x) => x.key === key);

	public canDeleteSelection = (): boolean =>
		this.selection.isSet() && this.selection.type === 'Range';

	public getSelectionDirection = (): Direction => {
		if (!this.selection.isSet()) return 'normal';

		const { anchor, focus } = this.selection;

		const anchorIndex = this.findNodeIndex(anchor!.key);
		const focusIndex = this.findNodeIndex(focus!.key);

		const isFocusBeforeAnchor =
			focusIndex < anchorIndex || (anchorIndex === focusIndex && focus!.offset < anchor!.offset);

		if (isFocusBeforeAnchor) return 'reverse';

		return 'normal';
	};

	public isNodeSelected = (nodeIndex: number, anchorIndex: number, focusIndex: number) => {
		if (nodeIndex === -1) return false;

		if (this.getSelectionDirection() === 'reverse') {
			return isBetween(nodeIndex, focusIndex, anchorIndex);
		}

		return isBetween(nodeIndex, anchorIndex, focusIndex);
	};

	public getNodesSelectionInfo = (): AnnotateNodeWithSelectionInfo[] => {
		if (!this.selection.isSet()) return [];

		const direction = this.getSelectionDirection();
		const startElement = direction === 'normal' ? this.selection.anchor! : this.selection.focus!;
		const endElement = direction === 'normal' ? this.selection.focus! : this.selection.anchor!;

		const anchorIndex = this.findNodeIndex(this.selection.anchor!.key);
		const focusIndex = this.findNodeIndex(this.selection.focus!.key);

		return this.nodes.map((node, index) => {
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

	public mergeNodes = (startNodeKey: string, endNodeKey: string) => {
		const startNode = this.findNode(startNodeKey);
		const endNode = this.findNode(endNodeKey);

		if (!startNode || !endNode) return;

		if (endNode.type === 'text') {
			startNode.type = 'text';

			startNode.text = (startNode.text ?? '') + (endNode.text ?? '');
		}

		this.deleteNode(endNodeKey);
	};

	public deleteNode = (nodeKey: string) => {
		const index = this.findNodeIndex(nodeKey);
		this.nodes.splice(index, 1);
	};

	public deleteNodeText = (nodeKey: string, from: number, to: number): boolean => {
		const node = this.findNode(nodeKey);
		if (!node || !node.text) return false;

		node.text = replaceText(node.text, from, to, '');

		return true;
	};
}
