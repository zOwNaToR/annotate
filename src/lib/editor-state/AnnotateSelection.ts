import { SelectionElement, SelectionType, SetSelectionOptions } from './EditorState.types';

export class AnnotateSelection {
	public anchor: SelectionElement | null = null;
	public focus: SelectionElement | null = null;
	public type: SelectionType;

	constructor(options?: SetSelectionOptions) {
		this.type = 'Caret';

		if (options) this.set(options);
	}

	public set({ anchor, focus }: SetSelectionOptions) {
		this.type = anchor.key === focus.key && anchor.offset === focus.offset ? 'Caret' : 'Range';

		this.anchor = {
			key: anchor.key,
			offset: anchor.offset,
		};
		this.focus = {
			key: focus.key,
			offset: focus.offset,
		};
	}

	public isSet = (): boolean =>
		!!this.anchor &&
		!!this.focus &&
		typeof this.anchor.offset !== 'undefined' &&
		typeof this.focus.offset !== 'undefined';
}
