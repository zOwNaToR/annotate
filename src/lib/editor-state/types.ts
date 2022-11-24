export type Direction = 'normal' | 'reverse';

export type SelectionType = 'Caret' | 'Range';

export type SelectionElement = {
	key: string;
	offset: number;
};

export type SetSelectionOptions = {
	anchor: SelectionElement;
	focus: SelectionElement;
};
